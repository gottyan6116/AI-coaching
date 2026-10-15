import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { getArticle, getArticles, includesSamples } from "@/lib/knowledge";
import { articleCanonical, categoryLabel, formatArticleDate, relatedArticles, siteUrl } from "@/lib/knowledge-types";
import { ArticleCard } from "@/components/knowledge/knowledge-index";
import { ArticleTOC } from "@/components/knowledge/article-toc";
import { ArticleMotion } from "@/components/knowledge/article-motion";
import { ArticleCTA } from "@/components/knowledge/article-cta";
import { articleMdxComponents } from "@/components/knowledge/article-mdx-components";
import styles from "@/components/knowledge/article-template.module.css";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string | string[] }> };
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug, includesSamples((await searchParams).preview));
  if (!article) return { title: "記事が見つかりません｜AI COACHING", robots: { index: false } };
  const m = article.metadata, sample = m.status === "sample";
  return {
    title: `${m.title}｜AI COACHING`, description: m.description,
    alternates: { canonical: sample ? `${siteUrl}/knowledge` : articleCanonical(m) },
    authors: m.author ? [{ name: m.author.name, url: m.author.url }] : undefined,
    robots: sample ? { index: false, follow: false } : undefined,
    openGraph: { title: m.title, description: m.description, url: articleCanonical(m), type: "article", locale: "ja_JP",
      images: m.thumbnail ? [{ url: `${siteUrl}${m.thumbnail}`, alt: m.thumbnailAlt ?? m.title }] : [],
      publishedTime: m.publishedAt ?? undefined, modifiedTime: m.updatedAt, tags: m.tags,
      authors: m.author ? [m.author.url ?? m.author.name] : undefined },
  };
}
export default async function ArticlePage({ params, searchParams }: Props) {
  const samples = includesSamples((await searchParams).preview);
  const article = await getArticle((await params).slug, samples);
  if (!article) notFound();
  const { metadata: m, Content, headings, readingMinutes } = article;
  const available = await getArticles(m.status === "sample" && samples);
  const related = relatedArticles(m, available.map(item => item.metadata));
  const listHref = m.status === "sample" ? "/knowledge?preview=sample" : "/knowledge";
  const categoryHref = `${listHref}${listHref.includes("?") ? "&" : "?"}category=${m.category}`;
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "お役立ち記事", item: `${siteUrl}/knowledge` },
    { "@type": "ListItem", position: 3, name: categoryLabel(m.category), item: `${siteUrl}/knowledge?category=${m.category}` },
    { "@type": "ListItem", position: 4, name: m.title, item: `${siteUrl}/knowledge/${m.slug}` },
  ] };
  const structured = { "@context": "https://schema.org", "@type": "Article", headline: m.title, description: m.description,
    image: m.thumbnail ? [`${siteUrl}${m.thumbnail}`] : undefined, datePublished: m.publishedAt, dateModified: m.updatedAt,
    mainEntityOfPage: articleCanonical(m), articleSection: categoryLabel(m.category), keywords: m.tags,
    author: m.author ? { "@type": "Person", name: m.author.name, url: m.author.url } : undefined,
    publisher: { "@type": "Organization", name: "AI COACHING", url: siteUrl } };
  return <main id="knowledge-main"><ArticleMotion key={m.slug}>
    <nav className={styles.breadcrumbs} aria-label="パンくずリスト"><ol><li><Link href="/">ホーム</Link></li><li><Link href={listHref}>お役立ち記事</Link></li><li><Link href={categoryHref}>{categoryLabel(m.category)}</Link></li><li aria-current="page">{m.title}</li></ol></nav>
    <article>
      {m.status === "sample" && <aside className={styles.preview}>表示確認用サンプルです。公開記事ではありません。</aside>}
      <header className={styles.header}>
        <Link href={categoryHref} className={styles.category} data-article-intro>{categoryLabel(m.category)}</Link>
        <h1 data-article-intro>{m.title}</h1><p className={styles.description} data-article-intro>{m.description}</p>
        <div className={styles.meta} data-article-intro>{m.publishedAt ? <><span>公開日 <time dateTime={m.publishedAt}>{formatArticleDate(m.publishedAt)}</time></span>{m.updatedAt !== m.publishedAt && <span>更新日 <time dateTime={m.updatedAt}>{formatArticleDate(m.updatedAt)}</time></span>}</> : <span>サンプル原稿・公開日未設定</span>}<span><Clock3 size={15} aria-hidden="true" />約{readingMinutes}分で読めます</span>{m.author && <span>著者：{m.author.url ? <a href={m.author.url} rel="noopener noreferrer">{m.author.name}</a> : m.author.name}</span>}</div>
      </header>
      <div className={styles.cover} data-article-intro>{m.thumbnail ? <Image src={m.thumbnail} alt={m.thumbnailAlt ?? m.title} fill sizes="(max-width: 767px) 90vw, (max-width: 1199px) 92vw, 1144px" loading="eager" /> : <div className={styles.coverFallback}><span>AI COACHING JOURNAL</span><p>Knowledge<span>.</span></p></div>}</div>
      <div className={styles.bodyLayout}>
        <ArticleTOC headings={headings} />
        <div className={styles.bodyColumn}>
          <div className={styles.prose} data-article-prose><Content components={articleMdxComponents} /></div>
          <section className={styles.summary} aria-labelledby="article-summary" data-article-reveal><p className={styles.summaryLabel}>TAKEAWAYS</p><h2 id="article-summary">この記事のまとめ</h2><ul>{(m.summary?.length ? m.summary : [m.description]).map(item => <li key={item}>{item}</li>)}</ul></section>
          <ul className={styles.tags} aria-label="記事のタグ">{m.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        </div>
      </div>
    </article>
    <ArticleCTA />
    {related.length > 0 && <section className={styles.related} aria-labelledby="related-title"><div className={styles.relatedHeading}><p>KEEP EXPLORING</p><h2 id="related-title">関連記事</h2></div><div className={styles.relatedGrid}>{related.map(item => <ArticleCard key={item.slug} article={item} />)}</div></section>}
    <div className={styles.back}><Link href={listHref}>← Knowledgeの記事一覧へ戻る</Link></div>
  </ArticleMotion>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
    {m.status === "published" && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />}
  </main>;
}
