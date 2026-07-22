/* ============================================================
   journey.js — JOURNEY-V3: the autism-copilot roadmap engine
   (bilingual).
   ------------------------------------------------------------
   Every step carries PROVENANCE (`because`) — the literal
   passport answers that triggered it — so the roadmap visibly
   comes from THIS child, not a template. Next-up ordering is
   family-first: understanding and the care team always come
   before money and paperwork.

   buildJourney(data, scored, ctx) →
     { stages:[{key,title,blurb,steps,done,total}],
       nextUp:[step…], counts:{done,now,later}, currentStage }

   step = { id, title, why, because, cta, href, status, also? }
   status: "done" | "now" | "next" | "later"
   Scoring comes from the untouched wheel engine (scored =
   scoreWheel(data)) — this file only READS it.
   V3: all family-visible text lives in src/i18n/lib-journey.js
   (+ lib-terms.js for quoted stored values), resolved per
   window.uaLang at call time. Matcher values stay canonical.
   ============================================================ */
import { DOMAINS, scoreToBand } from "../config/wheelConfig.js";
import { makeT, tpl, dv, ofName, domainName, bandLabel } from "./libI18n.js";
import DICT from "../i18n/lib-journey.js";

const lc = (s) => String(s || "").toLowerCase();

function needBand(scored, domain) {
  const dm = scored && scored[domain];
  if (!dm || dm.score == null) return null;
  return scoreToBand(dm.score, "need");
}
const isHighFreq = (v) => v === "Often" || v === "Daily";

const stageMeta = (t) => [
  { key: "understand", title: t("stg_understand"), blurb: t("stg_understand_blurb") },
  { key: "team", title: t("stg_team"), blurb: t("stg_team_blurb") },
  { key: "support", title: t("stg_support"), blurb: t("stg_support_blurb") },
  { key: "thrive", title: t("stg_thrive"), blurb: t("stg_thrive_blurb") },
];
export const STAGE_META = stageMeta(makeT(DICT));

