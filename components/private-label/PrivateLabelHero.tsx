"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { privateLabel } from "@/data/site-content";
import motion from "@/data/private-label-hero-motion.json";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { HeroFrameSequence, type HeroFrame } from "@/lib/hero-frame-sequence";
import { navigateToAnchor, scrollToPosition } from "@/lib/scroll";
import common from "./PrivateLabel.module.css";
import styles from "./PrivateLabelHero.module.css";

const content = privateLabel.hero;
const lastFrame = motion.frames.length - 1;

export default function PrivateLabelHero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const art = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const actions = useRef<HTMLDivElement>(null);
  const leaders = useRef<SVGSVGElement>(null);
  const labels = useRef<HTMLUListElement>(null);

  useGSAP(() => {
    const section = root.current;
    const viewport = stage.current;
    const figure = art.current;
    const surface = canvas.current;
    const heading = copy.current;
    const buttons = actions.current;
    const svg = leaders.current;
    const list = labels.current;
    if (!section || !viewport || !figure || !surface || !heading || !buttons || !svg || !list) return;
    const context = surface.getContext("2d", { alpha: true });
    const groups = Array.from(svg.querySelectorAll("g"));
    const paths = groups.map((group) => group.querySelector("path"));
    const dots = groups.map((group) => group.querySelector("circle"));
    const items = Array.from(list.children) as HTMLLIElement[];
    const media = gsap.matchMedia();
    let activeTrigger: ScrollTrigger | undefined;
    let activeIndex = 0;
    let resume: { progress: number } | null = null;
    let restoreFrame = 0;
    const rememberPosition = () => {
      if (activeTrigger) {
        resume = window.scrollY > activeTrigger.start - window.innerHeight && window.scrollY < activeTrigger.end + window.innerHeight
          ? { progress: activeIndex / lastFrame }
          : null;
        return;
      }
      const bounds = section.getBoundingClientRect();
      resume = bounds.top < window.innerHeight && bounds.bottom > 0
        ? { progress: activeIndex / lastFrame }
        : null;
    };
    window.addEventListener("scroll", rememberPosition, { passive: true });

    media.add({
      all: "all",
      mobile: "(max-width: 859px)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (match) => {
      const saved = resume;
      resume = null;
      const mobile = Boolean(match.conditions?.mobile);
      const reduced = Boolean(match.conditions?.reduced);
      let disposed = false;
      let sequence: HeroFrameSequence | null = null;
      let trigger: ScrollTrigger | undefined;
      let resizeFrame = 0;
      let current = reduced ? lastFrame : 0;
      let painted: HeroFrame | null = null;
      let progress = 0;
      let size = { width: 0, height: 0 };
      let warmed = false;
      let settleDelay: ReturnType<typeof gsap.delayedCall> | undefined;
      let settleTween: ReturnType<typeof gsap.to> | undefined;
      const cancelSettle = () => {
        settleDelay?.kill();
        settleTween?.kill();
        settleDelay = undefined;
        settleTween = undefined;
      };
      const staticView = () => section.dataset.heroStatic === "true";

      const layout = (index: number, image?: HeroFrame | null) => {
        const frame = motion.frames[Math.floor(index)];
        const nextFrame = motion.frames[Math.ceil(index)];
        const blend = index % 1;
        const interpolate = (from: number, to: number) => from + (to - from) * blend;
        const { width, height } = size;
        if (!width || !height) return;
        const imageHeight = mobile
          ? height * 0.8
          : Math.min(height, width * motion.height / motion.width);
        const imageWidth = imageHeight * motion.width / motion.height;
        const left = mobile ? width / 2 - interpolate(frame.center, nextFrame.center) * imageWidth : (width - imageWidth) / 2;
        const top = mobile ? height * 0.13 : (height - imageHeight) / 2;
        if (image && context) {
          context.clearRect(0, 0, width, height);
          const draw = (tile: HeroFrame["from"]) => context.drawImage(tile.image, tile.x, tile.y, tile.width, tile.height, left, top, imageWidth, imageHeight);
          context.globalAlpha = 1 - image.blend;
          draw(image.from);
          if (image.blend > 0) {
            // Add premultiplied contributions so transparent glow keeps its
            // brightness while poses blend through the final momentum pixels.
            context.globalCompositeOperation = "lighter";
            context.globalAlpha = image.blend;
            draw(image.to);
            context.globalCompositeOperation = "source-over";
          }
          context.globalAlpha = 1;
        }
        // Every leader uses camera-projected coordinates from this exact frame.
        content.callouts.forEach((callout, i) => {
          const source = frame.anchors[callout.id].map((value, axis) => interpolate(value, nextFrame.anchors[callout.id][axis]));
          const anchor = [left + source[0] * imageWidth, top + source[1] * imageHeight];
          const position = mobile ? callout.mobileText : callout.text;
          const endpoint = mobile ? callout.mobileEnd : callout.end;
          const end = mobile
            ? [endpoint[0] * width, endpoint[1] * height]
            : [left + endpoint[0] * imageWidth, top + endpoint[1] * imageHeight];
          const x = mobile ? position[0] * width : left + position[0] * imageWidth;
          const y = mobile ? position[1] * height : top + position[1] * imageHeight;
          const amount = reduced || staticView()
            ? 1
            : gsap.utils.clamp(0, 1, (index / lastFrame - callout.reveal) / 0.13);
          const group = groups[i];
          const path = paths[i];
          const dot = dots[i];
          const elbow = mobile && callout.id !== "oil"
            ? [anchor[0], end[1]]
            : [anchor[0] + (end[0] - anchor[0]) * 0.45, end[1]];
          path?.setAttribute("d", `M${anchor[0]},${anchor[1]} L${elbow[0]},${elbow[1]} L${end[0]},${end[1]}`);
          path?.style.setProperty("stroke-dashoffset", String(1 - amount));
          dot?.setAttribute("cx", String(anchor[0]));
          dot?.setAttribute("cy", String(anchor[1]));
          group.style.opacity = String(amount);
          items[i].style.left = `${x}px`;
          items[i].style.top = `${y}px`;
          items[i].style.opacity = String(amount);
        });
      };

      const measure = () => {
        const rect = figure.getBoundingClientRect();
        size = { width: rect.width, height: rect.height };
        const imageWidth = mobile ? size.height * 0.8 * motion.width / motion.height : Math.min(size.width, size.height * motion.width / motion.height);
        // The source has no extra detail above its native pixel width. Keep
        // text/vector leaders sharp separately without oversizing the canvas.
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5, (mobile ? 800 : 1280) / Math.max(1, imageWidth));
        surface.width = Math.round(size.width * ratio);
        surface.height = Math.round(size.height * ratio);
        context?.setTransform(ratio, 0, 0, ratio, 0, 0);
        svg.setAttribute("viewBox", `0 0 ${size.width} ${size.height}`);
        layout(current, painted);
      };

      const restoreCopy = () => {
        heading.style.removeProperty("opacity");
        heading.style.removeProperty("transform");
        buttons.inert = false;
      };

      const showStatic = () => {
        cancelSettle();
        section.dataset.heroStatic = "true";
        delete section.dataset.heroReady;
        trigger?.kill(true);
        trigger = undefined;
        activeTrigger = undefined;
        sequence?.dispose();
        sequence = null;
        painted = null;
        current = lastFrame;
        activeIndex = lastFrame;
        restoreCopy();
        measure();
      };

      section.dataset.heroStatic = String(reduced || !context || !window.createImageBitmap);
      measure();

      if (!staticView()) {
        sequence = new HeroFrameSequence(
          `${content.frames}/${mobile ? "mobile" : "desktop"}`,
          motion.frames.length,
          content.preview,
          (index, image) => {
            if (disposed) return;
            current = index;
            activeIndex = index;
            painted = image;
            surface.dataset.frame = String(index);
            surface.dataset.quality = image.preview ? "preview" : "detail";
            section.dataset.heroReady = "true";
            layout(index, image);
            rememberPosition();
          },
          showStatic,
        );
        const update = (value: number) => {
          cancelSettle();
          progress = value;
          if (!mobile) {
            const opacity = 1 - gsap.utils.clamp(0, 1, value / 0.24);
            heading.style.opacity = String(opacity);
            heading.style.transform = `translateY(${-18 * (1 - opacity)}px)`;
            buttons.inert = opacity < 0.05;
          }
          const frame = Math.min(1, value / 0.9) * lastFrame;
          sequence?.request(frame);
          const nearest = Math.round(frame);
          if (frame !== nearest) {
            // Leave time for the final sparse momentum events, then finish on
            // a real source pose. New scrolling cancels this settle immediately.
            settleDelay = gsap.delayedCall(0.25, () => {
              settleDelay = undefined;
              const cursor = { frame };
              settleTween = gsap.to(cursor, {
                frame: nearest,
                duration: 0.14,
                ease: "power2.out",
                onUpdate: () => sequence?.request(cursor.frame),
                onComplete: () => {
                  sequence?.request(nearest);
                  settleTween = undefined;
                },
              });
            });
          }
        };
        trigger = ScrollTrigger.create({
          id: "private-label-hero",
          trigger: mobile ? figure : section,
          start: mobile ? "top 82%" : "top top",
          end: mobile ? "top 14%" : () => `+=${Math.round(window.innerHeight * 1.75)}`,
          pin: mobile ? false : viewport,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => update(self.progress),
          onRefresh: (self) => {
            measure();
            update(self.progress);
          },
        });
        activeTrigger = trigger;
        // Do not fetch the full sequence for a deep hash entry until the hero is near.
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && !warmed) {
            warmed = true;
            sequence?.warm();
          }
        }, { rootMargin: "300px" });
        observer.observe(section);
        update(trigger.progress);

        const focusCopy = () => {
          if (trigger && !mobile && progress > 0) {
            scrollToPosition(trigger.start);
            update(0);
          }
        };
        heading.addEventListener("focusin", focusCopy);
        match.add(() => () => {
          observer.disconnect();
          heading.removeEventListener("focusin", focusCopy);
        });
      } else {
        current = lastFrame;
        activeIndex = lastFrame;
        layout(current);
      }

      if (saved) {
        restoreFrame = requestAnimationFrame(() => {
          if (disposed) return;
          ScrollTrigger.refresh();
          if (trigger) {
            scrollToPosition(trigger.start + saved.progress * 0.9 * (trigger.end - trigger.start));
          } else {
            const target = saved.progress > 0.2 ? figure : section;
            scrollToPosition(target.getBoundingClientRect().top + window.scrollY - 72);
          }
          ScrollTrigger.update();
          rememberPosition();
        });
      }

      const resize = new ResizeObserver(() => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(measure);
      });
      resize.observe(figure);
      return () => {
        disposed = true;
        cancelSettle();
        cancelAnimationFrame(restoreFrame);
        cancelAnimationFrame(resizeFrame);
        resize.disconnect();
        sequence?.dispose();
        trigger?.kill(true);
        activeTrigger = undefined;
        restoreCopy();
        delete section.dataset.heroReady;
        delete section.dataset.heroStatic;
        items.forEach((item) => item.removeAttribute("style"));
        groups.forEach((group) => group.removeAttribute("style"));
      };
    });
    return () => {
      window.removeEventListener("scroll", rememberPosition);
      cancelAnimationFrame(restoreFrame);
      media.revert();
    };
  }, { scope: root });

  return (
    <section id="hero" ref={root} className={styles.hero} aria-labelledby="private-label-title">
      <link rel="preload" as="image" href={content.preview.image} fetchPriority="high" media="(prefers-reduced-motion: no-preference)" />
      <div ref={stage} className={styles.stage}>
        <div className={styles.background} aria-hidden="true" />
        <div ref={copy} className={styles.copy}>
          <span className={common.eyebrow}>{privateLabel.eyebrow}</span>
          <h1 id="private-label-title">{content.title}</h1>
          <p>{content.description}</p>
          <div ref={actions} className={common.actions}>
            <Link href={privateLabel.contactHref} className={common.primaryButton}>
              {content.primary}<span aria-hidden="true">↗</span>
            </Link>
            <Link href="#client-journey" className={common.textLink} onClick={navigateToAnchor}>
              {content.secondary}<span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
        <figure ref={art} className={styles.art} aria-label={content.imageAlt}>
          <Image className={styles.closedPoster} src={content.image} alt="" fill priority sizes="(max-width: 859px) 100vw, 1440px" />
          <Image className={styles.openPoster} src={content.openImage} alt="" fill loading="eager" sizes="(max-width: 859px) 180vw, 1440px" />
          <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
          <svg ref={leaders} className={styles.leaders} viewBox="0 0 1920 1080" aria-hidden="true">
            {content.callouts.map((callout) => (
              <g key={callout.id}>
                <path pathLength="1" strokeDasharray="1" />
                <circle r="2.2" />
              </g>
            ))}
          </svg>
          <ul ref={labels} className={styles.labels} aria-label="Fragrance components">
            {content.callouts.map((callout) => (
              <li key={callout.id} data-callout={callout.id}>{callout.label}</li>
            ))}
          </ul>
        </figure>
      </div>
    </section>
  );
}
