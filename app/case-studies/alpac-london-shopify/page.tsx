import JournalArticlePage from "@/components/site/JournalArticlePage";
import { alpacArticle } from "@/data/site-content";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(alpacArticle);

export default function Page() {
  return <JournalArticlePage article={alpacArticle} />;
}
