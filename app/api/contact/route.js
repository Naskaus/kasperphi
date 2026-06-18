import { NextResponse } from "next/server";
import { db } from "../../lib/supabase";

export async function POST(req) {
  try {
    const { nom, email, message } = await req.json();
    if (!nom || !email || !message) {
      return NextResponse.json({ error: "champs manquants" }, { status: 400 });
    }
    await db().from("kasperphi_contact").insert({
      name: String(nom).slice(0, 200),
      email: String(email).slice(0, 200),
      message: String(message).slice(0, 5000),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "erreur serveur" }, { status: 500 });
  }
}
