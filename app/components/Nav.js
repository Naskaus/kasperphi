"use client";
import Link from "next/link";
import { useState } from "react";

const LINKS = [
  ["/", "Accueil"],
  ["/manifeste", "Manifeste"],
  ["/rubriques", "Rubriques"],
  ["/creations", "Créations"],
  ["/univers", "Univers"],
  ["/contact", "Contact"],
];

export default function Nav({ active }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="masthead">
      <Link className="brand-link" href="/">
        <div className="brand">Kasperphi</div>
        <div className="brand-tag">Revue artistique satirique</div>
      </Link>
      <button
        className="burger"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "✕ Fermer" : "☰ Menu"}
      </button>
      <nav className={"main-nav" + (open ? " open" : "")} aria-label="Navigation principale">
        {LINKS.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={active === href ? "active" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
