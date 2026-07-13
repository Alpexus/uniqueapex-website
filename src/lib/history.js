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
   Mirrors the ability maps in wheelConfig's CONTRIBUTIONS. */
const ORDERED = [
  { path: "communication.style", label: "Communication style", order: ["Non-Speaking", "Limited Verbal", "Verbal", "Fluent Verbal"] },
  { path: "communication.canExpressNeeds", label: "Expresses needs", order: ["Rarely", "Sometimes", "Consistently"] },
  { path: "dailyLiving.eating", label: "Eating", order: ["Not yet", "With support", "Independent"] },
  { path: "dailyLiving.dressing", label: "Dressing", order: ["Not yet", "With support", "Independent"] },
  { path: "dailyLiving.toileting", label: "Toileting", order: ["Not started", "In progress", "Fully trained"] },
  { path: "dailyLiving.sleep", label: "Sleep", order: ["Poor", "Variable", "Good"] },
  { path: "dailyLiving.safety", label: "Safety awareness", order: ["Limited", "Developing", "Strong"] },
  { path: "behaviour.peersInterest", label: "Interest in other children", order: ["No", "Sometimes", "Yes"] },
  { path: "behaviour.peersInteract", label: "Plays with peers", order: ["No", "Sometimes", "Yes"] },
  { path: "behaviour.followsInstructions", label: "Follows instructions", order: ["No", "Sometimes", "Yes"] },
];
const CHALLENGES = { meltdowns: "Meltdowns", emotional: "Emotional regulation", anxiety: "Anxiety", rigidity: "Rigidity around routines", aggression: "Aggression", selfInjury: "Self-injury", repetitive: "Repetitive behaviours", defiance: "Defiance", hyperactivity: "Hyperactivity", elopement: "Elopement" };
const SENSES = { auditory: "Sound", visual: "Sight", tactile: "Touch", oral: "Taste & mouth", smell: "Smell", movement: "Movement & balance", body: "Body awareness" };

/** Compare two passport data objects → grouped, parent-friendly changes. */
export function diffData(oldD, newD) {
  oldD = oldD || {}; newD = newD || {};
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
      const fromLbl = oN == null ? "not answered" : FREQ5[oN] || o;
      const toLbl = FREQ5[nN] || n;
      if (oN == null) { push(other, q.label, fromLbl, toLbl); return; }
      const better = SCALE_META[q.id] && SCALE_META[q.id].reverse ? nN < oN : nN > oN;
      push(better ? improved : flags, q.label, fromLbl, toLbl);
    });
  });

  /* ordered selects */
  ORDERED.forEach((f) => {
    const o = get(oldD, f.path), n = get(newD, f.path);
    if (o === n || blank(n)) return;
    if (blank(o)) { push(other, f.label, "not answered", n); return; }
    const oi = f.order.indexOf(o), ni = f.order.indexOf(n);
    if (oi === -1 || ni === -1) { push(other, f.label, o, n); return; }
    push(ni > oi ? improved : flags, f.label, o, n);
  });

  /* behaviour challenge frequencies (lower = better) */
  Object.keys(CHALLENGES).forEach((k) => {
    const o = get(oldD, "behaviour.challenges." + k), n = get(newD, "behaviour.challenges." + k);
    if (o === n || blank(n)) return;
    if (blank(o)) { push(CHFREQ.indexOf(n) >= 3 ? flags : other, CHALLENGES[k], "not noted", n); return; }
    const oi = CHFREQ.indexOf(o), ni = CHFREQ.indexOf(n);
    if (oi === -1 || ni === -1) { push(other, CHALLENGES[k], o, n); return; }
    push(ni < oi ? improved : flags, CHALLENGES[k], o, n);
  });

  /* sensory senses */
  Object.keys(SENSES).forEach((k) => {
    const o = get(oldD, "sensory." + k) || {}, n = get(newD, "sensory." + k) || {};
    if (!o.typical && n.typical && (o.signs && o.signs.length)) { push(improved, SENSES[k], "had sensitivities", "now comfortable"); return; }
    if (o.typical && !n.typical && n.signs && n.signs.length) { push(flags, SENSES[k], "comfortable", "new sensitivities noted"); return; }
    if (o.severity && n.severity && o.severity !== n.severity) {
      const oi = SEV.indexOf(o.severity), ni = SEV.indexOf(n.severity);
      if (oi > -1 && ni > -1) push(ni > oi ? improved : flags, SENSES[k] + " sensitivity", o.severity, n.severity);
    }
  });

  /* communication means + therapies + diagnoses — additions tell a story */
  const oMeans = get(oldD, "communication.means") || [], nMeans = get(newD, "communication.means") || [];
  nMeans.filter((m) => !oMeans.includes(m) && m !== "No primary means yet").forEach((m) => push(improved, "New way to communicate", "", m));
  const oTher = (oldD.therapy || []).map((t) => t && t.type).filter(Boolean);
  const nTher = (newD.therapy || []).map((t) => t && t.type).filter(Boolean);
  nTher.filter((t) => !oTher.includes(t)).forEach((t) => push(improved, "Joined the team", "", t));
  const oDx = get(oldD, "diagnosis.diagnoses") || [], nDx = get(newD, "diagnosis.diagnoses") || [];
  nDx.filter((d) => !oDx.includes(d)).forEach((d) => push(other, "Diagnosis recorded", "", d));

  return { improved, flags, other, total: improved.length + flags.length + other.length };
}
