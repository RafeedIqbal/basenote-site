"use client";

import Image from "next/image";
import Link from "next/link";
import { privateLabel as content, privateLabelFaqs } from "@/data/site-content";
import { SiteFrame, FaqList } from "@/components/site/shared";
import PortfolioCarousel from "./PortfolioCarousel";
import AudiencePanels from "./AudiencePanels";
import CapabilityWheel from "./CapabilityWheel";
import ClientJourney from "./ClientJourney";
import FeaturedProject from "./FeaturedProject";
import CommercialStats from "./CommercialStats";
import WebglBackground from "./WebglBackground";
import { FloatingChat } from "./PrivateLabelChrome";
import styles from "./PrivateLabel.module.css";

export default function PrivateLabelPage() {
  return (
    <SiteFrame className={styles.page}>
      <section id="hero" className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>{content.eyebrow}</span>
          <h1>{content.hero.title}</h1>
          <p>{content.hero.description}</p>
          <div className={styles.actions}>
            <Link href={content.contactHref} className={styles.primaryButton}>
              {content.hero.primary}
              <span aria-hidden="true">↗</span>
            </Link>
            <Link href="#client-journey" className={styles.textLink}>
              {content.hero.secondary}
              <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
        <div className={styles.heroArt}>
          <Image
            src={content.hero.image}
            alt={content.hero.imageAlt}
            fill
            priority
            sizes="(max-width: 859px) 100vw, 50vw"
          />
        </div>
      </section>
      <PortfolioCarousel />
      <AudiencePanels />
      <CapabilityWheel />
      <ClientJourney />
      <FeaturedProject />
      <CommercialStats />
      <section
        id="private-label-guide"
        className={`${styles.section} ${styles.teaser}`}
        aria-labelledby="guide-teaser-title"
      >
        <span className={styles.teaserMark} aria-hidden="true">
          ↗
        </span>
        <div data-reveal="">
          <span className={styles.eyebrow}>{content.eyebrow}</span>
          <h2 id="guide-teaser-title">{content.guide.title}</h2>
          <p>{content.guide.description}</p>
          <Link href={content.guideHref} className={styles.textLink}>
            {content.guide.cta}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      <section
        id="faq"
        className={`${styles.section} ${styles.faqSection}`}
        aria-labelledby="faq-title"
      >
        <div className={styles.sectionHeading} data-reveal="">
          <h2 id="faq-title">{content.faqTitle}</h2>
        </div>
        <FaqList items={privateLabelFaqs} exclusive />
      </section>
      <section
        id="start-your-fragrance"
        className={styles.finalCta}
        aria-labelledby="final-title"
      >
        <WebglBackground />
        <div className={styles.finalCopy}>
          <h2 id="final-title">{content.final.title}</h2>
          <p>{content.final.description}</p>
          <Link href={content.contactHref} className={styles.primaryButton}>
            {content.final.cta}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <FloatingChat heroId="hero" />
    </SiteFrame>
  );
}
