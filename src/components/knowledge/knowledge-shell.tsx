"use client";
import { createContext, useContext, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import type { InformationTopic } from "@/lib/hero-content";
import LiquidGlassBackground from "./liquid-glass-background";
import styles from "./knowledge.module.css";

const ConsultationContext = createContext<() => void>(() => {});
export const useKnowledgeConsultation = () => useContext(ConsultationContext);

export function KnowledgeShell({children}:{children:ReactNode}) {
 const articleView = usePathname().startsWith("/knowledge/");
 const dialog=useRef<HTMLDialogElement>(null), returnFocus=useRef<HTMLElement|null>(null);
 const navigate=(topic:InformationTopic)=>{
  if(topic==="courses"||topic==="pricing"){window.location.assign(topic==="courses"?"/#learning":"/#pricing");return;}
  returnFocus.current=document.activeElement as HTMLElement;dialog.current?.showModal();
 };
 return <ConsultationContext.Provider value={()=>navigate("consultation")}><div className={styles.shell}>
  <LiquidGlassBackground subtle={articleView} />
  <a className="skip-link" href="#knowledge-main">メインコンテンツへ</a>
  <Header onNavigate={navigate}/>
  <div className={styles.content}>{children}</div>
  {!articleView&&<section className={styles.ctaSection} aria-labelledby="knowledge-next-step">
   <p className={styles.label}>YOUR NEXT STEP</p><h2 id="knowledge-next-step">学ぶだけで終わらせない。<br/>あなたの「やってみたい」を、一緒に。</h2>
   <p>AIの使い方から仕事への活用、Webサイト・アプリ開発まで。<br/>あなたの目標や現在のスキルに合わせて、学び方をご提案します。</p>
   <button type="button" className={styles.ctaButton} onClick={()=>navigate("consultation")}>無料カウンセリングで相談する<ArrowRight size={19} aria-hidden="true"/></button>
  </section>}
  <footer className={styles.footer}><Link href="/" className={styles.footerBrand}>AI COACHING</Link><nav aria-label="フッターナビゲーション"><Link href="/">ホーム</Link><Link href="/knowledge">お役立ち記事</Link><Link href="/#coach">コーチ紹介</Link><Link href="/#pricing">料金</Link></nav><small>© {new Date().getFullYear()} AI COACHING</small></footer>
  <dialog ref={dialog} className="information-dialog" aria-labelledby="knowledge-consultation-title" onClose={()=>returnFocus.current?.focus()}>
   <button className="dialog-close" aria-label="閉じる" onClick={()=>dialog.current?.close()}><X size={23}/></button><p className="dialog-kicker">AI COACHING</p><h2 id="knowledge-consultation-title">無料カウンセリング</h2><p className="dialog-description">あなたの目的に合わせて、AIの学び方や取り組みたいことを一緒に整理します。相談の受付窓口は現在準備中です。</p><button className="dialog-done" onClick={()=>dialog.current?.close()}>閉じる</button>
  </dialog>
 </div></ConsultationContext.Provider>;
}
