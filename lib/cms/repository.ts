import { cache } from "react";
import { draftMode, headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import type { PageKey } from "@/data/cms-pages";
import type { TextValues } from "./fields";
import { asArticle } from "./article";

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);
export const session = cache(async () => {
  if (!(await draftMode()).isEnabled) return null;
  const client = await getPayload({ config });
  return (await client.auth({ headers: await headers() })).user;
});

export async function readCopy(key: PageKey, draft: boolean) {
  const client = await getPayload({ config });
  const result = await client.find({ collection: "pages", where: { key: { equals: key } }, draft, overrideAccess: draft, depth: 0, limit: 1 });
  return result.docs[0]?.copy as TextValues | undefined ?? null;
}
export async function readArticles(draft: boolean) {
  const client = await getPayload({ config });
  const articles = [];
  for (let page = 1; ; page++) {
    const result = await client.find({ collection: "articles", draft, overrideAccess: draft, depth: 1, limit: 60, page, sort: ["-published", "position", "id"] });
    for (const doc of result.docs) {
      const article = asArticle(doc);
      if (article) articles.push(article);
    }
    if (!result.hasNextPage) break;
  }
  return articles;
}

export async function readPageKeys() {
  const client = await getPayload({ config });
  const { docs } = await client.find({ collection: "pages", depth: 0, pagination: false, overrideAccess: false, select: { key: true } });
  return docs.map(page => page.key);
}
