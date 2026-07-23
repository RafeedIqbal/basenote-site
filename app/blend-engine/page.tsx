import { BlendEnginePage } from "@/components/site/SitePages";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Blend Engine",
  description:
    "A licensable guided fragrance-blending platform for studios, laboratories, and experience-led retailers.",
  path: "/blend-engine"
});

export default function Page() {
  return <BlendEnginePage />;
}
