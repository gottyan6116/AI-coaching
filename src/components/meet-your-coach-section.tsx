"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { BookOpen, Camera, ChartNoAxesCombined, CodeXml, Workflow } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { coachProfile } from "@/lib/coach-content";
import styles from "./meet-your-coach-section.module.css";

const expertiseIcons = { education: BookOpen, marketing: ChartNoAxesCombined, automation: Workflow, development: CodeXml };

export function CoachPhotoPlaceholder({ src, alt }: { src: string | null; alt: string }) {
  return <div className={styles.photo} data-coach-photo>
    {src ? <Image src={src} alt={alt} fill sizes="(max-width: 767px) 90vw, (max-width: 1312px) 40vw, 530px" loading="lazy" /> :
      <div className={styles.placeholder} role="img" aria-label={coachProfile.photo.placeholderLabel}>
        <Camera size={48} strokeWidth={1.15} aria-hidden="true" />
        <span aria-hidden="true">{coachProfile.photo.placeholder}</span>
      </div>}
  </div>;
}

function CoachExperience() {
  return <div className={styles.background}>
    <h3 className={styles.backgroundLabel}>{coachProfile.backgroundLabel}</h3>
    <ul className={styles.experiences}>
      {coachProfile.experience.map(item => <li key={item.id} data-coach-experience style={{ "--accent": item.color } as CSSProperties}>
        <h4>{"years" in item && <span className={styles.tenure}>{"prefix" in item && <span className={styles.prefix}>{item.prefix}</span>}<span className={styles.years}>{item.years}</span><span className={styles.unit}>{item.unit}</span></span>}<span className={styles.experienceTitle}>{item.title}</span></h4>
        {item.description.map(text => <p key={text}>{text}</p>)}
      </li>)}
    </ul>
  </div>;
}

function CoachIntroduction() {
  return <div className={styles.introduction} data-coach-introduction>
    <h3>{coachProfile.introduction.title}</h3>
    {coachProfile.introduction.paragraphs.map(text => <p key={text}>{text}</p>)}
  </div>;
}

function CoachExpertiseGrid() {
  return <ul className={styles.expertise} aria-label="コーチの専門領域">
    {coachProfile.expertise.map(item => {
      const Icon = expertiseIcons[item.icon];
      return <li key={item.title} data-coach-expertise style={{ "--accent": item.color, "--tint": item.tint } as CSSProperties}>
        <span className={styles.icon}><Icon size={26} strokeWidth={1.5} aria-hidden="true" /></span>
        <div><h3>{item.title}</h3><p>{item.description}</p></div>
      </li>;
    })}
  </ul>;
}

export function MeetYourCoachSection() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    try {
      gsap.registerPlugin(ScrollTrigger);
      media.add({ desktop: "(min-width: 768px)", motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, context => {
        if (context.conditions?.reduce) return;
        const section = root.current!;
        const defaults = { ease: "power3.out" };
        const header = section.querySelector("header")!;
        gsap.from(header.children, { ...defaults, opacity: 0, y: 30, duration: .9, stagger: .15, scrollTrigger: { trigger: header, start: "top 85%", once: true } });
        const photo = section.querySelector("[data-coach-photo]")!;
        gsap.from(photo, { ...defaults, opacity: 0, x: context.conditions?.desktop ? -35 : 0, y: context.conditions?.desktop ? 0 : 25, scale: .97, duration: 1, scrollTrigger: { trigger: photo, start: "top 82%", once: true } });
        const experiences = section.querySelectorAll("[data-coach-experience]");
        if (context.conditions?.desktop) {
          gsap.from(experiences, { ...defaults, opacity: 0, y: 25, duration: .75, stagger: .15, scrollTrigger: { trigger: experiences[0], start: "top 82%", once: true } });
        } else {
          experiences.forEach(item => gsap.from(item, { ...defaults, opacity: 0, y: 25, duration: .75, scrollTrigger: { trigger: item, start: "top 85%", once: true } }));
        }
        const introduction = section.querySelector("[data-coach-introduction]")!;
        gsap.from(introduction, { ...defaults, opacity: 0, y: 25, duration: .85, scrollTrigger: { trigger: introduction, start: "top 85%", once: true } });
        const cards = section.querySelectorAll("[data-coach-expertise]");
        if (context.conditions?.desktop) {
          gsap.from(cards, { ...defaults, opacity: 0, y: 25, duration: .75, stagger: .15, delay: .2, scrollTrigger: { trigger: cards[0], start: "top 82%", once: true } });
        } else {
          cards.forEach(item => gsap.from(item, { ...defaults, opacity: 0, y: 20, duration: .7, scrollTrigger: { trigger: item, start: "top 95%", once: true } }));
        }
      }, root);
    } catch {
      // Restore readable content if any animation fails to initialize.
      media.revert();
    }
    return () => media.revert();
  }, []);

  return <section ref={root} id="coach" className={styles.section} aria-labelledby="coach-title">
    <div className={styles.inner}>
      <header className={styles.heading}>
        <p className={styles.label}>{coachProfile.label}</p>
        <h2 id="coach-title">{coachProfile.titleParts.map(part => <span key={part}>{part}</span>)}</h2>
        <p className={styles.lead}>{coachProfile.lead.map(line => <span key={line}>{line}</span>)}</p>
      </header>
      <div className={styles.profile}>
        <CoachPhotoPlaceholder src={coachProfile.photo.src} alt={coachProfile.photo.alt} />
        <CoachExperience />
      </div>
      <CoachIntroduction />
      <CoachExpertiseGrid />
    </div>
  </section>;
}
