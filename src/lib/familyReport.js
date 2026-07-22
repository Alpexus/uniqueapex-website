/* ============================================================
   familyReport.js — FAMILY-INTAKE-V4 (bilingual)
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
   V4: prints in the active language (window.uaLang). Labels live
   in src/i18n/lib-report.js; option VALUES stay canonical English
   for checkbox matching and are DISPLAYED via lib-terms (dv).
   ============================================================ */
import { DOMAINS, HUES, SCALE_QUESTIONS } from "../config/wheelConfig.js";
import { scoreWheel } from "./wheelScore.js";
import { makeT, tpl, dv, ofName, domainShort, senseLabel, scaleLabel, libLocale } from "./libI18n.js";
import DICT from "../i18n/lib-report.js";

let _t = makeT(DICT); /* refreshed on every buildReportHTML call */

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const has = (v) => !(v == null || v === "" || (Array.isArray(v) && !v.length));
const fmt = (v) => Array.isArray(v) ? v.map((x) => dv(x)).join(", ") : String(dv(v));

/* ---------- form atoms (every question always renders) ---------- */
const line = (label, val, grow) => `<div class="fi-f${grow ? " grow" : ""}"><span class="fi-k">${esc(label)}:</span><span class="fi-v">${has(val) ? esc(fmt(val)) : '<i class="fi-na">' + esc(_t("na")) + "</i>"}</span></div>`;
const cb = (on) => `<span class="fi-cb${on ? " on" : ""}">${on ? '<svg viewBox="0 0 10 10" width="8" height="8"><path d="M1.5 5.5l2.2 2.2L8.5 2.5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>' : ""}</span>`;
const opts = (label, options, val, grow) => `<div class="fi-f${grow ? " grow" : ""}"><span class="fi-k">${esc(label)}:</span><span class="fi-opts">${options.map((o) => `<span class="fi-opt">${cb(val === o)}${esc(dv(o))}</span>`).join("")}</span></div>`;
const checklist = (label, options, selected) => `<div class="fi-f grow" style="display:block"><span class="fi-k">${esc(label)}:</span><div class="fi-checks">${options.map((o) => `<span class="fi-opt">${cb((selected || []).includes(o))}${esc(dv(o))}</span>`).join("")}</div></div>`;
const banner = (t) => `<div class="fi-banner">${esc(t)}</div>`;

/* ---------- the 0–4 frequency grid for the wheel scale questions ---------- */
const SCALE_LBLS = ["Never", "Rarely", "Sometimes", "Often", "Consistently"]; /* canonical — displayed via dv */
function scaleGrid(title, groupKeys, scales) {
  scales = scales || {};
  let rows = "";
  groupKeys.forEach((gk) => {
    (SCALE_QUESTIONS[gk] || []).forEach((q) => {
      const v = scales[q.id];
      rows += `<tr><td>${esc(scaleLabel(q))}</td>${SCALE_LBLS.map((_, i) => `<td>${cb(String(v) === String(i))}</td>`).join("")}</tr>`;
    });
  });
  if (!rows) return "";
  return `<table class="fi-tbl"><tr><th>${esc(title)}</th>${SCALE_LBLS.map((l) => `<th>${esc(dv(l))}</th>`).join("")}</tr>${rows}</table>`;
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
    s += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="8.5" fill="#7B7491" text-anchor="${anchor}" dominant-baseline="middle">${domainShort(name)}</text>`;
  });
  for (let k = 1; k <= 4; k++) s += `<circle cx="${cx}" cy="${cy}" r="${(r0 + (R - r0) * k / 5).toFixed(1)}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.1"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r0}" fill="#fff" stroke="#EAE7F3"/>`;
  return `<svg viewBox="0 0 300 246" width="238" role="img">${s}</svg>`;
}

