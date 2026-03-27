import Link from "next/link";
import type { HomePageContent } from "@/data/home-content";
import { getCurrentYear } from "@/lib/site";
import styles from "./Footer.module.css";

type FooterProps = {
    content: HomePageContent;
};

export default function Footer({ content }: FooterProps) {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <p className={styles.tagline}>{content.footer.tagline}</p>

                    <div className={styles.columns}>
                        <div className={styles.column}>
                            <span className={styles.columnHeading}>Services</span>
                            <ul className={styles.linkList}>
                                {content.footer.services.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className={styles.link}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.column}>
                            <span className={styles.columnHeading}>Technology</span>
                            <ul className={styles.linkList}>
                                {content.footer.technology.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className={styles.link}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.column}>
                            <span className={styles.columnHeading}>Company</span>
                            <ul className={styles.linkList}>
                                {content.footer.company.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className={styles.link}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <span>&copy; {getCurrentYear()} Basenote Solutions. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}
