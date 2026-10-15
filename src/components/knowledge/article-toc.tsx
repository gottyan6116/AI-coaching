"use client";

import { useEffect, useState } from "react";
import { ChevronDown, List } from "lucide-react";
import type { ArticleHeading } from "@/lib/knowledge-types";
import styles from "./article-template.module.css";

export function ArticleTOC({ headings }: { headings: ArticleHeading[] }) {
  const [active, setActive] = useState(headings[0]?.id ?? "");
  useEffect(() => {
    const elements = headings.map(heading => document.getElementById(heading.id)).filter((element): element is HTMLElement => !!element);
    const readingLine = Math.max(140, (document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 86) + 44);
    const update = () => {
      const passed = elements.filter(element => element.getBoundingClientRect().top <= readingLine + 1);
      setActive((passed.at(-1) ?? elements[0])?.id ?? "");
    };
    const observer = new IntersectionObserver(update, { rootMargin: `-${readingLine}px 0px -55% 0px`, threshold: [0, 1] });
    elements.forEach(element => observer.observe(element));
    window.addEventListener("hashchange", update);
    update();
    return () => { observer.disconnect(); window.removeEventListener("hashchange", update); };
  }, [headings]);
  if (!headings.length) return null;
  const links = <ol>{headings.map(heading => <li key={heading.id} data-level={heading.level}><a href={`#${heading.id}`} aria-current={active === heading.id ? "location" : undefined} onClick={() => setActive(heading.id)}>{heading.text}</a></li>)}</ol>;
  return <aside className={styles.tocArea}>
    <nav className={styles.desktopToc} aria-label="この記事の目次"><p><List size={18} aria-hidden="true" />この記事の目次</p>{links}</nav>
    <details className={styles.mobileToc}><summary><span><List size={18} aria-hidden="true" />この記事の目次</span><ChevronDown size={18} aria-hidden="true" /></summary><nav aria-label="この記事の目次">{links}</nav></details>
  </aside>;
}
