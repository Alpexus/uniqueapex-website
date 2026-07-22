# UniqueApex string catalog (`src/i18n/`)

## The translator sheet (game-localization style)

`i18n-strings.csv` / `i18n-strings.xlsx` in this folder are the flat view of
the whole catalog — **String ID | English | Français | Español** — the same
format game localization kits use. They are GENERATED; the `.js` files here
are the machine source.

- **Export** (after adding strings in code): `node scripts/i18n-export.mjs`
- **Edit** the Français / Español columns in the sheet (or hand it to a
  translator). **English edits are ignored** — English is the source of
  truth in code, because pages render it as the default.
- **Import** the edited CSV back: `node scripts/i18n-import.mjs` → `pnpm build`.
  Only namespaces with real changes are rewritten (top file comments are
  preserved; inline section comments inside the object are not).
- An empty Français/Español cell simply means "not translated yet" — the app
  falls back to English for that string, never breaks.
- The xlsx has a second sheet, **"Not yet migrated"**: every source of
  English the app still shows that isn't in the catalog yet (content
  libraries, untranslated pages), so "what's missing" is always visible.


Every piece of UI text in the app lives here as a **string code** — a readable
key like `pwTitle` or `bellCaughtUp` — with its translations side by side.
Pages never contain hard-coded UI text; they reference codes.

## Layout

One file per area of the app (a "namespace"):

```
src/i18n/
  shell.js       ← sidebar, header, bottom bar, help panel (every app page)
  settings.js    ← /settings
  dashboard.js   ← /account
  login.js       ← /login (family door)
  signin.js      ← /signin (chooser page)
  signup.js      ← /signup
  …one file per page as translation continues
```

Each file exports one object with a block per language:

```js
export default {
  en: { pwTitle: "Password", … },
  fr: { pwTitle: "Mot de passe", … },
};
```

## How pages use it

**App pages (language chosen at runtime by the user):** the page imports its
namespace and hands it to `window.uaI18n(DICT)` (defined by
`src/components/I18nBoot.astro`, included in the app layouts' `<head>`).
That returns the resolved dictionary `T` for the active language — missing
keys fall back to English automatically — and swaps any annotated markup:

- `data-i18n="code"` → element text
- `data-i18n-ph="code"` → placeholder
- `data-i18n-aria="code"` → aria-label
- `data-label-fr="…"` → element carries its own translation (used by SectionTabs)

Scripts use `T.code` directly for anything dynamic. **Rule:** never annotate
an element whose text a script fills with user data (names, emails) — the
script translates its own fallback via `T` instead.

- Inline scripts get the dictionary injected at build time:
  `<script is:inline define:vars={{ DICT }}>` … `var T = window.uaI18n(DICT);`
- Bundled module scripts just import it:
  `import DICT from "../i18n/dashboard.js"; const T = window.uaI18n(DICT);`

**Route-based pages (public site: `/signup` vs `/fr/signup`):** the page picks
its language at build time instead: `const t = DICT[lang]`.

Templates with values use `{name}`-style placeholders:
`T.savedNamed.replace("{name}", first)`.

## The user's language

Resolved by I18nBoot, most recent explicit choice first:
`localStorage.ua_lang` (login toggle / signup / settings) →
`localStorage.ua_pref_lang` → account metadata `lang` → `"en"`.
Settings → Preferences → Preferred language switches it app-wide.

## Adding a language (e.g. Spanish)

1. Add an `es: { … }` block to each file here (missing keys fall back to EN,
   so this can be done file by file).
2. Allow `"es"` in `I18nBoot.astro`'s `resolveLang()` and `uaLocale`.
3. Add the button to the language segment in `src/pages/settings.astro`
   (and the login-page toggle if wanted).
4. For SectionTabs, add `es:` labels in `src/config/sections.js` (they are
   emitted as `data-label-es`).

## Not (yet) in the catalog

- Public-site marketing components keep their original per-component
  `t = {en, fr}` dicts (route-based, working — migrate opportunistically).
- Content libraries (`recommendations.js`, `adviceLibrary.js`,
  `domainInsights.js`) and the wheel engine trio (`wheelScore.js`,
  `wheelConfig.js`, `wheelSvg.js` — untouchable) still produce English;
  translating them is its own pass.
- Emails sent by the `send-outreach` edge function (separate deploy).
