import { pageMetadata } from "@/lib/cms/public";
import { BlogsPage } from "@/components/site/SitePages";

export const generateMetadata = () => pageMetadata("journal");

export default function Page() {
  return <BlogsPage />;
}
