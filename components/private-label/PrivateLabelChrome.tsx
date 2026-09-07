"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { privateLabel } from "@/data/site-content";
import styles from "./PrivateLabel.module.css";

export function FloatingChat({ heroId }: { heroId: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom < 0),
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId]);
  return (
    <Link
      href={privateLabel.contactHref}
      className={styles.chat}
      data-visible={visible}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      {privateLabel.chat}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
