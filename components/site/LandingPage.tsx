import Image from "next/image";
import Link from "next/link";

import {
  caseStudies,
  homeFaqs,
  homePage,
  homePositioning,
  services,
} from "@/data/site-content";
import { SITE_TAGLINE } from "@/lib/site";
import ArrowIcon from "./ArrowIcon";
import { FaqList, SiteFrame } from "./shared";
import styles from "./LandingPage.module.css";

const featuredProjects = homePage.work.projectSlugs
  .map((slug) => caseStudies.find((project) => project.slug === slug && project.images.length > 0))
  .filter((project) => project !== undefined);

function ProjectEnquiry() {
  return (
    <Link href={homePage.enquiry.href} className={styles.enquiry}>
      {homePage.enquiry.label}
      <ArrowIcon />
    </Link>
  );
}

export default function LandingPage() {
  const { hero, work, questions } = homePage;

  return (
    <SiteFrame className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroArt}>
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 700px) 100vw, 66vw"
          />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1 id="home-title">{SITE_TAGLINE}</h1>
            <p>{hero.introduction}</p>
            <div className={styles.actions}>
              <ProjectEnquiry />
              <a href={hero.services.href} className={styles.textLink}>{hero.services.label}</a>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.band} ${styles.services}`} aria-labelledby="services">
        <div className={styles.servicesIntro}>
          <h2 id="services" tabIndex={-1} className={styles.sectionTitle}>{homePositioning.servicesTitle}</h2>
          <p className={styles.servicesLead}>{homePositioning.description}</p>
          <div className={styles.bench}>
            <Image
              src={homePage.services.image.src}
              alt={homePage.services.image.alt}
              fill
              sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1320px) 40vw, 510px"
            />
          </div>
        </div>
        <div className={styles.servicesDetails}>
          <ul className={styles.serviceList}>
            {services.map((service) => (
              <li key={service.href}>
                <Link href={service.href} className={styles.serviceLink}>
                  <h3>{service.title}</h3>
                  <ArrowIcon />
                  <p>{service.description}</p>
                </Link>
              </li>
            ))}
          </ul>
          <nav className={styles.additional} aria-label={homePage.services.additionalLabel}>
            {homePage.services.additional.map((service) => (
              <Link key={service.href} href={service.href} className={styles.textLink}>{service.label}</Link>
            ))}
          </nav>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="home-work">
        <div className={styles.workHeader}>
          <div>
            <h2 id="home-work" className={styles.sectionTitle}>{work.title}</h2>
            <p>{work.credit}</p>
          </div>
          <Link href={work.all.href} className={styles.textLink}>{work.all.label}<ArrowIcon /></Link>
        </div>
        <div className={styles.projects}>
          {featuredProjects.map((project, index) => (
            <article key={project.slug} className={styles.project}>
              <Link
                href={project.caseStudy?.href ?? `${work.all.href}#${project.slug}`}
                aria-labelledby={`home-${project.slug} home-${project.slug}-headline`}
              >
                <div className={styles.projectImage}>
                  <Image
                    src={project.images[0].src}
                    alt={project.images[0].alt}
                    fill
                    sizes={index === 0
                      ? "(max-width: 700px) calc(100vw - 40px), (max-width: 1320px) 42vw, 530px"
                      : "(max-width: 359px) calc(100vw - 40px), (max-width: 700px) 44vw, (max-width: 1320px) 26vw, 320px"}
                  />
                </div>
                <div className={styles.projectCaption}>
                  <h3 id={`home-${project.slug}`}>{project.name}</h3>
                  <ArrowIcon />
                  <p id={`home-${project.slug}-headline`}>{project.headline}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.band} ${styles.questions}`} aria-labelledby="home-questions">
        <div className={styles.questionsIntro}>
          <h2 id="home-questions" className={styles.sectionTitle}>{questions.title}</h2>
          <Link href={questions.guide.href} className={styles.textLink}>{questions.guide.label}<ArrowIcon /></Link>
        </div>
        <div className={styles.answers}><FaqList items={homeFaqs} /></div>
        <aside className={styles.reading} aria-labelledby="home-reading">
          <h3 id="home-reading">{questions.readingTitle}</h3>
          {questions.reading.map((article) => (
            <Link key={article.path} href={article.path}>{article.title}<ArrowIcon /></Link>
          ))}
        </aside>
      </section>

      <section className={`${styles.band} ${styles.closing}`} aria-labelledby="home-closing">
        <div>
          <h2 id="home-closing" className={styles.sectionTitle}>{homePositioning.title}</h2>
          <p>{homePositioning.intro}</p>
        </div>
        <ProjectEnquiry />
      </section>
    </SiteFrame>
  );
}
