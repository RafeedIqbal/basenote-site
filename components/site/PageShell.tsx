"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { getHashTarget, scrollToAnchor } from "@/lib/scroll";

export default function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let alive = true;
    let frame = 0;
    const alignHash = () => {
      if (!alive || !getHashTarget(window.location.hash)) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        frame = requestAnimationFrame(() => {
          if (!alive) return;
          const target = getHashTarget(window.location.hash);
          if (!target) return;
          scrollToAnchor(target);
        });
      });
    };
    // Pin spacers must exist before resolving a hash loaded from another page.
    void document.fonts.ready.then(alignHash);
    window.addEventListener("load", alignHash, { once: true });
    window.addEventListener("hashchange", alignHash);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("load", alignHash);
      window.removeEventListener("hashchange", alignHash);
    };
  }, []);
  useEffect(() => {
    const loops = rootRef.current?.querySelectorAll<HTMLElement>("[data-loop]");
    if (!loops?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.loop = "play";
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 },
    );
    loops.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const fold = window.innerHeight * 0.9;
        gsap.utils
          .toArray<HTMLElement>("[data-reveal]", rootRef.current)
          .forEach((element) => {
            // Server-rendered content already on screen must not vanish when hydration
            // starts its reveal; page heroes get a CSS entrance from first paint instead.
            if (element.getBoundingClientRect().top < fold) return;
            gsap.fromTo(
              element,
              { autoAlpha: 0, y: 26 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 90%",
                  once: true,
                },
              },
            );
          });
      });
      return () => media.revert();
    },
    { scope: rootRef },
  );
  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
