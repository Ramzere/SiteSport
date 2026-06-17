// ============================================================
//  DONNÉES DU PROGRAMME v4.0 — 5 jours / semaine
//  Périostite tibiale + Syndrome essuie-glace genou droit
//  2 piscines (Mardi + Jeudi) · Jambes lundi · Équilibre blessures/ventre
//  © 2025 RémiRodriguez
// ============================================================

const PROGRAM = [
  // ─────────────────────────────────────────────────────────
  //  LUNDI — Jambes complètes + Renforcement blessures
  //  Logique : jambes fraîches en début de semaine.
  //  Fessiers lourds + protocole tibia/bandelette IT fusionnés.
  // ─────────────────────────────────────────────────────────
  {
    day: 0,
    label: "Lundi",
    type: "legs",
    typeLabel: "JAMBES",
    title: "Jambes · Blessures · Fessiers",
    subtitle: "Renforcement complet + protocole tibia & IT band",
    duration: "~58 min",
    color: "#059669",
    sections: [
      {
        name: "Échauffement",
        icon: "🔥",
        exercises: [
          { id: "l_w1", name: "Vélo résistance très faible", sets: "6 min", rest: null, note: "Activation douce, pas d'effort", warn: null },
          { id: "l_w2", name: "Coquillage élastique", sets: "2 × 15", rest: "0 sec", note: "Activation abducteurs", warn: null },
          { id: "l_w3", name: "Cercles de cheville", sets: "2 × 10 chaque pied", rest: null, note: null, warn: null },
          { id: "l_w4", name: "Pont fessier activation", sets: "2 × 15", rest: "0 sec", note: null, warn: null }
        ]
      },
      {
        name: "Protocole Tibia — priorité",
        icon: "🦴",
        exercises: [
          { id: "l_t1", name: "Relevés de pointe excentriques sur marche", sets: "4 × 12 reps · descente 4 sec", rest: "Repos : 60 sec", note: "Unipodale si possible — clé de la guérison", warn: "Descente LENTE obligatoire — ne jamais accélérer" },
          { id: "l_t2", name: "Marche sur les talons", sets: "3 × 20 mètres", rest: "Repos : 45 sec", note: "Tibial antérieur sans impact", warn: null }
        ]
      },
      {
        name: "Protocole Genou / Bandelette IT — priorité",
        icon: "🦵",
        exercises: [
          { id: "l_k1", name: "Abduction hanche poulie basse", sets: "4 × 20 reps chaque côté", rest: "Repos : 60 sec", note: "Muscle clé contre le syndrome essuie-glace", warn: null },
          { id: "l_k2", name: "Hip thrust barre", sets: "4 × 10 reps", rest: "Repos : 90 sec", note: "Fessiers forts = moins de tension sur IT band", warn: null, rmKey: "hip", targetPct: 0.75 },
          { id: "l_k3", name: "Leg curl couché machine", sets: "3 × 15 reps", rest: "Repos : 60 sec", note: "Ischios = stabilisateurs genou", warn: null, rmKey: "leg_curl", targetPct: 0.65 }
        ]
      },
      {
        name: "Force jambes guidée",
        icon: "💪",
        exercises: [
          { id: "l_f1", name: "Presse à jambes pieds hauts et écartés", sets: "4 × 10 reps · amplitude 70–80°", rest: "Repos : 90 sec", note: "Pieds hauts = fessiers + ischios, protège le genou", warn: "Ne pas verrouiller les genoux · Arrêt si douleur IT band", rmKey: "leg_press", targetPct: 0.70 },
          { id: "l_f2", name: "Leg extension machine", sets: "3 × 15 reps · charge légère", rest: "Repos : 60 sec", note: "Amplitude 0–60° uniquement", warn: "Ne pas aller en amplitude totale" }
        ]
      },
      {
        name: "Gainage ventre",
        icon: "🎯",
        exercises: [
          { id: "l_c1", name: "Dead bug 3 points", sets: "3 × 10 reps chaque côté", rest: "Repos : 45 sec", note: "Bas du dos collé au sol, transverse engagé", warn: null },
          { id: "l_c2", name: "Planche latérale", sets: "3 × 30 sec chaque côté", rest: "Repos : 30 sec", note: "Obliques + stabilité hanche", warn: null }
        ]
      }
    ],
    cooldown: [
      "Foam roller bandelette IT 2 min chaque jambe (lent)",
      "Pigeon yoga 2×45 sec",
      "Étirement mollet sur marche 2×40 sec",
      "Glaçons tibia si tension (10 min)"
    ]
  },

  // ─────────────────────────────────────────────────────────
  //  MARDI — Piscine 1
  //  Logique : récupération active après jambes lundi.
  //  Crawl = cardio brûle-graisses zéro impact sur tibias/genou.
  // ─────────────────────────────────────────────────────────
  {
    day: 1,
    label: "Mardi",
    type: "swim",
    typeLabel: "PISCINE",
    title: "Natation — Endurance",
    subtitle: "Crawl · Récup active · Brûle-graisses",
    duration: "~45 min",
    color: "#0891B2",
    sections: [
      {
        name: "Échauffement (8 min)",
        icon: "🌊",
        exercises: [
          { id: "ma_w1", name: "200m crawl lent", sets: "Rythme très tranquille", rest: "Repos : 30 sec", note: "Juste activer", warn: null },
          { id: "ma_w2", name: "100m dos crawlé", sets: "Bras relâchés", rest: "Repos : 20 sec", note: null, warn: null },
          { id: "ma_w3", name: "100m battements planche", sets: "Jambes seulement — amplitude réduite", rest: "Repos : 30 sec", note: "Pas de stress tibias", warn: null }
        ]
      },
      {
        name: "Bloc endurance — 8 × 100m",
        icon: "🏊",
        exercises: [
          { id: "ma_m1", name: "8 × 100m crawl rythme régulier", sets: "Effort modéré et constant", rest: "Repos : 20 sec entre chaque 100m", note: "65% FCmax · Gainage ventre permanent · respire sur 3 temps", warn: null },
          { id: "ma_m2", name: "50m brasse douce (récup active)", sets: "Après chaque 200m accumulés", rest: "Repos : 15 sec", note: "Récupération partielle entre les séries de crawl", warn: null }
        ]
      },
      {
        name: "Descente d'intensité (8 min)",
        icon: "🌊",
        exercises: [
          { id: "ma_d1", name: "200m dos crawlé lent", sets: "Expiration longue sous l'eau", rest: "Repos : 30 sec", note: null, warn: null },
          { id: "ma_d2", name: "100m pull-buoy (bras uniquement)", sets: "Bouée entre les jambes", rest: null, note: "Soulage totalement tibias et genoux", warn: null }
        ]
      },
      {
        name: "Étirements bord de bassin (5 min)",
        icon: "🧘",
        exercises: [
          { id: "ma_e1", name: "Étirement mollet contre le mur", sets: "2 × 40 sec chaque jambe", rest: null, note: null, warn: null },
          { id: "ma_e2", name: "Étirement bandelette IT debout", sets: "2 × 40 sec chaque jambe", rest: null, note: "Jambe valide croisée devant", warn: null },
          { id: "ma_e3", name: "Rotation épaules + étirement dorsal", sets: "2 × 30 sec", rest: null, note: null, warn: null }
        ]
      }
    ],
    cooldown: []
  },

  // ─────────────────────────────────────────────────────────
  //  MERCREDI — Push (Pecto · Épaules · Triceps)
  //  Logique : haut du corps total, jambes en pleine récup.
  //  Gainage ventre intégré en finisher.
  // ─────────────────────────────────────────────────────────
  {
    day: 2,
    label: "Mercredi",
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
          { id: "me_w1", name: "Vélo résistance légère", sets: "5 min", rest: null, note: null, warn: null },
          { id: "me_w2", name: "Band pull-apart", sets: "2 × 15", rest: "0 sec", note: "Activation coiffe des rotateurs", warn: null },
          { id: "me_w3", name: "Développé haltères léger activation", sets: "1 × 15", rest: null, note: null, warn: null }
        ]
      },
      {
        name: "Force",
        icon: "💪",
        exercises: [
          { id: "me_f1", name: "Développé couché barre", sets: "4 × 6–8 reps", rest: "Repos : 2 min 30", note: "Tempo 2-1-2 · 75–80% 1RM", warn: null, rmKey: "bench", targetPct: 0.78 },
          { id: "me_f2", name: "Développé incliné haltères", sets: "3 × 10 reps", rest: "Repos : 90 sec", note: "Amplitude complète", warn: null }
        ]
      },
      {
        name: "Volume — Superset A+B",
        icon: "⚡",
        exercises: [
          { id: "me_v1", name: "A — Élévations latérales haltères", sets: "3 × 15 reps", rest: "Enchaîner avec B →", note: "Montée contrôlée jusqu'à l'horizontal", warn: null },
          { id: "me_v2", name: "B — Écarté poulie croisée", sets: "3 × 15 reps", rest: "75 sec après chaque paire A+B", note: "Contraction 1 sec en haut", warn: null },
          { id: "me_v3", name: "Développé militaire machine", sets: "3 × 12 reps", rest: "Repos : 75 sec", note: null, warn: null, rmKey: "press", targetPct: 0.70 },
          { id: "me_v4", name: "Dips barre (triceps)", sets: "3 × 12 reps", rest: "Repos : 75 sec", note: "Buste droit = triceps", warn: null }
        ]
      },
      {
        name: "Gainage ventre — finisher",
        icon: "🎯",
        exercises: [
          { id: "me_c1", name: "Ab wheel / Planche dynamique", sets: "3 × 10 reps / 40 sec", rest: "Repos : 45 sec", note: "Transverse engagé", warn: null },
          { id: "me_c2", name: "Mountain climbers lents", sets: "3 × 20 reps", rest: "Repos : 40 sec", note: "Lents = gainage, pas cardio choc", warn: null }
        ]
      }
    ],
    cooldown: [
      "Étirements pectoraux contre cadre 2×40 sec",
      "Étirement triceps derrière la tête 2×30 sec"
    ]
  },

  // ─────────────────────────────────────────────────────────
  //  JEUDI — Piscine 2
  //  Logique : milieu de semaine, permet à la muscu de récupérer.
  //  Séance plus intense que mardi — intervalles pour brûler plus.
  // ─────────────────────────────────────────────────────────
  {
    day: 3,
    label: "Jeudi",
    type: "swim",
    typeLabel: "PISCINE",
    title: "Natation — Intervalles",
    subtitle: "Crawl · Effort variable · Brûle-graisses+",
    duration: "~45 min",
    color: "#0369A1",
    sections: [
      {
        name: "Échauffement (8 min)",
        icon: "🌊",
        exercises: [
          { id: "j_w1", name: "200m crawl très lent", sets: "Rythme de récup", rest: "Repos : 20 sec", note: "Activation progressive", warn: null },
          { id: "j_w2", name: "100m battements planche", sets: "Amplitude réduite", rest: "Repos : 20 sec", note: null, warn: null }
        ]
      },
      {
        name: "Bloc intervalles — 6 × 100m",
        icon: "🏊",
        exercises: [
          { id: "j_m1", name: "3 × 100m crawl effort fort (80% FCmax)", sets: "Sprint long — effort soutenu", rest: "Repos : 40 sec entre chaque 100m", note: "On pousse le rythme — brûle-graisses maximal", warn: null },
          { id: "j_m2", name: "50m brasse douce récup", sets: "Après chaque série de 100m fort", rest: "Repos : 20 sec", note: "Redescendre le cœur avant la série suivante", warn: null },
          { id: "j_m3", name: "3 × 100m crawl effort modéré (65% FCmax)", sets: "Rythme régulier", rest: "Repos : 20 sec entre chaque 100m", note: "Maintien de l'allure — terminer proprement", warn: null }
        ]
      },
      {
        name: "Descente d'intensité (8 min)",
        icon: "🌊",
        exercises: [
          { id: "j_d1", name: "200m dos crawlé lent", sets: "Expiration longue sous l'eau", rest: "Repos : 30 sec", note: null, warn: null },
          { id: "j_d2", name: "100m pull-buoy (bras uniquement)", sets: "Bouée entre les jambes", rest: null, note: "Soulage totalement tibias et genoux", warn: null }
        ]
      },
      {
        name: "Étirements bord de bassin (5 min)",
        icon: "🧘",
        exercises: [
          { id: "j_e1", name: "Étirement mollet contre le mur", sets: "2 × 40 sec chaque jambe", rest: null, note: null, warn: null },
          { id: "j_e2", name: "Étirement bandelette IT debout", sets: "2 × 40 sec chaque jambe", rest: null, note: "Jambe valide croisée devant", warn: null },
          { id: "j_e3", name: "Étirement quadriceps debout", sets: "2 × 30 sec chaque jambe", rest: null, note: null, warn: null }
        ]
      }
    ],
    cooldown: []
  },

  // ─────────────────────────────────────────────────────────
  //  VENDREDI — Pull (Dos · Biceps) + Core intense
  //  Logique : finir la semaine sur le dos + abdos intensifs.
  //  Le core est renforcé = ventre plat sur le long terme.
  // ─────────────────────────────────────────────────────────
  {
    day: 4,
    label: "Vendredi",
    type: "pull",
    typeLabel: "PULL",
    title: "Dos · Biceps · Core",
    subtitle: "Volume dorsal + gainage ventre intensif",
    duration: "~55 min",
    color: "#0284C7",
    sections: [
      {
        name: "Échauffement",
        icon: "🔥",
        exercises: [
          { id: "v_w1", name: "Rameur intensité faible", sets: "5 min", rest: null, note: "Dos échauffé progressivement", warn: null },
          { id: "v_w2", name: "Face pull élastique", sets: "2 × 15", rest: "0 sec", note: "Santé épaules + deltoïde postérieur", warn: null }
        ]
      },
      {
        name: "Force",
        icon: "💪",
        exercises: [
          { id: "v_f1", name: "Lat pulldown prise large", sets: "4 × 8 reps · charge lourde", rest: "Repos : 2 min", note: "Coudes vers les hanches en fin de mouvement", warn: null, rmKey: "lat", targetPct: 0.78 },
          { id: "v_f2", name: "Rowing barre buste penché", sets: "4 × 8 reps", rest: "Repos : 2 min", note: "Tirage vers le nombril, dos parallèle au sol", warn: null, rmKey: "row", targetPct: 0.78 }
        ]
      },
      {
        name: "Volume — Superset A+B",
        icon: "⚡",
        exercises: [
          { id: "v_v1", name: "A — Tirage horizontal poulie serrée", sets: "3 × 12 reps", rest: "Enchaîner avec B →", note: null, warn: null },
          { id: "v_v2", name: "B — Face pull poulie haute", sets: "3 × 20 reps", rest: "75 sec après chaque paire A+B", note: "Santé épaules — ne pas négliger", warn: null },
          { id: "v_v3", name: "Rowing haltère unilatéral", sets: "3 × 12 reps chaque côté", rest: "Repos : 60 sec", note: null, warn: null },
          { id: "v_v4", name: "Curl biceps barre EZ", sets: "3 × 12 reps", rest: "Repos : 60 sec", note: "Descente 3 sec", warn: null }
        ]
      },
      {
        name: "Core intensif — finisher semaine",
        icon: "🔥",
        exercises: [
          { id: "v_c1", name: "Crunch câble machine lesté", sets: "4 × 15 reps", rest: "Repos : 45 sec", note: "Charge qui permet de contrôler chaque rep", warn: null },
          { id: "v_c2", name: "Russian twist haltère", sets: "3 × 20 reps (10 par côté)", rest: "Repos : 40 sec", note: "Rotation vraie des épaules, pas des bras", warn: null },
          { id: "v_c3", name: "Hollow body hold", sets: "3 × 35 sec", rest: "Repos : 40 sec", note: "Gainage profond — bas du dos au sol", warn: null },
          { id: "v_c4", name: "Leg raise allongé", sets: "3 × 15 reps", rest: "Repos : 40 sec", note: "Bas ventre — lombaires collés au sol", warn: null }
        ]
      }
    ],
    cooldown: [
      "Étirement grand dorsal bras tendu 2×40 sec",
      "Mobilisation thoracique avec rouleau",
      "Automassage mollets + bandelette IT"
    ]
  }
];

const RM_EXERCISES = {
  bench:    { label: "Développé couché barre",     unit: "kg" },
  squat:    { label: "Squat / Hack squat",          unit: "kg" },
  hip:      { label: "Hip thrust barre",            unit: "kg" },
  lat:      { label: "Lat pulldown",                unit: "kg" },
  row:      { label: "Rowing barre",                unit: "kg" },
  press:    { label: "Développé militaire machine", unit: "kg" },
  leg_curl: { label: "Leg curl machine",            unit: "kg" },
  leg_press:{ label: "Presse à jambes",             unit: "kg" }
};
