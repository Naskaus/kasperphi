import Link from "next/link";

export default function Footer() {
  return (
    <footer className="colophon">
      <strong>Kasperphi</strong>
      <em>Artificiel, peut-être. Automatique, jamais.</em>
      <nav className="foot-nav" aria-label="Pied de page">
        <Link href="/manifeste">Manifeste</Link>
        <Link href="/creations">Créations</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </footer>
  );
}
