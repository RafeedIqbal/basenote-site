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
            const q = gsap.utils.selector(rootRef);

            q("[data-reveal]").forEach((element) => {
                gsap.fromTo(
                    element,
                    { autoAlpha: 0, y: reduceMotion ? 0 : 30 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.78,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 85%",
                            once: true
                        }
                    }
                );
            });

            if (content.portfolio.projects.length > 0) {
                const media = gsap.matchMedia();

                media.add("(min-width: 1281px)", () => {
                    const cards =
                        gsap.utils.toArray<HTMLElement>("[data-portfolio-card]");

                    cards.forEach((card) => {
                        gsap.fromTo(
                            card,
                            { y: reduceMotion ? 0 : 18 },
                            {
                                y: 0,
                                ease: "power2.out",
                                duration: 0.65,
                                scrollTrigger: {
                                    trigger: card,
                                    start: "top 92%",
                                    fastScrollEnd: true,
                                    once: true
                                }
                            }
                        );
                    });
                });

                media.add("(max-width: 768px)", () => {
                    const cards =
                        gsap.utils.toArray<HTMLElement>("[data-portfolio-card]");

                    cards.forEach((card) => {
                        gsap.fromTo(
                            card,
                            { y: reduceMotion ? 0 : 12 },
                            {
                                y: 0,
                                ease: "power2.out",
                                duration: 0.55,
                                scrollTrigger: {
                                    trigger: card,
                                    start: "top 95%",
                                    fastScrollEnd: true,
                                    once: true
                                }
                            }
                        );
                    });
                });

                return () => {
                    media.revert();
                };
            }
        },
        { scope: rootRef, dependencies: [content.portfolio.projects.length] }
    );

    return (
        <section ref={rootRef} id="portfolio" className={styles.portfolioSection}>
            <div className={styles.container}>
                <div className={styles.portfolioHeader} data-reveal="">
                    <span className={styles.eyebrow}>{content.portfolio.eyebrow}</span>
                    <h2 className={styles.portfolioHeading}>{content.portfolio.heading}</h2>
                    <p className={styles.portfolioSubheading}>{content.portfolio.subheading}</p>
                    <p className={styles.portfolioDescription}>{content.portfolio.description}</p>
                </div>

                {content.portfolio.projects.length > 0 ? (
                    <div
                        className={styles.portfolioGrid}
                        style={
                            {
                                "--card-count": content.portfolio.projects.length
                            } as CSSProperties
                        }
                    >
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
                                        <div className={styles.cardTagList}>
                                            {project.tags.map((tag) => (
                                                <span key={tag} className={styles.tag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.portfolioMediaRow}>
                                    {project.images.map((image) => (
                                        <div key={image.src} className={styles.portfolioMediaFrame}>
                                            <Image
                                                src={image.src}
                                                alt={image.alt}
                                                fill
                                                sizes="(max-width: 767px) 100vw, 50vw"
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
                ) : content.portfolio.placeholder ? (
                    <p className={styles.placeholder} data-reveal="">
                        {content.portfolio.placeholder}
                    </p>
                ) : null}
            </div>
        </section>
    );
}
