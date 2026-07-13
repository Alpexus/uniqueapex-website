/* ============================================================
   domainInsights.js — DOMAIN-INSIGHTS-V1
   ------------------------------------------------------------
   The shared "what does this child actually need" engine.
   · domainDetail(name, data)  — moved verbatim from
     support-wheel.astro so ONE copy serves every page:
     reads the real passport answers for a domain and returns
     { strengths, support, strategies, context }.
   · buildFamilyGuidance(data, scored, firstName) — composes a
     personalized guidance paragraph for the Overview (and the
     upcoming family report): top support needs with the child's
     SPECIFIC challenge areas, concrete strategies to try, the
     child's strengths and interests as anchors, and sensory
     adjustments when the profile shows sensitivities.
   Pure rules, no network — private and instant. An optional
   AI-written version can layer on top later (premium feature).
   ============================================================ */
import { DOMAINS, scoreToBand } from "../config/wheelConfig.js";

export const SENSE_LABELS = { auditory: "Sound", visual: "Sight", tactile: "Touch", oral: "Taste & mouth", smell: "Smell", movement: "Movement & balance", body: "Body awareness" };
const isHigh = (v) => v === "Often" || v === "Daily";
const present = (v) => v != null && v !== "";
const uniq = (a) => [...new Set(a)];

