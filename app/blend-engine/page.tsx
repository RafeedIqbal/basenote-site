import { BlendEnginePage } from "@/components/site/SitePages";
import { blendEngine } from "@/data/site-content";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Blend Engine | Retail Perfume Blending Software",
  description: blendEngine.metadata,
  path: "/blend-engine"
});

export default function Page() {
  return <BlendEnginePage />;
}
