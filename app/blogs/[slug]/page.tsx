import { notFound } from "next/navigation";

import JournalArticlePage from "@/components/site/JournalArticlePage";
import { blogArticles } from "@/data/site-content";
import { createPageMetadata } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogArticles.map(({ path }) => ({ slug: path.slice("/blogs/".length) }));
}

function getArticle(slug: string) {
  return blogArticles.find(({ path }) => path === `/blogs/${slug}`) ?? notFound();
}

export async function generateMetadata({ params }: PageProps<"/blogs/[slug]">) {
  return createPageMetadata(getArticle((await params).slug));
}

export default async function Page({ params }: PageProps<"/blogs/[slug]">) {
  return <JournalArticlePage article={getArticle((await params).slug)} />;
}
