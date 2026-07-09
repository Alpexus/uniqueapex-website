/* ============================================================================
   wheelConfig.js — v3 FINAL (built from the real passport.astro)
   Save as: src/config/wheelConfig.js  (delete the old one first)
   ----------------------------------------------------------------------------
   passport.astro imports SCALE_QUESTIONS + SCALE_IDS from this file and
   renders them — so the 36 scale questions below ARE the form. The other
   CONTRIBUTIONS rows reference the exact field names and option strings
   your form saves (verified against buildPassport() in passport.astro).
   → passport.astro needs NO changes. Existing saved answers keep working.

   WHAT LIVES WHERE
   · This file  = data only: questions, mappings, weights, band tables.
   · scoreWheel.js = the math. · wheelSvg.js = the drawing.

   HOW A NUMBER IS BORN (one sentence per step)
   A parent answers a question → the scorer for that row turns the answer
   into an ABILITY between 0 and 1 (1 = strong/independent) → the need
   score of a domain is the weighted average of (1 − ability) over the
   ANSWERED rows only, ×100 → strengths are their own rows, averaged the
   same way → skipped questions never lower a score, they lower CONFIDENCE
   (= how much of the domain's question-weight is answered).
   ============================================================================ */

/* ---------------- The 8 wheel domains (names/order are load-bearing) ------ */
export const DOMAINS = [
  "Communication",
  "Social Connection",
  "Sensory Processing",
  "Flexibility & Transitions",
  "Emotional Regulation",
  "Executive Function",
  "Daily Living Skills",
  "Learning & Play",
];

/* Curated hues, same index order as DOMAINS. Communication = brand violet;
   nothing lands on pure alarm-red anymore. */
export const HUES = [262, 300, 336, 22, 45, 95, 160, 205];

/* ---------------- The 36 scale questions the passport renders -------------
   Groups match the passport sections that render them:
   communication → §5 · executive → §7 · social/flexibility/emotional → §9 ·
   learning → §10.  Scale: 0 Never · 1 Rarely · 2 Sometimes · 3 Often ·
   4 Consistently (saved as strings "0".."4" in passport.data.scales).
   IDs are unchanged from your original config → old saved answers still map.
   `emo_anxious` is reverse-scored (more often = MORE support need).        */
export const SCALE_QUESTIONS = {
  communication: [
    { id: "comm_answersSimple",   label: "Answers simple yes/no questions" },
    { id: "comm_answersOpen",     label: "Answers open-ended questions" },
    { id: "comm_backForth",       label: "Keeps a back-and-forth exchange going" },
    { id: "comm_understandsInstr",label: "Understands familiar instructions" },
    { id: "comm_exprFeelings",    label: "Expresses feelings with words or signs" },
    { id: "comm_requestHelp",     label: "Asks for help when needed" },
  ],
  social: [
    { id: "soc_respondsName",   label: "Responds to their name" },
    { id: "soc_sharesEnjoy",    label: "Shares enjoyment — shows or points things out" },
    { id: "soc_takesTurns",     label: "Takes turns in games or activities" },
    { id: "soc_understandsEmo", label: "Notices how others are feeling" },
    { id: "soc_initiates",      label: "Starts interactions with other children" },
    { id: "soc_maintains",      label: "Keeps play going with another child" },
  ],
  flexibility: [
    { id: "flex_unexpected",    label: "Copes when something unexpected happens" },
    { id: "flex_transitions",   label: "Moves between activities without distress" },
    { id: "flex_waiting",       label: "Waits calmly when asked" },
    { id: "flex_interruptions", label: "Handles interruptions to play or routines" },
    { id: "flex_newEnv",        label: "Adjusts to new places" },
    { id: "flex_changePlans",   label: "Accepts a change of plans" },
  ],
  emotional: [
    { id: "emo_recovers",    label: "Recovers from upset within a reasonable time" },
    { id: "emo_identifies",  label: "Names or shows what they're feeling" },
    { id: "emo_coping",      label: "Uses a calming strategy, with or without help" },
    { id: "emo_anxious",     label: "Becomes anxious or overwhelmed", reverse: true },
    { id: "emo_limits",      label: "Accepts limits or being told no" },
    { id: "emo_frustration", label: "Manages frustration during hard tasks" },
  ],
  executive: [
    { id: "exec_attention", label: "Stays focused on an activity for a few minutes" },
    { id: "exec_completes", label: "Finishes short tasks" },
    { id: "exec_switches",  label: "Switches between tasks when asked" },
    { id: "exec_multiStep", label: "Follows two-step instructions" },
    { id: "exec_organizes", label: "Keeps track of their belongings" },
    { id: "exec_begins",    label: "Starts tasks without many reminders" },
  ],
  learning: [
    { id: "learn_pretend",      label: "Uses pretend or imaginative play" },
    { id: "learn_independent",  label: "Plays independently for a stretch" },
    { id: "learn_problemSolve", label: "Tries different ways to solve a problem" },
    { id: "learn_gameRules",    label: "Learns the rules of simple games" },
    { id: "learn_curiosity",    label: "Shows curiosity about new things" },
    { id: "learn_persists",     label: "Keeps trying when something is hard" },
  ],
};

