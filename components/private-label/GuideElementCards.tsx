"use client";

import { useEffect, useId, useRef } from "react";
import {
  privateLabelGuide as content,
  type PrivateLabelGuideContent,
} from "@/data/site-content";
import { setScrollLocked } from "@/lib/scroll";
import styles from "./GuideElementCards.module.css";

function ElementCard({
  element,
  index,
}: {
  element: PrivateLabelGuideContent["elements"][number];
  index: number;
}) {
  const id = useId();
  const number = String(index + 1).padStart(2, "0");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const restoreScroll = useRef<(() => void) | null>(null);
  const backdropPressed = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      restoreScroll.current?.();
      restoreScroll.current = null;
      if (dialog?.open) dialog.close();
    };
  }, []);

  function openDrawer() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    // Keep the cards and chapter rail still when the page scrollbar disappears.
    dialog.showModal();
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    document.body.style.paddingRight = `${padding + scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    setScrollLocked(true);
    restoreScroll.current = () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      setScrollLocked(false);
    };
  }

  return (
    <>
      <article className={styles.card}>
        <button
          ref={triggerRef}
          type="button"
          className={styles.trigger}
          aria-haspopup="dialog"
          aria-controls={`${id}-drawer`}
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-subtitle`}
          onClick={openDrawer}
        />
        <div className={styles.summary}>
          <span className={styles.number} aria-hidden="true">{number}</span>
          <h3 id={`${id}-title`} className={styles.title}>{element.title}</h3>
          <p id={`${id}-subtitle`} className={styles.subtitle}>{element.subtitle}</p>
          <span className={styles.expand} aria-hidden="true">+</span>
        </div>
      </article>
      <dialog
        ref={dialogRef}
        id={`${id}-drawer`}
        className={styles.drawer}
        aria-labelledby={`${id}-drawer-title`}
        onPointerDown={(event) => {
          backdropPressed.current = event.target === event.currentTarget;
        }}
        onClick={(event) => {
          // Releasing a text selection over the backdrop must not dismiss it.
          if (backdropPressed.current && event.target === event.currentTarget)
            event.currentTarget.close();
          backdropPressed.current = false;
        }}
        onClose={() => {
          restoreScroll.current?.();
          restoreScroll.current = null;
          triggerRef.current?.focus({ preventScroll: true });
        }}
      >
        <div className={styles.panel}>
          <button
            type="button"
            className={styles.close}
            aria-label={`${content.labels.closeDrawer}: ${element.title}`}
            onClick={() => dialogRef.current?.close()}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="m4 4 8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
          <div ref={scrollRef} className={styles.scrollArea} data-lenis-prevent>
            <div className={styles.cover} aria-hidden="true">
              <span>{number}</span>
            </div>
            <div className={styles.body}>
              <h3 id={`${id}-drawer-title`} className={styles.drawerTitle}>{element.title}</h3>
              <p className={styles.drawerSubtitle}>{element.subtitle}</p>
              {element.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default function GuideElementCards() {
  return (
    <div className={styles.cards}>
      {content.elements.map((element, index) => (
        <ElementCard key={element.title} element={element} index={index} />
      ))}
    </div>
  );
}
