import { BlogsPage } from "@/components/site/SitePages";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Fragrance Business Journal",
  description:
    "Guides to testing a perfume brand, comparing private label quotes, running a blending bar and managing factory production, with work from ALPAC London.",
  path: "/blogs"
});

export default function Page() {
  return <BlogsPage />;
}
