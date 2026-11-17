import { SITE_ORIGIN } from "../lib/site-brand";
import type { PageKey } from "../data/cms-pages";
import type { Article, Page } from "../cms/payload-types";
import type { TextValues } from "../lib/cms/fields";
import { asArticle } from "../lib/cms/article";

export const hasDatabase = () => true;
export const session = async () => null;

// The secondary Worker reads the public Vercel API. Admin sessions and database credentials stay on Vercel.
async function read<T>(collection: string, query: string, page = 1): Promise<{ docs: T[]; hasNextPage: boolean }> {
  const res = await fetch(SITE_ORIGIN + "/api/" + collection + "?" + query + "&page=" + page);
  if (!res.ok) throw new Error("Published Basenote content is unavailable (" + res.status + ").");
  return res.json();
}
export async function readCopy(key: PageKey) {
  const result = await read<Page>("pages", "where[key][equals]=" + encodeURIComponent(key) + "&depth=0&limit=1");
  return result.docs[0]?.copy as TextValues | undefined ?? null;
}
export async function readPageKeys() {
  const result = await read<Page>("pages", "limit=100&depth=0&select[key]=true");
  return result.docs.map(page => page.key);
}
export async function readArticles() {
  const result = [];
  for (let page = 1; ; page++) {
    const batch = await read<Article>("articles", "depth=1&limit=60&sort=-published,position,id", page);
    for (const doc of batch.docs) {
      const article = asArticle(doc);
      if (article) result.push(article);
    }
    if (!batch.hasNextPage) break;
  }
  return result;
}
