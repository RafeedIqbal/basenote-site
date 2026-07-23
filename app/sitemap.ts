import type { MetadataRoute } from "next";

import { PUBLIC_ROUTES, SITE_ORIGIN } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_ROUTES.map((route) => ({
    url: route === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${route}`,
    lastModified,
    changeFrequency: route === "/" || route === "/blogs" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/privacy-policy" || route === "/terms" ? 0.4 : 0.7
  }));
}
