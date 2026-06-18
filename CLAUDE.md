# CLAUDE.md — Kasperphi

Site éditorial satirique **dynamique** pour **Kasperphi** — « L'élégance de travers ».
Une revue artistique : couverture de livre ancien, pilotée par un CMS (le « Studio »).

## Nature du projet
- **Next.js 15 (App Router) + Supabase** (DB + Storage). Pi5 PM2 `kasperphi` :8059.
- Le site public garde le design « gravures / papier vieilli / cadres rouges » d'origine.
- **Studio admin** (`/studio`, PIN) : Phil gère créations + médias + textes en autonomie.
- Bucket NASKAUS pattern : tables `public.kasperphi_*`, bucket `kasperphi-media` (public).
- Bucket : `naskaus/lab/`.

## Architecture
```
app/
├── layout.js, globals.css            # design public + studio
├── components/ Nav.js, Footer.js
├── page.js                           # Accueil (SSR depuis DB)
├── manifeste/ rubriques/ univers/    # pages publiques
├── creations/ (+ CreationsList.js)   # listing filtrable (client)
├── creation/[slug]/                  # page d'une création
├── contact/ (+ ContactForm.js)
├── studio/ (login + StudioApp.js)    # CMS : Créations / Média / Réglages
├── api/contact, api/studio/*         # routes serveur (service role, PIN-gated)
└── lib/ supabase.js, auth.js, data.js
static-reference/                     # site statique d'origine (référence design)
```

## Données (Supabase NASKAUS — ppsakhqkieqxtcevsyos)
- `kasperphi_creations` (title, slug, category, excerpt, body, cover_media_id, audio_media_id, status, sort_order)
- `kasperphi_media` (kind, storage_path, public_url, title, mime, size_bytes)
- `kasperphi_settings` (key/value : hero_*, avant_text, manifeste_body, contact_email)
- `kasperphi_contact` (messages du formulaire)
- RLS **stricte** : aucun accès anon. Tout passe par le serveur (service role). Le studio est gardé par cookie PIN.

## Sécurité / env (Pi5 `/var/www/kasperphi/.env`, 600)
- `NASKAUS_SUPABASE_URL`, `NASKAUS_SUPABASE_SERVICE_ROLE_KEY` (réutilisés du projet NASKAUS)
- `KASPERPHI_PIN` (code de Phil), `KASPERPHI_SESSION_SECRET` (HMAC cookie)
- Jamais commit. Jamais exposé au navigateur (tout est server-side).

## Déploiement
```bash
rsync (exclude node_modules/.next/.git/.env) → /var/www/kasperphi/
ssh pi5 "cd /var/www/kasperphi && npm install && npm run build && pm2 restart kasperphi"
curl https://kasperphi.naskaus.com/   # health 200
```
- Preview live : **https://kasperphi.naskaus.com** (tunnel Cloudflare → :8059).
- Domaine cible : **kasperphi.com** (DNS en attente — voir [[kasperphi-deploy]]).
- cloudflared ingress `kasperphi.naskaus.com → localhost:8059` (config snapshotée).

## Pour Phil
Guide non-technique : **USAGE_STUDIO.md**. Connexion `/studio` + PIN.
