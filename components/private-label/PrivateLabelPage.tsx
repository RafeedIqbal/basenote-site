import Link from "next/link";
import { privateLabelArticle as original } from "@/data/site-content";
import { getPage, findArticle, getArticles } from "@/lib/cms/public";
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

export default async function PrivateLabelPage() {
  const [content, privateLabelArticle, articles] = await Promise.all([getPage("private-label"), findArticle(original.path), getArticles()]);
  const slides = content.portfolio.slides.map(slide => slide.caseStudy && !articles.some(a => a.path === slide.caseStudy?.href) ? { ...slide, caseStudy: undefined } : slide);
  return (
    <SiteFrame className={styles.page} footer={<PrivateLabelClosing />}>
      <PrivateLabelHero />
      <PortfolioCarousel {...content.portfolio} slides={slides} />
      <AudiencePanels />
      <CapabilityWheel />
      <ClientJourney />
      {content.featured.enabled ? <FeaturedProject /> : null}
      <CommercialStats>
        {privateLabelArticle && <Link href={privateLabelArticle.path} className={styles.readingLink}>{privateLabelArticle.title}</Link>}
      </CommercialStats>
      <GuideTeaser />
      <section
        id="faq"
        className={`${styles.section} ${styles.faqSection}`}
        aria-labelledby="faq-title"
      >
        <div className={styles.sectionHeading} data-reveal="">
          <h2 id="faq-title">{content.faqTitle}</h2>
        </div>
        <FaqList items={content.faqs} exclusive />
      </section>
      <FloatingChat heroId="hero" />
    </SiteFrame>
  );
}
