/* ============================================================
   adviceLibrary.js — ADVICE-LIBRARY-V1  (for founder review)
   ------------------------------------------------------------
   THE closed library of family advice. Every tip below is tied
   to ONE specific passport answer — a family only ever sees a
   tip when they gave exactly that answer. Nothing is invented
   at runtime: if it's not written here, it can never be shown.

   HOW TO REVIEW (Pelin): read each entry top to bottom.
   · `when`  = the passport answer that triggers it
   · `tip`   = the sentence families will see, word for word
   Edit any `tip` text freely — plain language, hedged wording
   ("may help", "worth trying"), never diagnostic or alarming.
   A professional pass (SLP/OT) can refine these later; the
   structure won't need to change.

   MATCHERS
   · path+equals   → answer === value
   · path+anyOf    → answer is one of the values
   · path+includes → checkbox list contains the value
   · sense         → that sensory sense has signs (not typical)
   ============================================================ */

export const ADVICE = [

  /* ─────────────── COMMUNICATION ─────────────── */
  { section: "communication", label: "Style: Non-Speaking",
    path: "communication.style", equals: "Non-Speaking",
    tip: "Honour every form of communication — gestures, sounds, pulling you by the hand all count. Ask the SLP about AAC options (picture boards or a speech app); research shows AAC supports, and does not replace, spoken language." },
  { section: "communication", label: "Style: Limited Verbal",
    path: "communication.style", equals: "Limited Verbal",
    tip: "Narrate daily life in short, clear phrases and leave pauses — expectant silence is a powerful invitation. Celebrate every attempt to communicate, not just clear words." },
  { section: "communication", label: "Style: Verbal",
    path: "communication.style", equals: "Verbal",
    tip: "Keep stretching language through play: add one word to whatever your child says ('car' → 'fast car') and let conversations follow their interests." },
  { section: "communication", label: "Can express needs: Rarely",
    path: "communication.canExpressNeeds", equals: "Rarely",
    tip: "Try offering visible choices ('milk or water?' while holding both) — needing to choose invites communication. Picture cards for frequent needs can lower frustration for everyone." },
  { section: "communication", label: "Can express needs: Sometimes",
    path: "communication.canExpressNeeds", equals: "Sometimes",
    tip: "When a need does get expressed, respond quickly and warmly — fast responses teach that communicating works. On harder days, offer choices to lighten the load." },
  { section: "communication", label: "Challenge: Requesting",
    path: "communication.challenges", includes: "Requesting",
    tip: "Set up small 'asking moments': favourite snacks visible but out of reach, or a toy that needs your help to work. Keep the ask easy and the reward instant." },
  { section: "communication", label: "Challenge: Conversation",
    path: "communication.challenges", includes: "Conversation",
    tip: "Practice back-and-forth without pressure: take turns adding blocks, sounds, or silly faces. Turn-taking in play is the foundation of turn-taking in talk." },
  { section: "communication", label: "Challenge: Question Answering",
    path: "communication.challenges", includes: "Question Answering",
    tip: "Favour either/or questions over open ones ('Was it fun or boring?'), and give plenty of time. Try commenting instead of quizzing — comments invite answers without pressure." },
  { section: "communication", label: "Challenge: Emotional Expression",
    path: "communication.challenges", includes: "Emotional Expression",
    tip: "Name feelings out loud all day, including your own ('I'm frustrated, I'll take a breath'). A simple feelings chart lets your child point when words are hard." },
  { section: "communication", label: "Challenge: Social Communication",
    path: "communication.challenges", includes: "Social Communication",
    tip: "Rehearse social moments in calm times — how to join a game, what to say when someone says hi. Short scripts and role-play with stuffed animals make it fun, not scary." },

  /* ─────────────── SENSORY ─────────────── */
  { section: "sensory", label: "Sound sensitivities",
    sense: "auditory",
    tip: "Keep noise-reducing headphones in your bag for loud places, and warn before predictable sounds (blender, hand dryer). Knowing what's coming makes sound easier to handle." },
  { section: "sensory", label: "Sight sensitivities",
    sense: "visual",
    tip: "Notice which lighting your child does best in — many children find natural light easier than fluorescent. A brimmed hat or sunglasses can make bright spaces manageable." },
  { section: "sensory", label: "Touch sensitivities",
    sense: "tactile",
    tip: "Let your child control touch where possible: ask before hugs, cut clothing tags, and wash new clothes before first wear. Seamless socks and soft fabrics are small changes that matter." },
  { section: "sensory", label: "Taste & mouth sensitivities",
    sense: "oral",
    tip: "Keep offering foods without pressure — seeing, touching, and smelling a food are real steps toward tasting it. Serve one 'safe food' at every meal so eating never feels risky." },
  { section: "sensory", label: "Smell sensitivities",
    sense: "smell",
    tip: "Go fragrance-free where you can (detergent, soap) and seat your child away from kitchen smells if they bother them. A familiar 'good smell' item can help in overwhelming places." },
  { section: "sensory", label: "Movement & balance differences",
    sense: "movement",
    tip: "Build movement into the day before it's needed: playground time before errands, wiggle breaks between sit-down tasks. Swings, trampolines, and spinning are needs, not habits." },
  { section: "sensory", label: "Body awareness differences",
    sense: "body",
    tip: "Heavy work helps many children feel their body better — carrying groceries, pushing a loaded cart, animal walks. Ask your OT which activities fit your child best." },

  /* ─────────────── DAILY LIVING ─────────────── */
  { section: "dailyLiving", label: "Eating: With support",
    path: "dailyLiving.eating", equals: "With support",
    tip: "Pick ONE eating skill to practice at a time (scooping, then stabbing, then cutting) and let everything else be helped. Success at one small thing beats struggle at three." },
  { section: "dailyLiving", label: "Eating: Not yet",
    path: "dailyLiving.eating", equals: "Not yet",
    tip: "Start with hand-over-hand help and fade it slowly — your hand on their wrist, then their elbow, then just nearby. Easy-grip utensils lower the barrier." },
  { section: "dailyLiving", label: "Dressing: With support",
    path: "dailyLiving.dressing", equals: "With support",
    tip: "Teach dressing backwards: you do every step except the last, and your child finishes (pulling the shirt down, the final tug on the sock). Finishing feels like winning." },
  { section: "dailyLiving", label: "Dressing: Not yet",
    path: "dailyLiving.dressing", equals: "Not yet",
    tip: "Choose clothes that forgive: loose waistbands, no buttons, tag-free. Lay clothes out in order, and name each step the same way every time." },
  { section: "dailyLiving", label: "Toileting: In progress",
    path: "dailyLiving.toileting", equals: "In progress",
    tip: "Keep the routine identical every time — same words, same order, same visual steps by the toilet. Progress often pauses and restarts; that's normal, not backsliding." },
  { section: "dailyLiving", label: "Toileting: Not started",
    path: "dailyLiving.toileting", equals: "Not started",
    tip: "Readiness matters more than age: staying dry longer, noticing a wet diaper, interest in the bathroom. When you start, go all-in on routine rather than pressure." },
  { section: "dailyLiving", label: "Sleep: Variable",
    path: "dailyLiving.sleep", equals: "Variable",
    tip: "Guard the wind-down hour: same steps, dim lights, screens off. A visual bedtime chart your child moves through gives the routine to them instead of you." },
  { section: "dailyLiving", label: "Sleep: Poor",
    path: "dailyLiving.sleep", equals: "Poor",
    tip: "Track a week of sleep (times, wake-ups, what preceded hard nights) — patterns often appear. Bring the log to your pediatrician; sleep is worth professional help, and it changes everything else." },
  { section: "dailyLiving", label: "Safety awareness: Limited",
    path: "dailyLiving.safety", equals: "Limited",
    tip: "Practice safety skills as games in calm moments: 'stop' freeze-dance, holding hands to the corner, waiting at doors. Repetition in play builds real-world habits." },
  { section: "dailyLiving", label: "Feeding difficulties: Significant",
    path: "dailyLiving.feeding", equals: "Significant",
    tip: "Significant feeding challenges deserve professional eyes — ask about a feeding assessment (OT or SLP). Meanwhile, keep mealtimes calm and pressure-free; stress narrows diets further." },

  /* ─────────────── BEHAVIOUR & SOCIAL ─────────────── */
  { section: "behaviour", label: "Meltdowns: Often/Daily",
    path: "behaviour.challenges.meltdowns", anyOf: ["Often", "Daily"],
    tip: "During a meltdown, less is more: fewer words, calm body, safe space. The teaching happens later, when everyone is calm. Track what came before each one — patterns are gold." },
  { section: "behaviour", label: "Anxiety: Often/Daily",
    path: "behaviour.challenges.anxiety", anyOf: ["Often", "Daily"],
    tip: "Preview new situations with photos or simple stories before they happen. Name the worry ('you're wondering if it will be loud') — being understood shrinks anxiety." },
  { section: "behaviour", label: "Rigidity: Often/Daily",
    path: "behaviour.challenges.rigidity", anyOf: ["Often", "Daily"],
    tip: "Use 'first, then' language and countdown warnings ('two more minutes, then shoes'). When change is unavoidable, keep one familiar anchor — same cup, same song, same seat." },
  { section: "behaviour", label: "Self-injury: any frequency",
    path: "behaviour.challenges.selfInjury", anyOf: ["Rarely", "Sometimes", "Often", "Daily"],
    tip: "Self-injury is a signal worth professional support — mention it to your pediatrician or behaviour team even if it seems minor. Note when it happens; the 'when' usually points to the 'why'." },
  { section: "behaviour", label: "Elopement: Sometimes or more",
    path: "behaviour.challenges.elopement", anyOf: ["Sometimes", "Often", "Daily"],
    tip: "Make a family safety plan: who watches at transitions, ID on your child (bracelet or card in pocket), and teach 'stop' as a game. Tell school and caregivers — everyone should know the plan." },
  { section: "behaviour", label: "Aggression: Often/Daily",
    path: "behaviour.challenges.aggression", anyOf: ["Often", "Daily"],
    tip: "Aggression usually speaks for something — frustration, overwhelm, a need without words. A behaviour professional can help find the message; meanwhile keep responses calm and consistent." },
  { section: "behaviour", label: "Hyperactivity: Often/Daily",
    path: "behaviour.challenges.hyperactivity", anyOf: ["Often", "Daily"],
    tip: "Movement first, focus second: active play before homework or meals. Short tasks with movement breaks beat long sit-downs every time." },
  { section: "behaviour", label: "Interest in peers: No",
    path: "behaviour.peersInterest", equals: "No",
    tip: "Start with 'alongside' play, not 'together' play — same room, same activity, no pressure to interact. Connection often begins with simply sharing space comfortably." },
  { section: "behaviour", label: "Interacts with peers: Sometimes",
    path: "behaviour.peersInteract", equals: "Sometimes",
    tip: "Short, structured playdates work best: one friend, one planned activity, a clear end time. End on a high note so the memory is good." },
  { section: "behaviour", label: "Follows instructions: No",
    path: "behaviour.followsInstructions", equals: "No",
    tip: "Get close, say their name, one short instruction, then wait — walking over beats calling across the room. Pair words with gestures or showing." },

  /* ─────────────── EDUCATION ─────────────── */
  { section: "education", label: "Has IEP: No",
    path: "education.hasIEP", equals: "No",
    tip: "Ask the school in writing about starting an IEP (plan d'intervention) — a written request starts formal timelines. Bring reports and this passport; you know your child best." },
  { section: "education", label: "Has IEP: Yes",
    path: "education.hasIEP", equals: "Yes",
    tip: "Before each IEP meeting, jot three things going well and three concerns. You're an equal member of that team — ask for goals to be specific and measurable." },
  { section: "education", label: "Flight risk at school: Yes",
    path: "education.flightRisk", equals: "Yes",
    tip: "Ask the school what their supervision plan is at high-risk moments (arrival, recess, transitions) and share what works at home. Consistency between home and school keeps everyone safer." },
  { section: "education", label: "Upcoming transition noted",
    path: "education.upcomingTransition", nonEmpty: true,
    tip: "Start transition prep early: visit the new place when it's quiet, take photos to review at home, and meet key adults ahead of time. Familiarity turns big changes into small ones." },

  /* ─────────────── BIRTH & DEVELOPMENT ─────────────── */
  { section: "birth", label: "Lost skills: Yes",
    path: "birth.lostSkills", equals: "Yes",
    tip: "Skill loss is always worth discussing with your pediatrician, even when it happened a while ago — note roughly when and which skills, and bring that to your next visit." },

  /* ─────────────── THERAPY & SERVICES ─────────────── */
  { section: "therapy", label: "On a waitlist: Yes",
    path: "services.onWaitlist", equals: "Yes",
    tip: "While you wait: ask each waitlist for their cancellation list, and ask providers what you can practice at home meanwhile. Waiting time can still be progress time." },
  { section: "therapy", label: "No current services",
    noTherapy: true,
    tip: "Many families start with one service matched to the biggest need rather than everything at once. Your top priority in this passport is a good compass for where to begin." },

  /* ─────────────── GOALS ─────────────── */
  { section: "goals", label: "Priority: Communication",
    path: "goals.priorities", includes: "Communication",
    tip: "Since communication is a family priority: pick one daily routine (bath, snack, car ride) and make it your 'talking time' — same time, low pressure, child's favourite topic." },
  { section: "goals", label: "Priority: Friendships",
    path: "goals.priorities", includes: "Friendships",
    tip: "Since friendships are a family priority: one warm peer connection is worth more than many acquaintances. Look for a 'matched' buddy — similar interests, patient temperament." },
  { section: "goals", label: "Priority: Emotional Regulation",
    path: "goals.priorities", includes: "Emotional Regulation",
    tip: "Since emotional regulation is a priority: build the calm-down toolkit together in happy moments — a cozy corner, a breathing trick, a favourite squeeze toy. Tools chosen together get used." },
  { section: "goals", label: "Priority: School Success",
    path: "goals.priorities", includes: "School Success",
    tip: "Since school success is a priority: a small daily home-school notebook (one line each way) catches small issues before they grow, and celebrates small wins the report card misses." },
];

/* ---------------- matcher ---------------- */
function get(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/** All advice entries whose trigger matches this passport's answers. */
export function matchAdvice(data) {
  data = data || {};
  return ADVICE.filter((a) => {
    if (a.sense) {
      const o = (data.sensory || {})[a.sense];
      return !!(o && !o.typical && o.signs && o.signs.length);
    }
    if (a.noTherapy) return !((data.therapy || []).some((t) => t && t.type));
    const v = get(data, a.path);
    if (a.equals != null) return v === a.equals;
    if (a.anyOf) return a.anyOf.includes(v);
    if (a.includes) return Array.isArray(v) && v.includes(a.includes);
    if (a.nonEmpty) return v != null && String(v).trim() !== "";
    return false;
  });
}

/** Matched advice grouped by section key, for the report + tabs. */
export function adviceBySection(data) {
  const out = {};
  matchAdvice(data).forEach((a) => { (out[a.section] = out[a.section] || []).push(a); });
  return out;
}
