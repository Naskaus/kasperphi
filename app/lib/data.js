import { db, publicUrl } from "./supabase";

// Fixed taxonomy (matches the brief). Phil edits creations + media + texts, not the taxonomy.
export const CATEGORIES = [
  { key: "one-mon-show", label: "One Mon Show", icon: "🎩" },
  { key: "chansons", label: "Chansons", icon: "🎙️" },
  { key: "images", label: "Images", icon: "🖼️" },
  { key: "textes", label: "Textes", icon: "⌨️" },
  { key: "pochettes", label: "Pochettes", icon: "🎼" },
];

export const RUBRIQUES = [
  { key: "one-mon-show", icon: "🎩", title: "One Mon Show littéraire", text: "Textes de scène, souvenirs rejoués, auteurs dérangés et mauvaise foi élégante." },
  { key: "chansons", icon: "🎙️", title: "Musique", text: "Chansons bancales, refrains tordus, rock fatigué et mélodies de comptoir." },
  { key: "images", icon: "🖼️", title: "Images", text: "Affiches, pochettes, visuels et élégance de travers." },
  { key: "textes", icon: "⌨️", title: "Textes", text: "Monologues, fragments, catastrophes ordinaires et souvenirs maquillés." },
];

export const UNIVERS = [
  { id: "souvenirs", icon: "💼", title: "Souvenirs maquillés", text: "École primaire, boulangerie, copains, cancres et mythologies minuscules." },
  { id: "cabaret", icon: "🎩", title: "Cabaret littéraire", text: "Textes de scène, auteurs dérangés et littérature descendue au comptoir." },
  { id: "chansons", icon: "🎙️", title: "Chansons bancales", text: "Refrains tordus, voix imaginaires, rock fatigué et mélodies qui fument." },
  { id: "catastrophes", icon: "⏱️", title: "Catastrophes ordinaires", text: "Langue qui s'efface, monde qui accélère, institutions qui toussent." },
  { id: "nice", icon: "🍷", title: "Nice fantôme", text: "Place Arson, terrains de boules, enfance urbaine et folklore personnel." },
  { id: "elegance", icon: "👞", title: "Élégance de travers", text: "Formes imparfaites, phrases qui boitent et idées mal coiffées." },
];

export function catLabel(key) {
  return (CATEGORIES.find((c) => c.key === key) || {}).label || key;
}

const DEFAULT_SETTINGS = {
  hero_title: "KASPERPHI",
  hero_subtitle: "L'élégance de travers.",
  hero_lead: "Textes, chansons, images et autres accidents choisis, fabriqués avec IA, mais jamais laissés en roue libre.",
  avant_text: "Si les créations faites avec l'aide de l'intelligence artificielle vous donnent des boutons, des vapeurs ou l'envie d'écrire sur la mort de l'art, vous pouvez partir maintenant.",
  manifeste_body: "Artificiel, peut-être. Automatique, jamais.",
  contact_email: "bonjour@kasperphi.fr",
};

export async function getSettings() {
  try {
    const { data } = await db().from("kasperphi_settings").select("key,value");
    const map = { ...DEFAULT_SETTINGS };
    (data || []).forEach((r) => { if (r.value != null) map[r.key] = r.value; });
    return map;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function withMedia(row) {
  return {
    ...row,
    cover_url: row.cover ? publicUrl(row.cover.storage_path) : null,
    audio_url: row.audio ? publicUrl(row.audio.storage_path) : null,
    audio_mime: row.audio?.mime || null,
  };
}

const SELECT =
  "*, cover:cover_media_id(storage_path), audio:audio_media_id(storage_path,mime)";

export async function getPublishedCreations() {
  const { data } = await db()
    .from("kasperphi_creations")
    .select(SELECT)
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  return (data || []).map(withMedia);
}

export async function getLatest(n = 3) {
  const all = await getPublishedCreations();
  return all.slice(0, n);
}

export async function getCreationBySlug(slug) {
  const { data } = await db()
    .from("kasperphi_creations")
    .select(SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data ? withMedia(data) : null;
}
