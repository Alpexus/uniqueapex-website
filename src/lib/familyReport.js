/* ============================================================
   familyReport.js — FAMILY-INTAKE-V3 (complete questionnaire)
   ------------------------------------------------------------
   The passport export is a COMPLETE professional intake form —
   every question from the passport questionnaire is printed,
   answered or not (unanswered text = "N/A", unanswered choices
   = empty checkboxes), exactly like the intake packages SLP/OT
   clinics send to parents. Fill our questionnaire once → hand
   this to any professional.
   · Field names verified against buildPassport() in passport.astro
   · Includes the 36-question skills frequency grids (the wheel
     questions) in their form sections
   · One "parent-reported support snapshot" wheel section
   · Completed-by + signature + date block
   · NO advice/guidance in this document (that lives in the app)
   ============================================================ */
import { DOMAINS, HUES, SCALE_QUESTIONS } from "../config/wheelConfig.js";
import { scoreWheel } from "./wheelScore.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const has = (v) => !(v == null || v === "" || (Array.isArray(v) && !v.length));
const fmt = (v) => Array.isArray(v) ? v.join(", ") : String(v);
const SHORTLBL = { "Communication": "Communication", "Social Connection": "Social", "Sensory Processing": "Sensory", "Flexibility & Transitions": "Flexibility", "Emotional Regulation": "Emotional", "Executive Function": "Executive", "Daily Living Skills": "Daily living", "Learning & Play": "Learning & play" };

/* ---------- form atoms (every question always renders) ---------- */
const line = (label, val, grow) => `<div class="fi-f${grow ? " grow" : ""}"><span class="fi-k">${esc(label)}:</span><span class="fi-v">${has(val) ? esc(fmt(val)) : '<i class="fi-na">N/A</i>'}</span></div>`;
const cb = (on) => `<span class="fi-cb${on ? " on" : ""}">${on ? '<svg viewBox="0 0 10 10" width="8" height="8"><path d="M1.5 5.5l2.2 2.2L8.5 2.5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>' : ""}</span>`;
const opts = (label, options, val, grow) => `<div class="fi-f${grow ? " grow" : ""}"><span class="fi-k">${esc(label)}:</span><span class="fi-opts">${options.map((o) => `<span class="fi-opt">${cb(val === o)}${esc(o)}</span>`).join("")}</span></div>`;
const checklist = (label, options, selected) => `<div class="fi-f grow" style="display:block"><span class="fi-k">${esc(label)}:</span><div class="fi-checks">${options.map((o) => `<span class="fi-opt">${cb((selected || []).includes(o))}${esc(o)}</span>`).join("")}</div></div>`;
const banner = (t) => `<div class="fi-banner">${esc(t)}</div>`;

/* ---------- the 0–4 frequency grid for the wheel scale questions ---------- */
const SCALE_LBLS = ["Never", "Rarely", "Sometimes", "Often", "Consistently"];
function scaleGrid(title, groupKeys, scales) {
  scales = scales || {};
  let rows = "";
  groupKeys.forEach((gk) => {
    (SCALE_QUESTIONS[gk] || []).forEach((q) => {
      const v = scales[q.id];
      rows += `<tr><td>${esc(q.label)}</td>${SCALE_LBLS.map((_, i) => `<td>${cb(String(v) === String(i))}</td>`).join("")}</tr>`;
    });
  });
  if (!rows) return "";
  return `<table class="fi-tbl"><tr><th>${esc(title)}</th>${SCALE_LBLS.map((l) => `<th>${l}</th>`).join("")}</tr>${rows}</table>`;
}

