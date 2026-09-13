import type { Metadata, Viewport } from "next";
import { Lexend_Deca, Source_Serif_4, Space_Mono } from "next/font/google";
import Script from "next/script";

import SmoothScroll from "@/components/SmoothScroll";
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
  keywords: [
    "private label perfume",
    "fragrance brand consultancy",
    "AI fragrance technology",
    "wholesale fragrance oils",
    "perfume brand development",
    SITE_NAME
  ],
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
