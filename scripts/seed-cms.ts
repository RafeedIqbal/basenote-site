import path from "node:path";
import sharp from "sharp";
import { getPayload } from "payload";
import config from "../payload.config";
import { pageRoutes, pageTemplates, type PageKey } from "../data/cms-pages";
import { journalArticles } from "../data/site-content";
import { contentFields } from "../lib/cms/fields";

if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) throw new Error("Supply the target database and Payload secret.");
process.env.DISABLE_PAYLOAD_HMR = "true";
const client = await getPayload({ config });
const context = { seed: true };
try {
  const { totalDocs: admins } = await client.count({ collection: "admins" });
  if (!admins) {
    const email = process.env.CMS_BOOTSTRAP_EMAIL, password = process.env.CMS_BOOTSTRAP_PASSWORD;
    if (!email || !password || password.length < 20) throw new Error("Supply the first admin email and a generated password of at least 20 characters.");
    await client.create({ collection: "admins", data: { email, password }, context });
  }

  const importKey = "basenote.initial-content.v1";
  if (!await client.kv.get(importKey)) {
    const assets = new Map<string, string>();
    function collect(input: unknown) {
      if (!input || typeof input !== "object") return;
      const item = input as Record<string, unknown>;
      if (typeof item.src === "string" && /^\/(?:media|assets)\/.+\.(?:png|jpe?g|webp|avif)$/i.test(item.src)) {
        assets.set(item.src, String(item.alt || path.basename(item.src)));
      }
      for (const value of Object.values(item)) collect(value);
    }
    collect(pageTemplates);
    collect(journalArticles);
    const existing = await client.find({ collection: "media", pagination: false, depth: 0, select: { sourcePath: true } });
    const media = new Map(existing.docs.map(doc => [doc.sourcePath, doc.id]));
    for (const [sourcePath, alt] of assets) {
      if (media.has(sourcePath)) continue;
      const { width, height } = await sharp(path.join("public", decodeURIComponent(sourcePath))).metadata();
      const created = await client.create({ collection: "media", data: { sourcePath, sourceWidth: width, sourceHeight: height, alt }, context });
      media.set(sourcePath, created.id);
    }
    for (const key of Object.keys(pageRoutes) as PageKey[]) {
      const where = { key: { equals: key } };
      if ((await client.find({ collection: "pages", where, draft: true, limit: 1 })).totalDocs) continue;
      const copy = Object.fromEntries(contentFields(pageTemplates[key]).map(field => [field.key, field.initial]));
      await client.create({ collection: "pages", data: { key, title: pageRoutes[key].label, copy, _status: "published" }, context });
    }
    for (const [position, article] of journalArticles.entries()) {
      const [, section, slug] = article.path.split("/");
      const existing = await client.find({ collection: "articles", where: { and: [{ slug: { equals: slug } }, { section: { equals: section } }] }, draft: true, limit: 1 });
      if (existing.totalDocs) continue;
      const cover = media.get(article.image.src);
      if (!cover) throw new Error("Missing cover for " + article.path);
      await client.create({ collection: "articles", context, data: {
        title: article.title, section: section === "blogs" ? "blogs" : "case-studies", slug, topic: article.topic, description: article.description,
        position, introduction: article.introduction, published: article.published, cover, coverAlt: article.image.alt,
        product: article.product, enquiry: article.enquiry, _status: "published",
        sections: article.sections.map(s => ({
          heading: s.heading, anchor: s.id, paragraphs: s.paragraphs.join("\n\n"), checklist: s.checklist?.join("\n"),
          figure: s.figure ? media.get(s.figure.src) : undefined, figureAlt: s.figure?.alt, caption: s.figure?.caption, links: s.links
        }))
      } });
    }
    await client.kv.set(importKey, true);
  }
  for (const collection of ["pages", "articles", "media", "admins"] as const) {
    console.log(collection, (await client.count({ collection })).totalDocs);
  }
} finally {
  await client.destroy();
}

// The Postgres adapter retains its reconnect listener after destroy(), as in the Payload CLI.
process.exit(0);
