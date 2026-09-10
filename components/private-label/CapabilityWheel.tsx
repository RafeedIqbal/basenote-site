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
const itemCount = content.items.length;
// Two copies keep the broad arc populated as each capability passes the logo.
const orbitItems = [...content.items, ...content.items];
const angleStep = 360 / orbitItems.length;

export default function CapabilityWheel() {
  const root = useRef<HTMLElement>(null);
  const orbit = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null);
  const activeIndex = useRef(0);
  const [active, setActive] = useState(0);
  const { contextSafe } = useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          all: "all",
          desktop: "(min-width: 860px) and (min-height: 700px)",
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          gsap.killTweensOf(orbit.current);
          gsap.set(orbit.current, {
            "--rotation": `${activeIndex.current * angleStep}deg`,
          });

          if (context.conditions?.desktop && !context.conditions.reducedMotion) {
            const animation = gsap.fromTo(
              orbit.current,
              { "--rotation": "0deg" },
              {
                "--rotation": `${(itemCount - 1) * angleStep}deg`,
                ease: "none",
                scrollTrigger: {
                  trigger: root.current,
                  start: "top top",
                  end: () => `+=${window.innerHeight * 2.5}`,
                  pin: true,
                  scrub: 0.35,
                  invalidateOnRefresh: true,
                  onUpdate: (self) => {
                    const next = Math.round(self.progress * (itemCount - 1));
                    activeIndex.current = next;
                    setActive(next);
                  },
                },
              },
            );
            trigger.current = animation.scrollTrigger ?? null;
          }

          return () => {
            trigger.current = null;
          };
        },
      );
      return () => media.revert();
    },
    { scope: root },
  );

  const choose = (index: number) => contextSafe(() => {
    const next = (index + itemCount) % itemCount;
    if (trigger.current) {
      scrollToPosition(
        trigger.current.start +
          ((trigger.current.end - trigger.current.start) * next) / (itemCount - 1),
      );
      ScrollTrigger.update();
      trigger.current.getTween()?.progress(1);
    } else {
      const currentRotation =
        parseFloat(String(gsap.getProperty(orbit.current, "--rotation"))) || 0;
      const cycle = itemCount * angleStep;
      const targetAngle = next * angleStep;
      // Compute an exact stop: adding a wrapped delta can leave an epsilon at
      // zero that GSAP serializes with duplicate "deg" units.
      const targetRotation =
        targetAngle + Math.round((currentRotation - targetAngle) / cycle) * cycle;
      gsap.to(orbit.current, {
        "--rotation": `${targetRotation}deg`,
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : 0.65,
        ease: "power2.out",
        overwrite: true,
      });
    }
    activeIndex.current = next;
    setActive(next);
  })();

  return (
    <section
      id="why-basenote"
      ref={root}
      className={styles.section}
      aria-labelledby="capability-title"
    >
      <div className={styles.heading}>
        <div>
          <span className={`${common.eyebrow} ${styles.eyebrow}`}>
            {privateLabel.eyebrow}
          </span>
          <h2 id="capability-title">{content.title}</h2>
        </div>
        <p>{content.description}</p>
      </div>

      <div className={styles.visual}>
        <div className={styles.glow} aria-hidden="true" />
        <div
          className={styles.wheel}
          aria-hidden="true"
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            swipe.current = {
              id: event.pointerId,
              x: event.clientX,
              y: event.clientY,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={(event) => {
            if (swipe.current?.id !== event.pointerId) return;
            const dx = event.clientX - swipe.current.x;
            const dy = event.clientY - swipe.current.y;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
              choose(activeIndex.current + (dx < 0 ? 1 : -1));
            }
            swipe.current = null;
          }}
          onPointerCancel={(event) => {
            if (swipe.current?.id === event.pointerId) swipe.current = null;
          }}
          onLostPointerCapture={(event) => {
            if (swipe.current?.id === event.pointerId) swipe.current = null;
          }}
        >
          <div className={styles.rings} />
          <div className={styles.capsule}>
            <div className={styles.logoDisc}>
              <Image
                className={styles.logo}
                src={content.logo}
                alt=""
                width={64}
                height={64}
                sizes="64px"
                draggable={false}
              />
            </div>
          </div>
          <div ref={orbit} className={styles.orbit}>
            {orbitItems.map((label, index) => (
              <span
                key={`${label}-${index}`}
                className={styles.dial}
                data-selected={active === index % itemCount}
                style={{ "--angle": `${-index * angleStep}deg` } as CSSProperties}
              >
                <span className={styles.iconDisc}>
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={capabilityIconPaths[index % itemCount]} />
                  </svg>
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.selection}>
          <p
            className={styles.selectedLabel}
            aria-live="polite"
            aria-atomic="true"
          >
            {content.items[active]}
          </p>
          <div
            className={styles.controls}
            role="group"
            aria-label={content.selectionLabel}
            onKeyDown={(event) => {
              if (event.altKey || event.ctrlKey || event.metaKey) return;
              let next: number;
              if (event.key === "ArrowRight") next = activeIndex.current + 1;
              else if (event.key === "ArrowLeft") next = activeIndex.current - 1;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = itemCount - 1;
              else return;

              event.preventDefault();
              choose(next);
              event.currentTarget
                .querySelectorAll<HTMLButtonElement>("button")[
                  (next + itemCount) % itemCount
                ]
                ?.focus({ preventScroll: true });
            }}
          >
            {content.items.map((label, index) => (
              <button
                type="button"
                key={label}
                className={styles.control}
                aria-label={label}
                title={label}
                aria-pressed={active === index}
                onClick={() => choose(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
