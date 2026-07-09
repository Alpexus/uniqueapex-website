/* ============================================================================
   wheelScore.js — v3 FINAL (the scoring engine, under the name your pages import)
   Save as: src/lib/wheelScore.js
   ⚠ If you saved my earlier "scoreWheel.js" — DELETE it. The pages import
     from "wheelScore.js"; that name mismatch is why the wheel went invisible.
   Pairs with: src/config/wheelConfig.js and src/lib/wheelSvg.js (v3, unchanged).
   ----------------------------------------------------------------------------
   HOW IT WORKS, PLAINLY
   · Every CONTRIBUTIONS row in wheelConfig points at one saved passport
     answer and says how to read it (scorer `type`), which domain(s) it
     feeds, how much it counts (weight), and whether it is NEED or STRENGTH.
   · Scorers turn the raw answer into an ABILITY 0..1 (1 = strong /
     independent / typical). Unanswered → null, always.
   · Need score  = 100 × weighted average of (1 − ability), answered rows only.
   · Strength    = 100 × weighted average of strength rows, answered only.
   · Confidence  = answered weight ÷ total weight per domain+axis
     (≥75% High · ≥40% Medium · >0 Low · 0 No data).
   · A domain shows a score only with ≥2 answered rows and ≥1.5 weight —
     otherwise null → grey petal, never a fake number.
   ============================================================================ */
import {
  DOMAINS, CONTRIBUTIONS, SCALE_META, MIN_ITEMS, MIN_WEIGHT,
  scoreToBand, coverageToConfidence,
} from "../config/wheelConfig.js";

/* Pages import these from here — pass them straight through */
export { DOMAINS, HUES, scoreToBand, coverageToConfidence, NEED_BANDS, STRENGTH_BANDS } from "../config/wheelConfig.js";

/* ---------- utils ---------- */

function resolvePath(data, path) {
  var cur = data, parts = path.split(".");
  for (var i = 0; i < parts.length; i++) {
    if (cur == null) return undefined;
    cur = cur[parts[i]];
  }
  return cur;
}

function isBlank(v) { return v === undefined || v === null || v === ""; }

/* Parse ages like "18 months", "2 years", "2y", "14m", "1.5 yr" → months */
function parseMonths(txt) {
  if (isBlank(txt)) return null;
  var s = String(txt).toLowerCase().trim();
  var m = s.match(/([\d.,]+)\s*(m(o|onths?)?\b|y(r|rs|ears?)?\b)?/);
  if (!m || !m[1]) return null;
  var num = parseFloat(m[1].replace(",", "."));
  if (isNaN(num)) return null;
  var unit = m[2] || "";
  if (unit.charAt(0) === "y") return num * 12;
  if (unit.charAt(0) === "m") return num;
  return num <= 6 ? num * 12 : num; /* unitless: small = years, larger = months */
}

/* ---------- scorers: raw answer → ability 0..1, or null (unanswered) ------ */
const SCORERS = {

  /* 0–4 scale saved as "0".."4"; reverse-scored ids flip meaning */
  scale4: function (raw, row) {
    if (isBlank(raw)) return null;
    var n = Number(raw);
    if (isNaN(n)) return null;
    var ability = n / 4;
    var id = row.field.split(".").pop();
    if (SCALE_META[id] && SCALE_META[id].reverse) ability = 1 - ability;
    return ability;
  },

  /* strength evidence from the same scale: Often/Consistently shine;
     any answered value below that counts as 0 strength (not unanswered) */
  scaleStrength: function (raw, row) {
    if (isBlank(raw)) return null;
    var n = Number(raw);
    if (isNaN(n)) return null;
    var id = row.field.split(".").pop();
    if (SCALE_META[id] && SCALE_META[id].reverse) n = 4 - n;
    return Math.max(0, (n - 2) / 2); /* 3 → 0.5 · 4 → 1 · ≤2 → 0 */
  },

  /* explicit option→value lookup; options not in the map = unanswered */
  map: function (raw, row) {
    if (isBlank(raw)) return null;
    var v = row.map[raw];
    return typeof v === "number" ? v : null;
  },

  /* checklist where each ticked sign lowers ability; [] = answered "none" */
  countNeed: function (raw, row) {
    if (!Array.isArray(raw)) return null;
    var floor = typeof row.floor === "number" ? row.floor : 0;
    return Math.max(floor, 1 - raw.length * row.per);
  },

  /* sensory sense object {typical, signs[], severity} */
  sensorySev: function (raw) {
    if (!raw || typeof raw !== "object") return null;
    if (raw.typical) return 1;
    if (Array.isArray(raw.signs) && raw.signs.length) {
      var sev = { "Mild": 0.65, "Moderate": 0.4, "Significant": 0.15 }[raw.severity];
      return typeof sev === "number" ? sev : 0.5;
    }
    return null;
  },

  /* the strength twin: a typical sense is a genuine strength */
  typicalStrength: function (raw) {
    if (!raw || typeof raw !== "object") return null;
    if (raw.typical) return 1;
    if (Array.isArray(raw.signs) && raw.signs.length) return 0;
    return null;
  },

  /* communication.means: "No primary means yet" is the signal */
  hasNoMeans: function (raw) {
    if (!Array.isArray(raw) || raw.length === 0) return null;
    return raw.indexOf("No primary means yet") !== -1 ? 0.1 : 0.8;
  },

  /* free-text presence → fixed modest value */
  textPresence: function (raw, row) {
    if (isBlank(raw) || !String(raw).trim()) return null;
    return typeof row.value === "number" ? row.value : 0.6;
  },

  /* milestone age vs expected months; unparseable → unanswered */
  milestone: function (raw, row) {
    var months = parseMonths(raw);
    if (months == null || !row.expected) return null;
    var ratio = months / row.expected;
    if (ratio <= 1.1) return 1;
    if (ratio <= 1.5) return 0.7;
    if (ratio <= 2) return 0.4;
    return 0.2;
  },
};

