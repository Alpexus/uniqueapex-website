// ============================================================
// Strings: the Documents section — ONE shared namespace for all
// four tabs. Keys are prefixed by page:
//   vault_*      /documents            (the Vault: upload/list/…)
//   summaries_*  /documents/ai-summaries
//   reports_*    /documents/reports
//   exports_*    /documents/exports
// Shared (no prefix): pillReady, pillSoon.
//
// {name} templates use tpl(). Uploaded file names, file types and
// extensions are USER DATA / formats and are never translated.
// Category VALUES stay canonical English in the DB and in
// CAT_COLOR — `cats` here are display LABELS only (the <select>
// options carry value="…" with the English value; the script sets
// their visible text from `cats`). Date output (fmtDate) stays
// English to match the ua-data.js library formatting.
// French: Québec (OQLF) — "téléverser"/"coffre", no space before
// ? and !, space before : — consistent with child-records.js.
// ============================================================
export default {
  en: {
    /* ---- shared status pills ---- */
    pillReady: "Ready",
    pillSoon: "Coming soon",

    /* ============ VAULT (/documents) ============ */
    vault_ribTitle: "The Vault",
    vault_ribDesc: "Reports, evaluations and letters — stored privately in Canada, uploaded once, never dug for again.",
    vault_dropBold: "Drop a file here",
    vault_dropRest: "or click to choose",
    vault_dropSub: "PDF, Word, photos · up to 10 MB · only you can see it",
    vault_uploadBtn: "Upload",
    vault_cancel: "Cancel",
    vault_searchPh: "Search documents…",
    vault_loading: "Loading…",
    /* category labels — VALUES stay English (see header) */
    cats: { All: "All", Evaluation: "Evaluation", Medical: "Medical", School: "School", Funding: "Funding", Therapy: "Therapy", Other: "Other" },
    /* ribbon stats */
    vault_filesStoredOne: "file stored",
    vault_filesStoredMany: "files stored",
    vault_statCategories: "categories",
    vault_latestUpload: "latest upload",
    /* empty states */
    vault_noMatch: "Nothing matches — try another filter or search.",
    vault_empty: "The vault is empty. Upload the first document above — a report, a letter, anything you never want to dig for again.",
    vault_docFallback: "Document",
    /* card actions */
    vault_download: "Download",
    vault_delete: "Delete",
    vault_dlFail: "Couldn't create a download link — try again.",
    vault_confirmDelete: "Delete this document? This cannot be undone.",
    /* plan limit */
    vault_limitWarn: "The free vault holds {n} files — monthly plans are unlimited.",
    vault_fullTitle: "The vault is full ✦",
    vault_fullBody: "Free includes {n} documents. Upgrade for an unlimited vault — nothing you've stored is ever lost.",
    vault_seePlans: "See the plans",
    /* upload flow */
    vault_tooBig: "That file is over 10 MB — try a smaller version.",
    vault_uploading: "Uploading…",
    vault_savedOk: '"{name}" is safe in the vault ✓',
    vault_errSetup: "Storage isn't set up yet — run documents_setup.sql in Supabase (ask Claude for the steps).",
    vault_errUpload: "Upload failed — check your connection and try again.",
    vault_setupNote: "<strong>One-time setup needed:</strong> the documents table and storage bucket don't exist yet in Supabase. Open <strong>documents_setup.sql</strong> in the project folder and follow the three steps inside (about 3 minutes) — then this page comes alive.",

    /* ============ AI SUMMARIES (/documents/ai-summaries) ============ */
    summaries_title: "AI Summaries",
    summaries_sub: "Dense clinical reports, translated into plain parent language — what was found, what's recommended, what to do next.",
    summaries_readerTitle: "AI Report Reader",
    summaries_readerDesc: "A 20-page evaluation becomes a one-page summary in minutes. Your report never leaves your private vault — the summary is saved right beside it.",
    summaries_uploadReport: "Upload a report",
    summaries_step1Title: "Upload the report",
    summaries_step1Desc: "Any evaluation PDF — speech, OT, psychoeducational, developmental — into your private vault.",
    summaries_step2Title: "AI reads it for you",
    summaries_step2Desc: "Key findings, recommendations and dates are pulled out and rewritten without the jargon.",
    summaries_step3Title: "Use it everywhere",
    summaries_step3Desc: "The summary lands here and feeds your recommendations hub — ready for IEP meetings and funding forms.",
    summaries_statusBold: "Rolling out now.",
    summaries_statusText: "The Report Reader is in final testing with pilot families. Until it reaches your account, you can capture findings by hand in",
    summaries_statusLink: "Assessments",
    summaries_statusTail: "— everything you save there carries over.",
    summaries_note: "AI can make mistakes and never replaces professional advice — always check the summary against the original report.",

    /* ============ REPORTS (/documents/reports) ============ */
    reports_title: "Reports",
    reports_sub: "Polished documents generated from your child's profile — made to hand to therapists, schools and agencies.",
    reports_passportTitle: "Family Passport — intake form",
    reports_passportDesc: "The complete questionnaire as a professional intake form: every answer, checkboxes, the support wheel and a signature block. Fill it once — hand it to any provider.",
    reports_openDownload: "Open & download PDF",
    reports_passportHint: "Opens your passport — go to step 14 (Review & export), tick the sections to include, and Download PDF.",
    reports_guidanceTitle: "Family guidance sheet",
    reports_guidanceDesc: "The personalized strategies and guidance from your child's profile, as a warm one-pager for grandparents, babysitters and new caregivers.",
    reports_progressTitle: "Progress report",
    reports_progressDesc: "Milestones, wins and the support wheel over time — a progress snapshot for reviews and renewals.",

    /* ============ EXPORTS (/documents/exports) ============ */
    exports_title: "Exports",
    exports_sub: "Your data belongs to you. Take it with you anytime — no questions, no lock-in.",
    exports_jsonTitle: "Everything, as JSON",
    exports_jsonDesc: "Every child profile you've saved, in a single machine-readable file. Perfect for backups or moving to another tool.",
    exports_downloadBtn: "Download my data",
    exports_csvTitle: "Timeline & wins as a spreadsheet",
    exports_csvDesc: "Events, milestones and wins as CSV — for your own charts, or for a professional who asks for the history.",
    exports_deleteTitle: "Delete instead?",
    exports_deleteText: "Downloading isn't the same as leaving. If you want your data gone, that lives in",
    exports_deleteLink: "Privacy & Data",
    exports_deleteTail: "— deletion is just as easy as export.",
    exports_preparing: "Preparing your export…",
    exports_doneOne: "Export downloaded ({n} profile).",
    exports_doneMany: "Export downloaded ({n} profiles).",
    exports_fail: "Couldn't export — try again.",
  },

  fr: {
    /* ---- shared status pills ---- */
    pillReady: "Prêt",
    pillSoon: "À venir",

    /* ============ VAULT (/documents) ============ */
    vault_ribTitle: "Le coffre",
    vault_ribDesc: "Rapports, évaluations et lettres — conservés en privé au Canada, téléversés une fois, plus jamais besoin de fouiller.",
    vault_dropBold: "Déposez un fichier ici",
    vault_dropRest: "ou cliquez pour choisir",
    vault_dropSub: "PDF, Word, photos · jusqu'à 10 Mo · vous seul pouvez le voir",
    vault_uploadBtn: "Téléverser",
    vault_cancel: "Annuler",
    vault_searchPh: "Rechercher des documents…",
    vault_loading: "Chargement…",
    /* category labels — VALUES stay English (see header) */
    cats: { All: "Tous", Evaluation: "Évaluation", Medical: "Médical", School: "École", Funding: "Financement", Therapy: "Thérapie", Other: "Autre" },
    /* ribbon stats */
    vault_filesStoredOne: "fichier stocké",
    vault_filesStoredMany: "fichiers stockés",
    vault_statCategories: "catégories",
    vault_latestUpload: "dernier téléversement",
    /* empty states */
    vault_noMatch: "Aucun résultat — essayez un autre filtre ou une autre recherche.",
    vault_empty: "Le coffre est vide. Téléversez le premier document ci-dessus — un rapport, une lettre, tout ce que vous ne voulez plus jamais avoir à fouiller.",
    vault_docFallback: "Document",
    /* card actions */
    vault_download: "Télécharger",
    vault_delete: "Supprimer",
    vault_dlFail: "Impossible de créer un lien de téléchargement — réessayez.",
    vault_confirmDelete: "Supprimer ce document? Cette action est irréversible.",
    /* plan limit */
    vault_limitWarn: "Le coffre gratuit contient {n} fichiers — les forfaits mensuels sont illimités.",
    vault_fullTitle: "Le coffre est plein ✦",
    vault_fullBody: "L'offre gratuite comprend {n} documents. Passez à un forfait pour un coffre illimité — rien de ce que vous avez conservé n'est jamais perdu.",
    vault_seePlans: "Voir les forfaits",
    /* upload flow */
    vault_tooBig: "Ce fichier dépasse 10 Mo — essayez une version plus petite.",
    vault_uploading: "Téléversement…",
    vault_savedOk: "« {name} » est en sécurité dans le coffre ✓",
    vault_errSetup: "Le stockage n'est pas encore configuré — exécutez documents_setup.sql dans Supabase (demandez les étapes à Claude).",
    vault_errUpload: "Échec du téléversement — vérifiez votre connexion et réessayez.",
    vault_setupNote: "<strong>Configuration unique requise :</strong> la table des documents et le bucket de stockage n'existent pas encore dans Supabase. Ouvrez <strong>documents_setup.sql</strong> dans le dossier du projet et suivez les trois étapes à l'intérieur (environ 3 minutes) — cette page prendra alors vie.",

    /* ============ AI SUMMARIES (/documents/ai-summaries) ============ */
    summaries_title: "Résumés IA",
    summaries_sub: "Des rapports cliniques denses, traduits en mots simples pour les parents — ce qui a été constaté, ce qui est recommandé, quoi faire ensuite.",
    summaries_readerTitle: "Lecteur IA de rapports",
    summaries_readerDesc: "Une évaluation de 20 pages devient un résumé d'une page en quelques minutes. Votre rapport ne quitte jamais votre coffre privé — le résumé est enregistré juste à côté.",
    summaries_uploadReport: "Téléverser un rapport",
    summaries_step1Title: "Téléverser le rapport",
    summaries_step1Desc: "Tout PDF d'évaluation — orthophonie, ergothérapie, psychoéducation, développement — dans votre coffre privé.",
    summaries_step2Title: "L'IA le lit pour vous",
    summaries_step2Desc: "Les constats clés, les recommandations et les dates sont extraits et réécrits sans le jargon.",
    summaries_step3Title: "Utilisez-le partout",
    summaries_step3Desc: "Le résumé arrive ici et alimente votre carrefour de recommandations — prêt pour les rencontres de plan d'intervention et les formulaires de financement.",
    summaries_statusBold: "En déploiement.",
    summaries_statusText: "Le lecteur de rapports en est à ses derniers tests avec des familles pilotes. En attendant qu'il arrive dans votre compte, vous pouvez consigner les constats à la main dans",
    summaries_statusLink: "Évaluations",
    summaries_statusTail: "— tout ce que vous y enregistrez est repris.",
    summaries_note: "L'IA peut faire des erreurs et ne remplace jamais un avis professionnel — comparez toujours le résumé au rapport original.",

    /* ============ REPORTS (/documents/reports) ============ */
    reports_title: "Rapports",
    reports_sub: "Des documents soignés générés à partir du profil de votre enfant — conçus pour être remis aux thérapeutes, aux écoles et aux organismes.",
    reports_passportTitle: "Passeport familial — formulaire d'admission",
    reports_passportDesc: "Le questionnaire complet sous forme de formulaire d'admission professionnel : chaque réponse, les cases à cocher, la roue de soutien et un bloc de signature. Remplissez-le une fois — remettez-le à n'importe quel professionnel.",
    reports_openDownload: "Ouvrir et télécharger le PDF",
    reports_passportHint: "Ouvre votre passeport — allez à l'étape 14 (Révision et exportation), cochez les sections à inclure, puis Télécharger le PDF.",
    reports_guidanceTitle: "Fiche de conseils pour la famille",
    reports_guidanceDesc: "Les stratégies et conseils personnalisés tirés du profil de votre enfant, en une page conviviale pour les grands-parents, les gardiens et les nouveaux proches aidants.",
    reports_progressTitle: "Rapport de progrès",
    reports_progressDesc: "Jalons, victoires et roue de soutien au fil du temps — un aperçu des progrès pour les révisions et les renouvellements.",

    /* ============ EXPORTS (/documents/exports) ============ */
    exports_title: "Exportations",
    exports_sub: "Vos données vous appartiennent. Emportez-les à tout moment — sans questions, rien ne vous retient.",
    exports_jsonTitle: "Tout, en JSON",
    exports_jsonDesc: "Chaque profil d'enfant que vous avez enregistré, dans un seul fichier lisible par une machine. Parfait pour les sauvegardes ou pour migrer vers un autre outil.",
    exports_downloadBtn: "Télécharger mes données",
    exports_csvTitle: "Chronologie et victoires en tableur",
    exports_csvDesc: "Événements, jalons et victoires en CSV — pour vos propres graphiques, ou pour un professionnel qui demande l'historique.",
    exports_deleteTitle: "Plutôt supprimer?",
    exports_deleteText: "Télécharger n'est pas la même chose que partir. Si vous voulez que vos données disparaissent, cela se trouve dans",
    exports_deleteLink: "Confidentialité et données",
    exports_deleteTail: "— la suppression est aussi simple que l'exportation.",
    exports_preparing: "Préparation de votre exportation…",
    exports_doneOne: "Exportation téléchargée ({n} profil).",
    exports_doneMany: "Exportation téléchargée ({n} profils).",
    exports_fail: "Échec de l'exportation — réessayez.",
  },
};
