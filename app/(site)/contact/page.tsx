import { pageMetadata } from "@/lib/cms/public";
import { ContactLandingPage } from "@/components/site/SitePages";

export const generateMetadata = () => pageMetadata("contact");

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
