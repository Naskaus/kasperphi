import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { getSettings } from "../lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manifeste — Kasperphi" };

export default async function Manifeste() {
  const s = await getSettings();
  return (
    <div className="page">
      <Nav active="/manifeste" />
      <main>
        <section className="block" style={{ borderBottom: "none", paddingBottom: 8 }}>
          <h1 className="page-title">Manifeste</h1>
          <p className="page-lead">Oui, l'IA est là. Mais elle n'est pas seule aux commandes.</p>
          <div className="ornament-figure">
            <img src="/img/ornament.jpg" alt="Vignette gravée : une main qui pointe, un masque de comédie, des lauriers." />
          </div>
        </section>
        <section className="block">
          <div className="prose">
            {String(s.manifeste_body || "")
              .split(/\n\s*\n/)
              .map((para, i) => (
                <p key={i} className={i === 0 ? "drop" : undefined}>{para}</p>
              ))}
            <p className="signature">— Kasperphi</p>
          </div>
          <div className="center" style={{ marginTop: 10 }}>
            <Link className="btn primary" href="/creations">Voir les créations</Link>
            <Link className="btn" href="/univers">Entrer dans l'univers</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
