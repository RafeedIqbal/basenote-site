import type { HomePageContent } from "@/data/home-content";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./TechProductsSection.module.css";

type TechProductsSectionProps = {
    content: HomePageContent;
};

export default function TechProductsSection({ content }: TechProductsSectionProps) {
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
        <section ref={rootRef} id="tech-ai" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.sectionIntro} data-reveal="">
                    <span className={styles.eyebrow}>{content.techProducts.eyebrow}</span>
                    <div className={styles.sectionIntroBody}>
                        <h2 className={styles.sectionHeading}>{content.techProducts.heading}</h2>
                        <p className={styles.sectionLede}>{content.techProducts.lede}</p>
                    </div>
                </div>

                <div className={styles.productGrid}>
                    {content.techProducts.items.map((product, index) => (
                        <article key={product.id} className={styles.productCard} data-reveal="">
                            <span className={styles.productIndex}>{`0${index + 1}`}</span>
                            <div className={styles.productContent}>
                                <h3 className={styles.productTitle}>{product.title}</h3>
                                <p className={styles.productTagline}>{product.tagline}</p>
                                <p className={styles.productDescription}>{product.description}</p>
                                <a href="/contact" className={styles.productCta}>
                                    {product.ctaLabel}
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
