import type { Metadata } from "next";
import { IBM_Plex_Mono, Lexend_Deca, Source_Serif_4 } from "next/font/google";

import SmoothScroll from "@/components/SmoothScroll";
import { SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from "@/lib/site";

import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif"
});

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body"
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `Fragrance Brand Consultancy | ${SITE_NAME}`,
    template: "%s | Basenote Solutions"
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "private label perfume",
    "fragrance brand consultancy",
    "AI fragrance technology",
    "wholesale fragrance oils",
    "perfume brand development",
    "Basenote Solutions"
  ],
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Basenote Solutions — Fragrance Brand Consultancy",
    description:
      "Private label perfumes, brand creation, and AI-powered fragrance technology — built for founders, brands, and businesses ready to launch something that lasts."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${lexendDeca.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <a href="#main-content" className="skipLink">
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
