import { AlchemyEnginePage } from "@/components/site/SitePages";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Alchemy Engine",
  description:
    "Fragrance formulation intelligence in development for chemists and technical teams, grounded in proprietary chemistry data.",
  path: "/alchemy-engine"
});

export default function Page() {
  return <AlchemyEnginePage />;
}
