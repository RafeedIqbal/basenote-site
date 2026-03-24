import type { Metadata } from "next";
import { Antonio, IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";

import SmoothScroll from "@/components/SmoothScroll";

import "./globals.css";

const antonio = Antonio({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display"
});

const schibstedGrotesk = Schibsted_Grotesk({
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
  metadataBase: new URL("https://www.basenotesolutions.com"),
  alternates: {
    canonical: "/"
  },
  title: {
    default: "Basenote Solutions — Fragrance Brand Consultancy",
    template: "%s | Basenote Solutions"
  },
  description:
    "Private label perfumes, brand creation, and AI-powered fragrance technology — built for founders, brands, and businesses ready to launch something that lasts.",
  keywords: [
    "private label perfume",
    "fragrance brand consultancy",
    "AI fragrance technology",
    "wholesale fragrance oils",
    "perfume brand development",
    "Basenote Solutions"
  ],
  openGraph: {
    title: "Basenote Solutions — Fragrance Brand Consultancy",
    description:
      "Private label perfumes, brand creation, and AI-powered fragrance technology — built for founders, brands, and businesses ready to launch something that lasts.",
    url: "/",
    siteName: "Basenote Solutions",
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
      className={`${antonio.variable} ${schibstedGrotesk.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
