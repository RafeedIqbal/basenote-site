"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties } from "react";

import {
  audienceLabels,
  audienceSegments,
  barriers,
  blendBars,
  blendFeatures,
  blogPosts,
  capabilities,
  caseStudies,
  homeFaqs,
  processSteps,
  services,
  stats,
  teamMembers,
  trustedBrands,
  type EditorialCard
} from "@/data/site-content";

import InquiryForm from "./InquiryForm";
import { SiteFrame, Eyebrow, SectionDivider, FaqList } from "./shared";

import styles from "./SitePages.module.css";

const assetRoot = "/media/basenote-handoff";

const waves = Array.from({ length: 24 }, (_, index) => ({
  duration: `${(0.7 + (index % 5) * 0.18).toFixed(2)}s`,
  height: `${25 + Math.round(60 * Math.abs(Math.sin(index * 0.9)))}%`
}));

function PageCta({ tone = "black" }: { tone?: "amber" | "black" | "blue" | "red" }) {
  return (
    <section className={`${styles.ctaSection} ${styles[`tone${tone[0].toUpperCase()}${tone.slice(1)}`]}`}>
      <div className={styles.ctaGlow} />
      <div className={styles.ctaContent} data-reveal="">
        <h2>Ready to Build Something?</h2>
        <p>
          Whether you need a product, a brand, or a technology partner — let&apos;s talk.
        </p>
        <Link href="/contact" className={styles.primaryButton}>
          Get in touch
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
        <span>{detailed ? "Blend Studio" : "blend-engine · live"}</span>
        {detailed ? <span className={styles.sessionLabel}>session · demo</span> : null}
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
            <Eyebrow tone="blue">Predicted profile</Eyebrow>
            <h3>Amber · Woody</h3>
            <p>Warm, resinous, long-lasting dry-down. Est. compliance: pass.</p>
            <div className={styles.scoreLarge}>
              94<span>%</span>
              <small>market-match<br />confidence</small>
            </div>
          </div>
        ) : (
          <div className={styles.scoreRow}>
            <span>Predicted match</span>
            <strong>94<small>%</small></strong>
          </div>
        )}
      </div>
    </div>
  );
}

function AlchemyInterface({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className={`${styles.alchemyPanel} ${detailed ? styles.alchemyPanelDetailed : ""}`} data-reveal="">
      <div className={styles.panelToplineAmber}>
        <span className={styles.trainingDot} />
        <span>{detailed ? "Model training pipeline" : "alchemy-engine · training"}</span>
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
      {detailed ? (
        <div className={styles.alchemyStats}>
          <div><strong>2,481</strong><span>Formulations logged</span></div>
          <div><strong>18,940</strong><span>Molecular pairs</span></div>
          <div><strong>Q3</strong><span>Early access target</span></div>
        </div>
      ) : (
        <div className={styles.terminalCopy}>
          <span>&gt; logging formulations… <strong>2,481</strong></span>
          <span>&gt; molecular pairs mapped… <strong>18,940</strong></span>
          <span>&gt; model status… <strong>in development</strong></span>
        </div>
      )}
    </div>
  );
}

