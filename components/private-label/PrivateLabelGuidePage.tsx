"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToPosition } from "@/lib/scroll";
import {
  privateLabel,
  privateLabelFaqs,
  privateLabelGuide as content,
} from "@/data/site-content";
import { SiteFrame, FaqList } from "@/components/site/shared";
import { FloatingChat } from "./PrivateLabelChrome";
import common from "./PrivateLabel.module.css";
import styles from "./PrivateLabelGuide.module.css";

export default function PrivateLabelGuidePage() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLProgressElement>(null);
  const [active, setActive] = useState(0);
  useGSAP(
    () => {
      const update = (self: ScrollTrigger) => {
        if (progress.current) progress.current.value = self.progress * 100;
        const index = content.chapters.reduce((current, chapter, next) => {
          const element = root.current?.querySelector<HTMLElement>(
            `#${chapter.id}`,
          );
          return element &&
            element.getBoundingClientRect().top <= window.innerHeight * 0.35
            ? next
            : current;
        }, 0);
        setActive(index);
      };
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 100px",
        end: "bottom bottom",
        onUpdate: update,
        onRefresh: update,
      });
      const resize = new ResizeObserver(() => ScrollTrigger.refresh());
      if (root.current) resize.observe(root.current);
      return () => resize.disconnect();
    },
    { scope: root },
  );
  return (
    <SiteFrame className={common.page}>
      <header id="guide-intro" className={styles.intro}>
        <Link className={styles.back} href="/private-label">
          <span aria-hidden="true">←</span>
          {content.back}
        </Link>
        <span className={common.eyebrow}>{privateLabel.eyebrow}</span>
        <h1>{content.title}</h1>
        <p>{content.introduction}</p>
      </header>
      <div className={styles.canvas}>
        <div ref={root} className={styles.layout}>
          <aside className={styles.rail}>
            <nav aria-label={content.contentsLabel}>
              <p className={styles.contentsLabel}>{content.contentsLabel}</p>
              <ol>
                {content.chapters.map((chapter, index) => (
                  <li key={chapter.id}>
                    <Link
                      href={`#${chapter.id}`}
                      aria-current={active === index ? "location" : undefined}
                      onClick={(event) => {
                        if (
                          event.button !== 0 || event.metaKey || event.ctrlKey ||
                          event.shiftKey || event.altKey
                        ) return;
                        const target = document.getElementById(chapter.id);
                        if (!target) return;
                        event.preventDefault();
                        // Keep Next and Lenis from applying a second, unoffset scroll.
                        event.stopPropagation();
                        const offset = parseFloat(
                          getComputedStyle(document.documentElement).scrollPaddingTop,
                        ) || 88;
                        if (window.location.hash !== `#${chapter.id}`) {
                          window.history.pushState(null, "", `#${chapter.id}`);
                        }
                        scrollToPosition(
                          target.getBoundingClientRect().top + window.scrollY - offset,
                        );
                      }}
                    >
                      <span>{chapter.number}</span>
                      {chapter.title}
                    </Link>
                  </li>
                ))}
              </ol>
              <progress
                ref={progress}
                max={100}
                aria-label={content.progressLabel}
              />
            </nav>
          </aside>
          <div className={styles.article}>
            {content.chapters.map((chapter) => (
              <section
                id={chapter.id}
                key={chapter.id}
                className={styles.chapter}
                aria-labelledby={`${chapter.id}-title`}
              >
                <div className={styles.chapterBanner}>
                  <span>
                    {content.chapterLabel} {chapter.number}
                  </span>
                  <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
                </div>
                <div className={styles.chapterBody}>
                  {chapter.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {chapter.kind === "audiences" ? (
                    <div className={styles.items}>
                      {privateLabel.audience.segments.map((segment) => (
                        <article key={segment.number}>
                          <span className={common.eyebrow}>
                            {segment.number}
                          </span>
                          <h3>{segment.title}</h3>
                          <p>{segment.expanded}</p>
                          {segment.bestFor ? (
                            <p className={styles.bestFor}>
                              {privateLabel.audience.bestForLabel}
                              <br />
                              {segment.bestFor}
                            </p>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  ) : null}
                  {chapter.kind === "journey" ? (
                    <ol className={styles.journey}>
                      {privateLabel.journey.stages.map((stage, index) => (
                        <li key={stage.number}>
                          <span className={common.eyebrow}>{stage.number}</span>
                          <h3>{stage.title}</h3>
                          <p>{stage.description}</p>
                          <p>{content.stageNotes[index]}</p>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                  {chapter.kind === "commercial" ? (
                    <dl className={styles.stats}>
                      {privateLabel.commercial.stats.map((stat) => (
                        <div key={stat.label}>
                          <dt>{stat.label}</dt>
                          <dd>{stat.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  {chapter.kind === "faqs" ? (
                    <FaqList items={privateLabelFaqs} exclusive />
                  ) : null}
                  {chapter.kind === "next" ? (
                    <div className={common.actions}>
                      <Link
                        href={privateLabel.contactHref}
                        className={common.primaryButton}
                      >
                        {content.contactLink}
                        <span aria-hidden="true">↗</span>
                      </Link>
                      <Link href="/private-label" className={common.textLink}>
                        {content.returnLink}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  ) : chapter.parentAnchor ? (
                    <a
                      href={`/private-label#${chapter.parentAnchor}`}
                      className={styles.sectionLink}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {content.viewSection}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
      <FloatingChat heroId="guide-intro" />
    </SiteFrame>
  );
}
