"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { getHashTarget, scrollToAnchor } from "@/lib/scroll";
import type { FaqItem } from "@/data/site-content";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import styles from "./SitePages.module.css";
import shared from "./shared.module.css";

export function SiteFrame({
  children,
  className = "",
  footer = <SiteFooter />,
}: {
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let alive = true;
    let frame = 0;
    const alignHash = () => {
      if (!alive || !getHashTarget(window.location.hash)) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        frame = requestAnimationFrame(() => {
          if (!alive) return;
          const target = getHashTarget(window.location.hash);
          if (!target) return;
          scrollToAnchor(target);
        });
      });
    };
    // Pin spacers must exist before resolving a hash loaded from another page.
    void document.fonts.ready.then(alignHash);
    window.addEventListener("load", alignHash, { once: true });
    window.addEventListener("hashchange", alignHash);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("load", alignHash);
      window.removeEventListener("hashchange", alignHash);
    };
  }, []);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils
          .toArray<HTMLElement>("[data-reveal]", rootRef.current)
          .forEach((element) => {
            gsap.fromTo(
              element,
              { autoAlpha: 0, y: 26 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 90%",
                  once: true,
                },
              },
            );
          });
      });
      return () => media.revert();
    },
    { scope: rootRef },
  );
  return (
    <div ref={rootRef} className={`${styles.page} ${className}`}>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>{children}</main>
      {footer}
    </div>
  );
}

type Tone = "amber" | "black" | "blue" | "red";
export function SectionDivider({ tone = "black" }: { tone?: Tone }) {
  return (
    <div
      className={`${styles.dividerBand} ${styles[`tone${tone[0].toUpperCase()}${tone.slice(1)}`]}`}
      aria-hidden="true"
    >
      <div className={styles.divider}>
        <span>+</span>
      </div>
    </div>
  );
}

export function Eyebrow({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: Exclude<Tone, "black">;
}) {
  const toneClass = tone
    ? styles[`eyebrow${tone[0].toUpperCase()}${tone.slice(1)}`]
    : "";
  return <span className={`${styles.eyebrow} ${toneClass}`}>{children}</span>;
}

export function FaqList({
  items,
  exclusive = false,
}: {
  items: readonly FaqItem[];
  exclusive?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();

  useEffect(() => {
    if (!exclusive) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const refreshWithoutTransition = () => {
      if (!media.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    // Instant height changes do not emit the transition event used below.
    refreshWithoutTransition();
    media.addEventListener("change", refreshWithoutTransition);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", refreshWithoutTransition);
    };
  }, [exclusive, open]);

  if (!exclusive)
    return (
      <div>
        {items.map((item) => (
          <details
            key={item.question}
            className={styles.faqItem}
            data-reveal=""
          >
            <summary>
              {item.question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    );
  return (
    <div
      className={shared.faq}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(null);
      }}
    >
      {items.map((item, index) => (
        <div className={shared.faqItem} key={item.question}>
          <h3>
            <button
              type="button"
              id={`${id}-q-${index}`}
              aria-expanded={open === index}
              aria-controls={`${id}-a-${index}`}
              onClick={() =>
                setOpen((current) => (current === index ? null : index))
              }
            >
              <span className={shared.question}>{item.question}</span>
              <span className={shared.faqIcon} aria-hidden="true" />
            </button>
          </h3>
          <div
            className={shared.answer}
            data-open={open === index}
            id={`${id}-a-${index}`}
            role="region"
            aria-labelledby={`${id}-q-${index}`}
            aria-hidden={open !== index}
            inert={open !== index}
            onTransitionEnd={(event) => {
              if (event.propertyName === "grid-template-rows")
                ScrollTrigger.refresh();
            }}
          >
            <div>
              <p>{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
