/* ============================================================
   ua-data.js — dashboard data layer
   ------------------------------------------------------------
   One place for every read the dashboard needs. Supabase table
   and column names here come straight from your masterfile and
   are reliable. The only ASSUMPTIONS are the *internal* leaf
   names inside passport.data — those live in FIELD_MAP (now set
   to your real field names). Domain scoring is exact, via
   wheelScore.js (a verbatim port of your account engine).

   Used from a bundled <script> (not is:inline) so imports work:
     import * as UA from "../lib/ua-data.js";
   ============================================================ */

import { scoreWheel, domainArray } from "./wheelScore.js";

const SUPABASE_URL = "https://eghqufgiudxjkbsddtnx.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnaHF1ZmdpdWR4amtic2RkdG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzIyOTYsImV4cCI6MjA5NDk0ODI5Nn0.0aHDnCOny0DQlE1oEgxzC__k1GKbR-XNpoMGVlyQK2I";
// TODO: move both to import.meta.env (PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY).

// ---- session + authed fetch ------------------------------------
export function getSession() {
  try {
    const s = JSON.parse(localStorage.getItem("ua_session") || "null");
    return s && s.access_token ? s : null;
  } catch {
    return null;
  }
}

async function rest(path) {
  const s = getSession();
  if (!s) throw new Error("no session");
  const r = await fetch(SUPABASE_URL + "/rest/v1/" + path, {
    headers: { apikey: ANON, Authorization: "Bearer " + s.access_token },
  });
  if (!r.ok) throw new Error("rest " + r.status);
  return r.json();
}

// ================================================================
// FIELD_MAP — assumed leaf names inside passport.data.
// These are the ONLY guesses in this file. Adjust to match your
// real passport object (camelCase examples taken from your
// masterfile, e.g. communication.respondsToName, emo_anxious).
// ================================================================
const FIELD_MAP = {
  child: { first: "firstName", last: "lastName", dob: "dob", gender: "gender", city: "city", languages: "homeLanguages" },
  diagnosis: { status: "status", list: "diagnoses", year: "year", summary: "summary" },
  guardian: { name: "g1name", email: "g1email" }, // household.g1name / household.g1email
  strengths: { strengths: "strengths", interests: "interests", dislikes: "dislikes" },
};

// (Domain scoring now lives in wheelScore.js — exact engine.)

// ---- the 7 funding programs (from masterfile §15) --------------
export const FUNDING_PROGRAMS = [
  { key: "dtc",            name: "Disability Tax Credit",                       level: "Federal", note: "Gateway program", amount: 0 },
  { key: "cdb",            name: "Child Disability Benefit",                    level: "Federal", note: "Up to $3,411/yr",  amount: 3411 },
  { key: "rdsp",           name: "Registered Disability Savings Plan",          level: "Federal", note: "Grants up to $3,500/yr", amount: 3500 },
  { key: "qc_supplement",  name: "Supplement for Handicapped Children",         level: "Québec",  note: "$241/month",       amount: 2892 },
  { key: "qc_exceptional", name: "Supplement — Exceptional Care",               level: "Québec",  note: "Tier 1 ~$1,191/mo", amount: 14292 },
  { key: "qc_family_alloc",name: "Family Allowance",                            level: "Québec",  note: "Income-based",     amount: 0 },
  { key: "qc_family_supp", name: "Family Support Program",                      level: "Québec",  note: "Respite & childcare", amount: 0 },
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
  // returns [] gracefully if the table doesn't exist yet
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
    return await rest("funding_applications?select=program_key,status" + filter);
  } catch { return []; }
}

// ---- derived: hero identity ------------------------------------
export function childIdentity(data) {
  const c = (data && data[ "childProfile" ]) || {};
  const m = FIELD_MAP.child;
  const first = c[m.first] || "";
  const last = c[m.last] || "";
  const name = [first, last].filter(Boolean).join(" ") || "Your child";
  let age = null;
  const dob = c[m.dob];
  if (dob) {
    const d = new Date(dob);
    if (!isNaN(d)) age = Math.floor((Date.now() - d) / 31557600000);
  }
  const dx = (data && data.diagnosis) || {};
  const dxList = dx.diagnoses; // real field: array of diagnosis names
  const langs = c[m.languages];
  return {
    name, first, age,
    dx: Array.isArray(dxList) ? dxList.slice(0, 2).join(", ") + (dxList.length > 2 ? "…" : "") : (dxList || ""),
    dxYear: "",
    city: c[m.city] || "",
    languages: Array.isArray(langs) ? langs.join(" · ") : (langs || ""),
  };
}

// ---- derived: profile completion (exact 14 checks from your account page) -
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
// DOMAIN SNAPSHOT — now backed by the exact scoreWheel() engine.
// ================================================================
export function domainSnapshot(data) {
  const rows = domainArray(data); // [{domain, support, n}]
  const answered = rows.reduce((a, r) => a + (r.n || 0), 0);
  const conf = answered >= 30 ? "High" : answered >= 12 ? "Medium" : "Low";
  return { rows, confidence: conf, answered, exact: true };
}

export function levelFor(support) {
  if (support == null) return { cls: "mod", label: "Not enough data" };
  if (support <= 33) return { cls: "low", label: "Low support" };
  if (support <= 66) return { cls: "mod", label: "Moderate" };
  return { cls: "high", label: "High support" };
}

// ---- derived: rule-based insights (v1) -------------------------
export function insights(data, snapshot, comp, docCount) {
  data = data || {};
  const s = data.strengths || {};
  const strengthsText = s[FIELD_MAP.strengths.strengths];
  const strengths = [];
  if (Array.isArray(strengthsText)) strengths.push(...strengthsText.slice(0, 3));
  else if (strengthsText) strengths.push(strengthsText);

  // watch areas = highest-support domains we have data for
  const watch = (snapshot.rows || [])
    .filter((r) => r.support != null)
    .sort((a, b) => b.support - a.support)
    .slice(0, 3)
    .map((r) => r.domain);

  // next actions from real gaps
  const actions = [];
  if (comp.pct < 100) actions.push({ label: `Complete the ${comp.total - comp.done} remaining profile section${comp.total - comp.done === 1 ? "" : "s"}`, href: "/children" });
  if (!docCount) actions.push({ label: "Upload your child's latest report", href: "/documents" });
  actions.push({ label: "Review funding options for 2026", href: "/funding" });

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
  return isNaN(d) ? "" : d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}
export function relTime(iso) {
  const d = new Date(iso); if (isNaN(d)) return "";
  const days = Math.floor((Date.now() - d) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return days + " days ago";
  if (days < 14) return "1 week ago";
  return Math.floor(days / 7) + " weeks ago";
}
export const STATUS_PILL = {
  not_started: { cls: "new", label: "Not started" },
  started:     { cls: "wait", label: "Started" },
  submitted:   { cls: "wait", label: "Submitted" },
  approved:    { cls: "ok", label: "Approved" },
  denied:      { cls: "new", label: "Denied" },
};