/* Which wheel domain each scale group belongs to */
const GROUP_DOMAIN = {
  communication: "Communication",
  social: "Social Connection",
  flexibility: "Flexibility & Transitions",
  emotional: "Emotional Regulation",
  executive: "Executive Function",
  learning: "Learning & Play",
};

/* Flat id list — passport.astro embeds this to collect/restore answers */
export const SCALE_IDS = Object.keys(SCALE_QUESTIONS).reduce(
  (ids, g) => ids.concat(SCALE_QUESTIONS[g].map((q) => q.id)), []);

/* id → { group, domain, reverse } (used by the scale scorers) */
export const SCALE_META = {};
Object.keys(SCALE_QUESTIONS).forEach(function (g) {
  SCALE_QUESTIONS[g].forEach(function (q) {
    SCALE_META[q.id] = { group: g, domain: GROUP_DOMAIN[g], reverse: !!q.reverse };
  });
});

/* ---------------- Shared band tables (single source of truth) -------------
   Rings on the petal, the badge text, and every bar derive from these —
   they can never disagree.                                                 */
export const NEED_BANDS = [
  { max: 15,  rings: 1, key: "minimal",   label: "Minimal support" },
  { max: 35,  rings: 2, key: "low",       label: "Low support" },
  { max: 60,  rings: 3, key: "moderate",  label: "Moderate support" },
  { max: 80,  rings: 4, key: "high",      label: "High support" },
  { max: 100, rings: 5, key: "intensive", label: "Intensive support" },
];
export const STRENGTH_BANDS = [
  { max: 15,  rings: 1, key: "emerging",    label: "Emerging" },
  { max: 35,  rings: 2, key: "developing",  label: "Developing" },
  { max: 60,  rings: 3, key: "solid",       label: "Solid" },
  { max: 80,  rings: 4, key: "strong",      label: "Strong" },
  { max: 100, rings: 5, key: "exceptional", label: "Shining" },
];

export const CONFIDENCE_THRESHOLDS = { high: 0.75, medium: 0.4 }; // >0 → low · 0 → none
export const MIN_ITEMS = 2;    // a domain needs at least this many answered rows
export const MIN_WEIGHT = 1.5; // …and this much answered weight, else grey petal

export function scoreToBand(score, axis = "need") {
  if (score == null) return null;
  const bands = axis === "strength" ? STRENGTH_BANDS : NEED_BANDS;
  for (const b of bands) if (score <= b.max) return b;
  return bands[bands.length - 1];
}
export function coverageToConfidence(cov) {
  if (!cov || cov <= 0) return "none";
  if (cov >= CONFIDENCE_THRESHOLDS.high) return "high";
  if (cov >= CONFIDENCE_THRESHOLDS.medium) return "medium";
  return "low";
}

/* ---------------- CONTRIBUTIONS: real passport fields → the wheel ---------
   Row shape: { field, type, polarity, domains:[{d,w}] , …type params }
   All scorers return ABILITY 0..1 (1 = strong/independent) or null
   (unanswered). Need score uses 1 − ability. Strength rows use the value
   directly. "" and empty selects are always treated as unanswered.
   Weights: 3 critical · 2 core · 1.5 strong · 1 normal · 0.5–0.75 light. */

const CONTRIBUTIONS = [];

/* --- 1) The 36 scales — the backbone. Need weight 2 each; every scale
       also doubles as strength evidence (answers of Often/Consistently). */
const SCALE_CROSS = { /* a few questions clearly inform a second domain */
  flex_transitions: [{ d: "Emotional Regulation", w: 1 }],
  exec_attention:   [{ d: "Learning & Play", w: 1 }],
  soc_maintains:    [{ d: "Communication", w: 1 }],
  learn_persists:   [{ d: "Executive Function", w: 1 }],
};
SCALE_IDS.forEach(function (id) {
  const home = [{ d: SCALE_META[id].domain, w: 2 }].concat(SCALE_CROSS[id] || []);
  CONTRIBUTIONS.push({ field: "scales." + id, type: "scale4", polarity: "need", domains: home });
  CONTRIBUTIONS.push({ field: "scales." + id, type: "scaleStrength", polarity: "strength",
    domains: [{ d: SCALE_META[id].domain, w: 1 }] });
});

