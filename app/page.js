import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { getSettings, getLatest, RUBRIQUES, UNIVERS, catLabel } from "./lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [s, latest] = await Promise.all([getSettings(), getLatest(3)]);

  return (
    <div className="page">
      <Nav active="/" />
      <main>
        <section className="hero">
          <div>
            <h1>{s.hero_title}</h1>
            <h2>{s.hero_subtitle}</h2>
            <p className="lead">{s.hero_lead}</p>
            <div className="buttons">
              <Link className="btn primary" href="/creations">Nouvelles créations</Link>
              <Link className="btn" href="/rubriques">Explorer les rubriques</Link>
            </div>
          </div>
          <figure className="hero-figure">
            <img src="/img/hero.jpg" alt="Gravure d'un homme au micro, livre ouvert, en pleine performance de cabaret." />
            <figcaption>Le One Mon Show, tous les soirs dans votre écran.</figcaption>
          </figure>
        </section>

        <section className="block">
          <h2 className="section-title">Avant d'entrer</h2>
          <div className="ornament">✦</div>
          <div className="intro-box">
            <div className="pointing">☞</div>
            <div>
              <h3>AVANT D'ENTRER</h3>
              <p>{s.avant_text}</p>
              <p><strong>Sans rancune.</strong></p>
            </div>
            <div><Link className="btn" href="/manifeste">Lire le manifeste</Link></div>
          </div>
        </section>

        <section className="block">
          <h2 className="section-title">Dernières créations</h2>
          <div className="ornament">✦</div>
          {latest.length === 0 ? (
            <p className="empty-note">Le rideau n'est pas encore levé. Bientôt, des créations.</p>
          ) : (
            <div className="grid-3">
              {latest.map((c) => (
                <Link key={c.id} className="card" href={`/creation/${c.slug}`}>
                  {c.cover_url && <img className="thumb" src={c.cover_url} alt="" />}
                  <div className="category">{catLabel(c.category)}</div>
                  <div className="card-title">{c.title}</div>
                  <p>{c.excerpt}</p>
                  <span className="more">Lire / écouter →</span>
                </Link>
              ))}
            </div>
          )}
          <div className="center" style={{ marginTop: 22 }}>
            <Link className="btn" href="/creations">Voir toutes les créations</Link>
          </div>
        </section>

        <section className="block">
          <h2 className="section-title">Rubriques</h2>
          <div className="ornament">✦</div>
          <div className="grid-4">
            {RUBRIQUES.map((r) => (
              <Link key={r.key} className="card" href={`/creations?filtre=${r.key}`}>
                <div className="icon">{r.icon}</div>
                <div className="card-title">{r.title}</div>
                <p>{r.text}</p>
                <span className="more">Explorer →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="block">
          <h2 className="section-title">Univers</h2>
          <div className="ornament">Les territoires de Kasperphi</div>
          <div className="grid-6">
            {UNIVERS.map((u) => (
              <Link key={u.id} className="card" href={`/univers#${u.id}`}>
                <div className="icon">{u.icon}</div>
                <div className="category">{u.title}</div>
                <p>{u.text}</p>
                <span className="more">Explorer →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="block">
          <div className="quote">
            Le site n'est pas une vitrine technologique.<br />
            C'est une porte d'entrée dans un théâtre personnel.
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
