"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollToAnchor, setScrollLocked } from "@/lib/scroll";
import {
  closePortfolioProject, getPortfolioHash, getServerPortfolioHash,
  openPortfolioProject, portfolioSlugFromHash, subscribeToPortfolioHash,
} from "@/lib/portfolio-navigation";
import type { PortfolioProject, PrivateLabelContent } from "@/data/site-content";
import styles from "./PortfolioCarousel.module.css";

type PortfolioLabels = PrivateLabelContent["portfolio"]["labels"];
export type PortfolioCarouselProps = PrivateLabelContent["portfolio"] & { id?: string };

function ProjectGallery({ project, labels }: { project: PortfolioProject; labels: PortfolioLabels }) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const count = project.images.length;
  const current = project.images[active];
  const move = (direction: number) => {
    if (count > 1) setActive((index) => (index + direction + count) % count);
  };

  return (
    <div
      className={styles.gallery}
      role={count > 1 ? "region" : undefined}
      aria-roledescription={count > 1 ? "carousel" : undefined}
      aria-label={count > 1 ? project.name : undefined}
      onKeyDown={(event) => {
        if (count < 2 || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <div
        className={styles.projectImage}
        onPointerDown={(event) => {
          if (count < 2 || !event.isPrimary || event.button !== 0) return;
          pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = pointer.current;
          if (!start || start.id !== event.pointerId) return;
          pointer.current = null;
          const dx = event.clientX - start.x;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(event.clientY - start.y)) {
            move(dx < 0 ? 1 : -1);
          }
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={() => { pointer.current = null; }}
        onLostPointerCapture={() => { pointer.current = null; }}
      >
        {current && !failed.includes(current.src) ? (
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="(max-width: 699px) calc(100vw - 32px), (max-width: 1100px) 45vw, 480px"
            draggable={false}
            onError={() => setFailed((previous) => [...previous, current.src])}
          />
        ) : <p className={styles.imageFallback}>{labels.imageUnavailable}</p>}
      </div>
      {count > 1 ? (
        <div className={styles.galleryControls}>
          <button type="button" onClick={() => move(-1)} aria-label={labels.previousImage}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 3-5 5 5 5" /></svg>
          </button>
          <span role="status" aria-atomic="true">{active + 1} / {count}</span>
          <button type="button" onClick={() => move(1)} aria-label={labels.nextImage}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function PortfolioStory({
  project, labels, onClose,
}: {
  project: PortfolioProject;
  labels: PortfolioLabels;
  onClose: () => void;
}) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const backdropPressed = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    element.showModal();
    document.body.style.paddingRight = (padding + scrollbarWidth) + "px";
    document.body.style.overflow = "hidden";
    setScrollLocked(true);
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      setScrollLocked(false);
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby={id + "-title"}
      onClose={(event) => {
        // Strict Mode can reopen the dialog before an effect cleanup's queued
        // close event arrives. Only dismiss the story when it is still closed.
        if (!event.currentTarget.open) onClose();
      }}
      onPointerDown={(event) => {
        backdropPressed.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (backdropPressed.current && event.target === event.currentTarget) {
          event.currentTarget.close();
        }
        backdropPressed.current = false;
      }}
    >
      <div className={styles.panel} data-lenis-prevent>
        <button
          className={styles.close}
          type="button"
          aria-label={labels.close}
          onClick={() => dialog.current?.close()}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg>
        </button>
        <ProjectGallery project={project} labels={labels} />
        <div className={styles.story}>
          <p className={styles.clientName}>{project.name}</p>
          <h2 id={id + "-title"}>{project.headline}</h2>
          {project.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </dialog>
  );
}

export default function PortfolioCarousel({
  slides, label, labels, id = "portfolio",
}: PortfolioCarouselProps) {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const playback = useRef<(() => void) | null>(null);
  const reveal = useRef<((index: number) => void) | null>(null);
  const suppressClick = useRef(false);
  const loopProgress = useRef(0);
  const [copies, setCopies] = useState(1);
  const hash = useSyncExternalStore(subscribeToPortfolioHash, getPortfolioHash, getServerPortfolioHash);
  const selected = slides.find((project) => project.slug === portfolioSlugFromHash(hash));
  const previousProject = useRef<PortfolioProject | undefined>(undefined);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const previous = previousProject.current;
    previousProject.current = selected;
    if (selected || !previous) return;
    // Fragment history navigation can reset native focus after the dialog
    // unmounts. Restore it after that step, cancelling if another story opens
    // or this route unmounts in the meantime.
    const frame = requestAnimationFrame(() => {
      const section = root.current;
      const link = section?.querySelector<HTMLAnchorElement>(
        `a[data-portfolio-primary][href="#${encodeURIComponent(previous.slug)}"]`,
      );
      if (!link) return;
      // Direct arrivals may not have reached the ribbon before opening.
      if (!window.location.hash && section) {
        const bounds = section.getBoundingClientRect();
        if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) scrollToAnchor(section);
      }
      link.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [selected]);

  useGSAP(() => {
    const section = root.current;
    const frame = viewport.current;
    if (!section || !frame || slides.length < 2) return;
    const items = Array.from(frame.querySelectorAll<HTMLLIElement>("li"));
    const links = items.map((item) => item.querySelector<HTMLAnchorElement>("a")!);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      let width = 0;
      let widths: number[] = [];
      let offsets: number[] = [];
      let cycle = 0;
      let period = 0;
      let phase = 0;
      let inView = false;
      let running = false;
      let pointer: { id: number; x: number; y: number; phase: number; dragging: boolean } | null = null;
      const place = items.map((item) => gsap.quickSetter(item, "x", "px"));
      const wrap = (value: number) => ((value % period) + period) % period;
      const position = (index: number) => wrap(offsets[index] - phase + widths[index]) - widths[index];
      const paint = () => {
        place.forEach((set, index) => set(position(index)));
      };
      const show = (index: number) => {
        // A pointer press may focus a partially visible link. Keep the strip
        // beneath the pointer until we know whether this is a click or a drag.
        if (pointer) return;
        const x = position(index);
        if (x < 0 || x + widths[index] > width) {
          phase = wrap(offsets[index] - (width - widths[index]) / 2);
          paint();
        }
      };
      const resize = () => {
        if (pointer) finishDrag();
        const progress = cycle ? (phase % cycle) / cycle : loopProgress.current;
        width = frame.clientWidth;
        widths = items.map((item) => item.getBoundingClientRect().width);
        let offset = 0;
        offsets = widths.map((itemWidth) => {
          const start = offset;
          offset += itemWidth;
          return start;
        });
        cycle = widths.slice(0, slides.length).reduce((sum, itemWidth) => sum + itemWidth, 0);
        // Natural logo widths plus equal padding form each slot. Keep a full
        // extra slot offscreen so even the widest logo wraps without a gap.
        const nextCopies = Math.max(1, Math.ceil((width + Math.max(...widths)) / cycle));
        if (nextCopies !== copies) setCopies(nextCopies);
        period = offset;
        phase = progress * cycle;
        paint();
        const active = links.indexOf(document.activeElement as HTMLAnchorElement);
        if (active >= 0) show(active);
      };
      const tick = (_time: number, delta: number) => {
        phase = wrap(phase + Math.min(delta, 64) * 0.028);
        paint();
      };
      const sync = () => {
        const shouldRun = inView && !document.hidden && !pointer && section.dataset.paused !== "true";
        if (shouldRun === running) return;
        running = shouldRun;
        if (running) gsap.ticker.add(tick);
        else gsap.ticker.remove(tick);
      };
      const finishDrag = () => {
        const previous = pointer;
        pointer = null;
        delete frame.dataset.dragging;
        if (previous?.dragging) suppressClick.current = true;
        if (previous && frame.hasPointerCapture(previous.id)) frame.releasePointerCapture(previous.id);
        sync();
      };
      const pointerDown = (event: PointerEvent) => {
        if (pointer || !event.isPrimary || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, phase, dragging: false };
        sync();
      };
      const pointerMove = (event: PointerEvent) => {
        if (!pointer || pointer.id !== event.pointerId) return;
        const dx = event.clientX - pointer.x;
        const dy = event.clientY - pointer.y;
        if (!pointer.dragging) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
          if (Math.abs(dy) >= Math.abs(dx)) {
            // Let a vertical touch gesture scroll the page instead.
            suppressClick.current = true;
            finishDrag();
            return;
          }
          pointer.dragging = true;
          frame.dataset.dragging = "true";
          frame.setPointerCapture(event.pointerId);
        }
        event.preventDefault();
        phase = wrap(pointer.phase - dx);
        paint();
      };
      const pointerEnd = (event: PointerEvent) => {
        if (pointer?.id === event.pointerId) finishDrag();
      };
      const pointerLeave = () => {
        if (pointer && !pointer.dragging) finishDrag();
      };
      const lostCapture = (event: PointerEvent) => {
        if (event.target === frame) pointerEnd(event);
      };
      const visibilityChanged = () => {
        if (document.hidden && pointer) finishDrag();
        sync();
      };
      frame.addEventListener("pointerdown", pointerDown);
      frame.addEventListener("pointermove", pointerMove, { passive: false });
      frame.addEventListener("pointerup", pointerEnd);
      frame.addEventListener("pointercancel", pointerEnd);
      frame.addEventListener("pointerleave", pointerLeave);
      frame.addEventListener("lostpointercapture", lostCapture);
      frame.dataset.motion = "true";
      resize();
      const bounds = frame.getBoundingClientRect();
      inView = bounds.bottom > 0 && bounds.top < window.innerHeight;
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        sync();
      });
      observer.observe(frame);
      const size = new ResizeObserver(resize);
      size.observe(frame);
      items.slice(0, slides.length).forEach((item) => size.observe(item));
      document.addEventListener("visibilitychange", visibilityChanged);
      window.addEventListener("blur", finishDrag);
      playback.current = sync;
      reveal.current = show;
      sync();

      return () => {
        if (cycle) loopProgress.current = (phase % cycle) / cycle;
        finishDrag();
        gsap.ticker.remove(tick);
        observer.disconnect();
        size.disconnect();
        document.removeEventListener("visibilitychange", visibilityChanged);
        window.removeEventListener("blur", finishDrag);
        frame.removeEventListener("pointerdown", pointerDown);
        frame.removeEventListener("pointermove", pointerMove);
        frame.removeEventListener("pointerup", pointerEnd);
        frame.removeEventListener("pointercancel", pointerEnd);
        frame.removeEventListener("pointerleave", pointerLeave);
        frame.removeEventListener("lostpointercapture", lostCapture);
        playback.current = null;
        reveal.current = null;
        delete frame.dataset.motion;
        gsap.set(items, { clearProps: "transform" });
      };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [slides, copies], revertOnUpdate: true });

  useEffect(() => {
    playback.current?.();
  }, [hovered, focused, selected]);

  if (!slides.length) return null;

  return (
    <section
      ref={root}
      id={id}
      className={styles.section}
      aria-label={label}
      data-paused={hovered || focused || Boolean(selected)}
    >
      <div
        ref={viewport}
        className={styles.viewport}
        onPointerDown={() => { suppressClick.current = false; }}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (!suppressClick.current || event.detail === 0) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>("a[data-portfolio-primary]"));
          const current = links.indexOf(document.activeElement as HTMLAnchorElement);
          const next = {
            ArrowRight: (current + 1) % slides.length,
            ArrowLeft: (current - 1 + slides.length) % slides.length,
            Home: 0,
            End: slides.length - 1,
          }[event.key];
          if (next === undefined) return;
          event.preventDefault();
          links[next]?.focus({ preventScroll: true });
        }}
      >
        <ul className={styles.wordmarks}>
          {Array.from({ length: copies }, (_, copy) => slides.map((project, index) => (
            <li
              key={`${copy}-${project.slug}`}
              className={copy > 0 ? styles.repeat : undefined}
              aria-hidden={copy > 0 ? true : undefined}
            >
              <a
                href={"#" + encodeURIComponent(project.slug)}
                className={styles.wordmark}
                aria-haspopup="dialog"
                aria-label={project.name}
                draggable={false}
                tabIndex={copy > 0 ? -1 : undefined}
                data-portfolio-primary={copy === 0 ? "" : undefined}
                onFocus={() => { if (copy === 0) reveal.current?.(index); }}
                onPointerDown={(event) => {
                  // Keep pointer-operated visual repeats out of the hidden
                  // accessibility subtree's focus; clicks still open stories.
                  if (copy > 0 && event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
                    event.preventDefault();
                  }
                }}
                onClick={(event) => {
                  if (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
                  event.preventDefault();
                  openPortfolioProject(project.slug);
                }}
                onKeyDown={(event) => {
                  if (event.key !== " " || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
                  event.preventDefault();
                  openPortfolioProject(project.slug);
                }}
              >
                {project.logo ? (
                  <span
                    className={styles.logo}
                    style={{ aspectRatio: `${project.logo.bounds.width} / ${project.logo.bounds.height}` }}
                  >
                    <Image
                      src={project.logo.src}
                      alt=""
                      width={project.logo.width}
                      height={project.logo.height}
                      sizes={`(max-width: 859px) ${Math.ceil(28 * project.logo.width / project.logo.bounds.height)}px, ${Math.ceil(36 * project.logo.width / project.logo.bounds.height)}px`}
                      draggable={false}
                      style={{
                        width: `${100 * project.logo.width / project.logo.bounds.width}%`,
                        height: `${100 * project.logo.height / project.logo.bounds.height}%`,
                        left: `${-100 * project.logo.bounds.left / project.logo.bounds.width}%`,
                        top: `${-100 * project.logo.bounds.top / project.logo.bounds.height}%`,
                      }}
                    />
                  </span>
                ) : <span>{project.name}</span>}
              </a>
            </li>
          )))}
        </ul>
      </div>
      {selected ? (
        <PortfolioStory
          key={selected.slug}
          project={selected}
          labels={labels}
          onClose={() => closePortfolioProject(selected.slug)}
        />
      ) : null}
    </section>
  );
}
