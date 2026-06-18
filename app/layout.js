import "./globals.css";

export const metadata = {
  title: "Kasperphi — L'élégance de travers",
  description:
    "Textes, chansons, images et autres accidents choisis. Fabriqués avec IA, mais jamais laissés en roue libre. Artificiel, peut-être. Automatique, jamais.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
