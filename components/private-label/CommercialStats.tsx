"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { privateLabel } from "@/data/site-content";
import common from "./PrivateLabel.module.css";
import styles from "./CommercialStats.module.css";

const content = privateLabel.commercial;
const stats = content.stats.map((stat) => {
  const parts = stat.value.match(/^(.*?)(£?\d+(?:–\d+)?)(.*)$/);
  return {
    ...stat,
    prefix: parts?.[1],
    number: parts?.[2],
    suffix: parts?.[3],
  };
});

export default function CommercialStats({
  variant,
  sectionNumber = "06",
}: { variant?: "guide"; sectionNumber?: string } = {}) {
  const root = useRef<HTMLElement>(null);
  const revealed = useRef(false);
  const isGuide = variant === "guide";
  const titleId = isGuide ? "guide-commercial-title" : "commercial-title";

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        if (revealed.current || !root.current) return;

        const strip = root.current.querySelector("dl");
        const items = root.current.querySelectorAll<HTMLElement>("[data-stat]");
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: strip,
            start: "top 85%",
            once: true,
          },
          onStart: () => {
            revealed.current = true;
          },
        });

        items.forEach((item, index) => {
          timeline.fromTo(
            item.children,
            { opacity: 0, y: 24, filter: "blur(8px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 2,
              ease: "power3.out",
              clearProps: "opacity,transform,filter",
            },
            index * 0.12,
          );

          const number = item.querySelector<HTMLElement>("[data-stat-number]");
          const finalValue = number?.dataset.statNumber;
          if (!number || !finalValue) return;

          const counter = { progress: 0 };
          number.textContent = finalValue.replace(/\d+/g, "0");
          timeline.to(
            counter,
            {
              progress: 1,
              duration: 2,
              ease: "power3.out",
              onUpdate: () => {
                number.textContent = finalValue.replace(/\d+/g, (value) =>
                  String(Math.round(Number(value) * counter.progress)),
                );
              },
            },
            index * 0.12,
          );
        });

        return () => {
          items.forEach((item) => {
            const number = item.querySelector<HTMLElement>("[data-stat-number]");
            if (number?.dataset.statNumber) {
              number.textContent = number.dataset.statNumber;
            }
          });
        };
      });
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section
      id={isGuide ? undefined : "what-to-expect"}
      ref={root}
      className={`${styles.section} ${isGuide ? styles.guide : `${common.section} ${styles.standalone}`}`}
      aria-labelledby={titleId}
    >
      {isGuide ? (
        <h3 id={titleId} className={styles.title}>
          {content.title}
        </h3>
      ) : (
        <div
          className={`${common.sectionHeading} ${styles.heading}`}
          data-reveal=""
        >
          <span className={common.sectionNumber} aria-hidden="true">
            {sectionNumber} /
          </span>
          <h2 id={titleId} className={styles.title}>
            {content.title}
          </h2>
        </div>
      )}
      <dl className={styles.strip}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat} data-stat="">
            <dt className={styles.label}>{stat.label}</dt>
            <dd className={styles.value}>
              <span className={common.srOnly}>{stat.value}</span>
              <span className={styles.display} aria-hidden="true">
                {stat.number ? (
                  <>
                    {stat.prefix ? (
                      <span className={styles.affix}>{stat.prefix}</span>
                    ) : null}
                    <span className={styles.number} data-stat-number={stat.number}>
                      {stat.number}
                    </span>
                    {stat.suffix ? (
                      <span className={styles.affix}>{stat.suffix}</span>
                    ) : null}
                  </>
                ) : (
                  <span className={styles.textValue}>{stat.value}</span>
                )}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
