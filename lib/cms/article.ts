import type { Article, Media } from "@/cms/payload-types";
import type { JournalArticle } from "@/data/site-content";

export const mediaSource = (media: Pick<Media, "sourcePath" | "filename">) =>
  media.sourcePath || (media.filename ? "/api/media/file/" + encodeURIComponent(media.filename) : "");

function image(media: number | Media | null | undefined, alt?: string | null) {
  if (!media || typeof media === "number") return null;
  return { src: mediaSource(media), alt: alt || media.alt, width: media.sourceWidth || media.width || 1200, height: media.sourceHeight || media.height || 800 };
}

export function asArticle(doc: Article): JournalArticle | null {
  const cover = image(doc.cover, doc.coverAlt);
  if (!cover || !doc.slug || !doc.title || !doc.published || !doc.product?.href || !doc.enquiry?.href) return null;
  return {
    path: `/${doc.section}/${doc.slug}`, title: doc.title, topic: doc.topic, description: doc.description,
    image: cover, published: doc.published.slice(0, 10), introduction: doc.introduction,
    product: doc.product, enquiry: doc.enquiry,
    sections: (doc.sections || []).map(section => {
      const figure = image(section.figure, section.figureAlt);
      return {
        id: section.anchor, heading: section.heading, paragraphs: (section.paragraphs || "").split(/\n\s*\n/).filter(Boolean),
        checklist: section.checklist?.split(/\r?\n/).filter(Boolean), links: section.links || undefined,
        figure: figure ? { ...figure, caption: section.caption || "" } : undefined
      };
    })
  };
}
