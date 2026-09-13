import type { MetadataRoute } from "next";

import { PUBLIC_ROUTES, SITE_ORIGIN } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: route === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${route}`,
    changeFrequency: route === "/" || route === "/blogs" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/privacy-policy" || route === "/terms" ? 0.4 : 0.7
  }));
}
