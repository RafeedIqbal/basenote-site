"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { privateLabel } from "@/data/site-content";
import common from "./PrivateLabel.module.css";
import styles from "./ClientJourney.module.css";

const content = privateLabel.journey;
export default function ClientJourney() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 860px) and (prefers-reduced-motion: no-preference)",
        () => {
          const distance = () =>
            Math.max(
              0,
              (track.current?.scrollWidth ?? 0) -
                (viewport.current?.clientWidth ?? 0),
            );
          gsap.to(track.current, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 0.5,
              pin: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
        },
      );
      const resize = new ResizeObserver(() => ScrollTrigger.refresh());
      if (viewport.current) resize.observe(viewport.current);
      return () => {
        resize.disconnect();
        media.revert();
      };
    },
    { scope: root },
  );
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    if (cta.current) observer.observe(cta.current);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <section
        id="client-journey"
        className={styles.section}
        ref={root}
        aria-labelledby="journey-title"
      >
        <div className={styles.heading}>
          <span className={common.eyebrow}>{privateLabel.eyebrow}</span>
          <h2 id="journey-title">{content.title}</h2>
        </div>
        <div ref={viewport} className={styles.viewport}>
          <div ref={track} className={styles.track}>
            {content.stages.map((stage) => (
              <article key={stage.number} className={styles.card}>
                <div className={styles.milestone}>
                  <span>{stage.number}</span>
                  <i aria-hidden="true" />
                </div>
                <div className={styles.cardCopy}>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <div ref={cta} className={styles.cta} data-in-view={inView}>
        <div className={styles.particles} aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <i
              key={index}
              style={
                {
                  "--i": index,
                  "--x": `${(index * 37) % 100}%`,
                  "--y": `${(index * 19) % 100}%`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <Link href={privateLabel.contactHref}>
          {content.cta}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </>
  );
}
