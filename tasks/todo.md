# Kasperphi Studio — Admin CMS build

Decisions (Seb, 2026-06-18): Next.js + Supabase · PIN auth · Supabase Storage.

## Plan
- [ ] DB: tables `kasperphi_creations`, `kasperphi_media`, `kasperphi_settings` (public schema, RLS strict, server-only writes)
- [ ] Storage: public bucket `kasperphi-media`
- [ ] Seed: port current creations + hero/manifeste texts so site isn't empty
- [ ] Next.js app scaffold (App Router, Node 20 / Next 15)
- [ ] lib: supabase server client (service role), PIN auth (signed cookie)
- [ ] Public pages (SSR from DB, same editorial design): accueil, manifeste, créations (filtres), rubriques, univers, contact, creation/[slug]
- [ ] Contact form → POST to kasperphi_contact (or settings email)
- [ ] Studio admin (/studio): login PIN → dashboard
  - [ ] Créations: list + publish/draft toggle + reorder + new/edit/delete
  - [ ] Bibliothèque média: drag-drop upload (image/audio/video), preview, rename, delete, copy link
  - [ ] Réglages: hero text, manifeste text, contact email
- [ ] Local sanity (build) → deploy Pi5 PM2 :8059
- [ ] Playwright test live (public + studio, desktop + mobile)
- [ ] USAGE_STUDIO.md for Phil (non-dev guide)
- [ ] commit + push

## Infra
- Supabase: ppsakhqkieqxtcevsyos (NASKAUS)
- Pi5 port: 8059 (free) · Node v20.19.2
- Domain: kasperphi.com (pending DNS) / preview naskaus.com
