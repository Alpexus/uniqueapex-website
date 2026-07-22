// ============================================================
// Strings: /funding — the Funding Guide (info-only navigator).
// Program names/levels/notes rendered from ua-data.js
// FUNDING_PROGRAMS stay English (content library, own pass).
// Official French program names are used where they exist
// (CIPH, PEH, REEI, Retraite Québec). {amt}/{site} via tpl().
// hintDx/hintNoDx and moneyIf carry the page's original
// simple markup (<b>/<small>) — injected via innerHTML.
// ============================================================
export default {
  en: {
    /* ---- ribbon ---- */
    ribbonTitle: "Funding Guide",
    ribbonSub: "The programs Québec families most often use — what they are, who they're for, and where to apply officially.",
    statPrograms: "programs explained",
    statLevels: "levels (CA + QC)",
    /* ---- disclaimer ---- */
    discTitle: "Information only — not financial advice, and not an application.",
    discBody: "Eligibility depends on your family's situation and is decided by the government programs themselves. Applications always happen on the official sites or with your CLSC — never through UniqueApex. Amounts shown are program maximums that may not apply to you.",
    /* ---- personalized hint card ---- */
    hintDx: "<b>A diagnosis is on file</b> — families in this situation usually start with the Disability Tax Credit, because two other programs depend on it. The guide below walks the order.",
    hintNoDx: "<b>No diagnosis on file yet</b> — most of these programs ask for one. The smart move is reading up now so you can act the week it lands. The Journey has that step mapped.",
    /* ---- what each program is ---- */
    whatDtc: "A federal tax credit that also acts as the gateway to other supports (the CDB and the RDSP). Applied for through the CRA with a form your doctor completes.",
    whatCdb: "A tax-free monthly amount for families who care for a child under 18 who is approved for the Disability Tax Credit. Usually flows automatically with your tax return once the DTC is in place.",
    whatRdsp: "A long-term savings plan where the government adds grants and bonds. Requires DTC approval; opened at a bank.",
    whatQcSupplement: "A Retraite Québec supplement for parents of a child with a significant disability. Application includes a report from a professional.",
    whatQcExceptional: "A higher tier of the supplement for children whose care needs are exceptional. Assessed by Retraite Québec on top of the basic supplement.",
    whatQcFamilyAlloc: "Québec's family allowance — income-based and automatic with your taxes for most families. Worth confirming it's flowing correctly.",
    whatQcFamilySupp: "Respite, babysitting and support measures coordinated locally. The front door is your CLSC social worker — 811 (option 2) can point you to yours.",
    /* ---- official-site labels ---- */
    siteDtc: "Canada.ca — Disability Tax Credit",
    siteCdb: "Canada.ca — Child Disability Benefit",
    siteRdsp: "Canada.ca — RDSP",
    siteRetraiteQc: "Retraite Québec",
    siteQuebecCa: "Québec.ca",
    /* ---- per-program soft hints ---- */
    hintDtcDx: "With a diagnosis on file, this is usually the first application — your doctor fills part of the form.",
    hintDtcNoDx: "Usually the first application once a diagnosis lands.",
    hintCdb: "Depends on DTC approval — nothing extra to apply for in most cases.",
    hintRdsp: "Depends on DTC approval — opened at a bank, grants stack yearly.",
    hintQcSuppDx: "Many families with a formal diagnosis apply here next — via Retraite Québec.",
    hintQcSuppNoDx: "Requires professional documentation of the disability.",
    hintQcExceptional: "Only after the basic supplement — for substantially higher care needs.",
    hintQcFamilyAlloc: "Automatic with taxes for most families — just confirm it's flowing.",
    hintQcFamilySupp: "Ask your CLSC social worker — 811 option 2 finds yours.",
    /* ---- card bits ---- */
    moneyIf: "<small>if eligible, </small>up to ${amt}/yr",
    official: "Official: {site}",
    ourGuide: "Our plain-language guide →",
    /* ---- footer ---- */
    footLead: "Want a walkthrough?",
    footBody: "Our plain-language guide covers the usual order — and 811 / your CLSC can confirm what applies to your family.",
    footGuideBtn: "Read the funding guide",
    footCommunityBtn: "Community help",
  },
  fr: {
    /* ---- ribbon ---- */
    ribbonTitle: "Guide du financement",
    ribbonSub: "Les programmes que les familles québécoises utilisent le plus — ce qu'ils sont, à qui ils s'adressent et où faire une demande officielle.",
    statPrograms: "programmes expliqués",
    statLevels: "paliers (CA + QC)",
    /* ---- disclaimer ---- */
    discTitle: "Information seulement — ni un conseil financier, ni une demande.",
    discBody: "L'admissibilité dépend de la situation de votre famille et est décidée par les programmes gouvernementaux eux-mêmes. Les demandes se font toujours sur les sites officiels ou avec votre CLSC — jamais par UniqueApex. Les montants affichés sont les maximums des programmes et peuvent ne pas s'appliquer à vous.",
    /* ---- personalized hint card ---- */
    hintDx: "<b>Un diagnostic est au dossier</b> — les familles dans cette situation commencent habituellement par le Crédit d'impôt pour personnes handicapées, parce que deux autres programmes en dépendent. Le guide ci-dessous suit cet ordre.",
    hintNoDx: "<b>Pas encore de diagnostic au dossier</b> — la plupart de ces programmes en demandent un. Le bon réflexe : s'informer dès maintenant pour pouvoir agir la semaine où il arrivera. Le Parcours prévoit déjà cette étape.",
    /* ---- what each program is ---- */
    whatDtc: "Un crédit d'impôt fédéral qui sert aussi de porte d'entrée vers d'autres soutiens (la PEH et le REEI). La demande se fait auprès de l'ARC avec un formulaire que votre médecin remplit.",
    whatCdb: "Un montant mensuel non imposable pour les familles qui prennent soin d'un enfant de moins de 18 ans approuvé pour le Crédit d'impôt pour personnes handicapées. Habituellement versé automatiquement avec votre déclaration de revenus une fois le CIPH en place.",
    whatRdsp: "Un régime d'épargne à long terme où le gouvernement ajoute des subventions et des bons. Exige l'approbation du CIPH; s'ouvre dans une banque.",
    whatQcSupplement: "Un supplément de Retraite Québec pour les parents d'un enfant ayant un handicap important. La demande comprend un rapport d'un professionnel.",
    whatQcExceptional: "Un palier plus élevé du supplément pour les enfants dont les besoins de soins sont exceptionnels. Évalué par Retraite Québec en plus du supplément de base.",
    whatQcFamilyAlloc: "L'Allocation famille du Québec — selon le revenu et automatique avec vos impôts pour la plupart des familles. Ça vaut la peine de confirmer qu'elle est bien versée.",
    whatQcFamilySupp: "Répit, gardiennage et mesures de soutien coordonnés localement. La porte d'entrée est le travailleur social de votre CLSC — le 811 (option 2) peut vous diriger vers le vôtre.",
    /* ---- official-site labels (official French program names) ---- */
    siteDtc: "Canada.ca — Crédit d'impôt pour personnes handicapées",
    siteCdb: "Canada.ca — Prestation pour enfants handicapés",
    siteRdsp: "Canada.ca — REEI",
    siteRetraiteQc: "Retraite Québec",
    siteQuebecCa: "Québec.ca",
    /* ---- per-program soft hints ---- */
    hintDtcDx: "Avec un diagnostic au dossier, c'est habituellement la première demande — votre médecin remplit une partie du formulaire.",
    hintDtcNoDx: "Habituellement la première demande une fois le diagnostic reçu.",
    hintCdb: "Dépend de l'approbation du CIPH — rien de plus à demander dans la plupart des cas.",
    hintRdsp: "Dépend de l'approbation du CIPH — s'ouvre dans une banque, les subventions s'accumulent chaque année.",
    hintQcSuppDx: "Beaucoup de familles avec un diagnostic officiel font cette demande ensuite — via Retraite Québec.",
    hintQcSuppNoDx: "Exige une documentation professionnelle du handicap.",
    hintQcExceptional: "Seulement après le supplément de base — pour des besoins de soins nettement plus élevés.",
    hintQcFamilyAlloc: "Automatique avec les impôts pour la plupart des familles — confirmez simplement qu'elle est versée.",
    hintQcFamilySupp: "Demandez au travailleur social de votre CLSC — le 811 (option 2) permet de trouver le vôtre.",
    /* ---- card bits ---- */
    moneyIf: "<small>si admissible, </small>jusqu'à {amt} $/an",
    official: "Officiel : {site}",
    ourGuide: "Notre guide en langage clair →",
    /* ---- footer ---- */
    footLead: "Envie d'un pas-à-pas?",
    footBody: "Notre guide en langage clair présente l'ordre habituel — et le 811 ou votre CLSC peut confirmer ce qui s'applique à votre famille.",
    footGuideBtn: "Lire le guide du financement",
    footCommunityBtn: "Entraide communautaire",
  },
};
