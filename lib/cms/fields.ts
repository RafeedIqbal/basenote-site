export type TextValues = Record<string, string>;
export type ContentField = { key: string; group: string; label: string; initial: string; kind: "text" | "link" | "image" };

const fixedKeys = new Set([
  "id", "slug", "number", "accent", "bounds", "featured", "preview", "frames", "openImage",
  "projectSlugs", "icon", "logo", "sizes", "emailFallbackPrefix", "servicesIntro"
]);

export function readable(value: string) {
  if (value === "src") return "Choose image";
  if (value === "alt") return "Alternative text";
  if (value === "href") return "Destination";
  const name = value.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("-", " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function contentFields(template: object): ContentField[] {
  const fields: ContentField[] = [];
  function visit(value: unknown, path: string[], labels: string[]) {
    const key = path.at(-1) ?? "";
    if (fixedKeys.has(key)) return;
    if (typeof value === "string") {
      // Animation atlases and diagrams have dimensions and coordinates coupled to the artwork.
      if ((key === "image" && path[0] === "hero" && typeof (template as { hero?: { frames?: string } }).hero?.frames === "string") || value.endsWith(".svg")) return;
      const kind = /href$/i.test(key) ? "link" : key === "src" ? "image" : "text";
      const group = labels.length === 1 ? "Overview" : labels[0];
      const label = (labels.length === 1 ? labels : labels.slice(1)).join(" / ");
      fields.push({ key: path.join("."), label, group: group === "Metadata" ? "Search and sharing" : group, initial: value, kind });
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        const name = item && typeof item === "object" && (item.name || item.title || item.heading || item.question);
        const label = name ? String(name) : "Item " + (i + 1);
        visit(item, [...path, String(i)], [...labels, label]);
      });
    } else if (value && typeof value === "object") {
      for (const [child, childValue] of Object.entries(value)) visit(childValue, [...path, child], [...labels, readable(child)]);
    }
  }
  visit(template, [], []);
  return fields;
}

export function applyText<T extends object>(template: T, values: TextValues): T {
  const result = structuredClone(template);
  for (const field of contentFields(template)) {
    const value = values[field.key];
    if (typeof value !== "string" || value === field.initial) continue;
    const keys = field.key.split(".");
    let target = result as Record<string, unknown>;
    for (const key of keys.slice(0, -1)) target = target[key] as Record<string, unknown>;
    target[keys[keys.length - 1]] = value;
  }
  return result;
}

export function safeLink(value: string) {
  if (/[\s\\]/u.test(value) || Array.from(value).some((c) => c.charCodeAt(0) < 32) || /%(?:5c|0[ad])/i.test(value)) return false;
  if (/^\/(?!\/)|^#[\w-]+$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}

export function safeImage(value: string) {
  return /^\/(?:media|assets)\/[a-zA-Z0-9_ /%.()-]+\.(?:webp|avif|png|jpe?g)$/i.test(value)
    && !value.includes("..") && !/%(?:2e|2f|5c|25)/i.test(value)
    || /^\/api\/media\/file\/[a-zA-Z0-9_%().-]+\.(?:png|webp|jpe?g|avif)$/i.test(value);
}

export function validatePage(template: object, input: unknown): TextValues {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Page fields could not be read.");
  const values: TextValues = {};
  for (const field of contentFields(template)) {
    const raw = (input as TextValues)[field.key] ?? field.initial;
    if (typeof raw !== "string" || raw.length > 16000 || (field.initial && !raw.trim())) throw new Error("Check " + field.group + " / " + field.label + ".");
    const value = raw.trim();
    if (value !== field.initial && ((field.kind === "link" && !safeLink(value)) || (field.kind === "image" && !safeImage(value)))) throw new Error("Choose a valid destination for " + field.label + ".");
    values[field.key] = value;
  }
  return values;
}
