import { BlogsPage } from "@/components/site/SitePages";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Blogs",
  description:
    "Practical notes on private-label fragrance, guided blending, brand operations, and fragrance technology.",
  path: "/blogs"
});

export default function Page() {
  return <BlogsPage />;
}
