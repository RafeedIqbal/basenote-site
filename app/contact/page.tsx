import { ContactLandingPage } from "@/components/site/SitePages";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Tell us what you're working on and we'll come back to you soon.",
  path: "/contact"
});

type ContactPageProps = {
  searchParams: Promise<{
    brief?: string | string[];
    interest?: string | string[];
  }>;
};

export default async function Contact({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const interest = typeof params.interest === "string" ? params.interest : undefined;
  const brief = typeof params.brief === "string" ? params.brief : undefined;

  return <ContactLandingPage defaultInterest={interest} defaultMessage={brief} />;
}
