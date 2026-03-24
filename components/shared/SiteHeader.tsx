"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { homePageContent } from "@/data/home-content";
import BasenoteSymbol from "@/components/home/BasenoteSymbol";
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
        if (!menuOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                setMenuOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [menuOpen]);

    return (
        <>
            <header className={styles.siteHeader}>
                <Link href="/" className={styles.brandMark} aria-label="Basenote Solutions home">
                    <BasenoteSymbol className={styles.headerSymbol} />
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
                                <a
                                    key={item.href + item.label}
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
                            <p className={styles.menuSummary}>{homePageContent.hero.summary}</p>
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
        </>
    );
}
