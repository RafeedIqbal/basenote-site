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
  image: string;
  title: string;
};

export type EditorialCard = {
  category: string;
  description: string;
  href?: string;
  image: string;
  title: string;
};

export type ProductMedia = {
  description: string;
  poster?: string;
  sources?: {
    mp4?: string;
    webm?: string;
  };
  status: "placeholder" | "video";
  title: string;
};

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Private Label", href: "/private-label" },
  { label: "Blend Engine", href: "/blend-engine" },
  { label: "Alchemy Engine", href: "/alchemy-engine" },
  { label: "About Us", href: "/about" },
  { label: "Blogs", href: "/blogs" },
  { label: "Case Studies", href: "/case-studies" }
];

export const services: ServiceCard[] = [
  {
    accent: "red",
    eyebrow: "Create your product",
    title: "Private Label",
    description:
      "Launch a market-ready fragrance without building a manufacturing supply chain from scratch.",
    href: "/private-label",
    image: "/media/basenote/private-label-feature.png"
  },
  {
    accent: "blue",
    eyebrow: "Create a customer experience",
    title: "Blend Engine",
    description:
      "Turn guided scent blending into a repeatable, licensable experience for studios, labs, and retailers.",
    href: "/blend-engine",
    image: "/media/basenote/blend-feature.png"
  },
  {
    accent: "amber",
    eyebrow: "Accelerate formulation",
    title: "Alchemy Engine",
    description:
      "Use AI trained on real fragrance chemistry to explore formulations with greater speed and clarity.",
    href: "/alchemy-engine",
    image: "/media/basenote/alchemy-feature.png"
  }
];

export const audienceSegments = [
  {
    title: "Founders",
    description: "A direct route from an early idea to a launch-ready fragrance brand."
  },
  {
    title: "Established brands",
    description: "Manufacturing, product, and technology support without disrupting what already works."
  },
  {
    title: "Retailers & studios",
    description: "Interactive fragrance experiences and dependable access to oils and production."
  },
  {
    title: "Fragrance houses",
    description: "Purpose-built tools for formulation teams and technical operators."
  },
  {
    title: "Corporate & events",
    description: "Distinctive bespoke fragrance programmes for gifting, weddings, and activations."
  }
] as const;

export const privateLabelFaqs: FaqItem[] = [
  {
    question: "What is the minimum order quantity?",
    answer:
      "Minimums depend on the bottle, packaging, and fragrance brief. We confirm the practical starting volume during consultation instead of forcing every project into one package."
  },
  {
    question: "Can you help with the brand as well as the product?",
    answer:
      "Yes. Naming, identity, packaging direction, websites, and launch materials can be scoped alongside manufacturing or as a separate workstream."
  },
  {
    question: "How long does a private-label project take?",
    answer:
      "Timelines vary with sampling, component availability, approvals, and order size. Once the brief is clear, we provide a staged schedule before production begins."
  },
  {
    question: "Can I source fragrance oils without a full launch package?",
    answer:
      "Yes. Wholesale fragrance oils are available independently for retailers, manufacturers, studios, and established brands."
  }
];

export const blendFaqs: FaqItem[] = [
  {
    question: "Who is Blend Engine designed for?",
    answer:
      "It is designed for fragrance studios, labs, retailers, and experience-led businesses that want to offer guided blending without building their own software."
  },
  {
    question: "How is the platform licensed?",
    answer:
      "Licensing is scoped around the number of locations, expected usage, onboarding needs, and fragrance-oil supply. We provide pricing after a short discovery call."
  },
  {
    question: "Does it replace a trained perfumer?",
    answer:
      "No. Blend Engine structures an experience around existing fragrance oils. It helps teams guide customers consistently while leaving expert product decisions with the operator."
  },
  {
    question: "Can it be adapted to our brand?",
    answer:
      "Branding, catalogue configuration, and operational setup can be tailored to fit the environment in which the experience will run."
  }
];

