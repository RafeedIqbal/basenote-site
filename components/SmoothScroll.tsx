"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.085,
      anchors: true
    });

    const unsubscribeScroll = lenis.on("scroll", ScrollTrigger.update);
    let frameId = 0;

    const update = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(update);
    };

    frameId = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frameId);
      unsubscribeScroll();
      lenis.destroy();
    };
  }, []);

  return null;
}
