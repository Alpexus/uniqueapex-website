#!/usr/bin/env node
/* ============================================================
   i18n-export — catalog → translator sheet (CSV)
   ------------------------------------------------------------
   Reads every namespace in src/i18n/*.js and writes
   src/i18n/i18n-strings.csv with one row per string:

     id, en, fr, es

   · id = <namespace>.<key> (nested keys and arrays use dots:
     signup.langOpts.English, dashboard.sublines.0)
   · en is the SOURCE OF TRUTH and lives in code — the sheet
     shows it read-only for context.
   · Run after adding strings to any namespace:  node scripts/i18n-export.mjs
   · Hand the CSV (or the xlsx made from it) to a translator,
     then bring it back with scripts/i18n-import.mjs.
   ============================================================ */
import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const I18N = join(ROOT, "src", "i18n");
const OUT = join(I18N, "i18n-strings.csv");
const LANGS = ["en", "fr", "es"]; // add future languages here

function flatten(obj, prefix, out) {
  for (const [k, v] of Object.entries(obj || {})) {
    const id = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) v.forEach((item, i) => flatten({ [i]: item }, id, out));
    else if (v && typeof v === "object") flatten(v, id, out);
    else out.set(id, v == null ? "" : String(v));
  }
  return out;
}

const csvCell = (s) => {
  s = String(s ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const files = readdirSync(I18N).filter((f) => f.endsWith(".js")).sort();
const rows = [["id", ...LANGS]];
let total = 0, missing = { fr: 0, es: 0 };

for (const file of files) {
  const ns = file.replace(/\.js$/, "");
  const mod = (await import(pathToFileURL(join(I18N, file)).href)).default;
  const perLang = {};
  for (const lang of LANGS) perLang[lang] = flatten(mod[lang] || {}, "", new Map());
  // EN defines the key set and the order.
  for (const [key, en] of perLang.en) {
    const row = [`${ns}.${key}`, en];
    for (const lang of LANGS.slice(1)) {
      const v = perLang[lang].get(key) ?? "";
      if (!v) missing[lang]++;
      row.push(v);
    }
    rows.push(row);
    total++;
  }
  // keys that exist in a translation but not in EN = orphans worth knowing about
  for (const lang of LANGS.slice(1)) {
    for (const key of perLang[lang].keys()) {
      if (!perLang.en.has(key)) console.warn(`⚠ ${ns}.${key} exists in ${lang} but not in en (orphan)`);
    }
  }
}

writeFileSync(OUT, rows.map((r) => r.map(csvCell).join(",")).join("\n") + "\n", "utf8");
console.log(`✓ ${OUT}`);
console.log(`  ${total} strings across ${files.length} namespaces · missing fr: ${missing.fr} · missing es: ${missing.es}`);
