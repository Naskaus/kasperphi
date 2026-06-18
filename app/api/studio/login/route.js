import { NextResponse } from "next/server";
import { checkPin, setSession, clearSession } from "../../../lib/auth";

export async function POST(req) {
  try {
    const { pin } = await req.json();
    if (!checkPin(pin)) {
      return NextResponse.json({ error: "Code incorrect." }, { status: 401 });
    }
    await setSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "erreur" }, { status: 500 });
  }
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
