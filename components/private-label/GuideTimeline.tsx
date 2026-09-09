"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { GuideStep } from "@/data/site-content";
import styles from "./GuideTimeline.module.css";

export default function GuideTimeline({
  steps,
  stepLabel,
  labelledBy,
}: {
  steps: readonly GuideStep[];
  stepLabel: string;
  labelledBy: string;
}) {
  const root = useRef<HTMLOListElement>(null);
  const [reading, setReading] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const active = focused ?? hovered ?? reading;

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;
      const items = Array.from(element.children) as HTMLLIElement[];
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        let current = -1;
        const update = () => {
          const readingLine = window.innerHeight * 0.55;
          const next = items.reduce(
            (index, item, candidate) =>
              item.getBoundingClientRect().top <= readingLine
                ? candidate
                : index,
            0,
          );
          if (next !== current) {
            current = next;
            setReading(next);
          }
        };

        ScrollTrigger.create({
          trigger: element,
          start: "top 75%",
          end: "bottom 20%",
          onUpdate: update,
          onRefresh: update,
          onToggle: (self) => {
            element.dataset.inView = String(self.isActive);
          },
        });
        update();

        return () => {
          delete element.dataset.inView;
        };
      });

      return () => media.revert();
    },
    { scope: root, dependencies: [steps], revertOnUpdate: true },
  );

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = {
      ArrowDown: Math.min(index + 1, steps.length - 1),
      ArrowUp: Math.max(index - 1, 0),
      Home: 0,
      End: steps.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    root.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  }

  return (
    <ol
      ref={root}
      className={styles.timeline}
      aria-labelledby={labelledBy}
      role="list"
    >
      {steps.map((step, index) => (
        <li
          className={styles.step}
          key={step.title}
          data-active={index === active}
          data-reached={index < active}
          onPointerEnter={(event) => {
            if (event.pointerType !== "touch") setHovered(index);
          }}
          onPointerLeave={() => setHovered(null)}
        >
          {index < steps.length - 1 ? (
            <span className={styles.connector} aria-hidden="true" />
          ) : null}
          <h4 className={styles.heading}>
            <button
              type="button"
              className={styles.stepButton}
              aria-pressed={index === active}
              onClick={() => setReading(index)}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible")) {
                  setFocused(index);
                }
              }}
              onBlur={() => setFocused(null)}
              onKeyDown={(event) => moveFocus(event, index)}
            >
              <span className={styles.marker} aria-hidden="true" />
              <span className={styles.number}>
                {stepLabel} {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.title}>{step.title}</span>
            </button>
          </h4>
          <div className={styles.copy}>
            {step.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {step.points ? (
              <ul>
                {step.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
            {step.note ? <p className={styles.note}>{step.note}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