/* --- 2) Communication section (§5) --- */
CONTRIBUTIONS.push(
  { field: "communication.style", type: "map", polarity: "need",
    map: { "Fluent Verbal": 1, "Verbal": 0.75, "Limited Verbal": 0.35, "Non-Speaking": 0.1 },
    domains: [{ d: "Communication", w: 3 }] },
  { field: "communication.style", type: "map", polarity: "strength",
    map: { "Fluent Verbal": 1, "Verbal": 0.65, "Limited Verbal": 0.2, "Non-Speaking": 0.05 },
    domains: [{ d: "Communication", w: 1.5 }] },
  { field: "communication.canExpressNeeds", type: "map", polarity: "need",
    map: { "Consistently": 0.95, "Sometimes": 0.5, "Rarely": 0.15 },
    domains: [{ d: "Communication", w: 2 }] },
  { field: "communication.means", type: "hasNoMeans", polarity: "need",
    domains: [{ d: "Communication", w: 1 }] },
  { field: "communication.challenges", type: "countNeed", per: 0.18, floor: 0.1, polarity: "need",
    domains: [{ d: "Communication", w: 1.5 }] },
);

/* --- 3) Sensory section (§6): per-sense {typical, signs[], severity} --- */
["auditory", "visual", "tactile", "oral", "smell", "movement", "body"].forEach(function (s) {
  CONTRIBUTIONS.push(
    { field: "sensory." + s, type: "sensorySev", polarity: "need",
      domains: [{ d: "Sensory Processing", w: 1.5 }] },
    { field: "sensory." + s, type: "typicalStrength", polarity: "strength",
      domains: [{ d: "Sensory Processing", w: 0.75 }] },
  );
});
CONTRIBUTIONS.push(
  { field: "sensory.other", type: "countNeed", per: 0.25, floor: 0, polarity: "need",
    domains: [{ d: "Sensory Processing", w: 1 }] },
);

/* --- 4) Daily Living & Motor (§7) --- */
CONTRIBUTIONS.push(
  { field: "dailyLiving.eating", type: "map", polarity: "need",
    map: { "Independent": 1, "With support": 0.5, "Not yet": 0.15 },
    domains: [{ d: "Daily Living Skills", w: 2 }] },
  { field: "dailyLiving.dressing", type: "map", polarity: "need",
    map: { "Independent": 1, "With support": 0.5, "Not yet": 0.15 },
    domains: [{ d: "Daily Living Skills", w: 2 }] },
  { field: "dailyLiving.toileting", type: "map", polarity: "need",
    map: { "Fully trained": 1, "In progress": 0.5, "Not started": 0.15 }, /* "Not applicable" → unanswered */
    domains: [{ d: "Daily Living Skills", w: 2 }] },
  { field: "dailyLiving.sleep", type: "map", polarity: "need",
    map: { "Good": 0.9, "Variable": 0.5, "Poor": 0.15 },
    domains: [{ d: "Daily Living Skills", w: 1.5 }] },
  { field: "dailyLiving.safety", type: "map", polarity: "need",
    map: { "Strong": 0.9, "Developing": 0.5, "Limited": 0.15 },
    domains: [{ d: "Daily Living Skills", w: 1.5 }] },
  { field: "dailyLiving.multiStep", type: "map", polarity: "need",
    map: { "Yes": 0.9, "Sometimes": 0.5, "No": 0.15 },
    domains: [{ d: "Executive Function", w: 2 }, { d: "Daily Living Skills", w: 1 }] },
  { field: "dailyLiving.groupActivities", type: "map", polarity: "need",
    map: { "Yes": 0.9, "Sometimes": 0.5, "No": 0.15 },
    domains: [{ d: "Social Connection", w: 1.5 }, { d: "Learning & Play", w: 1 }] },
  { field: "dailyLiving.feeding", type: "map", polarity: "need",
    map: { "None": 0.9, "Mild": 0.5, "Significant": 0.15 },
    domains: [{ d: "Daily Living Skills", w: 1.5 }] },
  { field: "motor.gross", type: "countNeed", per: 0.15, floor: 0.1, polarity: "need",
    domains: [{ d: "Daily Living Skills", w: 1 }] },
  { field: "motor.fine", type: "countNeed", per: 0.15, floor: 0.1, polarity: "need",
    domains: [{ d: "Daily Living Skills", w: 1 }] },
  /* independence as strength evidence */
  { field: "dailyLiving.eating", type: "map", polarity: "strength",
    map: { "Independent": 1, "With support": 0.35, "Not yet": 0 },
    domains: [{ d: "Daily Living Skills", w: 1 }] },
  { field: "dailyLiving.dressing", type: "map", polarity: "strength",
    map: { "Independent": 1, "With support": 0.35, "Not yet": 0 },
    domains: [{ d: "Daily Living Skills", w: 1 }] },
  { field: "dailyLiving.toileting", type: "map", polarity: "strength",
    map: { "Fully trained": 1, "In progress": 0.35, "Not started": 0 },
    domains: [{ d: "Daily Living Skills", w: 1 }] },
  { field: "dailyLiving.sleep", type: "map", polarity: "strength",
    map: { "Good": 0.9, "Variable": 0.3, "Poor": 0 },
    domains: [{ d: "Daily Living Skills", w: 0.75 }] },
);

