import SiteHeader from "@/components/shared/SiteHeader";
import PageFooter from "@/components/shared/PageFooter";

import styles from "./LegalPage.module.css";

type LegalSection = {
  body: ReadonlyArray<string>;
  title: string;
};

type LegalPageProps = {
  intro: string;
  lastUpdated: string;
  sections: ReadonlyArray<LegalSection>;
  title: string;
};

export default function LegalPage({
  intro,
  lastUpdated,
  sections,
  title
}: LegalPageProps) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <span className={styles.eyebrow}>Draft Legal Page</span>
            <h1 className={styles.heading}>{title}</h1>
            <p className={styles.subheading}>{intro}</p>
            <p className={styles.meta}>Last updated: {lastUpdated}</p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className={styles.container}>
            <div className={styles.notice}>
              <strong>Draft notice:</strong> This page is a launch-preparation draft
              and should be reviewed with legal counsel before final publication.
            </div>

            <div className={styles.sectionList}>
              {sections.map((section) => (
                <section key={section.title} className={styles.sectionBlock}>
                  <h2 className={styles.sectionHeading}>{section.title}</h2>
                  <div className={styles.sectionBody}>
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <PageFooter />
    </>
  );
}
