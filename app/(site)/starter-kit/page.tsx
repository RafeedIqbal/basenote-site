import { findArticle, getPage, pageMetadata } from "@/lib/cms/public";
import Image from "next/image";
import Link from "next/link";

import { SiteFrame } from "@/components/site/shared";
import styles from "@/components/site/Editorial.module.css";
import common from "@/components/site/SitePages.module.css";
import { starterArticle as originalArticle } from "@/data/site-content";

export const generateMetadata = () => pageMetadata("starter-kit");

export default async function Page() {
  const [starterKit, related] = await Promise.all([getPage("starter-kit"), findArticle(originalArticle.path)]);
  const starterArticle = related ?? originalArticle;
  return (
    <SiteFrame>
      <div className={styles.wrap}>
        <header className={`${styles.feature} ${styles.starterHero}`}>
          <div>
            <h1>{starterKit.title}</h1>
            <p className={styles.lead}>{starterKit.description}</p>
            <Link href={starterArticle.enquiry.href} className={common.primaryButton}>{starterArticle.enquiry.label}</Link>
          </div>
          <Image src={starterArticle.image.src} alt={starterArticle.image.alt} width={starterArticle.image.width} height={starterArticle.image.height}
            sizes="(max-width: 760px) 90vw, (max-width: 1300px) 38vw, 450px" className={styles.cover} />
        </header>
        <section className={styles.kitSection} aria-labelledby="kit-options">
          <h2 id="kit-options">{starterKit.optionsTitle}</h2>
          <div className={styles.tiers}>
            {starterKit.tiers.map((tier) => (
              <section key={tier.title}>
                <h3>{tier.title}</h3>
                <p>{tier.description}</p>
                <ul>{tier.includes.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
            ))}
          </div>
          <p>{starterKit.pricing}</p>
          {related && <Link href={related.path} className={styles.textLink}>{related.title}</Link>}
        </section>
        <section className={styles.kitSection}>
          <h2>{starterKit.nextTitle}</h2>
          <p>{starterKit.nextDescription}</p>
          <Link href="/private-label" className={styles.textLink}>{starterKit.privateLabelLink}</Link>
        </section>
      </div>
    </SiteFrame>
  );
}
