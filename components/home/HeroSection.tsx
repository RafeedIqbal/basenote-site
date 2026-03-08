import type { HomePageContent } from "@/data/home-content";
import defaultStyles from "./HomePage.module.css";
import styles from "./HeroSection.module.css";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type HeroSectionProps = {
    content: HomePageContent;
};

export default function HeroSection({ content }: HeroSectionProps) {
    const rootRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            const q = gsap.utils.selector(rootRef);

            gsap
                .timeline({ defaults: { ease: "power3.out" } })
                .from(q("[data-hero-word]"), {
                    yPercent: 106,
                    duration: reduceMotion ? 0.7 : 1,
                    stagger: reduceMotion ? 0.05 : 0.085
                })
                .from(
                    q("[data-hero-copy]"),
                    {
                        autoAlpha: 0,
                        y: 24,
                        duration: reduceMotion ? 0.55 : 0.75
                    },
                    "-=0.58"
                )
                .from(
                    q("[data-hero-actions] > *"),
                    {
                        autoAlpha: 0,
                        y: 16,
                        duration: 0.55,
                        stagger: 0.07
                    },
                    "-=0.4"
                );
        },
        { scope: rootRef }
    );

    return (
        <section ref={rootRef} id="home" data-hero="" className={styles.heroSection}>
            <div className={styles.heroContent}>
                <div className={styles.kickerAndTitle}>
                    <p className={styles.heroKicker}>{content.hero.kicker}</p>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.heroTitleLine}>
                            <img
                                src="/assets/logo-text.svg"
                                alt="Basenote Solutions"
                                data-hero-word=""
                                className={styles.heroLogoText}
                            />
                        </span>
                    </h1>
                </div>

                <div className={styles.heroBottomRow}>
                    <div className={styles.heroSummaryBlock}>
                        <p className={styles.heroSummary} data-hero-copy="">
                            {content.hero.summary}
                        </p>
                        <p className={styles.heroSupporting}>{content.hero.supporting}</p>
                    </div>
                    <div className={styles.heroActions} data-hero-actions="">
                        <a href="#contact" className={defaultStyles.primaryButton}>
                            Book a call
                        </a>
                        <a href="#portfolio" className={defaultStyles.secondaryButton}>
                            Browse portfolio
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
