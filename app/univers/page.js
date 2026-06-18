import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { UNIVERS } from "../lib/data";

export const metadata = { title: "Univers — Kasperphi" };

export default function Univers() {
  return (
    <div className="page">
      <Nav active="/univers" />
      <main>
        <section className="block" style={{ borderBottom: "none", paddingBottom: 10 }}>
          <h1 className="page-title">Univers</h1>
          <p className="page-lead">Les territoires de Kasperphi. Une lecture plus personnelle, plus thématique.</p>
        </section>
        <section className="block">
          <div className="grid-3">
            {UNIVERS.map((u) => (
              <article key={u.id} id={u.id} className="card">
                <div className="icon">{u.icon}</div>
                <div className="category">{u.title}</div>
                <p>{u.text}</p>
              </article>
            ))}
          </div>
          <div className="quote">
            Quels sont les mondes récurrents ?<br />
            Souvenirs, cabaret, chansons, catastrophes, Nice, élégance de travers.
          </div>
          <div className="center">
            <Link className="btn primary" href="/creations">Voir les créations</Link>
            <Link className="btn" href="/manifeste">Lire le manifeste</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
