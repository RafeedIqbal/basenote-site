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
  { label: "About", href: "/about" }
];

export const stats = [
  { value: "$50B+", label: "Global market" },
  { value: "UAE", label: "Direct factory access" },
  { value: "4", label: "In-house capabilities" },
  { value: "1", label: "Partner, end to end" }
] as const;

export const barriers = [
  {
    title: "No factory access",
    description: "Manufacturing is gatekept behind relationships."
  },
  {
    title: "Capital & connections",
    description: "Traditional entry needs both, upfront."
  },
  {
    title: "No brand or tech in-house",
    description: "Product is only half the battle."
  }
] as const;

export const capabilities = [
  {
    title: "Direct UAE manufacturing",
    description: "Via TAC Perfumes — no middlemen."
  },
  {
    title: "Brand · Web · Tech",
    description: "Full identity and digital build."
  },
  {
    title: "AI fragrance tools",
    description: "Blend Engine & Alchemy Engine."
  }
] as const;

export const audienceLabels = [
  "Start-ups & New Brands",
  "Established Brands",
  "Influencers",
  "Corporate Clients",
  "Weddings & Events"
] as const;

export const services: ServiceCard[] = [
  {
    accent: "red",
    eyebrow: "01",
    title: "Private Label",
    description:
      "Your product, your brand — bottles, caps, packaging and bespoke fragrance, manufactured to spec in the UAE.",
    href: "/private-label"
  },
  {
    accent: "blue",
    eyebrow: "02",
    title: "Blend Engine",
    description:
      "Combine fragrance oils into market-ready perfumes with AI. Licensed as a subscription for labs, retailers and studios.",
    href: "/blend-engine"
  },
  {
    accent: "amber",
    eyebrow: "03",
    title: "Alchemy Engine",
    description:
      "The world’s first fragrance formulation AI — trained on proprietary chemistry to accelerate how perfumes are created.",
    href: "/alchemy-engine"
  }
];

export const audienceSegments = [
  {
    number: "01",
    title: "Start-Ups & New Brands",
    description:
      "You have an idea. We make it real — product to brand to market. Private label is the fastest way in."
  },
  {
    number: "02",
    title: "Established Brands",
    description:
      "A reliable manufacturing and tech partner who understands fragrance and won’t disrupt what you’ve built."
  },
  {
    number: "03",
    title: "Influencers & Personal Brands",
    description:
      "A signature fragrance turns audience trust into product. We handle creation to packaging."
  },
  {
    number: "04",
    title: "Corporate Clients",
    description:
      "Bespoke branded perfume as a corporate gift — more distinctive than standard merchandise."
  },
  {
    number: "05",
    title: "Weddings & Events",
    description:
      "Custom perfume favours with bespoke packaging — a keepsake guests actually keep."
  }
] as const;

export const processSteps = [
  {
    number: "1",
    title: "Get in Touch",
    description:
      "Tell us what you’re building — product, brand, or both. We’ll ask the right questions."
  },
  {
    number: "2",
    title: "We Scope It Together",
    description:
      "We map requirements, timeline and budget. No guesswork, no generic packages."
  },
  {
    number: "3",
    title: "We Build It",
    description:
      "Manufacturing, branding, tech — or all three. Our team and partners deliver."
  },
  {
    number: "4",
    title: "You Launch",
    description:
      "A product you own, a brand that works, and support for whatever comes next."
  }
] as const;

export const trustedBrands = [
  "Aurelia",
  "Noctis",
  "Maison V",
  "Étier",
  "Solace",
  "Vireo"
] as const;

export const blendBars = [
  { name: "Bergamot", percentage: 72 },
  { name: "Amber", percentage: 88 },
  { name: "Cedarwood", percentage: 54 },
  { name: "Musk", percentage: 66 }
] as const;

export const blendFeatures = [
  {
    title: "Guided Blending",
    description:
      "Combine oils with live feedback on balance, longevity and sillage."
  },
  {
    title: "Compliance Built In",
    description:
      "Flags regulatory limits before you commit to production."
  },
  {
    title: "Licence & Scale",
    description:
      "Monthly subscription with quarterly oil purchases — built for labs and retailers."
  }
] as const;

