"use client";

import type Lenis from "lenis";

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
