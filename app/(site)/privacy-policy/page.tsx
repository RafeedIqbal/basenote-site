import { LegalPage } from "@/components/site/SitePages";
import { getPage, pageMetadata } from "@/lib/cms/public";

export const generateMetadata = () => pageMetadata("privacy");

export default async function Page() {
  return <LegalPage draft={false} {...await getPage("privacy")} />;
}
