import test from "node:test";
import assert from "node:assert/strict";
import { compile, run } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { articleOutline } from "../src/lib/knowledge-mdx.ts";
import { relatedArticles } from "../src/lib/knowledge-types.ts";

test("MDX heading IDs match the TOC, including duplicate and formatted Japanese headings", async () => {
  const outline = { headings: [], readingMinutes: 1 };
  const compiled = await compile("## **試す** 方法\n\n### 次へ\n\n## 試す 方法\n\n## 試す 方法-2\n\n## 試す 方法\n\n| 項目 | 内容 |\n| --- | --- |\n| A | B |", { outputFormat: "function-body", remarkPlugins: [remarkGfm, articleOutline(outline)] });
  const { default: Content } = await run(String(compiled), runtime);
  const html = renderToStaticMarkup(runtime.jsx(Content, {}));
  const ids = outline.headings.map(item => item.id);
  assert.equal(new Set(ids).size, 5);
  assert.deepEqual(outline.headings.slice(0, 2).map(item => item.level), [2, 3]);
  assert.equal(outline.headings[0].text, "試す 方法");
  for (const id of ids) assert(html.includes(`id="${id}"`));
  assert(html.includes("<table>"));
});

test("reading time excludes executable metadata and scales with visible prose", async () => {
  const short = { headings: [], readingMinutes: 1 }, long = { headings: [], readingMinutes: 1 };
  await compile(`export const metadata = {description: "${"あ".repeat(5000)}"}\n\n## 本文\n\n短い本文。`, { remarkPlugins: [articleOutline(short)] });
  await compile(`## 本文\n\n${"あ".repeat(1200)}`, { remarkPlugins: [articleOutline(long)] });
  assert.equal(short.readingMinutes, 1);
  assert.equal(long.readingMinutes, 3);
});

test("body H1 is rejected so the template remains the only H1", async () => {
  await assert.rejects(compile("# 二つ目のH1", { remarkPlugins: [articleOutline({ headings: [], readingMinutes: 1 })] }), /H1/);
});

test("related articles rank category, shared tags, recency and exclude self/drafts", () => {
  const current = { slug: "current", category: "basics", tags: ["AI", "練習"] };
  const make = (slug, category, tags, publishedAt, status = "published") => ({ slug, category, tags, publishedAt, updatedAt: publishedAt, status });
  const articles = [make("other", "business", ["AI", "練習"], "2026-10-15"), make("old", "basics", ["AI"], "2026-09-01"), make("new", "basics", ["AI"], "2026-10-10"), make("none", "basics", [], "2026-10-15"), make("draft", "basics", ["AI", "練習"], "2026-10-15", "draft"), { ...current, status: "published" }];
  const original = articles.map(item => item.slug);
  assert.deepEqual(relatedArticles(current, articles).map(item => item.slug), ["new", "old", "none"]);
  assert.deepEqual(articles.map(item => item.slug), original);
});
