import { pageMetadata } from "@/lib/cms/public";
import { AlchemyEnginePage } from "@/components/site/SitePages";

export const generateMetadata = () => pageMetadata("alchemy-engine");

export default function Page() {
  return <AlchemyEnginePage />;
}
