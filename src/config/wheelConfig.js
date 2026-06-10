// ════════════════════════════════════════════════════════════════════════
// UniqueApex — Wheel configuration (single source of truth)
// Add a question here → it renders in the form AND feeds the wheel.
// No scoring logic needs rewriting when you add or move a question.
// ════════════════════════════════════════════════════════════════════════

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

// 0–4 ability questions, grouped by the form section they render in.
// Scale: 0 Never · 1 Rarely · 2 Sometimes · 3 Often · 4 Consistently
// reverse:true means a HIGH answer indicates MORE support need (e.g. anxiety).
export const SCALE_QUESTIONS = {
  communication: [
    { id: "comm_answersSimple",  label: "Answers simple questions appropriately" },
    { id: "comm_answersOpen",    label: "Answers open-ended questions appropriately" },
    { id: "comm_backForth",      label: "Maintains back-and-forth conversation" },
    { id: "comm_understandsInstr",label:"Understands age-appropriate instructions" },
    { id: "comm_exprFeelings",   label: "Uses communication to express feelings" },
    { id: "comm_requestHelp",    label: "Uses communication to request help" },
  ],
  social: [
    { id: "soc_respondsName",    label: "Responds when name is called" },
    { id: "soc_sharesEnjoy",     label: "Shows or shares things they enjoy with others" },
    { id: "soc_takesTurns",      label: "Takes turns during activities or games" },
    { id: "soc_understandsEmo",  label: "Understands other people's emotions" },
    { id: "soc_initiates",       label: "Initiates interaction with others" },
    { id: "soc_maintains",       label: "Maintains interaction once engaged" },
  ],
  flexibility: [
    { id: "flex_unexpected",     label: "Handles unexpected changes in routine" },
    { id: "flex_transitions",    label: "Transitions between activities without significant distress" },
    { id: "flex_waiting",        label: "Tolerates waiting" },
    { id: "flex_interruptions",  label: "Handles interruptions" },
    { id: "flex_newEnv",         label: "Adapts to new environments" },
    { id: "flex_changePlans",    label: "Accepts changes in plans" },
  ],
  emotional: [
    { id: "emo_recovers",        label: "Recovers after becoming upset" },
    { id: "emo_identifies",      label: "Identifies own feelings" },
    { id: "emo_coping",          label: "Uses coping strategies when upset" },
    { id: "emo_anxious",         label: "Appears anxious in everyday situations", reverse: true },
    { id: "emo_limits",          label: "Accepts limits or boundaries" },
    { id: "emo_frustration",     label: "Manages frustration appropriately" },
  ],
  executive: [
    { id: "exec_attention",      label: "Maintains attention on tasks" },
    { id: "exec_completes",      label: "Completes tasks independently" },
    { id: "exec_switches",       label: "Switches between tasks when required" },
    { id: "exec_multiStep",      label: "Remembers multi-step instructions" },
    { id: "exec_organizes",      label: "Organizes materials or belongings" },
    { id: "exec_begins",         label: "Begins tasks without excessive prompting" },
  ],
  learning: [
    { id: "learn_pretend",       label: "Engages in imaginative or pretend play" },
    { id: "learn_independent",   label: "Learns new skills independently" },
    { id: "learn_problemSolve",  label: "Solves simple problems independently" },
    { id: "learn_gameRules",     label: "Follows game rules" },
    { id: "learn_curiosity",     label: "Shows curiosity about new topics" },
    { id: "learn_persists",      label: "Persists when learning something difficult" },
  ],
};

// Flat list of all scale-question ids (used by build/load + scoring)
export const SCALE_IDS = Object.keys(SCALE_QUESTIONS)
  .reduce((a, k) => a.concat(SCALE_QUESTIONS[k].map((q) => q.id)), []);

// Map of scale id → {reverse} for the scorer
export const SCALE_META = Object.keys(SCALE_QUESTIONS)
  .reduce((a, k) => { SCALE_QUESTIONS[k].forEach((q) => { a[q.id] = { reverse: !!q.reverse }; }); return a; }, {});

