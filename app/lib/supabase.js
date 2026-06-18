import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service-role key.
// All DB + Storage access goes through the server (public site SSR + PIN-gated studio APIs).
// The service-role key is NEVER shipped to the browser.

const url =
  process.env.NASKAUS_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey =
  process.env.NASKAUS_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // Don't crash the build; routes will surface a clear error at runtime.
  console.warn("[kasperphi] Supabase env vars missing (NASKAUS_SUPABASE_URL / NASKAUS_SUPABASE_SERVICE_ROLE_KEY)");
}

export const MEDIA_BUCKET = "kasperphi-media";

export function db() {
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function publicUrl(path) {
  return `${url}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}
