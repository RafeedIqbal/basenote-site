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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const result = await submitContactForm(new FormData(event.currentTarget));

            if (result.success) {
                formRef.current?.reset();
                setSubmitted(true);
                return;
            }

            setError(result.error);
        } catch (submitError) {
            console.error("Contact form submission failed:", submitError);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SiteHeader />
            <main className={styles.main}>
                <section className={styles.heroSection}>
                    <div className={styles.container}>
                        <span className={styles.eyebrow}>Contact</span>
                        <h1 className={styles.heading}>Let&apos;s Talk</h1>
                        <p className={styles.subheading}>
                            Tell us what you&apos;re working on and we&apos;ll come back to you
                            soon.
                        </p>
                    </div>
                </section>

                <section className={styles.formSection}>
                    <div className={styles.container}>
                        {submitted ? (
                            <div className={styles.successMessage}>
                                <h2 className={styles.successHeading}>Thank you</h2>
                                <p className={styles.successText}>
                                    Your enquiry has been received.
                                </p>
                            </div>
                        ) : (
                            <form
                                ref={formRef}
                                className={styles.form}
                                onSubmit={handleSubmit}
                            >
                                <FormGuardFields />

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
                                    <select
                                        id="interest"
                                        name="interest"
                                        required
                                        className={styles.select}
                                        defaultValue=""
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
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        required
                                        maxLength={5000}
                                        className={styles.textarea}
                                    />
                                </div>

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
