"use client";

import { useRef, useState, type FormEvent } from "react";
import { submitContactForm } from "@/app/actions/contact";
import SiteHeader from "@/components/shared/SiteHeader";
import PageFooter from "@/components/shared/PageFooter";

import FormGuardFields from "./FormGuardFields";

import styles from "./ContactPage.module.css";

const interestOptions = [
    "Private Label",
    "Branding",
    "Fragrance Oils",
    "Consultancy",
    "Tech & AI Products",
    "Not Sure Yet"
];

export default function ContactPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setError(null);
        setStatusMessage("Submitting your enquiry...");
        setIsSubmitting(true);

        try {
            const result = await submitContactForm(new FormData(event.currentTarget));

            if (result.success) {
                formRef.current?.reset();
                setSubmitted(true);
                setStatusMessage("Your enquiry has been sent.");
                return;
            }

            setError(result.error);
            setStatusMessage(null);
        } catch (submitError) {
            console.error("Contact form submission failed:", submitError);
            setError("Something went wrong. Please try again.");
            setStatusMessage(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SiteHeader />
            <main id="main-content" className={styles.main}>
                <section className={styles.heroSection}>
                    <div className={styles.container}>
                        <span className={styles.eyebrow}>Contact</span>
                        <h1 className={styles.heading}>Tell Us What You&apos;re Building</h1>
                        <p className={styles.subheading}>
                            Share your product, brand, or technology brief and we&apos;ll reply
                            with the clearest next step for your launch.
                        </p>
                        <div className={styles.heroNotes}>
                            <p>Best for: private label launches, branding scopes, fragrance supply, and technology partnerships.</p>
                        </div>
                    </div>
                </section>

                <section className={styles.formSection}>
                    <div className={styles.container}>
                        {submitted ? (
                            <div className={styles.successMessage}>
                                <h2 className={styles.successHeading}>Thank you</h2>
                                <p className={styles.successText}>
                                    Your enquiry has been received. We&apos;ll review the
                                    brief and come back with the most useful next step.
                                </p>
                            </div>
                        ) : (
                            <form
                                ref={formRef}
                                className={styles.form}
                                onSubmit={handleSubmit}
                            >
                                <FormGuardFields />

                                <p className={styles.formIntro}>
                                    Give us a little context up front and we&apos;ll make our
                                    first reply more useful.
                                </p>

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="fullName" className={styles.label}>
                                        Full Name
                                    </label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required
                                        maxLength={120}
                                        autoComplete="name"
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="email" className={styles.label}>
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        maxLength={320}
                                        autoComplete="email"
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="company" className={styles.label}>
                                        Company / Brand Name{" "}
                                        <span className={styles.optional}>(optional)</span>
                                    </label>
                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        maxLength={160}
                                        autoComplete="organization"
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="interest" className={styles.label}>
                                        What are you interested in?
                                    </label>
                                    <p id="interest-helper" className={styles.helperText}>
                                        Choose the closest fit. If your brief spans multiple
                                        areas, select the one you want to start with.
                                    </p>
                                    <select
                                        id="interest"
                                        name="interest"
                                        required
                                        className={styles.select}
                                        defaultValue=""
                                        aria-describedby="interest-helper"
                                    >
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                        {interestOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label htmlFor="message" className={styles.label}>
                                        Tell us more
                                    </label>
                                    <p id="message-helper" className={styles.helperText}>
                                        Useful details include product stage, target market,
                                        timing, or the type of support you need.
                                    </p>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        required
                                        maxLength={5000}
                                        className={styles.textarea}
                                        aria-describedby="message-helper"
                                    />
                                </div>

                                <p className={styles.privacyNote}>
                                    This form is for business enquiries. Submission details are
                                    used only to review and respond to your request.
                                </p>

                                {statusMessage ? (
                                    <p
                                        className={styles.statusMessage}
                                        role="status"
                                        aria-live="polite"
                                    >
                                        {statusMessage}
                                    </p>
                                ) : null}

                                {error ? (
                                    <p className={styles.errorMessage} role="alert">
                                        {error}
                                    </p>
                                ) : null}

                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Sending..." : "Send Enquiry"}
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </main>
            <PageFooter />
        </>
    );
}
