import Image from "next/image";
import Link from "next/link";

import type { JournalArticle } from "@/data/site-content";
import { articleBreadcrumbs, createArticleStructuredData, formatArticleDate, SITE_NAME } from "@/lib/site";
import { SiteFrame } from "./shared";
import styles from "./Editorial.module.css";
import common from "./SitePages.module.css";

export default function JournalArticlePage({ article }: { article: JournalArticle }) {
  const breadcrumbs = articleBreadcrumbs(article);
  return (
    <SiteFrame>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(createArticleStructuredData(article)).replace(/</g, "\\u003c") }}
      />
      <article className={styles.wrap}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <ol>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href}>
                {index === breadcrumbs.length - 1
                  ? <span aria-current="page">{crumb.label}</span>
                  : <Link href={crumb.href}>{crumb.label}</Link>}
              </li>
            ))}
          </ol>
        </nav>
        <header className={styles.feature}>
          <div>
            <h1>{article.title}</h1>
            <p className={styles.byline}>By <Link href="/about" rel="author">{SITE_NAME}</Link> <span aria-hidden="true">·</span> <time dateTime={article.published}>{formatArticleDate(article.published)}</time></p>
          </div>
          <Image src={article.image.src} alt={article.image.alt} width={article.image.width} height={article.image.height}
            data-square={article.image.width === article.image.height || undefined}
            sizes="(max-width: 760px) 90vw, (max-width: 1300px) 38vw, 470px" className={styles.cover} />
        </header>
        <div className={styles.readingLayout}>
          <nav className={styles.contents} aria-label="Article contents">
            <p>In this article</p>
            <ol>
              {article.sections.map((section) => (
                <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>
              ))}
            </ol>
          </nav>
          <div className={styles.prose}>
            <p className={styles.introduction}>{article.introduction}</p>
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} tabIndex={-1}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.checklist && <ul>{section.checklist.map((item) => <li key={item}>{item}</li>)}</ul>}
                {section.figure && (
                  <figure className={styles.figure}>
                    <Image src={section.figure.src} alt={section.figure.alt} width={section.figure.width} height={section.figure.height} sizes="(max-width: 760px) 90vw, 660px" />
                    <figcaption>{section.figure.caption}</figcaption>
                  </figure>
                )}
                {section.links?.map((link) => <p key={link.href}><Link href={link.href} className={styles.textLink}>{link.label}</Link></p>)}
              </section>
            ))}
            <footer className={styles.articleFooter}>
              <Link href={article.enquiry.href} className={common.primaryButton}>{article.enquiry.label}</Link>
              <Link href={article.product.href} className={styles.textLink}>{article.product.label}</Link>
            </footer>
          </div>
        </div>
      </article>
    </SiteFrame>
  );
}
