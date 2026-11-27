import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  IBM_Plex_Sans_Arabic,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#060B16",
};

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
  title: "AI Teacher Lab · Atelier Provincial de Mediouna | مختبر المعلم للذكاء الاصطناعي · مديونة",
  description:
    "Plateforme interactive bilingue (FR/AR) de partage d'expérience et de création d'applications pédagogiques par l'IA pour les enseignants du primaire — إقليم مديونة.",
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
      <body className="min-h-screen bg-navy-950 text-ivory-50 antialiased">
        {children}
      </body>
    </html>
  );
}
