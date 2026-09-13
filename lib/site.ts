import type { Metadata } from "next";

export const SITE_NAME = "Basenote Solutions";
export const SITE_SHORT_NAME = "Basenote";
export const SITE_ORIGIN = "https://www.basenotesolutions.com";
export const SITE_TITLE = "Fragrance Brand Consultancy";
export const SITE_TAGLINE = "Where Fragrance Meets Business";
export const SITE_THEME_COLOR = "#000000";
export const SITE_DESCRIPTION =
  "Private-label manufacturing, fragrance brand creation, and purpose-built fragrance technology connected by one team.";
export const SITE_LOGO_SOURCE = "/media/basenote-handoff/logo-white.png";
export const SITE_LOGO = "/icons/icon-512.png";
export const SITE_SOCIAL_IMAGE = {
  // A new URL lets sharing services refresh the artwork after the rebrand.
  url: "/og.png?v=bn-1",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
  type: "image/png"
};

export const PUBLIC_ROUTES = [
  "/",
  "/private-label",
  "/private-label/guide",
  "/blend-engine",
  "/alchemy-engine",
  "/about",
  "/blogs",
  "/case-studies",
  "/contact",
  "/privacy-policy",
  "/terms"
] as const;

type PageMetadataInput = {
  description: string;
  path: (typeof PUBLIC_ROUTES)[number];
  title: string;
};

export function createPageMetadata({
  description,
  path,
  title
}: PageMetadataInput): Metadata {
  const pageTitle = `${title} | ${SITE_NAME}`;

  return {
    title: {
      absolute: pageTitle
    },
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title: pageTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [SITE_SOCIAL_IMAGE]
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [SITE_SOCIAL_IMAGE]
    }
  };
}

export function createSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: SITE_NAME,
        alternateName: SITE_SHORT_NAME,
        url: SITE_ORIGIN,
        description: SITE_DESCRIPTION,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_ORIGIN}${SITE_LOGO}`,
          width: 512,
          height: 512,
          caption: SITE_NAME
        }
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        name: SITE_NAME,
        alternateName: SITE_SHORT_NAME,
        url: SITE_ORIGIN,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${SITE_ORIGIN}/#organization` }
      }
    ]
  };
}

export function getCurrentYear() {
  return new Date().getFullYear();
}
