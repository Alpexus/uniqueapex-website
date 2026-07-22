/* ============================================================
   ua-data.js — dashboard data layer (V2: self-healing session)
   ------------------------------------------------------------
   One place for every read the app needs.

   V2 FIX — "the child disappeared": reads used the RAW stored
   access token. Supabase tokens expire after ~1 hour, so after
   a while every read silently failed and pages looked empty
   until something re-authenticated. Now every read:
     1. refreshes the token first when it's expired
     2. retries once on a 401 (force-refresh)
     3. tells the user what's happening via notify.js instead
        of silently showing an empty app
   Data is never "lost" — it was never gone.

   Used from a bundled <script>:
     import * as UA from "../lib/ua-data.js";
   ============================================================ */

import { scoreWheel, domainArray, scoreToBand } from "./wheelScore.js";
import { notify } from "./notify.js";
import { makeT, tpl, bandLabel, libLocale } from "./libI18n.js";
import DICT from "../i18n/lib-data.js";
const T = () => makeT(DICT);

const SUPABASE_URL = "https://eghqufgiudxjkbsddtnx.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnaHF1ZmdpdWR4amtic2RkdG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzIyOTYsImV4cCI6MjA5NDk0ODI5Nn0.0aHDnCOny0DQlE1oEgxzC__k1GKbR-XNpoMGVlyQK2I";
// TODO: move both to import.meta.env (PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY).

// ---- session + authed fetch (self-healing) ----------------------
export function getSession() {
  try {
    const s = JSON.parse(localStorage.getItem("ua_session") || "null");
    return s && s.access_token ? s : null;
  } catch {
    return null;
  }
}

const sessionLooksValid = (s) =>
  s && s.access_token && Math.floor(Date.now() / 1000) < (s.expires_at || 0) - 60;

export function authHeaders(t, json = true) {
  const h = { apikey: ANON, Authorization: "Bearer " + t };
  if (json) h["Content-Type"] = "application/json";
  return h;
}

