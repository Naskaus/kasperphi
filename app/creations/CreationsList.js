"use client";
import Link from "next/link";
import { useState } from "react";

const FILTERS = [
  ["all", "Tout"],
  ["one-mon-show", "One Mon Show"],
  ["chansons", "Chansons"],
  ["images", "Images"],
  ["textes", "Textes"],
  ["pochettes", "Pochettes"],
];
const LABELS = Object.fromEntries(FILTERS);

export default function CreationsList({ creations, initial }) {
  const valid = FILTERS.some(([k]) => k === initial) ? initial : "all";
  const [active, setActive] = useState(valid);
  const shown = creations.filter((c) => active === "all" || c.category === active);

  return (
    <>
      <div className="filters" role="group" aria-label="Filtrer les créations">
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            className={"filter" + (active === key ? " active" : "")}
            aria-pressed={active === key}
            onClick={() => setActive(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="empty-note">Rien dans cette rubrique. Le rideau est tombé un peu trop tôt.</p>
      ) : (
        <div className="grid-3">
          {shown.map((c) => (
            <Link key={c.id} className="card" href={`/creation/${c.slug}`}>
              {c.cover_url && <img className="thumb" src={c.cover_url} alt="" />}
              <div className="category">{LABELS[c.category] || c.category}</div>
              <div className="card-title">{c.title}</div>
              <p>{c.excerpt}</p>
              <span className="more">{c.audio_url ? "Lire / écouter →" : "Lire →"}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
