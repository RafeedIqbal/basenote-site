"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import ArrowIcon from "@/components/site/ArrowIcon";
import {
  privateLabel,
  privateLabelGuide as content,
  type GuideImage,
} from "@/data/site-content";
import GuideChoiceCards from "./GuideChoiceCards";
import styles from "./PrivateLabelGuide.module.css";

const number = (value: number) => String(value + 1).padStart(2, "0");

// Ordinary buttons remain in the tab order. Arrow keys follow keyboard focus.
function switchWithKeys(
  event: KeyboardEvent<HTMLDivElement>,
  index: number,
  count: number,
  select: (index: number) => void,
) {
  const buttons = Array.from(event.currentTarget.querySelectorAll("button"));
  const focused = buttons.indexOf(document.activeElement as HTMLButtonElement);
  const current = focused >= 0 ? focused : index;
  let next = current;
  if (event.key === "ArrowRight" || event.key === "ArrowDown")
    next = (current + 1) % count;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
    next = (current - 1 + count) % count;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = count - 1;
  else return;
  event.preventDefault();
  select(next);
  buttons[next]?.focus();
}

function UnavailableImage({ title }: { title: string }) {
  return (
    <aside className={styles.mediaNote}>
      <span className={styles.eyebrow}>{title}</span>
      <p>{content.labels.imageUnavailable}</p>
      <Link href={privateLabel.contactHref}>
        {content.back} <ArrowIcon />
      </Link>
    </aside>
  );
}

function Gallery({ images, title }: { images: GuideImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  if (!images.length) return <UnavailableImage title={title} />;
  const move = (direction: number) =>
    setActive(
      (current) => (current + direction + images.length) % images.length,
    );
  return (
    <div
      className={styles.gallery}
      role="region"
      aria-roledescription="carousel"
      aria-label={title}
    >
      <div
        className={styles.galleryImage}
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0) return;
          pointer.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = pointer.current;
          if (!start || start.id !== event.pointerId) return;
          pointer.current = null;
          const dx = event.clientX - start.x;
          if (
            Math.abs(dx) > 40 &&
            Math.abs(dx) > Math.abs(event.clientY - start.y)
          )
            move(dx < 0 ? 1 : -1);
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={(event) => {
          if (pointer.current?.id === event.pointerId) pointer.current = null;
        }}
        onLostPointerCapture={(event) => {
          if (pointer.current?.id === event.pointerId) pointer.current = null;
        }}
      >
        <Image
          key={images[active].src}
          src={images[active].src}
          alt={images[active].alt}
          fill
          sizes="(max-width: 859px) 100vw, 35vw"
          draggable={false}
        />
      </div>
      {images.length > 1 ? (
        <div className={styles.galleryControls}>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={content.labels.previousImage}
          >
            ←
          </button>
          <span aria-live="polite">
            {number(active)} / {number(images.length - 1)}
          </span>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={content.labels.nextImage}
          >
            →
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Customisation() {
  const packaging = content.packaging;
  return (
    <div className={styles.customisation}>
      <h4>{packaging.optionsTitle}</h4>
      <div>
        <div>
          <h5>{packaging.sizeTitle}</h5>
          <ul>
            {packaging.sizes.map((size) => (
              <li key={size}>{size}</li>
            ))}
          </ul>
        </div>
        <div>
          <h5>{packaging.finishTitle}</h5>
          <ul>
            {packaging.finishes.map((finish) => (
              <li key={finish}>{finish}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Packaging() {
  const [active, setActive] = useState(0);
  const packaging = content.packaging;
  return (
    <>
      <section className={styles.productSplit} aria-labelledby="paper-title">
        <div>
          <span className={styles.eyebrow}>Tier 1</span>
          <h3 id="paper-title">{packaging.paperTitle}</h3>
          <Customisation />
        </div>
        <Gallery title={packaging.paperTitle} images={packaging.paperImages} />
      </section>
      <section className={styles.productSplit} aria-labelledby="rigid-title">
        <div>
          <span className={styles.eyebrow}>Tier 2</span>
          <h3 id="rigid-title">{packaging.rigidTitle}</h3>
          <div
            className={styles.switcher}
            role="group"
            aria-label="Rigid box type"
            onKeyDown={(event) =>
              switchWithKeys(event, active, packaging.types.length, setActive)
            }
          >
            {packaging.types.map((type, index) => (
              <button
                key={type.title}
                type="button"
                aria-pressed={active === index}
                onClick={() => setActive(index)}
              >
                {type.title}
              </button>
            ))}
          </div>
          <Customisation />
        </div>
        <Gallery
          key={active}
          title={packaging.types[active].title}
          images={packaging.types[active].images}
        />
      </section>
    </>
  );
}

export function BottleAndCap() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(0);
  const components = content.components;
  return (
    <>
      {[components.cap, components.bottle].map((part, index) => (
        <section
          className={styles.componentSection}
          key={part.title}
          aria-labelledby={`component-${index}-title`}
        >
          <span className={styles.eyebrow}>
            {content.labels.step} {index + 1}
          </span>
          <h3 id={`component-${index}-title`}>{part.title}</h3>
          <p>{part.description}</p>
          <GuideChoiceCards cards={part.cards} />
        </section>
      ))}
      <aside className={styles.sourcing}>
        <ArrowIcon />
        <div>
          <h3>{components.sourcingTitle}</h3>
          <p>{components.sourcingDescription}</p>
        </div>
      </aside>
      <section
        className={styles.componentSection}
        aria-labelledby="finish-title"
      >
        <span className={styles.eyebrow}>{content.labels.step} 3</span>
        <h3 id="finish-title">{components.finishTitle}</h3>
        <p>{components.finishDescription}</p>
        <div className={styles.finishLayout}>
          <div
            className={styles.finishOptions}
            onKeyDown={(event) => {
              const buttons = Array.from(event.currentTarget.querySelectorAll("button"));
              const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
              const next = {
                ArrowDown: (index + 1) % buttons.length,
                ArrowUp: (index - 1 + buttons.length) % buttons.length,
                Home: 0,
                End: buttons.length - 1,
              }[event.key];
              if (next === undefined) return;
              event.preventDefault();
              buttons[next]?.focus();
            }}
          >
            {components.finishes.map((finish, index) => (
              <div className={styles.finishItem} key={finish.title}>
                <h4>
                  <button
                    id={"finish-option-" + index}
                    type="button"
                    aria-expanded={expanded === index}
                    aria-controls={"finish-description-" + index}
                    onClick={() => {
                      setActive(index);
                      setExpanded(expanded === index ? null : index);
                    }}
                  >
                    <span>{number(index)}</span>
                    {finish.title}
                    <span className={styles.finishToggle} aria-hidden="true">
                      {expanded === index ? "−" : "+"}
                    </span>
                  </button>
                </h4>
                <div
                  id={"finish-description-" + index}
                  className={styles.finishDescription}
                  role="region"
                  aria-labelledby={"finish-option-" + index}
                  hidden={expanded !== index}
                >
                  <p>{finish.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Gallery
            key={active}
            title={components.finishes[active].title}
            images={components.finishes[active].images}
          />
        </div>
      </section>
    </>
  );
}
