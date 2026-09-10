import Image from "next/image";
import Link from "next/link";

import { footerGroups, socialLinks } from "@/data/site-content";

import styles from "./SiteChrome.module.css";

export default function SiteFooter({ overlay = false }: { overlay?: boolean }) {
  return (
    <footer className={`${styles.footer} ${overlay ? styles.footerOverlay : ""}`}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div className={styles.footerIdentity}>
            <Link href="/" className={styles.brand} aria-label="Basenote home">
              <Image
                src="/media/basenote-handoff/logo-white.png"
                alt=""
                width={30}
                height={30}
              />
              <span>Basenote</span>
            </Link>
            <p>Where Fragrance Meets Business</p>
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
          <span>© {new Date().getFullYear()} Base Note Solutions. All rights reserved.</span>
          <div className={styles.socialLinks} aria-label="Social media">
            {socialLinks.map((social) => (
              <span key={social}>{social}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
