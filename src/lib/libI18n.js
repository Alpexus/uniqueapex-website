/* ============================================================
   libI18n.js — runtime language resolution for the content
   libraries (journey, insights, advice, recommendations,
   ua-data, history, familyReport).
   ------------------------------------------------------------
   · Language comes from window.uaLang (set by I18nBoot in every
     app layout <head>, always before module scripts run). On the
     server / with no window it is "en", so build output and EN
     sessions are byte-identical to the pre-i18n behaviour.
   · makeT(DICT) resolves a namespace at CALL time with per-key
     fallback to English — an empty FR cell can never break a page.
   · dv(value) translates a canonical DB VALUE for display only
     (option values stay English in Supabase — see lib-terms.js).
   · domainName/Short/Low, bandLabel, senseLabel, scaleLabel are
     the display-name layer over the FROZEN wheel engine — the
     engine files are never touched, and when the language is EN
     every function returns the frozen original unchanged.
   ============================================================ */
import TERMS from "../i18n/lib-terms.js";

export const libLang = () => (typeof window !== "undefined" && window.uaLang) || "en";
export const libLocale = () => (typeof window !== "undefined" && window.uaLocale) || "en-CA";

/** Resolve a namespace dict for the active language, EN fallback per key. */
export function makeT(DICT) {
  const lang = libLang();
  const en = DICT.en || {};
  const loc = (lang !== "en" && DICT[lang]) || null;
  const t = (k) => {
    const v = loc && loc[k];
    return v == null || v === "" ? (en[k] == null ? k : en[k]) : v;
  };
  t.lang = lang;
  return t;
}

/** "{name} is {n}" style templates. Missing vars are left visible. */
export const tpl = (s, vars) =>
  String(s ?? "").replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] != null ? String(vars[k]) : m));

/* ---- canonical VALUE → display (reverse lookup on lib-terms) ---- */
let _revLang = null, _rev = null;
function rev() {
  const lang = libLang();
  if (_rev && _revLang === lang) return _rev;
  _revLang = lang;
  _rev = new Map();
  const loc = lang !== "en" && TERMS[lang];
  if (loc) for (const [k, v] of Object.entries(TERMS.en)) { if (loc[k]) _rev.set(v, loc[k]); }
  return _rev;
}
/** Display a stored option value ("With support" → "Avec soutien"). Unknown values pass through. */
export const dv = (v) => {
  if (v == null || v === "") return v;
  const f = rev().get(String(v));
  return f == null ? v : f;
};

/* ---- display-name layer over the frozen wheel engine ---- */
const DKEY = {
  "Communication": "comm", "Social Connection": "social", "Sensory Processing": "sensory",
  "Flexibility & Transitions": "flex", "Emotional Regulation": "emotional",
  "Executive Function": "exec", "Daily Living Skills": "daily", "Learning & Play": "learning",
};
const term = (k, fallback) => {
  const lang = libLang();
  const loc = lang !== "en" && TERMS[lang];
  return (loc && loc[k]) || (TERMS.en[k] != null ? TERMS.en[k] : fallback);
};
export const domainName  = (n) => (DKEY[n] ? term("d_"  + DKEY[n], n) : n);
export const domainShort = (n) => (DKEY[n] ? term("ds_" + DKEY[n], n) : n);
export const domainLow   = (n) => (DKEY[n] ? term("dl_" + DKEY[n], n) : n); /* in-sentence form */
export const bandLabel = (band, axis) =>
  (band ? term((axis === "strength" ? "sband_" : "band_") + band.key, band.label) : "");
export const senseLabel = (k) => term("sense_" + k, k);
export const scaleLabel = (q) => (q && q.id ? term("sq_" + q.id, q.label) : ((q && q.label) || ""));

/* ---- natural-language list join: en "a, b, and c" · fr "a, b et c" ---- */
export function joinList(arr) {
  arr = (arr || []).filter(Boolean).map(String);
  if (!arr.length) return "";
  if (arr.length === 1) return arr[0];
  if (libLang() === "fr") return arr.slice(0, -1).join(", ") + " et " + arr[arr.length - 1];
  if (arr.length === 2) return arr[0] + " and " + arr[1];
  return arr.slice(0, -1).join(", ") + ", and " + arr[arr.length - 1];
}

/* ---- French possessive prefix (the catalog's {of}{name} pattern) ----
   fr: "de Maya" / "d'Émile" — en: "" (EN templates carry {name}'s). */
export const ofName = (name) =>
  (libLang() === "fr"
    ? (/^[aeiouyàâäéèêëíîïóôöùûüh]/i.test(String(name || "").trim()) ? "d'" : "de ")
    : "");