export function domainDetail(name, d) {
  const strengths = [], support = [], strategies = [];
  let context = "";
  const comm = d.communication || {}, beh = d.behaviour || {}, bch = beh.challenges || {},
        sen = d.sensory || {}, dl = d.dailyLiving || {}, motor = d.motor || {}, str = d.strengths || {};
  switch (name) {
    case "Communication": {
      if (comm.style === "Fluent Verbal" || comm.style === "Verbal") strengths.push("Communicates verbally");
      (comm.means || []).forEach((m) => {
        if (m === "Words") strengths.push("Uses words");
        else if (m === "Sentences") strengths.push("Uses sentences");
        else if (m === "Sign language") strengths.push("Uses sign language");
        else if (m === "Device / AAC app") strengths.push("Uses an AAC device");
        else if (m === "Pictures (PECS)") strengths.push("Uses picture communication");
      });
      if (comm.canExpressNeeds === "Consistently") strengths.push("Expresses needs reliably");
      if (comm.style === "Non-Speaking" || comm.style === "Limited Verbal") support.push("Building spoken communication");
      const cmap = { "Requesting": "Requesting things", "Conversation": "Back-and-forth conversation", "Question Answering": "Answering questions", "Emotional Expression": "Putting feelings into words", "Social Communication": "Social communication" };
      (comm.challenges || []).forEach((c) => { if (cmap[c]) support.push(cmap[c]); });
      if (comm.canExpressNeeds === "Rarely") support.push("Expressing needs");
      strategies.push("Visual supports and picture cards", "Offer simple choices", "Model short, clear phrases", "Give a little extra time to respond");
      break;
    }
    case "Social Connection": {
      if (beh.peersInterest === "Yes") strengths.push("Shows interest in other children");
      if (beh.peersInteract === "Yes") strengths.push("Plays with peers");
      else if (beh.peersInteract === "Sometimes") strengths.push("Plays alongside peers");
      if (beh.peersInterest === "No") support.push("Connecting with other children");
      if (beh.peersInteract === "No" || beh.peersInteract === "Sometimes") support.push("Back-and-forth play");
      strategies.push("Structured, shared activities", "Turn-taking games", "Short play dates with clear roles", "Social stories before new situations");
      break;
    }
    case "Sensory Processing": {
      Object.keys(SENSE_LABELS).forEach((k) => {
        const o = sen[k];
        if (!o || typeof o !== "object") return;
        if (o.typical) strengths.push("Comfortable with " + SENSE_LABELS[k].toLowerCase());
        else if (o.signs && o.signs.length) {
          const sig = o.signs.slice(0, 2).join(", ").toLowerCase();
          support.push(SENSE_LABELS[k] + ": " + sig + (o.severity ? " (" + o.severity.toLowerCase() + ")" : ""));
        }
      });
      if (present(sen.notes)) context = "Your note: " + sen.notes;
      strategies.push("Sensory breaks through the day", "Noise-reducing headphones in loud places", "Ask your OT about deep-pressure input", "Prepare for known triggers in advance");
      break;
    }
    case "Flexibility & Transitions": {
      if (!isHigh(bch.rigidity) && bch.rigidity !== "Sometimes") strengths.push("Handles changes fairly well");
      if (isHigh(bch.rigidity)) support.push("Changes in routine");
      else if (bch.rigidity === "Sometimes") support.push("Some difficulty with transitions");
      strategies.push("Visual schedules", "Countdown warnings before transitions", "First then language", "Keep routines predictable where you can");
      break;
    }
    case "Emotional Regulation": {
      if (!isHigh(bch.meltdowns) && !isHigh(bch.emotional) && !isHigh(bch.anxiety)) strengths.push("Generally calm and settled");
      if (isHigh(bch.meltdowns)) support.push("Big emotional reactions / meltdowns");
      if (isHigh(bch.emotional)) support.push("Regulating emotions in the moment");
      if (isHigh(bch.anxiety)) support.push("Anxiety");
      if (present(beh.triggers)) context = "Known triggers: " + beh.triggers;
      if (present(beh.strategies)) strategies.push(beh.strategies);
      strategies.push("A calm-down space", "Naming feelings together", "Simple breathing or counting", "Stay calm and steady during big feelings");
      break;
    }
    case "Executive Function": {
      if (dl.multiStep === "Yes") strengths.push("Follows multi-step instructions");
      if (dl.safety === "Strong") strengths.push("Good safety awareness");
      if (dl.multiStep === "No" || dl.multiStep === "Sometimes") support.push("Following multi-step instructions");
      if (isHigh(bch.hyperactivity)) support.push("Staying focused / sitting still");
      if (isHigh(bch.defiance)) support.push("Following directions");
      strategies.push("Break tasks into small steps", "Visual checklists", "Use timers for activities", "One instruction at a time");
      break;
    }
    case "Daily Living Skills": {
      if (dl.eating === "Independent") strengths.push("Eats independently");
      if (dl.dressing === "Independent") strengths.push("Dresses independently");
      if (dl.toileting === "Fully trained") strengths.push("Toilet trained");
      if (dl.sleep === "Good") strengths.push("Sleeps well");
      if (dl.eating === "With support" || dl.eating === "Not yet") support.push("Eating skills");
      if (dl.dressing === "With support" || dl.dressing === "Not yet") support.push("Dressing skills");
      if (dl.toileting === "In progress" || dl.toileting === "Not started") support.push("Toilet training");
      if (dl.feeding === "Mild" || dl.feeding === "Significant") support.push("Feeding");
      if ((motor.fine || []).length) support.push("Fine motor skills");
      if ((motor.gross || []).length) support.push("Gross motor skills");
      strategies.push("Visual step-by-step routines", "Adaptive tools (easy-grip, velcro)", "Practice one skill at a time", "Celebrate small wins");
      break;
    }
    case "Learning & Play": {
      const interests = String(str.interests || "").split(/[,\n;•]+/).map((x) => x.trim()).filter(Boolean);
      if (interests.length) strengths.push("Engages deeply with " + interests.slice(0, 3).join(", ").toLowerCase());
      strategies.push("Build learning around their interests", "Play-based teaching", "Short, frequent sessions", "Visual and hands-on materials");
      break;
    }
  }
  return { strengths: uniq(strengths), support: uniq(support), strategies: uniq(strategies), context };
}

