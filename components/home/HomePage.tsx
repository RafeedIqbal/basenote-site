"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { HomePageContent } from "@/data/home-content";
import { gsap, useGSAP } from "@/lib/gsap";

import BasenoteSymbol from "./BasenoteSymbol";
import styles from "./HomePage.module.css";

type HomePageProps = {
  content: HomePageContent;
};

function splitIntoAnimatedCharacters(text: string) {
  return Array.from(text).map((character, index) => (
    <span
      key={`${character}-${index}`}
      className={styles.opportunityChar}
      data-opportunity-char=""
    >
      {character === " " ? "\u00A0" : character}
    </span>
  ));
}

export default function HomePage({ content }: HomePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [activePillarId, setActivePillarId] = useState(
    content.pillars.items[0]?.id ?? ""
  );
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const previousMenuOpen = useRef(false);
  const activePillar =
    content.pillars.items.find((item) => item.id === activePillarId) ??
    content.pillars.items[0];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      const timer = window.setTimeout(() => {
        firstMenuLinkRef.current?.focus();
      }, 120);

      previousMenuOpen.current = true;

      return () => {
        window.clearTimeout(timer);
      };
    }

    if (previousMenuOpen.current) {
      menuButtonRef.current?.focus();
      previousMenuOpen.current = false;
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const media = gsap.matchMedia();

      gsap.set("[data-logo-symbol]", { opacity: 0.08, scale: 0.92 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-word]", {
          yPercent: 108,
          duration: 1.1,
          stagger: 0.1
        })
        .from(
          "[data-hero-copy]",
          {
            opacity: 0,
            y: 28,
            duration: 0.75
          },
          "-=0.65"
        )
        .from(
          "[data-hero-actions] > *",
          {
            opacity: 0,
            y: 18,
            duration: 0.55,
            stagger: 0.08
          },
          "-=0.45"
        );

      gsap.to("[data-logo-symbol]", {
        opacity: 1,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          scrub: reduceMotion ? false : 1
        }
      });

      const opportunityCharacters =
        gsap.utils.toArray<HTMLElement>("[data-opportunity-char]");

      if (reduceMotion) {
        gsap.to(opportunityCharacters, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.008,
          scrollTrigger: {
            trigger: "[data-opportunity]",
            start: "top 72%",
            once: true
          }
        });
      } else {
        gsap.timeline({
          scrollTrigger: {
            trigger: "[data-opportunity]",
            start: "top 72%",
            end: "bottom 45%",
            scrub: 1
          }
        }).to(opportunityCharacters, {
          opacity: 1,
          y: 0,
          ease: "none",
          stagger: 0.018
        });
      }

      gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .forEach((element, index) => {
          gsap.fromTo(
            element,
            {
              opacity: 0,
              y: reduceMotion ? 0 : 36
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              delay: index === 0 ? 0.1 : 0,
              scrollTrigger: {
                trigger: element,
                start: "top 84%",
                once: true
              }
            }
          );
        });

      media.add("(min-width: 901px)", () => {
        gsap.utils
          .toArray<HTMLElement>("[data-portfolio-card]")
          .forEach((card) => {
            gsap.fromTo(
              card,
              {
                opacity: reduceMotion ? 1 : 0.55,
                y: reduceMotion ? 0 : 72
              },
              {
                opacity: 1,
                y: 0,
                ease: "power3.out",
                duration: 0.9,
                scrollTrigger: {
                  trigger: card,
                  start: "top 92%",
                  end: reduceMotion ? "top 92%" : "top 58%",
                  scrub: reduceMotion ? false : 1
                }
              }
            );
          });
      });

      media.add("(max-width: 900px)", () => {
        gsap.utils
          .toArray<HTMLElement>("[data-mobile-card]")
          .forEach((card) => {
            const primary = card.querySelector<HTMLElement>("[data-mobile-primary]");
            const secondary = card.querySelector<HTMLElement>(
              "[data-mobile-secondary]"
            );

            if (!primary || !secondary) {
              return;
            }

            if (reduceMotion) {
              gsap.to(secondary, {
                opacity: 1,
                duration: 0.45,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 78%",
                  toggleActions: "play none none reverse"
                }
              });

              gsap.to(primary, {
                opacity: 0.18,
                duration: 0.45,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 78%",
                  toggleActions: "play none none reverse"
                }
              });

              return;
            }

            gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 82%",
                end: "bottom 40%",
                scrub: 1
              }
            })
              .to(
                primary,
                {
                  opacity: 0.2,
                  scale: 1.03,
                  ease: "none"
                },
                0
              )
              .to(
                secondary,
                {
                  opacity: 1,
                  scale: 1,
                  ease: "none"
                },
                0
              );
          });
      });

      return () => {
        media.revert();
      };
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-pillar-detail]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out"
        }
      );
    },
    {
      scope: rootRef,
      dependencies: [activePillarId],
      revertOnUpdate: true
    }
  );

  return (
    <div ref={rootRef} className={styles.page}>
      <header className={styles.siteHeader} data-menu-open={menuOpen}>
        <a
          className={styles.brandMark}
          href="#home"
          aria-label="Basenote Solutions home"
        >
          <BasenoteSymbol className={styles.headerSymbol} data-logo-symbol="" />
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span className={styles.menuButtonLabel}>
            {menuOpen ? "Close" : "Menu"}
          </span>
        </button>
      </header>

      <div
        id="site-menu"
        className={styles.menuOverlay}
        data-open={menuOpen}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={styles.menuBackdrop}
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation overlay"
        />
        <div className={styles.menuPanel}>
          <div className={styles.menuColumn}>
            <span className={styles.eyebrow}>Navigation</span>
            <nav className={styles.menuNav} aria-label="Primary">
              {content.nav.map((item, index) => (
                <a
                  key={item.href}
                  ref={index === 0 ? firstMenuLinkRef : undefined}
                  href={item.href}
                  className={styles.menuLink}
                  onClick={() => setMenuOpen(false)}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <span className={styles.menuNumber}>{item.number}</span>
                  <span className={styles.menuText}>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className={styles.menuMeta}>
            <div>
              <span className={styles.eyebrow}>Basenote Solutions</span>
              <p className={styles.menuSummary}>{content.hero.supporting}</p>
            </div>

            <div className={styles.menuContact}>
              <div>
                <span className={styles.eyebrow}>Contact</span>
                <a
                  href={`mailto:${content.contact.email}`}
                  className={styles.menuEmail}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  {content.contact.email}
                </a>
              </div>
              <p className={styles.menuFootnote}>{content.contact.note}</p>
            </div>
          </div>
        </div>
      </div>

      <main>
        <section id="home" data-hero="" className={styles.heroSection}>
          <div className={styles.heroMedia} aria-hidden="true">
            <video
              className={styles.heroVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            >
              <source src="/media/hero-background.mp4" type="video/mp4" />
            </video>
            <div className={styles.heroGradient} />
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopyBlock}>
              <p className={styles.heroKicker}>{content.hero.kicker}</p>
              <h1 className={styles.heroTitle}>
                {content.hero.brandLines.map((line) => (
                  <span key={line} className={styles.heroTitleLine}>
                    <span data-hero-word="">{line}</span>
                  </span>
                ))}
              </h1>
            </div>

            <div className={styles.heroSide}>
              <p className={styles.heroSummary} data-hero-copy="">
                {content.hero.summary}
              </p>
              <p className={styles.heroSupporting}>{content.hero.supporting}</p>
              <div className={styles.heroActions} data-hero-actions="">
                <a href="#contact" className={styles.primaryButton}>
                  Book a call
                </a>
                <a href="#portfolio" className={styles.secondaryButton}>
                  Browse portfolio
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="opportunity" className={styles.opportunitySection}>
          <div className={styles.sectionIntro} data-reveal="">
            <span className={styles.eyebrow}>{content.opportunity.eyebrow}</span>
            <div className={styles.sectionIntroBody}>
              <h2 className={styles.sectionHeading}>{content.opportunity.heading}</h2>
              <p className={styles.sectionLede}>{content.opportunity.lede}</p>
            </div>
          </div>

          <div className={styles.opportunityCopy}>
            {content.opportunity.lines.map((line) => (
              <p key={line} className={styles.opportunityLine}>
                {splitIntoAnimatedCharacters(line)}
              </p>
            ))}
          </div>
        </section>

        <section id="portfolio" className={styles.lightSection}>
          <div className={styles.sectionShell}>
            <div className={styles.sectionIntro} data-reveal="">
              <span className={styles.eyebrowLight}>{content.portfolio.eyebrow}</span>
              <div className={styles.sectionIntroBody}>
                <h2 className={styles.sectionHeadingLight}>
                  {content.portfolio.heading}
                </h2>
                <p className={styles.sectionLedeLight}>{content.portfolio.lede}</p>
              </div>
            </div>

            <div className={styles.portfolioDesktop}>
              {content.portfolio.projects.map((project, index) => (
                <article
                  key={project.id}
                  className={styles.portfolioCard}
                  data-portfolio-card=""
                  style={{ "--card-order": index } as CSSProperties}
                >
                  <div className={styles.portfolioCardHeader}>
                    <div>
                      <p className={styles.portfolioCategory}>{project.category}</p>
                      <h3 className={styles.portfolioTitle}>{project.title}</h3>
                    </div>
                    <p className={styles.portfolioImpact}>{project.impact}</p>
                  </div>

                  <div className={styles.portfolioMediaGrid}>
                    {project.images.map((image) => (
                      <div key={image.src} className={styles.portfolioMediaFrame}>
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 900px) 100vw, 50vw"
                          className={styles.portfolioMedia}
                        />
                        <span className={styles.portfolioMediaCaption}>
                          {image.caption}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.portfolioCardFooter}>
                    <div>
                      <div className={styles.tagRow}>
                        {project.tags.map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className={styles.portfolioSummary}>{project.summary}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.portfolioMobile}>
              {content.portfolio.projects.map((project) => (
                <article
                  key={project.id}
                  className={styles.portfolioMobileCard}
                  data-mobile-card=""
                >
                  <div className={styles.portfolioCardHeader}>
                    <div>
                      <p className={styles.portfolioCategory}>{project.category}</p>
                      <h3 className={styles.portfolioTitle}>{project.title}</h3>
                    </div>
                    <p className={styles.portfolioImpact}>{project.impact}</p>
                  </div>

                  <div className={styles.portfolioMobileFrame}>
                    <div
                      className={`${styles.portfolioMobileLayer} ${styles.portfolioMobilePrimary}`}
                      data-mobile-primary=""
                    >
                      <Image
                        src={project.images[0].src}
                        alt={project.images[0].alt}
                        fill
                        sizes="100vw"
                        className={styles.portfolioMedia}
                      />
                    </div>
                    <div
                      className={`${styles.portfolioMobileLayer} ${styles.portfolioMobileSecondary}`}
                      data-mobile-secondary=""
                    >
                      <Image
                        src={project.images[1].src}
                        alt={project.images[1].alt}
                        fill
                        sizes="100vw"
                        className={styles.portfolioMedia}
                      />
                    </div>
                    <div className={styles.mobileMediaMeta}>
                      <span>{project.images[0].caption}</span>
                      <span>{project.images[1].caption}</span>
                    </div>
                  </div>

                  <div className={styles.tagRow}>
                    {project.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className={styles.portfolioSummary}>{project.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="what-we-do" className={styles.pillarsSection}>
          <div className={styles.sectionShell}>
            <div className={styles.sectionIntro} data-reveal="">
              <span className={styles.eyebrowOnAccent}>{content.pillars.eyebrow}</span>
              <div className={styles.sectionIntroBody}>
                <h2 className={styles.sectionHeadingOnAccent}>
                  {content.pillars.heading}
                </h2>
                <p className={styles.sectionLedeOnAccent}>{content.pillars.lede}</p>
              </div>
            </div>

            <div className={styles.pillarsDesktop}>
              <div className={styles.pillarList}>
                {content.pillars.items.map((item) => {
                  const isActive = item.id === activePillar?.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.pillarTrigger} ${
                        isActive ? styles.pillarTriggerActive : ""
                      }`}
                      aria-pressed={isActive}
                      onClick={() => setActivePillarId(item.id)}
                    >
                      <span className={styles.pillarStat}>{item.stat}</span>
                      <span className={styles.pillarTitle}>{item.title}</span>
                      <span className={styles.pillarSubtitle}>{item.subtitle}</span>
                    </button>
                  );
                })}
              </div>

              {activePillar ? (
                <article className={styles.pillarDetail} data-pillar-detail="">
                  <span className={styles.detailEyebrow}>{activePillar.eyebrow}</span>
                  <h3 className={styles.pillarDetailTitle}>{activePillar.title}</h3>
                  <p className={styles.pillarDetailCopy}>
                    {activePillar.description}
                  </p>
                  <ul className={styles.pillarBulletList}>
                    {activePillar.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ) : null}
            </div>

            <div className={styles.pillarsMobile}>
              {content.pillars.items.map((item) => {
                const isActive = item.id === activePillar?.id;
                const panelId = `${item.id}-panel`;

                return (
                  <article
                    key={item.id}
                    className={`${styles.mobilePillarItem} ${
                      isActive ? styles.mobilePillarItemActive : ""
                    }`}
                  >
                    <button
                      type="button"
                      className={styles.mobilePillarButton}
                      aria-expanded={isActive}
                      aria-controls={panelId}
                      onClick={() => setActivePillarId(item.id)}
                    >
                      <span className={styles.mobilePillarIcon}>{item.stat}</span>
                      <span className={styles.mobilePillarTitle}>{item.title}</span>
                      <span className={styles.mobilePillarToggle}>
                        {isActive ? "−" : "+"}
                      </span>
                    </button>

                    <div
                      id={panelId}
                      className={styles.mobilePillarPanel}
                      hidden={!isActive}
                    >
                      <p className={styles.mobilePillarCopy}>{item.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="services" className={styles.lightSection}>
          <div className={styles.sectionShell}>
            <div className={styles.sectionIntro} data-reveal="">
              <span className={styles.eyebrowLight}>
                {content.servicesBreakdown.eyebrow}
              </span>
              <div className={styles.sectionIntroBody}>
                <h2 className={styles.sectionHeadingLight}>
                  {content.servicesBreakdown.heading}
                </h2>
                <p className={styles.sectionLedeLight}>
                  {content.servicesBreakdown.lede}
                </p>
              </div>
            </div>

            <div className={styles.serviceGrid}>
              {content.pillars.items.map((item) => (
                <article key={item.id} className={styles.serviceCard} data-reveal="">
                  <span className={styles.serviceNumber}>{item.stat}</span>
                  <h3 className={styles.serviceTitle}>{item.title}</h3>
                  <ul className={styles.serviceList}>
                    {item.deliverables.map((deliverable) => (
                      <li key={deliverable}>{deliverable}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className={styles.lightSection}>
          <div className={styles.sectionShell}>
            <div className={styles.sectionIntro} data-reveal="">
              <span className={styles.eyebrowLight}>{content.process.eyebrow}</span>
              <div className={styles.sectionIntroBody}>
                <h2 className={styles.sectionHeadingLight}>{content.process.heading}</h2>
                <p className={styles.sectionLedeLight}>{content.process.lede}</p>
              </div>
            </div>

            <ol className={styles.processGrid}>
              {content.process.steps.map((step) => (
                <li key={step.step} className={styles.processItem} data-reveal="">
                  <span className={styles.processNumber}>{step.step}</span>
                  <div className={styles.processBody}>
                    <h3 className={styles.processTitle}>{step.title}</h3>
                    <p className={styles.processCopy}>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="why-basenote" className={styles.lightSection}>
          <div className={styles.sectionShell}>
            <div className={styles.sectionIntro} data-reveal="">
              <span className={styles.eyebrowLight}>{content.reasons.eyebrow}</span>
              <div className={styles.sectionIntroBody}>
                <h2 className={styles.sectionHeadingLight}>{content.reasons.heading}</h2>
                <p className={styles.sectionLedeLight}>{content.reasons.lede}</p>
              </div>
            </div>

            <div className={styles.reasonGrid}>
              {content.reasons.items.map((item, index) => (
                <article key={item.title} className={styles.reasonCard} data-reveal="">
                  <span className={styles.reasonIndex}>{`0${index + 1}`}</span>
                  <h3 className={styles.reasonTitle}>{item.title}</h3>
                  <p className={styles.reasonCopy}>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className={styles.lightSection}>
          <div className={styles.sectionShell}>
            <div className={styles.sectionIntro} data-reveal="">
              <span className={styles.eyebrowLight}>{content.faq.eyebrow}</span>
              <div className={styles.sectionIntroBody}>
                <h2 className={styles.sectionHeadingLight}>{content.faq.heading}</h2>
                <p className={styles.sectionLedeLight}>{content.faq.lede}</p>
              </div>
            </div>

            <div className={styles.faqList}>
              {content.faq.items.map((item, index) => {
                const isOpen = openFaqIndex === index;
                const panelId = `faq-panel-${index}`;

                return (
                  <article key={item.question} className={styles.faqItem} data-reveal="">
                    <button
                      type="button"
                      className={styles.faqButton}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpenFaqIndex((current) => (current === index ? -1 : index))
                      }
                    >
                      <span className={styles.faqQuestion}>{item.question}</span>
                      <span className={styles.faqToggle}>{isOpen ? "−" : "+"}</span>
                    </button>
                    <div
                      id={panelId}
                      className={styles.faqPanel}
                      hidden={!isOpen}
                    >
                      <p className={styles.faqAnswer}>{item.answer}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contact" className={styles.contactSection}>
          <div className={styles.sectionShell}>
            <article className={styles.contactCard} data-reveal="">
              <div className={styles.contactContent}>
                <span className={styles.eyebrow}>{content.nav[8]?.label ?? "Contact"}</span>
                <h2 className={styles.contactHeading}>{content.contact.heading}</h2>
                <p className={styles.contactCopy}>{content.contact.subcopy}</p>
                <div className={styles.contactActions}>
                  <a
                    href={`mailto:${content.contact.email}`}
                    className={styles.primaryButton}
                  >
                    Email Basenote
                  </a>
                  <a href="#home" className={styles.secondaryButton}>
                    Back to top
                  </a>
                </div>
              </div>

              <div className={styles.contactMeta}>
                <div className={styles.contactMetaBlock}>
                  <span className={styles.contactLabel}>Email</span>
                  <a
                    href={`mailto:${content.contact.email}`}
                    className={styles.contactValue}
                  >
                    {content.contact.email}
                  </a>
                </div>

                <div className={styles.contactMetaBlock}>
                  <span className={styles.contactLabel}>Availability</span>
                  <ul className={styles.locationList}>
                    {content.contact.locations.map((location) => (
                      <li key={location}>{location}</li>
                    ))}
                  </ul>
                </div>

                <p className={styles.contactNote}>{content.contact.note}</p>
              </div>
            </article>

            <footer className={styles.footer}>
              <span>Basenote Solutions</span>
              <span>{new Date().getFullYear()}</span>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
