import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { RUBRIQUES } from "../lib/data";

export const metadata = { title: "Rubriques — Kasperphi" };

export default function Rubriques() {
  return (
    <div className="page">
      <Nav active="/rubriques" />
      <main>
        <section className="block" style={{ borderBottom: "none", paddingBottom: 10 }}>
          <h1 className="page-title">Rubriques</h1>
          <p className="page-lead">Quatre portes, un même comptoir. Classement simple et clair.</p>
        </section>
        <section className="block">
          <div className="grid-2">
            {RUBRIQUES.map((r) => (
              <Link key={r.key} className="card" href={`/creations?filtre=${r.key}`}>
                <div className="icon">{r.icon}</div>
                <div className="card-title">{r.title}</div>
                <p>{r.text}</p>
                <span className="more">Explorer →</span>
              </Link>
            ))}
          </div>
          <div className="quote">Comment explorer ? Par rubriques.<br />One Mon Show, Musique, Images, Textes.</div>
          <div className="center">
            <Link className="btn primary" href="/creations">Voir toutes les créations</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
