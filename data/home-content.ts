export type NavItem = {
  href: string;
  isCta?: boolean;
  label: string;
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

export type ServiceItem = {
  description: string;
  id: string;
  subtitle: string;
  title: string;
};

export type TechProduct = {
  ctaLabel: string;
  description: string;
  id: string;
  tagline: string;
  title: string;
};

export type AudienceSegment = {
  description: string;
  id: string;
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

export type ReasonCard = {
  description: string;
  title: string;
};

export type FooterLink = {
  href: string;
  label: string;
};

export type HomePageContent = {
  audiences: {
    eyebrow: string;
    heading: string;
    items: AudienceSegment[];
    lede: string;
  };
  ctaBanner: {
    ctaLabel: string;
    heading: string;
    subheading: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: FaqItem[];
  };
  footer: {
    company: FooterLink[];
    services: FooterLink[];
    tagline: string;
    technology: FooterLink[];
  };
  hero: {
    ctaLabel: string;
    headline: string;
    secondaryCtaLabel: string;
    summary: string;
  };
  nav: NavItem[];
  opportunity: {
    headline: string;
    paragraphs: string[];
  };
  pillars: {
    eyebrow: string;
    heading: string;
    items: ServiceItem[];
    lede: string;
  };
  portfolio: {
    description: string;
    eyebrow: string;
    heading: string;
    placeholder: string;
    projects: PortfolioProject[];
    subheading: string;
  };
  process: {
    eyebrow: string;
    heading: string;
    steps: ProcessStep[];
  };
  reasons: {
    eyebrow: string;
    heading: string;
    items: ReasonCard[];
  };
  techProducts: {
    eyebrow: string;
    heading: string;
    items: TechProduct[];
    lede: string;
  };
};

export const homePageContent: HomePageContent = {
  nav: [
    { label: "What We Do", href: "#what-we-do" },
    { label: "Tech & AI", href: "#tech-ai" },
    { label: "Who We Work With", href: "#who-we-work-with" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Get in Touch", href: "/contact", isCta: true }
  ],
  hero: {
    headline: "Where Fragrance Meets Business",
    summary:
      "Private label perfumes, brand creation, and AI-powered fragrance technology — built for founders, brands, and businesses ready to launch something that lasts.",
    ctaLabel: "Get Started",
    secondaryCtaLabel: "Explore What We Do"
  },
  opportunity: {
    headline: "The Fragrance Industry Is Wide Open",
    paragraphs: [
      "The global fragrance market is worth over $50 billion — and it's still growing. But breaking in has always required connections, capital, and manufacturing access most people don't have.",
      "Base Note changes that.",
      "We combine direct access to a UAE-based manufacturing facility, in-house brand and tech capabilities, and AI tools that didn't exist five years ago. The result: a faster, smarter path from idea to shelf."
    ]
  },
  pillars: {
    eyebrow: "What We Do",
    heading: "Everything You Need to Build a Fragrance Brand",
    lede: "From your first product to a full brand rollout — we handle the parts that slow most people down.",
    items: [
      {
        id: "private-label",
        title: "Private Label",
        subtitle: "Create Your Product",
        description:
          "Choose from an extensive catalogue of bottles, caps, and packaging. We work with our manufacturing partner in the UAE to produce your bespoke fragrance — to your brief, at your volume."
      },
      {
        id: "branding",
        title: "Branding & Identity",
        subtitle: "Build Your Brand",
        description:
          "Logo, brand identity, website, and social setup. Whether you're starting from scratch or refreshing an existing brand, we build the visual and digital presence to match your product."
      },
      {
        id: "fragrance-oils",
        title: "Fragrance Oils",
        subtitle: "Source Direct",
        description:
          "Wholesale fragrance oils sold directly. High quality, competitive pricing, flexible volumes. Ideal for brands, manufacturers, and retailers."
      },
      {
        id: "consultancy",
        title: "Consultancy",
        subtitle: "Get Expert Advice",
        description:
          "Compliance, market entry, business setup, and expansion strategy. Fast, practical, and informed by real industry experience."
      }
    ]
  },
  techProducts: {
    eyebrow: "Tech & AI",
    heading: "Fragrance Technology for the Next Generation",
    lede: "We're building the tools the fragrance industry has always needed — and licensing them to those ready to use them.",
    items: [
      {
        id: "blend-engine",
        title: "Blend Engine",
        tagline: "Create. Blend. License.",
        description:
          "Our AI blending platform lets users combine fragrance oils to create unique, market-ready perfumes. License the technology as a monthly subscription and commit to quarterly oil purchases. Ideal for fragrance labs, retailers, and studios looking to offer a hands-on creation experience.",
        ctaLabel: "Enquire About Licensing"
      },
      {
        id: "alchemy-engine",
        title: "Alchemy Engine",
        tagline: "The World's First Fragrance Formulation AI",
        description:
          "Built on proprietary formulation data logged by our in-house chemist, Alchemy Engine is an AI model trained on the chemistry behind fragrance creation. Designed for chemists and fragrance houses — it will accelerate formulation, reduce trial and error, and deepen understanding of how ingredients interact at a molecular level. Alchemy Engine is currently in development. We're logging formulations, building the dataset, and preparing for early licensing partnerships.",
        ctaLabel: "Register Your Interest"
      },
      {
        id: "websites-erp",
        title: "Websites & ERP Software",
        tagline: "Built for Fragrance Operations",
        description:
          "Custom websites and inventory/ERP software built specifically for fragrance factories and warehouses. Developed by our tech team at Arizmi Labs.",
        ctaLabel: "Talk to Us"
      }
    ]
  },
  audiences: {
    eyebrow: "Who We Work With",
    heading: "Built for Founders, Brands, and Businesses",
    lede: "We work across the full spectrum — from first-time founders to established brands and corporate clients.",
    items: [
      {
        id: "startups",
        title: "Start-Ups & New Brands",
        description:
          "You have an idea. We help you make it real — from product to brand to market. Private label is the fastest way in, and we can take you all the way to a full brand launch."
      },
      {
        id: "established",
        title: "Established Perfume & Lifestyle Brands",
        description:
          "You already have a customer base. What you need is a reliable manufacturing and tech partner who understands how fragrance businesses work and won't disrupt what you've built."
      },
      {
        id: "influencers",
        title: "Influencers & Personal Brands",
        description:
          "Your audience already trusts you. A signature fragrance is one of the most personal and profitable ways to turn that into a product. We handle everything from creation to packaging."
      },
      {
        id: "corporate",
        title: "Corporate Clients",
        description:
          "Bespoke branded perfume as a corporate gift — more distinctive than standard merchandise, often tax-deductible, and genuinely memorable."
      },
      {
        id: "weddings",
        title: "Weddings & Events",
        description:
          "Custom perfume favours, paired with bespoke packaging and invitation card integration. A keepsake your guests will actually keep."
      }
    ]
  },
  reasons: {
    eyebrow: "Why Base Note",
    heading: "Why Work With Us",
    items: [
      {
        title: "Direct Manufacturing Access",
        description:
          "We work directly with TAC Perfumes, a UAE-based fragrance factory. No middlemen. Better pricing, faster timelines, full quality control."
      },
      {
        title: "End-to-End Capability",
        description:
          "Product, brand, website, tech. Most fragrance suppliers stop at the product. We don't."
      },
      {
        title: "AI Built In-House",
        description:
          "Our AI products are developed from real formulation data by real chemists — not generic tools dressed up in fragrance language."
      },
      {
        title: "A Team That Moves Fast",
        description:
          "We're founders, developers, and fragrance professionals. We operate lean and we move at pace."
      }
    ]
  },
  process: {
    eyebrow: "How It Works",
    heading: "From Enquiry to Launch",
    steps: [
      {
        step: "01",
        title: "Get in Touch",
        description:
          "Tell us what you're building — product, brand, or both. We'll ask the right questions."
      },
      {
        step: "02",
        title: "We Scope It Together",
        description:
          "We map out your requirements, timeline, and budget. No guesswork, no generic packages."
      },
      {
        step: "03",
        title: "We Build It",
        description:
          "Manufacturing, branding, tech — or all three. Our team and manufacturing partners deliver."
      },
      {
        step: "04",
        title: "You Launch",
        description:
          "With a product you own, a brand that works, and support for whatever comes next."
      }
    ]
  },
  portfolio: {
    eyebrow: "Portfolio",
    heading: "What We've Built",
    subheading: "In Association with TAC Perfumes",
    description:
      "Our work spans private label products, brand launches, and fragrance solutions across global markets — delivered in partnership with TAC Perfumes, our UAE-based manufacturing partner.",
    placeholder: "Client case study cards to be added.",
    projects: [
      {
        id: "private-label-launch",
        title: "Private Label Launch",
        category: "Product development",
        summary:
          "End-to-end private label fragrance created for a UK-based lifestyle brand — from scent brief to finished product, packaging, and delivery.",
        impact: "First production run delivered on schedule",
        tags: ["Private Label", "Packaging", "UAE"],
        images: [
          {
            src: "/portfolio/placeholder-1a.svg",
            alt: "Placeholder product image",
            caption: "Product view"
          },
          {
            src: "/portfolio/placeholder-1b.svg",
            alt: "Placeholder packaging image",
            caption: "Packaging view"
          }
        ]
      },
      {
        id: "brand-identity-build",
        title: "Brand Identity Build",
        category: "Branding & digital",
        summary:
          "Full brand identity, website, and social presence built for a new fragrance house entering the DTC market.",
        impact: "Brand launched with a cohesive digital presence from day one",
        tags: ["Branding", "Website", "Launch"],
        images: [
          {
            src: "/portfolio/placeholder-2a.svg",
            alt: "Placeholder brand identity image",
            caption: "Brand view"
          },
          {
            src: "/portfolio/placeholder-2b.svg",
            alt: "Placeholder website image",
            caption: "Digital view"
          }
        ]
      },
      {
        id: "wholesale-partnership",
        title: "Wholesale Oil Partnership",
        category: "Fragrance oils",
        summary:
          "Ongoing wholesale fragrance oil supply for a mid-size retailer — competitive pricing, flexible volumes, and reliable logistics from our UAE facility.",
        impact: "Recurring quarterly orders established",
        tags: ["Wholesale", "Oils", "Supply"],
        images: [
          {
            src: "/portfolio/placeholder-3a.svg",
            alt: "Placeholder oil bottles image",
            caption: "Product view"
          },
          {
            src: "/portfolio/placeholder-3b.svg",
            alt: "Placeholder warehouse image",
            caption: "Operations view"
          }
        ]
      }
    ]
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      {
        question: "What is the minimum order quantity for private label?",
        answer:
          "MOQs vary depending on the product and packaging selected. Get in touch and we'll confirm based on your brief."
      },
      {
        question: "Do you work with clients outside the UK?",
        answer:
          "Yes. We work with clients globally. Our manufacturing is based in the UAE and we have experience shipping to multiple markets."
      },
      {
        question:
          "Can I just order fragrance oils without a full private label order?",
        answer:
          "Yes. Wholesale fragrance oils are available independently. Contact us for pricing and volume options."
      },
      {
        question: "How long does a private label order take?",
        answer:
          "Timelines depend on order complexity, volume, and current production schedules. We'll give you an accurate lead time at the scoping stage."
      },
      {
        question:
          "What's the difference between Blend Engine and Alchemy Engine?",
        answer:
          "Blend Engine is for creating perfumes by combining existing oils — designed for labs, retailers, and studios. Alchemy Engine is a deeper formulation AI for chemists and fragrance houses, trained on proprietary chemical data."
      },
      {
        question: "Do you offer branding as a standalone service?",
        answer:
          "Yes. Branding, website, and social setup can be taken independently or bundled with a private label order."
      }
    ]
  },
  ctaBanner: {
    heading: "Ready to Build Something?",
    subheading:
      "Whether you need a product, a brand, or a technology partner — let's talk.",
    ctaLabel: "Get in Touch"
  },
  footer: {
    tagline: "Where Fragrance Meets Business",
    services: [
      { label: "Private Label", href: "#what-we-do" },
      { label: "Wholesale Oils", href: "#what-we-do" },
      { label: "Branding", href: "#what-we-do" },
      { label: "Consultancy", href: "#what-we-do" }
    ],
    technology: [
      { label: "Blend Engine", href: "#tech-ai" },
      { label: "Alchemy Engine", href: "#tech-ai" },
      { label: "Websites & ERP", href: "#tech-ai" }
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms", href: "#" }
    ]
  }
};
