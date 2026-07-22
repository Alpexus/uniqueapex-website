// ============================================================
// Strings: /providers — the 3-step matching wizard (search →
// matches + map → review & send). {name}/{of} templates as in
// child.js ({of} = French "de "/"d'"). Wheel domain names stay
// English (they come from the wheel engine trio). service_type
// codes (slp/ot/aba/psych/social) and everything sent to
// Supabase stay canonical — only labels are translated here.
// svcs.<code> forms: name (card title), sub (card subtitle),
// cat (lowercase category label), seek ("I'm looking for …"
// form used in the email body), subj (subject-line form after
// "Family seeking / Famille à la recherche").
// ============================================================
export default {
  en: {
    /* ---- ribbon / header ---- */
    findProviders: "Find Providers",
    findProvidersFor: "Find Providers for {name}",
    ribSub: "Tell us what you need — we match you with the 5 closest clinics, you approve the email, we send it.",
    statBatches: "batches sent",
    waitlist1: "waitlist",
    waitlistN: "waitlists",
    /* ---- gate (no passport yet) ---- */
    gateText: "Fill in the passport first — matching starts from your child's needs and your address.",
    gateCta: "Start the passport →",
    ourChild: "our child",
    /* ---- crumbs ---- */
    crumb1: "Your search",
    crumb2: "Your matches",
    crumb3: "Review & send",
    /* ---- screen 1 · search ---- */
    selectService: "Select a service below",
    howFar: "How far would you travel?",
    phPostal: "H2V 2K3",
    kmVal: "{km} km",
    findMatches: "✦ Find matches",
    pickService: "Pick a service to start matching.",
    stillView: "You can still view your matches.",
    needPostal: "Add a valid postal code so we can match by distance.",
    postalUnknown: "That postal code isn't in our map yet — matches will show without distances until it is.",
    postalSaved: "Postal code saved to {name}'s passport ✓",
    /* ---- services (labels only — codes stay canonical) ---- */
    svcs: {
      slp: { name: "Speech-language therapy", sub: "Orthophonie", cat: "speech-language therapy", seek: "speech-language therapy", subj: "speech-language therapy" },
      ot: { name: "Occupational therapy", sub: "Ergothérapie", cat: "occupational therapy", seek: "occupational therapy", subj: "occupational therapy" },
      aba: { name: "Behaviour support", sub: "Psychoéducation / ABA", cat: "behaviour support", seek: "behaviour support", subj: "behaviour support" },
      psych: { name: "Child psychologist", sub: "Psychologue", cat: "child psychologist", seek: "a child psychologist", subj: "child psychologist" },
      social: { name: "Social skills groups", sub: "Habiletés sociales", cat: "social skills groups", seek: "social skills groups", subj: "social skills groups" },
    },
    servicesFallback: "services",
    noDxYet: "No diagnosis on file yet",
    flaggedOnWheel: "{domain} flagged on the wheel",
    /* ---- quotas ---- */
    quotaFreeIncluded: "Free plan: one included batch for this service.",
    quotaFreeUsed: "Free batch for this service used {date} — upgrade for monthly rounds.",
    quotaNext1: "Next batch for this service unlocks in {n} day.",
    quotaNextN: "Next batch for this service unlocks in {n} days.",
    /* ---- searching animation ---- */
    s1Searching: "Searching the clinic directory…",
    s2Measuring: "Measuring distances from home…",
    s3Protection: "Applying the 90-day protection…",
    /* ---- screen 2 · matches ---- */
    yourMatches: "Your matches",
    clinicsWithin1: "{n} clinic within {km} km · {svc}",
    clinicsWithinN: "{n} clinics within {km} km · {svc}",
    clinicsFound1: "{n} clinic found · {svc}",
    clinicsFoundN: "{n} clinics found · {svc}",
    noMatchesWithin: "No matches within {km} km",
    noMatchesYet: "No matches yet",
    resSub: "nearest first · the closest {n} are preselected — swap any you like",
    tryWider: "Try a wider distance — the directory is still growing.",
    noneYet: "No contactable clinics for this service yet — the directory is filling.",
    protectedNear1: "{n} nearby clinic was contacted for {name} in the last 90 days — they're excluded to protect the relationship.",
    protectedNearN: "{n} nearby clinics were contacted for {name} in the last 90 days — they're excluded to protect the relationship.",
    distNA: "distance n/a",
    mnoteMain: "You can contact up to {n} clinics per batch — tick and untick to build your five.",
    mnoteNearest15: "Showing the nearest 15 — pick a radius to browse your area.",
    mnoteMatched: "Matched by distance today ✦ acceptance & waitlist data refine this as clinics join.",
    protected1: "{n} clinic contacted in the last 90 days is excluded — providers stay protected from repeat emails.",
    protectedN: "{n} clinics contacted in the last 90 days are excluded — providers stay protected from repeat emails.",
    capMax: "✋ Five clinics max per batch — untick one to swap this one in.",
    adjustSearch: "← Adjust search",
    reviewEmailBtn: "Review the email →",
    selectFirst: "Select at least one clinic first.",
    /* ---- map ---- */
    mapHint: "Tap a pin for the clinic's details and directions ✦ the gold star is home.",
    under1: "under 1",
    kmFromHome: "{d} km from home",
    website: "Website ↗",
    openGmaps: "Open in Google Maps ↗",
    homeApprox: "Home (approximate)",
    homeTitle: "Home ✦",
    homeNote: "Approximate — postal-code area. Never shared with providers.",
    mapNoKey: "🗺 The map needs its Google Maps key.<br>Open <b>GOOGLE_MAPS_SETUP.md</b> in the project folder for the 10-minute setup, then paste the key into providers.astro.",
    mapFail: "The map couldn't load — check your connection (your matches above still work).",
    /* ---- screen 3 · review & send ---- */
    reviewEmailTitle: "Review the email",
    sendingTo: "Sending to",
    clinics1: "{n} clinic",
    clinicsN: "{n} clinics",
    oneEmailEach: "one personalized email each",
    subjectLabel: "Subject:",
    emailSubject: "Family seeking {svc} — {name}{age} (Montréal)",
    subjAge: ", {age} y/o",
    setAuto: "· set automatically",
    childAged: "{age}-year-old child",
    childPlain: "child",
    travelUpTo: " and can travel up to {km} km",
    emailBody: `My name is {parent}, and I'm looking for {svc} for my {child}, {name}{dx}. We're in Montréal{travel}.

A few questions to help us get started:
• Are you currently accepting new clients — or is there a waitlist we could join?
• What does your availability look like (days and times), and what are your rates?
• What would you need from us to book an intake?

Warm thanks,
{parent2}`,
    footPeek: "Added automatically: a personal \"Hello\" with each clinic's name on top · a short UniqueApex footer with the 90-day no-repeat promise · Reply-To set to your email, so answers land in your inbox.",
    consentText: "I am this child's parent or legal guardian, and I consent to sharing their first name, age and diagnosis with the clinics selected above so they can respond about services.",
    privacyPolicy: "Privacy policy",
    backToMatches: "← Back to matches",
    sendBtn: "✦ Send",
    sending: "Sending…",
    selectOne: "Go back and select at least one clinic.",
    tickConsent: "Tick the consent box to enable sending.",
    quotaReady: "One personalized email per clinic · replies come straight to you.",
    upsellTitle: "That was the free batch ✦",
    upsellMsg: "Monthly plans send a fresh batch per service every 30 days — and the concierge follows up for you.",
    upsellCta: "See the plans",
    confirmSend1: "Send your email about {name} to the {n} selected clinic? Replies go straight to your inbox.",
    confirmSendN: "Send your email about {name} to the {n} selected clinics? Replies go straight to your inbox.",
    /* ---- success ---- */
    sentTo1: "Sent to {n} clinic",
    sentToN: "Sent to {n} clinics",
    sentNote: "Replies land straight in your inbox. Clinics move fastest when you answer within a day — and the Family Passport PDF covers most intake questions.",
    sentLogged: "Logged {date} in Providers → Applications · these clinics are now protected from repeat emails for 90 days.",
    newSearch: "Start a new search",
    sentToast: "Sent ✦ replies go straight to your inbox.",
    /* ---- errors ---- */
    err402: "The free plan includes one batch per service type.",
    errBusy: "Those clinics can't be contacted right now.",
    errSend: "Couldn't send — is the outreach function deployed?",
    errNetwork: "Couldn't reach the outreach service — try again in a moment.",
  },
  fr: {
    /* ---- ribbon / header ---- */
    findProviders: "Trouver des professionnels",
    findProvidersFor: "Trouver des professionnels pour {name}",
    ribSub: "Dites-nous ce qu'il vous faut — nous vous jumelons aux 5 cliniques les plus proches, vous approuvez le courriel, nous l'envoyons.",
    statBatches: "démarches envoyées",
    waitlist1: "liste d'attente",
    waitlistN: "listes d'attente",
    /* ---- gate (no passport yet) ---- */
    gateText: "Remplissez d'abord le passeport — le jumelage part des besoins de votre enfant et de votre adresse.",
    gateCta: "Commencer le passeport →",
    ourChild: "notre enfant",
    /* ---- crumbs ---- */
    crumb1: "Votre recherche",
    crumb2: "Vos jumelages",
    crumb3: "Réviser et envoyer",
    /* ---- screen 1 · search ---- */
    selectService: "Choisissez un service ci-dessous",
    howFar: "Jusqu'où pourriez-vous vous déplacer?",
    phPostal: "H2V 2K3",
    kmVal: "{km} km",
    findMatches: "✦ Lancer le jumelage",
    pickService: "Choisissez un service pour lancer le jumelage.",
    stillView: "Vous pouvez quand même consulter vos jumelages.",
    needPostal: "Ajoutez un code postal valide pour que nous puissions jumeler par distance.",
    postalUnknown: "Ce code postal n'est pas encore dans notre carte — les jumelages s'afficheront sans distance en attendant.",
    postalSaved: "Code postal enregistré dans le passeport {of}{name} ✓",
    /* ---- services (labels only — codes stay canonical) ---- */
    svcs: {
      slp: { name: "Orthophonie", sub: "Speech-language therapy", cat: "orthophonie", seek: "de l'orthophonie", subj: "d'orthophonie" },
      ot: { name: "Ergothérapie", sub: "Occupational therapy", cat: "ergothérapie", seek: "de l'ergothérapie", subj: "d'ergothérapie" },
      aba: { name: "Psychoéducation / ABA", sub: "Behaviour support", cat: "psychoéducation / ABA", seek: "de la psychoéducation / ABA", subj: "de psychoéducation / ABA" },
      psych: { name: "Psychologue", sub: "Child psychologist", cat: "psychologue", seek: "un psychologue", subj: "d'un psychologue" },
      social: { name: "Habiletés sociales", sub: "Social skills groups", cat: "habiletés sociales", seek: "un groupe d'habiletés sociales", subj: "de groupes d'habiletés sociales" },
    },
    servicesFallback: "services",
    noDxYet: "Aucun diagnostic au dossier pour l'instant",
    flaggedOnWheel: "{domain} ressort sur la roue",
    /* ---- quotas ---- */
    quotaFreeIncluded: "Forfait gratuit : une démarche incluse pour ce service.",
    quotaFreeUsed: "Démarche gratuite pour ce service utilisée le {date} — passez à un forfait pour des envois mensuels.",
    quotaNext1: "La prochaine démarche pour ce service se débloque dans {n} jour.",
    quotaNextN: "La prochaine démarche pour ce service se débloque dans {n} jours.",
    /* ---- searching animation ---- */
    s1Searching: "Recherche dans le répertoire des cliniques…",
    s2Measuring: "Calcul des distances depuis la maison…",
    s3Protection: "Application de la protection de 90 jours…",
    /* ---- screen 2 · matches ---- */
    yourMatches: "Vos jumelages",
    clinicsWithin1: "{n} clinique dans un rayon de {km} km · {svc}",
    clinicsWithinN: "{n} cliniques dans un rayon de {km} km · {svc}",
    clinicsFound1: "{n} clinique trouvée · {svc}",
    clinicsFoundN: "{n} cliniques trouvées · {svc}",
    noMatchesWithin: "Aucun jumelage dans un rayon de {km} km",
    noMatchesYet: "Aucun jumelage pour l'instant",
    resSub: "triées par distance · les {n} plus proches sont présélectionnées — remplacez celles que vous voulez",
    tryWider: "Essayez une plus grande distance — le répertoire s'agrandit encore.",
    noneYet: "Aucune clinique joignable pour ce service pour l'instant — le répertoire se remplit.",
    protectedNear1: "{n} clinique à proximité a été contactée pour {name} au cours des 90 derniers jours — elle est exclue pour préserver le lien.",
    protectedNearN: "{n} cliniques à proximité ont été contactées pour {name} au cours des 90 derniers jours — elles sont exclues pour préserver le lien.",
    distNA: "distance inconnue",
    mnoteMain: "Vous pouvez contacter jusqu'à {n} cliniques par démarche — cochez et décochez pour composer vos cinq.",
    mnoteNearest15: "Les 15 plus proches sont affichées — choisissez un rayon pour explorer votre secteur.",
    mnoteMatched: "Jumelage par distance pour l'instant ✦ les données d'acceptation et de listes d'attente l'affineront à mesure que les cliniques s'ajoutent.",
    protected1: "{n} clinique contactée au cours des 90 derniers jours est exclue — les professionnels restent protégés des courriels répétés.",
    protectedN: "{n} cliniques contactées au cours des 90 derniers jours sont exclues — les professionnels restent protégés des courriels répétés.",
    capMax: "✋ Cinq cliniques maximum par démarche — décochez-en une pour ajouter celle-ci.",
    adjustSearch: "← Ajuster la recherche",
    reviewEmailBtn: "Réviser le courriel →",
    selectFirst: "Sélectionnez d'abord au moins une clinique.",
    /* ---- map ---- */
    mapHint: "Touchez une épingle pour voir les détails de la clinique et l'itinéraire ✦ l'étoile dorée, c'est la maison.",
    under1: "moins de 1",
    kmFromHome: "{d} km de la maison",
    website: "Site Web ↗",
    openGmaps: "Ouvrir dans Google Maps ↗",
    homeApprox: "Maison (position approximative)",
    homeTitle: "Maison ✦",
    homeNote: "Approximatif — secteur du code postal. Jamais partagé avec les professionnels.",
    mapNoKey: "🗺 La carte a besoin de sa clé Google Maps.<br>Ouvrez <b>GOOGLE_MAPS_SETUP.md</b> dans le dossier du projet pour la configuration de 10 minutes, puis collez la clé dans providers.astro.",
    mapFail: "La carte n'a pas pu se charger — vérifiez votre connexion (vos jumelages ci-dessus fonctionnent quand même).",
    /* ---- screen 3 · review & send ---- */
    reviewEmailTitle: "Réviser le courriel",
    sendingTo: "Envoi à",
    clinics1: "{n} clinique",
    clinicsN: "{n} cliniques",
    oneEmailEach: "un courriel personnalisé par clinique",
    subjectLabel: "Objet :",
    emailSubject: "Famille à la recherche {svc} — {name}{age} (Montréal)",
    subjAge: ", {age} ans",
    setAuto: "· défini automatiquement",
    childAged: "enfant de {age} ans",
    childPlain: "enfant",
    travelUpTo: " et nous pouvons nous déplacer jusqu'à {km} km",
    emailBody: `Je m'appelle {parent} et je cherche {svc} pour mon {child}, {name}{dx}. Nous sommes à Montréal{travel}.

Quelques questions pour bien commencer :
• Acceptez-vous de nouveaux clients en ce moment — ou y a-t-il une liste d'attente à laquelle nous pourrions nous inscrire?
• Quelles sont vos disponibilités (jours et heures) et quels sont vos tarifs?
• De quoi auriez-vous besoin de notre part pour ouvrir un dossier?

Merci beaucoup,
{parent2}`,
    footPeek: "Ajouté automatiquement : un « Bonjour » personnalisé avec le nom de chaque clinique en tête · un court pied de page UniqueApex avec la promesse de 90 jours sans courriel répété · une adresse de réponse (Reply-To) réglée à votre courriel, pour que les réponses arrivent dans votre boîte de réception.",
    consentText: "Je suis le parent ou le tuteur légal de cet enfant et je consens à partager son prénom, son âge et son diagnostic avec les cliniques sélectionnées ci-dessus afin qu'elles puissent nous répondre au sujet des services.",
    privacyPolicy: "Politique de confidentialité",
    backToMatches: "← Retour aux jumelages",
    sendBtn: "✦ Envoyer",
    sending: "Envoi…",
    selectOne: "Revenez en arrière et sélectionnez au moins une clinique.",
    tickConsent: "Cochez la case de consentement pour activer l'envoi.",
    quotaReady: "Un courriel personnalisé par clinique · les réponses vous arrivent directement.",
    upsellTitle: "C'était la démarche gratuite ✦",
    upsellMsg: "Les forfaits mensuels envoient une nouvelle démarche par service tous les 30 jours — et le concierge fait les suivis pour vous.",
    upsellCta: "Voir les forfaits",
    confirmSend1: "Envoyer votre courriel au sujet {of}{name} à la clinique sélectionnée? Les réponses arrivent directement dans votre boîte de réception.",
    confirmSendN: "Envoyer votre courriel au sujet {of}{name} aux {n} cliniques sélectionnées? Les réponses arrivent directement dans votre boîte de réception.",
    /* ---- success ---- */
    sentTo1: "Envoyé à {n} clinique",
    sentToN: "Envoyé à {n} cliniques",
    sentNote: "Les réponses arrivent directement dans votre boîte de réception. Les cliniques avancent plus vite quand vous répondez en moins d'une journée — et le PDF du Passeport familial couvre la plupart des questions d'accueil.",
    sentLogged: "Consigné le {date} dans Professionnels → Démarches · ces cliniques sont maintenant protégées des courriels répétés pendant 90 jours.",
    newSearch: "Nouvelle recherche",
    sentToast: "Envoyé ✦ les réponses arrivent directement dans votre boîte de réception.",
    /* ---- errors ---- */
    err402: "Le forfait gratuit comprend une démarche par type de service.",
    errBusy: "Ces cliniques ne peuvent pas être contactées pour le moment.",
    errSend: "Envoi impossible — la fonction d'envoi est-elle déployée?",
    errNetwork: "Impossible de joindre le service d'envoi — réessayez dans un instant.",
  },
};
