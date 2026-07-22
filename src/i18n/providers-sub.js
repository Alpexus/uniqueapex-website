// ============================================================
// Strings: the Professionnels (Providers) SUB-pages — a single
// shared namespace, keys prefixed per page:
//   apps_      → /providers/applications (The Outreach Kit)
//   notes_     → /providers/notes        (The Call Log)
//   contacts_  → /providers/contacts     (The Care Team Book)
//   waitlists_ → /providers/waitlists    (Waitlists)
//
// {name}/{of} templates as in child.js ({of} = French "de "/"d'").
// Glossary matches src/i18n/providers.js (owned by the sibling
// /providers page): jumelage = matching · démarche = outreach
// batch · Professionnels = Providers. Service-type codes
// (slp/ot/aba/psych/social), the waitlist service_* column keys
// and the waitlist status VALUES are read from Supabase and stay
// canonical — only the LABELS shown are translated. Clinic and
// provider names come from the DB and are never translated.
// Wheel domain NAMES stay English (engine trio); apps_needNice
// is the page's own outreach-email phrasing keyed by those names.
// Dates render with window.uaLocale.
// ============================================================
export default {
  en: {
    /* ==================== Applications — apps_ ==================== */
    /* ribbon */
    apps_title: "The Outreach Kit",
    apps_ribSub: "Reaching out is the hardest part — so we wrote it for you, from the passport.",
    apps_ribSubNamed: "Reaching out is the hardest part — so we wrote it for you, from {name}'s passport.",
    apps_ourChild: "our child",
    apps_templatesReady: "templates ready",
    apps_topNeedInside: "top need inside",
    apps_parentFallback: "…",
    apps_clinicFallback: "clinic",
    /* card 1 — sent batches */
    apps_sentBatchesTitle: "Sent batches",
    apps_sentBatchesSub: "Every batch we sent on your behalf — date, clinics, status. Replies go straight to your inbox.",
    apps_sendBatch: "Send a batch",
    apps_checking: "Checking…",
    apps_sentToClinics1: "sent to {n} clinic",
    apps_sentToClinicsN: "sent to {n} clinics",
    apps_historyUnavailable: "Outreach history appears once the outreach setup is deployed.",
    apps_noBatches1: "No batches yet. Go to",
    apps_noBatchesLink: "Matches",
    apps_noBatches2: ", pick a service, choose your clinics and approve the email — every send is logged here with its date and clinics.",
    apps_svcNice: { slp: "Speech-language therapy", ot: "Occupational therapy", aba: "Behaviour support", psych: "Psychology", social: "Social skills groups" },
    apps_status: { sent: "sent", partial: "partial", failed: "failed", queued: "queued" },
    /* card 2 — first email */
    apps_firstEmailTitle: "The first email",
    apps_firstEmailSub: "Personalized from the passport — edit anything before sending.",
    apps_copyEmail: "Copy email",
    apps_buildingEmail: "Building your email…",
    apps_emailCopied: "Email copied — paste it anywhere ✓",
    /* card 3 — phone script */
    apps_phoneTitle: "The phone script",
    apps_phoneSub: "For the clinics that only answer the phone.",
    apps_copyShort: "Copy",
    apps_phoneCopied: "Phone script copied ✓",
    /* card 4 — attach these */
    apps_attachTitle: "Attach these",
    apps_attachSub: "What providers actually want on first contact.",
    apps_attach1b: "The Family Passport PDF",
    apps_attach1: " — export it from the Overview; it answers 90% of intake questions. ",
    apps_attach1link: "Export →",
    apps_attach2b: "The latest evaluation report",
    apps_attach2: ", if you have one. ",
    apps_attach2link: "Open the vault →",
    apps_attach3b: "Your availability",
    apps_attach3: " — two or three time windows makes scheduling twice as fast.",
    /* note strip */
    apps_noteB: "Application tracking is coming with the provider directory.",
    apps_note1: "Until then, log every call and reply in",
    apps_noteLink: "Notes",
    apps_note2: " — future you will be grateful.",
    /* outreach email + phone body (composed in the app's language) */
    apps_subjAge: "{age}-year-old",
    apps_subjYoung: "young child",
    apps_childAged: "{age}-year-old child",
    apps_childPlain: "child",
    apps_needJoin: " and ",
    apps_needFallback: "development",
    apps_needNice: {
      "Communication": "communication",
      "Social Connection": "social connection",
      "Sensory Processing": "sensory regulation",
      "Flexibility & Transitions": "transitions and flexibility",
      "Emotional Regulation": "emotional regulation",
      "Executive Function": "attention and organization",
      "Daily Living Skills": "daily-living independence",
      "Learning & Play": "learning and play",
    },
    apps_emailBody: `Subject: New client inquiry — {first}, {subj}

Hello,

My name is {parent} and I'm reaching out about services for my {child}, {first}{dx}. We're based in Montréal and looking for support with {need}.

Could you tell me:
• whether you're currently accepting new clients (or the waitlist length),
• your availability and rates,
• and what you'd need from us for an intake.

I can share a one-page family profile with {first}'s strengths, needs and history right away — it answers most intake questions.

Thank you so much,
{parent}`,
    apps_phoneBody: `Hi, my name is {parent} — I'm calling about services for my {child}, {first}.

1. "Are you accepting new clients, or is there a waitlist I can join today?"
2. "What does intake look like, and what should I send ahead of time?"
3. "Is there a cancellation list we could be on?"
4. Before hanging up: get a NAME and a DATE ("Who should I follow up with, and when?").`,

    /* ==================== Notes — notes_ ==================== */
    notes_title: "The Call Log",
    notes_sub: "“They said they'd call back Tuesday…” — never lose track of a conversation again.",
    notes_phWho: "Who (clinic, person) *",
    notes_phText: "What was said / next step *",
    notes_hint: "Saved on this device for now — syncing comes with the directory.",
    notes_copyLog: "Copy the log",
    notes_logIt: "Log it",
    notes_entry1: "entry",
    notes_entryN: "entries",
    notes_empty: "<b>Nothing logged yet.</b> After the next call, write one line — who you spoke to and what happens next. Three entries in, this page becomes your secret weapon.",
    notes_deleteAria: "Delete note",
    notes_confirmDelete: "Delete this entry?",
    notes_logged: "Logged ✓ — future you says thanks",
    notes_copied: "Call log copied ✓",

    /* ==================== Contacts — contacts_ ==================== */
    contacts_title: "The Care Team Book",
    contacts_sub: "Every therapist, clinic and coordinator in one place — one tap to call or write.",
    contacts_phName: "Name *",
    contacts_phRole: "Role (SLP, OT, pediatrician…)",
    contacts_phOrg: "Clinic / organization",
    contacts_phPhone: "Phone",
    contacts_phEmail: "Email",
    contacts_phNote: "Note (waitlist, hours…)",
    contacts_hint: "Saved on this device for now — syncing comes with the directory.",
    contacts_addContact: "Add contact",
    contacts_word1: "contact",
    contacts_wordN: "contacts",
    contacts_empty: "<b>No contacts yet.</b> Add the pediatrician, the CLSC social worker, the clinic front desk — every number you've ever scribbled on a receipt, finally in one place.",
    contacts_call: "Call",
    contacts_email: "Email",
    contacts_deleteAria: "Delete contact",
    contacts_confirmRemove: "Remove this contact?",
    contacts_added: "{name} added to the care team ✓",

    /* ==================== Waitlists — waitlists_ ==================== */
    waitlists_title: "Waitlists",
    waitlists_titleNamed: "{name}'s Waitlists",
    waitlists_sub: "A spot costs nothing to hold — and you can always decline. Here's where you stand.",
    waitlists_checking: "Checking your waitlists…",
    waitlists_signup1: "signup",
    waitlists_signupN: "signups",
    waitlists_matchedLabel: "matched",
    waitlists_svc: { service_slp: "Speech therapy", service_ot: "Occupational therapy", service_aba: "Behaviour / ABA", service_other: "Other services" },
    waitlists_general: "General",
    waitlists_status: { New: "New", Contacted: "Contacted", Matched: "Matched", Waitlisted: "Waitlisted", Closed: "Closed" },
    waitlists_empty: "<b>No waitlist signups yet.</b> Québec waitlists run long — joining early is the single highest-leverage move. Two minutes, and your place is held with today's date.",
    waitlists_joinCta: "Join the waitlist",
    waitlists_coordName: "Coordination waitlist",
    waitlists_placeHeld: "Place held since {date}",
    waitlists_howTitle: "How it works",
    waitlists_step1b: "You join once.",
    waitlists_step1: "We keep your place and your child's needs on file — no re-explaining.",
    waitlists_step2b: "We watch the lists.",
    waitlists_step2: "When the directory opens in Montréal, your signup carries over with its original date.",
    waitlists_step3b: "You get first call.",
    waitlists_step3: "A matching spot opens → you hear about it before it's public.",
  },

  fr: {
    /* ==================== Applications — apps_ ==================== */
    /* ribbon */
    apps_title: "La trousse de démarches",
    apps_ribSub: "Faire le premier pas est le plus difficile — alors nous l'avons rédigé pour vous, à partir du passeport.",
    apps_ribSubNamed: "Faire le premier pas est le plus difficile — alors nous l'avons rédigé pour vous, à partir du passeport {of}{name}.",
    apps_ourChild: "notre enfant",
    apps_templatesReady: "modèles prêts",
    apps_topNeedInside: "besoin principal inclus",
    apps_parentFallback: "…",
    apps_clinicFallback: "clinique",
    /* card 1 — sent batches */
    apps_sentBatchesTitle: "Démarches envoyées",
    apps_sentBatchesSub: "Chaque démarche envoyée en votre nom — date, cliniques, statut. Les réponses arrivent directement dans votre boîte de réception.",
    apps_sendBatch: "Envoyer une démarche",
    apps_checking: "Vérification…",
    apps_sentToClinics1: "envoyée à {n} clinique",
    apps_sentToClinicsN: "envoyée à {n} cliniques",
    apps_historyUnavailable: "L'historique des démarches apparaîtra une fois l'envoi configuré et déployé.",
    apps_noBatches1: "Aucune démarche pour l'instant. Allez dans",
    apps_noBatchesLink: "Jumelages",
    apps_noBatches2: ", choisissez un service, sélectionnez vos cliniques et approuvez le courriel — chaque envoi est consigné ici avec sa date et ses cliniques.",
    apps_svcNice: { slp: "Orthophonie", ot: "Ergothérapie", aba: "Psychoéducation / ABA", psych: "Psychologie", social: "Habiletés sociales" },
    apps_status: { sent: "envoyée", partial: "partielle", failed: "échouée", queued: "en attente" },
    /* card 2 — first email */
    apps_firstEmailTitle: "Le premier courriel",
    apps_firstEmailSub: "Personnalisé à partir du passeport — modifiez ce que vous voulez avant l'envoi.",
    apps_copyEmail: "Copier le courriel",
    apps_buildingEmail: "Préparation de votre courriel…",
    apps_emailCopied: "Courriel copié — collez-le où vous voulez ✓",
    /* card 3 — phone script */
    apps_phoneTitle: "Le script téléphonique",
    apps_phoneSub: "Pour les cliniques qui ne répondent qu'au téléphone.",
    apps_copyShort: "Copier",
    apps_phoneCopied: "Script téléphonique copié ✓",
    /* card 4 — attach these */
    apps_attachTitle: "À joindre",
    apps_attachSub: "Ce que les professionnels veulent vraiment au premier contact.",
    apps_attach1b: "Le PDF du Passeport familial",
    apps_attach1: " — exportez-le depuis l'Aperçu; il répond à 90 % des questions d'accueil. ",
    apps_attach1link: "Exporter →",
    apps_attach2b: "Le dernier rapport d'évaluation",
    apps_attach2: ", si vous en avez un. ",
    apps_attach2link: "Ouvrir le coffre →",
    apps_attach3b: "Vos disponibilités",
    apps_attach3: " — deux ou trois plages horaires rendent la planification deux fois plus rapide.",
    /* note strip */
    apps_noteB: "Le suivi des démarches arrive avec le répertoire des professionnels.",
    apps_note1: "En attendant, consignez chaque appel et réponse dans",
    apps_noteLink: "Notes",
    apps_note2: " — vous vous remercierez plus tard.",
    /* outreach email + phone body (composed in the app's language) */
    apps_subjAge: "{age} ans",
    apps_subjYoung: "jeune enfant",
    apps_childAged: "enfant de {age} ans",
    apps_childPlain: "enfant",
    apps_needJoin: " et ",
    apps_needFallback: "développement",
    apps_needNice: {
      "Communication": "communication",
      "Social Connection": "interactions sociales",
      "Sensory Processing": "régulation sensorielle",
      "Flexibility & Transitions": "transitions et flexibilité",
      "Emotional Regulation": "régulation émotionnelle",
      "Executive Function": "attention et organisation",
      "Daily Living Skills": "autonomie au quotidien",
      "Learning & Play": "apprentissage et jeu",
    },
    apps_emailBody: `Objet : Nouvelle demande de client — {first}, {subj}

Bonjour,

Je m'appelle {parent} et je vous écris au sujet de services pour mon {child}, {first}{dx}. Nous sommes à Montréal et nous cherchons du soutien en {need}.

Pourriez-vous me dire :
• si vous acceptez de nouveaux clients en ce moment (ou la longueur de la liste d'attente),
• vos disponibilités et vos tarifs,
• et ce dont vous auriez besoin de notre part pour ouvrir un dossier.

Je peux vous envoyer tout de suite un profil familial d'une page avec les forces, les besoins et l'historique {of}{first} — il répond à la plupart des questions d'accueil.

Merci beaucoup,
{parent}`,
    apps_phoneBody: `Bonjour, je m'appelle {parent} — j'appelle au sujet de services pour mon {child}, {first}.

1. « Acceptez-vous de nouveaux clients, ou y a-t-il une liste d'attente à laquelle je peux m'inscrire aujourd'hui? »
2. « Comment se déroule l'accueil, et que dois-je envoyer à l'avance? »
3. « Y a-t-il une liste d'annulation où nous pourrions être inscrits? »
4. Avant de raccrocher : obtenez un NOM et une DATE (« Avec qui devrais-je faire le suivi, et quand? »).`,

    /* ==================== Notes — notes_ ==================== */
    notes_title: "Le journal d'appels",
    notes_sub: "« Ils ont dit qu'ils rappelleraient mardi… » — ne perdez plus jamais le fil d'une conversation.",
    notes_phWho: "Qui (clinique, personne) *",
    notes_phText: "Ce qui a été dit / prochaine étape *",
    notes_hint: "Enregistré sur cet appareil pour l'instant — la synchronisation arrivera avec le répertoire.",
    notes_copyLog: "Copier le journal",
    notes_logIt: "Consigner",
    notes_entry1: "entrée",
    notes_entryN: "entrées",
    notes_empty: "<b>Rien de consigné pour l'instant.</b> Après le prochain appel, écrivez une ligne — à qui vous avez parlé et ce qui suit. Après trois entrées, cette page devient votre arme secrète.",
    notes_deleteAria: "Supprimer la note",
    notes_confirmDelete: "Supprimer cette entrée?",
    notes_logged: "Consigné ✓ — le vous du futur vous remercie",
    notes_copied: "Journal d'appels copié ✓",

    /* ==================== Contacts — contacts_ ==================== */
    contacts_title: "Le carnet de l'équipe de soins",
    contacts_sub: "Chaque thérapeute, clinique et coordonnateur au même endroit — un toucher pour appeler ou écrire.",
    contacts_phName: "Nom *",
    contacts_phRole: "Rôle (ortho, ergo, pédiatre…)",
    contacts_phOrg: "Clinique / organisme",
    contacts_phPhone: "Téléphone",
    contacts_phEmail: "Courriel",
    contacts_phNote: "Note (liste d'attente, heures…)",
    contacts_hint: "Enregistré sur cet appareil pour l'instant — la synchronisation arrivera avec le répertoire.",
    contacts_addContact: "Ajouter un contact",
    contacts_word1: "contact",
    contacts_wordN: "contacts",
    contacts_empty: "<b>Aucun contact pour l'instant.</b> Ajoutez le pédiatre, la travailleuse sociale du CLSC, la réception de la clinique — chaque numéro griffonné sur un reçu, enfin au même endroit.",
    contacts_call: "Appeler",
    contacts_email: "Courriel",
    contacts_deleteAria: "Supprimer le contact",
    contacts_confirmRemove: "Retirer ce contact?",
    contacts_added: "{name} ajouté à l'équipe de soins ✓",

    /* ==================== Waitlists — waitlists_ ==================== */
    waitlists_title: "Listes d'attente",
    waitlists_titleNamed: "Listes d'attente {of}{name}",
    waitlists_sub: "Retenir une place ne coûte rien — et vous pouvez toujours refuser. Voici où vous en êtes.",
    waitlists_checking: "Vérification de vos listes d'attente…",
    waitlists_signup1: "inscription",
    waitlists_signupN: "inscriptions",
    waitlists_matchedLabel: "jumelés",
    waitlists_svc: { service_slp: "Orthophonie", service_ot: "Ergothérapie", service_aba: "Comportement / ABA", service_other: "Autres services" },
    waitlists_general: "Général",
    waitlists_status: { New: "Nouveau", Contacted: "Contacté", Matched: "Jumelé", Waitlisted: "Sur liste", Closed: "Fermé" },
    waitlists_empty: "<b>Aucune inscription pour l'instant.</b> Les listes d'attente au Québec sont longues — s'inscrire tôt est le geste le plus payant. Deux minutes, et votre place est retenue à la date d'aujourd'hui.",
    waitlists_joinCta: "S'inscrire à la liste",
    waitlists_coordName: "Liste d'attente de coordination",
    waitlists_placeHeld: "Place retenue depuis le {date}",
    waitlists_howTitle: "Comment ça marche",
    waitlists_step1b: "Vous vous inscrivez une seule fois.",
    waitlists_step1: "Nous gardons votre place et les besoins de votre enfant au dossier — sans tout réexpliquer.",
    waitlists_step2b: "Nous surveillons les listes.",
    waitlists_step2: "Quand le répertoire ouvrira à Montréal, votre inscription sera reportée avec sa date d'origine.",
    waitlists_step3b: "Vous êtes appelé en premier.",
    waitlists_step3: "Une place correspondante se libère → vous l'apprenez avant que ce soit public.",
  },
};
