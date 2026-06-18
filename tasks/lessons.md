# Lessons — kasperphi

## 2026-06-18 — Un `overflow-wrap:break-word` global casse les mots de marque sur tablette

**Ce qui s'est passé :** en corrigeant le débordement mobile du hero « KASPERPHI », j'ai ajouté `overflow-wrap:break-word` à TOUS les titres (h1 inclus) comme filet de sécurité. À la première vérif desktop/tablette, le mot s'est cassé en « KASPERPH / I » dans la colonne étroite du hero 2-colonnes (901–1147px) — moche pour un mot de marque.

**Cause racine :** (1) le filet de sécurité était trop large (appliqué au hero, pas seulement aux titres de contenu) ; (2) je n'ai pas testé la plage tablette/desktop-étroit avant de considérer le fix « fini » — j'avais validé mobile (320/360/390) mais pas 900–1280.

**Règle :**
- Un mot insécable de marque ne doit JAMAIS recevoir `overflow-wrap:break-word`. Le faire tenir via `clamp()` + stack du layout, pas en cassant le mot.
- Scoper les filets de sécurité (break-word) aux titres de **contenu** (page-title, card-title, contenu Studio), jamais au hero.
- **Tester un fix responsive sur TOUTE la plage** (≤320 → ≥1280), pas seulement les largeurs mobiles. Un changement de `clamp` sur un hero impacte aussi le desktop.

**Quand ça s'applique :** tout changement de taille/wrap d'un titre hero ou d'un mot unique long ; tout ajout de `overflow-wrap` global.

## 2026-06-18 — Cross-account Cloudflare : jamais de CNAME proxifié vers le tunnel d'un autre compte

**Ce qui s'est passé :** pour pointer kasperphi.com (zone dans le compte de Phil) vers l'app servie par le tunnel de Seb, j'ai d'abord créé `CNAME @ → kasperphi.naskaus.com` proxifié → **err 1014 CNAME Cross-User Banned**.

**Cause racine :** Cloudflare interdit un CNAME proxifié pointant vers un hostname proxifié (tunnel) d'un AUTRE compte. Et un hostname de tunnel doit rester proxifié (impossible de le passer DNS-only).

**Règle :** pour servir un domaine dont la zone est dans le compte A via une infra du compte B, créer un **connecteur cloudflared dédié dans le compte A** (`cloudflared tunnel login` sur le compte A → tunnel + `route dns` même compte). Pas d'astuce DNS cross-account.

**Quand ça s'applique :** tout domaine d'un partenaire (Phil, Antonin…) à brancher sur le Pi5/tunnel NASKAUS.