export function buildJourney(data, scored, ctx = {}) {
  data = data || {};
  scored = scored || {};
  const t = makeT(DICT);
  const first = ctx.firstName || t("yourChild");
  const nv = { name: first, of: ofName(first) };
  const pLink = ctx.passportLink || "/passport";
  const steps = { understand: [], team: [], support: [], thrive: [] };
  const add = (stage, s) => steps[stage].push(s);

  /* ---------------- 1 · UNDERSTANDING ---------------- */
  const comp = ctx.completion || { done: 0, total: 14, pct: 0 };
  add("understand", {
    id: "passport",
    title: comp.pct >= 80 ? t("p_titleGood") : tpl(t("p_titleTell"), nv),
    why: comp.pct >= 80 ? t("p_whyGood") : t("p_whyTell"),
    because: tpl(t("p_because"), { done: comp.done, total: comp.total }),
    cta: comp.pct >= 80 ? t("p_ctaGood") : t("p_ctaTell"),
    href: pLink,
    status: comp.pct >= 80 ? "done" : "now",
  });

  const dg = data.diagnosis || {};
  const dxList = Array.isArray(dg.diagnoses) ? dg.diagnoses.filter(Boolean) : [];
  const dxStatus = String(dg.status || "").toLowerCase();
  const hasDx = dxList.length > 0 || /diagnos/.test(dxStatus) && !/no |without|awaiting|suspect/.test(dxStatus);
  if (hasDx) {
    add("understand", {
      id: "diagnosis",
      title: t("dxd_title") + (dxList.length ? ": " + dxList.slice(0, 2).map((d) => dv(d)).join(", ") : ""),
      why: t("dxd_why"),
      because: dxList.length
        ? tpl(t("dxd_becauseList"), { list: dxList.map((d) => dv(d)).join(", ") })
        : tpl(t("dxd_becauseStatus"), { status: dv(dg.status || "diagnosed") }),
      cta: t("dxd_cta"), href: "/child/assessments", status: "done",
    });
  } else if (/progress|waitlist|referr|assess/.test(dxStatus)) {
    add("understand", {
      id: "diagnosis",
      title: t("dxp_title"),
      why: t("dxp_why"),
      because: tpl(t("dxp_because"), { status: dv(dg.status || "in progress") }),
      cta: t("dxp_cta"), href: "/resources/guides",
      also: { label: t("dxp_also"), href: "/providers" },
      status: "now",
    });
  } else {
    add("understand", {
      id: "diagnosis",
      title: t("dxs_title"),
      why: t("dxs_why"),
      because: dxStatus ? tpl(t("dxp_because"), { status: dv(dg.status) }) : t("dxs_becauseEmpty"),
      cta: t("dxp_cta"), href: "/resources/guides",
      also: { label: t("dxp_also"), href: "/providers" },
      status: "now",
    });
  }

  add("understand", {
    id: "reports",
    title: ctx.docsCount > 0 ? t("rp_titleSafe") : t("rp_titleUpload"),
    why: ctx.docsCount > 0 ? t("rp_whySafe") : t("rp_whyUpload"),
    because: ctx.docsCount > 0
      ? tpl(t(ctx.docsCount === 1 ? "rp_becauseOne" : "rp_becauseMany"), { n: ctx.docsCount })
      : t("rp_becauseEmpty"),
    cta: ctx.docsCount > 0 ? t("rp_ctaOpen") : t("rp_ctaUpload"),
    href: "/documents",
    status: ctx.docsCount > 0 ? "done" : "next",
  });

  /* ---------------- 2 · FINDING THE RIGHT HELP ---------------- */
  const therapyTypes = (data.therapy || []).filter((x) => x && x.type).map((x) => String(x.type));
  const therapies = therapyTypes.map(lc);
  const has = (re) => therapies.some((x) => re.test(x));
  const teamLine = therapyTypes.length
    ? tpl(t("tm_on"), { list: therapyTypes.map((x) => dv(x)).join(", ") })
    : t("tm_none");
  const becauseDomain = (domain, band, team) =>
    tpl(t("j_becauseDomain"), { domain: domainName(domain), band: lc(bandLabel(band)), team });
  const scoredCount = DOMAINS.filter((n) => scored[n] && scored[n].score != null).length;

  if (scoredCount < 3) {
    add("team", {
      id: "wheel-first",
      title: t("wf_title"),
      why: tpl(t("wf_why"), nv),
      because: tpl(t("wf_because"), { n: scoredCount }),
      cta: t("p_ctaTell"), href: pLink, status: "now",
    });
  } else {
    const commB = needBand(scored, "Communication");
    if (commB && commB.rings >= 3) {
      const doneSLP = has(/speech|slp|ortho|language/);
      add("team", {
        id: "slp",
        title: doneSLP ? t("slp_titleDone") : tpl(t("slp_titleCould"), nv),
        why: doneSLP ? t("slp_whyDone") : t("slp_whyCould"),
        because: becauseDomain("Communication", commB, doneSLP ? t("slp_teamOn") : t("slp_teamOff")),
        cta: doneSLP ? t("slp_ctaSee") : t("slp_ctaFind"), href: "/providers",
        also: doneSLP ? null : { label: t("slp_also"), href: "/resources/guides" },
        status: doneSLP ? "done" : (commB.rings >= 4 ? "now" : "next"),
      });
    }
    const senB = needBand(scored, "Sensory Processing"), dailyB = needBand(scored, "Daily Living Skills");
    const otB = (senB && senB.rings >= 3) ? senB : (dailyB && dailyB.rings >= 3 ? dailyB : null);
    if (otB) {
      const doneOT = has(/occupational|\bot\b|ergo/);
      const focusDomain = senB && senB.rings >= 3 ? "Sensory Processing" : "Daily Living Skills";
      const focus = focusDomain === "Sensory Processing" ? t("focus_sensory") : t("focus_daily");
      add("team", {
        id: "ot",
        title: doneOT ? t("ot_titleDone") : tpl(t("ot_titleCould"), { focus }),
        why: doneOT ? tpl(t("ot_whyDone"), { focus }) : t("ot_whyCould"),
        because: becauseDomain(focusDomain, otB, doneOT ? t("ot_teamOn") : t("ot_teamOff")),
        cta: doneOT ? t("slp_ctaSee") : t("ot_ctaFind"), href: "/providers",
        status: doneOT ? "done" : (otB.rings >= 4 ? "now" : "next"),
      });
    }
    const emoB = needBand(scored, "Emotional Regulation"), flexB = needBand(scored, "Flexibility & Transitions");
    const behB = (emoB && emoB.rings >= 4) ? emoB : (flexB && flexB.rings >= 4 ? flexB : null);
    if (behB) {
      const doneBeh = has(/behav|aba|psycho/);
      const behDomain = (emoB && emoB.rings >= 4) ? "Emotional Regulation" : "Flexibility & Transitions";
      add("team", {
        id: "behaviour",
        title: doneBeh ? t("bh_titleDone") : t("bh_titleCould"),
        why: doneBeh ? t("bh_whyDone") : t("bh_whyCould"),
        because: becauseDomain(behDomain, behB, doneBeh ? t("bh_teamOn") : t("bh_teamOff")),
        cta: doneBeh ? t("slp_ctaSee") : t("bh_ctaFind"), href: "/providers",
        status: doneBeh ? "done" : "next",
      });
    }
    if (!therapies.length && !ctx.onWaitlists) {
      add("team", {
        id: "start-one",
        title: t("so_title"),
        why: t("so_why"),
        because: teamLine,
        cta: t("so_cta"), href: "/providers", status: "next",
      });
    }
    add("team", {
      id: "waitlists",
      title: ctx.onWaitlists ? t("wl_titleOn") : t("wl_titleJoin"),
      why: ctx.onWaitlists ? t("wl_whyOn") : t("wl_whyJoin"),
      because: ctx.onWaitlists ? t("wl_becauseOn") : t("wl_becauseNone"),
      cta: ctx.onWaitlists ? t("wl_ctaCheck") : t("wl_ctaJoin"), href: "/providers/waitlists",
      status: ctx.onWaitlists ? "done" : "next",
    });
  }

  /* ---------------- 3 · MONEY & SCHOOL ---------------- */
  add("support", {
    id: "dtc",
    title: ctx.dtcStarted ? t("dtc_titleStarted") : t("dtc_titleApply"),
    why: ctx.dtcStarted ? t("dtc_whyStarted") : t("dtc_whyApply") + (hasDx ? "" : t("dtc_whyPrepare")),
    because: tpl(t("dtc_because"), {
      dx: hasDx ? t("dtc_becauseDx") : t("dtc_becauseNoDx"),
      st: ctx.dtcStarted ? t("dtc_started") : t("dtc_notStarted"),
    }),
    cta: ctx.dtcStarted ? t("dtc_ctaOpen") : t("dtc_ctaStart"), href: "/funding/tax-credits",
    status: ctx.dtcStarted ? "done" : (hasDx ? "now" : "next"),
  });
  add("support", {
    id: "programs",
    title: t("pg_title"),
    why: tpl(t("pg_why"), nv),
    because: tpl(t("pg_because"), { n: ctx.fundingStarted || 0 }),
    cta: t("pg_cta"), href: "/funding",
    status: (ctx.fundingStarted || 0) >= 2 ? "done" : (ctx.dtcStarted ? "next" : "later"),
  });
  const edu = data.education || {};
  if (edu.hasIEP === "Yes") {
    add("support", {
      id: "iep",
      title: t("iepd_title"),
      why: t("iepd_why"),
      because: t("iepd_because"),
      cta: t("iepd_cta"), href: "/resources/guides", status: "done",
    });
  } else if (edu.schoolName || edu.schoolType) {
    add("support", {
      id: "iep",
      title: t("ieps_title"),
      why: tpl(t("ieps_why"), nv),
      because: tpl(t("ieps_because"), {
        school: edu.schoolName || dv(edu.schoolType),
        status: edu.hasIEP ? dv(edu.hasIEP) : t("j_notSet"),
      }),
      cta: t("ieps_cta"), href: "/resources/guides", status: "next",
    });
  }
  const elope = data.behaviour && data.behaviour.challenges && data.behaviour.challenges.elopement;
  if (elope && elope !== "Never" && elope !== "") {
    add("support", {
      id: "safety",
      title: t("sf_title"),
      why: t("sf_why"),
      because: tpl(t("sf_because"), { v: dv(elope) }),
      cta: t("sf_cta"), href: "/resources/guides",
      status: isHighFreq(elope) || elope === "Sometimes" ? "now" : "next",
    });
  }

  /* ---------------- 4 · EVERYDAY LIFE ---------------- */
  const staleDays = ctx.daysSinceUpdate;
  const staleTxt = staleDays == null
    ? t("st_noDate")
    : staleDays >= 30
      ? tpl(t(Math.round(staleDays / 30) === 1 ? "st_month1" : "st_months"), { n: Math.round(staleDays / 30) })
      : tpl(t(staleDays === 1 ? "st_day1" : "st_days"), { n: staleDays });
  add("thrive", {
    id: "checkin",
    title: (staleDays != null && staleDays < 60) ? t("ck_titleFresh") : t("ck_titleDo"),
    why: (staleDays != null && staleDays < 60) ? t("ck_whyFresh") : t("ck_whyDo"),
    because: staleTxt,
    cta: (staleDays != null && staleDays < 60) ? t("ck_ctaOpen") : t("ck_ctaUpdate"), href: pLink,
    status: (staleDays != null && staleDays < 60) ? "done" : "now",
  });
  add("thrive", {
    id: "wins",
    title: (ctx.lastWinDays != null && ctx.lastWinDays <= 7) ? t("wn_titleLogged") : t("wn_titleLog"),
    why: (ctx.lastWinDays != null && ctx.lastWinDays <= 7) ? t("wn_whyLogged") : tpl(t("wn_whyLog"), nv),
    because: ctx.lastWinDays == null
      ? t("wn_becauseNone")
      : tpl(t(ctx.lastWinDays === 1 ? "wn_because1" : "wn_becauseDays"), { n: ctx.lastWinDays }),
    cta: t("wn_cta"),
    href: "/child/growth",
    status: (ctx.lastWinDays != null && ctx.lastWinDays <= 7) ? "done" : "next",
  });
  add("thrive", {
    id: "community",
    title: t("cm_title"),
    why: t("cm_why"),
    because: "",
    cta: t("cm_cta"), href: "/resources/workshops", status: "later",
  });

  /* ---------------- assemble (family-first ordering) ---------------- */
  const STATUS_ORDER = { now: 0, next: 1, later: 2, done: 3 };
  const STAGE_ORDER = { understand: 0, team: 1, support: 2, thrive: 3 };
  const stages = stageMeta(t).map((m) => {
    const list = steps[m.key];
    const done = list.filter((s) => s.status === "done").length;
    return { ...m, steps: list, done, total: list.length };
  });
  const flat = stages.flatMap((st) => st.steps.map((s) => ({ ...s, stage: st.key, stageTitle: st.title })));
  /* next-up: the child's needs first — stage order beats status,
     so understanding + the care team always lead, money follows */
  const nextUp = flat.filter((s) => s.status === "now" || s.status === "next")
    .sort((a, b) => (STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage]) || (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]))
    .slice(0, 4);
  const counts = {
    done: flat.filter((s) => s.status === "done").length,
    now: flat.filter((s) => s.status === "now").length,
    later: flat.filter((s) => s.status === "next" || s.status === "later").length,
  };
  let currentStage = "thrive";
  for (const st of stages) {
    if (st.steps.some((s) => s.status === "now" || s.status === "next")) { currentStage = st.key; break; }
  }
  return { stages, nextUp, counts, currentStage };
}
