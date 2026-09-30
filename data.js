// ============================================================
//  FITPRO v5.0 — Programme de Rémi
//  © 2025 RémiRodriguez
// ============================================================

const PROGRAM = [

  // ── LUNDI — Pec Épaule Biceps ──────────────────────────
  {
    day: 0, label: "Lundi", type: "push", typeLabel: "PEC · ÉPAULE · BICEPS",
    title: "Pec · Épaule · Biceps", subtitle: "Séance 1", duration: "~60 min",
    color: "#7C3AED",
    sections: [
      {
        name: "Échauffement", icon: "🔥",
        exercises: [
          { id: "l_w1", name: "Cardio",    sets: "5 min",  rest: null, note: null, warn: null },
          { id: "l_w2", name: "Mobilité",  sets: "5 min",  rest: null, note: null, warn: null }
        ]
      },
      {
        name: "Travail", icon: "💪",
        exercises: [
          { id: "l_f1", name: "Développé couché barre guidée", sets: "3 × 8-8-12", rest: "Repos : 3 min",   note: "S1,2 → 8 reps · S3 → -15% charge · 12 reps", warn: null },
          { id: "l_f2", name: "Développé incliné haltère",     sets: "3 × 12",     rest: "Repos : 2-3 min", note: null, warn: null },
          { id: "l_f3", name: "Développé militaire haltère",   sets: "3 × 8-12",   rest: "Repos : 2-3 min", note: null, warn: null },
          { id: "l_f4", name: "Élévation latérale",            sets: "3 × 12-15",  rest: "Repos : 1 min 30",note: null, warn: null },
          { id: "l_f5", name: "Curl sur banc incliné",         sets: "3 × 12",     rest: "Repos : 1 min 30",note: null, warn: null },
          { id: "l_f6", name: "Curl marteau",                  sets: "3 × 8-10",   rest: "Repos : 1 min 30",note: null, warn: null }
        ]
      },
      {
        name: "Abdos", icon: "🎯",
        exercises: [
          { id: "l_c1", name: "Gainage planche",          sets: "4 × 45 sec",      rest: "Repos : 30 sec", note: "Ventre rentré, corps droit", warn: null },
          { id: "l_c2", name: "Gainage latéral",          sets: "3 × 40 sec chaque côté", rest: "Repos : 20 sec", note: null, warn: null },
          { id: "l_c3", name: "Lever de jambes allongé",  sets: "4 × 15",          rest: "Repos : 45 sec", note: "Lombaires au sol", warn: null },
          { id: "l_c4", name: "Crunch",                   sets: "4 × 20",          rest: "Repos : 45 sec", note: "Expire en montant", warn: null }
        ]
      }
    ],
    cooldown: []
  },

  // ── MARDI — Rugby ───────────────────────────────────────
  {
    day: 1, label: "Mardi", type: "sport", typeLabel: "RUGBY",
    title: "Rugby", subtitle: "Au feeling",
    duration: null, color: "#B45309",
    freeSession: true,
    freeIcon: "🏉",
    freeMsg: "Bonne séance ! 🏉",
    sections: [], cooldown: []
  },

  // ── MERCREDI — Dos Triceps ──────────────────────────────
  {
    day: 2, label: "Mercredi", type: "pull", typeLabel: "DOS · TRICEPS",
    title: "Dos · Triceps", subtitle: "Séance 2", duration: "~60 min",
    color: "#0284C7",
    sections: [
      {
        name: "Échauffement", icon: "🔥",
        exercises: [
          { id: "me_w1", name: "Cardio",   sets: "5 min", rest: null, note: null, warn: null },
          { id: "me_w2", name: "Mobilité", sets: "5 min", rest: null, note: null, warn: null }
        ]
      },
      {
        name: "Travail", icon: "💪",
        exercises: [
          { id: "me_f1", name: "Tirage vertical (prise pronation)", sets: "3 × 8-8-12", rest: "Repos : 2-3 min", note: "S1,2 → 8 reps · S3 → -15% charge · 12 reps", warn: null },
          { id: "me_f2", name: "Tirage horizontal (coude ouvert)",  sets: "3 × 8-10",   rest: "Repos : 2-3 min", note: null, warn: null },
          { id: "me_f3", name: "Pull over haltère",                 sets: "3 × 12",     rest: "Repos : 2 min",   note: null, warn: null },
          { id: "me_f4", name: "Oiseau haltère (rear delt assis)",  sets: "3 × 12",     rest: "Repos : 1 min 30",note: "Assis, buste sur les genoux, bras en croix", warn: null },
          { id: "me_f5", name: "Extension triceps poulie",          sets: "3 × 8-10",   rest: "Repos : 2 min",   note: null, warn: null },
          { id: "me_f6", name: "Haltère au front incliné",          sets: "3 × 12",     rest: "Repos : 2 min",   note: null, warn: null }
        ]
      },
      {
        name: "Abdos", icon: "🎯",
        exercises: [
          { id: "me_c1", name: "Gainage planche",         sets: "4 × 45 sec",           rest: "Repos : 30 sec", note: "Ventre rentré, corps droit", warn: null },
          { id: "me_c2", name: "Gainage latéral",         sets: "3 × 40 sec chaque côté", rest: "Repos : 20 sec", note: null, warn: null },
          { id: "me_c3", name: "Lever de jambes allongé", sets: "4 × 15",               rest: "Repos : 45 sec", note: "Lombaires au sol", warn: null },
          { id: "me_c4", name: "Crunch",                  sets: "4 × 20",               rest: "Repos : 45 sec", note: "Expire en montant", warn: null }
        ]
      }
    ],
    cooldown: []
  },

  // ── JEUDI — Course ──────────────────────────────────────
  {
    day: 3, label: "Jeudi", type: "sport", typeLabel: "COURSE À PIED",
    title: "Course à pied", subtitle: "Au feeling",
    duration: null, color: "#059669",
    freeSession: true,
    freeIcon: "🏃",
    freeMsg: "Bonne course ! 🏃",
    sections: [], cooldown: []
  },

  // ── VENDREDI — Legs ─────────────────────────────────────
  {
    day: 4, label: "Vendredi", type: "legs", typeLabel: "LEGS",
    title: "Legs", subtitle: "Séance 3", duration: "~60 min",
    color: "#DC2626",
    sections: [
      {
        name: "Échauffement", icon: "🔥",
        exercises: [
          { id: "v_w1", name: "Cardio",   sets: "5 min", rest: null, note: null, warn: null },
          { id: "v_w2", name: "Mobilité", sets: "5 min", rest: null, note: null, warn: null }
        ]
      },
      {
        name: "Travail", icon: "💪",
        exercises: [
          { id: "v_f1", name: "Squat Smith",    sets: "3 × 8-8-12", rest: "Repos : 3 min",   note: "S1,2 → 8 reps · S3 → -15% charge · 12 reps", warn: null },
          { id: "v_f2", name: "Hip thrust",     sets: "3 × 8-10",   rest: "Repos : 2-3 min", note: null, warn: null },
          { id: "v_f3", name: "Fentes bulgares",sets: "3 × 10",     rest: "Repos : 2 min",   note: null, warn: null },
          { id: "v_f4", name: "Leg extension",  sets: "3 × 10-12",  rest: "Repos : 2 min",   note: "Machine", warn: null },
          { id: "v_f5", name: "Leg curl",       sets: "3 × 12",     rest: "Repos : 2 min",   note: "Machine", warn: null }
        ]
      },
      {
        name: "Abdos", icon: "🎯",
        exercises: [
          { id: "v_c1", name: "Crunch à poulie", sets: "3 × 12", rest: "Repos : 1 min 30", note: null, warn: null },
          { id: "v_c2", name: "Gainage planche",         sets: "4 × 45 sec",           rest: "Repos : 30 sec", note: null, warn: null },
          { id: "v_c3", name: "Gainage latéral",         sets: "3 × 40 sec chaque côté", rest: "Repos : 20 sec", note: null, warn: null },
          { id: "v_c4", name: "Lever de jambes allongé", sets: "4 × 15",               rest: "Repos : 45 sec", note: "Lombaires au sol", warn: null },
          { id: "v_c5", name: "Crunch",                  sets: "4 × 20",               rest: "Repos : 45 sec", note: "Expire en montant", warn: null }
        ]
      }
    ],
    cooldown: []
  }
];