/* ---------- wheel ---------- */
function roseSVG(scored) {
  const cx = 150, cy = 128, r0 = 14, R = 92, seg = (2 * Math.PI) / DOMAINS.length;
  const pt = (r, a) => `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  let s = "";
  for (let k = 1; k <= 5; k++) s += `<circle cx="${cx}" cy="${cy}" r="${(r0 + (R - r0) * k / 5).toFixed(1)}" fill="none" stroke="#E9E4F5" stroke-width="1"/>`;
  DOMAINS.forEach((name, i) => {
    const a0 = -Math.PI / 2 + i * seg + 0.03, a1 = a0 + seg - 0.06;
    const sc = scored[name] ? scored[name].score : null;
    const frac = sc == null ? 0.1 : Math.max(0.12, sc / 100);
    const r = r0 + (R - r0) * frac;
    const fill = sc == null ? "#EDEAF6" : `hsl(${HUES[i]},60%,60%)`;
    s += `<path d="M${pt(r0, a0)} L${pt(r, a0)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${pt(r, a1)} L${pt(r0, a1)} A${r0},${r0} 0 0 0 ${pt(r0, a0)} Z" fill="${fill}" stroke="#fff" stroke-width="1.2"/>`;
    const mid = a0 + (seg - 0.06) / 2;
    const lx = cx + (R + 11) * Math.cos(mid), ly = cy + (R + 11) * Math.sin(mid);
    const anchor = Math.cos(mid) > 0.25 ? "start" : (Math.cos(mid) < -0.25 ? "end" : "middle");
    s += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="8.5" fill="#7B7491" text-anchor="${anchor}" dominant-baseline="middle">${SHORTLBL[name]}</text>`;
  });
  for (let k = 1; k <= 4; k++) s += `<circle cx="${cx}" cy="${cy}" r="${(r0 + (R - r0) * k / 5).toFixed(1)}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.1"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r0}" fill="#fff" stroke="#EAE7F3"/>`;
  return `<svg viewBox="0 0 300 246" width="238" role="img">${s}</svg>`;
}

