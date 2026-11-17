import { pageMetadata } from "@/lib/cms/public";
import { CaseStudiesPage } from "@/components/site/SitePages";

export const generateMetadata = () => pageMetadata("work");

export default function Page() {
  return <CaseStudiesPage />;
}
