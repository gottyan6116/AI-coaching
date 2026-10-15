"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { possibilities, possibilitiesHeading, type Possibility } from "@/lib/possibilities-content";
import styles from "./possibilities-section.module.css";

function PossibilityItem({ item }: { item: Possibility }) {
  return (
    <article className={styles.item} data-possibility={item.id} aria-labelledby={`possibility-${item.id}`}
      style={{ "--accent": item.accentColor, "--tint": item.tint } as CSSProperties}>
      <div className={styles.imageFrame} data-image-reveal>
        <div className={styles.parallax} data-parallax>
          <div className={styles.imageScale} data-image-scale>
            <Image src={item.image} alt={item.alt} fill sizes="(max-width: 767px) 92vw, (max-width: 1312px) 46vw, 600px" loading="lazy" />
          </div>
        </div>
      </div>
      <div className={styles.copy}>
        <span className={styles.badge} data-text-reveal>{item.number}</span>
        <h3 id={`possibility-${item.id}`} data-text-reveal>{item.title}</h3>
        <p className={styles.subtitle} data-text-reveal>{item.subtitle}</p>
        <p className={styles.description} data-text-reveal>{item.description}</p>
      </div>
      <span className={styles.orb} aria-hidden="true" />
    </article>
  );
}

export function PossibilitiesSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 768px)", motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, context => {
      // Content stays readable without JavaScript and when reduced motion is requested.
      if (context.conditions?.reduce) return;
      const section = root.current!;
      gsap.from(section.querySelectorAll("[data-heading-reveal]"), {
        y: 35, opacity: 0, duration: 1, stagger: .14, ease: "power3.out",
        scrollTrigger: { trigger: section.querySelector("header"), start: "top 85%", once: true },
      });

      section.querySelectorAll<HTMLElement>("[data-possibility]").forEach((item, index) => {
        const frame = item.querySelector<HTMLElement>("[data-image-reveal]")!;
        const scale = item.querySelector("[data-image-scale]");
        const text = item.querySelectorAll("[data-text-reveal]");
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: item, start: "top 82%", once: true },
        });
        timeline.fromTo(frame, { clipPath: index % 2 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0%)", duration: 1.2 }, 0)
          .from(scale, { scale: 1.08, duration: 1.3 }, 0)
          .from(text, { y: 24, opacity: 0, duration: .75, stagger: .16, ease: "power2.out" }, .48);

        if (context.conditions?.desktop) {
          // Separate nested transforms keep the reveal scale and parallax independent.
          gsap.fromTo(item.querySelector("[data-parallax]"), { y: -12 }, {
            y: 12, ease: "none",
            scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: .7 },
          });
        }
      });
    }, root);
    return () => media.revert();
  }, []);

  return (
    <section ref={root} id="possibilities" className={styles.section} aria-labelledby="possibilities-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <p className={styles.label} data-heading-reveal>{possibilitiesHeading.label}</p>
          <h2 id="possibilities-title" data-heading-reveal>{possibilitiesHeading.title}</h2>
          <p className={styles.headingSubtitle} data-heading-reveal>{possibilitiesHeading.subtitle}</p>
          <p className={styles.lead} data-heading-reveal>{possibilitiesHeading.lead}</p>
        </header>
        <div className={styles.items}>
          {possibilities.map(item => <PossibilityItem key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}
