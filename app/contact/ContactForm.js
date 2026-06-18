"use client";
import { useState } from "react";

export default function ContactForm() {
  const [errs, setErrs] = useState({});
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const nom = f.nom.value.trim();
    const email = f.email.value.trim();
    const message = f.message.value.trim();
    const er = {};
    if (!nom) er.nom = "Il faut bien signer quelque part.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) er.email = "Une adresse valable, pour qu'on puisse vous répondre de travers.";
    if (!message) er.message = "La page est vide. Ce serait dommage.";
    setErrs(er);
    if (Object.keys(er).length) return;

    setSending(true);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, message }),
      });
      if (r.ok) {
        setNote("Merci. Votre message est noté dans le grand cahier. Kasperphi vous répondra, à sa manière, et sans rancune.");
        f.reset();
      } else {
        setNote("Le grand cahier est coincé. Réessayez dans un instant.");
      }
    } catch {
      setNote("Le grand cahier est coincé. Réessayez dans un instant.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="contact" noValidate onSubmit={onSubmit}>
      <div className={"field" + (errs.nom ? " invalid" : "")}>
        <label htmlFor="nom">Votre nom (ou pseudonyme de scène)</label>
        <input id="nom" name="nom" type="text" autoComplete="name" onInput={() => setErrs((e) => ({ ...e, nom: null }))} />
        {errs.nom && <span style={{ color: "var(--red-dark)", fontSize: "0.82rem", fontStyle: "italic" }}>{errs.nom}</span>}
      </div>
      <div className={"field" + (errs.email ? " invalid" : "")}>
        <label htmlFor="email">Votre adresse</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="vous@quelquepart.fr" onInput={() => setErrs((e) => ({ ...e, email: null }))} />
        {errs.email && <span style={{ color: "var(--red-dark)", fontSize: "0.82rem", fontStyle: "italic" }}>{errs.email}</span>}
      </div>
      <div className={"field" + (errs.message ? " invalid" : "")}>
        <label htmlFor="message">Votre message</label>
        <textarea id="message" name="message" placeholder="Dites tout. Ou presque." onInput={() => setErrs((e) => ({ ...e, message: null }))} />
        {errs.message && <span style={{ color: "var(--red-dark)", fontSize: "0.82rem", fontStyle: "italic" }}>{errs.message}</span>}
      </div>
      <div className="center">
        <button className="btn primary" type="submit" disabled={sending}>
          {sending ? "Envoi…" : "Envoyer dans le grand cahier"}
        </button>
      </div>
      {note && <p className="form-note">{note}</p>}
    </form>
  );
}
