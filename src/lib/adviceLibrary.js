/* ============================================================
   adviceLibrary.js — ADVICE-LIBRARY-V2  (bilingual)
   ------------------------------------------------------------
   THE closed library of family advice. Every entry is tied
   to ONE specific passport answer — a family only ever sees a
   tip when they gave exactly that answer. Nothing is invented
   at runtime: if it's not written here, it can never be shown.

   V2: the tip TEXT (EN + FR) lives in src/i18n/lib-advice.js,
   one key per entry `id` — REVIEW AND EDIT WORDING THERE.
   This file keeps the matchers only. matchAdvice() resolves
   each tip in the active language (EN fallback per key).

   MATCHERS
   · path+equals   → answer === value
   · path+anyOf    → answer is one of the values
   · path+includes → checkbox list contains the value
   · sense         → that sensory sense has signs (not typical)
   Matcher VALUES are canonical DB English — never translate.
   ============================================================ */
import { makeT } from "./libI18n.js";
import DICT from "../i18n/lib-advice.js";

export const ADVICE = [

  /* ─────────────── COMMUNICATION ─────────────── */
  { id: "a_comm_nonspeaking", section: "communication", label: "Style: Non-Speaking",
    path: "communication.style", equals: "Non-Speaking" },
  { id: "a_comm_limited", section: "communication", label: "Style: Limited Verbal",
    path: "communication.style", equals: "Limited Verbal" },
  { id: "a_comm_verbal", section: "communication", label: "Style: Verbal",
    path: "communication.style", equals: "Verbal" },
  { id: "a_comm_rarely", section: "communication", label: "Can express needs: Rarely",
    path: "communication.canExpressNeeds", equals: "Rarely" },
  { id: "a_comm_sometimes", section: "communication", label: "Can express needs: Sometimes",
    path: "communication.canExpressNeeds", equals: "Sometimes" },
  { id: "a_comm_requesting", section: "communication", label: "Challenge: Requesting",
    path: "communication.challenges", includes: "Requesting" },
  { id: "a_comm_conversation", section: "communication", label: "Challenge: Conversation",
    path: "communication.challenges", includes: "Conversation" },
  { id: "a_comm_questions", section: "communication", label: "Challenge: Question Answering",
    path: "communication.challenges", includes: "Question Answering" },
  { id: "a_comm_emotional", section: "communication", label: "Challenge: Emotional Expression",
    path: "communication.challenges", includes: "Emotional Expression" },
  { id: "a_comm_social", section: "communication", label: "Challenge: Social Communication",
    path: "communication.challenges", includes: "Social Communication" },

  /* ─────────────── SENSORY ─────────────── */
  { id: "a_sen_auditory", section: "sensory", label: "Sound sensitivities", sense: "auditory" },
  { id: "a_sen_visual", section: "sensory", label: "Sight sensitivities", sense: "visual" },
  { id: "a_sen_tactile", section: "sensory", label: "Touch sensitivities", sense: "tactile" },
  { id: "a_sen_oral", section: "sensory", label: "Taste & mouth sensitivities", sense: "oral" },
  { id: "a_sen_smell", section: "sensory", label: "Smell sensitivities", sense: "smell" },
  { id: "a_sen_movement", section: "sensory", label: "Movement & balance differences", sense: "movement" },
  { id: "a_sen_body", section: "sensory", label: "Body awareness differences", sense: "body" },

  /* ─────────────── DAILY LIVING ─────────────── */
  { id: "a_dl_eating_support", section: "dailyLiving", label: "Eating: With support",
    path: "dailyLiving.eating", equals: "With support" },
  { id: "a_dl_eating_notyet", section: "dailyLiving", label: "Eating: Not yet",
    path: "dailyLiving.eating", equals: "Not yet" },
  { id: "a_dl_dressing_support", section: "dailyLiving", label: "Dressing: With support",
    path: "dailyLiving.dressing", equals: "With support" },
  { id: "a_dl_dressing_notyet", section: "dailyLiving", label: "Dressing: Not yet",
    path: "dailyLiving.dressing", equals: "Not yet" },
  { id: "a_dl_toilet_progress", section: "dailyLiving", label: "Toileting: In progress",
    path: "dailyLiving.toileting", equals: "In progress" },
  { id: "a_dl_toilet_notstarted", section: "dailyLiving", label: "Toileting: Not started",
    path: "dailyLiving.toileting", equals: "Not started" },
  { id: "a_dl_sleep_variable", section: "dailyLiving", label: "Sleep: Variable",
    path: "dailyLiving.sleep", equals: "Variable" },
  { id: "a_dl_sleep_poor", section: "dailyLiving", label: "Sleep: Poor",
    path: "dailyLiving.sleep", equals: "Poor" },
  { id: "a_dl_safety_limited", section: "dailyLiving", label: "Safety awareness: Limited",
    path: "dailyLiving.safety", equals: "Limited" },
  { id: "a_dl_feeding_sig", section: "dailyLiving", label: "Feeding difficulties: Significant",
    path: "dailyLiving.feeding", equals: "Significant" },

  /* ─────────────── BEHAVIOUR & SOCIAL ─────────────── */
  { id: "a_bh_meltdowns", section: "behaviour", label: "Meltdowns: Often/Daily",
    path: "behaviour.challenges.meltdowns", anyOf: ["Often", "Daily"] },
  { id: "a_bh_anxiety", section: "behaviour", label: "Anxiety: Often/Daily",
    path: "behaviour.challenges.anxiety", anyOf: ["Often", "Daily"] },
  { id: "a_bh_rigidity", section: "behaviour", label: "Rigidity: Often/Daily",
    path: "behaviour.challenges.rigidity", anyOf: ["Often", "Daily"] },
  { id: "a_bh_selfinjury", section: "behaviour", label: "Self-injury: any frequency",
    path: "behaviour.challenges.selfInjury", anyOf: ["Rarely", "Sometimes", "Often", "Daily"] },
  { id: "a_bh_elopement", section: "behaviour", label: "Elopement: Sometimes or more",
    path: "behaviour.challenges.elopement", anyOf: ["Sometimes", "Often", "Daily"] },
  { id: "a_bh_aggression", section: "behaviour", label: "Aggression: Often/Daily",
    path: "behaviour.challenges.aggression", anyOf: ["Often", "Daily"] },
  { id: "a_bh_hyper", section: "behaviour", label: "Hyperactivity: Often/Daily",
    path: "behaviour.challenges.hyperactivity", anyOf: ["Often", "Daily"] },
  { id: "a_bh_peers_no", section: "behaviour", label: "Interest in peers: No",
    path: "behaviour.peersInterest", equals: "No" },
  { id: "a_bh_interact_sometimes", section: "behaviour", label: "Interacts with peers: Sometimes",
    path: "behaviour.peersInteract", equals: "Sometimes" },
  { id: "a_bh_follows_no", section: "behaviour", label: "Follows instructions: No",
    path: "behaviour.followsInstructions", equals: "No" },

  /* ─────────────── EDUCATION ─────────────── */
  { id: "a_ed_iep_no", section: "education", label: "Has IEP: No",
    path: "education.hasIEP", equals: "No" },
  { id: "a_ed_iep_yes", section: "education", label: "Has IEP: Yes",
    path: "education.hasIEP", equals: "Yes" },
  { id: "a_ed_flight", section: "education", label: "Flight risk at school: Yes",
    path: "education.flightRisk", equals: "Yes" },
  { id: "a_ed_transition", section: "education", label: "Upcoming transition noted",
    path: "education.upcomingTransition", nonEmpty: true },

  /* ─────────────── BIRTH & DEVELOPMENT ─────────────── */
  { id: "a_bi_lostskills", section: "birth", label: "Lost skills: Yes",
    path: "birth.lostSkills", equals: "Yes" },

  /* ─────────────── THERAPY & SERVICES ─────────────── */
  { id: "a_th_waitlist", section: "therapy", label: "On a waitlist: Yes",
    path: "services.onWaitlist", equals: "Yes" },
  { id: "a_th_none", section: "therapy", label: "No current services",
    noTherapy: true },

  /* ─────────────── GOALS ─────────────── */
  { id: "a_gl_comm", section: "goals", label: "Priority: Communication",
    path: "goals.priorities", includes: "Communication" },
  { id: "a_gl_friend", section: "goals", label: "Priority: Friendships",
    path: "goals.priorities", includes: "Friendships" },
  { id: "a_gl_emo", section: "goals", label: "Priority: Emotional Regulation",
    path: "goals.priorities", includes: "Emotional Regulation" },
  { id: "a_gl_school", section: "goals", label: "Priority: School Success",
    path: "goals.priorities", includes: "School Success" },
];

/* ---------------- matcher ---------------- */
function get(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/** All advice entries whose trigger matches this passport's answers,
    with `tip` resolved in the active language. */
export function matchAdvice(data) {
  data = data || {};
  const t = makeT(DICT);
  return ADVICE.filter((a) => {
    if (a.sense) {
      const o = (data.sensory || {})[a.sense];
      return !!(o && !o.typical && o.signs && o.signs.length);
    }
    if (a.noTherapy) return !((data.therapy || []).some((x) => x && x.type));
    const v = get(data, a.path);
    if (a.equals != null) return v === a.equals;
    if (a.anyOf) return a.anyOf.includes(v);
    if (a.includes) return Array.isArray(v) && v.includes(a.includes);
    if (a.nonEmpty) return v != null && String(v).trim() !== "";
    return false;
  }).map((a) => ({ ...a, tip: t(a.id) }));
}

/** Matched advice grouped by section key, for the report + tabs. */
export function adviceBySection(data) {
  const out = {};
  matchAdvice(data).forEach((a) => { (out[a.section] = out[a.section] || []).push(a); });
  return out;
}
