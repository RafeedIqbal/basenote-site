import type { HomePageContent } from "@/data/home-content";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./ProcessSection.module.css";

type ProcessSectionProps = {
    content: HomePageContent;
};

export default function ProcessSection({ content }: ProcessSectionProps) {
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
        <section ref={rootRef} id="process" className={styles.processSection}>
            <div className={styles.container}>
                <div className={styles.sectionIntro} data-reveal="">
                    <span className={styles.eyebrow}>{content.process.eyebrow}</span>
                    <div className={styles.sectionIntroBody}>
                        <h2 className={styles.sectionHeading}>{content.process.heading}</h2>
                        <p className={styles.sectionLede}>{content.process.lede}</p>
                    </div>
                </div>

                <ol className={styles.processGrid}>
                    {content.process.steps.map((step) => (
                        <li key={step.step} className={styles.processItem} data-reveal="">
                            <span className={styles.processNumber}>{step.step}</span>
                            <div className={styles.processBody}>
                                <h3 className={styles.processTitle}>{step.title}</h3>
                                <p className={styles.processCopy}>{step.description}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
