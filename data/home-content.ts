export type NavItem = {
  href: string;
  label: string;
  number: string;
};

export type PortfolioImage = {
  alt: string;
  caption: string;
  src: string;
};

export type PortfolioProject = {
  category: string;
  id: string;
  images: [PortfolioImage, PortfolioImage];
  impact: string;
  summary: string;
  tags: string[];
  title: string;
};

export type ServicePillar = {
  bullets: string[];
  deliverables: string[];
  description: string;
  eyebrow: string;
  id: string;
  stat: string;
  subtitle: string;
  title: string;
};

export type ProcessStep = {
  description: string;
  step: string;
  title: string;
};

export type FaqItem = {
  answer: string;
  question: string;
};

type ReasonCard = {
  description: string;
  title: string;
};

export type HomePageContent = {
  contact: {
    email: string;
    heading: string;
    locations: string[];
    note: string;
    subcopy: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: FaqItem[];
    lede: string;
  };
  hero: {
    supporting: string;
    summary: string;
  };
  nav: NavItem[];
  opportunity: {
    lines: string[];
  };
  pillars: {
    eyebrow: string;
    heading: string;
    items: ServicePillar[];
    lede: string;
  };
  portfolio: {
    eyebrow: string;
    heading: string;
    lede: string;
    projects: PortfolioProject[];
  };
  process: {
    eyebrow: string;
    heading: string;
    lede: string;
    steps: ProcessStep[];
  };
  reasons: {
    eyebrow: string;
    heading: string;
    items: ReasonCard[];
    lede: string;
  };
};

const pillars: ServicePillar[] = [
  {
    id: "fragrance-development",
    stat: "01",
    eyebrow: "Pillar 01",
    title: "Fragrance development and manufacturing",
    subtitle: "Translate a concept into a fragrance people remember and reorder.",
    description:
      "We shape the scent brief, sampling pathway, packaging decisions, and production planning so the fragrance feels premium before it ever meets the market.",
    bullets: [
      "Creative scent briefing and olfactive positioning",
      "Sampling, refinement, and approval management",
      "Packaging coordination, compliance, and production support"
    ],
    deliverables: [
      "Fragrance brief and positioning narrative",
      "Sampling rounds with decision checkpoints",
      "Packaging and manufacturing coordination"
    ]
  },
  {
    id: "brand-creation",
    stat: "02",
    eyebrow: "Pillar 02",
    title: "Brand creation and marketing",
    subtitle: "Build a brand world that sells the scent before the first spray.",
    description:
      "From naming directions to launch storytelling, we develop the identity system, campaign language, and content guardrails that make a fragrance brand feel coherent and desirable.",
    bullets: [
      "Naming, verbal identity, and packaging direction",
      "Launch campaign concepts and channel planning",
      "Messaging systems for creators, founders, and teams"
    ],
    deliverables: [
      "Brand narrative and creative territory",
      "Launch messaging toolkit",
      "Campaign and content direction"
    ]
  },
  {
    id: "digital-infrastructure",
    stat: "03",
    eyebrow: "Pillar 03",
    title: "Digital infrastructure and launch systems",
    subtitle: "Create the storefront, funnel, and operating layer behind the launch.",
    description:
      "We design the digital touchpoints that support launch momentum, from landing pages and product storytelling to CRM capture and conversion-ready site structure.",
    bullets: [
      "Launch pages and ecommerce-ready architecture",
      "Lead capture, CRM hooks, and performance basics",
      "Digital systems that keep launch assets organised"
    ],
    deliverables: [
      "Launch landing page or storefront direction",
      "Email capture and audience flow planning",
      "Asset system for launch operations"
    ]
  },
  {
    id: "founder-strategy",
    stat: "04",
    eyebrow: "Pillar 04",
    title: "Commercial strategy and founder support",
    subtitle:
      "Turn launch ambition into a commercial plan.",
    description:
      "We connect the product and brand work to commercial decisions so creators and founders have a clearer route from concept to launch timing, sequencing, and sell-through.",
    bullets: [
      "Offer design, launch sequencing, and channel priorities",
      "Founder decision support across pricing and packaging choices",
      "Launch roadmap alignment across product, brand, and digital"
    ],
    deliverables: [
      "Commercial launch roadmap",
      "Priority decisions and milestone planning",
      "Cross-functional launch support"
    ]
  }
];