export function buildReportHTML(p, included) {
  p = p || {};
  const inc = (k) => !included || included[k] !== false;
  const cp = p.childProfile || {}, hh = p.household || {}, dg = p.diagnosis || {}, bi = p.birth || {},
        co = p.communication || {}, se = p.sensory || {}, dl = p.dailyLiving || {}, mo = p.motor || {},
        hl = p.health || {}, bh = p.behaviour || {}, st = p.strengths || {}, ed = p.education || {},
        sv = p.services || {}, gl = p.goals || {}, sc = p.scales || {};
  const bch = bh.challenges || {};
  const name = [cp.firstName, cp.lastName].filter(Boolean).join(" ") || "";
  const today = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
  const scored = scoreWheel(p);
  const anyWheel = DOMAINS.some((n) => scored[n] && scored[n].score != null);
  const YN = ["Yes", "No"];
  const YSN = ["Yes", "Sometimes", "No"];

  const css = `<style>
    #print-view{font-family:'Inter',system-ui,sans-serif;color:#221B36;font-size:11px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .fi-top{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;border-bottom:2.5px solid #6D28D9;padding-bottom:10px;margin-bottom:14px}
    .fi-top h1{font-size:24px;margin:0;color:#3C3489;letter-spacing:-.01em;font-weight:800;line-height:1.1}
    .fi-top .fi-tag{font-size:10px;color:#7B7491;margin:4px 0 0}
    .fi-top img{height:36px;display:block}
    .fi-banner{background:#DDD6FA;color:#3C3489;font-weight:700;font-size:12px;text-align:center;border-radius:7px;padding:5px 12px;margin:13px 0 8px;page-break-after:avoid}
    .fi-sub{font-size:10px;font-weight:700;color:#6D28D9;margin:9px 0 3px;text-transform:uppercase;letter-spacing:.05em;page-break-after:avoid}
    .fi-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px 26px}
    .fi-grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px 20px}
    .fi-f{display:flex;align-items:baseline;gap:6px;padding:3px 0;min-width:0}
    .fi-f.grow{grid-column:1/-1}
    .fi-k{color:#494060;flex-shrink:0}
    .fi-v{flex:1;border-bottom:1px solid #C9C2E8;font-weight:600;padding:0 2px 1px;min-height:13px}
    .fi-na{color:#B7B0CC;font-weight:500;font-size:10px}
    .fi-opts{display:flex;flex-wrap:wrap;gap:3px 12px;flex:1}
    .fi-opt{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
    .fi-checks{display:flex;flex-wrap:wrap;gap:4px 14px;padding:3px 0 1px}
    .fi-cb{display:inline-flex;align-items:center;justify-content:center;width:10px;height:10px;border:1.1px solid #B7AEDC;border-radius:2.5px;background:#F5F3FF;flex-shrink:0}
    .fi-cb.on{background:#6D28D9;border-color:#6D28D9}
    .fi-tbl{width:100%;border-collapse:collapse;margin:3px 0 6px;page-break-inside:avoid}
    .fi-tbl th{font-size:9px;color:#7B7491;font-weight:600;text-align:center;padding:2px 3px;background:#F5F3FF}
    .fi-tbl th:first-child{text-align:left;border-radius:4px 0 0 4px}
    .fi-tbl th:last-child{border-radius:0 4px 4px 0}
    .fi-tbl td{padding:2px 3px;border-top:1px solid #F0EDF8;text-align:center;font-size:10.5px}
    .fi-tbl td:first-child{text-align:left;color:#494060}
    .fi-sense{page-break-inside:avoid;border:1px solid #EFEBF9;border-radius:7px;padding:6px 10px;margin:4px 0}
    .fi-sense-h{display:flex;align-items:center;gap:10px;margin-bottom:2px}
    .fi-sense-h b{font-size:11px}
    .fi-sense-h .fi-opt{font-size:10px;color:#494060}
    .fi-wheelrow{display:flex;gap:20px;align-items:center;page-break-inside:avoid}
    .fi-legend{flex:1}
    .fi-legend p{margin:0 0 3px;font-size:11px;display:flex;align-items:center;gap:6px}
    .fi-legend .h{font-weight:700;font-size:10.5px;margin:0 0 4px}
    .fi-legend .h.a{color:#A8650A}.fi-legend .h.g{color:#0E8F66;margin-top:9px}
    .fi-pill{font-size:9px;font-weight:600;padding:1px 7px;border-radius:999px}
    .fi-pill.amber{background:#FBF2E2;color:#A8650A}.fi-pill.green{background:#E8F6F0;color:#0E8F66}
    .fi-small{font-size:9px;color:#A9A3BC;line-height:1.5;margin:5px 0 0}
    .fi-sign{display:flex;gap:26px;margin-top:14px;page-break-inside:avoid}
    .fi-sign .fi-f{flex:1}
    .fi-statement{font-size:10px;color:#494060;line-height:1.5;margin:14px 0 3px}
    .fi-foot{display:flex;justify-content:space-between;border-top:1px solid #EAE7F3;margin-top:14px;padding-top:7px}
    .fi-foot span{font-size:9px;color:#A9A3BC}
  </style>`;

  let html = css + `<div class="fi-top">
    <div>
      <h1>FAMILY PASSPORT</h1>
      <p class="fi-tag">Completed by the family${cp.firstName ? " for " + esc(cp.firstName) + "'s care team" : ""} · Confidential</p>
    </div>
    <img src="/logo3.png" alt="UniqueApex"/>
  </div>`;

  /* ============ 1 · CHILD INFORMATION ============ */
  if (inc("childProfile")) html += `${banner("Child information")}<div class="fi-grid">
    ${line("First name", cp.firstName)}${line("Last name", cp.lastName)}
    ${line("Date of birth", cp.dob)}${line("Gender", cp.gender)}
    ${line("City", cp.city)}${line("Country", cp.country)}
    ${line("Health insurance #", cp.healthInsurance)}${line("Home languages", cp.homeLanguages)}
    ${line("Understands best in", cp.bestLanguage)}${line("Date prepared", today)}
  </div>`;

  /* ============ 2 · PARENTS & HOUSEHOLD ============ */
  if (inc("household")) html += `${banner("Parents & household")}<div class="fi-grid">
    ${line("Guardian 1 name", hh.g1name)}${line("Relationship", hh.g1rel)}
    ${line("Email", hh.g1email)}${line("Phone", hh.g1phone)}
    ${line("Guardian 2 name", hh.g2name)}${line("Relationship", hh.g2rel)}
    ${line("Email", hh.g2email)}${line("Phone", hh.g2phone)}
    ${opts("Custody", ["Guardians together", "Joint custody", "Single custody", "Other"], hh.custody, true)}
    ${opts("Family status", ["Married", "Living together", "Separated", "Divorced", "Single", "Other"], hh.maritalStatus, true)}
    ${checklist("Child lives with", ["Both parents", "Mother", "Father", "Siblings", "Grandparents", "Foster family", "Other"], hh.livesWith)}
    ${line("Siblings (names / ages)", hh.siblings, true)}
    ${opts("Receives government funding", YN, hh.funding)}${line("Funding type", hh.fundingType)}
  </div>`;

  /* ============ 3 · DIAGNOSIS & FAMILY HISTORY ============ */
  if (inc("diagnosis")) html += `${banner("Diagnosis & family history")}
    ${opts("Status", ["Diagnosed", "Assessment Pending", "Self-Identified Concerns"], dg.status, true)}
    ${checklist("Diagnoses", ["Autism", "ADHD", "Speech / Language Disorder", "Global Developmental Delay", "Intellectual Disability", "Learning Difficulty", "Dyspraxia / DCD", "Sensory Processing", "Anxiety", "Depression", "OCD", "Tourette's / Tics", "Epilepsy / Seizures", "Genetic Condition", "Other"], dg.diagnoses)}
    <div class="fi-grid">${line("Diagnosed / referred by", dg.diagnosedBy)}${line("Date of diagnosis", dg.date)}${line("Awaiting assessment", dg.awaiting, true)}</div>
    ${checklist("Family history of", ["Developmental / language delay", "Learning difficulties", "Autism", "ADHD", "Anxiety", "Depression", "OCD", "Bipolar", "Tourette's / tics", "Intellectual disability", "Epilepsy / seizures", "Genetic disorder", "Substance use"], dg.familyHistory)}
    ${line("Family history notes", dg.familyHistoryNotes, true)}`;

  /* ============ 4 · BIRTH & DEVELOPMENT ============ */
  if (inc("birth")) {
    const ms = bi.milestones || {};
    html += `${banner("Birth & development")}<div class="fi-grid">
      ${line("Pregnancy", bi.pregnancy)}${line("Weeks at birth", bi.gestation)}
      ${line("Birth weight", bi.birthWeight)}${line("Complications", bi.complications)}
      ${opts("Lost previously acquired skills", YN, bi.regression)}${line("Details", bi.regressionNotes)}
    </div>
    <p class="fi-sub">Developmental milestones — age reached</p>
    <div class="fi-grid3">
      ${line("Sat unsupported", ms.sit)}${line("Crawled", ms.crawl)}${line("Walked", ms.walk)}
      ${line("First word", ms.firstWord)}${line("First phrases", ms.phrases)}${line("First sentences", ms.sentences)}
      ${line("Toilet trained (day)", ms.toiletDay)}${line("Toilet trained (night)", ms.toiletNight)}
    </div>`;
  }

  /* ============ 5 · COMMUNICATION ============ */
  if (inc("communication")) html += `${banner("Communication")}
    ${opts("Communication style", ["Fluent Verbal", "Verbal", "Limited Verbal", "Non-Speaking"], co.style, true)}
    ${checklist("Primary means of communication", ["Words", "Sentences", "Sounds", "Pictures (PECS)", "Sign language", "Device / AAC app", "No primary means yet"], co.means)}
    ${opts("Can express needs", ["Consistently", "Sometimes", "Rarely"], co.canExpressNeeds, true)}
    ${checklist("Current challenges", ["Requesting", "Conversation", "Question Answering", "Emotional Expression", "Social Communication"], co.challenges)}
    ${scaleGrid("Communication skills — how often does your child…", ["communication"], sc)}`;

  /* ============ 6 · SENSORY PROFILE ============ */
  if (inc("sensory")) {
    const SENSES = [
      ["auditory", "Sound", ["Covers ears at loud sounds", "Distressed by sudden noises", "Bothered by background noise", "Seeks loud sounds / makes noise", "Doesn't respond to sounds/name"]],
      ["visual", "Sight", ["Bothered by bright lights", "Avoids eye contact", "Fascinated by spinning/lights", "Visual clutter overwhelms", "Misses visual details"]],
      ["tactile", "Touch", ["Bothered by clothing tags/textures", "Dislikes being touched", "Distressed by haircuts/nails", "Seeks deep pressure / tight hugs", "Mouths or chews objects", "High pain tolerance"]],
      ["oral", "Taste & mouth", ["Very limited food textures", "Strong food preferences", "Gags easily", "Seeks crunchy/chewy foods", "Chews non-food items"]],
      ["smell", "Smell", ["Bothered by smells", "Seeks out smells", "Doesn't notice strong smells"]],
      ["movement", "Movement & balance", ["Seeks spinning/swinging", "Avoids movement / cautious", "Fearful when feet leave ground", "Constantly moving", "Poor balance"]],
      ["body", "Body awareness", ["Bumps into things / clumsy", "Unaware of body position", "Uses too much/little force", "Seeks crashing / rough play"]],
    ];
    html += banner("Sensory profile");
    SENSES.forEach(([key, label, signs]) => {
      const o = se[key] || {};
      html += `<div class="fi-sense">
        <div class="fi-sense-h"><b>${label}</b>
          <span class="fi-opt">${cb(!!o.typical)}No concerns / typical</span>
          <span class="fi-opt" style="margin-left:auto">Severity:</span>
          ${["Mild", "Moderate", "Significant"].map((s) => `<span class="fi-opt" style="font-size:10px">${cb(!o.typical && o.severity === s)}${s}</span>`).join("")}
        </div>
        <div class="fi-checks">${signs.map((sg) => `<span class="fi-opt" style="font-size:10px">${cb(!o.typical && (o.signs || []).includes(sg))}${esc(sg)}</span>`).join("")}</div>
      </div>`;
    });
    html += `${checklist("Other signs", ["Insensitive to temperature", "High pain tolerance", "Strong difficulty with transitions"], se.other)}
    ${line("Sensory notes", se.notes, true)}`;
  }

  /* ============ 7 · DAILY LIVING & MOTOR ============ */
  if (inc("dailyLiving")) html += `${banner("Daily living & motor")}<div class="fi-grid">
    ${opts("Independent eating", ["Independent", "With support", "Not yet"], dl.eating)}
    ${opts("Independent dressing", ["Independent", "With support", "Not yet"], dl.dressing)}
    ${opts("Toilet training", ["Fully trained", "In progress", "Not started"], dl.toileting)}
    ${opts("Sleep quality", ["Good", "Variable", "Poor"], dl.sleep)}
    ${opts("Safety awareness", ["Strong", "Developing", "Limited"], dl.safety)}
    ${opts("Multi-step instructions", YSN, dl.multiStep)}
    ${opts("Group activities", YSN, dl.groupActivities)}
    ${opts("Feeding difficulties", ["None", "Mild", "Significant"], dl.feeding)}
    ${line("Dietary restrictions", dl.dietaryRestrictions, true)}
  </div>
  ${checklist("Gross motor observations", ["Walks on tiptoes", "Clumsy / bumps into things", "Poor balance", "Low muscle tone", "Difficulty with stairs", "Difficulty running or jumping", "Delayed gross-motor milestones"], mo.gross)}
  ${checklist("Fine motor observations", ["Difficulty with handwriting / drawing", "Difficulty using utensils", "Difficulty with buttons / zippers", "Difficulty using scissors", "Weak or awkward pencil grip"], mo.fine)}
  ${line("Motor notes", mo.notes, true)}
  ${scaleGrid("Focus & organization — how often does your child…", ["executive"], sc)}`;

  /* ============ 8 · HEALTH & MEDICAL ============ */
  if (inc("health")) html += `${banner("Health & medical")}<div class="fi-grid">
    ${opts("Dominant hand", ["Right", "Left", "Both"], hl.handedness)}${line("Pediatrician / GP", hl.pediatrician)}
    ${line("Specialists", hl.specialists, true)}
    ${line("Food allergies", hl.allergyFood)}${line("Environmental allergies", hl.allergyEnv)}
    ${line("Other allergies", hl.allergyOther)}${line("Allergy treatment", hl.allergyTreatment)}
    ${line("Medical conditions", hl.medicalConditions, true)}
    ${line("Current medications", hl.medications, true)}
    ${line("Past medications", hl.pastMedications, true)}
    ${line("Surgeries / hospitalizations", hl.surgeries, true)}
    ${opts("Had an eye exam", YN, hl.hadEyeExam)}${line("Date of last eye exam", hl.lastEyeExam)}
    ${opts("Wears glasses", YN, hl.glasses)}${line("Eye exam notes", hl.eyeNotes)}
    ${opts("Had a hearing test", YN, hl.hadHearingTest)}${line("Date of last hearing test", hl.lastHearingTest)}
    ${opts("Recurrent ear infections / PE tubes", YN, hl.earInfections)}${line("Hearing notes", hl.hearingNotes)}
  </div>`;

  /* ============ 9 · BEHAVIOUR & SOCIAL ============ */
  if (inc("behaviour")) {
    const BL = { meltdowns: "Meltdowns", aggression: "Aggression toward others", selfInjury: "Self-injury", elopement: "Elopement / flight risk", anxiety: "Anxiety", rigidity: "Rigidity / difficulty with change", emotional: "Emotional regulation difficulty", repetitive: "Repetitive behaviours", defiance: "Defiance", hyperactivity: "Hyperactivity" };
    const freqs = ["Rarely", "Sometimes", "Often", "Daily"];
    html += `${banner("Behaviour & social")}
      <table class="fi-tbl"><tr><th>How often does each happen?</th>${freqs.map((f) => `<th>${f}</th>`).join("")}<th>N/A</th></tr>
      ${Object.keys(BL).map((k) => `<tr><td>${BL[k]}</td>${freqs.map((f) => `<td>${cb(bch[k] === f)}</td>`).join("")}<td>${cb(!has(bch[k]))}</td></tr>`).join("")}</table>
      <div class="fi-grid">
        ${line("Known triggers", bh.triggers, true)}
        ${line("Strategies that help at home", bh.strategies, true)}
        ${opts("Interest in peers", YSN, bh.peersInterest)}${opts("Interacts with peers", YSN, bh.peersInteract)}
        ${opts("Follows instructions", YSN, bh.followsInstructions)}${opts("Suspended / expelled", YN, bh.suspended)}
        ${line("Notes", bh.suspendedNotes, true)}
      </div>
      ${scaleGrid("Social connection — how often does your child…", ["social"], sc)}
      ${scaleGrid("Flexibility & transitions — how often does your child…", ["flexibility"], sc)}
      ${scaleGrid("Emotional regulation — how often does your child…", ["emotional"], sc)}`;
  }

  /* ============ 10 · STRENGTHS & INTERESTS ============ */
  if (inc("strengths")) html += `${banner("Strengths & interests")}
    ${line("Strengths", st.strengths, true)}
    ${line("Interests & favourite activities", st.interests, true)}
    ${line("Dislikes / frustrations", st.dislikes, true)}
    ${scaleGrid("Learning & play — how often does your child…", ["learning"], sc)}`;

  /* ============ 11 · EDUCATION ============ */
  if (inc("education")) html += `${banner("Education")}<div class="fi-grid">
    ${line("School name", ed.schoolName)}${opts("Type", ["Mainstream", "Specialized", "Homeschool", "Daycare / preschool", "Not in school yet", "Other"], ed.schoolType, true)}
    ${line("Grade", ed.grade)}${line("School board", ed.schoolBoard)}
    ${opts("Has IEP / intervention plan", YN, ed.hasIEP)}
    ${opts("Classroom support", ["None", "Part-time aide", "Full-time aide", "Other"], ed.classroomSupport)}
    ${line("Agency support", ed.agencySupport, true)}
    ${line("Academic concerns", ed.challenges, true)}
    ${line("School strengths", ed.strengths, true)}
    ${line("Upcoming transition", ed.upcomingTransition)}${opts("Flight risk at school", YN, ed.flightRisk)}
  </div>`;

  /* ============ 12 · THERAPY & SERVICES ============ */
  if (inc("therapy")) {
    const TYPES = ["Speech Therapy", "Occupational Therapy", "ABA / Behaviour", "Psychology", "Psychiatry", "Physiotherapy", "Social Skills Group", "Infant Stimulation", "Other"];
    const byType = {};
    (p.therapy || []).forEach((t) => { if (t && t.type) byType[t.type] = t; });
    html += `${banner("Therapy & services")}
      ${checklist("Current services", TYPES, Object.keys(byType))}`;
    Object.keys(byType).forEach((k) => {
      const t = byType[k];
      html += `<div class="fi-grid" style="margin:2px 0 4px">
        ${line(k + " — provider", t.provider)}${line("Frequency", t.frequency)}
        ${line("Start date", t.startDate)}${line("Progress", t.progress)}
        ${line("Goals", t.goals, true)}
      </div>`;
    });
    html += `<div class="fi-grid">
      ${line("Past services", sv.pastServices, true)}
      ${opts("Currently on a waitlist", YN, sv.onWaitlist)}${line("Waitlist details", sv.waitlistDetails)}
    </div>`;
  }

  /* ============ 13 · GOALS & FOCUS ============ */
  if (inc("goals")) html += `${banner("Goals & current priorities")}
    ${line("Main concerns right now", gl.mainConcerns, true)}
    ${checklist("Family priorities", ["Communication", "Friendships", "Emotional Regulation", "School Success", "Independence", "Daily Living Skills", "Transition Planning", "Employment Preparation"], gl.priorities)}
    ${line("Focus areas", gl.focusAreas, true)}
    ${line("Other goals", gl.other, true)}`;

  /* ============ SUPPORT SNAPSHOT ============ */
  if (anyWheel) {
    const needs = DOMAINS.filter((n) => scored[n].score != null).sort((a, b) => scored[b].score - scored[a].score);
    const shine = DOMAINS.filter((n) => scored[n].strength != null && scored[n].strength >= 45).sort((a, b) => scored[b].strength - scored[a].strength);
    const dcolor = (n) => `hsl(${HUES[DOMAINS.indexOf(n)]},62%,48%)`;
    const li = (n, pill, txt) => `<p><span style="width:7px;height:7px;border-radius:50%;background:${dcolor(n)};display:inline-block"></span>${SHORTLBL[n]} <span class="fi-pill ${pill}">${esc(txt)}</span></p>`;
    html += `${banner("Parent-reported support snapshot")}
      <div class="fi-wheelrow">${roseSVG(scored)}
        <div class="fi-legend">
          <p class="h a">Most support helpful now</p>${needs.slice(0, 3).map((n) => li(n, "amber", "more support")).join("")}
          <p class="h g">Relative strengths</p>${(shine.length ? shine : needs.slice().reverse()).slice(0, 3).map((n) => li(n, "green", "going strong")).join("")}
        </div>
      </div>
      <p class="fi-small">Petal length reflects how much support the parent reports is helpful in each area today, derived from the frequency grids in this form. Parent-reported snapshot — not a standardized assessment or diagnosis.</p>`;
  }

  /* ============ SIGNATURE ============ */
  html += `<p class="fi-statement">Completed by the parent/guardian below. The information in this form reflects the family's observations and records, provided to support ${esc(cp.firstName || "the child")}'s care team.</p>
  <div class="fi-sign">
    ${line("Completed by", hh.g1name)}
    ${line("Relationship to child", hh.g1rel)}
    ${line("Date", today)}
    <div class="fi-f"><span class="fi-k">Signature:</span><span class="fi-v">&nbsp;</span></div>
  </div>
  <div class="fi-foot"><span>Generated from the Family Passport · uniqueapex.com</span><span>${esc(name)} · ${today}</span></div>`;

  return html;
}
