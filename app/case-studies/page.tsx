import { CaseStudiesPage } from "@/components/site/SitePages";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Case Studies",
  description:
    "Selected Basenote Solutions product, brand, and fragrance supply programmes.",
  path: "/case-studies"
});

export default function Page() {
  return <CaseStudiesPage />;
}
