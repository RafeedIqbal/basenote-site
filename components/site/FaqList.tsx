"use client";

import { useEffect, useId, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import type { FaqItem } from "@/data/site-content";
import styles from "./SitePages.module.css";
import shared from "./shared.module.css";

export default function FaqList({
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