// ── THE MAPPING TABLE ──────────────────────────────────────────────────────
// field: dotted path into passport data
// domain: one of DOMAINS
// weight: 3 critical · 2 important · 1 supporting
// type: which scorer to apply (param for parameterised ones)
// All scorers return ABILITY 0..1 (1 = strong/independent, 0 = needs most support),
// or null when unanswered. Support-need view = 1 − ability.
export const CONTRIBUTIONS = [
  // ---------------- COMMUNICATION ----------------
  { field: "communication.style",           domain: "Communication", weight: 3, type: "commStyle" },
  { field: "communication.canExpressNeeds", domain: "Communication", weight: 3, type: "expressNeeds" },
  { field: "communication.challenges",      domain: "Communication", weight: 2, type: "challengeCount", param: 5 },
  { field: "communication.means",           domain: "Communication", weight: 1, type: "hasNoMeans" },
  { field: "scales.comm_answersSimple",     domain: "Communication", weight: 2, type: "scale4" },
  { field: "scales.comm_answersOpen",       domain: "Communication", weight: 2, type: "scale4" },
  { field: "scales.comm_backForth",         domain: "Communication", weight: 3, type: "scale4" },
  { field: "scales.comm_understandsInstr",  domain: "Communication", weight: 3, type: "scale4" },
  { field: "scales.comm_exprFeelings",      domain: "Communication", weight: 2, type: "scale4" },
  { field: "scales.comm_requestHelp",       domain: "Communication", weight: 2, type: "scale4" },
  { field: "birth.milestones.firstWord",    domain: "Communication", weight: 1, type: "milestone", param: 12 },
  { field: "birth.milestones.sentences",    domain: "Communication", weight: 1, type: "milestone", param: 36 },

  // ---------------- SOCIAL CONNECTION ----------------
  { field: "behaviour.peersInterest",       domain: "Social Connection", weight: 2, type: "ysnAble" },
  { field: "behaviour.peersInteract",       domain: "Social Connection", weight: 2, type: "ysnAble" },
  { field: "communication.challenges",      domain: "Social Connection", weight: 1, type: "hasAny", param: ["Social Communication", "Conversation"] },
  { field: "scales.soc_respondsName",       domain: "Social Connection", weight: 3, type: "scale4" },
  { field: "scales.soc_sharesEnjoy",        domain: "Social Connection", weight: 3, type: "scale4" },
  { field: "scales.soc_takesTurns",         domain: "Social Connection", weight: 2, type: "scale4" },
  { field: "scales.soc_understandsEmo",     domain: "Social Connection", weight: 2, type: "scale4" },
  { field: "scales.soc_initiates",          domain: "Social Connection", weight: 3, type: "scale4" },
  { field: "scales.soc_maintains",          domain: "Social Connection", weight: 2, type: "scale4" },

  // ---------------- SENSORY PROCESSING ----------------
  { field: "sensory.auditory", domain: "Sensory Processing", weight: 2, type: "sensorySev" },
  { field: "sensory.visual",   domain: "Sensory Processing", weight: 2, type: "sensorySev" },
  { field: "sensory.tactile",  domain: "Sensory Processing", weight: 2, type: "sensorySev" },
  { field: "sensory.oral",     domain: "Sensory Processing", weight: 2, type: "sensorySev" },
  { field: "sensory.smell",    domain: "Sensory Processing", weight: 1, type: "sensorySev" },
  { field: "sensory.movement", domain: "Sensory Processing", weight: 2, type: "sensorySev" },
  { field: "sensory.body",     domain: "Sensory Processing", weight: 2, type: "sensorySev" },
  { field: "sensory.other",    domain: "Sensory Processing", weight: 1, type: "countNeed", param: 3 },
  { field: "dailyLiving.feeding", domain: "Sensory Processing", weight: 1, type: "feeding" },

  // ---------------- FLEXIBILITY & TRANSITIONS ----------------
  { field: "behaviour.challenges.rigidity",   domain: "Flexibility & Transitions", weight: 2, type: "freqChallenge" },
  { field: "behaviour.challenges.repetitive", domain: "Flexibility & Transitions", weight: 1, type: "freqChallenge" },
  { field: "scales.flex_unexpected",    domain: "Flexibility & Transitions", weight: 3, type: "scale4" },
  { field: "scales.flex_transitions",   domain: "Flexibility & Transitions", weight: 3, type: "scale4" },
  { field: "scales.flex_waiting",       domain: "Flexibility & Transitions", weight: 2, type: "scale4" },
  { field: "scales.flex_interruptions", domain: "Flexibility & Transitions", weight: 2, type: "scale4" },
  { field: "scales.flex_newEnv",        domain: "Flexibility & Transitions", weight: 2, type: "scale4" },
  { field: "scales.flex_changePlans",   domain: "Flexibility & Transitions", weight: 2, type: "scale4" },

  // ---------------- EMOTIONAL REGULATION ----------------
  { field: "behaviour.challenges.meltdowns", domain: "Emotional Regulation", weight: 2, type: "freqChallenge" },
  { field: "behaviour.challenges.emotional", domain: "Emotional Regulation", weight: 2, type: "freqChallenge" },
  { field: "behaviour.challenges.anxiety",   domain: "Emotional Regulation", weight: 1, type: "freqChallenge" },
  { field: "scales.emo_recovers",     domain: "Emotional Regulation", weight: 3, type: "scale4" },
  { field: "scales.emo_identifies",   domain: "Emotional Regulation", weight: 2, type: "scale4" },
  { field: "scales.emo_coping",       domain: "Emotional Regulation", weight: 3, type: "scale4" },
  { field: "scales.emo_anxious",      domain: "Emotional Regulation", weight: 2, type: "scale4rev" },
  { field: "scales.emo_limits",       domain: "Emotional Regulation", weight: 2, type: "scale4" },
  { field: "scales.emo_frustration",  domain: "Emotional Regulation", weight: 3, type: "scale4" },

  // ---------------- EXECUTIVE FUNCTION ----------------
  { field: "dailyLiving.multiStep",            domain: "Executive Function", weight: 2, type: "ysnAble" },
  { field: "behaviour.challenges.hyperactivity",domain: "Executive Function", weight: 1, type: "freqChallenge" },
  { field: "education.classroomSupport",       domain: "Executive Function", weight: 1, type: "classroomSupport" },
  { field: "scales.exec_attention",   domain: "Executive Function", weight: 3, type: "scale4" },
  { field: "scales.exec_completes",   domain: "Executive Function", weight: 3, type: "scale4" },
  { field: "scales.exec_switches",    domain: "Executive Function", weight: 2, type: "scale4" },
  { field: "scales.exec_multiStep",   domain: "Executive Function", weight: 3, type: "scale4" },
  { field: "scales.exec_organizes",   domain: "Executive Function", weight: 2, type: "scale4" },
  { field: "scales.exec_begins",      domain: "Executive Function", weight: 2, type: "scale4" },

  // ---------------- DAILY LIVING SKILLS ----------------
  { field: "dailyLiving.eating",    domain: "Daily Living Skills", weight: 3, type: "independence" },
  { field: "dailyLiving.dressing",  domain: "Daily Living Skills", weight: 3, type: "independence" },
  { field: "dailyLiving.toileting", domain: "Daily Living Skills", weight: 3, type: "independence" },
  { field: "dailyLiving.sleep",     domain: "Daily Living Skills", weight: 1, type: "quality" },
  { field: "dailyLiving.safety",    domain: "Daily Living Skills", weight: 2, type: "quality" },
  { field: "motor.gross",           domain: "Daily Living Skills", weight: 2, type: "countNeed", param: 7 },
  { field: "motor.fine",            domain: "Daily Living Skills", weight: 2, type: "countNeed", param: 5 },

  // ---------------- LEARNING & PLAY ----------------
  { field: "dailyLiving.groupActivities", domain: "Learning & Play", weight: 2, type: "ysnAble" },
  { field: "scales.learn_pretend",      domain: "Learning & Play", weight: 3, type: "scale4" },
  { field: "scales.learn_independent",  domain: "Learning & Play", weight: 3, type: "scale4" },
  { field: "scales.learn_problemSolve", domain: "Learning & Play", weight: 2, type: "scale4" },
  { field: "scales.learn_gameRules",    domain: "Learning & Play", weight: 2, type: "scale4" },
  { field: "scales.learn_curiosity",    domain: "Learning & Play", weight: 2, type: "scale4" },
  { field: "scales.learn_persists",     domain: "Learning & Play", weight: 2, type: "scale4" },
];
