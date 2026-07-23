import type { Metadata } from "next";
import { LandingPage } from "@/components/site/SitePages";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Fragrance Brand Consultancy | ${SITE_NAME}`
  },
  description:
    "Private-label manufacturing, fragrance brand creation, and purpose-built fragrance technology connected by one team.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: `Fragrance Brand Consultancy | ${SITE_NAME}`,
    description:
      "Private-label manufacturing, fragrance brand creation, and purpose-built fragrance technology connected by one team.",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: ["/og.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: `Fragrance Brand Consultancy | ${SITE_NAME}`,
    description:
      "Private-label manufacturing, fragrance brand creation, and purpose-built fragrance technology connected by one team.",
    images: ["/og.png"]
  }
};

export default function Page() {
  return <LandingPage />;
}
