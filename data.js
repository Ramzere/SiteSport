// ============================================================
//  DONNÉES DU PROGRAMME v4.1 — 5 jours / semaine
//  Périostite tibiale + Syndrome essuie-glace genou droit
//  Max 7 exercices par séance · Haltères prioritaires
//  Mardi + Jeudi piscine libre (sans programme détaillé)
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
          { id: "l_k1", name: "Abduction hanche haltère allongé", sets: "3 × 20 chaque côté", rest: "Repos : 45 sec", note: "Haltère sur la cuisse — bandelette IT", warn: null },
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
  //  MARDI — Piscine libre
  // ─────────────────────────────────────────────────────────
  {
    day: 1,
    label: "Mardi",
    type: "swim",
    typeLabel: "PISCINE",
    title: "Piscine libre",
    subtitle: "Crawl au feeling · Zéro impact",
    duration: "~45 min",
    color: "#0891B2",
    sections: [
      {
        name: "Séance libre",
        icon: "🏊",
        exercises: [
          { id: "ma_s1", name: "Échauffement crawl tranquille", sets: "200–400m", rest: null, note: "Rythme confortable", warn: null },
          { id: "ma_s2", name: "Bloc principal crawl", sets: "600–800m au feeling", rest: null, note: "65–75% FCmax · Gainage ventre permanent", warn: null },
          { id: "ma_s3", name: "Retour calme brasse ou dos", sets: "100–200m", rest: null, note: null, warn: null },
          { id: "ma_s4", name: "Étirements bord bassin", sets: "5 min", rest: null, note: "Mollets + bandelette IT + épaules", warn: null }
        ]
      }
    ],
    cooldown: []
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
          { id: "me_f2", name: "Développé incliné haltères", sets: "3 × 10–12", rest: "Repos : 90 sec", note: "Banc à 45° — haut de pecto", warn: null }
        ]
      },
      {
        name: "Volume",
        icon: "⚡",
        exercises: [
          { id: "me_v1", name: "Développé épaules haltères assis", sets: "3 × 12", rest: "Repos : 75 sec", note: "Coudes à 90° en bas, poussée vers le haut", warn: null, rmKey: "press", targetPct: 0.65 },
          { id: "me_v2", name: "Élévations latérales haltères", sets: "3 × 15", rest: "Repos : 60 sec", note: "Montée jusqu'à l'horizontal — tempo lent", warn: null },
          { id: "me_v3", name: "Extension triceps haltère au-dessus tête", sets: "3 × 12", rest: "Repos : 60 sec", note: "Un haltère à deux mains — coudes serrés", warn: null }
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
  //  JEUDI — Piscine libre
  // ─────────────────────────────────────────────────────────
  {
    day: 3,
    label: "Jeudi",
    type: "swim",
    typeLabel: "PISCINE",
    title: "Piscine libre",
    subtitle: "Crawl au feeling · Brûle-graisses",
    duration: "~45 min",
    color: "#0369A1",
    sections: [
      {
        name: "Séance libre",
        icon: "🏊",
        exercises: [
          { id: "j_s1", name: "Échauffement crawl tranquille", sets: "200–400m", rest: null, note: "Rythme confortable", warn: null },
          { id: "j_s2", name: "Bloc principal crawl", sets: "600–800m au feeling", rest: null, note: "Essaie de pousser un peu plus que mardi", warn: null },
          { id: "j_s3", name: "Retour calme brasse ou dos", sets: "100–200m", rest: null, note: null, warn: null },
          { id: "j_s4", name: "Étirements bord bassin", sets: "5 min", rest: null, note: "Mollets + bandelette IT + épaules", warn: null }
        ]
      }
    ],
    cooldown: []
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
          { id: "v_v1", name: "Pull-over haltère allongé sur banc", sets: "3 × 12", rest: "Repos : 60 sec", note: "Bras tendus — amplitude dos complet", warn: null },
          { id: "v_v2", name: "Curl biceps haltères alternés", sets: "3 × 12 chaque bras", rest: "Repos : 60 sec", note: "Supination en haut · descente 3 sec", warn: null },
          { id: "v_v3", name: "Curl marteau haltères", sets: "3 × 12", rest: "Repos : 45 sec", note: "Prise neutre — brachial + avant-bras", warn: null }
        ]
      },
      {
        name: "Core — finisher semaine",
        icon: "🔥",
        exercises: [
          { id: "v_c1", name: "Russian twist haltère", sets: "3 × 20 (10 par côté)", rest: "Repos : 40 sec", note: "Rotation vraie des épaules", warn: null },
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
  bench:    { label: "Développé haltères couché",  unit: "kg" },
  squat:    { label: "Fente / Goblet squat",        unit: "kg" },
  hip:      { label: "Hip thrust",                  unit: "kg" },
  lat:      { label: "Lat pulldown",                unit: "kg" },
  row:      { label: "Rowing haltère",              unit: "kg" },
  press:    { label: "Développé épaules haltères",  unit: "kg" },
  leg_curl: { label: "Leg curl machine",            unit: "kg" },
  leg_press:{ label: "Presse à jambes",             unit: "kg" }
};
