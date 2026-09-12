"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { privateLabel } from "@/data/site-content";
import common from "./PrivateLabel.module.css";
import styles from "./FeaturedProject.module.css";

const content = privateLabel.featured;
export default function FeaturedProject() {
  const root = useRef<HTMLElement>(null);
  const dim = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top 85%",
              end: "bottom 15%",
              scrub: true,
            },
          })
          .to(dim.current, { opacity: 0.7, duration: 0.25 })
          .to(dim.current, { opacity: 0.7, duration: 0.5 })
          .to(dim.current, { opacity: 0, duration: 0.25 });
      });
      return () => media.revert();
    },
    { scope: root },
  );
  useEffect(() => {
    const element = video.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) element?.pause();
    });
    if (element) observer.observe(element);
    return () => {
      observer.disconnect();
      element?.pause();
    };
  }, []);
  async function play() {
    setError(false);
    try {
      await video.current?.play();
      setStarted(true);
    } catch {
      setError(true);
    }
  }
  return (
    <section
      id="featured-project"
      className={`${common.section} ${styles.section}`}
      ref={root}
      aria-labelledby="featured-title"
    >
      <div ref={dim} className={styles.dim} aria-hidden="true" />
      <div className={styles.content}>
        <div className={common.sectionHeading}>
          <h2 id="featured-title">{content.title}</h2>
        </div>
        <div className={styles.player} data-has-video={Boolean(content.video)}>
          {content.video ? (
            <video
              ref={video}
              src={content.video}
              poster={content.poster}
              muted
              playsInline
              controls={started}
              preload="none"
              aria-label={content.title}
              onError={() => setError(true)}
            />
          ) : null}
          {!started ? (
            <>
              <Image
                src={content.poster}
                alt={content.posterAlt}
                fill
                sizes="(max-width: 859px) 100vw, 1200px"
                className={styles.poster}
              />
              {content.video ? (
                <button
                  type="button"
                  onClick={play}
                  className={styles.play}
                  aria-label={content.play}
                >
                  <svg
                    width="22"
                    height="24"
                    viewBox="0 0 22 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M3 2 20 12 3 22Z" />
                  </svg>
                </button>
              ) : null}
            </>
          ) : null}
        </div>
        {error ? (
          <p className={styles.error} role="status">
            {content.error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
