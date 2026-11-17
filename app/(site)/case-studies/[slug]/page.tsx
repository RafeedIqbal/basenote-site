import { articleRoute } from "@/components/site/PublishedArticle";

const route = articleRoute("case-studies");
export const generateMetadata = route.metadata;
export default route.page;
