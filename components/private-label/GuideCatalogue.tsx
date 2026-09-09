"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  privateLabel,
  privateLabelGuide as content,
  type GuideCatalogueItem,
} from "@/data/site-content";
import styles from "./GuideCatalogue.module.css";

const DECK_SIZE = 9;
const number = (value: number) => String(value).padStart(2, "0");

type DepartingDeck = {
  id: number;
  start: number;
  front: number;
  preview: number | null;
  left: number;
  top: number;
  cards: { transform: string; opacity: string }[];
};

function CardFace({ item, index }: { item: GuideCatalogueItem; index: number }) {
  return (
    <>
      <span className={styles.image}>
        <Image src={item.src} alt="" fill sizes="210px" draggable={false} />
      </span>
      <span className={styles.caption} aria-hidden="true">
        <span>{item.number}</span>
        <span className={styles.cardNumber}>{number(index + 1)}</span>
      </span>
    </>
  );
}

export default function GuideCatalogue({
  items,
  title,
}: {
  items: GuideCatalogueItem[];
  title: string;
}) {
  const id = useId();
  const stage = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLUListElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<number, HTMLButtonElement>());
  const focusAfterSelect = useRef(false);
  const departureId = useRef(0);
  const [departures, setDepartures] = useState<DepartingDeck[]>([]);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const start = Math.floor(active / DECK_SIZE) * DECK_SIZE;
  const visible = items.slice(start, start + DECK_SIZE);
  const preview = hovered ?? focused;
  const front = preview ?? active;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      if (motion.matches) setDepartures([]);
    };
    motion.addEventListener("change", updateMotion);
    return () => motion.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const node = viewport.current;
    if (!node) return;

    // Reveal the whole card without moving the surrounding guide vertically.
    const reveal = () => {
      const card = cards.current.get(active);
      if (!card) return;
      const slot = card.parentElement;
      if (!slot) return;
      const inset = 18;
      const left = slot.offsetLeft;
      const right = left + slot.offsetWidth;
      if (left < node.scrollLeft + inset) {
        node.scrollTo({ left: left - inset, behavior: "instant" });
      } else if (right > node.scrollLeft + node.clientWidth - inset) {
        node.scrollTo({ left: right - node.clientWidth + inset, behavior: "instant" });
      }
    };

    if (focusAfterSelect.current) {
      cards.current.get(active)?.focus({ preventScroll: true });
      focusAfterSelect.current = false;
    }
    // Layout offsets ignore the spread and preview transforms.
    reveal();
    const observer = new ResizeObserver(reveal);
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  const select = (index: number, focus = false) => {
    const next = Math.max(0, Math.min(index, items.length - 1));
    if (
      Math.floor(next / DECK_SIZE) * DECK_SIZE !== start &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      stage.current &&
      deck.current
    ) {
      const bounds = stage.current.getBoundingClientRect();
      const previous = deck.current.getBoundingClientRect();
      const departure: DepartingDeck = {
        id: departureId.current++,
        start,
        front,
        preview,
        left: previous.left - bounds.left,
        top: previous.top - bounds.top,
        // Preserve a partially entered deck when navigation happens quickly.
        cards: Array.from(deck.current.children, (card) => {
          const style = getComputedStyle(card);
          return { transform: style.transform, opacity: style.opacity };
        }),
      };
      setDepartures((current) => [...current, departure]);
    }
    focusAfterSelect.current = focus;
    setHovered(null);
    setFocused(null);
    setActive(next);
  };

  const navigate = (event: KeyboardEvent<HTMLUListElement>) => {
    let next = active;
    if (event.key === "ArrowRight") next += 1;
    else if (event.key === "ArrowLeft") next -= 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else if (event.key === "PageDown") next += DECK_SIZE;
    else if (event.key === "PageUp") next -= DECK_SIZE;
    else return;
    event.preventDefault();
    select(next, true);
  };

  if (!items.length) {
    return (
      <p className={styles.empty}>
        <Link href={privateLabel.contactHref}>{content.labels.catalogueUnavailable}</Link>
      </p>
    );
  }

  return (
    <div
      className={styles.catalogue}
      role="region"
      aria-roledescription="carousel"
      aria-label={title}
    >
      <div className={styles.toolbar}>
        <div className={styles.jump}>
          <label htmlFor={`${id}-reference`}>{content.labels.jumpToReference}</label>
          <select
            id={`${id}-reference`}
            aria-label={`${title}: ${content.labels.jumpToReference}`}
            aria-controls={`${id}-deck`}
            value={active}
            onChange={(event) => select(Number(event.target.value))}
          >
            {items.map((item, index) => (
              <option key={item.number} value={index}>{item.number}</option>
            ))}
          </select>
        </div>
      </div>

      <p id={`${id}-instructions`} className={styles.srOnly}>
        {content.labels.catalogueKeyboardHint}
      </p>
      <div className={styles.stage} ref={stage}>
        <div className={styles.viewport} ref={viewport}>
          <ul
            ref={deck}
            id={`${id}-deck`}
            className={styles.deck}
            aria-label={`${title} reference cards`}
            aria-describedby={`${id}-instructions`}
            data-preview={preview !== null}
            style={{ "--count": visible.length } as CSSProperties}
            onKeyDown={navigate}
            onPointerLeave={() => setHovered(null)}
          >
            {visible.map((item, offset) => {
              const index = start + offset;
              return (
                <li
                  className={styles.slot}
                  key={item.src}
                  data-front={front === index}
                  style={{
                    "--index": offset,
                    zIndex: front === index ? DECK_SIZE + 1 : DECK_SIZE - offset,
                  } as CSSProperties}
                >
                  <button
                    ref={(node) => {
                      if (node) cards.current.set(index, node);
                      else cards.current.delete(index);
                    }}
                    type="button"
                    className={styles.card}
                    aria-label={`${item.alt}, ${index + 1} of ${items.length}`}
                    aria-pressed={active === index}
                    tabIndex={active === index ? 0 : -1}
                    data-preview={preview === index}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") setHovered(index);
                    }}
                    onFocus={() => setFocused(index)}
                    onBlur={() => setFocused(null)}
                    onClick={() => setActive(index)}
                  >
                    <CardFace item={item} index={index} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        {departures.map((departure) => (
          <div className={styles.exitLayer} key={departure.id} aria-hidden="true" inert>
            <ul
              className={`${styles.deck} ${styles.exitDeck}`}
              data-preview={departure.preview !== null}
              style={{
                "--count": departure.cards.length,
                left: departure.left,
                top: departure.top,
              } as CSSProperties}
              onAnimationEnd={(event) => {
                // The leftmost card leaves last in the reversed stagger.
                if (event.target === event.currentTarget.firstElementChild) {
                  setDepartures((current) =>
                    current.filter((item) => item.id !== departure.id),
                  );
                }
              }}
            >
              {items.slice(departure.start, departure.start + DECK_SIZE).map((item, offset) => {
                const index = departure.start + offset;
                return (
                  <li
                    className={styles.slot}
                    key={item.src}
                    data-front={departure.front === index}
                    style={{
                      "--index": offset,
                      "--exit-from-transform": departure.cards[offset].transform,
                      "--exit-from-opacity": departure.cards[offset].opacity,
                      zIndex: departure.front === index ? DECK_SIZE + 1 : DECK_SIZE - offset,
                    } as CSSProperties}
                  >
                    <div className={styles.card} data-preview={departure.preview === index}>
                      <CardFace item={item} index={index} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          disabled={start === 0}
          onClick={() => select(start - DECK_SIZE)}
          aria-label={`Previous ${title.toLowerCase()}`}
          aria-controls={`${id}-deck`}
        >
          <span aria-hidden="true">←</span>
        </button>
        <div className={styles.status} role="status" aria-atomic="true">
          <span className={styles.reference}>{items[active].number}</span>
          <span className={styles.range} aria-hidden="true">
            {number(start + 1)}–{number(start + visible.length)} / {number(items.length)}
          </span>
          <span className={styles.srOnly}>{active + 1} of {items.length}</span>
        </div>
        <button
          type="button"
          disabled={start + DECK_SIZE >= items.length}
          onClick={() => select(start + DECK_SIZE)}
          aria-label={`Next ${title.toLowerCase()}`}
          aria-controls={`${id}-deck`}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
