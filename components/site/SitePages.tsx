"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, type ReactNode } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import {
  alchemyFaqs,
  alchemyMedia,
  audienceSegments,
  blendFaqs,
  blendMedia,
  blogPosts,
  caseStudies,
  privateLabelFaqs,
  services,
  teamMembers,
  type EditorialCard,
  type FaqItem,
  type ProductMedia
} from "@/data/site-content";

import InquiryForm from "./InquiryForm";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

import styles from "./SitePages.module.css";

type SiteFrameProps = {
  children: ReactNode;
};

function SiteFrame({ children }: SiteFrameProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = gsap.utils.selector(rootRef);

      if (reduceMotion) {
        return;
      }

      q("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true
            }
          }
        );
      });

      q("[data-parallax]").forEach((element) => {
        gsap.fromTo(
          element,
          { yPercent: -3, scale: 1.035 },
          {
            yPercent: 3,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8
            }
          }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className={styles.page}>
      <SiteHeader />
      <main id="main-content" className={styles.main}>{children}</main>
      <SiteFooter />
    </div>
  );
}

function Divider() {
  return <div className={styles.divider} aria-hidden="true" />;
}

type SectionHeaderProps = {
  eyebrow: string;
  lede?: string;
  title: string;
};

function SectionHeader({ eyebrow, lede, title }: SectionHeaderProps) {
  return (
    <div className={styles.sectionHeader} data-reveal="">
      <div className={styles.copyStack}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      {lede ? <p className={styles.lede}>{lede}</p> : <div />}
    </div>
  );
}

