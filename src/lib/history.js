/* ============================================================
   history.js — HISTORY-V1: the profile's living memory.
   ------------------------------------------------------------
   · ensureSnapshot(p, wheelSnap) — on any child-section visit,
     quietly saves a check-in row to passport_snapshots whenever
     the passport changed since the last one. Zero changes to
     passport.astro; degrades silently if the table isn't set up
     yet (run snapshots_setup.sql once).
   · getSnapshots(passportId) — check-ins, oldest → newest.
   · diffData(oldD, newD) — a parent-friendly change list between
     two passport versions: { improved, flags, other } where each
     entry is { label, from, to }. "Improved" is judged with the
     same value orderings the wheel scorers use — so celebrations
     and the wheel never disagree.
   ============================================================ */
import { SCALE_QUESTIONS, SCALE_META } from "../config/wheelConfig.js";
import { makeT, tpl, dv, scaleLabel, senseLabel } from "./libI18n.js";
import DICT from "../i18n/lib-history.js";

const UA_URL = "https://eghqufgiudxjkbsddtnx.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnaHF1ZmdpdWR4amtic2RkdG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzIyOTYsImV4cCI6MjA5NDk0ODI5Nn0.0aHDnCOny0DQlE1oEgxzC__k1GKbR-XNpoMGVlyQK2I";

