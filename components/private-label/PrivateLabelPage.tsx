"use client";

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
import PrivateLabelHero from "./PrivateLabelHero";
import styles from "./PrivateLabel.module.css";

export default function PrivateLabelPage() {
  return (
    <SiteFrame className={styles.page} footer={<PrivateLabelClosing />}>
      <PrivateLabelHero />
      <PortfolioCarousel {...content.portfolio} />
      <AudiencePanels />
      <CapabilityWheel />
      <ClientJourney />
      {content.featured.enabled ? <FeaturedProject /> : null}
      <CommercialStats />
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
