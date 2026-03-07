import type { HomePageContent } from "@/data/home-content";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./ServicesSection.module.css";

type ServicesSectionProps = {
    content: HomePageContent;
};

export default function ServicesSection({ content }: ServicesSectionProps) {
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
        <section ref={rootRef} id="what-we-do" className={styles.servicesSection}>
            <div className={styles.container}>
                <div className={styles.sectionIntro} data-reveal="">
                    <span className={styles.eyebrow}>{content.pillars.eyebrow}</span>
                    <div className={styles.sectionIntroBody}>
                        <h2 className={styles.sectionHeading}>{content.pillars.heading}</h2>
                        <p className={styles.sectionLede}>{content.pillars.lede}</p>
                    </div>
                </div>

                <div className={styles.servicesGrid}>
                    {content.pillars.items.map((item) => (
                        <article key={item.id} className={styles.serviceBox} data-reveal="">
                            <div className={styles.serviceHeader}>
                                <span className={styles.serviceNumber}>{item.stat}</span>
                                <h3 className={styles.serviceTitle}>{item.title}</h3>
                            </div>
                            <p className={styles.serviceSubtitle}>{item.subtitle}</p>
                            <div className={styles.serviceContent}>
                                <p className={styles.serviceDescription}>{item.description}</p>
                                <div className={styles.serviceLists}>
                                    <div>
                                        <h4 className={styles.listHeading}>Key Focus</h4>
                                        <ul className={styles.serviceList}>
                                            {item.bullets.map((bullet) => (
                                                <li key={bullet}>{bullet}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className={styles.listHeading}>Deliverables</h4>
                                        <ul className={styles.serviceList}>
                                            {item.deliverables.map((deliverable) => (
                                                <li key={deliverable}>{deliverable}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
