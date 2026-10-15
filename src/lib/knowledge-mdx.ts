import type { Root, RootContent } from "mdast";
import type { ArticleHeading } from "./knowledge-types";

type MdxNode = { type: string; value?: string; children?: MdxNode[]; name?: string; attributes?: { type: string; name?: string; value?: unknown }[] };
function textOf(node: MdxNode): string {
  if (node.type === "mdxjsEsm" || node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") return "";
  if (node.type === "text" || node.type === "inlineCode" || node.type === "code") return node.value ?? "";
  return node.children?.map(textOf).join("") ?? "";
}

/** Runs on the same syntax tree that MDX renders, so heading IDs and TOC cannot drift. */
export function articleOutline(result: { headings: ArticleHeading[]; readingMinutes: number }) {
  return () => (tree: Root) => {
    const used = new Set<string>();
    let words = "";
    const visit = (node: Root | RootContent) => {
      if (node.type === "heading") {
        if (node.depth === 1) throw new Error("MDX本文のH1は使用できません。記事タイトル以外はH2以下にしてください。");
        if (node.depth === 2 || node.depth === 3) {
          const text = textOf(node as MdxNode);
          const base = text.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-") || "section";
          let id = `section-${base}`, suffix = 2;
          while (used.has(id)) id = `section-${base}-${suffix++}`;
          used.add(id);
          node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
          result.headings.push({ id, text, level: node.depth });
        }
      }
      if ("children" in node) for (const child of node.children) visit(child as RootContent);
    };
    visit(tree);
    // Skip executable metadata; count visible prose and text supplied to practice widgets.
    words = textOf(tree as MdxNode);
    const widgetText = (node: MdxNode) => {
      if (node.type === "mdxJsxFlowElement") for (const attr of node.attributes ?? []) {
        if (attr.type === "mdxJsxAttribute" && typeof attr.value === "string") words += attr.value;
      }
      node.children?.forEach(widgetText);
    };
    widgetText(tree as MdxNode);
    result.readingMinutes = Math.max(1, Math.ceil(words.replace(/\s/g, "").length / 500));
  };
}