export const homePageContent: HomePageContent = {
  nav: [
    { number: "01", label: "Home", href: "#home" },
    { number: "02", label: "Opportunity", href: "#opportunity" },
    { number: "03", label: "Portfolio", href: "#portfolio" },
    { number: "04", label: "What We Do", href: "#what-we-do" },
    { number: "05", label: "Services", href: "#services" },
    { number: "06", label: "Process", href: "#process" },
    { number: "07", label: "Why Basenote", href: "#why-basenote" },
    { number: "08", label: "FAQ", href: "#faq" },
    { number: "09", label: "Contact", href: "#contact" }
  ],
  hero: {
    summary:
      "Designing and launching fragrance brands through scent, craft, and strategy.",
    supporting:
      "From formulation and packaging to creative direction and launch infrastructure, Basenote helps creators, athletes, founders, and operators turn an idea into a fragrance brand with momentum."
  },
  opportunity: {
    lines: [
      "The fragrance industry is evolving.",
      "Creators and entrepreneurs are launching their own perfume brands."
    ]
  },
  portfolio: {
    eyebrow: "Portfolio",
    heading: "Representative launch directions and partnership formats.",
    lede:
      "Examples of how Basenote partners with creators, athletes, and founders to take fragrance concepts from brief to market.",
    projects: [
      {
        id: "aurum-atelier",
        title: "Aurum Atelier",
        category: "Influencer launch",
        summary:
          "A prestige-coded fragrance launch for a beauty creator moving from audience trust to product authority, with a rich amber scent profile and editorial brand world.",
        impact: "Scaled from audience launch to repeat-purchase fragrance demand",
        tags: ["Influencer", "Brand", "Strategy"],
        images: [
          {
            src: "/portfolio/aurum-bottle.svg",
            alt: "Amber fragrance bottle illustration for Aurum Atelier",
            caption: "Product view"
          },
          {
            src: "/portfolio/aurum-creator.svg",
            alt: "Creator portrait illustration for Aurum Atelier",
            caption: "Creator view"
          }
        ]
      },
      {
        id: "velocity-club",
        title: "Velocity Club",
        category: "Sports capsule",
        summary:
          "A high-energy athlete capsule built around performance identity, bold visual language, and a launch system that bridges limited drop culture with repeat purchase intent.",
        impact: "Sold through the opening drop and unlocked retail follow-up",
        tags: ["Sports", "Launch", "Digital"],
        images: [
          {
            src: "/portfolio/velocity-bottle.svg",
            alt: "Electric blue fragrance bottle illustration for Velocity Club",
            caption: "Product view"
          },
          {
            src: "/portfolio/velocity-athlete.svg",
            alt: "Athlete portrait illustration for Velocity Club",
            caption: "Athlete view"
          }
        ]
      },
      {
        id: "studio-reserve",
        title: "Studio Reserve",
        category: "Founder incubation",
        summary:
          "A founder-led fragrance brand rooted in understated luxury, where scent development, packaging, ecommerce direction, and launch sequencing need to move as one system.",
        impact: "Built a premium DTC foundation before first production scale-up",
        tags: ["Entrepreneur", "Brand", "Operations"],
        images: [
          {
            src: "/portfolio/studio-bottle.svg",
            alt: "Minimal fragrance bottle illustration for Studio Reserve",
            caption: "Product view"
          },
          {
            src: "/portfolio/studio-founder.svg",
            alt: "Founder portrait illustration for Studio Reserve",
            caption: "Founder view"
          }
        ]
      }
    ]
  },
  pillars: {
    eyebrow: "What We Do",
    heading: "We're trusted by industry leaders.",
    lede:
      "Basenote combines product development, brand direction, digital launch systems, and commercial planning in one integrated team.",
    items: pillars
  },
  process: {
    eyebrow: "The Process",
    heading: "A launch pathway built for speed, alignment, and decision clarity.",
    lede:
      "The process keeps creative and commercial decisions moving together, from discovery through development and launch readiness.",
    steps: [
      {
        step: "01",
        title: "Discovery call",
        description:
          "Define the launch ambition, audience, category angle, and commercial constraints before any product or design work begins."
      },
      {
        step: "02",
        title: "Scent development",
        description:
          "Shape the fragrance brief, sampling direction, and refinement criteria until the scent profile feels ownable and market-ready."
      },
      {
        step: "03",
        title: "Brand discovery and creation",
        description:
          "Develop naming, narrative, visual references, and a creative system that positions the brand with clarity."
      },
      {
        step: "04",
        title: "Manufacturing alignment",
        description:
          "Coordinate packaging direction, production decisions, compliance requirements, and timing expectations around the product."
      },
      {
        step: "05",
        title: "Digital setup",
        description:
          "Build the launch pages, audience capture flow, and key customer touchpoints that support conversion from day one."
      },
      {
        step: "06",
        title: "Launch",
        description:
          "Move into release mode with messaging, rollout sequencing, and support for the first wave of demand and feedback."
      }
    ]
  },
  reasons: {
    eyebrow: "Why Basenote",
    heading: "A tighter operating model for fragrance founders.",
    lede:
      "Basenote is designed for teams that need one partner to connect the product, brand, and launch stack instead of managing multiple fragmented vendors.",
    items: [
      {
        title: "End-to-end service",
        description:
          "Product development, brand creation, and launch systems are planned together so the customer experience feels coherent."
      },
      {
        title: "Industry expertise",
        description:
          "The work stays grounded in the realities of fragrance development, packaging, storytelling, and go-to-market timing."
      },
      {
        title: "Brand plus product support",
        description:
          "Basenote helps shape not just the fragrance itself, but the brand and infrastructure required to sell it with conviction."
      }
    ]
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Common questions from teams exploring a launch.",
    lede:
      "Answers below cover the first questions teams ask before starting a fragrance launch partnership.",
    items: [
      {
        question: "Who is Basenote Solutions for?",
        answer:
          "Basenote is positioned for creators, entrepreneurs, athletes, and emerging operators who want to launch a fragrance brand with joined-up support across product, brand, and launch execution."
      },
      {
        question: "Can you help before the scent is finalised?",
        answer:
          "Yes. Discovery, scent briefing, brand positioning, and launch planning are designed to start early so the fragrance and commercial direction can evolve together."
      },
      {
        question: "Do you only work on product development?",
        answer:
          "No. The model is intentionally broader than formulation. Basenote can support brand systems, launch storytelling, digital setup, and founder decision-making alongside the fragrance itself."
      },
      {
        question: "What does a first engagement usually include?",
        answer:
          "A first engagement typically begins with discovery, launch goals, scent direction, and a clear scope across the pillars that matter most for the project."
      },
      {
        question: "Can the support scale with different launch sizes?",
        answer:
          "Yes. The structure is meant to flex from focused launch sprints to broader end-to-end builds, depending on how much product, brand, and digital support the team needs."
      }
    ]
  },
  contact: {
    heading: "Ready to shape the next fragrance launch?",
    subcopy:
      "Start with a discovery conversation and map the product, brand, and launch requirements before committing to production.",
    note:
      "Typical response time is 1-2 business days. Include timeline, product stage, and current team setup.",
    email: "hello@basenotesolutions.com",
    locations: ["Remote-first", "Available worldwide"]
  }
};
