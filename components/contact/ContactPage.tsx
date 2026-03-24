"use client";

import { useState, type FormEvent } from "react";
import SiteHeader from "@/components/shared/SiteHeader";
import PageFooter from "@/components/shared/PageFooter";
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
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
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
                            within one business day.
                        </p>
                    </div>
                </section>

                <section className={styles.formSection}>
                    <div className={styles.container}>
                        {submitted ? (
                            <div className={styles.successMessage}>
                                <h2 className={styles.successHeading}>Thank you</h2>
                                <p className={styles.successText}>
                                    Your enquiry has been received. We&apos;ll be in touch within
                                    one business day.
                                </p>
                            </div>
                        ) : (
                            <form
                                className={styles.form}
                                onSubmit={handleSubmit}
                            >
                                <div className={styles.fieldGroup}>
                                    <label htmlFor="fullName" className={styles.label}>
                                        Full Name
                                    </label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required
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
                                        className={styles.textarea}
                                    />
                                </div>

                                <button type="submit" className={styles.submitButton}>
                                    Send Enquiry
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
