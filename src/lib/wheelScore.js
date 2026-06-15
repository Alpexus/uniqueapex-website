/* ============================================================
   wheelScore.js — wheel scoring engine
   ------------------------------------------------------------
   EXACT port of the engine from your original account page.
   Same scorers, same enum mappings, same output — so the
   dashboard wheel is identical to the one you already had.

   Reads your real wheelConfig.js directly (this is a bundled
   module, so imports work — no JSON injection needed).

   scoreWheel(data) → { DomainName: {score, ability, confidence, fields} }
     score      = support-need 0..100 (higher = more support)
     ability    = 0..1 (1 = strong/independent)
     confidence = 'high' (10+ fields) | 'medium' (5–9) | 'low' (<5) | 'none'
     fields     = answered contributions
   ============================================================ */
import { DOMAINS, CONTRIBUTIONS } from "../config/wheelConfig.js";

export { DOMAINS };

function parseAgeMonths(s) {
  if (s == null) return null;
  s = ("" + s).toLowerCase().trim();
  if (!s) return null;
  var num = parseFloat(s.replace(/[^0-9.]/g, " ").trim().split(/\s+/)[0]);
  if (isNaN(num)) return null;
  if (s.indexOf("year") > -1 || s.indexOf("yr") > -1) return num * 12;
  if (s.indexOf("month") > -1 || s.indexOf("mo") > -1) return num;
  return num <= 8 ? num * 12 : num;
}

// type → ability 0..1 | null  (verbatim from account.astro)
function applyScorer(type, param, v) {
  switch (type) {
    case "scale4": { if (v === "" || v == null) return null; var n = parseInt(v); return isNaN(n) ? null : Math.max(0, Math.min(1, n / 4)); }
    case "scale4rev": { if (v === "" || v == null) return null; var n2 = parseInt(v); return isNaN(n2) ? null : Math.max(0, Math.min(1, (4 - n2) / 4)); }
    case "ysnAble": { if (!v) return null; return v === "Yes" ? 1 : v === "Sometimes" ? 0.5 : v === "No" ? 0 : null; }
    case "freqChallenge": { if (!v) return null; return v === "Rarely" ? 0.75 : v === "Sometimes" ? 0.5 : v === "Often" ? 0.25 : v === "Daily" ? 0 : null; }
    case "commStyle": { if (!v) return null; return v === "Fluent Verbal" ? 0.9 : v === "Verbal" ? 0.65 : v === "Limited Verbal" ? 0.3 : v === "Non-Speaking" ? 0 : null; }
    case "expressNeeds": { if (!v) return null; return v === "Consistently" ? 1 : v === "Sometimes" ? 0.5 : v === "Rarely" ? 0 : null; }
    case "independence": { if (!v || v === "Not applicable") return null; return (v === "Independent" || v === "Fully trained") ? 1 : (v === "With support" || v === "In progress") ? 0.5 : (v === "Not yet" || v === "Not started") ? 0 : null; }
    case "quality": { if (!v) return null; return (v === "Good" || v === "Strong") ? 1 : (v === "Variable" || v === "Developing") ? 0.5 : (v === "Poor" || v === "Limited") ? 0 : null; }
    case "classroomSupport": { if (!v) return null; return v === "None" ? 1 : v === "Part-time aide" ? 0.5 : v === "Full-time aide" ? 0 : v === "Other" ? 0.5 : null; }
    case "feeding": { if (!v) return null; return v === "None" ? 1 : v === "Mild" ? 0.5 : v === "Significant" ? 0 : null; }
    case "sensorySev": {
      if (!v || typeof v !== "object") return null;
      if (v.typical) return 1;
      if (v.signs && v.signs.length) { var sev = v.severity; return sev === "Significant" ? 0.15 : sev === "Moderate" ? 0.4 : sev === "Mild" ? 0.66 : 0.5; }
      return null;
    }
    case "countNeed": { if (!Array.isArray(v) || v.length === 0) return null; return Math.max(0, 1 - Math.min(1, v.length / (param || 5))); }
    case "challengeCount": { if (!Array.isArray(v)) return null; if (v.length === 0) return 1; return Math.max(0, 1 - Math.min(1, v.length / (param || 5))); }
    case "hasNoMeans": { if (!Array.isArray(v)) return null; return v.indexOf("No primary means yet") > -1 ? 0 : null; }
    case "hasAny": { if (!Array.isArray(v)) return null; var hit = (param || []).some(function (x) { return v.indexOf(x) > -1; }); return hit ? 0.3 : null; }
    case "milestone": { var mm = parseAgeMonths(v); if (mm == null) return null; return Math.max(0, Math.min(1, 1 - ((mm - (param || 12)) / (param || 12)))); }
    default: return null;
  }
}

function getPath(d, path) {
  var parts = path.split("."), o = d;
  for (var i = 0; i < parts.length; i++) { if (o == null) return undefined; o = o[parts[i]]; }
  return o;
}

// returns { name: {score, ability, confidence, fields} }
export function scoreWheel(d) {
  d = d || {};
  var acc = {};
  DOMAINS.forEach(function (n) { acc[n] = { sum: 0, weight: 0, count: 0 }; });
  CONTRIBUTIONS.forEach(function (c) {
    var ability = applyScorer(c.type, c.param, getPath(d, c.field));
    if (ability === null || ability === undefined) return;
    var a = acc[c.domain];
    a.sum += ability * c.weight; a.weight += c.weight; a.count += 1;
  });
  var out = {};
  DOMAINS.forEach(function (n) {
    var a = acc[n];
    if (a.weight === 0) { out[n] = { score: null, ability: null, confidence: "none", fields: 0 }; return; }
    var ability = a.sum / a.weight;
    out[n] = {
      ability: ability,
      score: Math.round((1 - ability) * 100),
      confidence: a.count >= 10 ? "high" : a.count >= 5 ? "medium" : "low",
      fields: a.count,
    };
  });
  return out;
}

// wheel-contributing completeness (for the warning banner)
export function wheelCompleteness(d) {
  d = d || {};
  var answered = CONTRIBUTIONS.filter(function (c) {
    var v = getPath(d, c.field); return v !== null && v !== undefined && v !== "";
  }).length;
  return { answered, total: CONTRIBUTIONS.length, pct: Math.round((answered / CONTRIBUTIONS.length) * 100) };
}

// adapter for the dashboard's other consumers (insights, etc.)
export function domainArray(d) {
  var m = scoreWheel(d);
  return DOMAINS.map(function (n) { return { domain: n, support: m[n].score, n: m[n].fields }; });
}
