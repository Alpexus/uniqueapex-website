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

import { makeT, tpl, dv, ofName } from "./libI18n.js";
import DICT from "../i18n/lib-recs.js";

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
  return (cp.firstName && String(cp.firstName).trim()) || makeT(DICT)("yourChild");
}

/**
 * @param {object|null} data  passport.data for the active child
 * @param {object} ctx        { documents:[{type,date}], appliedTaxCredit, fundingProgramsAvailable, onWaitlists, topUnmetNeed }
 * @returns {Array<{id,section,severity,title,reason,href,cta}>}
 */
export function getRecommendations(data, ctx = {}) {
  data = data || {};
  const t = makeT(DICT);
  const name = childFirstName(data);
  const nv = { name, of: ofName(name) };
  const recs = [];
  const add = (r) => recs.push(r);

  /* ---------- My Child: profile completeness ---------- */
  if (!filled(data.diagnosis)) {
    add({ id: "diagnosis", section: "child", severity: "todo",
      title: t("dx_title"),
      reason: t("dx_reason"),
      href: "/child", cta: t("dx_cta") });
  } else {
    add({ id: "diagnosis-done", section: "child", severity: "done",
      title: t("dxDone_title"), reason: "", href: "/child", cta: "" });
  }
  if (!filled(data.sensory)) {
    add({ id: "sensory", section: "child", severity: "todo",
      title: t("sens_title"),
      reason: tpl(t("sens_reason"), nv),
      href: "/child/support-wheel", cta: t("cont_cta") });
  }
  if (!filled(data.communication)) {
    add({ id: "communication", section: "child", severity: "todo",
      title: t("comm_title"),
      reason: t("comm_reason"),
      href: "/child/support-wheel", cta: t("cont_cta") });
  }
  if (!filled(data.strengths)) {
    add({ id: "strengths", section: "child", severity: "info",
      title: tpl(t("str_title"), nv),
      reason: t("str_reason"),
      href: "/child", cta: t("str_cta") });
  }

  /* ---------- Documents: recency ---------- */
  const docs = ctx.documents || [];
  const speech = docs.find((d) => /speech|orthophon/i.test(d.type || ""));
  const stale = speech && monthsAgo(speech.date) > 6;
  if (!speech || stale) {
    add({ id: "speech-doc", section: "documents", severity: "warn",
      title: t("doc_title"),
      reason: speech ? t("doc_reasonStale") : t("doc_reasonNone"),
      href: "/documents", cta: t("doc_cta") });
  }

  /* ---------- Funding ---------- */
  if (!ctx.appliedTaxCredit) {
    add({ id: "tax-credit", section: "funding", severity: "warn",
      title: t("tax_title"),
      reason: t("tax_reason"),
      href: "/funding/tax-credits", cta: t("tax_cta") });
  }
  const more = ctx.fundingProgramsAvailable ?? 4;
  if (more > 0) {
    add({ id: "funding-more", section: "funding", severity: "info",
      title: tpl(t(more === 1 ? "fundOne_title" : "fundMany_title"), { name, n: more }),
      reason: t("fund_reason"),
      href: "/funding", cta: t("fund_cta") });
  }

  /* ---------- Providers ---------- */
  if (!ctx.onWaitlists) {
    const need = ctx.topUnmetNeed ? dv(ctx.topUnmetNeed) : t("speechTherapy");
    add({ id: "waitlists", section: "providers", severity: "warn",
      title: t("wait_title"),
      reason: tpl(t("wait_reason"), { need }),
      href: "/providers/waitlists", cta: t("wait_cta") });
  }

  /* ---------- Resources (always relevant, low priority) ---------- */
  add({ id: "resources-relevant", section: "resources", severity: "info",
    title: tpl(t("res_title"), nv),
    reason: t("res_reason"),
    href: "/resources/guides", cta: t("res_cta") });

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
