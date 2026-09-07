import PrivateLabelGuidePage from "@/components/private-label/PrivateLabelGuidePage";
import { privateLabelGuide } from "@/data/site-content";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: privateLabelGuide.metadata.title,
  description: privateLabelGuide.metadata.description,
  path: "/private-label/guide",
});

export default function Page() {
  return <PrivateLabelGuidePage />;
}
