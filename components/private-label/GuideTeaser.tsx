import Link from "next/link";
import { privateLabel, privateLabelGuide } from "@/data/site-content";
import { SITE_NAME } from "@/lib/site";
import common from "./PrivateLabel.module.css";
import styles from "./GuideTeaser.module.css";

export default function GuideTeaser() {
  return (
    <section
      id="private-label-guide"
      className={styles.section}
      aria-labelledby="guide-teaser-title"
    >
      <div className={styles.panel}>
        <div className={styles.copy}>
          <h2 id="guide-teaser-title">{privateLabel.guide.title}</h2>
          <p>{privateLabel.guide.description}</p>
          <Link href={privateLabel.guideHref} className={common.primaryButton}>
            {privateLabel.guide.cta}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Link>
        </div>
        <Link
          href={privateLabel.guideHref}
          className={styles.preview}
          aria-label={privateLabel.guide.cta}
        >
          <div className={styles.book} aria-hidden="true">
            <div className={styles.cover}>
              <span className={styles.brand}>{SITE_NAME}</span>
              <span className={styles.coverTitle}>{privateLabel.guide.title}</span>
              <svg className={styles.illustration} viewBox="0 0 180 124" fill="none">
                <g stroke="currentColor" strokeWidth="1">
                  <path d="m22 30 43-12 27 16v73l-43 12-27-16V30Z" />
                  <path d="m22 30 27 16 43-12M49 46v73M65 18v14" />
                  <rect x="98" y="45" width="54" height="68" rx="10" />
                  <path d="M114 45V30h22v15M111 30V14h28v16h-28Z" />
                  <rect x="107" y="64" width="36" height="28" rx="1" />
                  <path d="M117 74h16m-13 8h10" />
                </g>
              </svg>
              <div className={styles.coverFooter}>
                {privateLabelGuide.elements.map((element) => (
                  <span key={element.title}>{element.title}</span>
                ))}
              </div>
            </div>
            <div className={styles.pages}>
              <span className={styles.pageHeading}>{privateLabel.eyebrow}</span>
              <ol>
                {privateLabelGuide.chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <span>{chapter.number}</span>
                    <span>{chapter.title}</span>
                  </li>
                ))}
              </ol>
              <span className={styles.pageFooter}>{SITE_NAME}</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
