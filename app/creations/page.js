import Nav from "../components/Nav";
import Footer from "../components/Footer";
import CreationsList from "./CreationsList";
import { getPublishedCreations } from "../lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Créations — Kasperphi" };

export default async function Creations({ searchParams }) {
  const sp = await searchParams;
  const initial = typeof sp?.filtre === "string" ? sp.filtre : "all";
  const creations = await getPublishedCreations();
  return (
    <div className="page">
      <Nav active="/creations" />
      <main>
        <section className="block" style={{ borderBottom: "none", paddingBottom: 10 }}>
          <h1 className="page-title">Créations</h1>
          <p className="page-lead">Des accidents choisis, rangés en vitrine. Triez selon votre humeur.</p>
        </section>
        <section className="block">
          <CreationsList creations={creations} initial={initial} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
