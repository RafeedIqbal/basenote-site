"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { submitContactForm } from "@/app/actions/contact";
import FormGuardFields from "@/components/contact/FormGuardFields";
import TurnstileField, { type TurnstileHandle } from "@/components/contact/TurnstileField";
import { TURNSTILE_RESPONSE_FIELD } from "@/lib/turnstile-constants";

import styles from "./InquiryForm.module.css";

const interestOptions = [
  "Starter Kit",
  "Private Label",
  "Branding",
  "Fragrance Oils",
  "Consultancy",
  "Tech & AI Products",
  "Blend Engine",
  "Alchemy Engine",
  "Factory ERP",
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
  const turnstileRef = useRef<TurnstileHandle>(null);
  const busy = useRef(false);
  const [verified, setVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({ message: "", attempt: 0 });
  const errorRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const reportError = (message: string) =>
    setError((current) => ({ message, attempt: current.attempt + 1 }));

  useEffect(() => {
    if (error.message) errorRef.current?.focus();
  }, [error]);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (busy.current) {
      return;
    }

    const token = turnstileRef.current?.getToken();
    if (!token) return;
    const data = new FormData(event.currentTarget);
    data.set(TURNSTILE_RESPONSE_FIELD, token);
    busy.current = true;

    setError((current) => ({ ...current, message: "" }));
    setIsSubmitting(true);

    try {
      const result = await submitContactForm(data);

      if (!result.success) {
        reportError(result.error);
        return;
      }

      formRef.current?.reset();
      setSubmitted(true);
    } catch (submitError) {
      console.error("Contact form submission failed:", submitError);
      reportError("Something went wrong. Please try again.");
    } finally {
      turnstileRef.current?.reset();
      busy.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div role="status" aria-atomic="true">
        {submitted ? (
          <div ref={successRef} className={styles.success} tabIndex={-1}>
            <h2>Thank you.</h2>
            <p>We have received your enquiry and will reply with the clearest next step.</p>
          </div>
        ) : null}
      </div>
      {!submitted ? (
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
              maxLength={254}
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
            <span id="message-hint" className={styles.hint}>Include timing, target market, and the support you need.</span>
            <textarea
              className={styles.textarea}
              id="message"
              name="message"
              aria-describedby="message-hint"
              maxLength={5000}
              defaultValue={defaultMessage}
              required
            />
          </div>
          <p className={styles.status} role="status">{isSubmitting ? "Sending your enquiry…" : ""}</p>
          {error.message ? (
            <p ref={errorRef} className={styles.error} role="alert" tabIndex={-1}>
              {error.message}
            </p>
          ) : null}
          <TurnstileField ref={turnstileRef} onVerifiedChange={setVerified} disabled={isSubmitting} />
          <button className={styles.submit} type="submit" disabled={isSubmitting || !verified}>
            {isSubmitting ? "Sending…" : "Send enquiry"}
          </button>
        </form>
      ) : null}
    </>
  );
}
