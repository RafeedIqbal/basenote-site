"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import ArrowIcon from "@/components/site/ArrowIcon";
import { submitPrivateLabelProject } from "@/app/actions/private-label-project";
import FormGuardFields from "@/components/contact/FormGuardFields";
import { privateLabelGuide as content } from "@/data/site-content";
import styles from "./PrivateLabelGuide.module.css";

export default function GuideProjectForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState({ message: "", attempt: 0 });
  const [success, setSuccess] = useState(false);
  const busy = useRef(false);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const reportError = (message: string) =>
    setError((current) => ({ message, attempt: current.attempt + 1 }));

  useEffect(() => {
    if (error.message) errorRef.current?.focus();
  }, [error]);

  useEffect(() => {
    if (success) successRef.current?.focus();
  }, [success]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy.current) return;
    const data = new FormData(event.currentTarget);
    const images = data
      .getAll("inspiration")
      .filter(
        (entry): entry is File => entry instanceof File && Boolean(entry.name),
      );
    if (
      images.length > 3 ||
      images.reduce((sum, file) => sum + file.size, 0) > 3 * 1024 * 1024
    ) {
      reportError(content.labels.uploadHint);
      return;
    }
    if (
      images.some(
        (file) =>
          !file.size ||
          !["image/jpeg", "image/png", "image/webp"].includes(file.type),
      )
    ) {
      reportError(content.labels.uploadHint);
      return;
    }
    busy.current = true;
    setPending(true);
    setError((current) => ({ ...current, message: "" }));
    try {
      const result = await submitPrivateLabelProject(data);
      if (result.success) setSuccess(true);
      else reportError(result.error);
    } catch {
      reportError(content.labels.error);
    } finally {
      busy.current = false;
      setPending(false);
    }
  };
  return (
    <>
      <div role="status" aria-atomic="true">
        {success ? (
          <div ref={successRef} className={styles.formSuccess} tabIndex={-1}>
            <span aria-hidden="true">✓</span>
            <p>{content.final.success}</p>
          </div>
        ) : null}
      </div>
      {!success ? (
        <form className={styles.projectForm} onSubmit={submit} aria-busy={pending}>
          <FormGuardFields />
          <p className={styles.formHint}>{content.formFields.requiredHint}</p>
          <fieldset disabled={pending}>
            <legend>{content.final.detailsTitle}</legend>
            <div className={styles.formGrid}>
              <label htmlFor="project-name">
                <span>
                  {content.formFields.name} <span aria-hidden="true">*</span>
                </span>
                <input
                  id="project-name"
                  name="fullName"
                  autoComplete="name"
                  maxLength={120}
                  required
                />
              </label>
              <label htmlFor="project-email">
                <span>
                  {content.formFields.email} <span aria-hidden="true">*</span>
                </span>
                <input
                  id="project-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={320}
                  required
                />
              </label>
              <label htmlFor="project-phone">
                {content.formFields.phone}
                <input
                  id="project-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={80}
                />
              </label>
              <label htmlFor="project-spoken">
                <span>
                  {content.formFields.spoken} <span aria-hidden="true">*</span>
                </span>
                <select id="project-spoken" name="spoken" defaultValue="" required>
                  <option value="" disabled>
                    {content.formFields.choose}
                  </option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>
            </div>
          </fieldset>
          <fieldset disabled={pending}>
            <legend>{content.final.choicesTitle}</legend>
            <div className={styles.formGrid}>
              <label htmlFor="project-packaging">
                {content.formFields.packaging}
                <select id="project-packaging" name="packaging" defaultValue="">
                  <option value="">{content.formFields.undecided}</option>
                  {[
                    content.packaging.paperTitle,
                    ...content.packaging.types.map((type) => type.title),
                  ].map((title) => (
                    <option key={title}>{title}</option>
                  ))}
                </select>
              </label>
              <label htmlFor="project-bottle">
                {content.formFields.bottle}
                <input id="project-bottle" name="bottle" maxLength={120} />
              </label>
              <label htmlFor="project-cap">
                {content.formFields.cap}
                <input id="project-cap" name="cap" maxLength={120} />
              </label>
              <label htmlFor="project-finish">
                {content.formFields.finish}
                <select id="project-finish" name="finish" defaultValue="">
                  <option value="">{content.formFields.undecided}</option>
                  {content.components.finishes.map((finish) => (
                    <option key={finish.title}>{finish.title}</option>
                  ))}
                </select>
              </label>
              <label htmlFor="project-fragrance">
                {content.formFields.fragrance}
                <select
                  id="project-fragrance"
                  name="fragrance"
                  defaultValue={content.formFields.undecided}
                >
                  {[
                    ...content.fragrance.routes.map((route) => route.title),
                    content.formFields.undecided,
                  ].map((title) => (
                    <option key={title}>{title}</option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>
          <fieldset disabled={pending}>
            <legend>{content.final.notesTitle}</legend>
            <label htmlFor="project-notes">
              {content.formFields.notes}
              <textarea id="project-notes" name="notes" rows={5} maxLength={3500} />
            </label>
            <label htmlFor="project-inspiration">
              {content.formFields.images}
              <span id="upload-hint" className={styles.formHint}>
                {content.labels.uploadHint}
              </span>
              <input
                id="project-inspiration"
                name="inspiration"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                aria-describedby="upload-hint"
              />
            </label>
          </fieldset>
          <p className={styles.formHint}>
            {content.labels.privacy}{" "}
            <Link href="/privacy-policy">{content.formFields.privacy}</Link>
          </p>
          {error.message ? (
            <p ref={errorRef} className={styles.formError} role="alert" tabIndex={-1}>
              {error.message}
            </p>
          ) : null}
          <p className={styles.formStatus} role="status">
            {pending ? content.labels.sending : ""}
          </p>
          <button className={styles.primaryButton} type="submit" disabled={pending}>
            {pending ? content.labels.sending : content.final.submit}
            <ArrowIcon />
          </button>
        </form>
      ) : null}
    </>
  );
}
