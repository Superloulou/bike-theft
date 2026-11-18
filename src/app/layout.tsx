import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DemoBanner } from "@/components/layout/demo-banner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_NAME = "Vélo Signalé";

export const metadata: Metadata = {
  metadataBase: new URL("https://velosignale.fr"),
  title: {
    default: `${SITE_NAME} — Déclarez le vol de votre vélo`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Un formulaire en quatre étapes pour décrire un vélo volé : lieu, marquage, numéro de série, signes distinctifs. Maquette de démonstration — la recherche automatique d'annonces est une fonctionnalité à venir.",
  keywords: [
    "déclarer vol vélo",
    "vélo volé",
    "plainte vélo",
    "numéro de série vélo",
    "BICYCODE",
    "marquage vélo",
    "antivol vélo",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Déclarez le vol de votre vélo`,
    description:
      "Un signalement structuré, horodaté et complet : la base de toute recherche après un vol.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Aller au contenu
        </a>
        <DemoBanner />
        <SiteHeader />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
