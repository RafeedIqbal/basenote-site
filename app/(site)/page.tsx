import { getPage, pageMetadata } from "@/lib/cms/public";
import LandingPage from "@/components/site/LandingPage";
import {
  createSiteStructuredData
} from "@/lib/site";

export const generateMetadata = () => pageMetadata("home");

export default async function Page() {
  const [home, shared] = await Promise.all([getPage("home"), getPage("shared")]);
  return (
    <>
      <script
        id="site-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createSiteStructuredData(home.metadata.description, shared.social)).replace(/</g, "\\u003c")
        }}
      />
      <LandingPage />
    </>
  );
}
