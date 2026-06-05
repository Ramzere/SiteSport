// ============================================================
//  DONNÉES DU PROGRAMME — 5 jours / semaine
//  Périostite tibiale + Syndrome essuie-glace genou droit
// ============================================================

const PROGRAM = [
  {
    day: 0,
    label: "Lundi",
    type: "push",
    typeLabel: "PUSH",
    title: "Pecto · Épaules · Triceps",
    subtitle: "Force + volume haut du corps",
    duration: "~55 min",
    color: "#7C3AED",
    sections: [
      {
        name: "Échauffement",
        icon: "🔥",
        exercises: [
          { id: "l_w1", name: "Vélo résistance légère", sets: "5 min", rest: null, note: "Juste activer le corps", warn: null },
          { id: "l_w2", name: "Band pull-apart", sets: "2 × 15", rest: "0 sec", note: null, warn: null },
          { id: "l_w3", name: "Développé haltères léger (activation)", sets: "1 × 15", rest: null, note: null, warn: null }
        ]
      },
      {
        name: "Force",
        icon: "💪",
        exercises: [
          { id: "l_f1", name: "Développé couché barre", sets: "4 × 6–8 reps", rest: "Repos : 2 min 30", note: "Tempo 2-1-2 · 75–80% 1RM", warn: null, rmKey: "bench", targetPct: 0.78 },
          { id: "l_f2", name: "Développé incliné haltères", sets: "3 × 10 reps", rest: "Repos : 90 sec", note: "Amplitude complète", warn: null }
        ]
      },
      {
        name: "Volume — Superset A+B",
        icon: "⚡",
        exercises: [
          { id: "l_v1", name: "A — Élévations latérales haltères", sets: "3 × 15 reps", rest: "Enchaîner avec B →", note: "Montée contrôlée", warn: null },
          { id: "l_v2", name: "B — Écarté poulie croisée", sets: "3 × 15 reps", rest: "75 sec après chaque paire A+B", note: "Contraction 1 sec en haut", warn: null },
          { id: "l_v3", name: "Développé militaire machine", sets: "3 × 12 reps", rest: "Repos : 75 sec", note: null, warn: null, rmKey: "press", targetPct: 0.70 },
          { id: "l_v4", name: "Dips barre (triceps)", sets: "3 × 12 reps", rest: "Repos : 75 sec", note: "Buste droit = triceps", warn: null }
        ]
      },
      {
        name: "Core",
        icon: "🎯",
        exercises: [
          { id: "l_c1", name: "Ab wheel / Planche dynamique", sets: "3 × 10 reps / 40 sec", rest: "Repos : 45 sec", note: "Transverse engagé", warn: null }
        ]
      }
    ],
    cooldown: ["Étirements pectoraux contre cadre 2×40 sec", "Étirement triceps derrière la tête 2×30 sec"]
  },

  {
    day: 1,
    label: "Mardi",
    type: "legs",
    typeLabel: "JAMBES",
    title: "Renforcement ciblé blessures",
    subtitle: "Bandelette IT · Tibia · Fessiers",
    duration: "~58 min",
    color: "#059669",
    sections: [
      {
        name: "Échauffement",
        icon: "🔥",
        exercises: [
          { id: "ma_w1", name: "Vélo résistance très faible", sets: "6 min", rest: null, note: null, warn: null },
          { id: "ma_w2", name: "Coquillage élastique", sets: "2 × 15", rest: "0 sec", note: null, warn: null },
          { id: "ma_w3", name: "Cercles de cheville", sets: "2 × 10 chaque pied", rest: null, note: null, warn: null }
        ]
      },
      {
        name: "Protocole Tibia",
        icon: "🦴",
        exercises: [
          { id: "ma_t1", name: "Relevés de pointe excentriques sur marche", sets: "4 × 12 reps · descente 4 sec", rest: "Repos : 60 sec", note: "Unipodale si possible", warn: "Descente LENTE = clé de la guérison" },
          { id: "ma_t2", name: "Marche sur les talons", sets: "3 × 20 mètres", rest: "Repos : 45 sec", note: "Tibial antérieur sans impact", warn: null }
        ]
      },
      {
        name: "Protocole Genou / Bandelette IT",
        icon: "🦵",
        exercises: [
          { id: "ma_k1", name: "Abduction hanche poulie basse", sets: "4 × 20 reps chaque côté", rest: "Repos : 60 sec", note: "Priorité absolue de la séance", warn: null },
          { id: "ma_k2", name: "Hip thrust barre", sets: "4 × 10 reps", rest: "Repos : 90 sec", note: "Contraction fessière 1 sec en haut", warn: null, rmKey: "hip", targetPct: 0.72 },
          { id: "ma_k3", name: "Leg curl couché machine", sets: "3 × 15 reps", rest: "Repos : 60 sec", note: null, warn: null, rmKey: "leg_curl", targetPct: 0.65 }
        ]
      },
      {
        name: "Squat guidé",
        icon: "📐",
        exercises: [
          { id: "ma_s1", name: "Squat hack machine / Goblet haltère", sets: "3 × 10 reps · profondeur 70°", rest: "Repos : 90 sec", note: "Genoux dans l'axe des orteils", warn: "Douleur genou droit → remplacer par presse pieds hauts", rmKey: "squat", targetPct: 0.68 }
        ]
      }
    ],
    cooldown: ["Foam roller bandelette IT 2 min chaque jambe", "Pigeon yoga 2×40 sec", "Glaçons tibia si tension (10 min)"]
  },

  {
    day: 2,
    label: "Mercredi",
    type: "pull",
    typeLabel: "PULL",
    title: "Dos · Biceps · Core",
    subtitle: "Volume dorsal + gainage ventre",
    duration: "~55 min",
    color: "#0284C7",
    sections: [
      {
        name: "Échauffement",
        icon: "🔥",
        exercises: [
          { id: "me_w1", name: "Rameur intensité faible", sets: "5 min", rest: null, note: null, warn: null },
          { id: "me_w2", name: "Face pull élastique", sets: "2 × 15", rest: "0 sec", note: null, warn: null }
        ]
      },
      {
        name: "Force",
        icon: "💪",
        exercises: [
          { id: "me_f1", name: "Lat pulldown prise large", sets: "4 × 8 reps · charge lourde", rest: "Repos : 2 min", note: "Coudes vers les hanches", warn: null, rmKey: "lat", targetPct: 0.78 },
          { id: "me_f2", name: "Rowing barre buste penché", sets: "4 × 8 reps", rest: "Repos : 2 min", note: "Tirage vers le nombril", warn: null, rmKey: "row", targetPct: 0.78 }
        ]
      },
      {
        name: "Volume — Superset A+B",
        icon: "⚡",
        exercises: [
          { id: "me_v1", name: "A — Tirage horizontal poulie serrée", sets: "3 × 12 reps", rest: "Enchaîner avec B →", note: null, warn: null },
          { id: "me_v2", name: "B — Face pull poulie haute", sets: "3 × 20 reps", rest: "75 sec après chaque paire A+B", note: "Santé épaules", warn: null },
          { id: "me_v3", name: "Rowing haltère unilatéral", sets: "3 × 12 reps chaque côté", rest: "Repos : 60 sec", note: null, warn: null },
          { id: "me_v4", name: "Curl biceps barre EZ", sets: "3 × 12 reps", rest: "Repos : 60 sec", note: "Descente 3 sec", warn: null }
        ]
      },
      {
        name: "Core",
        icon: "🎯",
        exercises: [
          { id: "me_c1", name: "Dead bug 3 points", sets: "3 × 10 reps chaque côté", rest: "Repos : 45 sec", note: "Bas du dos collé au sol", warn: null }
        ]
      }
    ],
    cooldown: ["Étirement grand dorsal bras tendu 2×40 sec", "Mobilisation thoracique avec rouleau"]
  },

  {
    day: 3,
    label: "Jeudi",
    type: "legs2",
    typeLabel: "JAMBES",
    title: "Fessiers · Force · Gainage",
    subtitle: "Séance lourde + abdos",
    duration: "~58 min",
    color: "#DC2626",
    sections: [
      {
        name: "Échauffement",
        icon: "🔥",
        exercises: [
          { id: "j_w1", name: "Vélo", sets: "5 min", rest: null, note: null, warn: null },
          { id: "j_w2", name: "Monster walk élastique", sets: "2 × 15 pas", rest: "0 sec", note: null, warn: null },
          { id: "j_w3", name: "Clamshell", sets: "2 × 15", rest: null, note: null, warn: null }
        ]
      },
      {
        name: "Force Fessiers",
        icon: "💪",
        exercises: [
          { id: "j_f1", name: "Hip thrust barre (charge max semaine)", sets: "5 × 8 reps", rest: "Repos : 2 min", note: "CHARGE MAX · Contraction 1 sec en haut", warn: null, rmKey: "hip", targetPct: 0.82 },
          { id: "j_f2", name: "Presse à jambes pieds hauts et écartés", sets: "4 × 10 reps · amplitude 70–80°", rest: "Repos : 90 sec", note: null, warn: "Ne pas verrouiller les genoux", rmKey: "leg_press", targetPct: 0.72 }
        ]
      },
      {
        name: "Isolation Jambes",
        icon: "🦵",
        exercises: [
          { id: "j_i1", name: "Fente bulgare haltères", sets: "3 × 10 reps chaque jambe", rest: "Repos : 90 sec", note: null, warn: "Douleur tibiale → remplacer par abduction + pont" },
          { id: "j_i2", name: "Leg curl assis machine", sets: "3 × 15 reps · retour 3 sec", rest: "Repos : 60 sec", note: null, warn: null, rmKey: "leg_curl", targetPct: 0.60 },
          { id: "j_i3", name: "Adduction hanche machine", sets: "3 × 20 reps · charge modérée", rest: "Repos : 45 sec", note: "Équilibre musculaire genou", warn: null }
        ]
      },
      {
        name: "Core",
        icon: "🎯",
        exercises: [
          { id: "j_c1", name: "Planche levée de jambe alternée", sets: "3 × 10 reps chaque côté", rest: "Repos : 45 sec", note: null, warn: null },
          { id: "j_c2", name: "Leg raise allongé", sets: "3 × 15 reps", rest: "Repos : 45 sec", note: "Bas du dos collé au sol", warn: null }
        ]
      }
    ],
    cooldown: ["Foam roller face latérale cuisse 2 min", "Pigeon yoga 2×40 sec", "Glaçons tibia si besoin"]
  },

  {
    day: 4,
    label: "Vendredi",
    type: "swim",
    typeLabel: "PISCINE",
    title: "Natation — Cardio & Récup",
    subtitle: "Crawl · Zéro impact · 50m",
    duration: "~55 min",
    color: "#0891B2",
    sections: [
      {
        name: "Échauffement (10 min)",
        icon: "🌊",
        exercises: [
          { id: "v_w1", name: "200m crawl lent", sets: "Rythme très tranquille", rest: "Repos : 30 sec", note: "Juste activer", warn: null },
          { id: "v_w2", name: "100m dos crawlé", sets: "Bras relâchés", rest: "Repos : 20 sec", note: null, warn: null },
          { id: "v_w3", name: "100m battements planche", sets: "Jambes seulement", rest: "Repos : 30 sec", note: "Amplitude réduite, no stress tibias", warn: null }
        ]
      },
      {
        name: "Bloc principal — 6 séries × 100m",
        icon: "🏊",
        exercises: [
          { id: "v_m1", name: "6 × 100m crawl effort modéré", sets: "Rythme soutenu et régulier", rest: "Repos : 20 sec entre chaque 100m", note: "65–70% FCmax · Gainage permanent", warn: null },
          { id: "v_m2", name: "50m brasse douce (récup active)", sets: "Après chaque 200m accumulés", rest: "Repos : 15 sec", note: "Repos relatif, récupération cardio", warn: null }
        ]
      },
      {
        name: "Descente d'intensité (10 min)",
        icon: "🌊",
        exercises: [
          { id: "v_d1", name: "200m dos crawlé lent", sets: "Expiration sous l'eau", rest: "Repos : 30 sec", note: null, warn: null },
          { id: "v_d2", name: "100m pull-buoy (bras uniquement)", sets: "Bouée entre les jambes", rest: null, note: "Soulage totalement tibias et genoux", warn: null }
        ]
      },
      {
        name: "Étirements bord de bassin (5 min)",
        icon: "🧘",
        exercises: [
          { id: "v_e1", name: "Étirement mollet contre le mur", sets: "2 × 40 sec chaque jambe", rest: null, note: null, warn: null },
          { id: "v_e2", name: "Étirement bandelette IT debout", sets: "2 × 40 sec chaque jambe", rest: null, note: "Jambe valide devant la blessée", warn: null },
          { id: "v_e3", name: "Étirement épaules + grand dorsal", sets: "2 × 30 sec chaque côté", rest: null, note: null, warn: null }
        ]
      }
    ],
    cooldown: []
  }
];

const RM_EXERCISES = {
  bench:    { label: "Développé couché barre",    unit: "kg" },
  squat:    { label: "Squat / Hack squat",         unit: "kg" },
  hip:      { label: "Hip thrust barre",           unit: "kg" },
  lat:      { label: "Lat pulldown",               unit: "kg" },
  row:      { label: "Rowing barre",               unit: "kg" },
  press:    { label: "Développé militaire machine",unit: "kg" },
  leg_curl: { label: "Leg curl machine",           unit: "kg" },
  leg_press:{ label: "Presse à jambes",            unit: "kg" }
};
