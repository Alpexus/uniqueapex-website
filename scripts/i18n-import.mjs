#!/usr/bin/env node
/* ============================================================
   i18n-import — translator sheet (CSV) → catalog
   ------------------------------------------------------------
   Reads src/i18n/i18n-strings.csv (the file i18n-export.mjs
   writes, possibly edited by a translator) and updates the
   translation blocks of each src/i18n/<namespace>.js file.

   Rules:
   · ENGLISH IS NEVER IMPORTED. en lives in code (pages carry it
     as the rendered default) — edits to the en column are
     ignored with a warning. Change English in the code, then
     re-export.
   · Only namespaces whose translations actually changed are
     rewritten (no churn). The file's top comment is preserved.
   · A language column that is entirely empty for a namespace is
     not written (so the es block only appears once Spanish
     translation starts).
   · Unknown ids warn and are skipped; ids missing from the CSV
     keep their current value.

   Usage:  node scripts/i18n-import.mjs        (then: pnpm build)
   ============================================================ */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const I18N = join(ROOT, "src", "i18n");
const CSV = join(I18N, "i18n-strings.csv");

/* ---------- tiny CSV parser (quotes, commas, newlines) ---------- */
function parseCSV(text) {
  const rows = [];
  let row = [], cell = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else inQ = false;
      } else cell += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

/* ---------- helpers to get/set nested keys ("a.b.0.c") ---------- */
function setPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextIsIndex = /^\d+$/.test(parts[i + 1]);
    if (!(key in cur)) cur[key] = nextIsIndex ? [] : {};
    cur = cur[key];
  }
  cur[parts[parts.length - 1]] = value;
}
function getPath(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/* ---------- serializer (stable, readable, valid JS) ---------- */
function ser(v, indent) {
  const pad = "  ".repeat(indent), pad1 = "  ".repeat(indent + 1);
  if (Array.isArray(v))
    return "[\n" + v.map((x) => pad1 + ser(x, indent + 1)).join(",\n") + ",\n" + pad + "]";
  if (v && typeof v === "object") {
    const body = Object.entries(v)
      .map(([k, x]) => `${pad1}${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${ser(x, indent + 1)}`)
      .join(",\n");
    return "{\n" + body + ",\n" + pad + "}";
  }
  return JSON.stringify(v ?? "");
}

/* ---------- load CSV ---------- */
const rows = parseCSV(readFileSync(CSV, "utf8"));
const header = rows.shift().map((h) => h.trim());
const LANGS = header.slice(1); // en, fr, es, …
if (header[0] !== "id" || LANGS[0] !== "en") {
  console.error(`✗ unexpected header: ${header.join(",")} (need: id,en,fr,…)`);
  process.exit(1);
}

const byNs = new Map();
for (const r of rows) {
  const id = (r[0] || "").trim();
  if (!id) continue;
  const dot = id.indexOf(".");
  const ns = id.slice(0, dot), key = id.slice(dot + 1);
  if (!byNs.has(ns)) byNs.set(ns, []);
  byNs.get(ns).push({ key, cells: r.slice(1) });
}

/* ---------- apply per namespace ---------- */
const files = new Set(readdirSync(I18N).filter((f) => f.endsWith(".js")).map((f) => f.replace(/\.js$/, "")));
let touched = 0, enEdits = 0, unknown = 0;

for (const [ns, entries] of byNs) {
  if (!files.has(ns)) { console.warn(`⚠ unknown namespace in CSV: ${ns}`); continue; }
  const path = join(I18N, ns + ".js");
  const mod = (await import(pathToFileURL(path).href + "?t=" + Math.random())).default;
  const next = structuredClone(mod);
  let changed = false;

  for (const { key, cells } of entries) {
    if (getPath(mod.en || {}, key) === undefined) { console.warn(`⚠ unknown id: ${ns}.${key}`); unknown++; continue; }
    if (String(cells[0] ?? "") !== String(getPath(mod.en, key) ?? "")) enEdits++;
    LANGS.slice(1).forEach((lang, li) => {
      const v = cells[li + 1] ?? "";
      if (v === "") return; // empty cell = not translated yet — keep/leave out
      if (!next[lang]) next[lang] = {};
      if (String(getPath(next[lang], key) ?? "") !== v) { setPath(next[lang], key, v); changed = true; }
    });
  }

  if (!changed) continue;
  const src = readFileSync(path, "utf8");
  const head = src.slice(0, src.indexOf("export default"));
  const ordered = { en: next.en };
  for (const lang of LANGS.slice(1)) {
    if (next[lang] && Object.keys(next[lang]).length) ordered[lang] = next[lang];
  }
  writeFileSync(path, head + "export default " + ser(ordered, 0) + ";\n", "utf8");
  console.log(`✓ updated src/i18n/${ns}.js`);
  touched++;
}

if (enEdits) console.warn(`⚠ ${enEdits} edited English cell(s) IGNORED — English is source of truth in code.`);
if (unknown) console.warn(`⚠ ${unknown} unknown id(s) skipped.`);
console.log(touched ? `Done — ${touched} namespace file(s) updated. Run: pnpm build` : "No translation changes found — nothing rewritten.");
