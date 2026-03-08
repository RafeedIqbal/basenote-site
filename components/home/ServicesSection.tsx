"use client";

import type { HomePageContent } from "@/data/home-content";
import {
    useRef,
    useState,
    useCallback,
    useEffect,
    type KeyboardEvent,
    type CSSProperties
} from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./ServicesSection.module.css";

type ServicesSectionProps = {
    content: HomePageContent;
};

type PillarItem = HomePageContent["pillars"]["items"][number];

export default function ServicesSection({ content }: ServicesSectionProps) {
    const rootRef = useRef<HTMLElement>(null);
    const activeCardRef = useRef<HTMLElement>(null);
    const exitingCardRef = useRef<HTMLElement>(null);
    const sizerRefs = useRef<Array<HTMLElement | null>>([]);
    const transitionTokenRef = useRef(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [exitingIndex, setExitingIndex] = useState<number | null>(null);
    const [maxCardHeight, setMaxCardHeight] = useState(0);
    const [maxTopHeight, setMaxTopHeight] = useState(0);
    const [maxDescriptionHeight, setMaxDescriptionHeight] = useState(0);

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

    const handleTabChange = useCallback(
        (index: number) => {
            if (index === activeIndex) {
                return;
            }

            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            if (reduceMotion) {
                gsap.killTweensOf([activeCardRef.current, exitingCardRef.current]);
                transitionTokenRef.current += 1;
                setExitingIndex(null);
                setActiveIndex(index);
                return;
            }

            setExitingIndex(activeIndex);
            setActiveIndex(index);
        },
        [activeIndex]
    );

    const handleTabKeyDown = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
            const lastIndex = content.pillars.items.length - 1;
            let nextIndex = index;

            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                nextIndex = index === lastIndex ? 0 : index + 1;
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                nextIndex = index === 0 ? lastIndex : index - 1;
            } else if (event.key === "Home") {
                nextIndex = 0;
            } else if (event.key === "End") {
                nextIndex = lastIndex;
            } else {
                return;
            }

            event.preventDefault();
            handleTabChange(nextIndex);
            const nextTab = document.getElementById(
                `service-tab-${content.pillars.items[nextIndex].id}`
            );
            nextTab?.focus();
        },
        [content.pillars.items, handleTabChange]
    );

    const measureTallestCard = useCallback(() => {
        let tallestCard = 0;
        let tallestTop = 0;
        let tallestDescription = 0;

        sizerRefs.current.forEach((element) => {
            if (!element) return;

            const cardHeight = element.getBoundingClientRect().height;
            if (cardHeight > tallestCard) {
                tallestCard = cardHeight;
            }

            const top = element.querySelector<HTMLElement>(`.${styles.cardTop}`);
            const description =
                element.querySelector<HTMLElement>(`.${styles.cardDescription}`);

            const topHeight = top?.getBoundingClientRect().height ?? 0;
            const descriptionHeight =
                description?.getBoundingClientRect().height ?? 0;

            if (topHeight > tallestTop) {
                tallestTop = topHeight;
            }

            if (descriptionHeight > tallestDescription) {
                tallestDescription = descriptionHeight;
            }
        });

        const tallest = Math.ceil(tallestCard);
        const top = Math.ceil(tallestTop);
        const description = Math.ceil(tallestDescription);

        if (!tallest) return;
        setMaxCardHeight((previous) =>
            previous === tallest ? previous : tallest
        );
        if (top > 0) {
            setMaxTopHeight((previous) => (previous === top ? previous : top));
        }
        if (description > 0) {
            setMaxDescriptionHeight((previous) =>
                previous === description ? previous : description
            );
        }
    }, []);

    useEffect(() => {
        sizerRefs.current = sizerRefs.current.slice(
            0,
            content.pillars.items.length
        );

        const onResize = () => {
            measureTallestCard();
        };

        const resizeObserver = new ResizeObserver(() => {
            measureTallestCard();
        });

        sizerRefs.current.forEach((element) => {
            if (element) resizeObserver.observe(element);
        });

        window.requestAnimationFrame(() => {
            measureTallestCard();
        });

        const fonts = document.fonts;
        let isMounted = true;
        if (fonts) {
            void fonts.ready.then(() => {
                if (isMounted) measureTallestCard();
            });
        }

        window.addEventListener("resize", onResize);

        return () => {
            isMounted = false;
            window.removeEventListener("resize", onResize);
            resizeObserver.disconnect();
        };
    }, [content.pillars.items.length, measureTallestCard]);

    useEffect(() => {
        if (exitingIndex === null) {
            return;
        }

        const incoming = activeCardRef.current;
        const outgoing = exitingCardRef.current;
        if (!incoming || !outgoing) {
            return;
        }

        const token = transitionTokenRef.current + 1;
        transitionTokenRef.current = token;

        gsap.killTweensOf([incoming, outgoing]);
        gsap.set(incoming, { autoAlpha: 0 });
        gsap.set(outgoing, { autoAlpha: 1 });

        gsap.to(incoming, {
            autoAlpha: 1,
            duration: 0.34,
            ease: "power2.out",
            overwrite: "auto"
        });

        gsap.to(outgoing, {
            autoAlpha: 0,
            duration: 0.34,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => {
                if (transitionTokenRef.current === token) {
                    setExitingIndex(null);
                }
            }
        });
    }, [activeIndex, exitingIndex]);

    const renderCardBody = (item: PillarItem) => (
        <>
            <div className={styles.cardTop}>
                <div className={styles.cardEyebrowRow}>
                    <span className={styles.cardPillar}>{item.eyebrow}</span>
                    <span className={styles.cardRule} aria-hidden="true" />
                </div>
                <h3 className={styles.cardTitle}>{item.subtitle}</h3>
                <p className={styles.cardSubtitle}>{item.title}</p>
            </div>

            <p className={styles.cardDescription}>{item.description}</p>

            <div className={styles.cardLists}>
                <div>
                    <h4 className={styles.listHeading}>Key Focus</h4>
                    <ul className={styles.list}>
                        {item.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className={styles.listHeading}>Deliverables</h4>
                    <ul className={styles.list}>
                        {item.deliverables.map((d) => (
                            <li key={d}>{d}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );

    const active = content.pillars.items[activeIndex];
    const exiting =
        exitingIndex === null ? null : content.pillars.items[exitingIndex];
    const activePanelId = `service-panel-${active.id}`;
    const headingLines =
        content.pillars.heading === "We're trusted by industry leaders."
            ? ["We're trusted by", "industry leaders."]
            : [content.pillars.heading];
    const cardFrameStyle =
        maxCardHeight > 0
            ? ({
                  "--card-frame-height": `${maxCardHeight}px`,
                  "--card-top-height":
                      maxTopHeight > 0 ? `${maxTopHeight}px` : undefined,
                  "--card-description-height":
                      maxDescriptionHeight > 0
                          ? `${maxDescriptionHeight}px`
                          : undefined
              } as CSSProperties)
            : undefined;

    return (
        <section ref={rootRef} id="what-we-do" className={styles.section}>
            <span id="services" className={styles.sectionAnchor} aria-hidden="true" />
            <div className={styles.layout}>
                <div className={styles.mainRow}>
                    <div className={styles.left} data-reveal="">
                        <div className={styles.intro}>
                            <span className={styles.eyebrow}>
                                {content.pillars.eyebrow}
                            </span>
                            <h2 className={styles.heading}>
                                {headingLines.map((line, index) => (
                                    <span
                                        key={`${line}-${index}`}
                                        className={`${styles.headingLine}${
                                            index === 1
                                                ? ` ${styles.headingLineNoWrap}`
                                                : ""
                                        }`}
                                    >
                                        {line}
                                    </span>
                                ))}
                            </h2>
                            <p className={styles.lede}>{content.pillars.lede}</p>
                        </div>
                    </div>

                    <div className={styles.right} data-reveal="">
                        <div
                            className={styles.cardFrame}
                            style={cardFrameStyle}
                            data-transitioning={exiting !== null}
                        >
                            <article
                                id={activePanelId}
                                ref={activeCardRef}
                                role="tabpanel"
                                aria-labelledby={`service-tab-${active.id}`}
                                className={`${styles.card} ${styles.cardActive}`}
                            >
                                {renderCardBody(active)}
                            </article>
                            {exiting ? (
                                <article
                                    ref={exitingCardRef}
                                    aria-hidden="true"
                                    className={`${styles.card} ${styles.cardExiting}`}
                                >
                                    {renderCardBody(exiting)}
                                </article>
                            ) : null}
                        </div>
                        <div className={styles.sizerWrap} aria-hidden="true">
                            {content.pillars.items.map((item, index) => (
                                <article
                                    key={`${item.id}-sizer`}
                                    ref={(element) => {
                                        sizerRefs.current[index] = element;
                                    }}
                                    className={`${styles.card} ${styles.cardSizer}`}
                                >
                                    {renderCardBody(item)}
                                </article>
                            ))}
                        </div>
                    </div>
                </div>

                <nav
                    className={styles.tabs}
                    aria-label="Service pillars"
                    role="tablist"
                >
                    {content.pillars.items.map((item, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <button
                                key={item.id}
                                id={`service-tab-${item.id}`}
                                type="button"
                                role="tab"
                                className={styles.tab}
                                data-active={isActive}
                                onClick={() => handleTabChange(index)}
                                onKeyDown={(event) =>
                                    handleTabKeyDown(event, index)
                                }
                                aria-selected={isActive}
                                aria-controls={isActive ? activePanelId : undefined}
                                tabIndex={isActive ? 0 : -1}
                            >
                                <span className={styles.tabNumber}>
                                    {item.stat}
                                </span>
                                <span className={styles.tabLabel}>
                                    {item.title}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </section>
    );
}
