import guideCatalogue from "./private-label-catalogue.json";
import guideOptions from "./private-label-options.json";

export type NavItem = {
  href: string;
  label: string;
};

export type FaqItem = {
  answer: string;
  question: string;
};

export type ServiceCard = {
  accent: "amber" | "blue" | "red";
  description: string;
  eyebrow: string;
  href: string;
  title: string;
};

export type EditorialCard = {
  category: string;
  date: string;
  description: string;
  href: string;
  image: string;
  title: string;
};

export type CaseStudy = EditorialCard & {
  metrics: ReadonlyArray<{
    label: string;
    value: string;
  }>;
};

export const navigation: NavItem[] = [
  { label: "Private Label", href: "/private-label" },
  { label: "Blend Engine", href: "/blend-engine" },
  { label: "Alchemy Engine", href: "/alchemy-engine" },
  { label: "About", href: "/about" },
];

export const stats = [
  { value: "$50B+", label: "Global market" },
  { value: "UAE", label: "Direct factory access" },
  { value: "4", label: "In-house capabilities" },
  { value: "1", label: "Partner, end to end" },
] as const;

export const barriers = [
  {
    title: "No factory access",
    description: "Manufacturing is gatekept behind relationships.",
  },
  {
    title: "Capital & connections",
    description: "Traditional entry needs both, upfront.",
  },
  {
    title: "No brand or tech in-house",
    description: "Product is only half the battle.",
  },
] as const;

export const capabilities = [
  {
    title: "Direct UAE manufacturing",
    description: "Via TAC Perfumes — no middlemen.",
  },
  {
    title: "Brand · Web · Tech",
    description: "Full identity and digital build.",
  },
  {
    title: "AI fragrance tools",
    description: "Blend Engine & Alchemy Engine.",
  },
] as const;

export const audienceLabels = [
  "Start-ups & New Brands",
  "Established Brands",
  "Influencers",
  "Corporate Clients",
  "Weddings & Events",
] as const;

export const services: ServiceCard[] = [
  {
    accent: "red",
    eyebrow: "01",
    title: "Private Label",
    description:
      "Your product, your brand — bottles, caps, packaging and bespoke fragrance, manufactured to spec in the UAE.",
    href: "/private-label",
  },
  {
    accent: "blue",
    eyebrow: "02",
    title: "Blend Engine",
    description:
      "Combine fragrance oils into market-ready perfumes with AI. Licensed as a subscription for labs, retailers and studios.",
    href: "/blend-engine",
  },
  {
    accent: "amber",
    eyebrow: "03",
    title: "Alchemy Engine",
    description:
      "The world’s first fragrance formulation AI — trained on proprietary chemistry to accelerate how perfumes are created.",
    href: "/alchemy-engine",
  },
];

export const audienceSegments = [
  {
    number: "01",
    title: "Start-Ups & New Brands",
    description:
      "You have an idea. We make it real — product to brand to market. Private label is the fastest way in.",
  },
  {
    number: "02",
    title: "Established Brands",
    description:
      "A reliable manufacturing and tech partner who understands fragrance and won’t disrupt what you’ve built.",
  },
  {
    number: "03",
    title: "Influencers & Personal Brands",
    description:
      "A signature fragrance turns audience trust into product. We handle creation to packaging.",
  },
  {
    number: "04",
    title: "Corporate Clients",
    description:
      "Bespoke branded perfume as a corporate gift — more distinctive than standard merchandise.",
  },
  {
    number: "05",
    title: "Weddings & Events",
    description:
      "Custom perfume favours with bespoke packaging — a keepsake guests actually keep.",
  },
] as const;

export const processSteps = [
  {
    number: "1",
    title: "Get in Touch",
    description:
      "Tell us what you’re building — product, brand, or both. We’ll ask the right questions.",
  },
  {
    number: "2",
    title: "We Scope It Together",
    description:
      "We map requirements, timeline and budget. No guesswork, no generic packages.",
  },
  {
    number: "3",
    title: "We Build It",
    description:
      "Manufacturing, branding, tech — or all three. Our team and partners deliver.",
  },
  {
    number: "4",
    title: "You Launch",
    description:
      "A product you own, a brand that works, and support for whatever comes next.",
  },
] as const;

export const trustedBrands = [
  "Aurelia",
  "Noctis",
  "Maison V",
  "Étier",
  "Solace",
  "Vireo",
] as const;

export const blendBars = [
  { name: "Bergamot", percentage: 72 },
  { name: "Amber", percentage: 88 },
  { name: "Cedarwood", percentage: 54 },
  { name: "Musk", percentage: 66 },
] as const;

