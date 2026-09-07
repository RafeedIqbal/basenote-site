import PrivateLabelPage from "@/components/private-label/PrivateLabelPage";
import { privateLabel } from "@/data/site-content";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: privateLabel.metadata.title,
  description: privateLabel.metadata.description,
  path: "/private-label",
});

export default function Page() {
  return <PrivateLabelPage />;
}
