import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, type ReactNode } from "react";

import {
  alchemyArticle,
  alchemyEngine,
  blendBars,
  blendArticle,
  blendEngine,
  caseStudies,
  contactDetails,
  journalArticles,
  journalIntro,
  teamMembers,
  type JournalArticle
} from "@/data/site-content";
import { formatArticleDate } from "@/lib/site";

import InquiryForm from "./InquiryForm";
import { SiteFrame, Eyebrow, SectionDivider } from "./shared";

import styles from "./SitePages.module.css";

const waves = Array.from({ length: 24 }, (_, index) => ({
  duration: `${(0.7 + (index % 5) * 0.18).toFixed(2)}s`,
  height: `${25 + Math.round(60 * Math.abs(Math.sin(index * 0.9)))}%`
}));

function PageCta({ tone = "black", article }: { tone?: "amber" | "black" | "blue" | "red"; article?: JournalArticle }) {
  return (
    <section className={`${styles.ctaSection} ${styles[`tone${tone[0].toUpperCase()}${tone.slice(1)}`]}`}>
      <div className={styles.ctaGlow} />
      <div className={styles.ctaContent} data-reveal="">
        <h2>{article ? <Link href={article.path} className={styles.readingLink}>{article.title}</Link> : "Ready to Build Something?"}</h2>
        <p>{article?.description ?? "Whether you need a product, a brand, or a technology partner — let’s talk."}</p>
        <Link href={article?.enquiry.href ?? "/contact"} className={styles.primaryButton}>
          {article?.enquiry.label ?? "Get in touch"}
        </Link>
      </div>
    </section>
  );
}

function BlendInterface({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className={`${styles.blendPanel} ${detailed ? styles.blendPanelDetailed : ""}`} data-reveal="">
      <div className={styles.panelTopline}>
        <span className={styles.liveDot} />
        <span>Blend Studio</span>
        <span className={styles.sessionLabel}>Example scent profile</span>
      </div>
      <div className={detailed ? styles.blendDetailGrid : ""}>
        <div>
          {blendBars.map((bar) => (
            <div key={bar.name} className={styles.blendBar}>
              <div className={styles.blendBarLabel}>
                <span>{bar.name}</span>
                <span>{bar.percentage}%</span>
              </div>
              <div className={styles.blendTrack}>
                <span style={{ "--bar-width": `${bar.percentage}%` } as CSSProperties} />
              </div>
            </div>
          ))}
        </div>
        {detailed ? (
          <div className={styles.predictedProfile}>
            <Eyebrow tone="blue">Scent direction</Eyebrow>
            <h3>Amber · Woody</h3>
            <p>Smell this direction on a blotter and record what the customer would keep or change.</p>
          </div>
        ) : (
          <div className={styles.scoreRow}>
            <span>Scent direction</span>
            <strong>Amber · Woody</strong>
          </div>
        )}
      </div>
    </div>
  );
}

function AlchemyInterface({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className={`${styles.alchemyPanel} ${detailed ? styles.alchemyPanelDetailed : ""}`} data-reveal="" data-loop="">
      <div className={styles.panelToplineAmber}>
        <span className={styles.trainingDot} />
        <span>Factory ERP · Production records</span>
      </div>
      <div className={`${styles.waveform} ${detailed ? styles.waveformLarge : ""}`} aria-hidden="true">
        {waves.map((wave, index) => (
          <span
            key={index}
            style={{
              "--wave-duration": wave.duration,
              "--wave-height": wave.height
            } as CSSProperties}
          />
        ))}
      </div>
      <div className={styles.alchemyStats}>
        {alchemyEngine.stages.map((stage) => (
          <div key={stage.title}><strong>{stage.title}</strong><span>{stage.description}</span></div>
        ))}
      </div>
    </div>
  );
}

