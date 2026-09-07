"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { privateLabel } from "@/data/site-content";
import styles from "./PortfolioCarousel.module.css";

const content = privateLabel.portfolio;
export default function PortfolioCarousel() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const displacement = useRef<SVGFEDisplacementMapElement>(null);
  const pointer = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
  const dragged = useRef(false);
  const keyboardFocus = useRef(false);
  useEffect(() => {
    if (keyboardFocus.current) {
      root.current
        ?.querySelector<HTMLButtonElement>(`[data-slide="${active}"]`)
        ?.focus({ preventScroll: true });
      keyboardFocus.current = false;
    }
  }, [active]);
  const filterId = `liquid-${useId().replaceAll(":", "")}`;
  const select = (index: number) =>
    setActive((index + content.slides.length) % content.slides.length);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          displacement.current,
          { attr: { scale: 0 } },
          {
            attr: { scale: 22 },
            duration: 0.27,
            repeat: 1,
            yoyo: true,
            ease: "sine.inOut",
          },
        );
      });
      return () => media.revert();
    },
    { dependencies: [active], scope: root, revertOnUpdate: true },
  );

  return (
    <section
      id="portfolio"
      ref={root}
      className={styles.section}
      aria-label={content.label}
      aria-roledescription="carousel"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          keyboardFocus.current = true;
          select(active + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}
    >
      <svg className={styles.filter} aria-hidden="true">
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009 0.025"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              ref={displacement}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div
        className={styles.viewport}
        onPointerDown={(event) => {
          if (event.button !== 0 || !event.isPrimary) return;
          dragged.current = false;
          pointer.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            moved: false,
          };
        }}
        onPointerMove={(event) => {
          if (
            pointer.current?.id === event.pointerId &&
            Math.abs(event.clientX - pointer.current.x) > 12 &&
            Math.abs(event.clientX - pointer.current.x) >
              Math.abs(event.clientY - pointer.current.y)
          ) {
            pointer.current.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }
        }}
        onPointerUp={(event) => {
          if (pointer.current?.id !== event.pointerId) return;
          const { x, y, moved } = pointer.current;
          pointer.current = null;
          dragged.current = moved;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          const delta = event.clientX - x;
          if (
            Math.abs(delta) > 40 &&
            Math.abs(delta) > Math.abs(event.clientY - y)
          )
            select(active + (delta < 0 ? 1 : -1));
        }}
        onPointerCancel={() => {
          pointer.current = null;
          dragged.current = false;
        }}
        onLostPointerCapture={() => {
          pointer.current = null;
        }}
        onClickCapture={(event) => {
          if (event.detail !== 0 && dragged.current) {
            event.preventDefault();
            event.stopPropagation();
          }
          dragged.current = false;
        }}
      >
        {content.slides.map((slide, index) => {
          let offset =
            (index - active + content.slides.length) % content.slides.length;
          if (offset > 2) offset -= content.slides.length;
          return (
            <button
              type="button"
              key={slide.name}
              className={styles.slide}
              data-slide={index}
              data-active={offset === 0}
              data-offset={offset}
              style={{ "--offset": offset } as CSSProperties}
              aria-label={slide.name}
              aria-current={offset === 0 ? "true" : undefined}
              aria-hidden={Math.abs(offset) > 1}
              tabIndex={Math.abs(offset) <= 1 ? 0 : -1}
              onClick={() => select(index)}
            >
              <div
                className={styles.image}
                style={{ filter: `url(#${filterId})` }}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 859px) 78vw, (max-width: 1440px) 48vw, 640px"
                  draggable={false}
                />
              </div>
            </button>
          );
        })}
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          aria-label={content.previous}
          onClick={() => select(active - 1)}
        >
          ←
        </button>
        <button
          type="button"
          aria-label={content.next}
          onClick={() => select(active + 1)}
        >
          →
        </button>
      </div>
      <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {content.slides[active].name}
      </p>
    </section>
  );
}
