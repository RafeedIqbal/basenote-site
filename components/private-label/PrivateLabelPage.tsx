"use client";

import Image from "next/image";
import Link from "next/link";
import { navigateToAnchor } from "@/lib/scroll";
import { privateLabel as content, privateLabelFaqs } from "@/data/site-content";
import { SiteFrame, FaqList } from "@/components/site/shared";
import PortfolioCarousel from "./PortfolioCarousel";
import AudiencePanels from "./AudiencePanels";
import CapabilityWheel from "./CapabilityWheel";
import ClientJourney from "./ClientJourney";
import FeaturedProject from "./FeaturedProject";
import CommercialStats from "./CommercialStats";
import GuideTeaser from "./GuideTeaser";
import PrivateLabelClosing from "./PrivateLabelClosing";
import { FloatingChat } from "./PrivateLabelChrome";
import styles from "./PrivateLabel.module.css";

export default function PrivateLabelPage() {
  return (
    <SiteFrame className={styles.page} footer={<PrivateLabelClosing />}>
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
            <Link href="#client-journey" className={styles.textLink} onClick={navigateToAnchor}>
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
      <PortfolioCarousel {...content.portfolio} />
      <AudiencePanels />
      <CapabilityWheel />
      <ClientJourney />
      {content.featured.enabled ? <FeaturedProject /> : null}
      <CommercialStats sectionNumber={content.featured.enabled ? "06" : "05"} />
      <GuideTeaser />
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
      <FloatingChat heroId="hero" />
    </SiteFrame>
  );
}
