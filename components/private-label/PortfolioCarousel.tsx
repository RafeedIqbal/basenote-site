"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./PortfolioCarousel.module.css";

export type PortfolioSlide = {
  name: string;
  image: string;
  alt: string;
};

export type PortfolioCarouselProps = {
  slides: readonly PortfolioSlide[];
  label: string;
  id?: string;
  className?: string;
  initialIndex?: number;
  imageAspectRatio?: number;
  autoPlay?: boolean;
  onActiveChange?: (index: number, slide: PortfolioSlide) => void;
};

type CarouselMotion = {
  select: (direction: number, focus?: boolean) => void;
  selectSlot: (slot: number) => void;
  startDrag: () => void;
  drag: (distance: number) => void;
  endDrag: () => void;
  updateAutoplay: () => void;
};

const wrap = (value: number, length: number) =>
  ((value % length) + length) % length;

// A Gaussian swell keeps the ribbon continuous as each image crosses the center.
const swell = (distance: number) =>
  0.24 + 0.76 * Math.exp(-((distance / 1.05) ** 2));

export default function PortfolioCarousel({
  slides,
  label,
  id = "portfolio",
  className,
  initialIndex = 0,
  imageAspectRatio = 1,
  autoPlay = true,
  onActiveChange,
}: PortfolioCarouselProps) {
  const count = slides.length;
  const aspectRatio =
    Number.isFinite(imageAspectRatio) && imageAspectRatio > 0
      ? imageAspectRatio
      : 1;
  const start = count ? wrap(Math.trunc(initialIndex), count) : 0;
  const [announcement, setAnnouncement] = useState("");
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const motion = useRef<CarouselMotion | null>(null);
  const position = useRef(start);
  const selected = useRef(start);
  const onChange = useRef(onActiveChange);
  const hovering = useRef(false);
  const dragged = useRef(false);
  const pointer = useRef<{
    id: number;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);
  let copies = count > 1 ? Math.ceil(21 / count) : 1;
  if (copies % 2 === 0) copies += 1;
  const slotCount = count * copies;

  useGSAP(
    () => {
      onChange.current = onActiveChange;
    },
    { dependencies: [onActiveChange] },
  );

  useGSAP(
    () => {
      const section = root.current;
      const track = viewport.current;
      if (!section || !track || !count) return;
      const buttons = Array.from(
        track.querySelectorAll<HTMLButtonElement>("[data-slot]"),
      );
      const media = gsap.matchMedia();

      media.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reduced = Boolean(context.conditions?.reduce);
          const phase = { value: Math.round(position.current) };
          // Autoplay advances independently of drag and selection animations.
          let drift = 0;
          let size = track.clientHeight;
          let width = track.clientWidth;
          let desktop = width >= 860;
          let visible = false;
          let tween: gsap.core.Tween | null = null;
          let dragStart = phase.value;
          let target = phase.value;
          let focusAfterSelection = false;
          let ticking = false;

          const draw = () => {
            const current = phase.value + drift;
            position.current = current;
            const center = Math.floor(current);
            const fraction = current - center;
            // Compensate for the changing widths between two centered images.
            const centerBlend =
              fraction + 0.04 * Math.sin(fraction * Math.PI * 2);
            const entries = buttons
              .map((button, slot) => {
                const distance =
                  wrap(slot - current + slotCount / 2, slotCount) -
                  slotCount / 2;
                return {
                  button,
                  slot,
                  distance,
                  virtual: current + distance,
                  size: size * aspectRatio * swell(distance),
                  x: 0,
                };
              })
              .sort((a, b) => a.virtual - b.virtual);
            const anchor = entries.findIndex(
              (entry) => Math.round(entry.virtual) === center,
            );
            if (anchor < 0) return;
            const anchorSize = entries[anchor].size;
            const nextSize = size * aspectRatio * swell(1 - fraction);
            entries[anchor].x =
              width / 2 -
              anchorSize / 2 -
              (centerBlend * (anchorSize + nextSize)) / 2;
            for (let index = anchor + 1; index < entries.length; index += 1) {
              entries[index].x = entries[index - 1].x + entries[index - 1].size;
            }
            for (let index = anchor - 1; index >= 0; index -= 1) {
              entries[index].x = entries[index + 1].x - entries[index].size;
            }

            const currentSlot = wrap(Math.round(current), slotCount);
            for (const entry of entries) {
              const isActive = entry.slot === currentSlot;
              const inView = entry.x + entry.size > 0 && entry.x < width;
              const representative =
                entry.distance >= -count / 2 && entry.distance < count / 2;
              if (inView) {
                const slideWidth = desktop ? size * aspectRatio : entry.size + 0.75;
                const slideHeight = desktop ? size : entry.size / aspectRatio;
                if (entry.button.style.width !== `${slideWidth}px`)
                  entry.button.style.width = `${slideWidth}px`;
                if (entry.button.style.height !== `${slideHeight}px`)
                  entry.button.style.height = `${slideHeight}px`;
                const translate = `translate3d(${entry.x}px, -50%, 0)`;
                if (desktop) {
                  // Keep large images at a fixed layout size; swelling only
                  // changes their transform instead of relaying out each frame.
                  const scaleX = (entry.size + 0.75) / slideWidth;
                  const scaleY = entry.size / slideWidth;
                  entry.button.style.transform = `${translate} scale(${scaleX}, ${scaleY})`;
                  // Compensate for scaling so the visible corner radius stays fixed.
                  entry.button.style.borderRadius = `calc(var(--slide-radius, 10px) / ${scaleX}) / calc(var(--slide-radius, 10px) / ${scaleY})`;
                } else {
                  entry.button.style.transform = translate;
                  entry.button.style.removeProperty("border-radius");
                }
              }
              const zIndex = `${Math.round(swell(entry.distance) * 100)}`;
              const visibility = inView ? "visible" : "hidden";
              const hidden = String(!representative || !inView);
              if (entry.button.style.zIndex !== zIndex)
                entry.button.style.zIndex = zIndex;
              if (entry.button.style.visibility !== visibility)
                entry.button.style.visibility = visibility;
              if (entry.button.dataset.active !== String(isActive)) {
                entry.button.dataset.active = String(isActive);
                entry.button.tabIndex = isActive ? 0 : -1;
                if (isActive) entry.button.setAttribute("aria-current", "true");
                else entry.button.removeAttribute("aria-current");
              }
              if (entry.button.getAttribute("aria-hidden") !== hidden)
                entry.button.setAttribute("aria-hidden", hidden);
            }

            const index = wrap(Math.round(current), count);
            if (index !== selected.current) {
              selected.current = index;
              onChange.current?.(index, slides[index]);
            }
            if (focusAfterSelection) {
              buttons[currentSlot]?.focus({ preventScroll: true });
            }
          };

          const settle = (value: number, focus = false) => {
            tween?.kill();
            target = value - drift;
            focusAfterSelection = focus;
            const index = wrap(Math.round(value), count);
            setAnnouncement(`${slides[index].name} — ${index + 1} / ${count}`);
            if (reduced) {
              phase.value = target;
              draw();
              focusAfterSelection = false;
              return;
            }
            tween = gsap.to(phase, {
              value: target,
              duration: 0.85,
              ease: "power3.out",
              onUpdate: draw,
              onComplete: () => {
                tween = null;
                focusAfterSelection = false;
              },
            });
          };

          motion.current = {
            select: (direction, focus) =>
              settle(
                Math.round((tween ? target : phase.value) + drift) + direction,
                focus,
              ),
            selectSlot: (slot) =>
              settle(
                Math.round(
                  phase.value +
                    drift +
                    wrap(
                      slot - phase.value - drift + slotCount / 2,
                      slotCount,
                    ) -
                    slotCount / 2,
                ),
                true,
              ),
            startDrag: () => {
              tween?.kill();
              tween = null;
              focusAfterSelection = false;
              dragStart = phase.value;
            },
            drag: (distance) => {
              if (!reduced) {
                phase.value = dragStart - distance / (size * aspectRatio);
                draw();
              }
            },
            endDrag: () => settle(Math.round(phase.value + drift)),
            updateAutoplay: () => updateAutoplay(),
          };

          const resize = new ResizeObserver(() => {
            size = track.clientHeight;
            width = track.clientWidth;
            desktop = width >= 860;
            draw();
          });
          resize.observe(track);
          const visibility = new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting;
              updateAutoplay();
            },
            { threshold: 0.1 },
          );
          visibility.observe(track);

          const tick = (_time: number, delta: number) => {
            drift += (Math.min(delta, 64) / 1000) * (desktop ? 0.14 : 0.06);
            draw();
          };
          // Returning early from a ticker still keeps GSAP's RAF loop awake.
          // Register it only while the carousel is able to advance unattended.
          const updateAutoplay = () => {
            const shouldTick =
              !reduced &&
              autoPlay &&
              count > 1 &&
              visible &&
              !document.hidden &&
              !hovering.current;
            if (shouldTick === ticking) return;
            ticking = shouldTick;
            if (ticking) gsap.ticker.add(tick);
            else gsap.ticker.remove(tick);
          };
          document.addEventListener("visibilitychange", updateAutoplay);
          draw();
          updateAutoplay();

          return () => {
            motion.current = null;
            tween?.kill();
            gsap.ticker.remove(tick);
            document.removeEventListener("visibilitychange", updateAutoplay);
            resize.disconnect();
            visibility.disconnect();
            const pointerId = pointer.current?.id;
            if (pointerId !== undefined && track.hasPointerCapture(pointerId))
              track.releasePointerCapture(pointerId);
            pointer.current = null;
            track.dataset.dragging = "false";
          };
        },
      );
      return () => media.revert();
    },
    {
      dependencies: [slides, count, slotCount, autoPlay, aspectRatio],
      scope: root,
      revertOnUpdate: true,
    },
  );

  if (!count) return null;

  return (
    <section
      id={id}
      ref={root}
      className={[styles.section, className].filter(Boolean).join(" ")}
      style={{ "--image-aspect-ratio": aspectRatio } as CSSProperties}
      aria-label={label}
      aria-roledescription="carousel"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          hovering.current = true;
          motion.current?.updateAutoplay();
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          hovering.current = false;
          motion.current?.updateAutoplay();
        }
      }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || !pointer.current) return;
        // Captured pointers still reach the viewport after leaving its bounds.
        const bounds = event.currentTarget.getBoundingClientRect();
        hovering.current =
          event.clientX >= bounds.left &&
          event.clientX < bounds.right &&
          event.clientY >= bounds.top &&
          event.clientY < bounds.bottom;
        motion.current?.updateAutoplay();
      }}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        motion.current?.select(
          event.key === "ArrowRight" ? 1 : -1,
          (event.target as HTMLElement).hasAttribute("data-slot"),
        );
      }}
    >
      <div
        ref={viewport}
        className={styles.viewport}
        onPointerDown={(event) => {
          if (count < 2 || event.button !== 0 || !event.isPrimary) return;
          dragged.current = false;
          pointer.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            moved: false,
          };
          motion.current?.startDrag();
          motion.current?.updateAutoplay();
        }}
        onPointerMove={(event) => {
          const start = pointer.current;
          if (start?.id !== event.pointerId) return;
          const delta = event.clientX - start.x;
          if (
            !start.moved &&
            Math.abs(delta) > 8 &&
            Math.abs(delta) > Math.abs(event.clientY - start.y)
          ) {
            start.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.dataset.dragging = "true";
          }
          if (start.moved) motion.current?.drag(delta);
        }}
        onPointerUp={(event) => {
          const start = pointer.current;
          if (start?.id !== event.pointerId) return;
          pointer.current = null;
          dragged.current = start.moved;
          event.currentTarget.dataset.dragging = "false";
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
          if (start.moved) {
            if (
              window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
              Math.abs(event.clientX - start.x) > 40
            ) {
              motion.current?.select(event.clientX < start.x ? 1 : -1);
            } else motion.current?.endDrag();
          }
          motion.current?.updateAutoplay();
        }}
        onPointerCancel={(event) => {
          if (pointer.current?.id !== event.pointerId) return;
          pointer.current = null;
          dragged.current = false;
          if (viewport.current) viewport.current.dataset.dragging = "false";
          motion.current?.endDrag();
          motion.current?.updateAutoplay();
        }}
        onLostPointerCapture={(event) => {
          // Touch starts with implicit capture on the image button. Transferring
          // it to the viewport must not cancel the gesture as that event bubbles.
          if (
            event.target !== event.currentTarget ||
            pointer.current?.id !== event.pointerId
          )
            return;
          pointer.current = null;
          if (viewport.current) viewport.current.dataset.dragging = "false";
          motion.current?.endDrag();
          motion.current?.updateAutoplay();
        }}
        onClickCapture={(event) => {
          if (event.detail !== 0 && dragged.current) {
            event.preventDefault();
            event.stopPropagation();
          }
          dragged.current = false;
        }}
      >
        {Array.from({ length: slotCount }, (_, slot) => {
          const index = slot % count;
          const slide = slides[index];
          return (
            <button
              type="button"
              key={slot}
              className={styles.slide}
              data-slot={slot}
              data-slide={index}
              data-active={slot === start}
              style={{ "--initial-offset": slot - start } as CSSProperties}
              aria-label={slide.name}
              aria-current={slot === start ? "true" : undefined}
              aria-hidden={slot !== start}
              tabIndex={slot === start ? 0 : -1}
              onClick={() => motion.current?.selectSlot(slot)}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes={`(max-width: 717px) ${78 * aspectRatio}vw, ${560 * aspectRatio}px`}
                draggable={false}
              />
            </button>
          );
        })}
      </div>
      <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  );
}
