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
  metadataBase: new URL("https://basenotesolutions.com"),
  title: {
    default: "Basenote Solutions",
    template: "%s | Basenote Solutions"
  },
  description:
    "Designing and launching fragrance brands through scent, craft, and strategy.",
  openGraph: {
    title: "Basenote Solutions",
    description:
      "Designing and launching fragrance brands through scent, craft, and strategy.",
    images: [
      {
        url: "/assets/logo-full.svg",
        width: 13378,
        height: 5849,
        alt: "Basenote Solutions logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Basenote Solutions",
    description:
      "Designing and launching fragrance brands through scent, craft, and strategy.",
    images: ["/assets/logo-full.svg"]
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
