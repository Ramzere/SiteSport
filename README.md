# FITPRO — Mon Programme Musculation

Application web progressive optimisée iPhone 15, pour suivre ton programme de musculation personnalisé.

## Fonctionnalités

- **Séance du jour** — Programme automatique selon le jour de la semaine (Lundi → Vendredi)
- **Cases à cocher** — Suivre la progression en temps réel avec barre de progression
- **Sauvegarde automatique** — localStorage : cases cochées et charges sauvegardées entre les sessions
- **Réinitialisation** — Bouton pour remettre à zéro la séance du jour
- **Vue semaine** — Aperçu de toute la semaine avec % de complétion par jour
- **Calculateur 1RM** — Entre ton poids test + reps → calcule ton 1RM estimé (formule Brzycki) + toutes les charges par intensité
- **Charges suggérées** — Une fois le 1RM sauvegardé, les charges recommandées apparaissent directement sur chaque exercice
- **Thème dark/light** — Toggle jour/nuit sauvegardé

## Programme

| Jour | Type | Contenu |
|------|------|---------|
| Lundi | PUSH | Pecto · Épaules · Triceps |
| Mardi | JAMBES | Renforcement ciblé blessures (périostite + bandelette IT) |
| Mercredi | PULL | Dos · Biceps · Core |
| Jeudi | JAMBES | Fessiers · Force · Gainage |
| Vendredi | PISCINE | Natation crawl · Cardio zéro impact |

## Déploiement sur GitHub Pages

1. Crée un nouveau repo sur GitHub (ex: `fitpro`)
2. Upload les 4 fichiers : `index.html`, `style.css`, `app.js`, `data.js`
3. Va dans **Settings → Pages**
4. Source : `Deploy from a branch` → branche `main` → dossier `/ (root)`
5. Ton site sera disponible à : `https://TON_PSEUDO.github.io/fitpro`

## Ajouter à l'écran d'accueil iPhone

1. Ouvre l'URL dans Safari
2. Appuie sur le bouton **Partager** (carré avec flèche)
3. **Sur l'écran d'accueil**
4. L'app s'ouvre en plein écran comme une vraie appli

## Structure

```
fitpro/
├── index.html   # Structure HTML
├── style.css    # Thèmes dark/light, optimisation iPhone
├── app.js       # Logique : navigation, cases, 1RM, localStorage
└── data.js      # Programme complet (exercices, séries, repos)
```

## Modifier le programme

Édite `data.js` pour changer les exercices, séries, temps de repos ou ajouter des séances.