export const alchemyFaqs: FaqItem[] = [
  {
    question: "What makes Alchemy Engine different from Blend Engine?",
    answer:
      "Blend Engine combines existing oils for guided customer experiences. Alchemy Engine works deeper in the formulation process and is being trained on proprietary chemistry data."
  },
  {
    question: "Is Alchemy Engine available now?",
    answer:
      "Alchemy Engine is in active development. We are speaking with technical partners and formulation teams interested in early access and licensing."
  },
  {
    question: "Who is it being built for?",
    answer:
      "The primary audience is chemists, fragrance houses, laboratories, and technical teams that need a faster way to explore and understand formulations."
  },
  {
    question: "Can we register for an early demonstration?",
    answer:
      "Yes. Submit a short brief and we will follow up when a relevant demonstration or partnership conversation is available."
  }
];

export const blendMedia: ProductMedia = {
  status: "placeholder",
  title: "Blend Engine product walkthrough",
  description:
    "Product video placeholder — the final MP4/WebM walkthrough and caption file will be added when supplied."
};

export const alchemyMedia: ProductMedia = {
  status: "placeholder",
  title: "Alchemy Engine explainer",
  description:
    "Explainer video placeholder — the final MP4/WebM film, poster, and caption file will be added when supplied."
};

export const blogPosts: EditorialCard[] = [
  {
    category: "Private label",
    title: "What founders need before the first production conversation",
    description:
      "A practical look at product positioning, volume, packaging, and the decisions that make an initial manufacturing brief useful.",
    image: "/media/basenote/editorial-notebook.png"
  },
  {
    category: "Fragrance retail",
    title: "Why guided blending is becoming a stronger retail experience",
    description:
      "How structure, storytelling, and a well-designed oil catalogue can turn experimentation into a repeatable customer journey.",
    image: "/media/basenote/contact-still.png"
  },
  {
    category: "Technology",
    title: "Why formulation data matters for fragrance AI",
    description:
      "Useful fragrance technology begins with domain-specific data, careful logging, and an understanding of real formulation constraints.",
    image: "/media/basenote/fragrance-shelves.png"
  }
];

export const caseStudies: EditorialCard[] = [
  {
    category: "Private-label launch",
    title: "Studio Signature Launch",
    description:
      "A fragrance concept translated into a launch-ready product direction, packaging system, and founder-facing story.",
    image: "/media/basenote/private-label-bottle.png"
  },
  {
    category: "Brand identity",
    title: "Aurum Brand System",
    description:
      "A premium visual world designed to keep product, campaign, and ecommerce touchpoints working as one system.",
    image: "/media/basenote/editorial-notebook.png"
  },
  {
    category: "Supply partnership",
    title: "Velocity Supply Programme",
    description:
      "A clear supply and presentation framework for an operator preparing to scale a fragrance offer across channels.",
    image: "/media/basenote/manufacturing-line.png"
  }
];

export const teamMembers = [
  {
    name: "Taseen Ahmed Choudhury",
    role: "Founder & CEO",
    description:
      "Entrepreneur across perfumery and technology, connecting TAC Perfumes, Basenote Solutions, and Arizmi Labs."
  },
  {
    name: "Amrit",
    role: "In-house chemist",
    description:
      "Leads formulation research and the structured data work behind Alchemy Engine."
  },
  {
    name: "Mish",
    role: "Branding lead",
    description:
      "Shapes brand identity and creative direction for clients moving from product to market."
  },
  {
    name: "Rafeed",
    role: "Project manager",
    description:
      "Coordinates delivery and keeps clients, production partners, and the development team aligned."
  }
] as const;

export const footerGroups = [
  {
    title: "Services",
    links: [
      { label: "Private Label", href: "/private-label" },
      { label: "Blend Engine", href: "/blend-engine" },
      { label: "Alchemy Engine", href: "/alchemy-engine" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blogs", href: "/blogs" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Contact", href: "/contact" }
    ]
  }
] as const;
