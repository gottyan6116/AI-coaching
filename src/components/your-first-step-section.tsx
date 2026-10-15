"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { firstStepHeading, firstSteps, type FirstStep } from "@/lib/first-step-content";
import styles from "./your-first-step-section.module.css";

function StepConnector() {
  return <svg className={styles.connector} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path data-connector-path d="M3 16H27M17 6L27 16L17 26" pathLength="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

function FirstStepCard({ step, last }: { step: FirstStep; last: boolean }) {
  return <li className={styles.card} data-first-step={step.id} tabIndex={0}
    aria-labelledby={`first-step-${step.id}`} style={{ "--accent": step.color, "--tint": step.tint } as CSSProperties}>
    <div className={styles.imageFrame} data-step-image>
      <Image src={step.image} alt={step.alt} fill loading="lazy" sizes="(max-width: 767px) 82vw, (max-width: 1023px) 44vw, (max-width: 1344px) 23vw, 302px" />
    </div>
    <div className={styles.copy}>
      <div className={styles.numberRow}>
        <span className={styles.badge} data-step-text>{step.number}</span>
        {!last && <StepConnector />}
      </div>
      <h3 id={`first-step-${step.id}`} data-step-text>{step.title}</h3>
      <p data-step-text>{step.description}</p>
    </div>
  </li>;
}

export function YourFirstStepSection() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    try {
      gsap.registerPlugin(ScrollTrigger);
      media.add({ desktop: "(min-width: 1024px)", motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, context => {
        if (context.conditions?.reduce) return;
        const section = root.current!;
        gsap.from(section.querySelectorAll("[data-first-heading]"), {
          opacity: 0, y: 30, duration: .9, stagger: .15, ease: "power3.out",
          scrollTrigger: { trigger: section.querySelector("header"), start: "top 85%", once: true },
        });
        const cards = [...section.querySelectorAll<HTMLElement>("[data-first-step]")];
        if (context.conditions?.desktop) {
          const timeline = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: track.current, start: "top 85%", end: "bottom bottom-=40", scrub: .6 },
          });
          cards.forEach((card, index) => {
            const start = index * .3;
            const frame = card.querySelector("[data-step-image]");
            timeline.from(frame, { opacity: 0, y: 25, duration: .9 }, start)
              .from(card.querySelector("img"), { scale: 1.06, duration: 1 }, start)
              .from(card.querySelectorAll("[data-step-text]"), { opacity: 0, y: 20, duration: .65, stagger: .13 }, start + .25);
            const path = card.querySelector("[data-connector-path]");
            if (path) timeline.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .45, ease: "power1.inOut" }, start + .7);
          });
        } else {
          // IntersectionObserver follows native horizontal swipes without controlling touch scrolling.
          const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (!entry.isIntersecting) return;
              gsap.fromTo(entry.target, { opacity: .35, y: 12 }, { opacity: 1, y: 0, duration: .55, ease: "power2.out", overwrite: true });
              observer.unobserve(entry.target);
            });
          }, { threshold: .35 });
          cards.forEach(card => observer.observe(card));
          return () => { observer.disconnect(); gsap.killTweensOf(cards); gsap.set(cards, { clearProps: "opacity,transform" }); };
        }
      }, root);
    } catch {
      // A failed animation setup must never leave the learning content hidden.
      media.revert();
    }
    return () => media.revert();
  }, []);

  const updateActive = () => {
    const list = track.current;
    if (!list) return;
    const cards = [...list.children] as HTMLElement[];
    if (list.scrollLeft > 0 && list.scrollLeft >= list.scrollWidth - list.clientWidth - 2) {
      setActive(cards.length - 1);
      return;
    }
    const closest = cards.reduce((best, card, index) =>
      Math.abs(card.offsetLeft - cards[0].offsetLeft - list.scrollLeft) < Math.abs(cards[best].offsetLeft - cards[0].offsetLeft - list.scrollLeft) ? index : best, 0);
    setActive(closest);
  };

  const selectStep = (index: number) => {
    const list = track.current;
    if (!list) return;
    const cards = list.children as HTMLCollectionOf<HTMLElement>;
    list.scrollTo({ left: cards[index].offsetLeft - cards[0].offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return <section ref={root} id="first-step" className={styles.section} aria-labelledby="first-step-title">
    <div className={styles.inner}>
      <header className={styles.heading}>
        <p className={styles.label} data-first-heading>{firstStepHeading.label}</p>
        <h2 id="first-step-title" data-first-heading>{firstStepHeading.title.map(line => <span key={line}>{line}</span>)}</h2>
        <p className={styles.lead} data-first-heading>{firstStepHeading.lead.map(line => <span key={line}>{line}</span>)}</p>
      </header>
      <ol ref={track} className={styles.track} onScroll={updateActive} aria-label="コーチと学ぶ4つのステップ">
        {firstSteps.map((step, index) => <FirstStepCard key={step.id} step={step} last={index === firstSteps.length - 1} />)}
      </ol>
      <div className={styles.swipeControls}>
        <p>スワイプして、学びの流れを見る <span aria-hidden="true">→</span></p>
        <div className={styles.indicators} role="group" aria-label="表示するステップ">
          {firstSteps.map((step, index) => <button key={step.id} type="button" aria-label={`ステップ${step.number}：${step.title}`} aria-pressed={active === index} onClick={() => selectStep(index)}><span /></button>)}
        </div>
        <span className={styles.current} aria-live="polite" aria-atomic="true">{firstSteps[active].number} / 04</span>
      </div>
    </div>
  </section>;
}