function getSession() { try { return JSON.parse(localStorage.getItem("ua_session") || "null"); } catch { return null; } }
function isValid(s) { return s && s.access_token && Math.floor(Date.now() / 1000) < (s.expires_at || 0) - 60; }
function authHeaders(t) { return { apikey: ANON, Authorization: "Bearer " + t, "Content-Type": "application/json" }; }
async function getValidSession() {
  let s = getSession();
  if (isValid(s)) return s;
  if (s && s.refresh_token) {
    const r = await fetch(UA_URL + "/auth/v1/token?grant_type=refresh_token", { method: "POST", headers: { apikey: ANON, "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token: s.refresh_token }) });
    if (r.ok) { const d = await r.json(); d.expires_at = Math.floor(Date.now() / 1000) + (d.expires_in || 3600); localStorage.setItem("ua_session", JSON.stringify(d)); return d; }
  }
  return s && s.access_token ? s : null;
}

export async function getSnapshots(passportId) {
  const s = await getValidSession();
  if (!s || !passportId) return [];
  try {
    const r = await fetch(UA_URL + "/rest/v1/passport_snapshots?select=id,taken_at,passport_updated_at,data,wheel&passport_id=eq." + passportId + "&order=taken_at.asc&limit=48", { headers: authHeaders(s.access_token) });
    return r.ok ? r.json() : [];
  } catch { return []; }
}

/** Save a check-in if the passport changed since the last one.
    Returns { rows, created } — rows oldest → newest, including the new one. */
export async function ensureSnapshot(p, wheelSnap) {
  if (!p) return { rows: [], created: false };
  const rows = await getSnapshots(p.id);
  const last = rows.length ? rows[rows.length - 1] : null;
  const curStamp = p.updated_at || p.created_at || null;
  const changed = !last || (curStamp && new Date(curStamp).getTime() > new Date(last.passport_updated_at || 0).getTime());
  if (!changed) return { rows, created: false };
  const s = await getValidSession();
  if (!s) return { rows, created: false };
  try {
    const body = { user_id: s.user.id, passport_id: p.id, passport_updated_at: curStamp, data: p.data || {}, wheel: wheelSnap || {} };
    const r = await fetch(UA_URL + "/rest/v1/passport_snapshots", { method: "POST", headers: Object.assign({}, authHeaders(s.access_token), { Prefer: "return=representation" }), body: JSON.stringify(body) });
    if (r.ok) { const ins = await r.json(); if (ins && ins[0]) rows.push(ins[0]); return { rows, created: true }; }
  } catch { /* table not set up yet — history simply waits */ }
  return { rows, created: false };
}

/* ---------------- the diff engine ---------------- */
const FREQ5 = ["Never", "Rarely", "Sometimes", "Often", "Consistently"]; /* scales, saved "0".."4" */
const CHFREQ = ["Never", "Rarely", "Sometimes", "Often", "Daily"];       /* behaviour challenges */
const SEV = ["Significant", "Moderate", "Mild"];                          /* sensory severity (right = better) */

const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
const blank = (v) => v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length);

/* Ordered selects: earlier → later in the array = improvement.
   Mirrors the ability maps in wheelConfig's CONTRIBUTIONS.
   `order` values are canonical DB values — never translate them;
   labels + displayed values resolve via lib-history / lib-terms. */
const ORDERED = [
  { path: "communication.style", k: "oh_commStyle", order: ["Non-Speaking", "Limited Verbal", "Verbal", "Fluent Verbal"] },
  { path: "communication.canExpressNeeds", k: "oh_expressNeeds", order: ["Rarely", "Sometimes", "Consistently"] },
  { path: "dailyLiving.eating", k: "oh_eating", order: ["Not yet", "With support", "Independent"] },
  { path: "dailyLiving.dressing", k: "oh_dressing", order: ["Not yet", "With support", "Independent"] },
  { path: "dailyLiving.toileting", k: "oh_toileting", order: ["Not started", "In progress", "Fully trained"] },
  { path: "dailyLiving.sleep", k: "oh_sleep", order: ["Poor", "Variable", "Good"] },
  { path: "dailyLiving.safety", k: "oh_safety", order: ["Limited", "Developing", "Strong"] },
  { path: "behaviour.peersInterest", k: "oh_peersInterest", order: ["No", "Sometimes", "Yes"] },
  { path: "behaviour.peersInteract", k: "oh_peersInteract", order: ["No", "Sometimes", "Yes"] },
  { path: "behaviour.followsInstructions", k: "oh_follows", order: ["No", "Sometimes", "Yes"] },
];
const CHALLENGE_KEYS = ["meltdowns", "emotional", "anxiety", "rigidity", "aggression", "selfInjury", "repetitive", "defiance", "hyperactivity", "elopement"];
const SENSE_KEYS = ["auditory", "visual", "tactile", "oral", "smell", "movement", "body"];

/** Compare two passport data objects → grouped, parent-friendly changes. */
export function diffData(oldD, newD) {
  oldD = oldD || {}; newD = newD || {};
  const t = makeT(DICT);
  const improved = [], flags = [], other = [];
  const push = (arr, label, from, to) => { if (arr.length < 14) arr.push({ label, from: from == null ? "" : String(from), to: to == null ? "" : String(to) }); };

  /* 36 scale questions — the backbone */
  Object.keys(SCALE_QUESTIONS).forEach((g) => {
    SCALE_QUESTIONS[g].forEach((q) => {
      const o = get(oldD, "scales." + q.id), n = get(newD, "scales." + q.id);
      if (String(o ?? "") === String(n ?? "")) return;
      if (blank(n)) return;
      const oN = blank(o) ? null : Number(o), nN = Number(n);
      if (isNaN(nN)) return;
      const fromLbl = oN == null ? t("notAnswered") : dv(FREQ5[oN] || o);
      const toLbl = dv(FREQ5[nN] || n);
      if (oN == null) { push(other, scaleLabel(q), fromLbl, toLbl); return; }
      const better = SCALE_META[q.id] && SCALE_META[q.id].reverse ? nN < oN : nN > oN;
      push(better ? improved : flags, scaleLabel(q), fromLbl, toLbl);
    });
  });

  /* ordered selects */
  ORDERED.forEach((f) => {
    const o = get(oldD, f.path), n = get(newD, f.path);
    if (o === n || blank(n)) return;
    if (blank(o)) { push(other, t(f.k), t("notAnswered"), dv(n)); return; }
    const oi = f.order.indexOf(o), ni = f.order.indexOf(n);
    if (oi === -1 || ni === -1) { push(other, t(f.k), dv(o), dv(n)); return; }
    push(ni > oi ? improved : flags, t(f.k), dv(o), dv(n));
  });

  /* behaviour challenge frequencies (lower = better) */
  CHALLENGE_KEYS.forEach((k) => {
    const o = get(oldD, "behaviour.challenges." + k), n = get(newD, "behaviour.challenges." + k);
    if (o === n || blank(n)) return;
    if (blank(o)) { push(CHFREQ.indexOf(n) >= 3 ? flags : other, t("ch_" + k), t("notNoted"), dv(n)); return; }
    const oi = CHFREQ.indexOf(o), ni = CHFREQ.indexOf(n);
    if (oi === -1 || ni === -1) { push(other, t("ch_" + k), dv(o), dv(n)); return; }
    push(ni < oi ? improved : flags, t("ch_" + k), dv(o), dv(n));
  });

  /* sensory senses */
  SENSE_KEYS.forEach((k) => {
    const o = get(oldD, "sensory." + k) || {}, n = get(newD, "sensory." + k) || {};
    if (!o.typical && n.typical && (o.signs && o.signs.length)) { push(improved, senseLabel(k), t("hadSens"), t("nowComfortable")); return; }
    if (o.typical && !n.typical && n.signs && n.signs.length) { push(flags, senseLabel(k), t("comfortable"), t("newSens")); return; }
    if (o.severity && n.severity && o.severity !== n.severity) {
      const oi = SEV.indexOf(o.severity), ni = SEV.indexOf(n.severity);
      if (oi > -1 && ni > -1) push(ni > oi ? improved : flags, tpl(t("sensSuffix"), { sense: senseLabel(k) }), dv(o.severity), dv(n.severity));
    }
  });

  /* communication means + therapies + diagnoses — additions tell a story */
  const oMeans = get(oldD, "communication.means") || [], nMeans = get(newD, "communication.means") || [];
  nMeans.filter((m) => !oMeans.includes(m) && m !== "No primary means yet").forEach((m) => push(improved, t("newComm"), "", dv(m)));
  const oTher = (oldD.therapy || []).map((x) => x && x.type).filter(Boolean);
  const nTher = (newD.therapy || []).map((x) => x && x.type).filter(Boolean);
  nTher.filter((x) => !oTher.includes(x)).forEach((x) => push(improved, t("joinedTeam"), "", dv(x)));
  const oDx = get(oldD, "diagnosis.diagnoses") || [], nDx = get(newD, "diagnosis.diagnoses") || [];
  nDx.filter((d) => !oDx.includes(d)).forEach((d) => push(other, t("dxRecorded"), "", dv(d)));

  return { improved, flags, other, total: improved.length + flags.length + other.length };
}
