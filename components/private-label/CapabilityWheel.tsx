"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToPosition } from "@/lib/scroll";
import { privateLabel } from "@/data/site-content";
import { capabilityIconPaths } from "./capability-icons";
import common from "./PrivateLabel.module.css";
import styles from "./CapabilityWheel.module.css";

const content = privateLabel.capabilities;
export default function CapabilityWheel() {
  const root = useRef<HTMLElement>(null);
  const orbit = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const swipe = useRef<number | null>(null);
  const dragged = useRef(false);
  const [active, setActive] = useState(0);
  const { contextSafe } = useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 860px) and (prefers-reduced-motion: no-preference)",
        () => {
          const animation = gsap.fromTo(
            orbit.current,
            { "--rotation": "0deg" },
            {
              "--rotation": "-315deg",
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: () => `+=${window.innerHeight * 2.5}`,
                pin: true,
                scrub: 0.35,
                invalidateOnRefresh: true,
                onUpdate: (self) => setActive(Math.round(self.progress * 7)),
              },
            },
          );
          trigger.current = animation.scrollTrigger ?? null;
          return () => {
            trigger.current = null;
          };
        },
      );
      media.add("(max-width: 859px), (prefers-reduced-motion: reduce)", () => {
        gsap.set(orbit.current, { "--rotation": "0deg" });
        setActive(0);
      });
      return () => media.revert();
    },
    { scope: root },
  );
  const choose = (index: number) =>
    contextSafe(() => {
      const next = (index + 8) % 8;
      if (trigger.current) {
        scrollToPosition(
          trigger.current.start +
            ((trigger.current.end - trigger.current.start) * next) / 7,
        );
        ScrollTrigger.update();
      } else if (
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        gsap.to(orbit.current, {
          "--rotation": `${-next * 45}deg`,
          duration: 0.55,
          ease: "power2.out",
          overwrite: true,
        });
      }
      setActive(next);
    })();
  return (
    <section
      id="why-basenote"
      ref={root}
      className={styles.section}
      aria-labelledby="capability-title"
    >
      <div className={styles.inner}>
        <div className={styles.heading}>
          <span className={common.eyebrow}>{privateLabel.eyebrow}</span>
          <h2 id="capability-title">{content.title}</h2>
          <p>{content.description}</p>
        </div>
        <div
          className={styles.wheel}
          onPointerDown={(event) => {
            swipe.current = event.clientX;
            dragged.current = false;
          }}
          onPointerUp={(event) => {
            if (
              swipe.current !== null &&
              Math.abs(event.clientX - swipe.current) > 40
            ) {
              dragged.current = true;
              choose(active + (event.clientX < swipe.current ? 1 : -1));
            }
            swipe.current = null;
          }}
        >
          <div className={styles.rings} aria-hidden="true" />
          <div className={styles.alignment} aria-hidden="true" />
          <Image
            className={styles.logo}
            src={content.logo}
            alt={content.logoAlt}
            width={86}
            height={86}
          />
          <div
            ref={orbit}
            className={styles.orbit}
            role="group"
            aria-label={content.selectionLabel}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault();
                choose(active + (event.key === "ArrowRight" ? 1 : -1));
              }
            }}
          >
            {content.items.map((label, index) => (
              <button
                type="button"
                key={label}
                className={styles.dial}
                data-selected={active === index}
                aria-label={label}
                aria-pressed={active === index}
                style={{ "--angle": `${index * 45}deg` } as CSSProperties}
                onClick={(event) => {
                  if (event.detail === 0 || !dragged.current) choose(index);
                  dragged.current = false;
                }}
              >
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={capabilityIconPaths[index]} />
                </svg>
                <span className={styles.dialLabel}>{label}</span>
              </button>
            ))}
          </div>
          <p
            className={styles.selectedLabel}
            aria-live="polite"
            aria-atomic="true"
          >
            {content.items[active]}
          </p>
        </div>
      </div>
    </section>
  );
}
