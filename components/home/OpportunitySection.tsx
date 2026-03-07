import type { HomePageContent } from "@/data/home-content";
import styles from "./OpportunitySection.module.css";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

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

type OpportunitySectionProps = {
    content: HomePageContent;
};

export default function OpportunitySection({ content }: OpportunitySectionProps) {
    const rootRef = useRef<HTMLElement>(null);
    const viewportRefs = useRef<Array<HTMLDivElement | null>>([]);
    const lineRefs = useRef<Array<HTMLParagraphElement | null>>([]);
    const [lineScales, setLineScales] = useState<number[]>([]);

    useEffect(() => {
        const updateLineScales = () => {
            setLineScales(
                content.opportunity.lines.map((_, index) => {
                    const viewport = viewportRefs.current[index];
                    const line = lineRefs.current[index];

                    if (!viewport || !line) {
                        return 1;
                    }

                    const viewportWidth = viewport.clientWidth;
                    const lineWidth = line.scrollWidth;

                    if (viewportWidth <= 0 || lineWidth <= 0) {
                        return 1;
                    }

                    return Math.min(1, viewportWidth / lineWidth);
                })
            );
        };

        const animationFrameId = window.requestAnimationFrame(updateLineScales);
        const timeoutId = window.setTimeout(updateLineScales, 160);

        window.addEventListener("resize", updateLineScales);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.clearTimeout(timeoutId);
            window.removeEventListener("resize", updateLineScales);
        };
    }, [content.opportunity.lines]);

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
                        duration: 0.6,
                        stagger: 0.008,
                        scrollTrigger: {
                            trigger: rootRef.current,
                            start: "top 72%",
                            once: true
                        }
                    });
                } else {
                    gsap
                        .timeline({
                            scrollTrigger: {
                                trigger: rootRef.current,
                                start: "top top",
                                end: "+=110%",
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
                            stagger: 0.017
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
                        <div
                            key={`${line}-${index}`}
                            className={styles.opportunityLineViewport}
                            ref={(element) => {
                                viewportRefs.current[index] = element;
                            }}
                        >
                            <p
                                ref={(element) => {
                                    lineRefs.current[index] = element;
                                }}
                                className={styles.opportunityLine}
                                style={
                                    {
                                        "--line-scale": lineScales[index] ?? 1
                                    } as CSSProperties
                                }
                            >
                                {splitIntoAnimatedCharacters(line)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
