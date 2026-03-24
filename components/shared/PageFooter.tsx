import { homePageContent } from "@/data/home-content";
import styles from "./PageFooter.module.css";

export default function PageFooter() {
    const { footer } = homePageContent;

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <p className={styles.tagline}>{footer.tagline}</p>

                    <div className={styles.columns}>
                        <div className={styles.column}>
                            <span className={styles.columnHeading}>Services</span>
                            <ul className={styles.linkList}>
                                {footer.services.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className={styles.link}>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.column}>
                            <span className={styles.columnHeading}>Technology</span>
                            <ul className={styles.linkList}>
                                {footer.technology.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className={styles.link}>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.column}>
                            <span className={styles.columnHeading}>Company</span>
                            <ul className={styles.linkList}>
                                {footer.company.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className={styles.link}>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <span>&copy; 2025 Base Note Solutions. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}