export function buildReportHTML(p, included) {
  p = p || {};
  _t = makeT(DICT);
  const t = _t;
  const inc = (k) => !included || included[k] !== false;
  const cp = p.childProfile || {}, hh = p.household || {}, dg = p.diagnosis || {}, bi = p.birth || {},
        co = p.communication || {}, se = p.sensory || {}, dl = p.dailyLiving || {}, mo = p.motor || {},
        hl = p.health || {}, bh = p.behaviour || {}, st = p.strengths || {}, ed = p.education || {},
        sv = p.services || {}, gl = p.goals || {}, sc = p.scales || {};
  const bch = bh.challenges || {};
  const name = [cp.firstName, cp.lastName].filter(Boolean).join(" ") || "";
  const today = new Date().toLocaleDateString(libLocale(), { year: "numeric", month: "long", day: "numeric" });
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
      <h1>${esc(t("title"))}</h1>
      <p class="fi-tag">${esc(t("tag_completed"))}${cp.firstName ? esc(tpl(t("tag_forTeam"), { name: cp.firstName, of: ofName(cp.firstName) })) : ""} · ${esc(t("tag_conf"))}</p>
    </div>
    <img src="/logo3.png" alt="UniqueApex"/>
  </div>`;

  /* ============ 1 · CHILD INFORMATION ============ */
  if (inc("childProfile")) html += `${banner(t("b_child"))}<div class="fi-grid">
    ${line(t("f_first"), cp.firstName)}${line(t("f_last"), cp.lastName)}
    ${line(t("f_dob"), cp.dob)}${line(t("f_gender"), cp.gender)}
    ${line(t("f_city"), cp.city)}${line(t("f_country"), cp.country)}
    ${line(t("f_insurance"), cp.healthInsurance)}${line(t("f_homeLang"), cp.homeLanguages)}
    ${line(t("f_bestLang"), cp.bestLanguage)}${line(t("f_datePrepared"), today)}
  </div>`;

  /* ============ 2 · PARENTS & HOUSEHOLD ============ */
  if (inc("household")) html += `${banner(t("b_household"))}<div class="fi-grid">
    ${line(t("f_g1name"), hh.g1name)}${line(t("f_rel"), hh.g1rel)}
    ${line(t("f_email"), hh.g1email)}${line(t("f_phone"), hh.g1phone)}
    ${line(t("f_g2name"), hh.g2name)}${line(t("f_rel"), hh.g2rel)}
    ${line(t("f_email"), hh.g2email)}${line(t("f_phone"), hh.g2phone)}
    ${opts(t("f_custody"), ["Guardians together", "Joint custody", "Single custody", "Other"], hh.custody, true)}
    ${opts(t("f_famStatus"), ["Married", "Living together", "Separated", "Divorced", "Single", "Other"], hh.maritalStatus, true)}
    ${checklist(t("f_livesWith"), ["Both parents", "Mother", "Father", "Siblings", "Grandparents", "Foster family", "Other"], hh.livesWith)}
    ${line(t("f_siblings"), hh.siblings, true)}
    ${opts(t("f_govFunding"), YN, hh.funding)}${line(t("f_fundingType"), hh.fundingType)}
  </div>`;

  /* ============ 3 · DIAGNOSIS & FAMILY HISTORY ============ */
  if (inc("diagnosis")) html += `${banner(t("b_dx"))}
    ${opts(t("f_status"), ["Diagnosed", "Assessment Pending", "Self-Identified Concerns"], dg.status, true)}
    ${checklist(t("f_diagnoses"), ["Autism", "ADHD", "Speech / Language Disorder", "Global Developmental Delay", "Intellectual Disability", "Learning Difficulty", "Dyspraxia / DCD", "Sensory Processing", "Anxiety", "Depression", "OCD", "Tourette's / Tics", "Epilepsy / Seizures", "Genetic Condition", "Other"], dg.diagnoses)}
    <div class="fi-grid">${line(t("f_dxBy"), dg.diagnosedBy)}${line(t("f_dxDate"), dg.date)}${line(t("f_awaiting"), dg.awaiting, true)}</div>
    ${checklist(t("f_famHistory"), ["Developmental / language delay", "Learning difficulties", "Autism", "ADHD", "Anxiety", "Depression", "OCD", "Bipolar", "Tourette's / tics", "Intellectual disability", "Epilepsy / seizures", "Genetic disorder", "Substance use"], dg.familyHistory)}
    ${line(t("f_famHistNotes"), dg.familyHistoryNotes, true)}`;

  /* ============ 4 · BIRTH & DEVELOPMENT ============ */
  if (inc("birth")) {
    const ms = bi.milestones || {};
    html += `${banner(t("b_birth"))}<div class="fi-grid">
      ${line(t("f_pregnancy"), bi.pregnancy)}${line(t("f_gestation"), bi.gestation)}
      ${line(t("f_birthWeight"), bi.birthWeight)}${line(t("f_complications"), bi.complications)}
      ${opts(t("f_regression"), YN, bi.regression)}${line(t("f_details"), bi.regressionNotes)}
    </div>
    <p class="fi-sub">${esc(t("sub_milestones"))}</p>
    <div class="fi-grid3">
      ${line(t("f_sat"), ms.sit)}${line(t("f_crawled"), ms.crawl)}${line(t("f_walked"), ms.walk)}
      ${line(t("f_firstWord"), ms.firstWord)}${line(t("f_firstPhrases"), ms.phrases)}${line(t("f_firstSentences"), ms.sentences)}
      ${line(t("f_toiletDay"), ms.toiletDay)}${line(t("f_toiletNight"), ms.toiletNight)}
    </div>`;
  }

  /* ============ 5 · COMMUNICATION ============ */
  if (inc("communication")) html += `${banner(t("b_comm"))}
    ${opts(t("f_commStyle"), ["Fluent Verbal", "Verbal", "Limited Verbal", "Non-Speaking"], co.style, true)}
    ${checklist(t("f_means"), ["Words", "Sentences", "Sounds", "Pictures (PECS)", "Sign language", "Device / AAC app", "No primary means yet"], co.means)}
    ${opts(t("f_expressNeeds"), ["Consistently", "Sometimes", "Rarely"], co.canExpressNeeds, true)}
    ${checklist(t("f_challenges"), ["Requesting", "Conversation", "Question Answering", "Emotional Expression", "Social Communication"], co.challenges)}
    ${scaleGrid(t("grid_comm"), ["communication"], sc)}`;

  /* ============ 6 · SENSORY PROFILE ============ */
  if (inc("sensory")) {
    const SENSES = [
      ["auditory", ["Covers ears at loud sounds", "Distressed by sudden noises", "Bothered by background noise", "Seeks loud sounds / makes noise", "Doesn't respond to sounds/name"]],
      ["visual", ["Bothered by bright lights", "Avoids eye contact", "Fascinated by spinning/lights", "Visual clutter overwhelms", "Misses visual details"]],
      ["tactile", ["Bothered by clothing tags/textures", "Dislikes being touched", "Distressed by haircuts/nails", "Seeks deep pressure / tight hugs", "Mouths or chews objects", "High pain tolerance"]],
      ["oral", ["Very limited food textures", "Strong food preferences", "Gags easily", "Seeks crunchy/chewy foods", "Chews non-food items"]],
      ["smell", ["Bothered by smells", "Seeks out smells", "Doesn't notice strong smells"]],
      ["movement", ["Seeks spinning/swinging", "Avoids movement / cautious", "Fearful when feet leave ground", "Constantly moving", "Poor balance"]],
      ["body", ["Bumps into things / clumsy", "Unaware of body position", "Uses too much/little force", "Seeks crashing / rough play"]],
    ];
    html += banner(t("b_sensory"));
    SENSES.forEach(([key, signs]) => {
      const o = se[key] || {};
      html += `<div class="fi-sense">
        <div class="fi-sense-h"><b>${esc(senseLabel(key))}</b>
          <span class="fi-opt">${cb(!!o.typical)}${esc(dv("No concerns / typical"))}</span>
          <span class="fi-opt" style="margin-left:auto">${esc(t("sev_label"))}</span>
          ${["Mild", "Moderate", "Significant"].map((s) => `<span class="fi-opt" style="font-size:10px">${cb(!o.typical && o.severity === s)}${esc(dv(s))}</span>`).join("")}
        </div>
        <div class="fi-checks">${signs.map((sg) => `<span class="fi-opt" style="font-size:10px">${cb(!o.typical && (o.signs || []).includes(sg))}${esc(dv(sg))}</span>`).join("")}</div>
      </div>`;
    });
    html += `${checklist(t("f_otherSigns"), ["Insensitive to temperature", "High pain tolerance", "Strong difficulty with transitions"], se.other)}
    ${line(t("f_sensoryNotes"), se.notes, true)}`;
  }

  /* ============ 7 · DAILY LIVING & MOTOR ============ */
  if (inc("dailyLiving")) html += `${banner(t("b_daily"))}<div class="fi-grid">
    ${opts(t("f_eating"), ["Independent", "With support", "Not yet"], dl.eating)}
    ${opts(t("f_dressing"), ["Independent", "With support", "Not yet"], dl.dressing)}
    ${opts(t("f_toileting"), ["Fully trained", "In progress", "Not started"], dl.toileting)}
    ${opts(t("f_sleepQ"), ["Good", "Variable", "Poor"], dl.sleep)}
    ${opts(t("f_safety"), ["Strong", "Developing", "Limited"], dl.safety)}
    ${opts(t("f_multiStep"), YSN, dl.multiStep)}
    ${opts(t("f_group"), YSN, dl.groupActivities)}
    ${opts(t("f_feeding"), ["None", "Mild", "Significant"], dl.feeding)}
    ${line(t("f_diet"), dl.dietaryRestrictions, true)}
  </div>
  ${checklist(t("f_gross"), ["Walks on tiptoes", "Clumsy / bumps into things", "Poor balance", "Low muscle tone", "Difficulty with stairs", "Difficulty running or jumping", "Delayed gross-motor milestones"], mo.gross)}
  ${checklist(t("f_fine"), ["Difficulty with handwriting / drawing", "Difficulty using utensils", "Difficulty with buttons / zippers", "Difficulty using scissors", "Weak or awkward pencil grip"], mo.fine)}
  ${line(t("f_motorNotes"), mo.notes, true)}
  ${scaleGrid(t("grid_exec"), ["executive"], sc)}`;

  /* ============ 8 · HEALTH & MEDICAL ============ */
  if (inc("health")) html += `${banner(t("b_health"))}<div class="fi-grid">
    ${opts(t("f_hand"), ["Right", "Left", "Both"], hl.handedness)}${line(t("f_pediatrician"), hl.pediatrician)}
    ${line(t("f_specialists"), hl.specialists, true)}
    ${line(t("f_allergyFood"), hl.allergyFood)}${line(t("f_allergyEnv"), hl.allergyEnv)}
    ${line(t("f_allergyOther"), hl.allergyOther)}${line(t("f_allergyTx"), hl.allergyTreatment)}
    ${line(t("f_medConditions"), hl.medicalConditions, true)}
    ${line(t("f_meds"), hl.medications, true)}
    ${line(t("f_pastMeds"), hl.pastMedications, true)}
    ${line(t("f_surgeries"), hl.surgeries, true)}
    ${opts(t("f_eyeExam"), YN, hl.hadEyeExam)}${line(t("f_eyeDate"), hl.lastEyeExam)}
    ${opts(t("f_glasses"), YN, hl.glasses)}${line(t("f_eyeNotes"), hl.eyeNotes)}
    ${opts(t("f_hearingTest"), YN, hl.hadHearingTest)}${line(t("f_hearingDate"), hl.lastHearingTest)}
    ${opts(t("f_earInfections"), YN, hl.earInfections)}${line(t("f_hearingNotes"), hl.hearingNotes)}
  </div>`;

  /* ============ 9 · BEHAVIOUR & SOCIAL ============ */
  if (inc("behaviour")) {
    const BL = { meltdowns: t("rb_meltdowns"), aggression: t("rb_aggression"), selfInjury: t("rb_selfInjury"), elopement: t("rb_elopement"), anxiety: t("rb_anxiety"), rigidity: t("rb_rigidity"), emotional: t("rb_emotional"), repetitive: t("rb_repetitive"), defiance: t("rb_defiance"), hyperactivity: t("rb_hyperactivity") };
    const freqs = ["Rarely", "Sometimes", "Often", "Daily"];
    html += `${banner(t("b_beh"))}
      <table class="fi-tbl"><tr><th>${esc(t("grid_freqTitle"))}</th>${freqs.map((f) => `<th>${esc(dv(f))}</th>`).join("")}<th>${esc(t("na"))}</th></tr>
      ${Object.keys(BL).map((k) => `<tr><td>${BL[k]}</td>${freqs.map((f) => `<td>${cb(bch[k] === f)}</td>`).join("")}<td>${cb(!has(bch[k]))}</td></tr>`).join("")}</table>
      <div class="fi-grid">
        ${line(t("f_triggers"), bh.triggers, true)}
        ${line(t("f_strategies"), bh.strategies, true)}
        ${opts(t("f_peersInterest"), YSN, bh.peersInterest)}${opts(t("f_peersInteract"), YSN, bh.peersInteract)}
        ${opts(t("f_follows"), YSN, bh.followsInstructions)}${opts(t("f_suspended"), YN, bh.suspended)}
        ${line(t("f_notes"), bh.suspendedNotes, true)}
      </div>
      ${scaleGrid(t("grid_social"), ["social"], sc)}
      ${scaleGrid(t("grid_flex"), ["flexibility"], sc)}
      ${scaleGrid(t("grid_emo"), ["emotional"], sc)}`;
  }

  /* ============ 10 · STRENGTHS & INTERESTS ============ */
  if (inc("strengths")) html += `${banner(t("b_str"))}
    ${line(t("f_strengths"), st.strengths, true)}
    ${line(t("f_interests"), st.interests, true)}
    ${line(t("f_dislikes"), st.dislikes, true)}
    ${scaleGrid(t("grid_learning"), ["learning"], sc)}`;

  /* ============ 11 · EDUCATION ============ */
  if (inc("education")) html += `${banner(t("b_edu"))}<div class="fi-grid">
    ${line(t("f_school"), ed.schoolName)}${opts(t("f_schoolType"), ["Mainstream", "Specialized", "Homeschool", "Daycare / preschool", "Not in school yet", "Other"], ed.schoolType, true)}
    ${line(t("f_grade"), ed.grade)}${line(t("f_board"), ed.schoolBoard)}
    ${opts(t("f_iep"), YN, ed.hasIEP)}
    ${opts(t("f_classSupport"), ["None", "Part-time aide", "Full-time aide", "Other"], ed.classroomSupport)}
    ${line(t("f_agency"), ed.agencySupport, true)}
    ${line(t("f_acadConcerns"), ed.challenges, true)}
    ${line(t("f_schoolStrengths"), ed.strengths, true)}
    ${line(t("f_transition"), ed.upcomingTransition)}${opts(t("f_flightRisk"), YN, ed.flightRisk)}
  </div>`;

  /* ============ 12 · THERAPY & SERVICES ============ */
  if (inc("therapy")) {
    const TYPES = ["Speech Therapy", "Occupational Therapy", "ABA / Behaviour", "Psychology", "Psychiatry", "Physiotherapy", "Social Skills Group", "Infant Stimulation", "Other"];
    const byType = {};
    (p.therapy || []).forEach((x) => { if (x && x.type) byType[x.type] = x; });
    html += `${banner(t("b_therapy"))}
      ${checklist(t("f_currentServices"), TYPES, Object.keys(byType))}`;
    Object.keys(byType).forEach((k) => {
      const th = byType[k];
      html += `<div class="fi-grid" style="margin:2px 0 4px">
        ${line(tpl(t("f_provider"), { type: dv(k) }), th.provider)}${line(t("f_frequency"), th.frequency)}
        ${line(t("f_startDate"), th.startDate)}${line(t("f_progress"), th.progress)}
        ${line(t("f_goals"), th.goals, true)}
      </div>`;
    });
    html += `<div class="fi-grid">
      ${line(t("f_pastServices"), sv.pastServices, true)}
      ${opts(t("f_onWaitlist"), YN, sv.onWaitlist)}${line(t("f_waitlistDetails"), sv.waitlistDetails)}
    </div>`;
  }

  /* ============ 13 · GOALS & FOCUS ============ */
  if (inc("goals")) html += `${banner(t("b_goals"))}
    ${line(t("f_mainConcerns"), gl.mainConcerns, true)}
    ${checklist(t("f_priorities"), ["Communication", "Friendships", "Emotional Regulation", "School Success", "Independence", "Daily Living Skills", "Transition Planning", "Employment Preparation"], gl.priorities)}
    ${line(t("f_focusAreas"), gl.focusAreas, true)}
    ${line(t("f_otherGoals"), gl.other, true)}`;

  /* ============ SUPPORT SNAPSHOT ============ */
  if (anyWheel) {
    const needs = DOMAINS.filter((n) => scored[n].score != null).sort((a, b) => scored[b].score - scored[a].score);
    const shine = DOMAINS.filter((n) => scored[n].strength != null && scored[n].strength >= 45).sort((a, b) => scored[b].strength - scored[a].strength);
    const dcolor = (n) => `hsl(${HUES[DOMAINS.indexOf(n)]},62%,48%)`;
    const li = (n, pill, txt) => `<p><span style="width:7px;height:7px;border-radius:50%;background:${dcolor(n)};display:inline-block"></span>${domainShort(n)} <span class="fi-pill ${pill}">${esc(txt)}</span></p>`;
    html += `${banner(t("b_snapshot"))}
      <div class="fi-wheelrow">${roseSVG(scored)}
        <div class="fi-legend">
          <p class="h a">${esc(t("legend_needs"))}</p>${needs.slice(0, 3).map((n) => li(n, "amber", t("pill_more"))).join("")}
          <p class="h g">${esc(t("legend_strengths"))}</p>${(shine.length ? shine : needs.slice().reverse()).slice(0, 3).map((n) => li(n, "green", t("pill_strong"))).join("")}
        </div>
      </div>
      <p class="fi-small">${esc(t("small_note"))}</p>`;
  }

  /* ============ SIGNATURE ============ */
  const stName = cp.firstName || t("theChild");
  html += `<p class="fi-statement">${esc(tpl(t("statement"), { name: stName, of: ofName(stName) }))}</p>
  <div class="fi-sign">
    ${line(t("f_completedBy"), hh.g1name)}
    ${line(t("f_relToChild"), hh.g1rel)}
    ${line(t("f_date"), today)}
    <div class="fi-f"><span class="fi-k">${esc(t("f_signature"))}</span><span class="fi-v">&nbsp;</span></div>
  </div>
  <div class="fi-foot"><span>${esc(t("foot_generated"))}</span><span>${esc(name)} · ${today}</span></div>`;

  return html;
}
