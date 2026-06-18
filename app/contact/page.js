import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ContactForm from "./ContactForm";
import { getSettings } from "../lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact — Kasperphi" };

export default async function Contact() {
  const s = await getSettings();
  return (
    <div className="page">
      <Nav active="/contact" />
      <main>
        <section className="block" style={{ borderBottom: "none", paddingBottom: 10 }}>
          <h1 className="page-title">Contact</h1>
          <p className="page-lead">Un mot, une insulte élégante, une proposition de comptoir. Tout se lit.</p>
        </section>
        <section className="block">
          <ContactForm />
          <p className="contact-aside">
            Ou, pour les amateurs de papier : <strong>{s.contact_email}</strong><br />
            Réponses lentes, sincères, et parfois rimées.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
