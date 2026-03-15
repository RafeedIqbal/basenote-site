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

            media.add("(min-width: 1281px)", () => {
                const cards =
                    gsap.utils.toArray<HTMLElement>("[data-portfolio-card]");

                cards.forEach((card) => {
                    gsap.fromTo(
                        card,
                        {
                            y: reduceMotion ? 0 : 18
                        },
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
                        {
                            y: reduceMotion ? 0 : 12
                        },
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
        },
        { scope: rootRef }
    );

    return (
        <section ref={rootRef} id="portfolio" className={styles.portfolioSection}>
            <div className={styles.container}>
                <span className={styles.eyebrow}>{content.portfolio.eyebrow}</span>

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
                                    <p className={styles.portfolioQuarter}>Q1 2026</p>
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
            </div>
        </section>
    );
}
