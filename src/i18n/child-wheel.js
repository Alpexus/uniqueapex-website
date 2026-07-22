// ============================================================
// Strings: /child/support-wheel — the full Support Wheel tab.
// {name}/{of} templates as in dashboard.js ({of} = French
// "de "/"d'" before a vowel, "" in English).
// Wheel wording (toggle, captions, legends, confidence, warn,
// disclaimer) mirrors dashboard.js so the mini wheel on /account
// and this full instrument read identically.
// NOT covered here: domain names and band labels — they come from
// the wheel engine trio (wheelScore/wheelConfig/wheelSvg, never
// edited) — and domainInsights.js content (context, strengths,
// support, strategies chips).
// ============================================================
export default {
  en: {
    /* ---- ribbon ---- */
    pageTitle: "Support Wheel",
    wheelTitleNamed: "{name}'s Support Wheel",
    ribSub: "The full instrument — three views, a guided tour, and the story behind every petal.",
    yourChild: "your child",
    statWheelComplete: "wheel complete",
    statAreasScored: "areas scored",
    statMostSupport: "most support",
    /* ---- stage: modes, tour, captions, legends ---- */
    tourBtn: "Tour",
    stopBtn: "Stop",
    tourTitle: "Auto-walk through all eight areas",
    needsBtn: "Support needs",
    strengthsBtn: "Strengths",
    compareBtn: "⇄ Compare",
    captionNeeds: "Fuller petals mean <strong>more support</strong> is helpful.",
    captionStrengths: "Fuller petals mean <strong>stronger</strong> areas.",
    captionCompare: "Needs and strengths, <strong>side by side</strong> — tap either wheel or the chips below.",
    legDefault: "1 ring = minimal · 5 rings = intensive",
    legNeeds: "1 ring = minimal support · 5 rings = intensive support",
    legStrengths: "1 ring = emerging · 5 rings = shining",
    legCompare: "Left: support needs · Right: strengths — selection stays in sync",
    kbdHint: "· ← → to walk the wheel",
    /* ---- empty state / completeness warning ---- */
    promptFill: "Fill in more of the passport (communication, sensory, behaviour, daily living) to generate {of}{name}'s support wheel.",
    continuePassportArrow: "Continue passport →",
    wheelWarn: "<strong>Wheel is {p}% complete</strong> — {a} of {t} contributing questions answered.",
    lowerConf: " Lower confidence in: {list}.",
    completeMore: "Complete more →",
    /* ---- detail panel ---- */
    notEnoughData: "Not enough data",
    trendSince: "Since {when}:",
    firstCheckin: "your first check-in",
    addMorePassport: "Add more in the passport to build this part of the profile.",
    supportLevel: "Support level",
    strengthsLabel: "Strengths",
    confidence: "Confidence",
    confHigh: "High",
    confMedium: "Medium",
    confLow: "Low",
    confNone: "No data",
    groupSupporting: "Areas we're supporting",
    groupStrategies: "Strategies that help",
    noneFlagged: "Nothing flagged right now",
    noneAdd: "Add details in the passport to see this",
    copy: "Copy",
    copied: "Copied ✓",
    copyStrategiesHead: "Strategies that help — {domain}{who}:",
    /* ---- disclaimer ---- */
    disclaimerTitle: "Preliminary profile — not a diagnosis.",
    disclaimerBody: "Generated from your passport answers. Confidence reflects how many related questions you've completed. For any concerns, speak with a qualified professional.",
  },
  fr: {
    /* ---- ribbon ---- */
    pageTitle: "Roue de soutien",
    wheelTitleNamed: "Roue de soutien {of}{name}",
    ribSub: "L'instrument complet — trois vues, une visite guidée et l'histoire derrière chaque pétale.",
    yourChild: "votre enfant",
    statWheelComplete: "roue complète",
    statAreasScored: "domaines évalués",
    statMostSupport: "plus de soutien",
    /* ---- stage: modes, tour, captions, legends ---- */
    tourBtn: "Visite",
    stopBtn: "Arrêter",
    tourTitle: "Parcourir automatiquement les huit domaines",
    needsBtn: "Besoins de soutien",
    strengthsBtn: "Forces",
    compareBtn: "⇄ Comparer",
    captionNeeds: "Des pétales plus pleins signifient que <strong>plus de soutien</strong> est utile.",
    captionStrengths: "Des pétales plus pleins signifient des domaines <strong>plus forts</strong>.",
    captionCompare: "Besoins et forces, <strong>côte à côte</strong> — touchez l'une des roues ou les pastilles ci-dessous.",
    legDefault: "1 anneau = minimal · 5 anneaux = intensif",
    legNeeds: "1 anneau = soutien minimal · 5 anneaux = soutien intensif",
    legStrengths: "1 anneau = émergent · 5 anneaux = éclatant",
    legCompare: "Gauche : besoins de soutien · Droite : forces — sélection synchronisée",
    kbdHint: "· ← → pour parcourir la roue",
    /* ---- empty state / completeness warning ---- */
    promptFill: "Remplissez davantage le passeport (communication, sensoriel, comportement, vie quotidienne) pour générer la roue de soutien {of}{name}.",
    continuePassportArrow: "Continuer le passeport →",
    wheelWarn: "<strong>La roue est complète à {p} %</strong> — {a} sur {t} questions contributives répondues.",
    lowerConf: " Confiance plus faible dans : {list}.",
    completeMore: "Complétez-en plus →",
    /* ---- detail panel ---- */
    notEnoughData: "Données insuffisantes",
    trendSince: "Depuis {when} :",
    firstCheckin: "votre premier bilan",
    addMorePassport: "Ajoutez-en plus dans le passeport pour bâtir cette partie du profil.",
    supportLevel: "Niveau de soutien",
    strengthsLabel: "Forces",
    confidence: "Confiance",
    confHigh: "Élevée",
    confMedium: "Moyenne",
    confLow: "Faible",
    confNone: "Aucune donnée",
    groupSupporting: "Ce qu'on soutient",
    groupStrategies: "Stratégies qui aident",
    noneFlagged: "Rien à signaler pour le moment",
    noneAdd: "Ajoutez des détails dans le passeport pour voir ceci",
    copy: "Copier",
    copied: "Copié ✓",
    copyStrategiesHead: "Stratégies qui aident — {domain}{who} :",
    /* ---- disclaimer ---- */
    disclaimerTitle: "Profil préliminaire — pas un diagnostic.",
    disclaimerBody: "Généré à partir de vos réponses au passeport. La confiance reflète le nombre de questions liées complétées. Pour toute inquiétude, parlez-en à un professionnel qualifié.",
  },
};