/* ---------------- personalized family guidance ---------------- */
const SHORT = { "Communication": "communication", "Social Connection": "social connection", "Sensory Processing": "sensory processing", "Flexibility & Transitions": "flexibility and transitions", "Emotional Regulation": "emotional regulation", "Executive Function": "focus and organization", "Daily Living Skills": "daily living skills", "Learning & Play": "learning and play" };
const lcFirst = (s) => { s = String(s || "").trim(); return s.charAt(0).toLowerCase() + s.slice(1); };
const listPhrase = (arr) => {
  arr = arr.filter(Boolean);
  if (!arr.length) return "";
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return arr[0] + " and " + arr[1];
  return arr.slice(0, -1).join(", ") + ", and " + arr[arr.length - 1];
};
const textToList = (s) => String(s || "").split(/[,\n;•]+/).map((x) => x.trim()).filter(Boolean);

/**
 * Returns an array of personalized sentences (possibly empty when the
 * passport has too little data). Every child gets different text because
 * every piece is pulled from THEIR answers: their top-need domains, their
 * specific challenge areas, their strategies, their strengths + interests,
 * their sensory profile.
 */
export function buildFamilyGuidance(data, scored, firstName) {
  data = data || {};
  firstName = firstName || "Your child";
  const out = [];
  const needs = DOMAINS.filter((n) => scored[n] && scored[n].score != null).sort((a, b) => scored[b].score - scored[a].score);
  const shine = DOMAINS.filter((n) => scored[n] && scored[n].strength != null && scored[n].strength >= 45).sort((a, b) => scored[b].strength - scored[a].strength);

  /* 1 — top need, with the child's SPECIFIC challenge areas */
  if (needs.length) {
    const top = needs[0];
    const det = domainDetail(top, data);
    const band = scoreToBand(scored[top].score);
    const intense = band && (band.key === "high" || band.key === "intensive");
    let s = firstName + (intense ? " needs the most support with " : " seems to benefit most from steady support with ") + SHORT[top];
    if (det.support.length) s += " — especially " + listPhrase(det.support.slice(0, 2).map(lcFirst));
    out.push(s + ".");
    if (det.strategies.length) out.push("Good starting points: " + listPhrase(det.strategies.slice(0, 2).map(lcFirst)) + ".");

    /* 2 — second need, one concrete strategy */
    if (needs[1] && scored[needs[1]].score >= 36) {
      const det2 = domainDetail(needs[1], data);
      let s2 = "For " + SHORT[needs[1]] + ", " + (det2.strategies.length ? lcFirst(det2.strategies[0]) + " can go a long way" : "small consistent routines can go a long way");
      out.push(s2 + ".");
    }
  }

  /* 3 — strengths and interests as anchors */
  const interests = textToList(data.strengths && data.strengths.interests).slice(0, 3).map((x) => x.toLowerCase());
  if (shine.length) {
    let s = "Lean on " + firstName + "'s strengths in " + listPhrase(shine.slice(0, 2).map((n) => SHORT[n]));
    if (interests.length) s += " — building practice around " + listPhrase(interests) + " helps new skills stick";
    out.push(s + ".");
  } else if (interests.length) {
    out.push("Building practice around " + listPhrase(interests) + " helps new skills stick.");
  }

  /* 4 — sensory adjustments, naming the child's actual sensitivities */
  const sen = data.sensory || {};
  const senseHits = Object.keys(SENSE_LABELS).filter((k) => sen[k] && !sen[k].typical && sen[k].signs && sen[k].signs.length);
  if (senseHits.length) {
    out.push("Because " + listPhrase(senseHits.slice(0, 2).map((k) => SENSE_LABELS[k].toLowerCase())) + " can be a lot for " + firstName + ", plan sensory breaks and prepare for known triggers in advance.");
  }

  /* 5 — emotional context the parent recorded */
  const beh = data.behaviour || {};
  if (present(beh.triggers) && needs.slice(0, 2).includes("Emotional Regulation")) {
    out.push("Keep the known triggers in mind (" + String(beh.triggers).trim() + ") and give warnings before they come up.");
  }

  return out;
}
