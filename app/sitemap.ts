import type { MetadataRoute } from "next";

import { journalArticles } from "@/data/site-content";
import { PUBLIC_ROUTES, SITE_ORIGIN } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicationDates = new Map<string, string>(journalArticles.map((article) => [article.path, article.published]));
  return PUBLIC_ROUTES.map((route) => ({
    url: route === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${route}`,
    lastModified: publicationDates.get(route),
    changeFrequency: route === "/" || route === "/blogs" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/privacy-policy" || route === "/terms" ? 0.4 : 0.7
  }));
}
