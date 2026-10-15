import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import { Lightbulb } from "lucide-react";
import { PromptLab, TryItYourself } from "./article-practice";
import { LearningInferenceDiagram } from "./learning-inference-diagram";
import styles from "./article-template.module.css";

export function PointBox({ children }: { children: ReactNode }) {
  return <aside className={styles.point} data-article-reveal><p className={styles.widgetLabel}><Lightbulb size={19} aria-hidden="true" />POINT</p><div>{children}</div></aside>;
}

export function ArticleImage({ src, alt, width = 1200, height = 675, caption }: { src: string; alt: string; width?: number; height?: number; caption?: string }) {
  return <figure className={styles.articleImage}><Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 767px) 88vw, 740px" />{caption && <figcaption>{caption}</figcaption>}</figure>;
}
export const articleMdxComponents = {
  PointBox, PromptLab, TryItYourself, ArticleImage, LearningInferenceDiagram,
  table: ({ children, ...props }: ComponentProps<"table">) => <div className={styles.tableScroll} role="region" aria-label="記事の表（横スクロールできます）" tabIndex={0}><table {...props}>{children}</table></div>,
  a: ({ href, children, ...props }: ComponentProps<"a">) => <a {...props} href={href} rel={href?.startsWith("https://") ? "noopener noreferrer" : undefined}>{children}</a>,
};
