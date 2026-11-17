import { APIError } from "payload";
import type { Access, CollectionConfig, Field, PayloadRequest } from "payload";
import { isPageKey, pageRoutes, pageTemplates } from "@/data/cms-pages";
import { safeLink, validatePage } from "@/lib/cms/fields";

const admin = ({ req }: { req: PayloadRequest }) => Boolean(req.user);
const published: Access = ({ req }) => req.user ? true : { _status: { equals: "published" } };
const edits = { create: admin, update: admin, delete: admin, readVersions: admin };
const versions = { drafts: true, maxPerDoc: 25 };
const preview = (path: string) => "/cms/preview?path=" + encodeURIComponent(path);
const safeURL = (value: string | null | undefined) => !value || safeLink(value) || "Use an internal path or an HTTPS URL.";
const text = (name: string, required = true): Field => ({ name, type: "text", required });
const paragraph = (name: string, required = true): Field => ({ name, type: "textarea", required });
const link = (name: string): Field => ({ name, type: "group", fields: [text("label"), { name: "href", type: "text", required: true, validate: safeURL }] });
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugValue = (value: string | null | undefined) => !value || (value.length <= 140 && slugPattern.test(value)) || "Use lowercase words separated by hyphens.";

async function refresh(req: PayloadRequest) {
  if (req.context.seed) return;
  const { revalidatePath, revalidateTag } = await import("next/cache");
  revalidateTag("basenote-content", { expire: 0 });
  revalidatePath("/", "layout");
}
const hooks: CollectionConfig["hooks"] = {
  afterChange: [async ({ req, doc }) => { await refresh(req); return doc; }],
  afterDelete: [async ({ req }) => { await refresh(req); }]
};

export const Admins: CollectionConfig = {
  slug: "admins", admin: { useAsTitle: "email", group: "Settings" },
  auth: { maxLoginAttempts: 8, lockTime: 600000, tokenExpiration: 7200, cookies: { sameSite: "Lax" } },
  access: { admin, read: admin, create: admin, update: admin, delete: ({ req }) => req.user ? { id: { not_equals: req.user.id } } : false },
  endpoints: [{ path: "/runtime", method: "get", handler: req => req.user ? Response.json({ node: process.version }, { headers: { "Cache-Control": "private, no-store" } }) : new Response(null, { status: 403 }) }],
  fields: []
};

export const Pages: CollectionConfig = {
  slug: "pages", labels: { singular: "Site page", plural: "Site pages" },
  admin: {
    useAsTitle: "title", defaultColumns: ["title", "_status", "updatedAt"], group: "Website",
    preview: (doc) => typeof doc.key === "string" && isPageKey(doc.key) ? preview(pageRoutes[doc.key].path) : null
  },
  access: { ...edits, read: published, create: () => false, delete: () => false },
  versions, hooks: { ...hooks, beforeValidate: [({ data, originalDoc, operation }) => {
    if (operation === "update" && data && originalDoc?.key) return { ...data, key: originalDoc.key, title: originalDoc.title };
    return data;
  }], beforeChange: [({ data, originalDoc }) => {
    const key = data.key ?? originalDoc?.key;
    if (data.copy && isPageKey(key) && data._status === "published") data.copy = validatePage(pageTemplates[key], data.copy);
    return data;
  }] },
  fields: [
    { name: "key", type: "text", required: true, unique: true, admin: { hidden: true } },
    { name: "title", type: "text", required: true, admin: { hidden: true } },
    { name: "copy", type: "json", required: true, admin: { components: { Field: "/components/cms/PageFields#PageFields" } },
      validate: (value, { data }) => {
        const key = (data as { key?: string }).key;
        if (!key || !isPageKey(key)) return "Choose an existing page.";
        try { validatePage(pageTemplates[key], value); return true; } catch (error) { return error instanceof Error ? error.message : "Check the page fields."; }
      } }
  ]
};

export const Articles: CollectionConfig = {
  slug: "articles", labels: { singular: "Article or case study", plural: "Articles and case studies" },
  admin: { useAsTitle: "title", group: "Website", defaultColumns: ["title", "section", "_status", "updatedAt"],
    preview: (doc) => doc.section && doc.slug ? preview("/" + doc.section + "/" + doc.slug) : null },
  versions, access: { ...edits, read: published },
  hooks: { ...hooks, beforeValidate: [({ data, originalDoc }) => {
    if (!data) return data;
    if (originalDoc && (originalDoc._status === "published" || originalDoc.lockedPath)) {
      data.section = originalDoc.section;
      data.slug = originalDoc.slug;
    }
    if (data._status === "published") data.lockedPath = true;
    return data;
  }] },
  indexes: [{ fields: ["section", "slug"], unique: true }],
  fields: [
    text("title"),
    { name: "section", type: "select", defaultValue: "blogs", required: true, options: [{ label: "Journal", value: "blogs" }, { label: "Case studies", value: "case-studies" }] },
    { name: "slug", type: "text", required: true, validate: slugValue, admin: { description: "The address becomes permanent on first publication." } },
    { name: "lockedPath", type: "checkbox", admin: { hidden: true }, access: { update: () => false } },
    text("topic"), paragraph("description"), { name: "published", label: "Publication date", type: "date", required: true, defaultValue: () => new Date().toISOString() },
    { name: "cover", type: "upload", relationTo: "media", required: true },
    { name: "coverAlt", label: "Cover alt text override", type: "text" }, paragraph("introduction"),
    { name: "sections", type: "array", minRows: 1, required: true, fields: [
      text("heading"), { name: "anchor", type: "text", required: true, validate: slugValue },
      { name: "paragraphs", type: "textarea", required: true, admin: { description: "Leave a blank line between paragraphs." } },
      { name: "checklist", type: "textarea", admin: { description: "One item per line." } },
      { name: "figure", type: "upload", relationTo: "media" }, text("caption", false), text("figureAlt", false),
      { name: "links", type: "array", fields: [text("label"), { name: "href", type: "text", required: true, validate: safeURL }] }
    ] }, link("product"), link("enquiry"),
    { name: "position", type: "number", defaultValue: 0, admin: { description: "For articles with the same publication date, lower numbers appear first." } }
  ]
};

export const Media: CollectionConfig = {
  slug: "media", admin: { useAsTitle: "alt", group: "Website" },
  access: { ...edits, read: () => true, delete: () => false },
  upload: { disableLocalStorage: true, filesRequiredOnCreate: false, mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    adminThumbnail: ({ doc }) => typeof doc.sourcePath === "string" ? doc.sourcePath : String(doc.url || "") },
  hooks: { beforeChange: [({ req, operation, data }) => {
    if (operation === "create" && !req.context.seed && !req.file) throw new APIError("Choose an image file to upload.", 400);
    if (operation === "update" && req.file) throw new APIError("Upload the replacement as a new image so existing pages and revisions keep their artwork.", 400);
    return data;
  }], ...hooks },
  fields: [text("alt"), text("caption", false),
    { name: "sourcePath", type: "text", unique: true, admin: { readOnly: true }, access: { create: () => false, update: () => false } },
    { name: "sourceWidth", type: "number", admin: { hidden: true }, access: { update: () => false } },
    { name: "sourceHeight", type: "number", admin: { hidden: true }, access: { update: () => false } }
  ]
};
