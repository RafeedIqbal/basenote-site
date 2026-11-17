import type { MetadataRoute } from "next";

import { getArticles, publicPagePaths } from "@/lib/cms/public";
import { SITE_ORIGIN } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [journalArticles, pages] = await Promise.all([getArticles(), publicPagePaths()]);
  const publicationDates = new Map<string, string>(journalArticles.map((article) => [article.path, article.published]));
  return [...pages, ...publicationDates.keys()].map((route) => ({
    url: route === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${route}`,
    lastModified: publicationDates.get(route),
    changeFrequency: route === "/" || route === "/blogs" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/privacy-policy" || route === "/terms" ? 0.4 : 0.7
  }));
}
