"use client";

import Link from "next/link";
import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToPosition } from "@/lib/scroll";
import {
  privateLabel,
  privateLabelGuide as content,
  type PrivateLabelGuideChapter,
  type GuideStep,
} from "@/data/site-content";
import { SiteFrame } from "@/components/site/shared";
import { Packaging, BottleAndCap } from "./GuideProductSections";
import GuideProjectForm from "./GuideProjectForm";
import CommercialStats from "./CommercialStats";
import { FloatingChat } from "./PrivateLabelChrome";
import common from "./PrivateLabel.module.css";
import styles from "./PrivateLabelGuide.module.css";

const number = (index: number) => String(index + 1).padStart(2, "0");

function navigateChapter(event: MouseEvent<HTMLAnchorElement>) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  const hash = event.currentTarget.hash;
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  event.preventDefault();
  event.stopPropagation();
  if (window.location.hash !== hash) window.history.pushState(null, "", hash);
  const padding = parseFloat(
    getComputedStyle(document.documentElement).scrollPaddingTop,
  ) || 0;
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  scrollToPosition(
    target.getBoundingClientRect().top + window.scrollY - padding - margin,
  );
  target.focus({ preventScroll: true });
}

function Chapter({
  chapter,
  children,
}: {
  chapter: PrivateLabelGuideChapter;
  children?: ReactNode;
}) {
  const next = content.chapters[Number(chapter.number)];
  return (
    <section
      id={chapter.id}
      tabIndex={-1}
      className={styles.chapter}
      aria-labelledby={`${chapter.id}-title`}
    >
      <header className={styles.chapterHeader}>
        <span className={styles.chapterNumber} aria-hidden="true">
          {chapter.number}
        </span>
        <div>
          <span className={styles.eyebrow}>
            {content.chapterLabel} {chapter.number} / {chapter.title}
          </span>
          <h2 id={`${chapter.id}-title`}>{chapter.headline}</h2>
          {chapter.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </header>
      {children}
      {next ? (
        <a
          className={styles.nextChapter}
          href={`#${next.id}`}
          onClick={navigateChapter}
        >
          <span>
            {content.labels.next}
            <strong>
              {next.number} / {next.title}
            </strong>
          </span>
          <span aria-hidden="true">↗</span>
        </a>
      ) : null}
    </section>
  );
}

function Elements() {
  return (
    <div className={styles.elements}>
      {content.elements.map((element, index) => (
        <details className={styles.element} key={element.title}>
          <summary>
            <span className={styles.eyebrow}>{number(index)}</span>
            <h3>{element.title}</h3>
            <p>{element.subtitle}</p>
            <span className={styles.expand} aria-hidden="true">
              +
            </span>
          </summary>
          <div className={styles.elementBody}>
            {element.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function Timeline({
  steps,
  production = false,
}: {
  steps: GuideStep[];
  production?: boolean;
}) {
  return (
    <ol
      className={`${styles.timeline} ${production ? styles.productionTimeline : ""}`}
    >
      {steps.map((step, index) => (
        <li key={step.title}>
          <span className={styles.stepNumber}>{number(index)}</span>
          <div>
            <h3>{step.title}</h3>
            {step.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {step.points ? (
              <ul className={styles.stepPoints}>
                {step.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
            {step.note ? <p className={styles.stepNote}>{step.note}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Fragrance() {
  return (
    <>
      <div className={styles.fragranceRoutes}>
        {content.fragrance.routes.map((route, index) => (
          <article key={route.title}>
            <span className={styles.eyebrow}>
              {number(index)} / {route.title}
            </span>
            <h3>{route.subtitle}</h3>
            {route.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}
      </div>
      <h3 className={styles.timelineTitle}>
        {content.fragrance.timelineTitle}
      </h3>
      <Timeline steps={content.fragrance.steps} />
    </>
  );
}

function Production() {
  return (
    <>
      <Timeline steps={content.production.steps} production />
      <CommercialStats variant="guide" />
      <p className={styles.qualification}>{content.production.qualification}</p>
    </>
  );
}

function MakeItReal() {
  const [formStarted, setFormStarted] = useState(false);
  return (
    <div className={styles.finalSection}>
      <details
        className={styles.formDisclosure}
        onToggle={(event) => {
          // Start the guard when the enquiry opens, and keep any draft on close.
          if (event.currentTarget.open) setFormStarted(true);
        }}
      >
        <summary>
          {content.final.primary}
          <span aria-hidden="true">↗</span>
        </summary>
        <div className={styles.formPanel}>
          <h3>{content.final.formTitle}</h3>
          {formStarted ? <GuideProjectForm /> : null}
        </div>
      </details>
      <Link className={styles.consultation} href={privateLabel.contactHref}>
        {content.final.secondary}
        <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}

export default function PrivateLabelGuidePage() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLProgressElement>(null);
  const [active, setActive] = useState(0);
  useGSAP(
    () => {
      const update = (self: ScrollTrigger) => {
        if (progress.current) progress.current.value = self.progress * 100;
        setActive(
          content.chapters.reduce((current, chapter, index) => {
            const element = document.getElementById(chapter.id);
            return element &&
              element.getBoundingClientRect().top <= window.innerHeight * 0.4
              ? index
              : current;
          }, 0),
        );
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
    <SiteFrame className={`${common.page} ${styles.page}`}>
      <header id="guide-intro" className={styles.cover} tabIndex={-1}>
        <div className={styles.coverTop}>
          <Link href="/private-label" className={styles.back}>
            ← {content.back}
          </Link>
          <span className={styles.eyebrow}>{content.metadata.title}</span>
        </div>
        <div className={styles.coverLayout}>
          <div className={styles.coverCopy}>
            <h1>{content.title}</h1>
            <p>{content.introduction}</p>
            <a
              href="#start-here"
              onClick={navigateChapter}
              className={styles.roundLink}
              aria-label="Start the guide"
            >
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <nav
            className={styles.coverContents}
            aria-label={content.contentsLabel}
          >
            <span className={styles.eyebrow}>01 — 06</span>
            <ol>
              {content.chapters.map((chapter) => (
                <li key={chapter.id}>
                  <a href={`#${chapter.id}`} onClick={navigateChapter}>
                    <span>{chapter.number}</span>
                    {chapter.title}
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <div className={styles.coverBottom}>
          <span>Basenote Solutions</span>
          <span>From the first idea to the finished product</span>
        </div>
      </header>
      <div ref={root} className={styles.guide}>
        <aside className={styles.rail}>
          <nav aria-label="Chapter navigation" data-lenis-prevent>
            <span className={styles.eyebrow}>{content.contentsLabel}</span>
            <ol>
              {content.chapters.map((chapter, index) => (
                <li key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    onClick={navigateChapter}
                    aria-current={active === index ? "location" : undefined}
                  >
                    <span>{chapter.number}</span>
                    <span>{chapter.title}</span>
                  </a>
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
          {content.chapters.map((chapter, index) => (
            <Chapter chapter={chapter} key={chapter.id}>
              {
                [
                  <Elements key="elements" />,
                  <Packaging key="packaging" />,
                  <BottleAndCap key="components" />,
                  <Fragrance key="fragrance" />,
                  <Production key="production" />,
                  <MakeItReal key="final" />,
                ][index]
              }
            </Chapter>
          ))}
        </div>
      </div>
      <FloatingChat heroId="guide-intro" />
    </SiteFrame>
  );
}
