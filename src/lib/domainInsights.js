/* ============================================================
   domainInsights.js — DOMAIN-INSIGHTS-V2 (bilingual)
   ------------------------------------------------------------
   The shared "what does this child actually need" engine.
   · domainDetail(name, data)  — reads the real passport answers
     for a domain and returns { strengths, support, strategies,
     context } in the ACTIVE LANGUAGE (window.uaLang via libI18n).
   · buildFamilyGuidance(data, scored, firstName) — composes a
     personalized guidance paragraph for the Overview (and the
     family report): top support needs with the child's SPECIFIC
     challenge areas, concrete strategies, strengths + interests
     as anchors, sensory adjustments.
   V2: every family-visible string lives in src/i18n/lib-insights.js
   (+ lib-terms.js for stored option values). All MATCHER values
   ("Fluent Verbal", "Often", "Independent"…) stay canonical
   English — they are compared against Supabase data, never shown
   raw. Pure rules, no network — private and instant.
   ============================================================ */
import { DOMAINS, scoreToBand } from "../config/wheelConfig.js";
import { makeT, tpl, dv, joinList, ofName, domainLow, senseLabel } from "./libI18n.js";
import DICT from "../i18n/lib-insights.js";

export const SENSE_LABELS = { auditory: "Sound", visual: "Sight", tactile: "Touch", oral: "Taste & mouth", smell: "Smell", movement: "Movement & balance", body: "Body awareness" };
const isHigh = (v) => v === "Often" || v === "Daily";
const present = (v) => v != null && v !== "";
const uniq = (a) => [...new Set(a)];

