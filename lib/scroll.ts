"use client";

import type Lenis from "lenis";
import type { MouseEvent } from "react";
import { ScrollTrigger } from "@/lib/gsap";

let activeLenis: Lenis | null = null;
let locked = false;

export function registerSmoothScroll(instance: Lenis | null) {
  activeLenis = instance;
  if (locked) activeLenis?.stop();
}

export function setScrollLocked(value: boolean) {
  locked = value;
  if (value) activeLenis?.stop();
  else activeLenis?.start();
}

export function scrollToPosition(top: number) {
  if (activeLenis) {
    // A responsive reflow or opened disclosure can change the scroll limit
    // before Lenis's debounced ResizeObserver has caught up.
    activeLenis.resize();
    activeLenis.scrollTo(top, { immediate: true });
  } else window.scrollTo({ top, behavior: "instant" });
}

export function getHashTarget(hash: string) {
  if (!hash || hash === "#") return null;
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // An invalid URL escape must not break hydration or other navigation.
  }
  return document.getElementById(id);
}

export function scrollToAnchor(target: HTMLElement) {
  const pin = ScrollTrigger.getAll().find(
    (trigger) => trigger.trigger === target && trigger.vars.pin,
  );
  const padding =
    parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  scrollToPosition(
    pin
      ? pin.start
      : target.getBoundingClientRect().top + window.scrollY - padding - margin,
  );
}

export function navigateToAnchor(event: MouseEvent<HTMLAnchorElement>) {
  const link = event.currentTarget;
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    link.hasAttribute("download") ||
    (link.target && link.target !== "_self") ||
    link.origin !== window.location.origin ||
    link.pathname !== window.location.pathname ||
    link.search !== window.location.search
  )
    return;
  const target = getHashTarget(link.hash);
  if (!target) return;
  event.preventDefault();
  event.stopPropagation();
  if (window.location.hash !== link.hash)
    window.history.pushState(null, "", link.hash);
  scrollToAnchor(target);
  target.focus({ preventScroll: true });
}
