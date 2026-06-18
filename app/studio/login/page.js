"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Login() {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    const r = await fetch("/api/studio/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    setBusy(false);
    if (r.ok) { router.push("/studio"); router.refresh(); }
    else { setErr("Code incorrect."); setPin(""); }
  }

  return (
    <div className="page">
      <div className="login-box">
        <div className="brand" style={{ fontSize: "2.4rem" }}>Kasperphi</div>
        <div className="brand-tag" style={{ marginBottom: 8 }}>Studio — espace privé</div>
        <h3 style={{ marginTop: 24 }}>Entrez votre code</h3>
        <form onSubmit={submit}>
          <input
            className="finput pin-input"
            type="password"
            inputMode="numeric"
            autoFocus
            value={pin}
            maxLength={6}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="••••"
          />
          {err && <p style={{ color: "var(--red-dark)", fontStyle: "italic" }}>{err}</p>}
          <div style={{ marginTop: 16 }}>
            <button className="btn primary" type="submit" disabled={busy || pin.length < 4}>
              {busy ? "…" : "Entrer dans le studio"}
            </button>
          </div>
        </form>
        <p className="hint" style={{ marginTop: 22 }}>Réservé à Kasperphi. Sans rancune.</p>
      </div>
    </div>
  );
}
