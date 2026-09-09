"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  privateLabelGuide as content,
  type GuideStep,
} from "@/data/site-content";
import styles from "./GuideProductionTimeline.module.css";

export default function GuideProductionTimeline({
  steps,
}: {
  steps: GuideStep[];
}) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const list = root.current;
      if (!list) return;

      const rows = Array.from(list.children) as HTMLLIElement[];
      const revealed = new Set<HTMLLIElement>();
      const media = gsap.matchMedia();
      let initialSetup = true;

      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const firstSetup = initialSetup;
          initialSetup = false;
          if (context.conditions?.reduced) return;

          const animations = new Map<HTMLLIElement, gsap.core.Timeline>();
          rows.forEach((row, index) => {
            // Restoring motion must not hide the step someone is reading.
            if (
              revealed.has(row) ||
              row.contains(document.activeElement) ||
              (!firstSetup && row.getBoundingClientRect().top < window.innerHeight)
            )
              return;

            const fill = row.querySelector<HTMLElement>("[data-step-fill]");
            const animation = gsap.timeline({
              scrollTrigger: {
                trigger: row,
                start: "top 90%",
                once: true,
              },
              onComplete: () => {
                revealed.add(row);
              },
            });

            animation.from(
              row,
              { opacity: 0, y: 22, duration: 0.55, ease: "power3.out" },
              index * 0.05,
            );
            if (fill)
              animation.from(
                fill,
                { scaleY: 0, duration: 0.7, ease: "power3.out" },
                0.15 + index * 0.12,
              );
            animations.set(row, animation);
          });

          const revealFocusedStep = (event: FocusEvent) => {
            const row = rows.find((item) => item.contains(event.target as Node));
            if (row) animations.get(row)?.progress(1);
          };
          list.addEventListener("focusin", revealFocusedStep);

          return () => {
            list.removeEventListener("focusin", revealFocusedStep);
          };
        },
      );

      return () => media.revert();
    },
    { scope: root, dependencies: [steps], revertOnUpdate: true },
  );

  return (
    <ol ref={root} className={styles.timeline} role="list">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className={styles.step}
          tabIndex={0}
          aria-label={`${content.labels.step} ${index + 1}: ${step.title}`}
        >
          <div className={styles.rail} aria-hidden="true">
            <span className={styles.number}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={styles.connector}>
              <span className={styles.fill} data-step-fill="" />
            </span>
          </div>
          <div className={styles.copy}>
            <h3>{step.title}</h3>
            {step.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {step.points ? (
              <ul className={styles.points}>
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
