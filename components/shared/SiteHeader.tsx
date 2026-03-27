"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { homePageContent } from "@/data/home-content";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
    const menuOverlayRef = useRef<HTMLDivElement>(null);
    const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const previousMenuOpen = useRef(false);

    const navLinks = homePageContent.nav.filter((item) => !item.isCta);
    const navCta = homePageContent.nav.find((item) => item.isCta);

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
        const mainElement = document.querySelector("main");
        const footerElement = document.querySelector("footer");

        if (menuOpen) {
            mainElement?.setAttribute("inert", "");
            mainElement?.setAttribute("aria-hidden", "true");
            footerElement?.setAttribute("inert", "");
            footerElement?.setAttribute("aria-hidden", "true");
        } else {
            mainElement?.removeAttribute("inert");
            mainElement?.removeAttribute("aria-hidden");
            footerElement?.removeAttribute("inert");
            footerElement?.removeAttribute("aria-hidden");
        }

        return () => {
            mainElement?.removeAttribute("inert");
            mainElement?.removeAttribute("aria-hidden");
            footerElement?.removeAttribute("inert");
            footerElement?.removeAttribute("aria-hidden");
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
                const computedStyle = window.getComputedStyle(element);
                return (
                    computedStyle.visibility !== "hidden" &&
                    computedStyle.display !== "none"
                );
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
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [menuOpen]);

    return (
        <>
            <header className={styles.siteHeader}>
                <Link href="/" className={styles.brandMark} aria-label="Basenote Solutions home">
                    <Image
                        src="/assets/logo-icon-3d.svg"
                        alt=""
                        width={48}
                        height={48}
                        className={styles.headerSymbol}
                    />
                </Link>

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
                            <Link
                                ref={firstMenuLinkRef}
                                href="/"
                                className={styles.menuLink}
                                onClick={() => setMenuOpen(false)}
                                tabIndex={menuOpen ? 0 : -1}
                            >
                                <span className={styles.menuText}>Home</span>
                            </Link>
                            {navLinks.map((item) => (
                                <Link
                                    key={item.href + item.label}
                                    href={item.href}
                                    className={styles.menuLink}
                                    onClick={() => setMenuOpen(false)}
                                    tabIndex={menuOpen ? 0 : -1}
                                >
                                    <span className={styles.menuText}>{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className={styles.menuMeta}>
                        <div>
                            <span className={styles.eyebrow}>Basenote Solutions</span>
                            <p className={styles.menuSummary}>{homePageContent.hero.summary}</p>
                        </div>

                        {navCta ? (
                            <Link
                                href={navCta.href}
                                className={styles.menuCtaButton}
                                onClick={() => setMenuOpen(false)}
                                tabIndex={menuOpen ? 0 : -1}
                            >
                                {navCta.label}
                            </Link>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}
