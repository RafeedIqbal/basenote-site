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
            const sectionIntro = q("[data-reveal]");

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

            sectionIntro.forEach((element, index) => {
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
                <div className={styles.sectionIntro} data-reveal="">
                    <span className={styles.eyebrow}>{content.opportunity.eyebrow}</span>
                    <div className={styles.sectionIntroBody}>
                        <h2 className={styles.sectionHeading}>{content.opportunity.heading}</h2>
                        <p className={styles.sectionLede}>{content.opportunity.lede}</p>
                    </div>
                </div>

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
