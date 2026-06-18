import { NextResponse } from "next/server";
import { db, publicUrl, MEDIA_BUCKET } from "../../../lib/supabase";
import { isAuthed } from "../../../lib/auth";

function kindOf(mime) {
  if (!mime) return "other";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  return "other";
}
function safeName(name) {
  return String(name || "fichier")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 120);
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { data, error } = await db()
    .from("kasperphi_media").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ media: data || [] });
}

export async function POST(req) {
  if (!(await isAuthed())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "aucun fichier" }, { status: 400 });
  }
  const mime = file.type || "application/octet-stream";
  const buf = Buffer.from(await file.arrayBuffer());
  const path = `${Date.now()}-${safeName(file.name)}`;
  const sb = db();

  const up = await sb.storage.from(MEDIA_BUCKET).upload(path, buf, {
    contentType: mime, upsert: false,
  });
  if (up.error) return NextResponse.json({ error: up.error.message }, { status: 500 });

  const { data, error } = await sb.from("kasperphi_media").insert({
    kind: kindOf(mime),
    storage_path: path,
    public_url: publicUrl(path),
    title: form.get("title") || file.name || path,
    mime,
    size_bytes: buf.length,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ media: data });
}

export async function PATCH(req) {
  if (!(await isAuthed())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { id, title } = await req.json();
  const { data, error } = await db()
    .from("kasperphi_media").update({ title }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ media: data });
}

export async function DELETE(req) {
  if (!(await isAuthed())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  const sb = db();
  const { data: row } = await sb.from("kasperphi_media").select("storage_path").eq("id", id).maybeSingle();
  if (row?.storage_path) await sb.storage.from(MEDIA_BUCKET).remove([row.storage_path]);
  const { error } = await sb.from("kasperphi_media").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
