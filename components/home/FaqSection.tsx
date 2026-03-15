import type { HomePageContent } from "@/data/home-content";
import { useState, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./FaqSection.module.css";

type FaqSectionProps = {
    content: HomePageContent;
};

export default function FaqSection({ content }: FaqSectionProps) {
    const [openFaqIndex, setOpenFaqIndex] = useState(0);
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
        <section ref={rootRef} id="faq" className={styles.faqSection}>
            <div className={styles.container}>
                <div className={styles.sectionIntro} data-reveal="">
                    <span className={styles.eyebrow}>{content.faq.eyebrow}</span>
                    <div className={styles.sectionIntroBody}>
                        <h2 className={styles.sectionHeading}>{content.faq.heading}</h2>
                        <p className={styles.sectionLede}>{content.faq.lede}</p>
                    </div>
                </div>

                <div className={styles.faqList}>
                    {content.faq.items.map((item, index) => {
                        const isOpen = openFaqIndex === index;
                        const panelId = `faq-panel-${index}`;

                        return (
                            <article key={item.question} className={styles.faqItem} data-reveal="">
                                <button
                                    type="button"
                                    className={styles.faqButton}
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    onClick={() =>
                                        setOpenFaqIndex((current) => (current === index ? -1 : index))
                                    }
                                >
                                    <span className={styles.faqQuestion}>{item.question}</span>
                                    <span className={`${styles.faqToggle} ${isOpen ? styles.faqToggleOpen : ""}`}>+</span>
                                </button>
                                <div
                                    id={panelId}
                                    role="region"
                                    className={`${styles.faqPanel} ${isOpen ? styles.faqPanelOpen : ""}`}
                                    aria-hidden={!isOpen}
                                >
                                    <div className={styles.faqPanelInner}>
                                        <p className={styles.faqAnswer}>{item.answer}</p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
