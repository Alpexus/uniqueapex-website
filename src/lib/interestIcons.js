/* ============================================================
   interestIcons.js — INTEREST-ICONS-V1
   Keyword → icon dictionary (EN + FR) for parent-written
   strengths/interests. Shared by the Overview and the
   Strengths & Challenges tab. Unmatched text falls back to a
   friendly star — never blank. To add an interest, add one row
   to ICON_MAP.
   ============================================================ */
const I = (d, extra) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}${extra || ""}</svg>`;

export const ICONS = {
  paw: I(`<circle cx="12" cy="15.5" r="3.6"/><circle cx="6.2" cy="10.5" r="1.7"/><circle cx="10" cy="7.4" r="1.7"/><circle cx="14" cy="7.4" r="1.7"/><circle cx="17.8" cy="10.5" r="1.7"/>`),
  music: I(`<path d="M9 18V6l9-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="15.5" cy="16" r="2.5"/>`),
  waves: I(`<path d="M2 8c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2M2 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>`),
  book: I(`<path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z"/><path d="M4 18.5A2.5 2.5 0 016.5 16H20"/>`),
  calc: I(`<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/>`),
  puzzle: I(`<path d="M10 4a2 2 0 114 0h4v4a2 2 0 110 4v4h-4a2 2 0 11-4 0H6v-4a2 2 0 110-4V4z"/>`),
  brush: I(`<path d="M15 4l5 5-8.5 8.5a3 3 0 01-4.24 0L6 16.24a3 3 0 010-4.24z"/><path d="M6 16l-2.5 4.5L8 18"/>`),
  blocks: I(`<rect x="4" y="12" width="7" height="7" rx="1"/><rect x="13" y="12" width="7" height="7" rx="1"/><rect x="8.5" y="4" width="7" height="7" rx="1"/>`),
  car: I(`<path d="M4 15l1.5-5A2 2 0 017.4 8.5h9.2a2 2 0 011.9 1.5L20 15v4h-2.2M4 15v4h2.2M4 15h16"/><circle cx="7.5" cy="17" r="1.4"/><circle cx="16.5" cy="17" r="1.4"/>`),
  ball: I(`<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17M4 9.5c2.5 1.5 13.5 1.5 16 0M4 14.5c2.5-1.5 13.5-1.5 16 0"/>`),
  bike: I(`<circle cx="6" cy="16.5" r="3.4"/><circle cx="18" cy="16.5" r="3.4"/><path d="M6 16.5L9.5 9h5l3.5 7.5M9.5 9L8 6h2.5M14.5 9L13 16.5"/>`),
  tree: I(`<path d="M12 3l5 6h-2.5l4 5.5h-4L17 19H7l2.5-4.5h-4L9.5 9H7z"/><path d="M12 19v2.5"/>`),
  bulb: I(`<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 014 10.5c-.8.7-1 1.5-1 2.5h-6c0-1-.2-1.8-1-2.5A6 6 0 0112 3z"/>`),
  game: I(`<rect x="3" y="7.5" width="18" height="10" rx="4"/><path d="M8 11v3M6.5 12.5h3M15.5 11.5h.01M17.5 13.5h.01"/>`),
  flask: I(`<path d="M9.5 3h5M10.5 3v5.5L5.5 18a2 2 0 001.8 3h9.4a2 2 0 001.8-3l-5-9.5V3"/><path d="M8 14.5h8"/>`),
  rocket: I(`<path d="M12 3c3.5 1.5 5.5 5 5.5 8.5L15 14H9l-2.5-2.5C6.5 8 8.5 4.5 12 3z"/><circle cx="12" cy="9" r="1.6"/><path d="M9 14l-1.5 4L11 16.5M15 14l1.5 4L13 16.5"/>`),
  chat: I(`<path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H9l-5 4z"/><path d="M8.5 9.5h7M8.5 12.5h4"/>`),
  heart: I(`<path d="M12 20s-7.5-4.7-9.3-9A5 5 0 0112 6.2 5 5 0 0121.3 11c-1.8 4.3-9.3 9-9.3 9z"/>`),
  star: I(`<path d="M12 3.5l2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16.5l-5.2 2.9 1.2-5.8-4.4-4 5.9-.7z"/>`),
};

export const ICON_MAP = [
  [["animal", "dog", "cat", "horse", "pet", "zoo", "animaux", "chien", "chat", "cheval"], "paw"],
  [["music", "sing", "song", "piano", "guitar", "drum", "instrument", "musique", "chanson", "chante"], "music"],
  [["swim", "pool", "beach", "natation", "piscine", "nage", "plage"], "waves"],
  [["read", "book", "stor", "lecture", "livre", "lire"], "book"],
  [["math", "number", "count", "calcul", "chiffre", "nombre"], "calc"],
  [["puzzle", "casse"], "puzzle"],
  [["draw", "paint", "art", "colour", "color", "craft", "dessin", "peinture", "colorier", "bricolage"], "brush"],
  [["lego", "block", "build", "construction", "blocs", "construire"], "blocks"],
  [["train", "car", "truck", "vehicle", "bus", "voiture", "camion", "véhicule"], "car"],
  [["ball", "soccer", "football", "basket", "hockey", "sport", "ballon"], "ball"],
  [["bike", "bicycle", "cycling", "vélo", "scooter", "trottinette"], "bike"],
  [["outdoor", "park", "nature", "tree", "hik", "camp", "parc", "arbre", "plein air"], "tree"],
  [["memory", "remember", "smart", "learn", "mémoire", "apprend"], "bulb"],
  [["game", "video", "computer", "tablet", "ipad", "screen", "jeu", "ordinateur", "écran"], "game"],
  [["science", "experiment", "chemi", "expérience"], "flask"],
  [["space", "rocket", "planet", "astro", "espace", "fusée", "planète"], "rocket"],
  [["talk", "communica", "word", "parle", "mot"], "chat"],
  [["hug", "kind", "caring", "love", "affect", "câlin", "gentil"], "heart"],
];

export function iconFor(text) {
  const t = String(text || "").toLowerCase();
  for (const [keys, name] of ICON_MAP) if (keys.some((k) => t.includes(k))) return ICONS[name];
  return ICONS.star;
}
