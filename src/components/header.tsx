"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { MaterialButton } from "./material-button";
import { usePathname } from "next/navigation";
import type { InformationTopic } from "@/lib/hero-content";

const navigation = [
  { label: "コース内容", topic: "courses" },
  { label: "料金", topic: "pricing" },
  { label: "お役立ち記事", topic: "articles" },
] as const;

export function Header({ onNavigate }: { onNavigate: (topic: InformationTopic) => void }) {
  const pathname = usePathname();
  const CTAButton = pathname === "/" ? MaterialButton : "button";
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const consultation = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key === "Tab") {
        const controls = [...Array.from(nav.current?.querySelectorAll<HTMLElement>("button, a") ?? []), consultation.current, toggle.current].filter(Boolean) as HTMLElement[];
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
    <Link className="wordmark" href="/#main" aria-label="AI COACHING ホーム">AI COACHING</Link>
    <nav ref={nav} id="main-navigation" className={`header-nav ${open ? "is-open" : ""}`} aria-label="メインナビゲーション">
      {navigation.map(item => item.topic === "articles" ? <Link key={item.topic} href="/knowledge" aria-current={pathname.startsWith("/knowledge") ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link> : <button key={item.topic} onClick={() => { setOpen(false); onNavigate(item.topic); }}>{item.label}</button>)}
    </nav>
    <CTAButton ref={consultation} className="header-cta" aria-label="無料相談はこちら" onClick={() => { setOpen(false); onNavigate("consultation"); }}><span className="header-cta-full" aria-hidden="true">無料相談はこちら</span><span className="header-cta-short" aria-hidden="true">無料相談</span></CTAButton>
    <button ref={toggle} className="menu-toggle" aria-label={open ? "メニューを閉じる" : "メニューを開く"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <Menu size={24} />}</button>
  </header>;
}
