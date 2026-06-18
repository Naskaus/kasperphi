# Product

## Register

brand

## Users
Lecteurs francophones d'une revue satirique en ligne, et **Phil** (non-développeur) qui publie ses créations via le Studio admin. Le visiteur arrive pour lire des textes, regarder des gravures, écouter de l'audio : il consomme une ambiance autant qu'un contenu. Phil, lui, gère le contenu depuis `/studio` (CRUD créations, bibliothèque média, réglages).

## Product Purpose
**Kasperphi — « L'élégance de travers ».** Une revue artistique satirique présentée comme un livre ancien : couverture de papier vieilli, cadres rouges à double-filet, gravures IA, typographie Georgia. Le site est piloté par un CMS (« le Studio ») pour que Phil édite tout sans toucher au code. Succès = le visiteur croit feuilleter un ouvrage imprimé, et Phil publie en autonomie.

## Brand Personality
Lettré, pince-sans-rire, désuet-assumé. Trois mots : **gravé, ironique, patiné.** L'interface doit évoquer un vieux frontispice d'almanach satirique — sérieux dans la forme, moqueur dans le fond. Voix : française soutenue avec une distance amusée.

## Anti-references
Pas de SaaS-moderne (pas de cards arrondies, pas de néon, pas de dégradés flashy, pas de sans-serif géométrique). Pas de magazine-éditorial-2026 générique (gros serif italique + labels mono + colonnes filetées) : ici l'éditorial est *littéral* (vrai livre ancien), pas une affectation. Pas de mode sombre.

## Design Principles
- **Le papier est le produit.** Tout sert l'illusion de l'imprimé ancien : grain, sépia léger, double-filets rouges.
- **Identité figée.** Rouge oxblood + papier crème + Georgia sont l'ADN — on ne les remplace pas, on les protège.
- **Lisible avant tout.** Le pastiche ne doit jamais coûter la lisibilité ni le responsive : le viewport fait partie du design.
- **Autonomie de Phil.** Le Studio prime sur la sophistication technique ; un non-dev doit s'en sortir seul.

## Accessibility & Inclusion
Contraste corps de texte ≥ 4.5:1 (attention au `--muted` #5a4634 sur papier). Cibles tactiles ≥ 44px sur mobile. `prefers-reduced-motion` respecté. Le texte ne doit jamais déborder de son cadre, à aucun breakpoint.
