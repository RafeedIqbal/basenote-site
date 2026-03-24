import type { HomePageContent } from "@/data/home-content";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./AudiencesSection.module.css";

type AudiencesSectionProps = {
    content: HomePageContent;
};

export default function AudiencesSection({ content }: AudiencesSectionProps) {
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
        <section ref={rootRef} id="who-we-work-with" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.sectionIntro} data-reveal="">
                    <span className={styles.eyebrow}>{content.audiences.eyebrow}</span>
                    <div className={styles.sectionIntroBody}>
                        <h2 className={styles.sectionHeading}>{content.audiences.heading}</h2>
                        <p className={styles.sectionLede}>{content.audiences.lede}</p>
                    </div>
                </div>

                <div className={styles.audienceGrid}>
                    {content.audiences.items.map((segment) => (
                        <article key={segment.id} className={styles.audienceCard} data-reveal="">
                            <h3 className={styles.audienceTitle}>{segment.title}</h3>
                            <p className={styles.audienceDescription}>{segment.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
