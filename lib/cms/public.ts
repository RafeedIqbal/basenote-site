import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { hasDatabase, session, readCopy, readArticles, readPageKeys } from "@/lib/cms/repository";
import { pageRoutes, pageTemplates, type PageKey } from "@/data/cms-pages";
import { journalArticles } from "@/data/site-content";
import { applyText } from "./fields";
import { createPageMetadata } from "@/lib/site";

const publishedCopy = unstable_cache((key: PageKey) => readCopy(key, false), ["basenote-page-v1"], { tags: ["basenote-content"] });

export const getOptionalPage = cache(async <K extends PageKey>(key: K): Promise<(typeof pageTemplates)[K] | null> => {
  const template = pageTemplates[key];
  if (!hasDatabase()) return template;
  const values = await session() ? await readCopy(key, true) : await publishedCopy(key);
  if (!values && key !== "shared") return null;
  return values ? applyText(template, values) : template;
});

export const getPage = cache(async <K extends PageKey>(key: K) => await getOptionalPage(key) ?? notFound());
const publishedKeys = unstable_cache(readPageKeys, ["basenote-page-keys"], { tags: ["basenote-content"] });
export async function publicPagePaths() {
  const keys = hasDatabase() ? await publishedKeys() : Object.keys(pageRoutes);
  return Object.entries(pageRoutes).filter(([key]) => key !== "shared" && keys.includes(key)).map(([, page]) => page.path);
}

export async function pageMetadata(key: Exclude<PageKey, "shared">) {
  const { metadata } = await getPage(key);
  return createPageMetadata({ ...metadata, path: pageRoutes[key].path });
}

const publishedArticles = unstable_cache(() => readArticles(false), ["basenote-articles-v1"], { tags: ["basenote-content"] });
export const getArticles = cache(async () => !hasDatabase() ? journalArticles : await session() ? readArticles(true) : publishedArticles());
export const findArticle = cache(async (path: string) => (await getArticles()).find(article => article.path === path));

export const isDraftPreview = cache(async () => hasDatabase() && Boolean(await session()));