export const blendFeatures = [
  {
    title: "Guided Blending",
    description:
      "Combine oils with live feedback on balance, longevity and sillage.",
  },
  {
    title: "Compliance Built In",
    description: "Flags regulatory limits before you commit to production.",
  },
  {
    title: "Licence & Scale",
    description:
      "Monthly subscription with quarterly oil purchases — built for labs and retailers.",
  },
] as const;

export const blogPosts: EditorialCard[] = [
  {
    category: "Blog",
    date: "May 2024",
    title: "The Art and Science of Fragrance",
    description:
      "A deep dive into the craftsmanship, innovation and raw materials that define modern perfumery.",
    image: "/media/basenote-handoff/editorial-1.png",
    href: "/blogs",
  },
  {
    category: "Blog",
    date: "Apr 2024",
    title: "Building a Brand From a Single Note",
    description:
      "How a signature accord becomes the backbone of an entire fragrance identity.",
    image: "/media/basenote-handoff/editorial-2.png",
    href: "/blogs",
  },
  {
    category: "Case Study",
    date: "Mar 2024",
    title: "Private Label, Start to Shelf",
    description:
      "Inside a full private-label launch delivered with TAC Perfumes.",
    image: "/media/basenote-handoff/editorial-3.png",
    href: "/case-studies",
  },
];

export const caseStudies: CaseStudy[] = [
  {
    category: "Private Label · Beauty",
    date: "",
    title: "From Idea to 5,000 Units",
    description:
      "A first-time founder taken from concept to a shelf-ready private-label line — bespoke fragrance, packaging and brand identity.",
    image: "/media/basenote-handoff/editorial-3.png",
    href: "/case-studies",
    metrics: [
      { value: "12 wk", label: "Idea to launch" },
      { value: "5,000", label: "First run" },
    ],
  },
  {
    category: "Brand + Tech",
    date: "",
    title: "A Signature Scent For A Creator",
    description:
      "Turning an influencer’s audience trust into a sell-out signature fragrance, end to end.",
    image: "/media/basenote-handoff/editorial-2.png",
    href: "/case-studies",
    metrics: [
      { value: "48h", label: "Sold out" },
      { value: "100%", label: "Owned brand" },
    ],
  },
  {
    category: "Wholesale",
    date: "",
    title: "Oils, Direct & At Volume",
    description:
      "Reliable direct-from-source fragrance oil supply for a growing multi-market retailer.",
    image: "/media/basenote-handoff/editorial-1.png",
    href: "/case-studies",
    metrics: [
      { value: "6", label: "Markets" },
      { value: "-22%", label: "Cost per unit" },
    ],
  },
];

export const teamMembers = [
  {
    initial: "T",
    name: "Taseen Ahmed Choudhury",
    role: "Founder & CEO",
    description:
      "Entrepreneur across perfumery and tech. Founder of TAC Perfumes, Base Note Solutions and Arizmi Labs.",
  },
  {
    initial: "A",
    name: "Amrit",
    role: "In-House Chemist",
    description:
      "UK-based fragrance chemist. Leads formulation data logging for the Alchemy Engine.",
  },
  {
    initial: "M",
    name: "Mish",
    role: "Branding Lead",
    description:
      "Manages brand creation and visual identity for Base Note clients.",
  },
  {
    initial: "R",
    name: "Rafeed",
    role: "Project Manager",
    description:
      "Day-to-day operations and the bridge between clients and the development team.",
  },
] as const;

export const homeFaqs: FaqItem[] = [
  {
    question: "What is the minimum order quantity for private label?",
    answer:
      "MOQs vary depending on the product and packaging selected. Get in touch and we’ll confirm based on your brief.",
  },
  {
    question: "Do you work with clients outside the UK?",
    answer:
      "Yes. We work with clients globally. Manufacturing is based in the UAE and we ship to multiple markets.",
  },
  {
    question: "Can I order fragrance oils without a full private label order?",
    answer:
      "Yes. Wholesale fragrance oils are available independently. Contact us for pricing and volume options.",
  },
  {
    question: "How long does a private label order take?",
    answer:
      "Timelines depend on complexity, volume and production schedules. We give an accurate lead time at scoping.",
  },
  {
    question: "What’s the difference between Blend Engine and Alchemy Engine?",
    answer:
      "Blend Engine creates perfumes by combining existing oils — for labs, retailers and studios. Alchemy Engine is a deeper formulation AI for chemists, trained on proprietary chemical data.",
  },
  {
    question: "Do you offer branding as a standalone service?",
    answer:
      "Yes. Branding, website and social setup can be taken independently or bundled with a private label order.",
  },
];

