"use client";

import { useId, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, CalendarDays, Check, Clock3, Laptop, UserRound } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pricingContent } from "@/lib/pricing-content";
import styles from "./pricing-section.module.css";
import { MaterialButton } from "./material-button";

const featureIcons = { calendar: CalendarDays, clock: Clock3, laptop: Laptop, person: UserRound };

function PricingBackgroundDecorations() {
  const gradientId = useId().replaceAll(":", "");
  return <div className={styles.decorations} aria-hidden="true">
    <div className={styles.workspace}><Image src={pricingContent.workspace} alt="" fill sizes="(max-width: 1023px) 100vw, 60vw" loading="lazy" /></div>
    <div className={styles.orb} />
    <div className={styles.ribbon}><Image src={pricingContent.ribbon} alt="" fill sizes="100vw" loading="lazy" /></div>
    <svg className={styles.curve} viewBox="0 0 1672 941" preserveAspectRatio="none" fill="none">
      <defs><linearGradient id={gradientId} x1="0" y1="400" x2="1672" y2="700" gradientUnits="userSpaceOnUse"><stop stopColor="#F05AA7" /><stop offset=".5" stopColor="#d7b9f9" /><stop offset="1" stopColor="#68C6DF" /></linearGradient></defs>
      <path d="M-40 350C250 650 580 560 810 710S1300 810 1720 530" stroke={`url(#${gradientId})`} strokeWidth="1.2" />
    </svg>
  </div>;
}

function PricingHeadline() {
  return <header className={styles.headline}>
    <p className={styles.label} data-pricing-copy>{pricingContent.label}</p>
    <h2 id="pricing-title">{pricingContent.headline.map(line => <span key={line} data-pricing-copy>{line}</span>)}</h2>
    <p className={styles.description} data-pricing-copy>{pricingContent.description.map(line => <span key={line}>{line}</span>)}</p>
  </header>;
}

function PricingCTA({ onConsultation }: { onConsultation: () => void }) {
  return <div className={styles.ctaArea} data-pricing-cta>
    <MaterialButton tone="pink" className={styles.cta} onClick={onConsultation}>{pricingContent.cta}<ArrowRight size={24} aria-hidden="true" /></MaterialButton>
    <p className={styles.ctaHelp}>{pricingContent.ctaHelp}</p>
    <p className={styles.feeNote}>{pricingContent.feeNote}</p>
  </div>;
}

function PricingCard({ onConsultation }: { onConsultation: () => void }) {
  return <div className={styles.card} data-pricing-card aria-label="レッスンの月額料金とサポート内容">
    <div className={styles.planRow}><p className={styles.plan}>{pricingContent.plan}</p><span className={styles.badge}>{pricingContent.badge}</span></div>
    <p className={styles.price} data-pricing-price>
      <span className={styles.srOnly}>月額{pricingContent.amount.toLocaleString("ja-JP")}円、{pricingContent.tax}</span>
      <span className={styles.priceGradient} aria-hidden="true"><span className={styles.currency}>{pricingContent.currency}</span><span className={styles.amount}>{pricingContent.amount.toLocaleString("ja-JP")}</span></span>
      <span className={styles.priceUnit} aria-hidden="true"><span>{pricingContent.period}</span><span className={styles.tax}>（{pricingContent.tax}）</span></span>
    </p>
    <ul className={styles.features} aria-label="レッスン概要">
      {pricingContent.features.map(item => { const Icon = featureIcons[item.icon]; return <li key={item.id} data-pricing-feature><span className={styles.featureIcon}><Icon size={28} strokeWidth={1.65} aria-hidden="true" /></span><span>{item.label}</span></li>; })}
    </ul>
    <div className={styles.benefits}>
      <h3>{pricingContent.benefitsTitle}</h3>
      <ul>{pricingContent.benefits.map(item => <li key={item.title} data-pricing-benefit><span className={styles.check}><Check size={18} strokeWidth={3} aria-hidden="true" /></span><h4>{item.title}</h4><p>{item.description}</p></li>)}</ul>
    </div>
    <PricingCTA onConsultation={onConsultation} />
  </div>;
}

export function PricingSection({ onConsultation }: { onConsultation: () => void }) {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    try {
      gsap.registerPlugin(ScrollTrigger);
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const section = root.current!;
        gsap.from(section.querySelectorAll("[data-pricing-copy]"), {
          opacity: 0, y: 30, duration: .9, stagger: .12, ease: "power3.out",
          scrollTrigger: { trigger: section.querySelector("header"), start: "top 85%", once: true },
        });
        const card = section.querySelector("[data-pricing-card]")!;
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: card, start: "top 85%", once: true } });
        timeline.from(card, { opacity: 0, y: 40, scale: .97, duration: 1 }, 0)
          .from(section.querySelector("[data-pricing-price]"), { opacity: 0, duration: .5 }, .2)
          .from(section.querySelectorAll("[data-pricing-feature]"), { opacity: 0, y: 15, duration: .55, stagger: .1 }, .4)
          .from(section.querySelectorAll("[data-pricing-benefit]"), { opacity: 0, y: 12, duration: .5, stagger: .08 }, .7)
          .from(section.querySelector("[data-pricing-cta]"), { opacity: 0, y: 12, duration: .5 }, 1);
      }, root);
    } catch {
      // Prices and lesson details remain readable if animation setup fails.
      media.revert();
    }
    return () => media.revert();
  }, []);

  return <section ref={root} id="pricing" className={styles.section} aria-labelledby="pricing-title">
    <PricingBackgroundDecorations />
    <div className={styles.inner}>
      <PricingHeadline />
      <PricingCard onConsultation={onConsultation} />
    </div>
  </section>;
}