function EditorialGrid({ cards, showDates = false }: { cards: EditorialCard[]; showDates?: boolean }) {
  return (
    <div className={styles.editorialGrid}>
      {cards.map((card) => (
        <article key={card.title} className={styles.editorialCard} data-reveal="">
          <div className={styles.editorialImage}>
            <Image
              src={card.image}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
            />
          </div>
          <div className={styles.editorialCopy}>
            <span className={styles.articleMeta}>
              {card.category}{showDates && card.date ? ` · ${card.date}` : ""}
            </span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function LandingPage() {
  return (
    <SiteFrame>
      <section className={`${styles.homeHero} ${styles.toneBlack}`}>
        <div className={styles.heroVeil} />
        <div className={styles.homeHeroInner}>
          <div className={styles.homeHeroCopy}>
            <Eyebrow>— The fragrance opportunity</Eyebrow>
            <p className={styles.heroLead} data-reveal="">
              Breaking into fragrance has always demanded connections, capital, and factory access most people never get.
            </p>
            <h1 data-reveal="">Where Fragrance<br />Meets Business</h1>
            <p className={styles.heroBody} data-reveal="">
              Private-label perfumes, brand creation, and AI-powered fragrance technology — built for founders, brands, and businesses ready to launch something that lasts.
            </p>
            <div className={styles.actions} data-reveal="">
              <Link href="/contact" className={styles.primaryButton}>Get started</Link>
              <Link href="#services" className={styles.secondaryButton}>Explore what we do</Link>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className={`${styles.section} ${styles.toneBlack}`}>
        <div className={styles.container}>
          <div className={styles.opportunityGrid}>
            <div data-reveal="">
              <Eyebrow>01 — The Opportunity</Eyebrow>
              <h2 className={styles.sectionTitle}>The Fragrance Industry Is Wide Open</h2>
            </div>
            <div className={styles.opportunityCopy} data-reveal="">
              <p>The global fragrance market is worth over <strong>$50 billion</strong> — and it&apos;s still growing. But breaking in has always required connections, capital, and manufacturing access most people don&apos;t have.</p>
              <p className={styles.serifCallout}>Base Note changes that.</p>
              <p>We combine direct access to a UAE-based manufacturing facility, in-house brand and tech capabilities, and AI tools that didn&apos;t exist five years ago — a faster, smarter path from idea to shelf.</p>
            </div>
          </div>
          <div className={styles.statsGrid} data-reveal="">
            {stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className={`${styles.section} ${styles.solutionSection}`}>
        <div className={styles.container}>
          <div className={styles.centeredHeader} data-reveal="">
            <Eyebrow>02 — What We Do</Eyebrow>
            <h2 className={styles.sectionTitle}>One Partner For The Whole Fragrance Industry</h2>
            <p>From your first product to a full brand rollout — we handle the parts that slow most people down.</p>
          </div>
          <div className={styles.solutionDiagram} data-reveal="">
            <div className={styles.diagramColumnRed}>
              <Eyebrow tone="red">The barriers</Eyebrow>
              {barriers.map((item) => (
                <div key={item.title} className={styles.diagramCard}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </div>
              ))}
            </div>
            <div className={styles.diagramCenter}>
              <div className={styles.diagramOrb}>
                <Image src={`${assetRoot}/logo-white.png`} alt="" width={46} height={46} />
                <span>Basenote</span>
              </div>
              <Eyebrow>The single solution</Eyebrow>
            </div>
            <div className={styles.diagramColumnBlue}>
              <Eyebrow tone="blue">What we bring</Eyebrow>
              {capabilities.map((item) => (
                <div key={item.title} className={styles.diagramCard}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.builtFor} data-reveal="">
            <Eyebrow>Built for</Eyebrow>
            <div>
              {audienceLabels.map((label) => <span key={label}>{label}</span>)}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section id="services" className={`${styles.section} ${styles.toneBlack}`}>
        <div className={styles.container}>
          <div className={styles.splitHeader} data-reveal="">
            <div>
              <Eyebrow>03 — Core Services</Eyebrow>
              <h2 className={styles.sectionTitle}>Three Ways In</h2>
            </div>
            <p>Tap any tile to go deeper — each is a distinct route from idea to market.</p>
          </div>
          <div className={styles.serviceGrid}>
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className={`${styles.serviceCard} ${styles[`service${service.accent[0].toUpperCase()}${service.accent.slice(1)}`]}`}
                data-reveal=""
              >
                <span className={styles.serviceNumber}>{service.eyebrow}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className={styles.serviceLink}>Explore →</span>
              </Link>
            ))}
          </div>
          <div className={styles.extraServices} data-reveal="">
            <div>
              <span><strong>Branding & Identity</strong><small>Logo, website & social setup</small></span>
              <span><strong>Fragrance Oils</strong><small>Wholesale, direct, any volume</small></span>
              <span><strong>Consultancy</strong><small>Compliance & market entry</small></span>
            </div>
            <Link href="/contact">Ask about the rest →</Link>
          </div>
        </div>
      </section>

      <SectionDivider tone="blue" />

      <section className={`${styles.section} ${styles.toneBlue}`}>
        <div className={styles.container}>
          <div className={styles.centeredHeader} data-reveal="">
            <Eyebrow>04 — Tech & AI</Eyebrow>
            <h2 className={styles.sectionTitle}>Fragrance Technology For The Next Generation</h2>
          </div>
          <div className={styles.techRow}>
            <div data-reveal="">
              <Eyebrow tone="blue">Blend Engine</Eyebrow>
              <h3 className={styles.featureTitle}>Create. Blend. License.</h3>
              <p className={styles.bodyCopy}>An AI blending platform that turns fragrance oils into unique, market-ready perfumes. Available as a monthly licence for fragrance labs, retailers and studios.</p>
              <Link href="/blend-engine" className={styles.secondaryButton}>Enquire about licensing →</Link>
            </div>
            <BlendInterface />
          </div>
        </div>
      </section>

      <SectionDivider tone="amber" />

      <section className={`${styles.section} ${styles.toneAmber}`}>
        <div className={styles.container}>
          <div className={`${styles.techRow} ${styles.techRowReverse}`}>
            <AlchemyInterface />
            <div data-reveal="">
              <Eyebrow tone="amber">Alchemy Engine</Eyebrow>
              <h3 className={styles.featureTitle}>The World&apos;s First Fragrance Formulation AI</h3>
              <p className={styles.bodyCopy}>Built on proprietary formulation data logged by our in-house chemist — trained on the chemistry behind fragrance creation to accelerate formulation and reduce trial and error.</p>
              <Link href="/alchemy-engine" className={styles.secondaryButton}>Register your interest →</Link>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className={`${styles.section} ${styles.toneBlack}`}>
        <div className={styles.container}>
          <div className={styles.narrowHeader} data-reveal="">
            <Eyebrow>05 — Who We Work With</Eyebrow>
            <h2 className={styles.sectionTitle}>Built For Founders, Brands & Businesses</h2>
          </div>
          <div className={styles.audienceGrid}>
            {audienceSegments.map((audience) => (
              <article key={audience.title} data-reveal="">
                <span>{audience.number}</span>
                <h3>{audience.title}</h3>
                <p>{audience.description}</p>
              </article>
            ))}
            <div className={styles.audienceCta} data-reveal="">
              <h3>Not sure where you fit?</h3>
              <Link href="/contact">Talk to us →</Link>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className={styles.trustedSection}>
        <div className={styles.container} data-reveal="">
          <Eyebrow>Trusted by brands · In association with TAC Perfumes</Eyebrow>
          <div className={styles.brandList}>
            {trustedBrands.map((brand) => <span key={brand}>{brand}</span>)}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className={`${styles.section} ${styles.toneBlack}`}>
        <div className={styles.container}>
          <div className={styles.editorialHeader} data-reveal="">
            <h2>Blogs &<br />Case Studies</h2>
            <Link href="/blogs" className={styles.secondaryButton}>View all →</Link>
          </div>
          <EditorialGrid cards={blogPosts} />
        </div>
      </section>

      <SectionDivider />

      <section className={`${styles.section} ${styles.toneBlack}`}>
        <div className={styles.faqContainer}>
          <h2 className={styles.faqTitle} data-reveal="">Common Questions</h2>
          <FaqList items={homeFaqs} />
        </div>
      </section>

      <SectionDivider tone="red" />
      <PageCta tone="red" />
    </SiteFrame>
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
          <Eyebrow>The Team</Eyebrow>
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

export function PrivateLabelPage() {
  return (
    <SiteFrame>
      <section className={`${styles.productHero} ${styles.privateHero} ${styles.toneRed}`}>
        <div className={styles.productHeroArt}>
          <Image src={`${assetRoot}/product-1.png`} alt="Private-label fragrance bottles and packaging" fill sizes="60vw" priority />
        </div>
        <div className={styles.productHeroVeil} />
        <div className={styles.productHeroInner}>
          <Eyebrow tone="red">Core Service · 01</Eyebrow>
          <h1 data-reveal="">Private Label</h1>
          <p data-reveal="">Choose from an extensive catalogue of bottles, caps and packaging. We work with our manufacturing partner in the UAE to produce your bespoke fragrance — to your brief, at your volume.</p>
          <Link href="/contact?interest=Private%20Label" className={styles.primaryButton} data-reveal="">Start your product</Link>
        </div>
      </section>
      <SectionDivider tone="red" />
      <section className={`${styles.section} ${styles.toneRed}`}>
        <div className={`${styles.container} ${styles.processGrid}`}>
          <div data-reveal="">
            <Eyebrow>The Process</Eyebrow>
            <h2 className={styles.sectionTitle}>Manufacturing<br />Process</h2>
            <p className={styles.bodyCopy}>From enquiry to launch, everything runs through direct access to TAC Perfumes — no middlemen, better pricing, faster timelines and full quality control.</p>
            <div className={styles.labImage}>
              <Image src={`${assetRoot}/lab.png`} alt="Fragrance laboratory" fill sizes="(max-width: 860px) 100vw, 50vw" />
            </div>
          </div>
          <div className={styles.processList} data-reveal="">
            {processSteps.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <SectionDivider tone="red" />
      <PageCta tone="red" />
    </SiteFrame>
  );
}

export function BlendEnginePage() {
  return (
    <SiteFrame>
      <section className={`${styles.centerProductHero} ${styles.toneBlue}`}>
        <div className={styles.centerProductHeroInner}>
          <Eyebrow tone="blue">Tech & AI · Blend Engine</Eyebrow>
          <h1 data-reveal="">Create. Blend.<br />License.</h1>
          <p data-reveal="">Our AI blending platform lets users combine fragrance oils to create unique, market-ready perfumes — licensed as a monthly subscription with quarterly oil commitments.</p>
          <Link href="/contact?interest=Blend%20Engine" className={styles.blueButton} data-reveal="">Enquire about licensing</Link>
        </div>
      </section>
      <SectionDivider tone="blue" />
      <section className={`${styles.sectionCompact} ${styles.toneBlue}`}>
        <div className={styles.productDemoContainer}>
          <BlendInterface detailed />
          <div className={styles.featureGrid}>
            {blendFeatures.map((feature) => (
              <article key={feature.title} data-reveal="">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <SectionDivider tone="blue" />
      <PageCta tone="blue" />
    </SiteFrame>
  );
}

export function AlchemyEnginePage() {
  return (
    <SiteFrame>
      <section className={`${styles.centerProductHero} ${styles.toneAmber}`}>
        <div className={styles.centerProductHeroInner}>
          <Eyebrow tone="amber">Tech & AI · Alchemy Engine · In Development</Eyebrow>
          <h1 data-reveal="">The World&apos;s First Fragrance Formulation AI</h1>
          <p data-reveal="">Trained on the chemistry behind fragrance creation — designed for chemists and fragrance houses to accelerate formulation, reduce trial and error, and deepen understanding of how ingredients interact at a molecular level.</p>
          <Link href="/contact?interest=Alchemy%20Engine" className={styles.amberButton} data-reveal="">Register your interest</Link>
        </div>
      </section>
      <SectionDivider tone="amber" />
      <section className={`${styles.sectionCompact} ${styles.toneAmber}`}>
        <div className={styles.productDemoContainer}>
          <AlchemyInterface detailed />
          <p className={styles.demoFootnote} data-reveal="">Alchemy Engine is currently in development. We&apos;re logging formulations, building the dataset, and preparing for early licensing partnerships.</p>
        </div>
      </section>
      <SectionDivider tone="amber" />
      <PageCta tone="amber" />
    </SiteFrame>
  );
}

export function BlogsPage() {
  return (
    <SiteFrame>
      <section className={`${styles.listingHero} ${styles.toneBlack}`}>
        <div className={styles.container}>
          <Eyebrow>Journal</Eyebrow>
          <h1 data-reveal="">Blogs</h1>
        </div>
      </section>
      <SectionDivider />
      <section className={`${styles.listingSection} ${styles.toneBlack}`}>
        <div className={styles.container}>
          <EditorialGrid cards={blogPosts} showDates />
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
            <article key={study.title} className={styles.caseCard} data-reveal="">
              <div className={styles.caseImage}>
                <Image src={study.image} alt="" fill sizes="(max-width: 860px) 100vw, 45vw" />
              </div>
              <div className={styles.caseCopy}>
                <span className={styles.articleMeta}>{study.category}</span>
                <h2>{study.title}</h2>
                <p>{study.description}</p>
                <div className={styles.caseMetrics}>
                  {study.metrics.map((metric) => (
                    <span key={metric.label}><strong>{metric.value}</strong><small>{metric.label}</small></span>
                  ))}
                </div>
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
              <div><Eyebrow>Email</Eyebrow><a href="mailto:hello@basenotesolutions.com">hello@basenotesolutions.com</a></div>
              <div><Eyebrow>Locations</Eyebrow><span>United Arab Emirates · United Kingdom</span></div>
            </div>
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
  body: ReadonlyArray<string>;
  title: string;
};

export function LegalPage({
  intro,
  lastUpdated,
  sections,
  title
}: {
  intro: string;
  lastUpdated: string;
  sections: ReadonlyArray<LegalSection>;
  title: string;
}) {
  return (
    <SiteFrame>
      <section className={`${styles.listingHero} ${styles.toneBlack}`}>
        <div className={styles.container}>
          <Eyebrow>Draft legal page</Eyebrow>
          <h1 data-reveal="">{title}</h1>
          <p className={styles.legalIntro} data-reveal="">{intro}</p>
        </div>
      </section>
      <SectionDivider />
      <section className={`${styles.section} ${styles.toneBlack}`}>
        <div className={`${styles.container} ${styles.legalLayout}`}>
          <aside className={styles.legalMeta}>
            <Eyebrow>Last updated</Eyebrow>
            <strong>{lastUpdated}</strong>
            <p>This page is a launch-preparation draft and should be reviewed with legal counsel before final publication.</p>
          </aside>
          <div className={styles.legalSections}>
            {sections.map((section) => (
              <section key={section.title} data-reveal="">
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>
            ))}
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
