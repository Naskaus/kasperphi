import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import { getCreationBySlug, catLabel } from "../../lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = await getCreationBySlug(slug);
  return { title: c ? `${c.title} — Kasperphi` : "Création — Kasperphi" };
}

export default async function CreationPage({ params }) {
  const { slug } = await params;
  const c = await getCreationBySlug(slug);
  if (!c) notFound();

  const isVideo = c.audio_mime && c.audio_mime.startsWith("video/");

  return (
    <div className="page">
      <Nav active="/creations" />
      <main>
        <section className="block" style={{ borderBottom: "none", paddingBottom: 6 }}>
          <p className="center" style={{ margin: 0 }}>
            <Link className="more" href="/creations" style={{ textTransform: "uppercase", fontWeight: 700 }}>
              ← Toutes les créations
            </Link>
          </p>
          <p className="center" style={{ margin: "14px 0 0", color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, fontSize: "0.85rem" }}>
            {catLabel(c.category)}
          </p>
          <h1 className="page-title">{c.title}</h1>
          {c.excerpt && <p className="page-lead">{c.excerpt}</p>}
        </section>

        <section className="block">
          <div className="prose">
            {c.cover_url && (
              <p><img src={c.cover_url} alt="" style={{ width: "100%", border: "2px solid var(--line)", filter: "sepia(0.12)" }} /></p>
            )}
            {c.audio_url && !isVideo && (
              <audio className="media-player" controls src={c.audio_url}>Votre navigateur ne lit pas l'audio.</audio>
            )}
            {c.audio_url && isVideo && (
              <video className="media-player" controls src={c.audio_url} style={{ maxHeight: 480 }}>Votre navigateur ne lit pas la vidéo.</video>
            )}
            {String(c.body || "")
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((para, i) => (
                <p key={i} className={i === 0 ? "drop" : undefined}>{para}</p>
              ))}
          </div>
          <div className="center" style={{ marginTop: 6 }}>
            <Link className="btn primary" href="/creations">Autres créations</Link>
            <Link className="btn" href="/univers">Entrer dans l'univers</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
