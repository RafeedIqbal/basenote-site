"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { navigation } from "@/data/site-content";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

import styles from "./SiteChrome.module.css";

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const privateLabel = pathname === "/private-label" || pathname === "/private-label/guide";
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    if (!privateLabel) return;
    const trigger = ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => setHidden(!open && !headerRef.current?.contains(document.activeElement) && self.scroll() > 72 && self.direction > 0)
    });
    return () => trigger.kill();
  }, { dependencies: [privateLabel, open], revertOnUpdate: true });

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) {
        return;
      }

      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>("a[href], button")
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      {privateLabel ? <div className={styles.headerSpace} aria-hidden="true" /> : null}
      <header ref={headerRef} onFocusCapture={() => setHidden(false)} className={`${styles.header} ${privateLabel ? styles.privateHeader : ""} ${privateLabel && hidden && !open ? styles.headerHidden : ""}`}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label="Basenote home">
            <Image
              src="/media/basenote-handoff/logo-white.png"
              alt=""
              width={30}
              height={30}
              priority={!privateLabel}
            />
            <span>Basenote</span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {navigation.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/contact" className={styles.headerCta}>
              Get in touch
            </Link>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        ref={menuRef}
        id="mobile-navigation"
        className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`}
        aria-hidden={!open}
      >
        <div className={styles.mobileTopline}>
          {privateLabel ? <Image src="/media/basenote-handoff/logo-white.png" alt="Basenote" width={30} height={30} /> : <span className={styles.mobileBrand}>Basenote</span>}
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close menu"
            onClick={() => {
              setOpen(false);
              menuButtonRef.current?.focus();
            }}
          >
            ×
          </button>
        </div>
        <span className={styles.menuLabel}>Navigation</span>
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {navigation.map((item, index) => (
            <Link
              key={item.href}
              ref={index === 0 ? firstLinkRef : undefined}
              href={item.href}
              className={styles.mobileLink}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className={styles.mobileCta}
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        >
          Get in touch
        </Link>
      </div>
    </>
  );
}