/* --- 5) Behaviour & Social (§9) --- */
const FREQ = { "Rarely": 0.85, "Sometimes": 0.55, "Often": 0.3, "Daily": 0.1 };
CONTRIBUTIONS.push(
  { field: "behaviour.challenges.meltdowns",     type: "map", map: FREQ, polarity: "need", domains: [{ d: "Emotional Regulation", w: 2 }] },
  { field: "behaviour.challenges.aggression",    type: "map", map: FREQ, polarity: "need", domains: [{ d: "Emotional Regulation", w: 1.5 }] },
  { field: "behaviour.challenges.selfInjury",    type: "map", map: FREQ, polarity: "need", domains: [{ d: "Emotional Regulation", w: 1.5 }] },
  { field: "behaviour.challenges.elopement",     type: "map", map: FREQ, polarity: "need", domains: [{ d: "Daily Living Skills", w: 1 }] },
  { field: "behaviour.challenges.anxiety",       type: "map", map: FREQ, polarity: "need", domains: [{ d: "Emotional Regulation", w: 2 }] },
  { field: "behaviour.challenges.rigidity",      type: "map", map: FREQ, polarity: "need", domains: [{ d: "Flexibility & Transitions", w: 2 }] },
  { field: "behaviour.challenges.emotional",     type: "map", map: FREQ, polarity: "need", domains: [{ d: "Emotional Regulation", w: 2 }] },
  { field: "behaviour.challenges.repetitive",    type: "map", map: FREQ, polarity: "need", domains: [{ d: "Flexibility & Transitions", w: 1 }, { d: "Sensory Processing", w: 1 }] },
  { field: "behaviour.challenges.defiance",      type: "map", map: FREQ, polarity: "need", domains: [{ d: "Flexibility & Transitions", w: 1 }] },
  { field: "behaviour.challenges.hyperactivity", type: "map", map: FREQ, polarity: "need", domains: [{ d: "Executive Function", w: 2 }] },
  { field: "behaviour.peersInterest", type: "map", polarity: "need",
    map: { "Yes": 0.9, "Sometimes": 0.5, "No": 0.15 },
    domains: [{ d: "Social Connection", w: 2 }] },
  { field: "behaviour.peersInteract", type: "map", polarity: "need",
    map: { "Yes": 0.9, "Sometimes": 0.5, "No": 0.15 },
    domains: [{ d: "Social Connection", w: 2 }] },
  { field: "behaviour.followsInstructions", type: "map", polarity: "need",
    map: { "Yes": 0.9, "Sometimes": 0.5, "No": 0.15 },
    domains: [{ d: "Communication", w: 1.5 }, { d: "Executive Function", w: 1 }] },
  /* positive social signals as strengths */
  { field: "behaviour.peersInterest", type: "map", polarity: "strength",
    map: { "Yes": 0.9, "Sometimes": 0.4, "No": 0 },
    domains: [{ d: "Social Connection", w: 1 }] },
  { field: "behaviour.peersInteract", type: "map", polarity: "strength",
    map: { "Yes": 0.9, "Sometimes": 0.4, "No": 0 },
    domains: [{ d: "Social Connection", w: 1 }] },
);

/* --- 6) Strengths & Interests (§10) + Education (§11) + milestones (§4) --- */
CONTRIBUTIONS.push(
  { field: "strengths.interests", type: "textPresence", value: 0.6, polarity: "strength",
    domains: [{ d: "Learning & Play", w: 1 }] },
  { field: "education.classroomSupport", type: "map", polarity: "need",
    map: { "None": 0.85, "Part-time aide": 0.5, "Full-time aide": 0.2 }, /* "Other" → unanswered */
    domains: [{ d: "Executive Function", w: 1 }, { d: "Learning & Play", w: 1 }] },
  { field: "birth.milestones.firstWord", type: "milestone", expected: 12, polarity: "need",
    domains: [{ d: "Communication", w: 0.75 }] },
  { field: "birth.milestones.phrases", type: "milestone", expected: 24, polarity: "need",
    domains: [{ d: "Communication", w: 0.75 }] },
  { field: "birth.milestones.sentences", type: "milestone", expected: 36, polarity: "need",
    domains: [{ d: "Communication", w: 0.75 }] },
  { field: "birth.milestones.walk", type: "milestone", expected: 15, polarity: "need",
    domains: [{ d: "Daily Living Skills", w: 0.5 }] },
);

export { CONTRIBUTIONS };