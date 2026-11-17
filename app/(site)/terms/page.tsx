import { LegalPage } from "@/components/site/SitePages";
import { getPage, pageMetadata } from "@/lib/cms/public";

export const generateMetadata = () => pageMetadata("terms");

export default async function Page() {
  return <LegalPage {...await getPage("terms")} />;
}
