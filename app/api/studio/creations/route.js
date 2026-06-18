import { NextResponse } from "next/server";
import { db } from "../../../lib/supabase";
import { isAuthed } from "../../../lib/auth";

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "creation";
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { data, error } = await db()
    .from("kasperphi_creations")
    .select("*, cover:cover_media_id(storage_path), audio:audio_media_id(storage_path,mime)")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ creations: data || [] });
}

export async function POST(req) {
  if (!(await isAuthed())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const b = await req.json();
  if (!b.title) return NextResponse.json({ error: "Titre requis" }, { status: 400 });

  let base = b.slug ? slugify(b.slug) : slugify(b.title);
  // ensure unique slug
  let slug = base, n = 2;
  const sb = db();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data: hit } = await sb.from("kasperphi_creations").select("id").eq("slug", slug).maybeSingle();
    if (!hit) break;
    slug = `${base}-${n++}`;
  }

  const { count } = await sb.from("kasperphi_creations").select("id", { count: "exact", head: true });
  const { data, error } = await sb.from("kasperphi_creations").insert({
    title: b.title,
    slug,
    category: b.category || "textes",
    excerpt: b.excerpt || null,
    body: b.body || null,
    cover_media_id: b.cover_media_id || null,
    audio_media_id: b.audio_media_id || null,
    status: b.status === "published" ? "published" : "draft",
    sort_order: (count || 0) * 10 + 10,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ creation: data });
}
