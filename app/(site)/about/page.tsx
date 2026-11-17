import { pageMetadata } from "@/lib/cms/public";
import { AboutPage } from "@/components/site/SitePages";

export const generateMetadata = () => pageMetadata("about");

export default function About() {
  return <AboutPage />;
}
