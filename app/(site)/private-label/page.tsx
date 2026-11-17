import { pageMetadata } from "@/lib/cms/public";
import PrivateLabelPage from "@/components/private-label/PrivateLabelPage";

export const generateMetadata = () => pageMetadata("private-label");

export default function Page() {
  return <PrivateLabelPage />;
}