/* ---------- the engine ---------- */

export function scoreWheel(data) {
  var acc = {};
  DOMAINS.forEach(function (d) {
    acc[d] = {
      need:     { sum: 0, w: 0, totalW: 0, answered: 0, total: 0 },
      strength: { sum: 0, w: 0, totalW: 0, answered: 0, total: 0 },
    };
  });

  CONTRIBUTIONS.forEach(function (row) {
    var scorer = SCORERS[row.type];
    if (!scorer) return;
    var ability = scorer(resolvePath(data, row.field), row);
    var axis = row.polarity === "strength" ? "strength" : "need";
    row.domains.forEach(function (m) {
      var a = acc[m.d] && acc[m.d][axis];
      if (!a) return;
      a.totalW += m.w;
      a.total += 1;
      if (ability !== null) {
        var value = axis === "need" ? 1 - ability : ability;
        a.sum += value * m.w;
        a.w += m.w;
        a.answered += 1;
      }
    });
  });

  var out = {};
  DOMAINS.forEach(function (d) {
    var need = acc[d].need, str = acc[d].strength;

    var score =
      need.answered >= MIN_ITEMS && need.w >= MIN_WEIGHT
        ? Math.round((need.sum / need.w) * 100)
        : null;
    var strength =
      str.answered >= MIN_ITEMS && str.w >= MIN_WEIGHT
        ? Math.round((str.sum / str.w) * 100)
        : null;

    var cov = need.totalW > 0 ? need.w / need.totalW : 0;
    var sCov = str.totalW > 0 ? str.w / str.totalW : 0;

    out[d] = {
      score: score,
      strength: strength,
      band: scoreToBand(score, "need"),
      strengthBand: scoreToBand(strength, "strength"),
      confidence: coverageToConfidence(cov),
      strengthConfidence: coverageToConfidence(sCov),
      coverage: Math.round(cov * 100) / 100,
      strengthCoverage: Math.round(sCov * 100) / 100,
      answered: need.answered, total: need.total,
      strengthAnswered: str.answered, strengthTotal: str.total,
    };
  });
  return out;
}

/* Compat bridge for callers of the old engine (e.g. ua-data.js):
   returns [{domain, support, n}] — support = needs score, n = answered rows. */
export function domainArray(data) {
  var scored = scoreWheel(data);
  return DOMAINS.map(function (d) {
    return { domain: d, support: scored[d].score, n: scored[d].answered };
  });
}

/* Completeness across the wheel: unique passport fields that feed it,
   and how many are answered. Used by the support-wheel warning banner. */
export function wheelCompleteness(data) {
  var seen = new Map();
  CONTRIBUTIONS.forEach(function (row) {
    var scorer = SCORERS[row.type];
    if (!scorer) return;
    var a = scorer(resolvePath(data, row.field), row);
    var prev = seen.get(row.field);
    seen.set(row.field, prev === true ? true : a !== null);
  });
  var answered = 0;
  seen.forEach(function (v) { if (v) answered++; });
  var total = seen.size;
  return { answered: answered, total: total, pct: total ? Math.round((answered / total) * 100) : 0 };
}

/* ---------- snapshots + display stability ---------- */

export function snapshotWheel(scored) {
  var snap = { at: new Date().toISOString(), domains: {} };
  DOMAINS.forEach(function (d) {
    snap.domains[d] = { score: scored[d].score, strength: scored[d].strength };
  });
  return snap;
}

export function applyHysteresis(scored, prevSnapshot, buffer) {
  if (!prevSnapshot) return scored;
  var b = typeof buffer === "number" ? buffer : 3;
  DOMAINS.forEach(function (d) {
    var cur = scored[d];
    var prev = prevSnapshot.domains && prevSnapshot.domains[d];
    if (!cur || !prev || cur.score == null || prev.score == null) return;
    var prevBand = scoreToBand(prev.score, "need");
    if (!prevBand || !cur.band || prevBand.key === cur.band.key) return;
    var boundary = cur.band.rings > prevBand.rings ? prevBand.max : cur.band.max;
    if (Math.abs(cur.score - boundary) <= b) cur.band = prevBand;
  });
  return scored;
}

/* ---------- config self-test ----------------------------------------------
   In the browser console on any child page:
     console.table(auditWheelConfig(passportData))                            */
export function auditWheelConfig(data) {
  return CONTRIBUTIONS.map(function (row) {
    var raw = resolvePath(data, row.field);
    var scorer = SCORERS[row.type];
    return {
      field: row.field,
      type: row.type,
      polarity: row.polarity,
      found: raw !== undefined,
      raw: Array.isArray(raw) ? "[" + raw.join(", ") + "]" :
           (raw && typeof raw === "object") ? JSON.stringify(raw) : String(raw),
      ability: scorer ? scorer(raw, row) : "no scorer",
    };
  });
}