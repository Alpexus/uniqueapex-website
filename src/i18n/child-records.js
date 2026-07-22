// ============================================================
// Strings: /child/assessments — the Records tab ("Dossiers"):
// evaluation library (reports · assessment records · hub).
// {name}/{of} templates as in child.js ({of} = French "de "/"d'").
// Assessment TYPE values stay canonical English in the DB and in
// TYPE_COLOR — the type* keys here are display LABELS only (the
// select options carry value="…" with the English value).
// User data (filenames, provider names, typed findings/recs) is
// never translated.
// ============================================================
export default {
  en: {
    /* ---- ribbon ---- */
    ribbonTitle: "Assessments",
    ribbonTitleNamed: "{name}'s Assessments",
    ribbonSub: "Every evaluation in one library — reports, key findings, and all the recommendations.",
    statReports: "reports on file",
    statRecords: "records captured",
    statRecs: "recommendations",
    /* ---- AI reader card ---- */
    aiTitle: "AI Report Reader",
    aiBadge: "Rolling out",
    aiBody: "Assessment reports are dense. The reader will turn any uploaded report into a plain-language summary — what was found, what's recommended, what to do next. Reports you upload now will be summarized automatically when it launches.",
    aiCta: "Open the vault",
    /* ---- reports card ---- */
    reportsTitle: "Reports",
    reportsSub: "The files themselves — PDFs, scans and originals, straight from the vault.",
    uploadReport: "Upload a report",
    documentFallback: "Document",
    fileFallback: "file",
    uploadedOn: "Uploaded {date}",
    docsEmpty: "No reports yet — every evaluation lives in one place, uploaded once and never dug for again.",
    uploadFirst: "Upload the first one →",
    /* ---- records card ---- */
    recordsTitle: "Assessment records",
    recordsSub: "The key findings and recommendations, captured so nothing gets lost.",
    addAssessment: "Add assessment",
    typeSpeech: "Speech / language",
    typeOT: "Occupational therapy",
    typePsychoEd: "Psychoeducational",
    typeABA: "Behavioural / ABA",
    typeDevPed: "Developmental pediatric",
    typePhysio: "Physiotherapy",
    typeOther: "Other",
    providerPh: "Provider or clinic",
    findingsPh: "Key findings (paste or summarize from the report)…",
    recsPh: "Recommendations — one per line…",
    cancel: "Cancel",
    saveAssessment: "Save assessment",
    saving: "Saving…",
    errNeedContent: "Add at least some findings or recommendations.",
    errSaveTable: "Couldn't save. Is the assessments table set up?",
    errSaveNet: "Couldn't save. Check your connection.",
    recordsEmpty: "No records yet — after each evaluation, capture the findings and recommendations here so they never get lost in a PDF.",
    assessmentFallback: "Assessment",
    keyFindings: "Key findings",
    recsLabel: "Recommendations",
    delAria: "Delete record",
    confirmDelete: "Delete this assessment record?",
    /* ---- recommendations hub ---- */
    hubTitle: "All recommendations",
    hubSub: "Every recommendation from every record — one ready-made list for IEP meetings and applications.",
    copyList: "Copy list",
    copied: "Copied ✓",
    fromSrc: "From {src}",
    hubEmpty: "Recommendations you add to records gather here automatically — one ready-made list for IEP meetings, funding applications, and new providers.",
    /* ---- gate ---- */
    gateText: "Create your child's passport to start their assessment library.",
    gateCta: "Start the passport →",
  },
  fr: {
    /* ---- ribbon ---- */
    ribbonTitle: "Évaluations",
    ribbonTitleNamed: "Évaluations {of}{name}",
    ribbonSub: "Chaque évaluation dans une seule bibliothèque — les rapports, les constats clés et toutes les recommandations.",
    statReports: "rapports au dossier",
    statRecords: "fiches consignées",
    statRecs: "recommandations",
    /* ---- AI reader card ---- */
    aiTitle: "Lecteur IA de rapports",
    aiBadge: "En déploiement",
    aiBody: "Les rapports d'évaluation sont denses. Le lecteur transformera tout rapport téléversé en résumé clair — ce qui a été constaté, ce qui est recommandé, quoi faire ensuite. Les rapports téléversés dès maintenant seront résumés automatiquement au lancement.",
    aiCta: "Ouvrir le coffre",
    /* ---- reports card ---- */
    reportsTitle: "Rapports",
    reportsSub: "Les fichiers eux-mêmes — PDF, numérisations et originaux, directement du coffre.",
    uploadReport: "Téléverser un rapport",
    documentFallback: "Document",
    fileFallback: "fichier",
    uploadedOn: "Téléversé le {date}",
    docsEmpty: "Aucun rapport pour l'instant — chaque évaluation vit au même endroit : téléversée une fois, plus jamais besoin de fouiller.",
    uploadFirst: "Téléverser le premier →",
    /* ---- records card ---- */
    recordsTitle: "Fiches d'évaluation",
    recordsSub: "Les constats clés et les recommandations, consignés pour que rien ne se perde.",
    addAssessment: "Ajouter une évaluation",
    typeSpeech: "Orthophonie",
    typeOT: "Ergothérapie",
    typePsychoEd: "Psychoéducationnelle",
    typeABA: "Comportementale / ABA",
    typeDevPed: "Pédiatrie du développement",
    typePhysio: "Physiothérapie",
    typeOther: "Autre",
    providerPh: "Professionnel ou clinique",
    findingsPh: "Constats clés (collez ou résumez à partir du rapport)…",
    recsPh: "Recommandations — une par ligne…",
    cancel: "Annuler",
    saveAssessment: "Enregistrer l'évaluation",
    saving: "Enregistrement…",
    errNeedContent: "Ajoutez au moins quelques constats ou recommandations.",
    errSaveTable: "Impossible d'enregistrer. La table des évaluations est-elle configurée?",
    errSaveNet: "Impossible d'enregistrer. Vérifiez votre connexion.",
    recordsEmpty: "Aucune fiche pour l'instant — après chaque évaluation, consignez ici les constats et les recommandations pour qu'ils ne se perdent jamais dans un PDF.",
    assessmentFallback: "Évaluation",
    keyFindings: "Constats clés",
    recsLabel: "Recommandations",
    delAria: "Supprimer la fiche",
    confirmDelete: "Supprimer cette fiche d'évaluation?",
    /* ---- recommendations hub ---- */
    hubTitle: "Toutes les recommandations",
    hubSub: "Chaque recommandation de chaque fiche — une liste toute prête pour les rencontres de plan d'intervention et les demandes.",
    copyList: "Copier la liste",
    copied: "Copié ✓",
    fromSrc: "Source : {src}",
    hubEmpty: "Les recommandations ajoutées à vos fiches se rassemblent ici automatiquement — une liste toute prête pour les plans d'intervention, les demandes de financement et les nouveaux professionnels.",
    /* ---- gate ---- */
    gateText: "Créez le passeport de votre enfant pour commencer sa bibliothèque d'évaluations.",
    gateCta: "Commencer le passeport →",
  },
};
