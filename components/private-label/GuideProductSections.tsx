"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import {
  privateLabel,
  privateLabelGuide as content,
  type GuideImage,
  type GuideCatalogueItem,
} from "@/data/site-content";
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
        {content.back} <span aria-hidden="true">↗</span>
      </Link>
    </aside>
  );
}

function Gallery({ images, title }: { images: GuideImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);
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
          pointer.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = pointer.current;
          pointer.current = null;
          if (!start) return;
          const dx = event.clientX - start.x;
          if (
            Math.abs(dx) > 40 &&
            Math.abs(dx) > Math.abs(event.clientY - start.y)
          )
            move(dx < 0 ? 1 : -1);
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          pointer.current = null;
        }}
        onLostPointerCapture={() => {
          pointer.current = null;
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

function Catalogue({
  items,
  title,
}: {
  items: GuideCatalogueItem[];
  title: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const selectId = useId();
  const [active, setActive] = useState(0);
  const select = (index: number) => {
    const node = track.current;
    const item = node?.children[index] as HTMLElement | undefined;
    if (!node || !item) return;
    const first = node.children[0] as HTMLElement;
    node.scrollTo({
      left: item.offsetLeft - first.offsetLeft,
      behavior: "instant",
    });
    setActive(index);
  };
  if (!items.length) return <UnavailableImage title={title} />;
  return (
    <div
      className={styles.catalogue}
      role="region"
      aria-roledescription="carousel"
      aria-label={title}
    >
      <div className={styles.catalogueJump}>
        <label htmlFor={selectId}>{content.labels.jumpToReference}</label>
        <select
          id={selectId}
          aria-label={`${title}: ${content.labels.jumpToReference}`}
          aria-controls={trackId}
          value={active}
          onChange={(event) => select(Number(event.target.value))}
        >
          {items.map((item, index) => (
            <option key={item.number} value={index}>
              {item.number}
            </option>
          ))}
        </select>
      </div>
      <div
        id={trackId}
        className={styles.catalogueTrack}
        ref={track}
        tabIndex={0}
        aria-label={`${title} — use arrow keys to browse`}
        onKeyDown={(event) => {
          let next = active;
          if (event.key === "ArrowRight")
            next = Math.min(active + 1, items.length - 1);
          else if (event.key === "ArrowLeft") next = Math.max(active - 1, 0);
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = items.length - 1;
          else return;
          event.preventDefault();
          select(next);
        }}
        onScroll={() => {
          const node = track.current;
          const first = node?.children[0] as HTMLElement | undefined;
          const second = node?.children[1] as HTMLElement | undefined;
          if (node && first) {
            const step = second
              ? second.offsetLeft - first.offsetLeft
              : first.offsetWidth;
            setActive(
              Math.min(
                items.length - 1,
                Math.max(0, Math.round(node.scrollLeft / step)),
              ),
            );
          }
        }}
      >
        {items.map((item, index) => (
          <figure
            key={item.src}
            className={styles.catalogueItem}
            aria-label={`${item.number}, ${index + 1} of ${items.length}`}
          >
            <div>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 859px) 220px, 230px"
              />
            </div>
            <figcaption>{item.number}</figcaption>
          </figure>
        ))}
      </div>
      <div className={styles.galleryControls}>
        <button
          type="button"
          disabled={active === 0}
          onClick={() => select(active - 1)}
          aria-label={`Previous ${title.toLowerCase()}`}
          aria-controls={trackId}
        >
          ←
        </button>
        <span
          aria-live="polite"
          aria-atomic="true"
          aria-label={`${items[active].number}, ${active + 1} of ${items.length}`}
        >
          {number(active)} / {number(items.length - 1)}
        </span>
        <button
          type="button"
          disabled={active >= items.length - 1}
          onClick={() => select(active + 1)}
          aria-label={`Next ${title.toLowerCase()}`}
          aria-controls={trackId}
        >
          →
        </button>
      </div>
    </div>
  );
}

export function BottleAndCap() {
  const [active, setActive] = useState(0);
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
          <Catalogue
            title={index === 0 ? "Caps" : "Bottles"}
            items={part.items}
          />
          {index === 1 ? (
            <p className={styles.catalogueNote}>{components.catalogueNote}</p>
          ) : null}
        </section>
      ))}
      <aside className={styles.sourcing}>
        <span aria-hidden="true">↗</span>
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
          <div>
            <div
              className={styles.finishOptions}
              role="group"
              aria-label="Bottle finish"
              onKeyDown={(event) =>
                switchWithKeys(
                  event,
                  active,
                  components.finishes.length,
                  setActive,
                )
              }
            >
              {components.finishes.map((finish, index) => (
                <button
                  type="button"
                  key={finish.title}
                  aria-pressed={active === index}
                  onClick={() => setActive(index)}
                >
                  <span>{number(index)}</span>
                  {finish.title}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            <div className={styles.finishDescription} aria-live="polite">
              <h4>{components.finishes[active].title}</h4>
              <p>{components.finishes[active].description}</p>
            </div>
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
