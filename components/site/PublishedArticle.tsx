import { notFound } from "next/navigation";
import { findArticle } from "@/lib/cms/public";
import { createPageMetadata } from "@/lib/site";
import JournalArticlePage from "./JournalArticlePage";

type Params = Promise<{ slug: string }>;
export function articleRoute(section: "blogs" | "case-studies") {
  async function read(params: Params) {
    const { slug } = await params;
    return await findArticle("/" + section + "/" + slug) ?? notFound();
  }
  return {
    metadata: async ({ params }: { params: Params }) => createPageMetadata(await read(params)),
    page: async ({ params }: { params: Params }) => <JournalArticlePage article={await read(params)} />
  };
}
