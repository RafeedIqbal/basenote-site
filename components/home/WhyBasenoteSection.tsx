import type { HomePageContent } from "@/data/home-content";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./WhyBasenoteSection.module.css";

type WhyBasenoteSectionProps = {
    content: HomePageContent;
};

export default function WhyBasenoteSection({ content }: WhyBasenoteSectionProps) {
    const rootRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            const q = gsap.utils.selector(rootRef);

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
        },
        { scope: rootRef }
    );

    return (
        <section ref={rootRef} id="why-basenote" className={styles.whyBasenoteSection}>
            <div className={styles.container}>
                <div className={styles.sectionIntro} data-reveal="">
                    <span className={styles.eyebrow}>{content.reasons.eyebrow}</span>
                    <div className={styles.sectionIntroBody}>
                        <h2 className={styles.sectionHeading}>{content.reasons.heading}</h2>
                        <p className={styles.sectionLede}>{content.reasons.lede}</p>
                    </div>
                </div>

                <div className={styles.reasonGrid}>
                    {content.reasons.items.map((item, index) => (
                        <article key={item.title} className={styles.reasonCard} data-reveal="">
                            <span className={styles.reasonIndex}>{`0${index + 1}`}</span>
                            <div className={styles.reasonContent}>
                                <h3 className={styles.reasonTitle}>{item.title}</h3>
                                <p className={styles.reasonCopy}>{item.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
