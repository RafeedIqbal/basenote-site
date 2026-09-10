import Link from "next/link";
import SiteFooter from "@/components/site/SiteFooter";
import { privateLabel as content } from "@/data/site-content";
import WebglBackground from "./WebglBackground";
import styles from "./PrivateLabel.module.css";

export default function PrivateLabelClosing() {
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
          <Link href={content.contactHref} className={styles.primaryButton}>
            {content.final.cta}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <SiteFooter overlay />
    </div>
  );
}
