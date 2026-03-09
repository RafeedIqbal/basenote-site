import type { HomePageContent } from "@/data/home-content";
import styles from "./OpportunitySection.module.css";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

function splitIntoTypewriterCharacters(text: string, lineIndex: number) {
    return text.trim().split(/\s+/).map((word, wordIndex) => (
        <span
            key={`${lineIndex}-${word}-${wordIndex}`}
            className={styles.opportunityWordWrap}
        >
            {Array.from(word).map((character, characterIndex) => (
                <span
                    key={`${lineIndex}-${wordIndex}-${character}-${characterIndex}`}
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
                        });
                }
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
                    {content.opportunity.lines.map((line, index) => (
                        <p key={`${line}-${index}`} className={styles.opportunityLine}>
                            {splitIntoTypewriterCharacters(line, index)}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
