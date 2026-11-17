import { safeLink } from "@/lib/cms/fields";

export function LegalCopy({ text }: { text: string }) {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (!link || !(safeLink(link[2]) || /^mailto:[\w.+-]+@[\w.-]+\.[a-z]+(?:\?subject=[\w%.-]+)?$/i.test(link[2]))) return part;
    return <a key={index} href={link[2]}>{link[1]}</a>;
  });
}