export function domainDetail(name, d) {
  const t = makeT(DICT);
  const strengths = [], support = [], strategies = [];
  let context = "";
  const comm = d.communication || {}, beh = d.behaviour || {}, bch = beh.challenges || {},
        sen = d.sensory || {}, dl = d.dailyLiving || {}, motor = d.motor || {}, str = d.strengths || {};
  switch (name) {
    case "Communication": {
      if (comm.style === "Fluent Verbal" || comm.style === "Verbal") strengths.push(t("s_commVerbal"));
      (comm.means || []).forEach((m) => {
        if (m === "Words") strengths.push(t("s_usesWords"));
        else if (m === "Sentences") strengths.push(t("s_usesSentences"));
        else if (m === "Sign language") strengths.push(t("s_usesSign"));
        else if (m === "Device / AAC app") strengths.push(t("s_usesAAC"));
        else if (m === "Pictures (PECS)") strengths.push(t("s_usesPECS"));
      });
      if (comm.canExpressNeeds === "Consistently") strengths.push(t("s_expressReliably"));
      if (comm.style === "Non-Speaking" || comm.style === "Limited Verbal") support.push(t("n_buildSpoken"));
      const cmap = { "Requesting": t("n_requesting"), "Conversation": t("n_conversation"), "Question Answering": t("n_questions"), "Emotional Expression": t("n_feelingsWords"), "Social Communication": t("n_socialComm") };
      (comm.challenges || []).forEach((c) => { if (cmap[c]) support.push(cmap[c]); });
      if (comm.canExpressNeeds === "Rarely") support.push(t("n_expressing"));
      strategies.push(t("st_visualCards"), t("st_choices"), t("st_modelPhrases"), t("st_extraTime"));
      break;
    }
    case "Social Connection": {
      if (beh.peersInterest === "Yes") strengths.push(t("s_peersInterest"));
      if (beh.peersInteract === "Yes") strengths.push(t("s_peersPlays"));
      else if (beh.peersInteract === "Sometimes") strengths.push(t("s_peersAlongside"));
      if (beh.peersInterest === "No") support.push(t("n_connecting"));
      if (beh.peersInteract === "No" || beh.peersInteract === "Sometimes") support.push(t("n_backForthPlay"));
      strategies.push(t("st_structured"), t("st_turnGames"), t("st_playDates"), t("st_socialStories"));
      break;
    }
    case "Sensory Processing": {
      Object.keys(SENSE_LABELS).forEach((k) => {
        const o = sen[k];
        if (!o || typeof o !== "object") return;
        if (o.typical) strengths.push(tpl(t("s_comfortWith"), { sense: senseLabel(k).toLowerCase() }));
        else if (o.signs && o.signs.length) {
          const sig = o.signs.slice(0, 2).map((s) => dv(s)).join(", ").toLowerCase();
          support.push(tpl(t("n_senseLine"), { sense: senseLabel(k), rest: sig + (o.severity ? " (" + dv(o.severity).toLowerCase() + ")" : "") }));
        }
      });
      if (present(sen.notes)) context = tpl(t("ctx_yourNote"), { note: sen.notes });
      strategies.push(t("st_sensoryBreaks"), t("st_headphones"), t("st_deepPressure"), t("st_prepTriggers"));
      break;
    }
    case "Flexibility & Transitions": {
      if (!isHigh(bch.rigidity) && bch.rigidity !== "Sometimes") strengths.push(t("s_handlesChange"));
      if (isHigh(bch.rigidity)) support.push(t("n_routineChanges"));
      else if (bch.rigidity === "Sometimes") support.push(t("n_someTransitions"));
      strategies.push(t("st_visualSchedules"), t("st_countdown"), t("st_firstThen"), t("st_keepRoutines"));
      break;
    }
    case "Emotional Regulation": {
      if (!isHigh(bch.meltdowns) && !isHigh(bch.emotional) && !isHigh(bch.anxiety)) strengths.push(t("s_calm"));
      if (isHigh(bch.meltdowns)) support.push(t("n_meltdowns"));
      if (isHigh(bch.emotional)) support.push(t("n_regulating"));
      if (isHigh(bch.anxiety)) support.push(t("n_anxiety"));
      if (present(beh.triggers)) context = tpl(t("ctx_triggers"), { t: beh.triggers });
      if (present(beh.strategies)) strategies.push(beh.strategies);
      strategies.push(t("st_calmSpace"), t("st_namingFeelings"), t("st_breathing"), t("st_stayCalm"));
      break;
    }
    case "Executive Function": {
      if (dl.multiStep === "Yes") strengths.push(t("s_multiStep"));
      if (dl.safety === "Strong") strengths.push(t("s_safetyAware"));
      if (dl.multiStep === "No" || dl.multiStep === "Sometimes") support.push(t("n_multiStep"));
      if (isHigh(bch.hyperactivity)) support.push(t("n_focus"));
      if (isHigh(bch.defiance)) support.push(t("n_directions"));
      strategies.push(t("st_smallSteps"), t("st_checklists"), t("st_timers"), t("st_oneInstruction"));
      break;
    }
    case "Daily Living Skills": {
      if (dl.eating === "Independent") strengths.push(t("s_eats"));
      if (dl.dressing === "Independent") strengths.push(t("s_dresses"));
      if (dl.toileting === "Fully trained") strengths.push(t("s_toilet"));
      if (dl.sleep === "Good") strengths.push(t("s_sleeps"));
      if (dl.eating === "With support" || dl.eating === "Not yet") support.push(t("n_eating"));
      if (dl.dressing === "With support" || dl.dressing === "Not yet") support.push(t("n_dressing"));
      if (dl.toileting === "In progress" || dl.toileting === "Not started") support.push(t("n_toileting"));
      if (dl.feeding === "Mild" || dl.feeding === "Significant") support.push(t("n_feeding"));
      if ((motor.fine || []).length) support.push(t("n_fineMotor"));
      if ((motor.gross || []).length) support.push(t("n_grossMotor"));
      strategies.push(t("st_stepRoutines"), t("st_adaptiveTools"), t("st_oneSkill"), t("st_celebrate"));
      break;
    }
    case "Learning & Play": {
      const interests = String(str.interests || "").split(/[,\n;•]+/).map((x) => x.trim()).filter(Boolean);
      if (interests.length) strengths.push(tpl(t("s_engages"), { interests: interests.slice(0, 3).join(", ").toLowerCase() }));
      strategies.push(t("st_buildInterests"), t("st_playBased"), t("st_shortSessions"), t("st_handsOn"));
      break;
    }
  }
  return { strengths: uniq(strengths), support: uniq(support), strategies: uniq(strategies), context };
}

