"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import { ArrowRight, ChartNoAxesCombined, Check, CodeXml, FileText, MessageSquareText, Settings } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { learningThemes, learningOutcomes } from "@/lib/learning-content";
import styles from "./learning-and-outcomes-section.module.css";

const themeIcons = { chat: MessageSquareText, chart: ChartNoAxesCombined, settings: Settings, code: CodeXml };

export function LearningAndOutcomesSection({ onConsultation }: { onConsultation: () => void }) {
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const previous = useRef(0);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    let mounted = true;
    let refreshFrame = 0;
    try {
      gsap.registerPlugin(ScrollTrigger);
      media.add({ desktop: "(min-width: 1024px)", motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, context => {
        if (context.conditions?.reduce) return;
        const section = root.current!;
        gsap.from(section.querySelectorAll("[data-learning-intro]"), {
          opacity: 0, y: 30, duration: .85, stagger: .12, ease: "power3.out",
          scrollTrigger: { trigger: section.querySelector("header"), start: "top 85%", once: true },
        });
        const buildHeading = section.querySelector("[data-build-heading]");
        gsap.from(buildHeading!.children, {
          opacity: 0, y: 25, duration: .85, stagger: .12, ease: "power3.out",
          scrollTrigger: { trigger: buildHeading, start: "top 85%", once: true },
        });
        const cards = section.querySelectorAll("[data-outcome]");
        const reveal = (targets: gsap.TweenTarget, trigger: Element, stagger = 0) => {
          gsap.from(targets, { opacity: 0, y: 35, scale: .97, duration: .9, stagger, ease: "power3.out", scrollTrigger: { trigger, start: "top 85%", once: true } });
        };
        if (context.conditions?.desktop) reveal(cards, cards[0], .15);
        else cards.forEach(card => reveal(card, card));
        cards.forEach(card => gsap.from(card.querySelector("[data-outcome-image]"), {
          scale: 1.04, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 85%", once: true },
        }));
        const made = section.querySelector("[data-made]");
        gsap.from(made!.children, { opacity: 0, y: 20, duration: .8, stagger: .12, ease: "power3.out", scrollTrigger: { trigger: made, start: "top 85%", once: true } });
      }, root);
      // Account for an early scroll during hydration and final font measurements.
      const refresh = () => { if (mounted) ScrollTrigger.refresh(); };
      refreshFrame = requestAnimationFrame(refresh);
      void document.fonts.ready.then(refresh);
    } catch { media.revert(); }
    return () => { mounted = false; cancelAnimationFrame(refreshFrame); media.revert(); };
  }, []);

  useLayoutEffect(() => {
    const old = previous.current;
    previous.current = selected;
    if (old === selected) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    let transition: gsap.Context | undefined;
    try {
      transition = gsap.context(() => {
        const panels = root.current!.querySelectorAll<HTMLElement>("[role=tabpanel]");
        const current = panels[selected];
        const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
        timeline.set(panels[old], { visibility: "visible", opacity: 1 })
          .to(panels[old], { opacity: 0, duration: .18 })
          .set(panels[old], { clearProps: "opacity,visibility" })
          .from(current.querySelector("[data-theme-image]"), { opacity: 0, y: 12, duration: .45 }, .12)
          .from(current.querySelectorAll("[data-skill]"), { opacity: 0, y: 12, duration: .35, stagger: .035 }, .14)
          .from(current.querySelector("[data-deliverables]"), { opacity: 0, y: 15, duration: .4 }, .25);
      }, root);
    } catch { transition?.revert(); }
    const reduceMotion = () => { if (motion.matches) transition?.revert(); };
    motion.addEventListener("change", reduceMotion);
    // Reverting also cancels an interrupted transition before starting another.
    return () => { motion.removeEventListener("change", reduceMotion); transition?.revert(); };
  }, [selected]);

  const choose = (index: number, focus = false) => {
    setSelected(index);
    const list = tabs.current!;
    const button = list.querySelectorAll<HTMLButtonElement>("button")[index];
    if (focus) button.focus({ preventScroll: true });
    const left = button.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft;
    if (left < list.scrollLeft) list.scrollTo({ left, behavior: "instant" });
    else if (left + button.offsetWidth > list.scrollLeft + list.clientWidth) list.scrollTo({ left: left + button.offsetWidth - list.clientWidth, behavior: "instant" });
  };
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === "ArrowRight" ? (index + 1) % 4 : event.key === "ArrowLeft" ? (index + 3) % 4 : event.key === "Home" ? 0 : event.key === "End" ? 3 : null;
    if (next !== null) { event.preventDefault(); choose(next, true); }
  };

  return <section ref={root} id="learning" className={styles.section} aria-labelledby="learning-title">
    <div className={styles.inner}>
      <header className={styles.heading}>
        <p className={styles.label} data-learning-intro>WHAT YOU CAN LEARN</p>
        <h2 id="learning-title" data-learning-intro><span>学ぶだけで終わらない。</span><span>あなたの「やりたい」を、カタチに。</span></h2>
        <p className={styles.lead} data-learning-intro><span>AIの基礎からビジネス活用、Web・アプリ制作まで。</span><span>あなたの目的に合わせて、学ぶ内容も、つくるものも、一緒に設計します。</span></p>
      </header>
      <p className={styles.themeNote}>選べる学習テーマの代表例です。固定コースではなく、目的や現在のスキルに合わせて組み合わせます。</p>
      <div ref={tabs} className={styles.tabs} role="tablist" aria-label="学習テーマ" data-learning-intro>
        {learningThemes.map((theme, index) => <button key={theme.id} id={`learning-tab-${theme.id}`} role="tab" type="button" aria-selected={selected === index} aria-controls={`learning-panel-${theme.id}`} tabIndex={selected === index ? 0 : -1} onClick={() => choose(index)} onKeyDown={event => onKey(event, index)}>{theme.label}</button>)}
      </div>
      <div className={styles.panels} data-learning-intro>
        {learningThemes.map((theme, index) => <div key={theme.id} id={`learning-panel-${theme.id}`} className={styles.panel} role="tabpanel" aria-labelledby={`learning-tab-${theme.id}`} aria-hidden={selected !== index} inert={selected !== index} data-active={selected === index} tabIndex={selected === index ? 0 : -1}>
          <div className={styles.learningCopy}>
            <h3 className={styles.srOnly}>具体的に学べること</h3>
            <ul className={styles.checklist}>{theme.skills.map(skill => <li key={skill} data-skill><Check size={17} aria-hidden="true" /><span>{skill}</span></li>)}</ul>
            <aside className={styles.recommended} aria-label="こんな方におすすめ"><h3>こんな方におすすめ</h3><ul>{theme.recommended.map(text => <li key={text}><Check size={14} aria-hidden="true" />{text}</li>)}</ul></aside>
            {"note" in theme && <p className={styles.detailNote}>{theme.note}</p>}
          </div>
          <div className={styles.learningVisual}>
            <div className={styles.themeImage} data-theme-image><Image src={theme.image} alt={theme.alt} fill sizes="(max-width: 767px) 90vw, (max-width: 1312px) 56vw, 760px" loading="lazy" /></div>
            <div className={styles.deliverables} data-deliverables><h3>実際につくるもの（例）</h3><ul>{theme.deliverables.map(text => <li key={text}><FileText size={21} aria-hidden="true" /><span>{text}</span></li>)}</ul></div>
          </div>
        </div>)}
      </div>
      <section id="outcomes" className={styles.build} aria-labelledby="build-title">
        <header className={styles.heading} data-build-heading>
          <p className={styles.label}>WHAT YOU CAN BUILD</p>
          <h2 id="build-title" className={styles.buildTitle}>こんなものが、つくれるようになります。</h2>
          <p className={styles.lead}><span>AIを使って、仕事の成果物からWebサイト・アプリまで。</span><span>あなたの目的に合わせて、実際に手を動かしながらつくっていきます。</span></p>
        </header>
        <p className={styles.galleryLabel}>制作できるものの例 <span>／ 完成イメージ</span></p>
        <div className={styles.gallery}>{learningOutcomes.map(outcome => <article key={outcome.id} className={styles.outcome} data-outcome>
          <div className={styles.outcomeFrame}><div className={styles.outcomeImage} data-outcome-image><Image src={outcome.image} alt={outcome.alt} fill sizes="(max-width: 767px) 90vw, (max-width: 1023px) 44vw, 300px" loading="lazy" /></div></div>
          <h3>{outcome.title}</h3><p>{outcome.description}</p><ul className={styles.tags} aria-label="関連スキル">{outcome.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        </article>)}</div>
        <p className={styles.galleryNote}>すべてを制作する固定カリキュラムではありません。制作テーマ・必要なスキル・到達目標は個別に設定します。難易度や必要期間は制作物によって異なります。</p>
        <div className={styles.summary}><h3>学べることの例</h3><ul>{learningThemes.map(theme => { const Icon = themeIcons[theme.icon]; return <li key={theme.id} style={{ "--accent": theme.color, "--tint": theme.tint } as CSSProperties}><span className={styles.summaryIcon}><Icon size={27} strokeWidth={1.5} aria-hidden="true" /></span><span>{theme.summary}</span></li>; })}</ul></div>
      </section>
      <section className={styles.made} aria-labelledby="made-title"><div data-made>
        <p className={styles.label}>MADE FOR YOU</p>
        <h2 id="made-title"><span>学ぶことも、つくるものも。</span><span>あなたに合わせて。</span></h2>
        <p className={styles.madeDescription}>決まったコースを受講するのではなく、あなたの目標や現在のスキルに合わせて、学習内容と最終成果物を一緒に設計します。<br />AIの基本操作から、業務改善、Webサイト・アプリ開発まで。<br />本当に必要なことを、マンツーマンで実践しながら学んでいきます。</p>
        <p className={styles.ctaHelp}>何から始めればいいかわからなくても大丈夫。<br />まずは、やってみたいことや今のお悩みをお聞かせください。</p>
        <button type="button" className={styles.cta} onClick={onConsultation}>無料カウンセリングで相談する<ArrowRight size={20} aria-hidden="true" /></button>
      </div></section>
    </div>
  </section>;
}
