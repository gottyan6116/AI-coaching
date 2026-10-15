export const knowledgeCategories = [
  { id: "all", label: "すべて" },
  { id: "basics", label: "AIの基礎" },
  { id: "business", label: "ビジネス活用" },
  { id: "development", label: "Web・アプリ開発" },
  { id: "news", label: "AIニュース・トレンド" },
] as const;
export type ArticleCategory = Exclude<(typeof knowledgeCategories)[number]["id"], "all">;
export type ArticleMeta = {
  slug: string; title: string; description: string; category: ArticleCategory;
  publishedAt: string | null; updatedAt: string; thumbnail?: string; thumbnailAlt?: string; tags: string[];
  status: "published" | "sample" | "draft";
  author?: { name: string; url?: string };
  canonical?: string;
  summary?: string[];
};
export type ArticleHeading = { id: string; text: string; level: 2 | 3 };
export const siteUrl = "https://ai-coaching-snowy.vercel.app";
export function categoryLabel(category: ArticleCategory) { return knowledgeCategories.find(item => item.id === category)!.label; }
export function articleHref(article: ArticleMeta) { return `/knowledge/${article.slug}${article.status === "sample" ? "?preview=sample" : ""}`; }
export function formatArticleDate(value: string) { return value.slice(0,10).replaceAll("-", "."); }
export function articleCanonical(article: ArticleMeta) { return article.canonical ?? `${siteUrl}/knowledge/${article.slug}`; }
export function relatedArticles(current: ArticleMeta, articles: ArticleMeta[]) {
  const tags = new Set(current.tags);
  const sharedTags = (article: ArticleMeta) => article.tags.filter(tag => tags.has(tag)).length;
  return articles.filter(article => article.slug !== current.slug && article.status !== "draft")
    .sort((a,b) => Number(b.category === current.category) - Number(a.category === current.category)
      || sharedTags(b) - sharedTags(a)
      || (b.publishedAt ?? b.updatedAt).localeCompare(a.publishedAt ?? a.updatedAt)
      || a.slug.localeCompare(b.slug)).slice(0,3);
}
