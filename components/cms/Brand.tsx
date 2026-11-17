import Image from "next/image";
import styles from "./PageFields.module.css";

export function Icon() {
  return <Image className={styles.mark} src="/media/basenote-handoff/logo-white.png" width={32} height={32} alt="Basenote" />;
}
export function Logo() {
  return <div className={styles.brand}><Icon /><span>Basenote CMS</span></div>;
}
