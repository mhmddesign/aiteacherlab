import type { Metadata } from "next";
import {
  Fraunces,
  IBM_Plex_Sans_Arabic,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-arabic",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Teacher Lab · Atelier Provincial de Mediouna",
  description:
    "Plateforme interactive de partage d'expérience et de création d'applications pédagogiques par l'IA pour les enseignantes et enseignants du primaire — Province de Mediouna.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakarta.variable} ${fraunces.variable} ${ibmArabic.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#0B1426] text-slate-900 antialiased selection:bg-teal-500/20 selection:text-teal-900">
        {children}
      </body>
    </html>
  );
}
