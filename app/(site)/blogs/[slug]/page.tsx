import { articleRoute } from "@/components/site/PublishedArticle";

const route = articleRoute("blogs");
export const generateMetadata = route.metadata;
export default route.page;
