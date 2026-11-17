"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import type { NavItem } from "@/data/site-content";
import { setScrollLocked } from "@/lib/scroll";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

import styles from "./SiteChrome.module.css";

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export default function SiteHeader({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();
  const privateLabel = pathname === "/private-label" || pathname === "/private-label/guide";
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  function closeForNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    setOpen(false);
  }

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 860px)");
    const closeOnDesktop = () => {
      const menu = menuRef.current;
      if (!desktop.matches || !menu?.open) return;
      const hadFocus = menu.contains(document.activeElement);
      menu.close();
      // The menu button that would regain focus is hidden at this width.
      if (hadFocus) headerRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useGSAP(() => {
    if (!privateLabel) return;
    const trigger = ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => setHidden(!open && !headerRef.current?.contains(document.activeElement) && self.scroll() > 72 && self.direction > 0)
    });
    return () => trigger.kill();
  }, { dependencies: [privateLabel, open], revertOnUpdate: true });

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (!open) {
      if (menu.open) menu.close();
      return;
    }

    if (!menu.open) menu.showModal();
    firstLinkRef.current?.focus();
    // Lenis listens for wheel input on the window, which still reaches it from the top layer.
    setScrollLocked(true);
    return () => setScrollLocked(false);
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
          </Link>

          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {items.map((item) => {
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

      <dialog
        ref={menuRef}
        id="mobile-navigation"
        data-lenis-prevent=""
        className={styles.mobilePanel}
        aria-label="Navigation"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <div className={styles.mobileTopline}>
          <Link href="/" className={styles.brand} aria-label="Basenote home" onClick={closeForNavigation}>
            <Image src="/media/basenote-handoff/logo-white.png" alt="" width={30} height={30} />
          </Link>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>
        <span className={styles.menuLabel}>Navigation</span>
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {items.map((item, index) => (
            <Link
              key={item.href}
              ref={index === 0 ? firstLinkRef : undefined}
              href={item.href}
              className={styles.mobileLink}
              onClick={closeForNavigation}
              aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className={styles.mobileCta} onClick={closeForNavigation}>
          Get in touch
        </Link>
      </dialog>
    </>
  );
}
