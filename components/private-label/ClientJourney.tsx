"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToPosition } from "@/lib/scroll";
import { privateLabel } from "@/data/site-content";
import common from "./PrivateLabel.module.css";
import styles from "./ClientJourney.module.css";

const content = privateLabel.journey;

export default function ClientJourney() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const offset = useRef(0);

  useGSAP(
    () => {
      const section = root.current;
      const strip = track.current;
      const windowElement = viewport.current;
      if (!section || !strip || !windowElement) return;

      const stages = Array.from(strip.children) as HTMLElement[];
      const distance = () =>
        Math.max(0, strip.scrollWidth - windowElement.clientWidth);
      const updateProgress = (position: number) => {
        offset.current = position;
        const progress = distance() ? position / distance() : 0;
        const lastStage = stages[stages.length - 1];
        // Introduce the next step once a quarter of the last card is in view.
        section.dataset.ctaVisible = String(
          position + windowElement.clientWidth >=
            lastStage.offsetLeft + lastStage.offsetWidth * 0.25,
        );
        strip.style.setProperty("--journey-progress", String(progress));
        stages.forEach((stage, index) => {
          stage.dataset.reached = String(
            index / (stages.length - 1) <= progress + 0.001,
          );
        });
      };

      let restoreFrame = 0;
      let resume: {
        progress: number;
        top: number;
        focused: HTMLElement | null;
      } | null = null;
      const focusedElement = () =>
        document.activeElement instanceof HTMLElement &&
        section.contains(document.activeElement)
          ? document.activeElement
          : null;
      // Remember the reading position before a media change removes nearby pins.
      const rememberPosition = () => {
        const bounds = section.getBoundingClientRect();
        resume =
          bounds.top < window.innerHeight && bounds.bottom > 0
            ? {
                progress: trigger.current
                  ? gsap.utils.clamp(
                      0,
                      1,
                      (window.scrollY - trigger.current.start) /
                        (trigger.current.end - trigger.current.start),
                    )
                  : distance()
                    ? windowElement.scrollLeft / distance()
                    : 0,
                top: Math.max(0, bounds.top),
                focused: focusedElement(),
              }
            : null;
      };
      window.addEventListener("scroll", rememberPosition, { passive: true });
      section.addEventListener("focusin", rememberPosition);

      const media = gsap.matchMedia();
      media.add(
        {
          all: "all",
          desktop: "(min-width: 860px) and (min-height: 700px)",
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const saved = resume;
          resume = null;
          if (context.conditions?.desktop && !context.conditions.reducedMotion) {
            windowElement.scrollLeft = 0;
            section.dataset.pinned = "true";
            let refocusAfterRefresh: HTMLElement | null = null;
            const animation = gsap.fromTo(
              strip,
              { x: 0 },
              {
                x: () => -distance(),
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: () => "+=" + distance(),
                  pin: true,
                  scrub: true,
                  invalidateOnRefresh: true,
                  anticipatePin: 1,
                  onRefreshInit: () => {
                    refocusAfterRefresh = focusedElement();
                  },
                  onUpdate: (self) => updateProgress(self.progress * distance()),
                  onRefresh: (self) => {
                    updateProgress(self.progress * distance());
                    refocusAfterRefresh?.focus({ preventScroll: true });
                  },
                },
              },
            );
            trigger.current = animation.scrollTrigger ?? null;
          } else {
            updateProgress(windowElement.scrollLeft);
          }

          if (saved) {
            restoreFrame = requestAnimationFrame(() => {
              ScrollTrigger.refresh();
              if (trigger.current) {
                scrollToPosition(
                  trigger.current.start +
                    saved.progress * (trigger.current.end - trigger.current.start),
                );
                ScrollTrigger.update();
              } else {
                windowElement.scrollTo({
                  left: saved.progress * distance(),
                  behavior: "instant",
                });
                scrollToPosition(
                  section.getBoundingClientRect().top + window.scrollY - saved.top,
                );
                updateProgress(windowElement.scrollLeft);
              }
              // Pin measurement can reparent the viewport again in this frame.
              restoreFrame = requestAnimationFrame(() => {
                saved.focused?.focus({ preventScroll: true });
                rememberPosition();
              });
            });
          }

          return () => {
            cancelAnimationFrame(restoreFrame);
            trigger.current = null;
            delete section.dataset.pinned;
          };
        },
      );

      const onScroll = () => {
        if (!trigger.current) {
          updateProgress(windowElement.scrollLeft);
          rememberPosition();
        }
      };
      windowElement.addEventListener("scroll", onScroll, { passive: true });

      let refreshFrame = 0;
      let disposed = false;
      const refresh = () => {
        if (disposed) return;
        cancelAnimationFrame(refreshFrame);
        const saved = resume
          ? { ...resume, focused: focusedElement() }
          : null;
        refreshFrame = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          if (saved && trigger.current) {
            scrollToPosition(
              trigger.current.start +
                saved.progress * (trigger.current.end - trigger.current.start),
            );
            ScrollTrigger.update();
            saved.focused?.focus({ preventScroll: true });
          }
          onScroll();
        });
      };
      const resize = new ResizeObserver(refresh);
      resize.observe(windowElement);
      resize.observe(strip);
      void document.fonts.ready.then(refresh);

      return () => {
        disposed = true;
        cancelAnimationFrame(refreshFrame);
        cancelAnimationFrame(restoreFrame);
        resize.disconnect();
        windowElement.removeEventListener("scroll", onScroll);
        window.removeEventListener("scroll", rememberPosition);
        section.removeEventListener("focusin", rememberPosition);
        media.revert();
      };
    },
    { scope: root },
  );

  const navigateStages = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const strip = track.current;
    const windowElement = viewport.current;
    if (!strip || !windowElement) return;

    const stages = strip.children;
    const step =
      (stages[1] as HTMLElement).offsetLeft -
      (stages[0] as HTMLElement).offsetLeft;
    const distance = Math.max(0, strip.scrollWidth - windowElement.clientWidth);
    const current = trigger.current ? offset.current : windowElement.scrollLeft;
    let next: number;
    if (event.key === "ArrowRight") next = current + step;
    else if (event.key === "ArrowLeft") next = current - step;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = distance;
    else return;

    event.preventDefault();
    next = gsap.utils.clamp(0, distance, next);
    if (trigger.current && distance) {
      scrollToPosition(
        trigger.current.start +
          (next / distance) * (trigger.current.end - trigger.current.start),
      );
      ScrollTrigger.update();
    } else {
      windowElement.scrollTo({ left: next, behavior: "instant" });
    }
  };

  return (
    <>
      <section
        id="client-journey"
        className={styles.section}
        ref={root}
        aria-labelledby="journey-title"
        tabIndex={-1}
      >
        <div className={styles.heading}>
          <div>
            <span className={common.eyebrow}>{privateLabel.eyebrow}</span>
            <h2 id="journey-title">{content.title}</h2>
          </div>
          <p className={styles.hint}>
            <span className={styles.scrollHint}>
              {content.scrollHint} <span aria-hidden="true">↓</span>
            </span>
            <span className={styles.swipeHint}>
              {content.swipeHint} <span aria-hidden="true">↔</span>
            </span>
          </p>
        </div>
        <p id="journey-keyboard" className={styles.srOnly}>
          {content.keyboardHint}
        </p>
        <div
          ref={viewport}
          className={styles.viewport}
          role="group"
          aria-label={content.navigationLabel}
          aria-describedby="journey-keyboard"
          tabIndex={0}
          onKeyDown={navigateStages}
        >
          <ol ref={track} className={styles.track} role="list">
            {content.stages.map((stage, index) => (
              <li
                key={stage.number}
                className={styles.stage}
                data-reached={index === 0}
              >
                <span className={styles.marker} aria-hidden="true" />
                <article
                  className={styles.card}
                  aria-labelledby={"journey-stage-" + stage.number}
                >
                  <span className={styles.number} aria-hidden="true">
                    {stage.number}
                  </span>
                  <div className={styles.cardCopy}>
                    <h3 id={"journey-stage-" + stage.number}>{stage.title}</h3>
                    <p>{stage.description}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.cta}>
          <Link href={privateLabel.contactHref} className={styles.ctaButton}>
            {content.cta}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
