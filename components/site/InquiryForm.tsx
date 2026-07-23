"use client";

import { useRef, useState, type FormEvent } from "react";

import { submitContactForm } from "@/app/actions/contact";
import FormGuardFields from "@/components/contact/FormGuardFields";

import styles from "./InquiryForm.module.css";

const interestOptions = [
  "Private Label",
  "Branding",
  "Fragrance Oils",
  "Consultancy",
  "Tech & AI Products",
  "Blend Engine",
  "Alchemy Engine",
  "Not Sure Yet"
];

type InquiryFormProps = {
  defaultInterest?: string;
  defaultMessage?: string;
  variant?: "compact" | "full";
};

export default function InquiryForm({
  defaultInterest = "",
  defaultMessage = "",
  variant = "full"
}: InquiryFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError(null);
    setStatus("Sending your enquiry…");
    setIsSubmitting(true);

    try {
      const result = await submitContactForm(new FormData(event.currentTarget));

      if (!result.success) {
        setError(result.error);
        setStatus(null);
        return;
      }

      formRef.current?.reset();
      setSubmitted(true);
      setStatus("Your enquiry has been sent.");
    } catch (submitError) {
      console.error("Contact form submission failed:", submitError);
      setError("Something went wrong. Please try again.");
      setStatus(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.success} role="status">
        <h3>Thank you.</h3>
        <p>We have received your enquiry and will reply with the clearest next step.</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className={`${styles.form} ${variant === "compact" ? styles.compact : ""}`}
      onSubmit={handleSubmit}
    >
      <FormGuardFields />
      <div className={styles.field}>
        <label className={styles.label} htmlFor="fullName">Full name</label>
        <input
          className={styles.input}
          id="fullName"
          name="fullName"
          type="text"
          maxLength={120}
          autoComplete="name"
          required
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">Email address</label>
        <input
          className={styles.input}
          id="email"
          name="email"
          type="email"
          maxLength={320}
          autoComplete="email"
          required
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="company">Company / brand</label>
        <input
          className={styles.input}
          id="company"
          name="company"
          type="text"
          maxLength={160}
          autoComplete="organization"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="interest">Area of interest</label>
        <select
          className={styles.select}
          id="interest"
          name="interest"
          defaultValue={defaultInterest}
          required
        >
          <option value="" disabled>Select one</option>
          {interestOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className={styles.fieldWide}>
        <label className={styles.label} htmlFor="message">Tell us what you are building</label>
        <span className={styles.hint}>Include timing, target market, and the support you need.</span>
        <textarea
          className={styles.textarea}
          id="message"
          name="message"
          maxLength={5000}
          defaultValue={defaultMessage}
          required
        />
      </div>
      {status ? <p className={styles.status} aria-live="polite">{status}</p> : null}
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      <button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
