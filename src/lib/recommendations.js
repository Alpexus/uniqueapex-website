/* ============================================================
   recommendations.js — the "what should I do next" engine.
   ------------------------------------------------------------
   Pure, rules-based, no network and no ML. Give it the active
   child's passport `data` (and optional context about documents,
   funding and waitlists) and it returns a prioritised list of
   suggested next actions, each with a plain-language REASON.

   The same output drives:
     • the dashboard list  -> <AiPanel section="all" variant="board" />
     • per-section panels  -> <AiPanel section="funding" /> etc.

   Design notes:
     • Most rules fire when data is MISSING, so a brand-new family
       still gets a useful list (it never renders empty).
     • Every item states WHY. Severity drives ordering + the icon.
     • This is v1. Add/adjust rules here in one place.
   ============================================================ */

const RANK = { warn: 0, todo: 1, info: 2, done: 3 };

// True when a passport section has at least one meaningful value.
function filled(section) {
  if (!section) return false;
  if (Array.isArray(section)) return section.length > 0;
  if (typeof section === "object") {
    return Object.values(section).some((v) => {
      if (v == null) return false;
      if (typeof v === "string") return v.trim() !== "";
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === "object") return Object.keys(v).length > 0;
      return true;
    });
  }
  return Boolean(section);
}

export function childFirstName(data) {
  const cp = (data && data.childProfile) || {};
  return (cp.firstName && String(cp.firstName).trim()) || "your child";
}

/**
 * @param {object|null} data  passport.data for the active child
 * @param {object} ctx        { documents:[{type,date}], appliedTaxCredit, fundingProgramsAvailable, onWaitlists, topUnmetNeed }
 * @returns {Array<{id,section,severity,title,reason,href,cta}>}
 */
export function getRecommendations(data, ctx = {}) {
  data = data || {};
  const name = childFirstName(data);
  const recs = [];
  const add = (r) => recs.push(r);

  /* ---------- My Child: profile completeness ---------- */
  if (!filled(data.diagnosis)) {
    add({ id: "diagnosis", section: "child", severity: "todo",
      title: "Add the diagnosis details",
      reason: "It unlocks the funding programs and supports that depend on it.",
      href: "/child", cta: "Add details" });
  } else {
    add({ id: "diagnosis-done", section: "child", severity: "done",
      title: "Diagnosis recorded", reason: "", href: "/child", cta: "" });
  }
  if (!filled(data.sensory)) {
    add({ id: "sensory", section: "child", severity: "todo",
      title: "Complete the sensory profile",
      reason: `It sharpens ${name}'s Support Wheel and the provider matches.`,
      href: "/child/support-wheel", cta: "Continue profile" });
  }
  if (!filled(data.communication)) {
    add({ id: "communication", section: "child", severity: "todo",
      title: "Fill in the communication section",
      reason: "Therapists use it to tailor early goals.",
      href: "/child/development", cta: "Continue profile" });
  }
  if (!filled(data.strengths)) {
    add({ id: "strengths", section: "child", severity: "info",
      title: `Capture ${name}'s strengths and interests`,
      reason: "Strength-based notes make plans easier to follow.",
      href: "/child/strengths", cta: "Add strengths" });
  }

  /* ---------- Documents: recency ---------- */
  const docs = ctx.documents || [];
  const speech = docs.find((d) => /speech|orthophon/i.test(d.type || ""));
  const stale = speech && monthsAgo(speech.date) > 6;
  if (!speech || stale) {
    add({ id: "speech-doc", section: "documents", severity: "warn",
      title: "Upload the latest speech report",
      reason: speech ? "Your most recent one is over six months old." : "It improves recommendations and most funding reviews ask for it.",
      href: "/documents", cta: "Upload" });
  }

  /* ---------- Funding ---------- */
  if (!ctx.appliedTaxCredit) {
    add({ id: "tax-credit", section: "funding", severity: "warn",
      title: "Apply for the Québec disability tax credit",
      reason: "Most families with a diagnosis qualify, and it's often missed.",
      href: "/funding/tax-credits", cta: "Start application" });
  }
  const more = ctx.fundingProgramsAvailable ?? 4;
  if (more > 0) {
    add({ id: "funding-more", section: "funding", severity: "info",
      title: `${name} may qualify for ${more} more program${more === 1 ? "" : "s"}`,
      reason: "Based on age and diagnosis on file.",
      href: "/funding", cta: "See programs" });
  }

  /* ---------- Providers ---------- */
  if (!ctx.onWaitlists) {
    const need = ctx.topUnmetNeed || "Speech therapy";
    add({ id: "waitlists", section: "providers", severity: "warn",
      title: "Join provider waitlists",
      reason: `${need} is currently your highest unmet need, and waitlists are long.`,
      href: "/providers/waitlists", cta: "Find providers" });
  }

  /* ---------- Resources (always relevant, low priority) ---------- */
  add({ id: "resources-relevant", section: "resources", severity: "info",
    title: `Guides picked for ${name}`,
    reason: "Matched to the diagnosis and stage on file.",
    href: "/resources/guides", cta: "Browse guides" });

  recs.sort((a, b) => (RANK[a.severity] - RANK[b.severity]));
  return recs;
}

export function forSection(recs, section) {
  return (recs || []).filter((r) => r.section === section);
}

function monthsAgo(dateStr) {
  if (!dateStr) return Infinity;
  const d = new Date(dateStr);
  if (isNaN(+d)) return Infinity;
  return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 30.4);
}
