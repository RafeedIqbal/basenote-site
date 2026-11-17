import {
  alchemyEngine, blendEngine, footerGroups, homeFaqs, homePage, homePositioning,
  journalIntro, navigation, privateLabel, privateLabelFaqs, privateLabelGuide,
  services, socialLinks, starterKit, teamMembers, contactDetails
} from "@/data/site-content";
import { privacy, terms } from "@/data/legal";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/site-brand";

export { isPageKey, pageRoutes, type PageKey } from "@/data/site-routes";
import type { PageKey } from "@/data/site-routes";

export const pageTemplates = {
  home: {
    hero: { title: SITE_TAGLINE, ...homePage.hero },
    enquiry: homePage.enquiry, services: homePage.services, serviceCards: services,
    positioning: homePositioning, work: homePage.work,
    questions: { title: homePage.questions.title, guide: homePage.questions.guide, readingTitle: homePage.questions.readingTitle },
    faqs: homeFaqs, metadata: { title: SITE_TITLE, description: SITE_DESCRIPTION }
  },
  "starter-kit": {
    ...starterKit, optionsTitle: "Choose your Starter Kit", privateLabelLink: "Explore private label perfume manufacturing",
    metadata: { title: starterKit.title, description: starterKit.metadata }
  },
  "blend-engine": {
    ...blendEngine, eyebrow: "Tech & AI · Blend Engine",
    metadata: { title: "Blend Engine | Retail Perfume Blending Software", description: blendEngine.metadata }
  },
  "alchemy-engine": {
    ...alchemyEngine, eyebrow: "Alchemy Engine & Factory ERP",
    metadata: { title: "Alchemy Engine | Perfume Manufacturing ERP & Formulation", description: alchemyEngine.metadata }
  },
  "private-label": { ...privateLabel, faqs: privateLabelFaqs },
  guide: privateLabelGuide,
  about: {
    hero: { eyebrow: "About Base Note", title: "Tech People.", secondLine: "Fragrance Industry." },
    story: {
      introduction: "Base Note Solutions was built at the intersection of two worlds most companies don't connect — fragrance manufacturing and technology.",
      paragraphs: [
        "Founded by Taseen Ahmed Choudhury, Base Note draws on direct access to TAC Perfumes — a UAE-based fragrance factory — and a dedicated tech development team at Arizmi Labs.",
        "The result is a company that can take a client from raw idea to finished product to functioning brand, with AI tools being developed in parallel that will change how the industry works. We're a small team. We operate lean. And we're building something that hasn't been built before."
      ]
    },
    teamTitle: "The Team", team: teamMembers, metadata: { title: "About", description: "Meet the team behind Basenote Solutions and learn how fragrance manufacturing, brand building, and technology come together in our model." }
  },
  journal: { ...journalIntro, metadata: {
    title: "Fragrance Business Journal", description: "Guides to testing a perfume brand, comparing private label quotes, running a blending bar and managing factory production, with work from ALPAC London."
  } },
  work: {
    eyebrow: "Selected Work · In association with TAC Perfumes", title: "Case Studies",
    metadata: { title: "Fragrance Brand Case Studies", description: "Explore Basenote’s fragrance brand projects, including the packaging, launch strategy and Shopify storefront for ALPAC London’s limited perfume drops." }
  },
  contact: {
    title: "Let's Talk", introduction: "Tell us what you're working on and we'll come back to you within one business day.",
    booking: contactDetails.booking, emailLabel: contactDetails.emailLabel,
    metadata: { title: "Contact", description: "Tell us what you're working on and we'll come back to you soon." }
  },
  privacy, terms,
  shared: { navigation, footer: footerGroups, social: socialLinks, tagline: SITE_TAGLINE }
} satisfies Record<PageKey, object>;
