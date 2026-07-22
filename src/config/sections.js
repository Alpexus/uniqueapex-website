// ============================================================
// UniqueApex — Information architecture: section navigation
// ------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for secondary (in-page) navigation.
// The sidebar stays fixed at 7 top-level items; everything else
// lives here as tabs inside the relevant section page.
//
// To add/rename/reorder a tab: edit ONLY this file.
// To add a whole new section: don't — keep the sidebar at 7.
//
// i18n: `label` is English (the rendered default); `fr` is the
// French label, emitted as data-label-fr and swapped client-side
// by I18nBoot when the user's language is French. A future
// language = one more key here (e.g. `es`) + the same attribute
// pattern in SectionTabs.
// ============================================================

export const SECTIONS = {
  // CHILD-IA-V2: consolidated from 7 tabs to 5 with distinct jobs.
  //  · Overview — who the child is + what needs attention now
  //  · Journey  — the copilot roadmap (next steps with reasons) + story so far
  //  · Support Wheel — the deep-dive instrument (scoring engine unchanged)
  //  · Growth   — check-in history: then vs now, what changed, wins, milestones
  //  · Records  — assessment records + recommendations hub
  // Old routes (/child/development, /child/strengths, /child/progress,
  // /child/timeline) now redirect into the new structure.
  child: [
    { key: "overview",      label: "Overview",      fr: "Aperçu",          href: "/child" },
    { key: "journey",       label: "Journey",       fr: "Parcours",        href: "/child/journey" },
    { key: "support-wheel", label: "Support Wheel", fr: "Roue de soutien", href: "/child/support-wheel" },
    { key: "growth",        label: "Growth",        fr: "Évolution",       href: "/child/growth" },
    { key: "assessments",   label: "Records",       fr: "Dossiers",        href: "/child/assessments" },
  ],
  documents: [
    { key: "vault",        label: "Vault",        fr: "Coffre",       href: "/documents" },
    { key: "ai-summaries", label: "AI Summaries", fr: "Résumés IA",   href: "/documents/ai-summaries" },
    { key: "reports",      label: "Reports",      fr: "Rapports",     href: "/documents/reports" },
    { key: "exports",      label: "Exports",      fr: "Exportations", href: "/documents/exports" },
  ],
  funding: [
    { key: "opportunities", label: "Opportunities",   fr: "Programmes",                href: "/funding" },
    { key: "applications",  label: "Applications",    fr: "Demandes",                  href: "/funding/applications" },
    { key: "tax-credits",   label: "Tax Credits",     fr: "Crédits d'impôt",           href: "/funding/tax-credits" },
    { key: "benefits",      label: "Benefits",        fr: "Prestations",               href: "/funding/benefits" },
    { key: "history",       label: "Funding History", fr: "Historique de financement", href: "/funding/history" },
  ],
  providers: [
    { key: "matches",      label: "Matches",     fr: "Jumelages",       href: "/providers" },
    { key: "applications", label: "Applications",fr: "Démarches",       href: "/providers/applications" },
    { key: "waitlists",    label: "Waitlists",   fr: "Listes d'attente",href: "/providers/waitlists" },
    { key: "contacts",     label: "Contacts",    fr: "Contacts",        href: "/providers/contacts" },
    { key: "notes",        label: "Notes",       fr: "Notes",           href: "/providers/notes" },
  ],
  // RESOURCES-IA-V2: Guides + Articles + Videos merged into one "Learn"
  // library (format splits confuse parents — they search by problem).
  // Old routes /resources/guides, /articles, /videos redirect to /learn.
  resources: [
    { key: "hub",       label: "Overview",            fr: "Aperçu",                    href: "/resources" },
    { key: "learn",     label: "Learn",               fr: "Apprendre",                 href: "/resources/learn" },
    { key: "workshops", label: "Workshops",           fr: "Ateliers",                  href: "/resources/workshops" },
    { key: "community", label: "Community Resources", fr: "Ressources communautaires", href: "/resources/community" },
  ],
  settings: [
    { key: "account",       label: "Account",        fr: "Compte",                     href: "/settings" },
    { key: "notifications", label: "Notifications",  fr: "Notifications",              href: "/settings/notifications" },
    { key: "privacy",       label: "Privacy & Data", fr: "Confidentialité et données", href: "/settings/privacy" },
    { key: "subscription",  label: "Subscription",   fr: "Abonnement",                 href: "/settings/subscription" },
  ],
};

// Optional third level — rendered INSIDE a tab's page body, never in the sidebar
// or the tab bar.
export const SUBSECTIONS = {};
