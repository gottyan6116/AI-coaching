"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./article-template.module.css";

export function ArticleMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const section = root.current!;
      gsap.from(section.querySelectorAll("[data-article-intro]"), { opacity: 0, y: 14, duration: .65, stagger: .09, ease: "power3.out", clearProps: "opacity,transform" });
      section.querySelectorAll<HTMLElement>("[data-article-prose] h2, [data-article-reveal]").forEach(element => {
        // Keep all prose in HTML and visible without JS; only nearby blocks enter a reveal.
        gsap.from(element, { opacity: .35, y: 12, duration: .6, ease: "power2.out", clearProps: "opacity,transform", scrollTrigger: { trigger: element, start: "top 94%", once: true } });
      });
      const cta = section.querySelector("[data-article-cta]");
      if (cta) gsap.timeline({ scrollTrigger: { trigger: cta, start: "top 90%", once: true } })
        .from(cta, { opacity: .35, duration: .6, clearProps: "opacity" }, 0)
        .from(cta.querySelectorAll("[data-cta-copy]"), { y: 16, opacity: 0, duration: .6, stagger: .08, clearProps: "opacity,transform" }, .1)
        .from(cta.querySelector("button"), { y: 10, opacity: 0, duration: .5, clearProps: "opacity,transform" }, .35);
    }, root);
    return () => media.revert();
  }, []);
  return <div ref={root} className={styles.template}>{children}</div>;
}