export const blogPosts: EditorialCard[] = [
  {
    category: "Blog",
    date: "May 2024",
    title: "The Art and Science of Fragrance",
    description:
      "A deep dive into the craftsmanship, innovation and raw materials that define modern perfumery.",
    image: "/media/basenote-handoff/editorial-1.png",
    href: "/blogs"
  },
  {
    category: "Blog",
    date: "Apr 2024",
    title: "Building a Brand From a Single Note",
    description:
      "How a signature accord becomes the backbone of an entire fragrance identity.",
    image: "/media/basenote-handoff/editorial-2.png",
    href: "/blogs"
  },
  {
    category: "Case Study",
    date: "Mar 2024",
    title: "Private Label, Start to Shelf",
    description:
      "Inside a full private-label launch delivered with TAC Perfumes.",
    image: "/media/basenote-handoff/editorial-3.png",
    href: "/case-studies"
  }
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
      { value: "5,000", label: "First run" }
    ]
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
      { value: "100%", label: "Owned brand" }
    ]
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
      { value: "-22%", label: "Cost per unit" }
    ]
  }
];

export const teamMembers = [
  {
    initial: "T",
    name: "Taseen Ahmed Choudhury",
    role: "Founder & CEO",
    description:
      "Entrepreneur across perfumery and tech. Founder of TAC Perfumes, Base Note Solutions and Arizmi Labs."
  },
  {
    initial: "A",
    name: "Amrit",
    role: "In-House Chemist",
    description:
      "UK-based fragrance chemist. Leads formulation data logging for the Alchemy Engine."
  },
  {
    initial: "M",
    name: "Mish",
    role: "Branding Lead",
    description:
      "Manages brand creation and visual identity for Base Note clients."
  },
  {
    initial: "R",
    name: "Rafeed",
    role: "Project Manager",
    description:
      "Day-to-day operations and the bridge between clients and the development team."
  }
] as const;

export const homeFaqs: FaqItem[] = [
  {
    question: "What is the minimum order quantity for private label?",
    answer:
      "MOQs vary depending on the product and packaging selected. Get in touch and we’ll confirm based on your brief."
  },
  {
    question: "Do you work with clients outside the UK?",
    answer:
      "Yes. We work with clients globally. Manufacturing is based in the UAE and we ship to multiple markets."
  },
  {
    question: "Can I order fragrance oils without a full private label order?",
    answer:
      "Yes. Wholesale fragrance oils are available independently. Contact us for pricing and volume options."
  },
  {
    question: "How long does a private label order take?",
    answer:
      "Timelines depend on complexity, volume and production schedules. We give an accurate lead time at scoping."
  },
  {
    question: "What’s the difference between Blend Engine and Alchemy Engine?",
    answer:
      "Blend Engine creates perfumes by combining existing oils — for labs, retailers and studios. Alchemy Engine is a deeper formulation AI for chemists, trained on proprietary chemical data."
  },
  {
    question: "Do you offer branding as a standalone service?",
    answer:
      "Yes. Branding, website and social setup can be taken independently or bundled with a private label order."
  }
];

export const footerGroups = [
  {
    title: "Services",
    links: [
      { label: "Private Label", href: "/private-label" },
      { label: "Wholesale Oils", href: "/contact?interest=Fragrance%20Oils" },
      { label: "Branding", href: "/contact?interest=Branding" },
      { label: "Consultancy", href: "/contact?interest=Consultancy" }
    ]
  },
  {
    title: "Technology",
    links: [
      { label: "Blend Engine", href: "/blend-engine" },
      { label: "Alchemy Engine", href: "/alchemy-engine" },
      { label: "Websites & ERP", href: "/contact?interest=Tech%20%26%20AI%20Products" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blogs", href: "/blogs" },
      { label: "Case Studies", href: "/case-studies" }
    ]
  }
] as const;

export const socialLinks = ["Instagram", "LinkedIn", "X", "YouTube"] as const;
