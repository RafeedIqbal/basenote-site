import type { HomePageContent } from "@/data/home-content";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import defaultStyles from "./HomePage.module.css";
import styles from "./CtaBanner.module.css";

type CtaBannerProps = {
    content: HomePageContent;
};

export default function CtaBanner({ content }: CtaBannerProps) {
    const rootRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;
            const q = gsap.utils.selector(rootRef);

            q("[data-reveal]").forEach((element) => {
                gsap.fromTo(
                    element,
                    { autoAlpha: 0, y: reduceMotion ? 0 : 30 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.78,
                        ease: "power2.out",
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
        <section ref={rootRef} className={styles.section}>
            <div className={styles.container} data-reveal="">
                <h2 className={styles.heading}>{content.ctaBanner.heading}</h2>
                <p className={styles.subheading}>{content.ctaBanner.subheading}</p>
                <a href="/contact" className={defaultStyles.primaryButton}>
                    {content.ctaBanner.ctaLabel}
                </a>
            </div>
        </section>
    );
}
