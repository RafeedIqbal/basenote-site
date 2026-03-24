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
    "Designing and launching fragrance brands through scent, craft, and strategy.",
  keywords: [
    "fragrance brand consultancy",
    "perfume brand development",
    "scent strategy",
    "fragrance launch",
    "Basenote Solutions"
  ],
  openGraph: {
    title: "Basenote Solutions — Fragrance Brand Consultancy",
    description:
      "Designing and launching fragrance brands through scent, craft, and strategy.",
    url: "/",
    siteName: "Basenote Solutions",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Basenote Solutions — Fragrance Brand Consultancy",
    description:
      "Designing and launching fragrance brands through scent, craft, and strategy."
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
