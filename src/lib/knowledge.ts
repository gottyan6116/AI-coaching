import "server-only";
import { cache } from "react";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { articleOutline } from "./knowledge-mdx";
import { knowledgeCategories, type ArticleHeading, type ArticleMeta } from "./knowledge-types";

const directory = path.join(process.cwd(), "src/content/knowledge");
const compiledCache = new Map<string, { source: string; exports: Awaited<ReturnType<typeof run>>; headings: ArticleHeading[]; readingMinutes: number }>();
const loadArticles = cache(async () => {
  const files = (await readdir(directory)).filter(file => file.endsWith(".mdx"));
  for (const key of compiledCache.keys()) if (!files.includes(key)) compiledCache.delete(key);
  return Promise.all(files.map(async file => {
    // Only repository-owned MDX is executable. Never compile request or remote content here.
    const source = await readFile(path.join(directory, file), "utf8");
    let cached = compiledCache.get(file);
    if (cached?.source !== source) {
      const outline = { headings: [] as ArticleHeading[], readingMinutes: 1 };
      const compiled = await compile(source, { outputFormat: "function-body", remarkPlugins: [remarkGfm, articleOutline(outline)] });
      cached = { source, exports: await run(String(compiled), { ...runtime, baseUrl: import.meta.url }), ...outline };
      compiledCache.set(file, cached);
    }
    const evaluated = cached.exports;
    const metadata = evaluated.metadata as ArticleMeta | undefined;
    if (!metadata || metadata.slug !== path.basename(file, ".mdx") || !/^[a-z0-9-]+$/.test(metadata.slug)
      || !metadata.title || !metadata.description || !Array.isArray(metadata.tags)
      || !knowledgeCategories.filter(item => item.id !== "all").some(item => item.id === metadata.category)
      || !["published", "sample", "draft"].includes(metadata.status)
      || (metadata.thumbnail && !metadata.thumbnail.startsWith("/images/"))
      || (metadata.author && (typeof metadata.author.name !== "string" || !metadata.author.name.trim() || (metadata.author.url && !/^https:\/\/[^\s]+$/.test(metadata.author.url))))
      || (metadata.canonical && !/^https:\/\/[^\s]+$/.test(metadata.canonical))
      || (metadata.summary && (!Array.isArray(metadata.summary) || !metadata.summary.every(item => typeof item === "string" && item.trim())))
      || !/^\d{4}-\d{2}-\d{2}$/.test(metadata.updatedAt)
      || (metadata.status === "published" && (!metadata.publishedAt || !/^\d{4}-\d{2}-\d{2}$/.test(metadata.publishedAt)))) {
      throw new Error(`Invalid article metadata: ${file}`);
    }
    return { metadata, Content: evaluated.default, headings: cached.headings, readingMinutes: cached.readingMinutes };
  }));
});
export function includesSamples(preview: string | string[] | undefined) { return process.env.NODE_ENV === "development" || preview === "sample"; }
export async function getArticles(samples = false) {
  return (await loadArticles()).filter(article => article.metadata.status === "published" || (samples && article.metadata.status === "sample"))
    .sort((a,b) => (b.metadata.publishedAt ?? b.metadata.updatedAt).localeCompare(a.metadata.publishedAt ?? a.metadata.updatedAt));
}
export async function getArticle(slug: string, samples = false) { return (await getArticles(samples)).find(article => article.metadata.slug === slug); }
