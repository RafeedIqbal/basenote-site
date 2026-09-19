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
  const hash = useSyncExternalStore(subscribeToPortfolioHash, getPortfolioHash, getServerPortfolioHash);
  const selected = slides.find((project) => project.slug === portfolioSlugFromHash(hash));
  const previousProject = useRef<PortfolioProject | undefined>(undefined);
  const [paused, setPaused] = useState(false);
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
        `a[href="#${encodeURIComponent(previous.slug)}"]`,
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
      let slot = 0;
      let period = 0;
      let phase = 0;
      let inView = false;
      let running = false;
      const place = items.map((item) => gsap.quickSetter(item, "x", "px"));
      const wrap = (value: number) => ((value % period) + period) % period;
      const paint = () => {
        place.forEach((set, index) => set(wrap(index * slot - phase + slot) - slot));
      };
      const show = (index: number) => {
        const x = wrap(index * slot - phase + slot) - slot;
        if (x < 0 || x + slot > width) {
          phase = wrap(index * slot - (width - slot) / 2);
          paint();
        }
      };
      const resize = () => {
        const progress = period ? phase / period : 0;
        width = frame.clientWidth;
        // An offscreen slot lets one accessible instance of each brand wrap
        // without a visible jump or duplicate focus targets.
        slot = Math.max(240, width / (items.length - 1));
        period = slot * items.length;
        phase = progress * period;
        frame.style.setProperty("--slot-width", slot + "px");
        paint();
        const active = links.indexOf(document.activeElement as HTMLAnchorElement);
        if (active >= 0) show(active);
      };
      const tick = (_time: number, delta: number) => {
        phase = wrap(phase + Math.min(delta, 64) * 0.028);
        paint();
      };
      const sync = () => {
        const shouldRun = inView && !document.hidden && section.dataset.paused !== "true";
        if (shouldRun === running) return;
        running = shouldRun;
        if (running) gsap.ticker.add(tick);
        else gsap.ticker.remove(tick);
      };
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
      document.addEventListener("visibilitychange", sync);
      playback.current = sync;
      reveal.current = show;
      sync();

      return () => {
        gsap.ticker.remove(tick);
        observer.disconnect();
        size.disconnect();
        document.removeEventListener("visibilitychange", sync);
        playback.current = null;
        reveal.current = null;
        delete frame.dataset.motion;
        frame.style.removeProperty("--slot-width");
        gsap.set(items, { clearProps: "transform" });
      };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [slides], revertOnUpdate: true });

  useEffect(() => {
    playback.current?.();
  }, [paused, hovered, focused, selected]);

  if (!slides.length) return null;

  return (
    <section
      ref={root}
      id={id}
      className={styles.section}
      aria-label={label}
      data-paused={paused || hovered || focused || Boolean(selected)}
    >
      <div
        ref={viewport}
        className={styles.viewport}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          const links = Array.from(event.currentTarget.querySelectorAll("a"));
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
          {slides.map((project, index) => (
            <li key={project.slug}>
              <a
                href={"#" + encodeURIComponent(project.slug)}
                className={styles.wordmark}
                aria-haspopup="dialog"
                aria-label={project.name}
                onFocus={() => reveal.current?.(index)}
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
                  <span className={styles.logo}>
                    <Image src={project.logo.src} alt="" fill sizes="180px" />
                  </span>
                ) : <span>{project.name}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {slides.length > 1 ? (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.pause}
            aria-pressed={paused}
            onClick={() => setPaused((current) => !current)}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              {paused ? <path d="m5 3 7 5-7 5Z" /> : <path d="M5 3v10M11 3v10" />}
            </svg>
            {paused ? labels.resume : labels.pause}
          </button>
        </div>
      ) : null}
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
