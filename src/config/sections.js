// ============================================================
// UniqueApex — Information architecture: section navigation
// ------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for secondary (in-page) navigation.
// The sidebar stays fixed at 7 top-level items; everything else
// lives here as tabs inside the relevant section page.
//
// To add/rename/reorder a tab: edit ONLY this file.
// To add a whole new section: don't — keep the sidebar at 7.
// Put new capabilities inside an existing section as a tab,
// or surface them inline within a workflow.
// ============================================================

export const SECTIONS = {
  child: [
    { key: "overview",      label: "Overview",              href: "/child" },
    { key: "development",   label: "Development Profile",   href: "/child/development" },
    { key: "support-wheel", label: "Support Wheel",         href: "/child/support-wheel" },
    { key: "progress",      label: "Progress",              href: "/child/progress" },
    { key: "timeline",      label: "Timeline",              href: "/child/timeline" },
    { key: "assessments",   label: "Assessments",           href: "/child/assessments" },
    { key: "strengths",     label: "Strengths & Challenges",href: "/child/strengths" },
  ],
  documents: [
    { key: "vault",        label: "Vault",        href: "/documents" },
    { key: "ai-summaries", label: "AI Summaries", href: "/documents/ai-summaries" },
    { key: "reports",      label: "Reports",      href: "/documents/reports" },
    { key: "exports",      label: "Exports",      href: "/documents/exports" },
  ],
  funding: [
    { key: "opportunities", label: "Opportunities",   href: "/funding" },
    { key: "applications",  label: "Applications",    href: "/funding/applications" },
    { key: "tax-credits",   label: "Tax Credits",     href: "/funding/tax-credits" },
    { key: "benefits",      label: "Benefits",        href: "/funding/benefits" },
    { key: "history",       label: "Funding History", href: "/funding/history" },
  ],
  providers: [
    { key: "matches",      label: "Matches",     href: "/providers" },
    { key: "applications", label: "Applications",href: "/providers/applications" },
    { key: "waitlists",    label: "Waitlists",   href: "/providers/waitlists" },
    { key: "contacts",     label: "Contacts",    href: "/providers/contacts" },
    { key: "notes",        label: "Notes",       href: "/providers/notes" },
  ],
  resources: [
    { key: "workshops", label: "Workshops",           href: "/resources/workshops" },
    { key: "guides",    label: "Guides",              href: "/resources/guides" },
    { key: "articles",  label: "Articles",            href: "/resources/articles" },
    { key: "videos",    label: "Videos",              href: "/resources/videos" },
    { key: "community", label: "Community Resources", href: "/resources/community" },
  ],
  settings: [
    { key: "account",       label: "Account",        href: "/settings" },
    { key: "notifications", label: "Notifications",  href: "/settings/notifications" },
    { key: "privacy",       label: "Privacy & Data", href: "/settings/privacy" },
    { key: "subscription",  label: "Subscription",   href: "/settings/subscription" },
  ],
};

// Optional third level — rendered INSIDE a tab's page body, never in the sidebar
// or the tab bar. (Settings was flattened to 4 areas per spec; export/delete now
// live as sections inside Privacy & Data, so there are no settings subsections.)
export const SUBSECTIONS = {};
