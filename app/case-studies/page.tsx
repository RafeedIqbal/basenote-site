import { CaseStudiesPage } from "@/components/site/SitePages";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Fragrance Brand Case Studies",
  description:
    "Explore Basenote’s fragrance brand projects, including the packaging, launch strategy and Shopify storefront for ALPAC London’s limited perfume drops.",
  path: "/case-studies"
});

export default function Page() {
  return <CaseStudiesPage />;
}
