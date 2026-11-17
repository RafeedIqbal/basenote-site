import { PrivateContent } from "@/components/private-label/PrivateContent";
import { pageTemplates } from "@/data/cms-pages";
import { getOptionalPage } from "@/lib/cms/public";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [privateLabel, guide] = await Promise.all([getOptionalPage("private-label"), getOptionalPage("guide")]);
  return <PrivateContent value={{ privateLabel: privateLabel ?? pageTemplates["private-label"], guide: guide ?? pageTemplates.guide }}>{children}</PrivateContent>;
}