function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className={styles.faqList}>
      {items.map((item) => (
        <details key={item.question} className={styles.faqItem} data-reveal="">
          <summary className={styles.faqQuestion}>{item.question}</summary>
          <p className={styles.faqAnswer}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

function InquirySection({
  defaultInterest,
  title = "Tell us what you are building"
}: {
  defaultInterest?: string;
  title?: string;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.inquiryLayout}>
          <div className={styles.imageFrame} data-reveal="">
            <Image
              src="/media/basenote/contact-still.png"
              alt="Fragrance bottles arranged in a dark studio"
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
              data-parallax=""
            />
          </div>
          <div className={styles.copyStack} data-reveal="">
            <span className={styles.eyebrow}>Get in touch</span>
            <h2 className={`${styles.sectionTitle} ${styles.sectionTitleSmall}`}>{title}</h2>
            <p className={styles.bodyCopy}>
              Share the product, business, or technology problem you are working through. We will reply with the most useful next step.
            </p>
            <InquiryForm defaultInterest={defaultInterest} variant="compact" />
          </div>
        </div>
      </div>
    </section>
  );
}

function EditorialGrid({ cards }: { cards: EditorialCard[] }) {
  return (
    <div className={styles.editorialGrid}>
      {cards.map((card) => {
        const content = (
          <>
            <div className={styles.editorialImage}>
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
            <div>
              <span className={styles.articleMeta}>{card.category}</span>
              <h3 className={styles.articleTitle}>{card.title}</h3>
              <p className={styles.articleDescription}>{card.description}</p>
            </div>
          </>
        );

        return card.href ? (
          <Link key={card.title} href={card.href} className={styles.editorialCard} data-reveal="">
            {content}
          </Link>
        ) : (
          <article key={card.title} className={styles.editorialCard} data-reveal="">
            {content}
          </article>
        );
      })}
    </div>
  );
}

function ProductMediaPanel({ media, accent }: { media: ProductMedia; accent: "amber" | "blue" }) {
  if (media.status === "video" && media.sources) {
    return (
      <video controls poster={media.poster} preload="metadata">
        {media.sources.webm ? <source src={media.sources.webm} type="video/webm" /> : null}
        {media.sources.mp4 ? <source src={media.sources.mp4} type="video/mp4" /> : null}
      </video>
    );
  }

  return (
    <div
      className={`${styles.placeholder} ${accent === "amber" ? styles.placeholderAmber : ""}`}
      data-reveal=""
      role="img"
      aria-label={`${media.title}. ${media.description}`}
    >
      <div className={styles.placeholderInner}>
        <span className={styles.eyebrow}>Media placeholder</span>
        <span className={styles.playGlyph} aria-hidden="true">▶</span>
        <h3>{media.title}</h3>
        <p>{media.description}</p>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <SiteFrame>
      <section className={styles.hero}>
        <div className={`${styles.heroMedia} ${styles.heroMediaRight}`}>
          <Image
            src="/media/basenote/hero-perfume.png"
            alt="Perfume mist surrounding a dark glass fragrance bottle"
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <div className={styles.heroCopy} data-reveal="">
            <span className={styles.eyebrow}>Fragrance product, brand & technology</span>
            <h1 className={styles.display}>A fragrance business should not need five different partners.</h1>
            <p className={styles.lede}>
              Basenote connects private-label manufacturing, brand creation, and purpose-built fragrance technology so you can move from idea to market with one team.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryLink} href="/contact">Tell us what you are building</Link>
              <Link className={styles.secondaryLink} href="#solutions">Explore the solutions</Link>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      <section className={styles.section}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="What Basenote does"
            title="One partner across the fragrance journey"
            lede="The industry is fragmented. Product, brand, supply, and software are usually managed separately. Basenote connects them around the business you are actually trying to build."
          />
          <div className={styles.diagram} aria-label="Basenote solutions and audiences">
            <div className={styles.diagramCenter} data-reveal="">
              <span className={styles.eyebrow}>The single solution</span>
              <h3>Basenote Solutions</h3>
            </div>
            {audienceSegments.map((segment) => (
              <article key={segment.title} className={styles.diagramItem} data-reveal="">
                <span className={styles.eyebrow}>Built for</span>
                <h3>{segment.title}</h3>
                <p>{segment.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      <section id="solutions" className={styles.section}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="Three connected services"
            title="Choose where your business needs to move"
            lede="Start with a product, a customer-facing platform, or formulation technology. Each service connects to the same fragrance and technical ecosystem."
          />
          <div className={styles.serviceGrid}>
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className={`${styles.serviceCard} ${styles[`service${service.accent[0].toUpperCase()}${service.accent.slice(1)}`]}`}
                data-reveal=""
              >
                <div className={styles.serviceImage}>
                  <Image src={service.image} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" />
                </div>
                <div className={styles.serviceImageShade} />
                <div className={styles.serviceContent}>
                  <span className={styles.eyebrow}>{service.eyebrow}</span>
                  <h2 className={styles.cardTitle}>{service.title}</h2>
                  <p>{service.description}</p>
                  <span className={styles.serviceArrow}>Explore service ↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      <section className={styles.section}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="Ideas & work"
            title="Inside the industry"
            lede="Practical thinking on building fragrance products, operating better experiences, and developing technology grounded in real industry work."
          />
          <EditorialGrid cards={[caseStudies[0], blogPosts[1], blogPosts[2]]} />
          <div className={styles.actions} data-reveal="">
            <Link href="/blogs" className={styles.secondaryLink}>View blogs</Link>
            <Link href="/case-studies" className={styles.secondaryLink}>View case studies</Link>
          </div>
        </div>
      </section>

      <Divider />
      <InquirySection />
    </SiteFrame>
  );
}

const builderSteps = [
  {
    label: "Choose the product",
    options: ["Eau de parfum", "Home fragrance", "Fragrance oil"]
  },
  {
    label: "Choose the direction",
    options: ["Fresh & clean", "Warm & woody", "Rich & oriental"]
  },
  {
    label: "Choose the presentation",
    options: ["Minimal", "Classic luxury", "Bold & contemporary"]
  }
];

export function PrivateLabelPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selections, setSelections] = useState<string[]>(["", "", ""]);

  const summary = useMemo(
    () => selections.filter(Boolean).join(" · ") || "Make three simple choices to shape your starting brief.",
    [selections]
  );

  const chooseOption = (option: string) => {
    setSelections((current) => current.map((value, index) => (index === activeStep ? option : value)));
  };

  const briefHref = `/contact?interest=${encodeURIComponent("Private Label")}&brief=${encodeURIComponent(
    `Private-label starting brief: ${summary}`
  )}`;

  return (
    <SiteFrame>
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Image src="/media/basenote/private-label-hero.png" alt="Dark fragrance bottle and laboratory glassware" fill sizes="100vw" priority />
        </div>
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <div className={styles.heroCopy} data-reveal="">
            <span className={`${styles.eyebrow} ${styles.eyebrowRed}`}>Private Label</span>
            <h1 className={styles.display}>Launch the product without building the supply chain.</h1>
            <p className={styles.lede}>
              Direct UAE manufacturing access, product guidance, packaging direction, and optional brand support — scoped around what you are ready to build.
            </p>
            <div className={styles.actions}>
              <Link href="#build" className={styles.primaryLink}>Build your starting brief</Link>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      <section id="build" className={styles.section}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="Build your product"
            title="Start with three decisions"
            lede="This lightweight configurator creates a useful conversation starter. It does not calculate pricing or place an order."
          />
          <div className={styles.builder} data-reveal="">
            <div className={styles.builderNav} role="tablist" aria-label="Product brief steps">
              {builderSteps.map((step, index) => (
                <button
                  key={step.label}
                  type="button"
                  role="tab"
                  aria-selected={activeStep === index}
                  aria-controls={`builder-panel-${index}`}
                  className={`${styles.builderStep} ${activeStep === index ? styles.builderStepActive : ""}`}
                  onClick={() => setActiveStep(index)}
                >
                  <span>0{index + 1}</span>
                  <span>{step.label}</span>
                </button>
              ))}
            </div>
            <div className={styles.builderPanel} id={`builder-panel-${activeStep}`} role="tabpanel">
              <span className={`${styles.eyebrow} ${styles.eyebrowRed}`}>Step 0{activeStep + 1}</span>
              <h3>{builderSteps[activeStep].label}</h3>
              <div className={styles.optionGrid}>
                {builderSteps[activeStep].options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.optionButton} ${selections[activeStep] === option ? styles.optionButtonSelected : ""}`}
                    aria-pressed={selections[activeStep] === option}
                    onClick={() => chooseOption(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className={styles.builderFooter}>
                <p className={styles.summary}>
                  Your starting brief
                  <strong>{summary}</strong>
                </p>
                {activeStep < builderSteps.length - 1 ? (
                  <button type="button" className={styles.primaryLink} onClick={() => setActiveStep((step) => step + 1)}>
                    Next step
                  </button>
                ) : (
                  <Link href={briefHref} className={styles.primaryLink}>Book consultation</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      <section className={`${styles.section} ${styles.tintRed}`}>
        <div className={styles.container}>
          <div className={styles.split}>
            <div className={styles.copyStack} data-reveal="">
              <span className={`${styles.eyebrow} ${styles.eyebrowRed}`}>Manufacturing process</span>
              <h2 className={styles.sectionTitle}>A clear route from brief to production</h2>
              <p className={styles.bodyCopy}>
                We scope the product, confirm the practical component and fragrance direction, coordinate sampling and approvals, then move into production with TAC Perfumes in the UAE.
              </p>
            </div>
            <div className={styles.imageFrame} data-reveal="">
              <Image src="/media/basenote/manufacturing-line.png" alt="Fragrance production line inside a manufacturing facility" fill sizes="(max-width: 760px) 100vw, 50vw" data-parallax="" />
            </div>
          </div>
          <div className={styles.stepList}>
            {[
              ["01", "Scope", "Product, volume, timing, and commercial goals."],
              ["02", "Select", "Fragrance direction, bottle, cap, and packaging."],
              ["03", "Approve", "Samples, artwork, components, and production detail."],
              ["04", "Produce", "Manufacturing, quality control, and launch planning."]
            ].map(([number, title, description]) => (
              <article key={number} className={styles.step} data-reveal="">
                <span className={styles.stepNumber}>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Divider />
      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <SectionHeader eyebrow="Frequently asked questions" title="Private-label essentials" />
          <FaqList items={privateLabelFaqs} />
        </div>
      </section>
      <Divider />
      <InquirySection defaultInterest="Private Label" title="Scope your private-label project" />
    </SiteFrame>
  );
}

type ProductPageProps = {
  accent: "amber" | "blue";
  eyebrow: string;
  faqs: FaqItem[];
  features: Array<{ description: string; title: string }>;
  heroImage: string;
  heroTitle: string;
  interest: string;
  intro: string;
  media: ProductMedia;
  name: string;
};

export function ProductPage({
  accent,
  eyebrow,
  faqs,
  features,
  heroImage,
  heroTitle,
  interest,
  intro,
  media,
  name
}: ProductPageProps) {
  const accentClass = accent === "blue" ? styles.eyebrowBlue : styles.eyebrowAmber;
  const tintClass = accent === "blue" ? styles.tintBlue : styles.tintAmber;

  return (
    <SiteFrame>
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Image src={heroImage} alt={`${name} fragrance technology environment`} fill sizes="100vw" priority />
        </div>
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <div className={styles.heroCopy} data-reveal="">
            <span className={`${styles.eyebrow} ${accentClass}`}>{eyebrow}</span>
            <h1 className={styles.display}>{heroTitle}</h1>
            <p className={styles.lede}>{intro}</p>
            <div className={styles.actions}>
              <Link href="#enquire" className={styles.primaryLink}>{name === "Alchemy Engine" ? "Register your interest" : "Enquire about licensing"}</Link>
            </div>
          </div>
        </div>
      </section>

      <Divider />
      <section className={`${styles.section} ${tintClass}`}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow={`How ${name} works`}
            title="Designed around a real fragrance workflow"
            lede={name === "Blend Engine"
              ? "A guided platform that helps operators lead customers through compatible fragrance oils, save combinations, and create a more consistent in-store experience."
              : "A formulation-focused AI being developed from chemistry data logged by our in-house team, with tools intended to reduce trial and error and deepen technical understanding."}
          />
          <div className={styles.mediaStory}>
            <div className={styles.imageFrameTall} data-reveal="">
              <Image
                src={name === "Blend Engine" ? "/media/basenote/blend-feature.png" : "/media/basenote/alchemy-demo.png"}
                alt={`${name} product setting`}
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
                data-parallax=""
              />
            </div>
            <div className={styles.copyStack} data-reveal="">
              <span className={`${styles.eyebrow} ${accentClass}`}>Built for operators</span>
              <h2 className={styles.sectionTitle}>{name === "Blend Engine" ? "Make guided creation repeatable" : "Explore formulation with better context"}</h2>
              <p className={styles.bodyCopy}>
                {name === "Blend Engine"
                  ? "The platform is licensed around the environment in which it runs. Catalogue setup, onboarding, branding, and fragrance-oil supply are scoped together so the software works as part of the operation."
                  : "Alchemy Engine is not a generic chatbot wrapped in fragrance language. The development process starts with structured formulation work, chemistry knowledge, and a clear view of how technical teams evaluate results."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Divider />
      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <div className={styles.featureList}>
            {features.map((feature, index) => (
              <article key={feature.title} className={styles.feature} data-reveal="">
                <span className={styles.featureNumber}>0{index + 1}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Divider />
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionHeader eyebrow="Product media" title="See the platform in context" lede="The production-ready media component is in place. Final film assets, posters, and captions will be added when supplied." />
          <ProductMediaPanel media={media} accent={accent} />
        </div>
      </section>

      {name === "Blend Engine" ? (
        <>
          <Divider />
          <section className={styles.section}>
            <div className={styles.container}>
              <SectionHeader eyebrow="Licensing" title="A plan shaped around the operation" lede="No unverified public pricing. We scope licensing against usage, locations, onboarding, catalogue setup, and oil supply." />
              <div className={styles.tierGrid}>
                {[
                  ["Studio", "For one guided creation environment or fragrance studio."],
                  ["Professional", "For established teams that need broader configuration and support."],
                  ["Enterprise", "For multi-location, branded, or strategically integrated programmes."]
                ].map(([title, description], index) => (
                  <article key={title} className={`${styles.tierCard} ${index === 1 ? styles.tierCardFeatured : ""}`} data-reveal="">
                    <span className={styles.eyebrow}>Contact for pricing</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <Link href="/contact?interest=Blend%20Engine" className={styles.smallLink}>Enquire</Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}

      <Divider />
      <section className={styles.sectionCompact}>
        <div className={styles.container}>
          <SectionHeader eyebrow="Frequently asked questions" title={`Questions about ${name}`} />
          <FaqList items={faqs} />
        </div>
      </section>
      <Divider />
      <div id="enquire">
        <InquirySection defaultInterest={interest} title={name === "Alchemy Engine" ? "Register for an early conversation" : "Discuss a Blend Engine licence"} />
      </div>
    </SiteFrame>
  );
}

export function BlendEnginePage() {
  return (
    <ProductPage
      accent="blue"
      eyebrow="Blend Engine"
      name="Blend Engine"
      heroTitle="Turn fragrance blending into a repeatable experience."
      intro="A licensable platform for studios, labs, and retailers that want to guide customers through fragrance-oil blending with more structure and consistency."
      heroImage="/media/basenote/blend-hero.png"
      interest="Blend Engine"
      media={blendMedia}
      faqs={blendFaqs}
      features={[
        { title: "Guided selection", description: "Lead customers through a structured fragrance-oil catalogue." },
        { title: "Saved combinations", description: "Capture blend choices so the experience can continue after the visit." },
        { title: "Brand-ready setup", description: "Configure the environment around the operator and customer journey." },
        { title: "Oil supply", description: "Connect the platform to a dependable fragrance-oil programme." }
      ]}
    />
  );
}

export function AlchemyEnginePage() {
  return (
    <ProductPage
      accent="amber"
      eyebrow="Alchemy Engine"
      name="Alchemy Engine"
      heroTitle="Formulation intelligence grounded in real chemistry."
      intro="An AI platform in development for chemists and fragrance teams, trained on proprietary formulation data recorded by our in-house technical team."
      heroImage="/media/basenote/alchemy-hero.png"
      interest="Alchemy Engine"
      media={alchemyMedia}
      faqs={alchemyFaqs}
      features={[
        { title: "Structured data", description: "Built from logged formulation work rather than generic internet text." },
        { title: "Faster exploration", description: "Support earlier technical thinking and reduce avoidable trial and error." },
        { title: "Interaction context", description: "Develop a clearer view of how ingredients and decisions affect a formula." },
        { title: "Partner access", description: "Shape early licensing with teams who understand the operational need." }
      ]}
    />
  );
}

export function AboutPage() {
  return (
    <SiteFrame>
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Image src="/media/basenote/manufacturing-line.png" alt="Basenote fragrance manufacturing environment" fill sizes="100vw" priority />
        </div>
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <div className={styles.heroCopy} data-reveal="">
            <span className={styles.eyebrow}>About Basenote</span>
            <h1 className={styles.display}>Fragrance industry. Technology mindset.</h1>
            <p className={styles.lede}>A connected team helping founders and operators move from product idea to market-ready business.</p>
          </div>
        </div>
      </section>

      <Divider />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.split}>
            <div className={styles.imageFrame} data-reveal="">
              <Image src="/media/basenote/lab-closeup.png" alt="Fragrance laboratory bottles and equipment" fill sizes="(max-width: 760px) 100vw, 50vw" data-parallax="" />
            </div>
            <div className={styles.copyStack} data-reveal="">
              <span className={styles.eyebrow}>Our story</span>
              <h2 className={styles.sectionTitle}>Built between manufacturing and technology</h2>
              <p className={styles.bodyCopy}>
                Basenote Solutions draws on direct access to TAC Perfumes in the UAE and a dedicated development team at Arizmi Labs. That combination lets us approach a fragrance business as one connected problem — not a chain of disconnected suppliers.
              </p>
              <p className={styles.bodyCopy}>
                We operate as a focused team across product, brand, project delivery, chemistry, and software. The goal is practical: fewer hand-offs, clearer decisions, and stronger foundations for launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Divider />
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionHeader eyebrow="How we work" title="Direct access. Practical delivery." lede="We stay close to the work — factory, formulation, creative, and software — so recommendations are grounded in real operational constraints." />
          <div className={styles.featureList}>
            {[
              ["01", "Direct factory access", "Manufacturing through TAC Perfumes in the UAE, without a chain of unnecessary middlemen."],
              ["02", "In-house technology", "A development team building the tools and digital infrastructure behind the offer."],
              ["03", "Quality-aware delivery", "Sampling, approval, and production decisions coordinated around a clear brief."],
              ["04", "End-to-end thinking", "Product, brand, website, and technology considered as one business system."]
            ].map(([number, title, description]) => (
              <article key={number} className={styles.feature} data-reveal="">
                <span className={styles.featureNumber}>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Divider />
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionHeader eyebrow="The team" title="Small, senior, connected" lede="Experience across fragrance, brand, technical development, and day-to-day delivery." />
          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <article key={member.name} className={styles.teamCard} data-reveal="">
                <span className={styles.teamRole}>{member.role}</span>
                <h3>{member.name}</h3>
                <p>{member.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Divider />
      <InquirySection />
    </SiteFrame>
  );
}

type EditorialPageProps = {
  cards: EditorialCard[];
  eyebrow: string;
  heroImage: string;
  intro: string;
  title: string;
};

export function EditorialPage({ cards, eyebrow, heroImage, intro, title }: EditorialPageProps) {
  const [featured, ...rest] = cards;

  return (
    <SiteFrame>
      <section className={`${styles.hero} ${styles.editorialHero}`}>
        <div className={styles.heroMedia}>
          <Image src={heroImage} alt="Fragrance editorial workspace" fill sizes="100vw" loading="eager" />
        </div>
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <div className={styles.heroCopy} data-reveal="">
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1 className={styles.display}>{title}</h1>
            <p className={styles.lede}>{intro}</p>
          </div>
        </div>
      </section>

      <Divider />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.featuredArticle} data-reveal="">
            <div className={styles.featuredImage}>
              <Image src={featured.image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />
            </div>
            <div className={styles.featuredCopy}>
              <span className={styles.articleMeta}>{featured.category} · Featured</span>
              <h2>{featured.title}</h2>
              <p>{featured.description}</p>
            </div>
          </div>
        </div>
      </section>

      <Divider />
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionHeader eyebrow={`More ${eyebrow}`} title="Explore the collection" lede="These are review-ready summaries. Article and case-study links will appear only when a published destination exists." />
          <EditorialGrid cards={rest} />
        </div>
      </section>
    </SiteFrame>
  );
}

export function BlogsPage() {
  return (
    <EditorialPage
      eyebrow="Blogs"
      title="Notes from inside fragrance"
      intro="Practical thinking for founders, operators, and technical teams building the next generation of fragrance businesses."
      heroImage="/media/basenote/editorial-ingredients.png"
      cards={blogPosts}
    />
  );
}

export function CaseStudiesPage() {
  return (
    <EditorialPage
      eyebrow="Case studies"
      title="Work shaped around the business"
      intro="Selected product, brand, and supply programmes presented without unsupported client claims or invented performance metrics."
      heroImage="/media/basenote/editorial-lab.png"
      cards={caseStudies}
    />
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
      <section className={`${styles.hero} ${styles.contactHero}`}>
        <div className={styles.heroMedia}>
          <Image src="/media/basenote/contact-still.png" alt="Fragrance bottles in a dark studio" fill sizes="100vw" priority />
        </div>
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <div className={styles.heroCopy} data-reveal="">
            <span className={styles.eyebrow}>Contact</span>
            <h1 className={styles.display}>Tell us what you are building.</h1>
            <p className={styles.lede}>A product, a brand, or a technology partnership — share enough context for our first reply to be useful.</p>
          </div>
        </div>
      </section>
      <Divider />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.inquiryLayout}>
            <div className={styles.copyStack} data-reveal="">
              <span className={styles.eyebrow}>Start the conversation</span>
              <h2 className={styles.sectionTitle}>Give us the brief</h2>
              <p className={styles.bodyCopy}>Useful details include the product stage, target market, intended timing, and the type of support you need.</p>
            </div>
            <div data-reveal="">
              <InquiryForm defaultInterest={defaultInterest} defaultMessage={defaultMessage} />
            </div>
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
      <section className={`${styles.hero} ${styles.contactHero}`}>
        <div className={styles.heroContent}>
          <div className={styles.heroCopy} data-reveal="">
            <span className={styles.eyebrow}>Draft legal page</span>
            <h1 className={styles.display}>{title}</h1>
            <p className={styles.lede}>{intro}</p>
          </div>
        </div>
      </section>
      <Divider />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.legalLayout}>
            <aside className={styles.legalMeta}>
              <span>Last updated</span>
              <strong>{lastUpdated}</strong>
              <div className={styles.legalNotice}>
                This page is a launch-preparation draft and should be reviewed with legal counsel before final publication.
              </div>
            </aside>
            <div className={styles.legalSections}>
              {sections.map((section) => (
                <section key={section.title} className={styles.legalSection} data-reveal="">
                  <h2>{section.title}</h2>
                  {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
