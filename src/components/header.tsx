"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { InformationTopic } from "@/lib/hero-content";

const navigation = [
  { label: "コース内容", topic: "courses" },
  { label: "料金", topic: "pricing" },
  { label: "お役立ち記事", topic: "articles" },
] as const;

export function Header({ onNavigate }: { onNavigate: (topic: InformationTopic) => void }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key === "Tab") {
        const controls = [toggle.current, ...Array.from(nav.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])].filter(Boolean) as HTMLButtonElement[];
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const onResize = () => { if (window.innerWidth > 1023) setOpen(false); };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { document.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open]);

  return <header className="site-header">
    <a className="wordmark" href="#main" aria-label="AI COACHING ホーム">AI COACHING</a>
    <button ref={toggle} className="menu-toggle" aria-label={open ? "メニューを閉じる" : "メニューを開く"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <Menu size={24} />}</button>
    <nav ref={nav} id="main-navigation" className={`header-nav ${open ? "is-open" : ""}`} aria-label="メインナビゲーション">
      {navigation.map(item => <button key={item.topic} onClick={() => { setOpen(false); onNavigate(item.topic); }}>{item.label}</button>)}
    </nav>
  </header>;
}
