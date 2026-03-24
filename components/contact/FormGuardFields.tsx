"use client";

import { FORM_HONEYPOT_FIELD } from "@/lib/form-guard-constants";

import styles from "./ContactPage.module.css";

export default function FormGuardFields() {
  return (
    <div aria-hidden="true" className={styles.guardField}>
      <label htmlFor={FORM_HONEYPOT_FIELD}>Company website</label>
      <input
        id={FORM_HONEYPOT_FIELD}
        name={FORM_HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
