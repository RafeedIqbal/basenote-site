import ArrowIcon from "@/components/site/ArrowIcon";
import SiteFooter from "@/components/site/SiteFooter";
import { getPage } from "@/lib/cms/public";
import WebglBackground from "./WebglBackground";
import styles from "./PrivateLabel.module.css";

export default async function PrivateLabelClosing() {
  const content = await getPage("private-label");
  return (
    <div className={styles.closing}>
      <div className={styles.closingBackground} aria-hidden="true">
        <WebglBackground />
      </div>
      <section
        id="start-your-fragrance"
        className={styles.finalCta}
        aria-labelledby="final-title"
      >
        <div className={styles.finalCopy}>
          <h2 id="final-title">{content.final.title}</h2>
          <p>{content.final.description}</p>
          <a href={content.final.href} className={styles.primaryButton}>
            {content.final.cta}
            <ArrowIcon />
          </a>
        </div>
      </section>
      <SiteFooter overlay />
    </div>
  );
}
