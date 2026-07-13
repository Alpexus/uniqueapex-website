/* ============================================================
   journey.js — JOURNEY-V2: the autism-copilot roadmap engine.
   ------------------------------------------------------------
   Every step now carries PROVENANCE (`because`) — the literal
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
   ============================================================ */
import { DOMAINS, scoreToBand } from "../config/wheelConfig.js";

const lc = (s) => String(s || "").toLowerCase();

function needBand(scored, domain) {
  const dm = scored && scored[domain];
  if (!dm || dm.score == null) return null;
  return scoreToBand(dm.score, "need");
}
const isHighFreq = (v) => v === "Often" || v === "Daily";

export const STAGE_META = [
  { key: "understand", title: "Understanding your child", blurb: "The passport, a diagnosis, and the paper trail — the picture everything else is built on." },
  { key: "team", title: "Finding the right help", blurb: "Matching professionals to the exact areas where the wheel says support helps most." },
  { key: "support", title: "Money & school", blurb: "Funding and school accommodations — the safety net around the work. It can wait a beat, but don't skip it." },
  { key: "thrive", title: "Everyday life", blurb: "Keeping the profile alive, celebrating wins, and finding your people." },
];

export function buildJourney(data, scored, ctx = {}) {
  data = data || {};
  scored = scored || {};
  const first = ctx.firstName || "your child";
  const pLink = ctx.passportLink || "/passport";
  const steps = { understand: [], team: [], support: [], thrive: [] };
  const add = (stage, s) => steps[stage].push(s);

  /* ---------------- 1 · UNDERSTANDING ---------------- */
  const comp = ctx.completion || { done: 0, total: 14, pct: 0 };
  add("understand", {
    id: "passport",
    title: comp.pct >= 80 ? "The passport is in great shape" : "Tell us more about " + first,
    why: comp.pct >= 80
      ? "Every recommendation on this page is built from it — keep it close."
      : "Every answer sharpens the wheel, the provider matches, and this very path. Ten minutes here pays off everywhere.",
    because: comp.done + " of " + comp.total + " passport sections filled",
    cta: comp.pct >= 80 ? "Review the passport" : "Continue the passport",
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
      title: "Diagnosis on file" + (dxList.length ? ": " + dxList.slice(0, 2).join(", ") : ""),
      why: "It anchors funding applications, school plans, and provider intakes — keep the report safe in the vault.",
      because: dxList.length ? 'you recorded "' + dxList.join(", ") + '"' : 'diagnosis status: "' + (dg.status || "diagnosed") + '"',
      cta: "See the records", href: "/child/assessments", status: "done",
    });
  } else if (/progress|waitlist|referr|assess/.test(dxStatus)) {
    add("understand", {
      id: "diagnosis",
      title: "Keep the assessment moving",
      why: "Ask to be on the cancellation list, and gather daycare or school observations while you wait — they make the appointment count double.",
      because: 'you answered "' + (dg.status || "in progress") + '" for diagnosis status',
      cta: "Read the diagnosis guide", href: "/resources/guides",
      also: { label: "Find assessment professionals", href: "/providers" },
      status: "now",
    });
  } else {
    add("understand", {
      id: "diagnosis",
      title: "Start the diagnosis conversation",
      why: "A formal assessment opens most doors in Québec — school support, many services, and later the funding programs. Your pediatrician or CLSC is the usual first referral, and the guide walks you through it.",
      because: dxStatus ? 'you answered "' + dg.status + '" for diagnosis status' : "the diagnosis section is empty so far",
      cta: "Read the diagnosis guide", href: "/resources/guides",
      also: { label: "Find assessment professionals", href: "/providers" },
      status: "now",
    });
  }

  add("understand", {
    id: "reports",
    title: ctx.docsCount > 0 ? "Reports are safe in the vault" : "Upload any reports you already have",
    why: ctx.docsCount > 0
      ? "Stored once, shared many times — every new professional will thank you."
      : "Old evaluations, daycare notes, referral letters — professionals ask for these again and again. One upload, never lost.",
    because: ctx.docsCount > 0 ? ctx.docsCount + " document" + (ctx.docsCount === 1 ? "" : "s") + " in the vault" : "the document vault is empty",
    cta: ctx.docsCount > 0 ? "Open the vault" : "Upload a report",
    href: "/documents",
    status: ctx.docsCount > 0 ? "done" : "next",
  });

  /* ---------------- 2 · FINDING THE RIGHT HELP ---------------- */
  const therapyTypes = (data.therapy || []).filter((t) => t && t.type).map((t) => String(t.type));
  const therapies = therapyTypes.map(lc);
  const has = (re) => therapies.some((t) => re.test(t));
  const teamLine = therapyTypes.length ? "on the team: " + therapyTypes.join(", ") : "no services on the team yet";
  const scoredCount = DOMAINS.filter((n) => scored[n] && scored[n].score != null).length;

  if (scoredCount < 3) {
    add("team", {
      id: "wheel-first",
      title: "Answer the wheel questions first",
      why: "The communication, sensory, behaviour and daily-living sections tell us which kind of help actually fits " + first + " — a few minutes unlocks personalized matches right here.",
      because: "only " + scoredCount + " of 8 wheel areas have enough answers",
      cta: "Continue the passport", href: pLink, status: "now",
    });
  } else {
    const commB = needBand(scored, "Communication");
    if (commB && commB.rings >= 3) {
      const doneSLP = has(/speech|slp|ortho|language/);
      add("team", {
        id: "slp",
        title: doneSLP ? "Speech-language therapy is in place" : "Speech-language therapy could help " + first,
        why: doneSLP
          ? "You're covering the communication work. Ask the SLP what to practice at home between sessions."
          : "SLPs work on exactly what the wheel is flagging — requesting, back-and-forth, being understood. Here's how to reach out and what to ask on the first call.",
        because: "Communication shows " + lc(commB.label) + " on the wheel · " + (doneSLP ? "speech therapy on the team" : "no speech therapy on the team"),
        cta: doneSLP ? "See providers" : "Find SLP providers", href: "/providers",
        also: doneSLP ? null : { label: "How to reach out to SLPs", href: "/resources/guides" },
        status: doneSLP ? "done" : (commB.rings >= 4 ? "now" : "next"),
      });
    }
    const senB = needBand(scored, "Sensory Processing"), dailyB = needBand(scored, "Daily Living Skills");
    const otB = (senB && senB.rings >= 3) ? senB : (dailyB && dailyB.rings >= 3 ? dailyB : null);
    if (otB) {
      const doneOT = has(/occupational|\bot\b|ergo/);
      const focusDomain = senB && senB.rings >= 3 ? "Sensory Processing" : "Daily Living Skills";
      const focus = focusDomain === "Sensory Processing" ? "sensory regulation" : "daily-living independence";
      add("team", {
        id: "ot",
        title: doneOT ? "Occupational therapy is in place" : "An OT could help with " + focus,
        why: doneOT
          ? "OT is covering the " + focus + " work — bring the passport to sessions so nothing gets re-explained."
          : "Occupational therapists specialize in exactly this: sensory diets, routines that stick, fine-motor confidence.",
        because: focusDomain + " shows " + lc(otB.label) + " on the wheel · " + (doneOT ? "OT on the team" : "no OT on the team"),
        cta: doneOT ? "See providers" : "Find OT providers", href: "/providers",
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
        title: doneBeh ? "Behaviour support is in place" : "Support for big feelings & transitions",
        why: doneBeh
          ? "Keep sharing what works at home — consistency between settings is where the gains come from."
          : "A behaviour consultant or psychoeducator can build a calm-down and transitions plan the whole family can follow.",
        because: behDomain + " shows " + lc(behB.label) + " on the wheel · " + (doneBeh ? "behaviour support on the team" : "no behaviour support on the team"),
        cta: doneBeh ? "See providers" : "Find behaviour support", href: "/providers",
        status: doneBeh ? "done" : "next",
      });
    }
    if (!therapies.length && !ctx.onWaitlists) {
      add("team", {
        id: "start-one",
        title: "Start with one service, not five",
        why: "Families burn out chasing everything at once. Your top need on the wheel is the compass — one good fit first, the rest follow.",
        because: teamLine,
        cta: "See matched providers", href: "/providers", status: "next",
      });
    }
    add("team", {
      id: "waitlists",
      title: ctx.onWaitlists ? "You're on provider waitlists" : "Join provider waitlists early",
      why: ctx.onWaitlists
        ? "Ask each list about cancellations — spots open up more often than you'd think."
        : "Québec waitlists run long — a spot costs nothing to hold, and you can always decline later.",
      because: ctx.onWaitlists ? "waitlist signups found for your account" : "no waitlist signups yet",
      cta: ctx.onWaitlists ? "Check waitlists" : "Join waitlists", href: "/providers/waitlists",
      status: ctx.onWaitlists ? "done" : "next",
    });
  }

  /* ---------------- 3 · MONEY & SCHOOL ---------------- */
  add("support", {
    id: "dtc",
    title: ctx.dtcStarted ? "Disability Tax Credit started" : "Apply for the Disability Tax Credit",
    why: ctx.dtcStarted
      ? "The gateway credit is moving — it unlocks the Child Disability Benefit and the RDSP next."
      : "The gateway credit most families miss — it unlocks the Child Disability Benefit (up to $3,411/yr) and the RDSP." + (hasDx ? "" : " You can prepare it now and file once the diagnosis lands."),
    because: (hasDx ? "diagnosis on file" : "no diagnosis on file yet") + " · DTC " + (ctx.dtcStarted ? "started" : "not started"),
    cta: ctx.dtcStarted ? "Open funding" : "Start with tax credits", href: "/funding/tax-credits",
    status: ctx.dtcStarted ? "done" : (hasDx ? "now" : "next"),
  });
  add("support", {
    id: "programs",
    title: "Walk through all 7 funding programs",
    why: "Federal and Québec programs stack — the navigator checks each one against " + first + "'s profile.",
    because: (ctx.fundingStarted || 0) + " of 7 programs started",
    cta: "Open the navigator", href: "/funding",
    status: (ctx.fundingStarted || 0) >= 2 ? "done" : (ctx.dtcStarted ? "next" : "later"),
  });
  const edu = data.education || {};
  if (edu.hasIEP === "Yes") {
    add("support", {
      id: "iep",
      title: "IEP is in place",
      why: "Before each meeting: jot three things going well and three concerns. Ask for goals that are specific and measurable.",
      because: 'you answered "Yes" to having an IEP',
      cta: "IEP meeting guide", href: "/resources/guides", status: "done",
    });
  } else if (edu.schoolName || edu.schoolType) {
    add("support", {
      id: "iep",
      title: "Start the IEP conversation at school",
      why: "A written request starts formal timelines for a plan d'intervention. Bring the passport — you know " + first + " best.",
      because: "school on file (" + (edu.schoolName || edu.schoolType) + ") · IEP: " + (edu.hasIEP || "not set"),
      cta: "Read the IEP guide", href: "/resources/guides", status: "next",
    });
  }
  const elope = data.behaviour && data.behaviour.challenges && data.behaviour.challenges.elopement;
  if (elope && elope !== "Never" && elope !== "") {
    add("support", {
      id: "safety",
      title: "Make a family safety plan",
      why: "An ID card in the pocket, a door plan, and telling school and caregivers makes everyone safer — most families set this up in an evening.",
      because: 'you noted elopement "' + elope + '"',
      cta: "Safety planning guide", href: "/resources/guides",
      status: isHighFreq(elope) || elope === "Sometimes" ? "now" : "next",
    });
  }

  /* ---------------- 4 · EVERYDAY LIFE ---------------- */
  const staleDays = ctx.daysSinceUpdate;
  const staleTxt = staleDays == null ? "no update date on file" : staleDays >= 30 ? "last updated " + Math.round(staleDays / 30) + " month" + (Math.round(staleDays / 30) === 1 ? "" : "s") + " ago" : "last updated " + staleDays + " day" + (staleDays === 1 ? "" : "s") + " ago";
  add("thrive", {
    id: "checkin",
    title: (staleDays != null && staleDays < 60) ? "The passport is fresh" : "Do a 5-minute check-in",
    why: (staleDays != null && staleDays < 60)
      ? "Growth quietly records each check-in so you can look back at how far you've come."
      : "Children change fast. A quick pass keeps every recommendation true — and Growth remembers where you were, so nothing is lost.",
    because: staleTxt,
    cta: (staleDays != null && staleDays < 60) ? "Open the passport" : "Update the passport", href: pLink,
    status: (staleDays != null && staleDays < 60) ? "done" : "now",
  });
  add("thrive", {
    id: "wins",
    title: (ctx.lastWinDays != null && ctx.lastWinDays <= 7) ? "A win logged this week ✦" : "Log this week's win",
    why: (ctx.lastWinDays != null && ctx.lastWinDays <= 7)
      ? "Small wins compound — they're also the story you'll want to reread on hard days."
      : "Even tiny ones count. On hard days, the journal is the proof of how far " + first + " has come.",
    because: ctx.lastWinDays == null ? "no wins in the journal yet" : ctx.lastWinDays <= 7 ? "latest win " + ctx.lastWinDays + " day" + (ctx.lastWinDays === 1 ? "" : "s") + " ago" : "latest win " + ctx.lastWinDays + " days ago",
    cta: "Open the journal", href: "/child/growth",
    status: (ctx.lastWinDays != null && ctx.lastWinDays <= 7) ? "done" : "next",
  });
  add("thrive", {
    id: "community",
    title: "Find your people",
    why: "Workshops and the parent community — the fastest shortcuts come from families two steps ahead of you.",
    because: "",
    cta: "See workshops", href: "/resources/workshops", status: "later",
  });

  /* ---------------- assemble (family-first ordering) ---------------- */
  const STATUS_ORDER = { now: 0, next: 1, later: 2, done: 3 };
  const STAGE_ORDER = { understand: 0, team: 1, support: 2, thrive: 3 };
  const stages = STAGE_META.map((m) => {
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
