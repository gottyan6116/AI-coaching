"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { Header } from "./header";
import { HeroSection } from "./hero-section";
import { PossibilitiesSection } from "./possibilities-section";
import { informationTitles, roadmapSteps, type InformationTopic } from "@/lib/hero-content";

export function CoachingLanding() {
  const [topic, setTopic] = useState<InformationTopic>("courses");
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const openInformation = (nextTopic: InformationTopic) => {
    setTopic(nextTopic);
    returnFocus.current = window.innerWidth < 1024 && document.activeElement?.closest(".header-nav")
      ? document.querySelector<HTMLElement>(".menu-toggle")
      : document.activeElement as HTMLElement;
    dialog.current?.showModal();
  };
  return <>
    <a className="skip-link" href="#main">メインコンテンツへ</a>
    <Header onNavigate={openInformation} />
    <HeroSection onNavigate={openInformation} />
    <PossibilitiesSection />
    <dialog ref={dialog} className="information-dialog" aria-labelledby="information-title" onClose={() => returnFocus.current?.focus()} onClick={event => { if (event.target === dialog.current) { const r = dialog.current.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.current.close(); } }}>
      <button className="dialog-close" aria-label="閉じる" onClick={() => dialog.current?.close()}><X size={23} /></button>
      <p className="dialog-kicker">AI COACHING</p><h2 id="information-title">{informationTitles[topic]}</h2>
      {topic === "courses" ? <ol className="course-summary">{roadmapSteps.map((step, index) => <li key={step.title}><span style={{ color: step.color }}>0{index + 1}</span><div><h3>{step.title}</h3><p>{step.lines.join("")}</p></div></li>)}</ol> : <p className="dialog-description">{topic === "consultation" ? "あなたの目的に合わせて、AIの学び方や取り組みたいことを一緒に整理します。相談の受付窓口は現在準備中です。" : topic === "pricing" ? "受講料金の詳細は現在準備中です。公開まで、しばらくお待ちください。" : "AIの活用に役立つ記事を準備中です。公開まで、しばらくお待ちください。"}</p>}
      <button className="dialog-done" onClick={() => dialog.current?.close()}>閉じる</button>
    </dialog>
  </>;
}
