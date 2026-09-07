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
  if (activeLenis) activeLenis.scrollTo(top, { immediate: true });
  else window.scrollTo({ top, behavior: "instant" });
}