/* ---------------- personalized family guidance ---------------- */
const lcFirst = (s) => { s = String(s || "").trim(); return s.charAt(0).toLowerCase() + s.slice(1); };
const textToList = (s) => String(s || "").split(/[,\n;•]+/).map((x) => x.trim()).filter(Boolean);

/**
 * Returns an array of personalized sentences (possibly empty when the
 * passport has too little data). Every child gets different text because
 * every piece is pulled from THEIR answers: their top-need domains, their
 * specific challenge areas, their strategies, their strengths + interests,
 * their sensory profile.
 */
export function buildFamilyGuidance(data, scored, firstName) {
  const t = makeT(DICT);
  data = data || {};
  firstName = firstName || t("yourChild");
  const out = [];
  const needs = DOMAINS.filter((n) => scored[n] && scored[n].score != null).sort((a, b) => scored[b].score - scored[a].score);
  const shine = DOMAINS.filter((n) => scored[n] && scored[n].strength != null && scored[n].strength >= 45).sort((a, b) => scored[b].strength - scored[a].strength);

  /* 1 — top need, with the child's SPECIFIC challenge areas */
  if (needs.length) {
    const top = needs[0];
    const det = domainDetail(top, data);
    const band = scoreToBand(scored[top].score);
    const intense = band && (band.key === "high" || band.key === "intensive");
    let s = tpl(t(intense ? "g_topIntense" : "g_topSteady"), { name: firstName, domain: domainLow(top) });
    if (det.support.length) s += tpl(t("g_especially"), { list: joinList(det.support.slice(0, 2).map(lcFirst)) });
    out.push(s + ".");
    if (det.strategies.length) out.push(tpl(t("g_startingPoints"), { list: joinList(det.strategies.slice(0, 2).map(lcFirst)) }));

    /* 2 — second need, one concrete strategy */
    if (needs[1] && scored[needs[1]].score >= 36) {
      const det2 = domainDetail(needs[1], data);
      const rest = det2.strategies.length ? tpl(t("g_goesLongWay"), { s: lcFirst(det2.strategies[0]) }) : t("g_routinesLongWay");
      out.push(tpl(t("g_second"), { domain: domainLow(needs[1]), rest }) + ".");
    }
  }

  /* 3 — strengths and interests as anchors */
  const interests = textToList(data.strengths && data.strengths.interests).slice(0, 3).map((x) => x.toLowerCase());
  if (shine.length) {
    let s = tpl(t("g_leanStrengths"), { name: firstName, of: ofName(firstName), list: joinList(shine.slice(0, 2).map((n) => domainLow(n))) });
    if (interests.length) s += tpl(t("g_buildPractice"), { list: joinList(interests) });
    out.push(s + ".");
  } else if (interests.length) {
    out.push(tpl(t("g_buildPracticeSolo"), { list: joinList(interests) }));
  }

  /* 4 — sensory adjustments, naming the child's actual sensitivities */
  const sen = data.sensory || {};
  const senseHits = Object.keys(SENSE_LABELS).filter((k) => sen[k] && !sen[k].typical && sen[k].signs && sen[k].signs.length);
  if (senseHits.length) {
    out.push(tpl(t("g_sensory"), { list: joinList(senseHits.slice(0, 2).map((k) => senseLabel(k).toLowerCase())), name: firstName }));
  }

  /* 5 — emotional context the parent recorded */
  const beh = data.behaviour || {};
  if (present(beh.triggers) && needs.slice(0, 2).includes("Emotional Regulation")) {
    out.push(tpl(t("g_triggers"), { t: String(beh.triggers).trim() }));
  }

  return out;
}
