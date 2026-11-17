import type { Metadata, Viewport } from "next";
import { Lexend_Deca, Source_Serif_4, Space_Mono } from "next/font/google";

import SmoothScroll from "@/components/SmoothScroll";
import PrivacyChoices from "@/components/site/PrivacyChoices";
import {
  createPageMetadata,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_THEME_COLOR,
  SITE_TITLE
} from "@/lib/site";

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

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  ...createPageMetadata({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    path: "/"
  }),
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_TITLE} | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-image-preview": "large" }
  }
};

export const viewport: Viewport = {
  themeColor: SITE_THEME_COLOR,
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${sourceSerif.variable} ${lexendDeca.variable} ${spaceMono.variable}`}
    >
      <body>
        <a href="#main-content" className="skipLink">
          Skip to content
        </a>
        <SmoothScroll />
        {children}
        <PrivacyChoices />
      </body>
    </html>
  );
}
