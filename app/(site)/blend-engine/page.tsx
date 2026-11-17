import { pageMetadata } from "@/lib/cms/public";
import { BlendEnginePage } from "@/components/site/SitePages";

export const generateMetadata = () => pageMetadata("blend-engine");

export default function Page() {
  return <BlendEnginePage />;
}
