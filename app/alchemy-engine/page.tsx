import { AlchemyEnginePage } from "@/components/site/SitePages";
import { alchemyEngine } from "@/data/site-content";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Alchemy Engine | Perfume Manufacturing ERP & Formulation",
  description: alchemyEngine.metadata,
  path: "/alchemy-engine"
});

export default function Page() {
  return <AlchemyEnginePage />;
}
