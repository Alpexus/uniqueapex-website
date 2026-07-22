// ============================================================
// Strings: /child/journey — the family roadmap (page frame only).
// Step titles/reasons/CTAs and stage titles/blurbs come from
// src/lib/journey.js (content library) and stay English this pass.
// {name}/{of} templates as in child.js ({of} = French "de "/"d'").
// ============================================================
export default {
  en: {
    /* ---- ribbon ---- */
    journeyTitle: "The Journey",
    journeyTitleNamed: "{name}'s Journey",
    ribbonSub: "A path built from your answers — one step at a time, in the order that helps most.",
    builtFrom1: "Built from {n} passport section",
    builtFromN: "Built from {n} passport sections",
    builtAbout: " about {name}",
    builtTail: " — every step below exists because of something you told us.",
    statsDone: "steps done",
    statsNow: "to do now",
    statsLater: "coming up",
    /* ---- gate ---- */
    gateText: "The journey starts with the passport — a few minutes about your child, and a personalized path appears here.",
    gateCta: "Start the passport →",
    /* ---- stepper ---- */
    stepperProgress: "{done}/{total} done",
    youAreHere: " · you are here",
    /* ---- steps ---- */
    fromPassport: "From the passport: {because}",
    pillDone: "Done ✓",
    pillNow: "Now",
    pillNext: "Next",
    pillLater: "Later",
    /* ---- footer ---- */
    footFallback: "You don't have to do it all today — one step is enough. The path updates itself as the passport grows.",
    footTextNamed: "You don't have to do it all today — one step is enough. The path updates itself as {name}'s passport grows.",
    footCta: "See how far you've come →",
  },
  fr: {
    /* ---- ribbon ---- */
    journeyTitle: "Le parcours",
    journeyTitleNamed: "Le parcours {of}{name}",
    ribbonSub: "Un chemin construit à partir de vos réponses — une étape à la fois, dans l'ordre qui aide le plus.",
    builtFrom1: "Construit à partir de {n} section du passeport",
    builtFromN: "Construit à partir de {n} sections du passeport",
    builtAbout: " au sujet de {name}",
    builtTail: " — chaque étape ci-dessous existe grâce à ce que vous nous avez confié.",
    statsDone: "étapes faites",
    statsNow: "à faire maintenant",
    statsLater: "à venir",
    /* ---- gate ---- */
    gateText: "Le parcours commence avec le passeport — quelques minutes au sujet de votre enfant, et un chemin personnalisé apparaît ici.",
    gateCta: "Commencer le passeport →",
    /* ---- stepper ---- */
    stepperProgress: "{done}/{total} faites",
    youAreHere: " · vous êtes ici",
    /* ---- steps ---- */
    fromPassport: "Tiré du passeport : {because}",
    pillDone: "Fait ✓",
    pillNow: "Maintenant",
    pillNext: "Ensuite",
    pillLater: "Plus tard",
    /* ---- footer ---- */
    footFallback: "Vous n'avez pas à tout faire aujourd'hui — une étape suffit. Le chemin se met à jour à mesure que le passeport grandit.",
    footTextNamed: "Vous n'avez pas à tout faire aujourd'hui — une étape suffit. Le chemin se met à jour à mesure que le passeport {of}{name} grandit.",
    footCta: "Voyez le chemin parcouru →",
  },
};
