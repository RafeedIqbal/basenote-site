import type { Metadata } from "next";
import { Lexend_Deca, Source_Serif_4, Space_Mono } from "next/font/google";
import Script from "next/script";

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

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
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
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "Basenote — Where Fragrance Meets Business"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Basenote Solutions — Fragrance Brand Consultancy",
    description:
      "Private label perfumes, brand creation, and AI-powered fragrance technology — built for founders, brands, and businesses ready to launch something that lasts.",
    images: ["/og.png"]
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
      className={`${sourceSerif.variable} ${lexendDeca.variable} ${spaceMono.variable}`}
    >
      <head>
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NWTC77JT');`}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NWTC77JT"
            height="0"
            width="0"
            title="Google Tag Manager"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <a href="#main-content" className="skipLink">
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