function EditorialGrid({
  cards,
  headingLevel = 3,
  showDates = false
}: {
  cards: JournalArticle[];
  headingLevel?: 2 | 3;
  showDates?: boolean;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className={styles.editorialGrid}>
      {cards.map((card) => (
        <article key={card.path} className={styles.editorialCard}>
          <div className={styles.editorialImage}>
            <Image
              src={card.image.src}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
            />
          </div>
          <div className={styles.editorialCopy}>
            <span className={styles.articleMeta}>
              {card.path.startsWith("/case-studies/") ? "Case study · " : ""}{card.topic}
              {showDates && <> · <time dateTime={card.published}>{formatArticleDate(card.published)}</time></>}
            </span>
            <Heading><Link href={card.path}>{card.title}</Link></Heading>
            <p>{card.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function AboutPage() {
  return (
    <SiteFrame>
      <section className={`${styles.pageHero} ${styles.toneBlack}`}>
        <div className={styles.pageHeroInner}>
          <Eyebrow>About Base Note</Eyebrow>
          <h1 data-reveal="">Tech People.<br />Fragrance Industry.</h1>
        </div>
      </section>
      <SectionDivider tone="red" />
      <section className={`${styles.sectionCompact} ${styles.toneRed}`}>
        <div className={`${styles.container} ${styles.aboutIntro}`}>
          <p className={styles.serifIntro} data-reveal="">Base Note Solutions was built at the intersection of two worlds most companies don&apos;t connect — fragrance manufacturing and technology.</p>
          <div data-reveal="">
            <p>Founded by Taseen Ahmed Choudhury, Base Note draws on direct access to TAC Perfumes — a UAE-based fragrance factory — and a dedicated tech development team at Arizmi Labs.</p>
            <p>The result is a company that can take a client from raw idea to finished product to functioning brand, with AI tools being developed in parallel that will change how the industry works. We&apos;re a small team. We operate lean. And we&apos;re building something that hasn&apos;t been built before.</p>
          </div>
        </div>
      </section>
      <SectionDivider />
      <section className={`${styles.sectionCompact} ${styles.toneBlack}`}>
        <div className={styles.container}>
          <h2 className={styles.eyebrowHeading}><Eyebrow>The Team</Eyebrow></h2>
          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <article key={member.name} data-reveal="">
                <div className={styles.initial}>{member.initial}</div>
                <h3>{member.name}</h3>
                <span>{member.role}</span>
                <p>{member.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <SectionDivider />
      <PageCta />
    </SiteFrame>
  );
}


export function BlendEnginePage() {
  return (
    <SiteFrame>
      <section className={`${styles.centerProductHero} ${styles.toneBlue}`}>
        <div className={styles.centerProductHeroInner}>
          <Eyebrow tone="blue">Tech & AI · Blend Engine</Eyebrow>
          <h1 data-reveal="">{blendEngine.title}</h1>
          <p data-reveal="">{blendEngine.description}</p>
          <Link href={blendArticle.enquiry.href} className={styles.blueButton}>{blendArticle.enquiry.label}</Link>
        </div>
      </section>
      <SectionDivider tone="blue" />
      <section className={`${styles.sectionCompact} ${styles.toneBlue}`} aria-labelledby="blend-studio-title">
        <h2 id="blend-studio-title" className={styles.srOnly}>Blend Studio</h2>
        <div className={styles.productDemoContainer}>
          <BlendInterface detailed />
          <div className={styles.featureGrid}>
            {blendEngine.features.map((feature) => (
              <article key={feature.title} data-reveal="">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <SectionDivider tone="blue" />
      <PageCta tone="blue" article={blendArticle} />
    </SiteFrame>
  );
}

export function AlchemyEnginePage() {
  return (
    <SiteFrame>
      <section className={`${styles.centerProductHero} ${styles.toneAmber}`}>
        <div className={styles.centerProductHeroInner}>
          <Eyebrow tone="amber">Alchemy Engine & Factory ERP</Eyebrow>
          <h1 data-reveal="">{alchemyEngine.title}</h1>
          <p data-reveal="">{alchemyEngine.description}</p>
          <div className={styles.productActions}>
            <Link href={alchemyArticle.enquiry.href} className={styles.amberButton}>{alchemyArticle.enquiry.label}</Link>
            <Link href={alchemyEngine.pilot.href} className={styles.secondaryButton}>{alchemyEngine.pilot.label}</Link>
          </div>
        </div>
      </section>
      <SectionDivider tone="amber" />
      <section className={`${styles.sectionCompact} ${styles.toneAmber}`} aria-labelledby="factory-records-title">
        <h2 id="factory-records-title" className={styles.srOnly}>Factory records and formulation pilots</h2>
        <div className={styles.productDemoContainer}>
          <AlchemyInterface detailed />
          <div className={styles.featureGrid}>
            {alchemyEngine.features.map((feature) => (
              <article key={feature.title}><h3>{feature.title}</h3><p>{feature.description}</p></article>
            ))}
          </div>
        </div>
      </section>
      <SectionDivider tone="amber" />
      <PageCta tone="amber" article={alchemyArticle} />
    </SiteFrame>
  );
}

export function BlogsPage() {
  return (
    <SiteFrame>
      <section className={`${styles.listingHero} ${styles.toneBlack}`}>
        <div className={styles.container}>
          <h1>{journalIntro.title}</h1>
          <p className={styles.listingIntro}>{journalIntro.description}</p>
        </div>
      </section>
      <SectionDivider />
      <section className={`${styles.listingSection} ${styles.toneBlack}`}>
        <div className={styles.container}>
          <EditorialGrid cards={journalArticles} headingLevel={2} showDates />
        </div>
      </section>
      <SectionDivider tone="red" />
      <PageCta tone="red" />
    </SiteFrame>
  );
}

export function CaseStudiesPage() {
  return (
    <SiteFrame>
      <section className={`${styles.listingHero} ${styles.toneBlack}`}>
        <div className={styles.container}>
          <Eyebrow>Selected Work · In association with TAC Perfumes</Eyebrow>
          <h1 data-reveal="">Case Studies</h1>
        </div>
      </section>
      <SectionDivider />
      <section className={`${styles.listingSection} ${styles.toneBlack}`}>
        <div className={`${styles.container} ${styles.caseList}`}>
          {caseStudies.map((study) => (
            <article
              key={study.slug}
              id={study.slug}
              aria-labelledby={`${study.slug}-title`}
              className={styles.caseCard}
              data-reveal=""
            >
              <div className={styles.caseImage}>
                <Image
                  src={study.images[0].src}
                  alt={study.images[0].alt}
                  fill
                  sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 859px) calc(100vw - 48px), (max-width: 1248px) 44vw, 522px"
                />
              </div>
              <div className={styles.caseCopy}>
                <span className={styles.caseClient}>{study.name}</span>
                <h2 id={`${study.slug}-title`}>{study.headline}</h2>
                {study.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {study.caseStudy && <Link href={study.caseStudy.href} className={styles.readingLink}>{study.caseStudy.label}</Link>}
              </div>
            </article>
          ))}
        </div>
      </section>
      <SectionDivider tone="red" />
      <PageCta tone="red" />
    </SiteFrame>
  );
}

export function ContactLandingPage({
  defaultInterest,
  defaultMessage
}: {
  defaultInterest?: string;
  defaultMessage?: string;
}) {
  return (
    <SiteFrame>
      <section className={`${styles.contactSection} ${styles.toneBlack}`}>
        <div className={styles.contactGrid}>
          <div data-reveal="">
            <Eyebrow>Contact</Eyebrow>
            <h1>Let&apos;s Talk</h1>
            <p>Tell us what you&apos;re working on and we&apos;ll come back to you within one business day.</p>
            <div className={styles.contactDetails}>
              <div><Eyebrow>{contactDetails.emailLabel}</Eyebrow><a href={"mailto:" + contactDetails.email}>{contactDetails.email}</a></div>
            </div>
            <a href={contactDetails.booking.href} className={`${styles.primaryButton} ${styles.contactBooking}`}>
              {contactDetails.booking.label}
            </a>
          </div>
          <div data-reveal="">
            <InquiryForm defaultInterest={defaultInterest} defaultMessage={defaultMessage} />
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}

type LegalSection = {
  body: ReadonlyArray<ReactNode>;
  title: string;
};

export function LegalPage({
  draft = true,
  intro,
  lastUpdated,
  sections,
  title
}: {
  draft?: boolean;
  intro: string;
  lastUpdated: string;
  sections: ReadonlyArray<LegalSection>;
  title: string;
}) {
  return (
    <SiteFrame>
      <section className={`${styles.listingHero} ${styles.toneBlack}`}>
        <div className={styles.container}>
          <Eyebrow>{draft ? "Draft legal page" : "Your privacy"}</Eyebrow>
          <h1 data-reveal="">{title}</h1>
          <p className={styles.legalIntro} data-reveal="">{intro}</p>
        </div>
      </section>
      <SectionDivider />
      <section className={`${styles.section} ${styles.toneBlack}`}>
        <div className={`${styles.container} ${styles.legalLayout}`}>
          <div className={styles.legalMeta}>
            <Eyebrow>Last updated</Eyebrow>
            <strong>{lastUpdated}</strong>
            {draft && <p>This page is a launch-preparation draft and should be reviewed with legal counsel before final publication.</p>}
          </div>
          <div className={styles.legalSections}>
            {sections.map((section) => (
              <section key={section.title} data-reveal="">
                <h2>{section.title}</h2>
                {section.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </section>
            ))}
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
