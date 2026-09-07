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
  };
  portfolio: {
    label: string;
    previous: string;
    next: string;
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
    items: string[];
  };
  journey: { title: string; stages: PrivateLabelStage[]; cta: string };
  featured: {
    title: string;
    video: string;
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
    image: "/media/basenote/private-label-hero.png",
    imageAlt: "Fragrance bottle with warm amber light",
  },
  portfolio: {
    label: "Private label portfolio",
    previous: "Previous project",
    next: "Next project",
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
    logo: "/assets/logo-icon-3d.svg",
    logoAlt: "Basenote",
    selectionLabel: "Choose a capability",
    items: [
      "Fragrance development",
      "Packaging",
      "Sourcing",
      "Branding",
      "Compliance",
      "Production",
      "Strategy",
      "Website dev",
    ],
  },
  journey: {
    title: "From idea to market",
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
    title: "Meet ALPAC.",
    video: "/media/hero-background2.mp4",
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
    title: "Your private label guide",
    description:
      "Explore the stages, practical considerations and support available as you shape your own fragrance.",
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
