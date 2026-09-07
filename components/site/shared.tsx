"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToPosition } from "@/lib/scroll";
import type { FaqItem } from "@/data/site-content";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import styles from "./SitePages.module.css";
import shared from "./shared.module.css";

export function SiteFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.location.hash) return;
    let alive = true;
    let frame = 0;
    const alignHash = () => {
      if (!alive) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        frame = requestAnimationFrame(() => {
          if (!alive) return;
          const target = document.getElementById(
            decodeURIComponent(window.location.hash.slice(1)),
          );
          if (!target) return;
          const pin = ScrollTrigger.getAll().find(
            (item) => item.trigger === target && item.vars.pin,
          );
          scrollToPosition(
            pin
              ? pin.start
              : target.getBoundingClientRect().top + window.scrollY - 88,
          );
        });
      });
    };
    // Pin spacers must exist before resolving a hash loaded from another page.
    void document.fonts.ready.then(alignHash);
    window.addEventListener("load", alignHash, { once: true });
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("load", alignHash);
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
      <main id="main-content">{children}</main>
      <SiteFooter />
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
              onClick={() => setOpen(open === index ? null : index)}
            >
              {item.question}
              <span aria-hidden="true">{open === index ? "−" : "+"}</span>
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
