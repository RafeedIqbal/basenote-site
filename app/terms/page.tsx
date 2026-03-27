import LegalPage from "@/components/legal/LegalPage";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Terms",
  description:
    "Draft terms for the Basenote Solutions website, enquiry workflow, and general use of published content and materials.",
  path: "/terms"
});

const sections = [
  {
    title: "Use of the Website",
    body: [
      "This website is provided to share information about Basenote Solutions, our services, and our technology direction. You may browse, enquire, and reference the content for legitimate business evaluation purposes.",
      "You must not misuse the site, interfere with its operation, attempt to bypass any security or anti-spam controls, or use the contact workflow for fraudulent, unlawful, or abusive activity."
    ]
  },
  {
    title: "Service Information",
    body: [
      "Descriptions of services, products, partnerships, and technology are provided for general information and may evolve over time. Published content should not be treated as a binding offer, guaranteed scope, or final specification unless confirmed separately in writing.",
      "Lead times, availability, manufacturing terms, and project deliverables are always subject to scoping, operational capacity, and formal agreement."
    ]
  },
  {
    title: "Intellectual Property",
    body: [
      "Unless otherwise stated, the website design, copy, visual assets, and brand materials on this site belong to Basenote Solutions or are used with permission.",
      "You may not reproduce, republish, or commercially exploit site materials without prior written consent, except where limited copying is permitted by applicable law."
    ]
  },
  {
    title: "Liability and Draft Status",
    body: [
      "This draft terms page is intended for launch preparation and should be reviewed before being relied on as a final legal document. It does not replace a service agreement, manufacturing agreement, or project-specific statement of work.",
      "Before launch, this page should be updated with governing-law, limitation-of-liability, and dispute-resolution language appropriate to the business structure and jurisdictions involved."
    ]
  }
] as const;

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      intro="These draft terms outline the general rules for using the Basenote Solutions website and engaging with the information published here before any formal project agreement is signed."
      lastUpdated="March 28, 2026"
      sections={sections}
    />
  );
}