export const footerGroups = [
  {
    title: "Services",
    links: [
      { label: "Private Label", href: "/private-label" },
      { label: "Private Label Guide", href: "/private-label/guide" },
      { label: "Wholesale Oils", href: "/contact?interest=Fragrance%20Oils" },
      { label: "Branding", href: "/contact?interest=Branding" },
      { label: "Consultancy", href: "/contact?interest=Consultancy" },
    ],
  },
  {
    title: "Technology",
    links: [
      { label: "Blend Engine", href: "/blend-engine" },
      { label: "Alchemy Engine", href: "/alchemy-engine" },
      {
        label: "Websites & ERP",
        href: "/contact?interest=Tech%20%26%20AI%20Products",
      },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blogs", href: "/blogs" },
      { label: "Case Studies", href: "/case-studies" },
    ],
  },
] as const;

export const socialLinks = ["Instagram", "LinkedIn", "X", "YouTube"] as const;

export type PrivateLabelSegment = {
  number: string;
  title: string;
  description: string;
  expanded: string;
  bestFor: string | null;
};
export type PrivateLabelStage = {
  number: string;
  title: string;
  description: string;
};
export type PrivateLabelContent = {
  contactHref: string;
  guideHref: string;
  eyebrow: string;
  chat: string;
  hero: {
    title: string;
    description: string;
    primary: string;
    secondary: string;
    image: string;
    imageAlt: string;
    openImage: string;
    frames: string;
    preview: { image: string; width: number; height: number; columns: number };
    callouts: {
      id: "cap" | "oil" | "packaging" | "branding";
      label: string;
      text: [number, number];
      end: [number, number];
      mobileText: [number, number];
      mobileEnd: [number, number];
      reveal: number;
    }[];
  };
  portfolio: {
    label: string;
    slides: { name: string; image: string; alt: string }[];
  };
  audience: {
    title: string;
    bestForLabel: string;
    contact: string;
    learn: string;
    segments: PrivateLabelSegment[];
  };
  capabilities: {
    title: string;
    description: string;
    logo: string;
    logoAlt: string;
    selectionLabel: string;
    items: { label: string; icon: string }[];
  };
  journey: {
    title: string;
    stages: PrivateLabelStage[];
    cta: string;
    navigationLabel: string;
    scrollHint: string;
    swipeHint: string;
    keyboardHint: string;
  };
  featured: {
    enabled: boolean;
    title: string;
    video: string | null;
    poster: string;
    posterAlt: string;
    play: string;
    error: string;
  };
  commercial: { title: string; stats: { value: string; label: string }[] };
  guide: { title: string; description: string; cta: string; draft: boolean };
  faqTitle: string;
  final: { title: string; description: string; cta: string };
  metadata: { title: string; description: string; draft: boolean };
};

export const privateLabelFaqs: FaqItem[] = [
  {
    question: "How much does it cost to launch a fragrance?",
    answer:
      "Every project is different. As a guide, production typically starts from around 500 units, with indicative unit costs from around £20 per unit. Final cost depends on the fragrance, bottle, packaging, volume, shipping and delivery, and how much support you need.",
  },
  {
    question: "What is the MOQ?",
    answer:
      "Our typical minimum order is 500 units per fragrance, although this can vary depending on the product and components selected.",
  },
  {
    question: "How long does the process take?",
    answer:
      "A typical project takes around 8-12 weeks, although bespoke fragrance development, custom packaging or more complex projects can take longer.",
  },
  {
    question: "Do I need an existing fragrance?",
    answer:
      "No. You can come to us with a finished fragrance, a rough idea, or nothing more than a direction you want to explore.",
  },
  {
    question: "Can Basenote develop the fragrance?",
    answer:
      "Yes. We can develop the fragrance with you with our in-house chemist. We can also refine an existing direction, or work with a fragrance you already have.",
  },
  {
    question: "Can you source bottles and packaging?",
    answer:
      "Yes. We can support bottle selection, caps, pumps, decoration, packaging and production as part of the project.",
  },
  {
    question: "Can you help with branding?",
    answer:
      "Yes. We can support everything from positioning and storytelling through to visual identity, packaging, website and launch assets, depending on what you need.",
  },
  {
    question: "Can I provide my own components?",
    answer:
      "Yes. If you already have a bottle, packaging, fragrance or other components in place, we can build around them, subject to technical and production requirements.",
  },
  {
    question: "Who owns the fragrance?",
    answer:
      "That depends on how the fragrance is developed. Bespoke formulations, licensed fragrances and existing formulas can have different ownership arrangements. We’ll make this clear before development begins.",
  },
  {
    question: "Do you support international clients?",
    answer:
      "Yes. We work with clients internationally and can support projects across different markets.",
  },
  {
    question: "Can I order fragrance oils without a full private label order?",
    answer:
      "Yes. Private Label is not the only way to work with Basenote. We can also supply fragrance oils separately where that is what you need.",
  },
  {
    question: "Do you offer branding as a standalone service?",
    answer:
      "Yes. Branding and creative support can be scoped separately, whether you need positioning, identity, packaging or wider launch support.",
  },
];

