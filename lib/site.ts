import type { Metadata } from "next";

export const SITE_NAME = "Basenote Solutions";
export const SITE_ORIGIN = "https://www.basenotesolutions.com";
export const SITE_DESCRIPTION =
  "Private label perfumes, brand creation, and AI-powered fragrance technology for founders, brands, and operators ready to launch with confidence.";

export const PUBLIC_ROUTES = [
  "/",
  "/about",
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
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description
    }
  };
}

export function getCurrentYear() {
  return new Date().getFullYear();
}
