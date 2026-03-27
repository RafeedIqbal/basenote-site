import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { homePageContent } from "@/data/home-content";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Fragrance Brand Consultancy | ${SITE_NAME}`
  },
  description:
    "Private label perfumes, brand strategy, and AI-powered fragrance technology for founders, brands, and operators ready to launch with confidence.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: `Fragrance Brand Consultancy | ${SITE_NAME}`,
    description:
      "Private label perfumes, brand strategy, and AI-powered fragrance technology for founders, brands, and operators ready to launch with confidence.",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `Fragrance Brand Consultancy | ${SITE_NAME}`,
    description:
      "Private label perfumes, brand strategy, and AI-powered fragrance technology for founders, brands, and operators ready to launch with confidence."
  }
};

export default function Page() {
  return <HomePage content={homePageContent} />;
}