export const privateLabel: PrivateLabelContent = {
  contactHref: "/contact?interest=Private%20Label",
  guideHref: "/private-label/guide",
  eyebrow: "Private Label",
  chat: "Let’s chat",
  hero: {
    title: "Launch your own fragrance",
    description:
      "From bespoke fragrance development and packaging to manufacturing and delivery, we handle the full private label process for you.",
    primary: "Start your fragrance",
    secondary: "Explore the process",
    image: "/media/private-label/hero/bottle-closed.webp",
    openImage: "/media/private-label/hero/bottle-open.webp",
    imageAlt: "A glowing fragrance bottle with its lid, atomizer and branding separated to reveal the fragrance oil and packaging",
    frames: "/media/private-label/hero",
    preview: { image: "/media/private-label/hero/scrub-preview.webp", width: 320, height: 180, columns: 11 },
    callouts: [
      { id: "cap", label: "Lid and atomizer", text: [0.685, 0.17], end: [0.672, 0.17], mobileText: [0.64, 0.03], mobileEnd: [0.74, 0.125], reveal: 0.50 },
      { id: "oil", label: "Fragrance oil", text: [0.71, 0.53], end: [0.697, 0.53], mobileText: [0.81, 0.49], mobileEnd: [0.79, 0.56], reveal: 0.62 },
      { id: "packaging", label: "Bottle and packaging", text: [0.68, 0.79], end: [0.667, 0.79], mobileText: [0.57, 0.91], mobileEnd: [0.74, 0.885], reveal: 0.70 },
      { id: "branding", label: "Branding and marketing", text: [0.218, 0.68], end: [0.231, 0.68], mobileText: [0.02, 0.88], mobileEnd: [0.22, 0.854], reveal: 0.57 },
    ],
  },
  portfolio: {
    label: "Private label portfolio",
    slides: [
      {
        name: "Firmino",
        image: "/media/private-label/portfolio/firmino.png",
        alt: "Firmino fragrance project",
      },
      {
        name: "Rizla",
        image: "/media/private-label/portfolio/rizla.png",
        alt: "Rizla fragrance project",
      },
      {
        name: "Fashion TV",
        image: "/media/private-label/portfolio/fashion-tv.png",
        alt: "Fashion TV fragrance project",
      },
      {
        name: "Ingrained Oil",
        image: "/media/private-label/portfolio/ingrained-oil.png",
        alt: "Ingrained Oil fragrance project",
      },
      {
        name: "ALPAC",
        image: "/media/private-label/portfolio/alpac.png",
        alt: "ALPAC fragrance project",
      },
    ],
  },
  audience: {
    title: "We work with",
    bestForLabel: "BEST FOR",
    contact: "Talk to us",
    learn: "Learn more",
    segments: [
      {
        number: "01",
        title: "Start-ups & new brands",
        description:
          "From first idea through to a finished fragrance ready for production.",
        expanded:
          "You do not need to arrive with a finished brief, formula or supply chain. We can help shape the concept, fragrance, product, packaging and route into production around the audience and price point you want to reach.",
        bestFor:
          "First-time founders · new fragrance brands · early-stage concepts",
      },
      {
        number: "02",
        title: "Established brands",
        description:
          "Launch a fragrance line without having to build the supply chain yourself.",
        expanded:
          "Add fragrance to an existing brand without having to manage fragrance houses, component suppliers and manufacturers separately. We can handle the full process or slot into the stages you need support with.",
        bestFor:
          "Brand extensions · new product lines · existing customer bases",
      },
      {
        number: "03",
        title: "Creators & influencers",
        description:
          "Develop a fragrance around your audience, identity or story.",
        expanded:
          "Turn your personal brand, community or creative direction into a fragrance product that feels genuinely connected to you. We can support everything from concept and storytelling through to fragrance development, packaging and production.",
        bestFor: "Creators · influencers · public figures · personal brands",
      },
      {
        number: "04",
        title: "Retailers & hospitality",
        description:
          "Create fragrance products for retail, spaces, gifting or customer experience.",
        expanded:
          "Develop fragrance products around your environment, audience or customer experience, from retail lines and signature scents to gifting and hospitality concepts. We can build around existing brand guidelines or develop the product direction with you.",
        bestFor: "Retailers · hotels · venues · hospitality groups",
      },
      {
        number: "05",
        title: "Corporate & private projects",
        description:
          "For campaigns, launches, gifting, events and bespoke commissions.",
        expanded:
          "Create fragrance for a specific moment, campaign or audience without needing to build a full fragrance brand around it. We can support focused projects, short runs and bespoke commissions with the same production and compliance standards.",
        bestFor: "Corporate gifting · events · campaigns · private commissions",
      },
      {
        number: "06",
        title: "Have something else in mind?",
        description: "Talk to us about what you’re looking to create.",
        expanded:
          "Not every fragrance brief fits neatly into a category. If you have a product idea, collaboration or unusual use case in mind, tell us what you are trying to achieve and we will work out the most practical route.",
        bestFor: null,
      },
    ],
  },
  capabilities: {
    title: "One partner. Every stage.",
    description:
      "Basenote brings the full fragrance process together, whether you need one partner from idea to launch or expert support at a specific stage.",
    logo: "/media/basenote-handoff/logo-white.png",
    logoAlt: "Basenote",
    selectionLabel: "Choose a capability",
    items: [
      {
        label: "Fragrance development",
        icon: "/media/private-label/capabilities/fragrance-development.png",
      },
      {
        label: "Packaging",
        icon: "/media/private-label/capabilities/packaging.png",
      },
      {
        label: "Sourcing",
        icon: "/media/private-label/capabilities/sourcing.png",
      },
      {
        label: "Branding",
        icon: "/media/private-label/capabilities/branding.png",
      },
      {
        label: "Compliance",
        icon: "/media/private-label/capabilities/compliance.png",
      },
      {
        label: "Production",
        icon: "/media/private-label/capabilities/production.png",
      },
      {
        label: "Strategy",
        icon: "/media/private-label/capabilities/strategy.png",
      },
      {
        label: "Website dev",
        icon: "/media/private-label/capabilities/website-dev.png",
      },
    ],
  },
  journey: {
    title: "From idea to market",
    navigationLabel: "Private label journey stages",
    scrollHint: "Scroll to explore",
    swipeHint: "Swipe to explore",
    keyboardHint:
      "Use the left and right arrow keys to explore the stages. Home returns to the first stage; End moves to the last.",
    stages: [
      {
        number: "01",
        title: "Idea",
        description:
          "Bring us the thought, reference or ambition. We’ll help shape what it could become.",
      },
      {
        number: "02",
        title: "Strategy",
        description:
          "Define the audience, positioning, price point and commercial direction.",
      },
      {
        number: "03",
        title: "Fragrance development",
        description:
          "Develop, sample and refine the scent until it’s ready for production.",
      },
      {
        number: "04",
        title: "Product design",
        description:
          "Choose the bottle, cap, decoration and finish around the brief and budget.",
      },
      {
        number: "05",
        title: "Packaging",
        description:
          "Develop the carton, inserts, print and finishes that complete the product.",
      },
      {
        number: "06",
        title: "Branding",
        description:
          "Build the story and identity, or work within the brand you already have.",
      },
      {
        number: "07",
        title: "Digital",
        description:
          "Create the website, ecommerce and digital assets needed to launch.",
      },
      {
        number: "08",
        title: "Production",
        description:
          "Move the approved product into filling, assembly, quality checks and packing.",
      },
      {
        number: "09",
        title: "Delivery",
        description:
          "Coordinate the finished stock from production to its final destination.",
      },
      {
        number: "10",
        title: "Marketing",
        description:
          "Plan the launch, content and campaigns that take the fragrance to market.",
      },
    ],
    cta: "Ready to get started?",
  },
  featured: {
    // Temporarily hide this section while keeping it available to restore.
    enabled: false,
    title: "Meet ALPAC.",
    // Enable playback once the project film is supplied.
    video: null,
    poster: "/media/private-label/portfolio/alpac.png",
    posterAlt: "ALPAC London Ewa fragrance",
    play: "Play the ALPAC film",
    error: "The film could not play. Please try again.",
  },
  commercial: {
    title: "What to expect",
    stats: [
      {
        value: "500 UNITS",
        label: "Typical minimum order",
      },
      {
        value: "8–12 WEEKS",
        label: "Typical lead time",
      },
      {
        value: "FROM £20 / UNIT",
        label: "Indicative unit cost",
      },
      {
        value: "BUILT AROUND YOU",
        label: "From focused support to full end-to-end delivery",
      },
    ],
  },
  guide: {
    title: "See how it all comes together",
    description:
      "From packaging and bottle selection to fragrance development, production and delivery, our Private Label Guide walks you through the decisions behind building your product.",
    cta: "Read the guide",
    draft: true,
  },
  faqTitle: "Frequently asked questions",
  final: {
    title: "Ready to make your fragrance?",
    description:
      "Tell us what you’re looking to create. We’ll talk through the idea, what you need from us and the best route forward. Even if you don’t have an idea yet, we’re here to help.",
    cta: "Book a call",
  },
  metadata: {
    title: "Private Label Perfume",
    description:
      "Launch your own fragrance with bespoke development, packaging, manufacturing and delivery, with support shaped around your project.",
    draft: true,
  },
};
export type GuideImage = { src: string; alt: string };
export type GuideCatalogueItem = GuideImage & { number: string };
export type GuideStep = {
  title: string;
  paragraphs: string[];
  points?: string[];
  note?: string;
};
export type PrivateLabelGuideChapter = {
  id: string;
  number: string;
  title: string;
  headline: string;
  paragraphs: string[];
};
export type PrivateLabelGuideContent = {
  title: string;
  introduction: string;
  back: string;
  contentsLabel: string;
  progressLabel: string;
  chapterLabel: string;
  metadata: { title: string; description: string };
  chapters: PrivateLabelGuideChapter[];
  elements: { title: string; subtitle: string; paragraphs: string[] }[];
  packaging: {
    optionsTitle: string;
    sizeTitle: string;
    sizes: string[];
    finishTitle: string;
    finishes: string[];
    paperTitle: string;
    paperImages: GuideImage[];
    rigidTitle: string;
    types: { title: string; images: GuideImage[] }[];
  };
  components: {
    catalogueNote: string;
    cap: { title: string; description: string; items: GuideCatalogueItem[] };
    bottle: { title: string; description: string; items: GuideCatalogueItem[] };
    sourcingTitle: string;
    sourcingDescription: string;
    finishTitle: string;
    finishDescription: string;
    finishes: { title: string; description: string; images: GuideImage[] }[];
  };
  fragrance: {
    routes: { title: string; subtitle: string; paragraphs: string[] }[];
    timelineTitle: string;
    steps: GuideStep[];
  };
  production: { steps: GuideStep[]; qualification: string };
  final: {
    primary: string;
    secondary: string;
    formTitle: string;
    detailsTitle: string;
    choicesTitle: string;
    notesTitle: string;
    submit: string;
    success: string;
  };
  formFields: {
    requiredHint: string;
    name: string;
    email: string;
    phone: string;
    spoken: string;
    choose: string;
    undecided: string;
    packaging: string;
    bottle: string;
    cap: string;
    finish: string;
    fragrance: string;
    notes: string;
    images: string;
    privacy: string;
  };
  labels: {
    jumpToReference: string;
    catalogueKeyboardHint: string;
    previousImage: string;
    nextImage: string;
    imageUnavailable: string;
    catalogueUnavailable: string;
    step: string;
    close: string;
    closeDrawer: string;
    sending: string;
    error: string;
    uploadHint: string;
    privacy: string;
  };
};

