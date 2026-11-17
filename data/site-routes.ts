export const pageRoutes = {
  home: { label: "Homepage", path: "/" },
  "starter-kit": { label: "Starter Kit", path: "/starter-kit" },
  "private-label": { label: "Private Label", path: "/private-label" },
  guide: { label: "Private Label Guide", path: "/private-label/guide" },
  "blend-engine": { label: "Blend Engine", path: "/blend-engine" },
  "alchemy-engine": { label: "Alchemy Engine", path: "/alchemy-engine" },
  about: { label: "About", path: "/about" },
  journal: { label: "Journal index", path: "/blogs" },
  work: { label: "Case studies index", path: "/case-studies" },
  contact: { label: "Contact", path: "/contact" },
  privacy: { label: "Privacy Policy", path: "/privacy-policy" },
  terms: { label: "Terms", path: "/terms" },
  shared: { label: "Navigation and footer", path: "/" }
} as const;

export type PageKey = keyof typeof pageRoutes;
export const isPageKey = (value: string): value is PageKey => Object.hasOwn(pageRoutes, value);
