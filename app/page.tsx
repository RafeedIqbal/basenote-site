import { LandingPage } from "@/components/site/SitePages";
import {
  createPageMetadata,
  createSiteStructuredData,
  SITE_DESCRIPTION,
  SITE_TITLE
} from "@/lib/site";

export const metadata = createPageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/"
});

export default function Page() {
  return (
    <>
      <script
        id="site-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createSiteStructuredData()).replace(/</g, "\\u003c")
        }}
      />
      <LandingPage />
    </>
  );
}
