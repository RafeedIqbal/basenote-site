"use client";

import { useEffect, useRef } from "react";

import { FORM_HONEYPOT_FIELD, FORM_SUBMITTED_AT_FIELD } from "@/lib/form-guard-constants";

import styles from "./ContactPage.module.css";

export default function FormGuardFields() {
  const submittedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (submittedAtRef.current) {
      submittedAtRef.current.value = String(Date.now());
    }
  }, []);

  return (
    <>
      <input
        ref={submittedAtRef}
        type="hidden"
        name={FORM_SUBMITTED_AT_FIELD}
        defaultValue=""
      />
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
    </>
  );
}