// Supplied Private Label Guide, Google Doc 1POnHMwxhE2u-1xX2zjPmrGs8CAZNbeXEDFqVfiEi4qo, 8 September 2026.
export const privateLabelGuide: PrivateLabelGuideContent = {
  title: "Everything you need to understand before creating your fragrance.",
  introduction:
    "From packaging and bottles to fragrance development, production and launch, this guide breaks the process down into simple decisions.",
  back: "Private Label",
  contentsLabel: "In this guide",
  progressLabel: "Reading progress",
  chapterLabel: "Chapter",
  metadata: {
    title: "Private Label Guide",
    description:
      "From packaging and bottles to fragrance development, production and launch, this guide breaks the process down into simple decisions.",
  },
  chapters: [
    {
      id: "start-here",
      number: "01",
      title: "Start here",
      headline: "Three elements bring the product together",
      paragraphs: [
        "Private label comes down to three things: packaging, bottle & cap, and fragrance. Get those right, and the rest becomes much easier to build.",
      ],
    },
    {
      id: "choose-your-packaging",
      number: "02",
      title: "Choose your packaging",
      headline: "Choose your packaging",
      paragraphs: [
        "There are two main routes or tiers: paper packaging or rigid packaging.",
        "The right choice depends on the product you’re building, how you want it to feel and where you want it to sit in the market.",
      ],
    },
    {
      id: "choose-your-bottle-cap",
      number: "03",
      title: "Choose your bottle & cap",
      headline: "Choose your bottle & cap",
      paragraphs: [
        "Start with the cap, then find the bottle that works around it. From there, coatings and finishes can completely change how the final product looks.",
        "Caps generally offer less room for customisation unless we move into custom moulds, so choosing the cap first can help avoid having to rework the bottle later. Bottles offer much more freedom through shape, coating, printing and labels.",
      ],
    },
    {
      id: "create-your-fragrance",
      number: "04",
      title: "Create your fragrance",
      headline: "Create your fragrance",
      paragraphs: [
        "There are two ways to approach the scent itself: start from an existing fragrance direction or formulate something bespoke.",
      ],
    },
    {
      id: "get-production-ready",
      number: "05",
      title: "Get production-ready",
      headline: "Get production-ready",
      paragraphs: [
        "Once the fragrance, bottle, cap and packaging are aligned, we can lock the specification, confirm the costs and prepare the product for manufacture.",
      ],
    },
    {
      id: "make-it-real",
      number: "06",
      title: "Make it real",
      headline: "Ready for the next step?",
      paragraphs: [
        "Whether you’re still exploring or already working through your options with us, send us what you’ve chosen and we’ll take it from there.",
      ],
    },
  ],
  elements: [
    {
      title: "Packaging",
      subtitle: "How the product is presented.",
      paragraphs: [
        "Packaging sets the tone before the bottle is even opened.",
        "Choose between paper and rigid formats, then refine the structure, inserts, print and finishes around the position you want the product to hold in the market.",
        "From understated and accessible to highly finished and premium, the packaging should support both the product and the price point.",
      ],
    },
    {
      title: "Bottle & cap",
      subtitle: "The physical shape of the product.",
      paragraphs: [
        "Choose the bottle size, weight and silhouette, then pair it with a cap that works technically and visually.",
        "The base components are only the starting point. Coatings, colour, printing, labels and decoration can completely change how the finished bottle feels.",
        "We’ll help you balance what looks right with what is practical to manufacture at your volume.",
      ],
    },
    {
      title: "Fragrance",
      subtitle: "Formulate the scent.",
      paragraphs: [
        "This is where you define what the fragrance actually smells like.",
        "Start with a direction, reference or idea, then develop it through sampling and refinement until the formula is ready for production.",
        "You can work from an existing fragrance direction or create something bespoke with a chemist, depending on the product you want to build, the market you’re entering and how distinctive you want the scent to be.",
      ],
    },
  ],
  packaging: {
    optionsTitle: "Customisation Options",
    sizeTitle: "Size / Shape options",
    sizes: ["Fully Custom", "Made-To-Measure"],
    finishTitle: "Finish Options",
    finishes: ["UV", "Spot UV", "Textured (Sanded)", "Foiling"],
    paperTitle: "Paper / Flat box with card insert",
    paperImages: guideOptions["Paper / Flat box with card insert"],
    rigidTitle: "Rigid box",
    types: [
      { title: "Two Part Hard box", images: guideOptions["Two Part Hard box"] },
      {
        title: "Foldable Rigid Box",
        images: guideOptions["Foldable Rigid Box"],
      },
    ],
  },
  components: {
    catalogueNote: "The catalogue lists one bottle as PB50- without a complete reference. If that is your choice, include its image with your project details.",
    cap: {
      title: "Start with the cap.",
      description:
        "Caps are one of the less flexible parts of the product, so it often makes sense to choose one first and build the bottle around it.",
      items: guideCatalogue.caps,
    },
    bottle: {
      title: "Then choose your bottle.",
      description:
        "Shape is only the starting point. Once you have the bottle, coatings, colour, printing and labels can completely change how it feels.",
      items: guideCatalogue.bottles,
    },
    sourcingTitle: "Can’t see what you’re looking for?",
    sourcingDescription:
      "The catalogue is a starting point, not a restriction. If you have another bottle or cap in mind, send us a reference and we can explore sourcing it.",
    finishTitle: "Choose your finish",
    finishDescription:
      "A clear bottle can become almost anything. Coating changes the colour, opacity, texture and overall feel of the finished product.",
    finishes: [
      {
        title: "Matte",
        description:
          "A smooth, non-reflective finish that gives the bottle a soft, understated and premium appearance.",
        images: guideOptions.Matte,
      },
      {
        title: "Frosting",
        description:
          "A translucent, diffused finish that gives glass a soft, misted appearance while partially obscuring the contents.",
        images: guideOptions.Frosting,
      },
      {
        title: "Metallic",
        description:
          "A reflective metal-like finish, such as gold or silver, that creates a polished and luxurious appearance.",
        images: guideOptions.Metallic,
      },
      {
        title: "Transparent",
        description:
          "A clear or tinted transparent finish that adds colour while allowing the glass and bottle contents to remain visible.",
        images: guideOptions.Transparent,
      },
      {
        title: "Gradient",
        description:
          "A finish where one colour smoothly transitions into another colour, shade or level of transparency across the bottle.",
        images: guideOptions.Gradient,
      },
      {
        title: "Jet",
        description:
          "A deep, highly opaque dark finish, typically jet black, that creates a bold, dramatic and premium look.",
        images: guideOptions.Jet,
      },
    ],
  },
  fragrance: {
    routes: [
      {
        title: "Inspired by",
        subtitle: "Start from a familiar direction",
        paragraphs: [
          "Use an existing fragrance as the reference point and develop a scent in a similar direction.",
          "This can be a quicker, more accessible route, but it gives you less opportunity to create something genuinely distinctive in a crowded market.",
        ],
      },
      {
        title: "Bespoke",
        subtitle: "Formulate something of your own",
        paragraphs: [
          "Work with a chemist to develop a fragrance around your brief, references and creative direction.",
          "You’ll sample and refine the scent until the formula is ready for production.",
          "Bespoke development takes more time and investment, but gives you a much stronger opportunity to create something that belongs to your brand.",
        ],
      },
    ],
    timelineTitle: "From idea to approved formula",
    steps: [
      {
        title: "Define the direction",
        paragraphs: [
          "Tell us what you want the fragrance to feel like, who it’s for and any references you already have.",
        ],
      },
      {
        title: "Choose your route",
        paragraphs: [
          "Start from an existing fragrance direction or develop something bespoke with a chemist.",
        ],
      },
      {
        title: "Develop the first samples",
        paragraphs: [
          "We translate the brief into fragrance samples for you to experience and compare.",
        ],
      },
      {
        title: "Review and refine",
        paragraphs: [
          "Tell us what’s working and what isn’t. We adjust the fragrance and develop the next iteration.",
        ],
      },
      {
        title: "Approve the fragrance",
        paragraphs: [
          "Once the scent is right, the final direction is signed off.",
        ],
      },
      {
        title: "Confirm the concentration",
        paragraphs: [
          "Lock the concentration and final fragrance specification ready for costing and production.",
        ],
      },
    ],
  },
  production: {
    steps: [
      {
        title: "Lock the specification",
        paragraphs: ["Bring the final decisions together:"],
        points: [
          "fragrance",
          "concentration",
          "bottle",
          "cap",
          "packaging",
          "decoration / finish",
        ],
      },
      {
        title: "Confirm quantities and cost",
        paragraphs: [
          "Once the specification is defined, Basenote can provide the final quotation.",
          "Costs will depend on the fragrance, components, packaging, finishes and order volume.",
        ],
        note: "Typical minimum order: 500 units per fragrance, depending on the product and components selected.",
      },
      {
        title: "Approve the final sample",
        paragraphs: [
          "A production-ready sample gives you the opportunity to see the elements working together before the full order moves ahead.",
          "Nothing goes into manufacture until the agreed sample is approved.",
        ],
      },
      {
        title: "Compliance and production checks",
        paragraphs: [
          "Before manufacture, the product needs to be checked against the relevant regulatory and production requirements.",
          "This is where Basenote handles the technical work behind the scenes so the finished product is ready for its intended market.",
        ],
      },
      {
        title: "Sign off the project",
        paragraphs: ["Once everything is agreed:"],
        points: [
          "final specification approved",
          "final quotation approved",
          "project plan agreed",
          "production timeline confirmed",
        ],
        note: "The project is then ready to move into manufacture.",
      },
      {
        title: "Production deposit",
        paragraphs: [
          "50% of the order value is invoiced before manufacture begins.",
        ],
      },
    ],
    qualification:
      "Figures are a guide. The typical minimum order is 500 units per fragrance and can vary with the product and components selected. Final cost depends on the fragrance, components, packaging, volume, shipping, delivery and level of support. Bespoke fragrance development, custom packaging and more complex projects can take longer.",
  },
  final: {
    primary: "Send us your choices",
    secondary: "New to Basenote? Book your 15-minute consultation",
    formTitle: "Your project details",
    detailsTitle: "Your details",
    choicesTitle: "What have you chosen so far?",
    notesTitle: "Anything else?",
    submit: "Submit my project details",
    success:
      "Got it. We’ll review your choices and come back to you with the next step.",
  },
  formFields: {
    requiredHint: "Fields marked * are required. Everything else is optional.",
    name: "Name",
    email: "Email",
    phone: "Phone / WhatsApp",
    spoken: "Have you already spoken to someone at Basenote?",
    choose: "Select one",
    undecided: "Not sure yet",
    packaging: "Packaging type",
    bottle: "Bottle reference",
    cap: "Cap reference",
    finish: "Finish",
    fragrance: "Fragrance route",
    notes: "Notes / references",
    images: "Upload images or inspiration if useful",
    privacy: "Privacy policy",
  },
  labels: {
    jumpToReference: "Go to reference",
    catalogueKeyboardHint: "Use the left and right arrow keys to explore references. Home and End jump to the first and last reference. Page Up and Page Down move by nine references.",
    previousImage: "Previous image",
    nextImage: "Next image",
    imageUnavailable: "Ask us to see the available options.",
    catalogueUnavailable: "Contact us to explore the full catalogue.",
    step: "Step",
    close: "Close form",
    closeDrawer: "Close details",
    sending: "Sending your project details…",
    error: "Something went wrong. Please try again.",
    uploadHint: "Up to 3 images (JPG, PNG or WebP), 3 MB in total.",
    privacy: "Your details are used to respond to your project enquiry.",
  },
};
