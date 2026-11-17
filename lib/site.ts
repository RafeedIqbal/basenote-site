import type { Metadata } from "next";

import { journalArticles, socialLinks, type JournalArticle } from "@/data/site-content";
import { SITE_DESCRIPTION, SITE_LOGO, SITE_NAME, SITE_ORIGIN, SITE_SHORT_NAME, SITE_SOCIAL_IMAGE } from "@/lib/site-brand";

export * from "@/lib/site-brand";

export const PUBLIC_ROUTES = [
  "/",
  "/starter-kit",
  "/private-label",
  "/private-label/guide",
  "/blend-engine",
  "/alchemy-engine",
  "/about",
  "/blogs",
  "/case-studies",
  "/contact",
  "/privacy-policy",
  "/terms",
  ...journalArticles.map((article) => article.path)
] as const;

type PageMetadataInput = {
  description: string;
  path: (typeof PUBLIC_ROUTES)[number];
  title: string;
};

export function createPageMetadata(page: PageMetadataInput | JournalArticle): Metadata {
  const { description, path, title } = page;
  const article = "published" in page ? page : undefined;
  const pageTitle = `${title} | ${SITE_NAME}`;
  const image = article ? { url: article.image.src, width: article.image.width, height: article.image.height, alt: article.image.alt } : SITE_SOCIAL_IMAGE;

  return {
    title: {
      absolute: pageTitle
    },
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title: pageTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_GB",
      ...(article
        ? { type: "article", publishedTime: article.published, authors: [`${SITE_ORIGIN}/about`], section: article.topic }
        : { type: "website" }),
      images: [image]
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image]
    }
  };
}

export function articleBreadcrumbs(article: JournalArticle) {
  const listing = article.path.startsWith("/blogs/")
    ? { label: "Journal", href: "/blogs" }
    : { label: "Case studies", href: "/case-studies" };
  return [{ label: "Home", href: "/" }, listing, { label: article.topic, href: article.path }];
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" });

export function formatArticleDate(date: string) {
  return dateFormat.format(new Date(date));
}

export function createArticleStructuredData(article: JournalArticle) {
  const url = SITE_ORIGIN + article.path;
  const organisation = {
    "@type": "Organization", "@id": SITE_ORIGIN + "/#organization",
    name: SITE_NAME, url: SITE_ORIGIN + "/about", logo: SITE_ORIGIN + SITE_LOGO
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": article.path.startsWith("/blogs/") ? "BlogPosting" : "Article",
        "@id": url + "#article", url, mainEntityOfPage: url, inLanguage: "en-GB",
        headline: article.title, description: article.description, articleSection: article.topic,
        datePublished: article.published, author: organisation, publisher: { "@id": organisation["@id"] },
        image: { "@type": "ImageObject", url: SITE_ORIGIN + article.image.src, width: article.image.width, height: article.image.height }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: articleBreadcrumbs(article).map((crumb, i) => ({
          "@type": "ListItem", position: i + 1, name: crumb.label, item: SITE_ORIGIN + crumb.href
        }))
      }
    ]
  };
}

export function createSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: SITE_NAME,
        alternateName: SITE_SHORT_NAME,
        url: SITE_ORIGIN,
        description: SITE_DESCRIPTION,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_ORIGIN}${SITE_LOGO}`,
          width: 512,
          height: 512,
          caption: SITE_NAME
        },
        sameAs: socialLinks.map((link) => link.href)
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        name: SITE_NAME,
        alternateName: SITE_SHORT_NAME,
        url: SITE_ORIGIN,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${SITE_ORIGIN}/#organization` }
      }
    ]
  };
}

export function getCurrentYear() {
  return new Date().getFullYear();
}
