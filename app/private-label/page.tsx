import { PrivateLabelPage } from "@/components/site/SitePages";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Private Label Perfume",
  description:
    "Build a private-label fragrance with direct UAE manufacturing access, product guidance, packaging direction, and optional brand support.",
  path: "/private-label"
});

export default function Page() {
  return <PrivateLabelPage />;
}
