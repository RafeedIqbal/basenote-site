"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import ArrowIcon from "@/components/site/ArrowIcon";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { navigateToAnchor } from "@/lib/scroll";
import {
  privateLabel,
  privateLabelGuide as content,
  type PrivateLabelGuideChapter,
} from "@/data/site-content";
import { SiteFrame } from "@/components/site/shared";
import { Packaging, BottleAndCap } from "./GuideProductSections";
import GuideProjectForm from "./GuideProjectForm";
import GuideElementCards from "./GuideElementCards";
import GuideProductionTimeline from "./GuideProductionTimeline";
import GuideTimeline from "./GuideTimeline";
import CommercialStats from "./CommercialStats";
import { FloatingChat } from "./PrivateLabelChrome";
import common from "./PrivateLabel.module.css";
import styles from "./PrivateLabelGuide.module.css";

const number = (index: number) => String(index + 1).padStart(2, "0");

function Chapter({
  chapter,
  children,
}: {
  chapter: PrivateLabelGuideChapter;
  children?: ReactNode;
}) {
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
    </section>
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
      <h3 id="fragrance-timeline-title" className={styles.timelineTitle}>
        {content.fragrance.timelineTitle}
      </h3>
      <GuideTimeline
        steps={content.fragrance.steps}
        stepLabel={content.labels.step}
        labelledBy="fragrance-timeline-title"
      />
    </>
  );
}

function Production() {
  return (
    <>
      <GuideProductionTimeline steps={content.production.steps} />
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
          <ArrowIcon />
        </summary>
        <div className={styles.formPanel}>
          <h3>{content.final.formTitle}</h3>
          {formStarted ? <GuideProjectForm /> : null}
        </div>
      </details>
      <Link className={styles.consultation} href={privateLabel.contactHref}>
        {content.final.secondary}
        <ArrowIcon />
      </Link>
    </div>
  );
}

function ChapterRail() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<HTMLProgressElement>(null);
  const [active, setActive] = useState(0);
  useGSAP(
    () => {
      const guide = root.current?.parentElement;
      if (!guide) return;
      let positions: number[] = [];
      let current = -1;
      let refreshFrame = 0;
      const update = (self: ScrollTrigger) => {
        if (progress.current) progress.current.value = self.progress * 100;
        const readingLine = window.scrollY + window.innerHeight * 0.4;
        const next = positions.reduce(
          (index, top, candidate) => top <= readingLine ? candidate : index,
          0,
        );
        if (next !== current) {
          current = next;
          setActive(next);
        }
      };
      const measure = (self: ScrollTrigger) => {
        // Chapter positions change with layout, not with ordinary scrolling.
        positions = content.chapters.map((chapter) => {
          const element = document.getElementById(chapter.id);
          return element
            ? element.getBoundingClientRect().top + window.scrollY
            : Infinity;
        });
        update(self);
      };
      ScrollTrigger.create({
        trigger: guide,
        start: "top 100px",
        end: "bottom bottom",
        onUpdate: update,
        onRefresh: measure,
      });
      const resize = new ResizeObserver(() => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      resize.observe(guide);
      return () => {
        resize.disconnect();
        cancelAnimationFrame(refreshFrame);
      };
    },
    { scope: root },
  );
  return (
    <aside ref={root} className={styles.rail}>
      <nav aria-label="Chapter navigation" data-lenis-prevent>
        <ol>
          {content.chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                onClick={navigateToAnchor}
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
          value={0}
          max={100}
          aria-label={content.progressLabel}
        />
      </nav>
    </aside>
  );
}

export default function PrivateLabelGuidePage() {
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
          </div>
          <nav
            className={styles.coverContents}
            aria-label={content.contentsLabel}
          >
            <span className={styles.eyebrow}>01 — 06</span>
            <ol>
              {content.chapters.map((chapter) => (
                <li key={chapter.id}>
                  <a href={`#${chapter.id}`} onClick={navigateToAnchor}>
                    <span>{chapter.number}</span>
                    {chapter.title}
                    <ArrowIcon />
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
      <div className={styles.guide}>
        <ChapterRail />
        <div className={styles.article}>
          {content.chapters.map((chapter, index) => (
            <Chapter chapter={chapter} key={chapter.id}>
              {
                [
                  <GuideElementCards key="elements" />,
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
