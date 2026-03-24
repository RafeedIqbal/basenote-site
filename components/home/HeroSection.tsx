import type { HomePageContent } from "@/data/home-content";
import Image from "next/image";
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
            const compactOrSmallerViewport = window.matchMedia(
                "(max-width: 1280px)"
            ).matches;
            const shouldAnimateHeroWord =
                !reduceMotion && !compactOrSmallerViewport;
            const q = gsap.utils.selector(rootRef);
            const heroWord = q("[data-hero-word]");

            const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

            if (shouldAnimateHeroWord) {
                timeline.from(heroWord, {
                    yPercent: 106,
                    duration: 1,
                    stagger: 0.085
                });
            } else {
                gsap.set(heroWord, { yPercent: 0 });
            }

            timeline
                .from(
                    q("[data-hero-copy]"),
                    {
                        autoAlpha: 0,
                        y: reduceMotion ? 0 : 24,
                        duration: reduceMotion ? 0.55 : 0.75
                    },
                    shouldAnimateHeroWord ? "-=0.58" : 0
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
                <h1 className={styles.heroTitle}>
                    <span className={styles.heroTitleLine}>
                        <Image
                            src="/assets/logo-text.svg"
                            alt="Basenote Solutions"
                            width={9117}
                            height={5849}
                            priority
                            fetchPriority="high"
                            data-hero-word=""
                            className={styles.heroLogoText}
                        />
                    </span>
                </h1>

                <div className={styles.heroBottomRow}>
                    <div className={styles.heroSummaryBlock}>
                        <p className={styles.heroSummary} data-hero-copy="">
                            {content.hero.summary}
                        </p>
                    </div>
                    <div className={styles.heroActions} data-hero-actions="">
                        <a href="#contact" className={defaultStyles.primaryButton}>
                            Contact us
                        </a>
                        <a href="#portfolio" className={defaultStyles.secondaryButton}>
                            View our work
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
