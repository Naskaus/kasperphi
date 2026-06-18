import { NextResponse } from "next/server";
import { db } from "../../../lib/supabase";
import { isAuthed } from "../../../lib/auth";

const KEYS = ["hero_title", "hero_subtitle", "hero_lead", "avant_text", "manifeste_body", "contact_email"];

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { data, error } = await db().from("kasperphi_settings").select("key,value");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const map = {};
  (data || []).forEach((r) => (map[r.key] = r.value));
  return NextResponse.json({ settings: map });
}

export async function PATCH(req) {
  if (!(await isAuthed())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const b = await req.json();
  const rows = KEYS.filter((k) => k in b).map((k) => ({ key: k, value: b[k], updated_at: new Date().toISOString() }));
  if (!rows.length) return NextResponse.json({ ok: true });
  const { error } = await db().from("kasperphi_settings").upsert(rows, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
