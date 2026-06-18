import { NextResponse } from "next/server";
import { db } from "../../../../lib/supabase";
import { isAuthed } from "../../../../lib/auth";

const ALLOWED = ["title", "category", "excerpt", "body", "cover_media_id", "audio_media_id", "status", "sort_order"];

export async function PATCH(req, { params }) {
  if (!(await isAuthed())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { id } = await params;
  const b = await req.json();
  const patch = {};
  for (const k of ALLOWED) if (k in b) patch[k] = b[k] === "" ? null : b[k];
  if (patch.status && !["published", "draft"].includes(patch.status)) {
    return NextResponse.json({ error: "statut invalide" }, { status: 400 });
  }
  const { data, error } = await db()
    .from("kasperphi_creations").update(patch).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ creation: data });
}

export async function DELETE(req, { params }) {
  if (!(await isAuthed())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { id } = await params;
  const { error } = await db().from("kasperphi_creations").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
