"use client";

import SiteHeader from "@/components/shared/SiteHeader";
import PageFooter from "@/components/shared/PageFooter";
import styles from "./AboutPage.module.css";

const teamMembers = [
    {
        name: "Taseen Ahmed Choudhury",
        role: "Founder & CEO",
        description:
            "Entrepreneur across perfumery and tech. Founder of TAC Perfumes, Base Note Solutions, and Arizmi Labs."
    },
    {
        name: "Amrit",
        role: "In-House Chemist",
        description:
            "UK-based fragrance chemist. Leads formulation data logging for the Alchemy Engine."
    },
    {
        name: "Mish",
        role: "Branding Lead",
        description:
            "Manages brand creation and visual identity for Base Note clients."
    },
    {
        name: "Rafeed",
        role: "Project Manager",
        description:
            "Day-to-day operations and bridge between clients and the development team."
    }
];

export default function AboutPage() {
    return (
        <>
            <SiteHeader />
            <main className={styles.main}>
                <section className={styles.heroSection}>
                    <div className={styles.container}>
                        <span className={styles.eyebrow}>About</span>
                        <h1 className={styles.heading}>
                            Tech People. Fragrance Industry.
                        </h1>
                    </div>
                </section>

                <section className={styles.storySection}>
                    <div className={styles.container}>
                        <div className={styles.storyContent}>
                            <p className={styles.storyParagraph}>
                                Base Note Solutions was built at the intersection of two worlds
                                most companies don&apos;t connect — fragrance manufacturing and
                                technology.
                            </p>
                            <p className={styles.storyParagraph}>
                                Founded by Taseen Ahmed Choudhury, Base Note draws on direct
                                access to TAC Perfumes — a UAE-based fragrance factory — and a
                                dedicated tech development team at Arizmi Labs. The result is a
                                company that can take a client from raw idea to finished product
                                to functioning brand, with AI tools being developed in parallel
                                that will change how the industry works.
                            </p>
                            <p className={styles.storyParagraph}>
                                We&apos;re a small team. We operate lean. And we&apos;re building
                                something that hasn&apos;t been built before.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.teamSection}>
                    <div className={styles.container}>
                        <span className={styles.eyebrow}>The Team</span>
                        <div className={styles.teamGrid}>
                            {teamMembers.map((member) => (
                                <article key={member.name} className={styles.teamCard}>
                                    <div className={styles.teamCardContent}>
                                        <h3 className={styles.teamName}>{member.name}</h3>
                                        <span className={styles.teamRole}>{member.role}</span>
                                        <p className={styles.teamDescription}>
                                            {member.description}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <PageFooter />
        </>
    );
}
