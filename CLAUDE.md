# CLAUDE.md — Kasperphi

Site éditorial satirique pour **Kasperphi** — « L'élégance de travers ».
Une revue artistique : couverture de livre ancien devenue navigable.

## Nature du projet
- Site **statique** multi-pages (HTML/CSS/JS vanilla, zéro dépendance, zéro build).
- Aucune brique startup. Esthétique : papier vieilli, gravures N&B, cadres rouges, serif.
- Bucket : `naskaus/lab/`.

## Structure
```
kasperphi/
├── index.html              # Accueil (hero, avant d'entrer, créations, rubriques, univers)
├── manifeste.html          # Texte complet du manifeste
├── creations.html          # Listing filtrable (Tout / OMS / Chansons / Images / Textes / Pochettes)
├── creation-braquage.html  # Page de création exemple (patron "1 création = 1 page")
├── rubriques.html          # 4 grandes catégories
├── univers.html            # 6 territoires poétiques (ancres #souvenirs, #cabaret, ...)
├── contact.html            # Formulaire (validation client, pas de backend)
├── assets/
│   ├── css/style.css       # Design system complet + responsive + burger
│   ├── js/site.js          # Burger nav, filtres (hash-aware), validation form
│   └── img/                # hero.jpg + ornament.jpg (gravures générées IA)
├── USAGE.md
└── brief_webdesigner_kasperphi.html  # Brief source (référence)
```

## Conventions
- Palette dans `:root` de `style.css` (--paper, --red, --ink…). Ne jamais hardcoder.
- Boutons : `.btn` (secondaire, contour rouge) / `.btn.primary` (fond rouge, texte crème).
- Filtres créations : chaque carte porte `data-cat`, les boutons `data-filter`.
  Pré-filtrage via hash : `creations.html#filtre=chansons`.
- Mobile < 900px : menu burger (`.burger` + `nav.main-nav.open`).

## Lancer en local
```bash
cd kasperphi && python3 -m http.server 4317
# http://localhost:4317
```

## Déploiement
Site statique → Pi5 `/var/www/kasperphi/`, exposé via `naskaus.com/kasperphi/`.
Snapshot avant tout `rsync --delete` (règle deployment-checks.md).
