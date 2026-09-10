"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import ArrowIcon from "@/components/site/ArrowIcon";
import { ScrollTrigger } from "@/lib/gsap";
import { privateLabel } from "@/data/site-content";
import styles from "./PrivateLabel.module.css";

const LAYOUT_MEDIA = "(min-width: 40rem) and (prefers-reduced-motion: no-preference)";
const LAYOUT_TIMING = {
  duration: 520,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
};

export default function AudiencePanels() {
  const [open, setOpen] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef(new Map<number, HTMLElement>());
  const previousRects = useRef(new Map<number, DOMRect>());
  const previousHeight = useRef<number | null>(null);
  const animations = useRef<Animation[]>([]);
  const refreshFrame = useRef(0);
  const content = privateLabel.audience;

  const refreshScroll = useCallback(() => {
    cancelAnimationFrame(refreshFrame.current);
    refreshFrame.current = requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  const cancelMotion = useCallback(() => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
  }, []);

  const togglePanel = (index: number) => {
    // Measure the painted cards first so rapid selections continue from the
    // current animation, rather than jumping to its previous destination.
    if (window.matchMedia(LAYOUT_MEDIA).matches) {
      previousRects.current = new Map(
        Array.from(panelRefs.current, ([id, panel]) => [
          id,
          panel.getBoundingClientRect(),
        ]),
      );
      previousHeight.current = gridRef.current?.getBoundingClientRect().height ?? null;
    } else {
      previousRects.current.clear();
      previousHeight.current = null;
    }
    cancelMotion();
    setOpen((current) => (current === index ? null : index));
  };

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const media = window.matchMedia(LAYOUT_MEDIA);
    const resetLayout = () => {
      cancelMotion();
      previousRects.current.clear();
      previousHeight.current = null;
      refreshScroll();
    };
    let width = grid.getBoundingClientRect().width;
    const resize = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === width) return;
      width = entry.contentRect.width;
      resetLayout();
    });
    resize.observe(grid);
    media.addEventListener("change", resetLayout);

    return () => {
      resize.disconnect();
      media.removeEventListener("change", resetLayout);
      cancelMotion();
      cancelAnimationFrame(refreshFrame.current);
    };
  }, [cancelMotion, refreshScroll]);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || previousRects.current.size === 0) {
      refreshScroll();
      return;
    }

    const layoutAnimations: Animation[] = [];
    for (const [id, panel] of panelRefs.current) {
      const previous = previousRects.current.get(id);
      if (!previous) continue;
      const next = panel.getBoundingClientRect();
      layoutAnimations.push(
        panel.animate(
          [
            {
              transform: `translate(${previous.left - next.left}px, ${previous.top - next.top}px) scale(${previous.width / next.width}, ${previous.height / next.height})`,
              transformOrigin: "top left",
            },
            { transform: "none", transformOrigin: "top left" },
          ],
          LAYOUT_TIMING,
        ),
      );
    }

    const nextHeight = grid.getBoundingClientRect().height;
    if (previousHeight.current !== null && previousHeight.current !== nextHeight) {
      layoutAnimations.push(
        grid.animate(
          [{ height: `${previousHeight.current}px` }, { height: `${nextHeight}px` }],
          LAYOUT_TIMING,
        ),
      );
    }
    animations.current = layoutAnimations;
    previousRects.current.clear();
    previousHeight.current = null;

    // Refresh the downstream pinned sections once the grid reaches its final
    // height. Cancelled animations must not refresh an obsolete layout.
    void Promise.allSettled(layoutAnimations.map((animation) => animation.finished)).then(() => {
      if (animations.current !== layoutAnimations) return;
      animations.current = [];
      refreshScroll();
    });

    return cancelMotion;
  }, [open, cancelMotion, refreshScroll]);

  return (
    <section
      id="who-its-for"
      className={styles.section}
      aria-labelledby="audience-title"
    >
      <div className={styles.sectionHeading} data-reveal="">
        <span className={styles.sectionNumber}>02 /</span>
        <h2 id="audience-title">{content.title}</h2>
      </div>
      <div
        ref={gridRef}
        className={styles.audienceGrid}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open !== null) {
            event.preventDefault();
            document.getElementById(`segment-${open}`)?.focus();
            togglePanel(open);
          }
        }}
      >
        {content.segments.map((segment, index) => (
          <article
            key={segment.number}
            ref={(node) => {
              if (node) panelRefs.current.set(index, node);
              else panelRefs.current.delete(index);
            }}
            className={styles.audiencePanel}
            data-open={open === index}
          >
            <button
              type="button"
              className={styles.panelToggle}
              id={`segment-${index}`}
              aria-expanded={open === index}
              aria-controls={`segment-detail-${index}`}
              aria-labelledby={`segment-title-${index}`}
              aria-describedby={`segment-description-${index}`}
              onClick={() => togglePanel(index)}
            />
            <div className={styles.panelSummary}>
              <span className={styles.panelNumber}>
                {segment.number}
                <span aria-hidden="true">{open === index ? "−" : "+"}</span>
              </span>
              <h3 id={`segment-title-${index}`} className={styles.panelTitle}>
                {segment.title}
              </h3>
              <p id={`segment-description-${index}`} className={styles.panelDescription}>
                {segment.description}
              </p>
            </div>
            <div
              id={`segment-detail-${index}`}
              className={styles.panelDetail}
              data-open={open === index}
              role="region"
              aria-labelledby={`segment-${index}`}
              aria-hidden={open !== index}
              inert={open !== index}
              onTransitionEnd={(event) => {
                if (event.propertyName === "grid-template-rows")
                  refreshScroll();
              }}
            >
              <div>
                <p>{segment.expanded}</p>
                {segment.bestFor ? (
                  <>
                    <span className={styles.bestFor}>
                      {content.bestForLabel}
                    </span>
                    <p className={styles.bestForCopy}>{segment.bestFor}</p>
                  </>
                ) : (
                  <Link href={privateLabel.contactHref}>
                    {content.contact} <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.actions}>
        <Link className={styles.primaryButton} href={privateLabel.contactHref}>
          {content.contact}
          <ArrowIcon />
        </Link>
        <Link className={styles.textLink} href={privateLabel.guideHref}>
          {content.learn}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
