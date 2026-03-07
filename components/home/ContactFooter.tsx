import type { HomePageContent } from "@/data/home-content";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./ContactFooter.module.css";
import defaultStyles from "./HomePage.module.css";

type ContactFooterProps = {
    content: HomePageContent;
};

export default function ContactFooter({ content }: ContactFooterProps) {
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
        <section ref={rootRef} id="contact" className={styles.contactSection}>
            <div className={styles.container}>
                <article className={styles.contactCard} data-reveal="">
                    <div className={styles.contactContent}>
                        <span className={styles.eyebrow}>{content.nav[8]?.label ?? "Contact"}</span>
                        <h2 className={styles.contactHeading}>{content.contact.heading}</h2>
                        <p className={styles.contactCopy}>{content.contact.subcopy}</p>
                        <div className={styles.contactActions}>
                            <a
                                href={`mailto:${content.contact.email}`}
                                className={defaultStyles.primaryButton}
                            >
                                Email Basenote
                            </a>
                            <a href="#home" className={defaultStyles.secondaryButton}>
                                Back to top
                            </a>
                        </div>
                    </div>

                    <div className={styles.contactMeta}>
                        <div className={styles.contactMetaBlock}>
                            <span className={styles.contactLabel}>Email</span>
                            <a
                                href={`mailto:${content.contact.email}`}
                                className={styles.contactValue}
                            >
                                {content.contact.email}
                            </a>
                        </div>

                        <div className={styles.contactMetaBlock}>
                            <span className={styles.contactLabel}>Availability</span>
                            <ul className={styles.locationList}>
                                {content.contact.locations.map((location) => (
                                    <li key={location}>{location}</li>
                                ))}
                            </ul>
                        </div>

                        <p className={styles.contactNote}>{content.contact.note}</p>
                    </div>
                </article>

                <footer className={styles.footer}>
                    <span>Basenote Solutions</span>
                    <span>{new Date().getFullYear()}</span>
                </footer>
            </div>
        </section>
    );
}
