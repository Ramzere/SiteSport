// ============================================================
//  DONNÉES DU PROGRAMME v4.2 — 5 jours / semaine
//  Périostite tibiale + Syndrome essuie-glace genou droit
//  Max 7 exercices par séance · Haltères prioritaires
//  Mardi : rugby club · Jeudi : sortie vélo route
//  © 2025 RémiRodriguez
// ============================================================

const PROGRAM = [

  // ─────────────────────────────────────────────────────────
  //  LUNDI — Jambes + Blessures
  //  6 exos hors échauffement · Haltères + 1 machine
  // ─────────────────────────────────────────────────────────
  {
    day: 0,
    label: "Lundi",
    type: "legs",
    typeLabel: "JAMBES",
    title: "Jambes · Blessures",
    subtitle: "Protocole tibia + IT band + fessiers",
    duration: "~55 min",
    color: "#059669",
    sections: [
      {
        name: "Échauffement",
        icon: "🔥",
        exercises: [
          { id: "l_w1", name: "Vélo résistance faible", sets: "5 min", rest: null, note: "Activation douce", warn: null },
          { id: "l_w2", name: "Coquillage élastique", sets: "2 × 15", rest: "0 sec", note: "Debout ou allongé", warn: null },
          { id: "l_w3", name: "Pont fessier au sol", sets: "2 × 15", rest: "0 sec", note: "Activation avant de charger", warn: null }
        ]
      },
      {
        name: "Protocole Tibia — ne jamais sauter",
        icon: "🦴",
        exercises: [
          { id: "l_t1", name: "Relevés de pointe excentriques sur marche", sets: "4 × 12 · descente 4 sec", rest: "Repos : 60 sec", note: "Descente LENTE = clé de la guérison", warn: "Ne jamais accélérer la descente" },
          { id: "l_t2", name: "Marche sur les talons", sets: "3 × 20 mètres", rest: "Repos : 30 sec", note: "Pointes en l'air — tibial antérieur", warn: null }
        ]
      },
      {
        name: "Genou + force jambes",
        icon: "🦵",
        exercises: [
          { id: "l_k1", name: "Abduction hanche haltère allongé", sets: "3 × 20 chaque côté", rest: "Repos : 45 sec", note: "Haltère sur la cuisse — bandelette IT", warn: null, rmKey: "hip_abd", targetPct: 0.50 },
          { id: "l_k2", name: "Hip thrust haltères", sets: "4 × 12", rest: "Repos : 75 sec", note: "Haltère posé sur le bassin", warn: null, rmKey: "hip", targetPct: 0.70 },
          { id: "l_k3", name: "Fente statique haltères", sets: "3 × 10 chaque jambe", rest: "Repos : 75 sec", note: "Haltères dans chaque main — genou dans l'axe", warn: "Douleur tibiale → remplacer par goblet squat partiel", rmKey: "squat", targetPct: 0.30 },
          { id: "l_k4", name: "Leg curl couché machine", sets: "3 × 15", rest: "Repos : 60 sec", note: "Machine indispensable — ischios protègent le genou", warn: null, rmKey: "leg_curl", targetPct: 0.60 }
        ]
      },
      {
        name: "Gainage",
        icon: "🎯",
        exercises: [
          { id: "l_c1", name: "Dead bug", sets: "3 × 10 chaque côté", rest: "Repos : 40 sec", note: "Dos au sol, transverse engagé", warn: null }
        ]
      }
    ],
    cooldown: [
      "Foam roller face externe cuisse 2 min chaque jambe",
      "Étirement mollet debout 2×40 sec",
      "Pigeon yoga 2×40 sec",
      "Glaçons tibia si tension (10 min)"
    ]
  },

  // ─────────────────────────────────────────────────────────
  //  MARDI — Entraînement Rugby (club)
  // ─────────────────────────────────────────────────────────
  {
    day: 1,
    label: "Mardi",
    type: "rugby",
    typeLabel: "RUGBY",
    title: "Entraînement Rugby",
    subtitle: "Séance club",
    duration: "~1h30",
    color: "#EA580C",
    sections: [
      {
        name: "Séance",
        icon: "🏉",
        exercises: [
          { id: "ma_r1", name: "Échauffement + activation", sets: "15–20 min", rest: null, note: "Course, gammes, mobilisation articulaire", warn: null, logType: "cardio" },
          { id: "ma_r2", name: "Entraînement rugby (club)", sets: "~1h", rest: null, note: "Passes, jeu au sol, contact, opposition", warn: "Vigilance genou/tibia sur les changements d'appui et les contacts", logType: "cardio" },
          { id: "ma_r3", name: "Retour au calme + étirements", sets: "10 min", rest: null, note: "Mollets + bandelette IT + quadriceps", warn: null, logType: "cardio" }
        ]
      }
    ],
    cooldown: [
      "Glaçons genou/tibia si tension (10 min)",
      "Étirements complets jambes"
    ]
  },

  // ─────────────────────────────────────────────────────────
  //  MERCREDI — Push haltères
  //  6 exos hors échauffement · 100% haltères
  // ─────────────────────────────────────────────────────────
  {
    day: 2,
    label: "Mercredi",
    type: "push",
    typeLabel: "PUSH",
    title: "Pecto · Épaules · Triceps",
    subtitle: "Haltères · Force + volume",
    duration: "~55 min",
    color: "#7C3AED",
    sections: [
      {
        name: "Échauffement",
        icon: "🔥",
        exercises: [
          { id: "me_w1", name: "Vélo résistance légère", sets: "4 min", rest: null, note: null, warn: null },
          { id: "me_w2", name: "Cercles d'épaules + rotations bras", sets: "2 × 10", rest: "0 sec", note: "Activation coiffe des rotateurs", warn: null },
          { id: "me_w3", name: "Développé haltères léger activation", sets: "1 × 15 · poids très léger", rest: null, note: null, warn: null }
        ]
      },
      {
        name: "Force",
        icon: "💪",
        exercises: [
          { id: "me_f1", name: "Développé couché haltères", sets: "4 × 8–10", rest: "Repos : 2 min", note: "Amplitude complète · plus libre que la barre", warn: null, rmKey: "bench", targetPct: 0.72 },
          { id: "me_f2", name: "Développé incliné haltères", sets: "3 × 10–12", rest: "Repos : 90 sec", note: "Banc à 45° — haut de pecto", warn: null, rmKey: "incline", targetPct: 0.68 }
        ]
      },
      {
        name: "Volume",
        icon: "⚡",
        exercises: [
          { id: "me_v1", name: "Développé épaules haltères assis", sets: "3 × 12", rest: "Repos : 75 sec", note: "Coudes à 90° en bas, poussée vers le haut", warn: null, rmKey: "press", targetPct: 0.65 },
          { id: "me_v2", name: "Élévations latérales haltères", sets: "3 × 15", rest: "Repos : 60 sec", note: "Montée jusqu'à l'horizontal — tempo lent", warn: null, rmKey: "lat_raise", targetPct: 0.55 },
          { id: "me_v3", name: "Extension triceps haltère au-dessus tête", sets: "3 × 12", rest: "Repos : 60 sec", note: "Un haltère à deux mains — coudes serrés", warn: null, rmKey: "triceps_ext", targetPct: 0.60 }
        ]
      },
      {
        name: "Gainage",
        icon: "🎯",
        exercises: [
          { id: "me_c1", name: "Planche + levée de bras alternée", sets: "3 × 10 chaque côté", rest: "Repos : 40 sec", note: "Gainage anti-rotation", warn: null }
        ]
      }
    ],
    cooldown: [
      "Étirement pectoraux bras en croix 2×40 sec",
      "Étirement triceps derrière la tête 2×30 sec"
    ]
  },

  // ─────────────────────────────────────────────────────────
  //  JEUDI — Sortie vélo route
  // ─────────────────────────────────────────────────────────
  {
    day: 3,
    label: "Jeudi",
    type: "cycling",
    typeLabel: "VÉLO",
    title: "Sortie vélo route",
    subtitle: "Endurance fondamentale · Zéro impact",
    duration: "~1h–1h30",
    color: "#2563EB",
    sections: [
      {
        name: "Séance",
        icon: "🚴",
        exercises: [
          { id: "j_v1", name: "Échauffement souple", sets: "10–15 min", rest: null, note: "Braquet léger, cadence élevée", warn: null, logType: "cardio" },
          { id: "j_v2", name: "Sortie route", sets: "45–90 min au feeling", rest: null, note: "Endurance fondamentale · 65–75% FCmax", warn: null, logType: "cardio" },
          { id: "j_v3", name: "Retour au calme", sets: "10 min", rest: null, note: "Braquet très léger, relâcher les jambes", warn: null, logType: "cardio" }
        ]
      }
    ],
    cooldown: [
      "Étirements quadriceps + mollets",
      "Hydratation + collation de récupération"
    ]
  },

  // ─────────────────────────────────────────────────────────
  //  VENDREDI — Pull haltères + Core intensif
  //  7 exos hors échauffement · Haltères + lat pulldown
  // ─────────────────────────────────────────────────────────
  {
    day: 4,
    label: "Vendredi",
    type: "pull",
    typeLabel: "PULL",
    title: "Dos · Biceps · Core",
    subtitle: "Haltères · Volume dorsal + ventre",
    duration: "~55 min",
    color: "#0284C7",
    sections: [
      {
        name: "Échauffement",
        icon: "🔥",
        exercises: [
          { id: "v_w1", name: "Rameur intensité faible", sets: "4 min", rest: null, note: "Dos échauffé en douceur", warn: null },
          { id: "v_w2", name: "Cercles épaules + mobilisation thoracique", sets: "2 × 10", rest: "0 sec", note: null, warn: null }
        ]
      },
      {
        name: "Force",
        icon: "💪",
        exercises: [
          { id: "v_f1", name: "Rowing haltère unilatéral (genou sur banc)", sets: "4 × 10 chaque côté", rest: "Repos : 75 sec", note: "Tirage coude haut — amplitude maximale", warn: null, rmKey: "row", targetPct: 0.55 },
          { id: "v_f2", name: "Lat pulldown machine prise large", sets: "4 × 10", rest: "Repos : 90 sec", note: "Seule machine du vendredi — grand dorsal", warn: null, rmKey: "lat", targetPct: 0.75 }
        ]
      },
      {
        name: "Volume",
        icon: "⚡",
        exercises: [
          { id: "v_v1", name: "Pull-over haltère allongé sur banc", sets: "3 × 12", rest: "Repos : 60 sec", note: "Bras tendus — amplitude dos complet", warn: null, rmKey: "pullover", targetPct: 0.65 },
          { id: "v_v2", name: "Curl biceps haltères alternés", sets: "3 × 12 chaque bras", rest: "Repos : 60 sec", note: "Supination en haut · descente 3 sec", warn: null, rmKey: "curl", targetPct: 0.65 },
          { id: "v_v3", name: "Curl marteau haltères", sets: "3 × 12", rest: "Repos : 45 sec", note: "Prise neutre — brachial + avant-bras", warn: null, rmKey: "hammer", targetPct: 0.65 }
        ]
      },
      {
        name: "Core — finisher semaine",
        icon: "🔥",
        exercises: [
          { id: "v_c1", name: "Russian twist haltère", sets: "3 × 20 (10 par côté)", rest: "Repos : 40 sec", note: "Rotation vraie des épaules", warn: null, rmKey: "twist", targetPct: 0.55 },
          { id: "v_c2", name: "Leg raise allongé", sets: "3 × 15", rest: "Repos : 40 sec", note: "Bas ventre — lombaires au sol", warn: null },
          { id: "v_c3", name: "Hollow body hold", sets: "3 × 30 sec", rest: "Repos : 40 sec", note: "Gainage profond — dos plat au sol", warn: null }
        ]
      }
    ],
    cooldown: [
      "Étirement grand dorsal bras tendu 2×40 sec",
      "Automassage mollets + bandelette IT"
    ]
  }
];

const RM_EXERCISES = {
  bench:       { label: "Développé haltères couché",  unit: "kg" },
  incline:     { label: "Développé incliné haltères", unit: "kg" },
  squat:       { label: "Fente / Goblet squat",        unit: "kg" },
  hip:         { label: "Hip thrust",                  unit: "kg" },
  hip_abd:     { label: "Abduction hanche haltère",    unit: "kg" },
  lat:         { label: "Lat pulldown",                unit: "kg" },
  row:         { label: "Rowing haltère",              unit: "kg" },
  press:       { label: "Développé épaules haltères",  unit: "kg" },
  lat_raise:   { label: "Élévations latérales haltères", unit: "kg" },
  triceps_ext: { label: "Extension triceps haltère",   unit: "kg" },
  pullover:    { label: "Pull-over haltère",           unit: "kg" },
  curl:        { label: "Curl biceps haltères",        unit: "kg" },
  hammer:      { label: "Curl marteau haltères",       unit: "kg" },
  twist:       { label: "Russian twist haltère",       unit: "kg" },
  leg_curl:    { label: "Leg curl machine",            unit: "kg" },
  leg_press:   { label: "Presse à jambes",             unit: "kg" }
};
