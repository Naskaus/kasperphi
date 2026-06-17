# USAGE — Site Kasperphi

**Ce que c'est :** le site complet de Kasperphi, une revue artistique satirique (6 pages), où l'on lit des textes, écoute des chansons et regarde des images « faites avec IA, mais jamais laissées en roue libre ».

## Démarrage en 3 étapes
1. Ouvrir un terminal dans le dossier `kasperphi/`.
2. Lancer : `python3 -m http.server 4317`
3. Aller sur **http://localhost:4317** dans le navigateur.

Aucune installation, aucune base de données, aucun compte. C'est un site statique : on peut aussi double-cliquer directement sur `index.html`.

## Les pages
| Page | À quoi ça sert |
|------|----------------|
| **Accueil** | La couverture. Hero, manifeste court « Avant d'entrer », dernières créations, rubriques, univers. |
| **Manifeste** | Le texte complet : pourquoi l'IA, la légitimité, le désir. |
| **Rubriques** | Les 4 grandes portes : One Mon Show, Musique, Images, Textes. |
| **Créations** | Toutes les œuvres. Boutons de filtre en haut pour trier par type. |
| **Univers** | Les 6 territoires poétiques (souvenirs, cabaret, Nice fantôme…). |
| **Contact** | Un formulaire sobre. |

## Comment ça marche (côté visiteur)
- **Menu :** sur mobile, taper **☰ Menu** en haut à droite.
- **Filtrer les créations :** sur la page Créations, cliquer un bouton (Tout, Chansons…).
  Les liens « Explorer → » des rubriques pré-sélectionnent déjà le bon filtre.
- **Formulaire de contact :** il vérifie nom / email / message puis affiche un message de
  confirmation. ⚠️ Il **n'envoie pas encore d'email** (pas de backend) — voir ci-dessous.

## Pièges fréquents
- **« Le formulaire n'envoie rien »** → normal, c'est une validation côté client seulement.
  Pour recevoir les messages, brancher un service (Formspree, ou une route n8n sur le Pi5).
- **« Les images ne s'affichent pas »** → il faut servir le dossier (http.server), pas ouvrir
  un fichier isolé hors du dossier `kasperphi/`.
- **Remplacer une gravure** → déposer le nouveau fichier dans `assets/img/` en gardant le nom
  (`hero.jpg`, `ornament.jpg`).

## Ajouter une création
1. Ouvrir `creations.html`.
2. Copier un bloc `<a class="card" data-cat="..." href="...">…</a>`.
3. Mettre `data-cat` à l'une des valeurs : `one-mon-show`, `chansons`, `images`, `textes`, `pochettes`.
4. (Optionnel) Créer une page dédiée en copiant `creation-braquage.html`.
