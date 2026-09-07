"use client";

import Link from "next/link";
import { useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { privateLabel } from "@/data/site-content";
import styles from "./PrivateLabel.module.css";

export default function AudiencePanels() {
  const [open, setOpen] = useState<number | null>(null);
  const content = privateLabel.audience;
  return (
    <section
      id="who-its-for"
      className={styles.section}
      aria-labelledby="audience-title"
    >
      <div className={styles.sectionHeading} data-reveal="">
        <span className={styles.sectionNumber}>02 /</span>
        <h2 id="audience-title">{content.title}</h2>
      </div>
      <div
        className={styles.audienceGrid}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open !== null) {
            event.preventDefault();
            document.getElementById(`segment-${open}`)?.focus();
            setOpen(null);
          }
        }}
      >
        {content.segments.map((segment, index) => (
          <article
            key={segment.number}
            className={styles.audiencePanel}
            data-open={open === index}
          >
            <h3>
              <button
                type="button"
                id={`segment-${index}`}
                aria-expanded={open === index}
                aria-controls={`segment-detail-${index}`}
                onClick={() => setOpen(open === index ? null : index)}
              >
                <span className={styles.panelNumber}>
                  {segment.number}
                  <span aria-hidden="true">{open === index ? "−" : "+"}</span>
                </span>
                <span className={styles.panelTitle}>{segment.title}</span>
                <span className={styles.panelDescription}>
                  {segment.description}
                </span>
              </button>
            </h3>
            <div
              id={`segment-detail-${index}`}
              className={styles.panelDetail}
              data-open={open === index}
              role="region"
              aria-labelledby={`segment-${index}`}
              aria-hidden={open !== index}
              inert={open !== index}
              onTransitionEnd={(event) => {
                if (event.propertyName === "grid-template-rows")
                  ScrollTrigger.refresh();
              }}
            >
              <div>
                <p>{segment.expanded}</p>
                {segment.bestFor ? (
                  <>
                    <span className={styles.bestFor}>
                      {content.bestForLabel}
                    </span>
                    <p className={styles.bestForCopy}>{segment.bestFor}</p>
                  </>
                ) : (
                  <Link href={privateLabel.contactHref}>
                    {content.contact} <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.actions}>
        <Link className={styles.primaryButton} href={privateLabel.contactHref}>
          {content.contact}
          <span aria-hidden="true">↗</span>
        </Link>
        <Link className={styles.textLink} href={privateLabel.guideHref}>
          {content.learn}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
