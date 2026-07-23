import Link from "next/link";

import { footerGroups } from "@/data/site-content";

import styles from "./SiteChrome.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerStatement}>
            <h2 className={styles.footerTitle}>Build what comes next.</h2>
            <p className={styles.footerText}>
              Product, manufacturing, brand, and fragrance technology — connected by one team.
            </p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <span className={styles.footerGroupTitle}>{group.title}</span>
              <div className={styles.footerLinks}>
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} className={styles.footerLink}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.footerBottom}>
          <span className={styles.footerMeta}>
            © {new Date().getFullYear()} Basenote Solutions
          </span>
          <div className={styles.legalLinks}>
            <Link href="/privacy-policy" className={styles.footerMeta}>Privacy</Link>
            <Link href="/terms" className={styles.footerMeta}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
