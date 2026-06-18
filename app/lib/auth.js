import crypto from "crypto";
import { cookies } from "next/headers";

// Stateless PIN session: cookie holds an HMAC token. No DB, single owner (Phil).
const COOKIE = "kp_admin";
const SECRET = process.env.KASPERPHI_SESSION_SECRET || "kasperphi-dev-secret-change-me";

function token() {
  return crypto.createHmac("sha256", SECRET).update("kasperphi-admin-v1").digest("hex");
}

export function checkPin(pin) {
  const expected = process.env.KASPERPHI_PIN || "";
  if (!expected) return false;
  // constant-time compare
  const a = Buffer.from(String(pin));
  const b = Buffer.from(String(expected));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function setSession() {
  const jar = await cookies();
  jar.set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAuthed() {
  const jar = await cookies();
  const v = jar.get(COOKIE)?.value;
  if (!v) return false;
  const expected = token();
  const a = Buffer.from(v);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
