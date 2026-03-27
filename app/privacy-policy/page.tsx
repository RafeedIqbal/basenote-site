import LegalPage from "@/components/legal/LegalPage";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Draft privacy policy for Basenote Solutions covering enquiry submissions, operational communications, and website data handling.",
  path: "/privacy-policy"
});

const sections = [
  {
    title: "Information We Collect",
    body: [
      "When you contact Basenote Solutions, we may collect your name, email address, company or brand name, and the details you choose to share about your project or enquiry.",
      "We may also collect limited technical information required to protect the contact form from abuse, such as submission timing and basic request metadata needed for fraud prevention and delivery reliability."
    ]
  },
  {
    title: "How We Use Your Information",
    body: [
      "We use the information you submit to review enquiries, respond to requests, scope potential projects, and maintain an internal record of prospective client conversations.",
      "We do not use contact-form submissions for unrelated marketing campaigns without a clear lawful basis and an appropriate opt-in process."
    ]
  },
  {
    title: "Sharing and Storage",
    body: [
      "Enquiry details may be processed by our website hosting provider, email delivery tools, and the internal team members responsible for replying to your request. We limit access to people who need it for operational or commercial follow-up.",
      "We aim to retain enquiry records only for as long as reasonably necessary to manage communication, evaluate business opportunities, and meet legal or administrative requirements."
    ]
  },
  {
    title: "Your Rights",
    body: [
      "Depending on your jurisdiction, you may have rights to request access to, correction of, or deletion of personal information that we hold about you.",
      "This draft policy should be updated with the correct legal contact route and jurisdiction-specific language before the page is treated as final."
    ]
  }
] as const;

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This draft privacy policy explains the categories of information Basenote Solutions may collect through the website and how that information is used to respond to enquiries and support operations."
      lastUpdated="March 28, 2026"
      sections={sections}
    />
  );
}
