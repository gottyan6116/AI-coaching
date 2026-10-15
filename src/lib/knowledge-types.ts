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
  publishedAt: string | null; updatedAt: string; thumbnail: string; tags: string[];
  status: "published" | "sample" | "draft";
};
export const siteUrl = "https://ai-coaching-snowy.vercel.app";
export function categoryLabel(category: ArticleCategory) { return knowledgeCategories.find(item => item.id === category)!.label; }
export function articleHref(article: ArticleMeta) { return `/knowledge/${article.slug}${article.status === "sample" ? "?preview=sample" : ""}`; }
export function formatArticleDate(value: string) { return value.slice(0,10).replaceAll("-", "."); }
