import type { HomePageContent } from "@/data/home-content";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./PortfolioSection.module.css";

type PortfolioSectionProps = {
    content: HomePageContent;
};

export default function PortfolioSection({ content }: PortfolioSectionProps) {
    const rootRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            const media = gsap.matchMedia();
            const q = gsap.utils.selector(rootRef);

            // Section intro reveal
            q("[data-reveal]").forEach((element, index) => {
                gsap.fromTo(
                    element,
                    {
                        autoAlpha: 0,
                        y: reduceMotion ? 0 : 30
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.78,
                        ease: "power2.out",
                        delay: index === 0 ? 0.08 : 0,
                        scrollTrigger: {
                            trigger: element,
                            start: "top 85%",
                            once: true
                        }
                    }
                );
            });

            media.add("(min-width: 901px)", () => {
                const cards =
                    gsap.utils.toArray<HTMLElement>("[data-portfolio-card]");

                cards.forEach((card, index) => {
                    gsap.fromTo(
                        card,
                        {
                            autoAlpha: reduceMotion ? 1 : 0.9,
                            y: reduceMotion ? 0 : 18
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            ease: "power2.out",
                            duration: 0.65,
                            scrollTrigger: {
                                trigger: card,
                                start: "top 92%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );

                    const nextCard = cards[index + 1];
                    if (!nextCard || reduceMotion) {
                        return;
                    }

                    gsap.to(card, {
                        autoAlpha: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: nextCard,
                            start: "top 82%",
                            end: "top 50%",
                            scrub: true
                        }
                    });
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

                        if (!primary || !secondary) return;

                        if (reduceMotion) {
                            gsap.to(secondary, {
                                autoAlpha: 1,
                                duration: 0.45,
                                ease: "power2.out",
                                scrollTrigger: {
                                    trigger: card,
                                    start: "top 78%",
                                    toggleActions: "play none none reverse"
                                }
                            });

                            gsap.to(primary, {
                                autoAlpha: 0.18,
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

                        gsap
                            .timeline({
                                scrollTrigger: {
                                    trigger: card,
                                    start: "top 82%",
                                    end: "bottom 38%",
                                    scrub: 0.9
                                }
                            })
                            .to(primary, { autoAlpha: 0.2, scale: 1.02, ease: "none" }, 0)
                            .to(secondary, { autoAlpha: 1, scale: 1, ease: "none" }, 0);
                    });
            });

            return () => {
                media.revert();
            };
        },
        { scope: rootRef }
    );

    return (
        <section ref={rootRef} id="portfolio" className={styles.portfolioSection}>
            <div className={styles.container}>
                <div className={styles.sectionIntro} data-reveal="">
                    <span className={styles.eyebrow}>{content.portfolio.eyebrow}</span>
                    <div className={styles.sectionIntroBody}>
                        <h2 className={styles.sectionHeading}>{content.portfolio.heading}</h2>
                        <p className={styles.sectionLede}>{content.portfolio.lede}</p>
                    </div>
                </div>

                <div className={styles.portfolioGrid}>
                    {content.portfolio.projects.map((project, index) => (
                        <article
                            key={project.id}
                            className={styles.portfolioCard}
                            data-portfolio-card=""
                            style={
                                {
                                    "--card-order": index,
                                    zIndex: index + 1
                                } as CSSProperties
                            }
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.cardHeaderLeft}>
                                    <p className={styles.portfolioCategory}>{project.category}</p>
                                    <h3 className={styles.portfolioTitle}>{project.title}</h3>
                                </div>
                                <div className={styles.cardHeaderRight}>
                                    {project.tags.map((tag) => (
                                        <span key={tag} className={styles.tag}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.portfolioMediaRow}>
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

                            <div className={styles.cardFooter}>
                                <p className={styles.portfolioSummary}>{project.summary}</p>
                                <p className={styles.portfolioImpact}>{project.impact}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
