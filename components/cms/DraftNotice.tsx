"use client";

import { usePathname } from "next/navigation";
import styles from "./PageFields.module.css";

export default function DraftNotice() {
  const path = usePathname();
  return <aside className={styles.draftNotice} aria-label="CMS preview">
    <strong>Draft preview</strong><a href={"/cms/preview?exit=1&path=" + encodeURIComponent(path)}>Return to published site</a>
  </aside>;
}