let refreshing = null; /* de-dupe concurrent refreshes */
async function refreshSession(s) {
  if (!s || !s.refresh_token) return null;
  if (refreshing) return refreshing;
  refreshing = (async () => {
    try {
      const r = await fetch(SUPABASE_URL + "/auth/v1/token?grant_type=refresh_token", {
        method: "POST",
        headers: { apikey: ANON, "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: s.refresh_token }),
      });
      if (!r.ok) return null;
      const d = await r.json();
      d.expires_at = Math.floor(Date.now() / 1000) + (d.expires_in || 3600);
      localStorage.setItem("ua_session", JSON.stringify(d));
      notify("info", T()("toast_signedBack"));
      return d;
    } catch {
      return null;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

/** Always returns a usable session when one can exist — refreshing first if expired. */
export async function getValidSession() {
  let s = getSession();
  if (sessionLooksValid(s)) return s;
  const fresh = await refreshSession(s);
  return fresh || s;
}

let offlineToastAt = 0;
async function rest(path) {
  let s = await getValidSession();
  if (!s) throw new Error("no session");
  let r;
  try {
    r = await fetch(SUPABASE_URL + "/rest/v1/" + path, { headers: authHeaders(s.access_token) });
  } catch (e) {
    if (Date.now() - offlineToastAt > 8000) {
      offlineToastAt = Date.now();
      notify("warn", T()("toast_offline"));
    }
    throw e;
  }
  if (r.status === 401) {
    /* token was revoked/expired server-side — force one refresh + retry */
    const fresh = await refreshSession(getSession());
    if (fresh) {
      r = await fetch(SUPABASE_URL + "/rest/v1/" + path, { headers: authHeaders(fresh.access_token) });
    }
  }
  if (!r.ok) throw new Error("rest " + r.status);
  return r.json();
}

// ================================================================
// FIELD_MAP — leaf names inside passport.data.
// ================================================================
const FIELD_MAP = {
  child: { first: "firstName", last: "lastName", dob: "dob", gender: "gender", city: "city", languages: "homeLanguages" },
  diagnosis: { status: "status", list: "diagnoses", year: "year", summary: "summary" },
  guardian: { name: "g1name", email: "g1email" },
  strengths: { strengths: "strengths", interests: "interests", dislikes: "dislikes" },
};

// ---- the 7 funding programs (from masterfile §15) --------------
// `key` is canonical (stored in funding_applications.program_key) —
// name/note/level are DISPLAY ONLY, resolved from lib-data.js.
const _fp = T();
export const FUNDING_PROGRAMS = [
  { key: "dtc",            name: _fp("fp_dtc"),            level: _fp("level_federal"), note: _fp("fp_dtc_note"), amount: 0 },
  { key: "cdb",            name: _fp("fp_cdb"),            level: _fp("level_federal"), note: _fp("fp_cdb_note"),  amount: 3411 },
  { key: "rdsp",           name: _fp("fp_rdsp"),           level: _fp("level_federal"), note: _fp("fp_rdsp_note"), amount: 3500 },
  { key: "qc_supplement",  name: _fp("fp_qc_supplement"),  level: _fp("level_quebec"),  note: _fp("fp_qc_supplement_note"),       amount: 2892 },
  { key: "qc_exceptional", name: _fp("fp_qc_exceptional"), level: _fp("level_quebec"),  note: _fp("fp_qc_exceptional_note"), amount: 14292 },
  { key: "qc_family_alloc",name: _fp("fp_qc_family_alloc"),level: _fp("level_quebec"),  note: _fp("fp_qc_family_alloc_note"),     amount: 0 },
  { key: "qc_family_supp", name: _fp("fp_qc_family_supp"), level: _fp("level_quebec"),  note: _fp("fp_qc_family_supp_note"), amount: 0 },
];

// ---- reads -----------------------------------------------------
export async function getPassports() {
  return rest("passports?select=id,created_at,updated_at,data&order=created_at.asc");
}

export function pickActivePassport(rows) {
  if (!rows || !rows.length) return null;
  const active = localStorage.getItem("ua_active_child");
  return rows.find((r) => r.id === active) || rows[0];
}

export async function getRecentDocuments(passportId) {
  const filter = passportId ? "&passport_id=eq." + passportId : "";
  return rest("documents?select=id,file_name,file_type,created_at" + filter +
    "&order=created_at.desc&limit=3");
}

export async function getNextWorkshop() {
  const nowIso = new Date().toISOString();
  const rows = await rest(
    "workshops?select=id,title,starts_at,location_type,capacity&published=eq.true" +
    "&starts_at=gte." + nowIso + "&order=starts_at.asc&limit=1");
  return rows[0] || null;
}

export async function getActivity(passportId) {
  const filter = passportId ? "&child_id=eq." + passportId : "";
  try {
    return await rest("activity?select=type,label,created_at" + filter +
      "&order=created_at.desc&limit=6");
  } catch { return []; }
}

export async function getWaitlist() {
  const s = getSession();
  if (!s || !s.user || !s.user.email) return [];
  try {
    return await rest("waitlist?select=status,created_at,service_slp,service_ot,service_aba,service_other&email=eq." +
      encodeURIComponent(s.user.email) + "&order=created_at.desc");
  } catch { return []; }
}

export async function getFundingApplications(passportId) {
  const filter = passportId ? "&child_id=eq." + passportId : "";
  try {
    return await rest("funding_applications?select=id,program_key,status" + filter);
  } catch { return []; }
}

// ---- derived: hero identity ------------------------------------
export function childIdentity(data) {
  const c = (data && data["childProfile"]) || {};
  const m = FIELD_MAP.child;
  const first = c[m.first] || "";
  const last = c[m.last] || "";
  const name = [first, last].filter(Boolean).join(" ") || T()("yourChild");
  let age = null;
  const dob = c[m.dob];
  if (dob) {
    const d = new Date(dob);
    if (!isNaN(d)) age = Math.floor((Date.now() - d) / 31557600000);
  }
  const dx = (data && data.diagnosis) || {};
  const dxList = dx.diagnoses;
  const langs = c[m.languages];
  return {
    name, first, age,
    dx: Array.isArray(dxList) ? dxList.slice(0, 2).join(", ") + (dxList.length > 2 ? "…" : "") : (dxList || ""),
    dxYear: "",
    city: c[m.city] || "",
    languages: Array.isArray(langs) ? langs.join(" · ") : (langs || ""),
  };
}

// ---- derived: profile completion -------------------------------
export function completion(data) {
  const d = data || {};
  const s = d.sensory || {};
  const senses = ["auditory", "visual", "tactile", "oral", "smell", "movement", "body"];
  const sensoryFilled = senses.some((k) => { const o = s[k]; return o && (o.typical || (o.signs && o.signs.length)); });
  const ch = (d.behaviour && d.behaviour.challenges) || {};
  const behFilled = typeof ch === "object" && !Array.isArray(ch) && Object.values(ch).some((v) => v);
  const scalesFilled = d.scales && Object.keys(d.scales).length >= 6;
  const checks = [
    d.childProfile && d.childProfile.firstName && d.childProfile.dob,
    d.household && d.household.g1name && d.household.g1email,
    d.diagnosis && (d.diagnosis.status || (d.diagnosis.diagnoses && d.diagnosis.diagnoses.length)),
    d.birth && (d.birth.pregnancy || (d.birth.milestones && d.birth.milestones.firstWord)),
    d.communication && (d.communication.style || d.communication.canExpressNeeds),
    sensoryFilled,
    d.dailyLiving && (d.dailyLiving.eating || d.dailyLiving.dressing),
    d.health && (d.health.pediatrician || d.health.medicalConditions),
    behFilled,
    d.strengths && (d.strengths.strengths || d.strengths.interests),
    d.education && (d.education.schoolName || d.education.schoolType || d.education.hasIEP),
    d.therapy && d.therapy.length > 0,
    d.goals && (d.goals.mainConcerns || (d.goals.priorities && d.goals.priorities.length)),
    scalesFilled,
  ];
  const done = checks.filter(Boolean).length;
  return { done, total: 14, pct: Math.round((done / 14) * 100) };
}

// ================================================================
// DOMAIN SNAPSHOT — backed by the exact scoreWheel() engine.
// ================================================================
export function domainSnapshot(data) {
  const rows = domainArray(data);
  const answered = rows.reduce((a, r) => a + (r.n || 0), 0);
  const conf = answered >= 30 ? "High" : answered >= 12 ? "Medium" : "Low";
  return { rows, confidence: conf, answered, exact: true };
}

export function levelFor(support) {
  if (support == null) return { cls: "mod", label: T()("notEnoughData") };
  const b = scoreToBand(support);
  if (b.key === "minimal" || b.key === "low") return { cls: "low", label: bandLabel(b) };
  if (b.key === "high" || b.key === "intensive") return { cls: "high", label: bandLabel(b) };
  return { cls: "mod", label: bandLabel(b) };
}

// ---- derived: rule-based insights (v1) -------------------------
export function insights(data, snapshot, comp, docCount) {
  data = data || {};
  const s = data.strengths || {};
  const strengthsText = s[FIELD_MAP.strengths.strengths];
  const strengths = [];
  if (Array.isArray(strengthsText)) strengths.push(...strengthsText.slice(0, 3));
  else if (strengthsText) strengths.push(strengthsText);

  const watch = (snapshot.rows || [])
    .filter((r) => r.support != null)
    .sort((a, b) => b.support - a.support)
    .slice(0, 3)
    .map((r) => r.domain);

  const actions = [];
  const t = T(), remaining = comp.total - comp.done;
  if (comp.pct < 100) actions.push({ label: remaining === 1 ? t("act_completeOne") : tpl(t("act_completeMany"), { n: remaining }), href: "/children" });
  if (!docCount) actions.push({ label: t("act_upload"), href: "/documents" });
  actions.push({ label: t("act_funding"), href: "/funding" });

  return { strengths, watch, actions: actions.slice(0, 3) };
}

// ---- derived: funding overview ---------------------------------
export function fundingOverview(apps) {
  const byKey = {};
  (apps || []).forEach((a) => (byKey[a.program_key] = a.status));
  const rows = FUNDING_PROGRAMS.map((p) => ({
    ...p, status: byKey[p.key] || "not_started",
  }));
  const started = rows.filter((r) => r.status !== "not_started").length;
  const submitted = rows.filter((r) => r.status === "submitted" || r.status === "approved").length;
  const approvedAmount = rows
    .filter((r) => r.status === "approved")
    .reduce((a, r) => a + (r.amount || 0), 0);
  return { rows, total: FUNDING_PROGRAMS.length, started, submitted, approvedAmount };
}

// ---- small formatters ------------------------------------------
export function fmtDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? "" : d.toLocaleDateString(libLocale(), { month: "short", day: "numeric" });
}
export function relTime(iso) {
  const d = new Date(iso); if (isNaN(d)) return "";
  const t = T();
  const days = Math.floor((Date.now() - d) / 86400000);
  if (days <= 0) return t("rel_today");
  if (days === 1) return t("rel_yesterday");
  if (days < 7) return tpl(t("rel_days"), { n: days });
  if (days < 14) return t("rel_week1");
  return tpl(t("rel_weeks"), { n: Math.floor(days / 7) });
}
/* status KEYS are canonical (stored in funding_applications.status) — labels display only */
const _st = T();
export const STATUS_PILL = {
  not_started: { cls: "new", label: _st("st_not_started") },
  started:     { cls: "wait", label: _st("st_started") },
  submitted:   { cls: "wait", label: _st("st_submitted") },
  approved:    { cls: "ok", label: _st("st_approved") },
  denied:      { cls: "new", label: _st("st_denied") },
};
