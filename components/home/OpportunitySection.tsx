import type { HomePageContent } from "@/data/home-content";
import styles from "./OpportunitySection.module.css";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

function splitIntoTypewriterCharacters(text: string) {
    return text.trim().split(/\s+/).map((word, wordIndex) => (
        <span
            key={`${word}-${wordIndex}`}
            className={styles.opportunityWordWrap}
        >
            {Array.from(word).map((character, characterIndex) => (
                <span
                    key={`${wordIndex}-${character}-${characterIndex}`}
                    className={styles.opportunityChar}
                    data-opportunity-char=""
                >
                    {character}
                </span>
            ))}
        </span>
    ));
}

type OpportunitySectionProps = {
    content: HomePageContent;
};

export default function OpportunitySection({ content }: OpportunitySectionProps) {
    const rootRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            const q = gsap.utils.selector(rootRef);
            const opportunityCharacters = q("[data-opportunity-char]");
            const paragraphs = q("[data-opportunity-paragraph]");

            if (opportunityCharacters.length > 0 && rootRef.current) {
                if (reduceMotion) {
                    gsap.to(opportunityCharacters, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.01,
                        scrollTrigger: {
                            trigger: rootRef.current,
                            start: "top 75%",
                            once: true
                        }
                    });
                } else {
                    gsap
                        .timeline({
                            scrollTrigger: {
                                trigger: rootRef.current,
                                start: "top top",
                                end: "+=160%",
                                scrub: 0.9,
                                pin: true,
                                anticipatePin: 1,
                                invalidateOnRefresh: true
                            }
                        })
                        .to(opportunityCharacters, {
                            autoAlpha: 1,
                            y: 0,
                            ease: "none",
                            stagger: 0.014
                        })
                        .fromTo(
                            paragraphs,
                            { autoAlpha: 0, y: 20 },
                            {
                                autoAlpha: 1,
                                y: 0,
                                ease: "power2.out",
                                stagger: 0.06,
                                duration: 0.3
                            },
                            "-=0.15"
                        );
                }
            }

            if (reduceMotion && paragraphs.length > 0) {
                gsap.fromTo(
                    paragraphs,
                    { autoAlpha: 0, y: 0 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.08,
                        scrollTrigger: {
                            trigger: rootRef.current,
                            start: "top 60%",
                            once: true
                        }
                    }
                );
            }
        },
        { scope: rootRef }
    );

    return (
        <section
            ref={rootRef}
            id="opportunity"
            data-opportunity=""
            className={styles.opportunitySection}
        >
            <div className={styles.container}>
                <div className={styles.opportunityCopy}>
                    <p className={styles.opportunityLine}>
                        {splitIntoTypewriterCharacters(content.opportunity.headline)}
                    </p>
                    <div className={styles.opportunityParagraphs}>
                        {content.opportunity.paragraphs.map((paragraph, index) => (
                            <p
                                key={index}
                                className={styles.opportunityParagraph}
                                data-opportunity-paragraph=""
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
