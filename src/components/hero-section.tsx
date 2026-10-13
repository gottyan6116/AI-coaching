"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { HeroVisual } from "./hero-visual";
import { LearningRoadmap } from "./learning-roadmap";
import type { InformationTopic } from "@/lib/hero-content";

export function HeroHeadline() {
  return <h1 className="hero-headline" aria-label="AIで可能性を広げる"><span className="headline-ai" aria-hidden="true">AI</span><span className="headline-piece" aria-hidden="true">で</span><span className="headline-piece headline-possibility" aria-hidden="true">可能性</span><span className="headline-piece headline-ending" aria-hidden="true">を広げる</span></h1>;
}
export function HeroCTA({ onNavigate }: { onNavigate: (topic: InformationTopic) => void }) {
  return <div className="hero-cta copy-reveal"><button className="cta-primary" onClick={() => onNavigate("consultation")}>無料相談はこちら<ArrowRight size={20} aria-hidden="true" /></button><button className="cta-secondary" onClick={() => onNavigate("courses")}>コース内容を見る<ArrowRight size={20} aria-hidden="true" /></button></div>;
}
export function HeroSection({ onNavigate }: { onNavigate: (topic: InformationTopic) => void }) {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const section = root.current!;
      const ai = section.querySelector<HTMLElement>(".headline-ai")!;
      const rect = ai.getBoundingClientRect();
      const mobile = window.innerWidth < 1024;
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: () => { section.dataset.intro = "complete"; } });
      gsap.set(ai, { x: window.innerWidth * .5 - rect.left - rect.width * .5, y: window.innerHeight * (mobile ? .29 : .43) - rect.top - rect.height * .5, scale: .92, opacity: 0 });
      timeline.from(".scene-reveal, .floating-ribbon", { opacity: 0, duration: .8 }, 0)
        .to(ai, { opacity: 1, scale: 1, duration: .8 }, .15)
        .to(ai, { x: 0, y: 0, duration: .85 }, .95)
        .from(".headline-piece", { opacity: 0, y: 12, duration: .55, stagger: .12 }, 1.45)
        .from(".copy-reveal", { opacity: 0, y: 12, duration: .55, stagger: .13 }, 2)
        .from(".roadmap-card", { opacity: 0, y: 20, duration: .5, stagger: .2 }, 2.5)
        .from(".roadmap-dot", { opacity: 0, duration: .3, stagger: .2 }, 2.7);
      const path = section.querySelector<SVGPathElement>(".roadmap-line")!;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      timeline.to(path, { strokeDashoffset: 0, duration: 1.1, ease: "power1.inOut" }, 2.5);
      gsap.to(".ribbon-warm", { xPercent: 1.1, y: -9, rotation: .45, scale: 1.015, duration: 21, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".ribbon-cool", { xPercent: -1, y: 8, rotation: -.4, duration: 24, repeat: -1, yoyo: true, ease: "sine.inOut" });
      const finishOnResize = () => { timeline.progress(1); };
      window.addEventListener("resize", finishOnResize);
      return () => { window.removeEventListener("resize", finishOnResize); delete section.dataset.intro; };
    }, root);
    return () => media.revert();
  }, []);

  return <main ref={root} id="main" className="hero-section">
    <div className="hero-copy">
      <p className="hero-eyebrow copy-reveal">学ぶ。つくる。広がっていく。</p>
      <HeroHeadline />
      <p className="hero-description copy-reveal">AIの基礎から、Webサイト・アプリ開発まで。<br />あなたの目的に合わせて、実践ベースで伴走します。</p>
      <HeroCTA onNavigate={onNavigate} />
    </div>
    <HeroVisual />
    <LearningRoadmap />
  </main>;
}
