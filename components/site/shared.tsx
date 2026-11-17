import type { ReactNode } from "react";
import { getPage } from "@/lib/cms/public";
import PageShell from "./PageShell";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import styles from "./SitePages.module.css";

export { default as FaqList } from "./FaqList";

export async function SiteFrame({
  children,
  className = "",
  footer = <SiteFooter />,
}: {
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}) {
  const { navigation } = await getPage("shared");
  return (
    <PageShell className={`${styles.page} ${className}`}>
      <SiteHeader items={navigation} />
      <main id="main-content" tabIndex={-1}>{children}</main>
      {footer}
    </PageShell>
  );
}

type Tone = "amber" | "black" | "blue" | "red";
export function SectionDivider({ tone = "black" }: { tone?: Tone }) {
  return (
    <div
      className={`${styles.dividerBand} ${styles[`tone${tone[0].toUpperCase()}${tone.slice(1)}`]}`}
      aria-hidden="true"
    >
      <div className={styles.divider}>
        <span>+</span>
      </div>
    </div>
  );
}

export function Eyebrow({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: Exclude<Tone, "black">;
}) {
  const toneClass = tone
    ? styles[`eyebrow${tone[0].toUpperCase()}${tone.slice(1)}`]
    : "";
  return <span className={`${styles.eyebrow} ${toneClass}`}>{children}</span>;
}
