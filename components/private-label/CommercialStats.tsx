"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { privateLabel } from "@/data/site-content";
import styles from "./PrivateLabel.module.css";
import guideStyles from "./PrivateLabelGuide.module.css";

const content = privateLabel.commercial;
export default function CommercialStats({
  variant,
}: { variant?: "guide" } = {}) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const values =
          root.current?.querySelectorAll<HTMLElement>("[data-stat]");
        values?.forEach((element, index) => {
          if (index === 3) {
            gsap.from(element, {
              opacity: 0,
              duration: 0.8,
              scrollTrigger: {
                trigger: root.current,
                start: "top 80%",
                once: true,
              },
            });
            return;
          }
          const counter = { value: 0 };
          gsap.to(counter, {
            value: 1,
            duration: 1.5,
            delay: index * 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: root.current,
              start: "top 80%",
              once: true,
            },
            onUpdate: () => {
              const value =
                index === 0
                  ? `${Math.round(500 * counter.value)}`
                  : index === 1
                    ? `${Math.round(8 * counter.value)}–${Math.round(12 * counter.value)}`
                    : `${Math.round(20 * counter.value)}`;
              element.textContent = content.stats[index].value.replace(
                index === 0 ? "500" : index === 1 ? "8–12" : "20",
                value,
              );
            },
          });
        });
        return () =>
          values?.forEach((element, index) => {
            element.textContent = content.stats[index].value;
          });
      });
      return () => media.revert();
    },
    { scope: root },
  );
  if (variant === "guide")
    return (
      <section
        ref={root}
        className={guideStyles.expectations}
        aria-labelledby="guide-commercial-title"
      >
        <h3 id="guide-commercial-title">{content.title}</h3>
        <dl>
          {content.stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>
                <span className={styles.srOnly}>{stat.value}</span>
                <span data-stat="" aria-hidden="true">
                  {stat.value}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  return (
    <section
      id="what-to-expect"
      ref={root}
      className={styles.section}
      aria-labelledby="commercial-title"
    >
      <div className={styles.sectionHeading} data-reveal="">
        <span className={styles.sectionNumber} aria-hidden="true">
          06 /
        </span>
        <h2 id="commercial-title">{content.title}</h2>
      </div>
      <div className={styles.statsGrid}>
        {content.stats.map((stat) => (
          <div key={stat.label}>
            <strong>
              <span className={styles.srOnly}>{stat.value}</span>
              <span data-stat="" aria-hidden="true">
                {stat.value}
              </span>
            </strong>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
