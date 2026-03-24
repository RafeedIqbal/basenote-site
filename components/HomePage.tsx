"use client";

import { useEffect, useRef, useState } from "react";
import type { HomePageContent } from "@/data/home-content";
import { gsap, useGSAP } from "@/lib/gsap";

import BasenoteSymbol from "./home/BasenoteSymbol";
import styles from "./home/HomePage.module.css";

import HeroSection from "./home/HeroSection";
import OpportunitySection from "./home/OpportunitySection";
import ServicesSection from "./home/ServicesSection";
import TechProductsSection from "./home/TechProductsSection";
import AudiencesSection from "./home/AudiencesSection";
import WhyBasenoteSection from "./home/WhyBasenoteSection";
import ProcessSection from "./home/ProcessSection";
import PortfolioSection from "./home/PortfolioSection";
import FaqSection from "./home/FaqSection";
import CtaBanner from "./home/CtaBanner";
import Footer from "./home/Footer";

type HomePageProps = {
  content: HomePageContent;
};

export default function HomePage({ content }: HomePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const previousMenuOpen = useRef(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) {
      return;
    }

    if (menuOpen) {
      mainElement.setAttribute("inert", "");
      mainElement.setAttribute("aria-hidden", "true");
    } else {
      mainElement.removeAttribute("inert");
      mainElement.removeAttribute("aria-hidden");
    }

    return () => {
      mainElement.removeAttribute("inert");
      mainElement.removeAttribute("aria-hidden");
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      const timer = window.setTimeout(() => {
        firstMenuLinkRef.current?.focus();
      }, 120);

      previousMenuOpen.current = true;

      return () => {
        window.clearTimeout(timer);
      };
    }

    if (previousMenuOpen.current) {
      menuButtonRef.current?.focus();
      previousMenuOpen.current = false;
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const getFocusableElements = () => {
      const menuOverlay = menuOverlayRef.current;
      if (!menuOverlay) {
        return [];
      }

      return Array.from(
        menuOverlay.querySelectorAll<HTMLElement>(
          [
            "a[href]",
            "button:not([disabled]):not([tabindex='-1'])",
            "input:not([disabled]):not([tabindex='-1'])",
            "select:not([disabled]):not([tabindex='-1'])",
            "textarea:not([disabled]):not([tabindex='-1'])",
            "[tabindex]:not([tabindex='-1'])"
          ].join(", ")
        )
      ).filter((element) => {
        const styles = window.getComputedStyle(element);
        return styles.visibility !== "hidden" && styles.display !== "none";
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;
      const activeInsideMenu = activeElement
        ? focusableElements.includes(activeElement)
        : false;

      if (event.shiftKey) {
        if (!activeInsideMenu || activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }

      if (!activeInsideMenu || activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const logoSymbol = q("[data-logo-symbol]");

      gsap.set(logoSymbol, {
        autoAlpha: 0,
        scale: 1,
        transformOrigin: "center center",
        force3D: true
      });

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const heroSection = q("[data-hero]");
      const opportunitySection = q("[data-opportunity]");
      const heroVideo = q("[data-hero-video]");
      const heroWrapper = q(`.${styles.heroOpportunityWrapper}`);

      if (logoSymbol.length > 0) {
        if (reduceMotion || heroSection.length === 0 || opportunitySection.length === 0) {
          gsap.set(logoSymbol, { autoAlpha: 1 });
        } else {
          gsap.to(logoSymbol, {
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: heroSection[0],
              endTrigger: opportunitySection[0],
              start: "top top",
              end: "top top",
              scrub: 0.85
            }
          });
        }
      }

      if (!reduceMotion && heroVideo.length > 0 && heroWrapper.length > 0) {
        gsap.to(heroVideo, {
          scale: 1.08,
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroWrapper[0],
            start: "top top",
            end: "bottom top",
            scrub: 0.85
          }
        });
      }
    },
    { scope: rootRef }
  );

  const navLinks = content.nav.filter((item) => !item.isCta);
  const navCta = content.nav.find((item) => item.isCta);

  return (
    <div ref={rootRef} className={styles.page}>
      <BasenoteSymbol
        className={styles.backgroundSymbol}
        data-logo-symbol=""
        data-menu-open={menuOpen}
      />
      <a href="#home" className={styles.visuallyHiddenHomeLink}>
        Basenote Solutions home
      </a>
      <header className={styles.siteHeader} data-menu-open={menuOpen}>
        <div className={styles.brandMark} aria-hidden="true">
          <BasenoteSymbol className={styles.headerSymbol} />
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span className={styles.menuButtonLabel}>
            {menuOpen ? "Close" : "Menu"}
          </span>
        </button>
      </header>

      <div
        ref={menuOverlayRef}
        id="site-menu"
        className={styles.menuOverlay}
        data-open={menuOpen}
        role="dialog"
        aria-label="Site navigation"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={styles.menuBackdrop}
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation overlay"
          tabIndex={-1}
        />
        <div className={styles.menuPanel}>
          <div className={styles.menuColumn}>
            <span className={styles.eyebrow}>Navigation</span>
            <nav className={styles.menuNav} aria-label="Primary">
              {navLinks.map((item, index) => (
                <a
                  key={item.href + item.label}
                  ref={index === 0 ? firstMenuLinkRef : undefined}
                  href={item.href}
                  className={styles.menuLink}
                  onClick={() => setMenuOpen(false)}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <span className={styles.menuText}>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className={styles.menuMeta}>
            <div>
              <span className={styles.eyebrow}>Basenote Solutions</span>
              <p className={styles.menuSummary}>{content.hero.summary}</p>
            </div>

            {navCta ? (
              <a
                href={navCta.href}
                className={styles.menuCtaButton}
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
              >
                {navCta.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <main ref={mainRef}>
        <div className={styles.heroOpportunityWrapper}>
          <div className={styles.videoBackground} aria-hidden="true">
            <video
              className={styles.heroVideo}
              data-hero-video=""
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            >
              <source src="/media/hero-background2.mp4" type="video/mp4" />
            </video>
            <div className={styles.heroGradient} />
          </div>
          <div className={styles.heroOpportunityContent}>
            <HeroSection content={content} />
            <OpportunitySection content={content} />
          </div>
        </div>
        <ServicesSection content={content} />
        <TechProductsSection content={content} />
        <AudiencesSection content={content} />
        <WhyBasenoteSection content={content} />
        <ProcessSection content={content} />
        <PortfolioSection content={content} />
        <FaqSection content={content} />
        <CtaBanner content={content} />
        <Footer content={content} />
      </main>
    </div>
  );
}
