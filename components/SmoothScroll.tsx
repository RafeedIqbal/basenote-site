"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { registerSmoothScroll } from "@/lib/scroll";

import { ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop = () => {};
    const configure = () => {
      stop();
      if (preference.matches) {
        stop = () => {};
        ScrollTrigger.refresh();
        return;
      }
      const lenis = new Lenis({
        autoRaf: false,
        smoothWheel: true,
        syncTouch: false,
        lerp: 0.085,
        // Native/Next links and explicit anchor handlers own URL and focus
        // changes; Lenis's click handler ignores their offsets and modifiers.
        anchors: false,
      });

      registerSmoothScroll(lenis);
      const unsubscribeScroll = lenis.on("scroll", ScrollTrigger.update);
      let frameId = 0;

      const update = (time: number) => {
        lenis.raf(time);
        frameId = window.requestAnimationFrame(update);
      };

      frameId = window.requestAnimationFrame(update);

      stop = () => {
        window.cancelAnimationFrame(frameId);
        unsubscribeScroll();
        registerSmoothScroll(null);
        lenis.destroy();
      };
      ScrollTrigger.refresh();
    };
    configure();
    preference.addEventListener("change", configure);
    return () => {
      preference.removeEventListener("change", configure);
      stop();
    };
  }, []);

  return null;
}
