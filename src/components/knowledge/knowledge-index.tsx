"use client";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { knowledgeCategories, categoryLabel, articleHref, formatArticleDate, type ArticleMeta } from "@/lib/knowledge-types";
import styles from "./knowledge.module.css";

export function ArticleCard({article}:{article:ArticleMeta}){
 return <article className={styles.card} data-article={article.slug}>
  <Link href={articleHref(article)} className={styles.cardLink}>
   <div className={styles.thumbnail}><Image src={article.thumbnail} alt="" fill sizes="(max-width: 767px) 90vw, (max-width: 1023px) 44vw, (max-width: 1439px) 29vw, 300px" loading="lazy"/>{article.status==="sample"&&<span className={styles.sampleTag}>サンプル</span>}</div>
   <div className={styles.cardBody}><h2>{article.title}</h2><div className={styles.cardMeta}><span>{categoryLabel(article.category)}</span>{article.publishedAt?<time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>:<span>公開前プレビュー</span>}</div><p>{article.description}</p><span className={styles.readMore}>記事を読む<ArrowRight size={16} aria-hidden="true"/></span></div>
  </Link>
 </article>;
}

export function KnowledgeIndex({articles,samples}:{articles:ArticleMeta[];samples:boolean}){
 const root=useRef<HTMLElement>(null), grid=useRef<HTMLDivElement>(null), filterTween=useRef<gsap.core.Tween|null>(null);
 const [selected,setSelected]=useState("all"),[category,setCategory]=useState("all"),[limit,setLimit]=useState(4);
 const seen=useRef(new Set<string>());
 const filtered=articles.filter(article=>category==="all"||article.category===category);
 const visible=filtered.slice(0,limit);
 useLayoutEffect(()=>{const media=gsap.matchMedia();media.add("(prefers-reduced-motion: no-preference)",()=>{gsap.from(root.current!.querySelectorAll("[data-knowledge-heading]"),{opacity:0,y:25,duration:.8,stagger:.12,ease:"power3.out"});},root);return()=>{media.revert();filterTween.current?.kill();};},[]);
 useLayoutEffect(()=>{
  const media=gsap.matchMedia();
  gsap.set(grid.current,{opacity:1,y:0});
  try{gsap.registerPlugin(ScrollTrigger);media.add("(prefers-reduced-motion: no-preference)",()=>{
   grid.current!.querySelectorAll<HTMLElement>("[data-article]").forEach((card,index)=>{const slug=card.dataset.article!;if(seen.current.has(slug))return;gsap.from(card,{opacity:0,y:30,duration:.8,delay:(index%4)*.08,ease:"power3.out",onComplete:()=>seen.current.add(slug),scrollTrigger:{trigger:card,start:"top 95%",once:true}});});
  },root);}catch{media.revert();}return()=>media.revert();
 },[category,limit,articles]);
 const choose=(id:string)=>{setSelected(id);filterTween.current?.kill();if(id===category){gsap.set(grid.current,{opacity:1,y:0});return;}const update=()=>{setCategory(id);setLimit(4);};if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){update();}else{filterTween.current=gsap.to(grid.current,{opacity:.2,y:5,duration:.14,ease:"power2.out",onComplete:update});}};
 return <main ref={root} id="knowledge-main" className={styles.index}>
  <header className={styles.hero}><p className={styles.label} data-knowledge-heading>AI COACHING JOURNAL</p><h1 data-knowledge-heading>Knowledge<span aria-hidden="true">.</span></h1><p className={styles.catch} data-knowledge-heading>AIを知る。学ぶ。可能性を広げる。</p><p className={styles.heroLead} data-knowledge-heading>AIの基礎知識から、ビジネスでの活用方法、Web・アプリ開発まで。<br/>あなたの「やってみたい」を広げるヒントをお届けします。</p></header>
  {samples&&<aside className={styles.previewNote}>表示確認用のサンプル記事です。公開記事とは区別し、検索対象から除外しています。<Link href="/knowledge">公開用ページへ</Link></aside>}
  <div className={styles.categories} role="group" aria-label="記事カテゴリ">{knowledgeCategories.map(item=><button key={item.id} type="button" aria-pressed={selected===item.id} onClick={()=>choose(item.id)} onKeyDown={event=>{if(["ArrowLeft","ArrowRight","Home","End"].includes(event.key)){event.preventDefault();const index=knowledgeCategories.findIndex(c=>c.id===item.id);const next=event.key==="Home"?0:event.key==="End"?4:event.key==="ArrowRight"?(index+1)%5:(index+4)%5;const button=event.currentTarget.parentElement!.querySelectorAll<HTMLButtonElement>("button")[next];button.focus();choose(knowledgeCategories[next].id);}}}>{item.label}</button>)}</div>
  <div className={styles.results} aria-live="polite"><span>{knowledgeCategories.find(item=>item.id===category)?.label}</span><span>{filtered.length} <small>articles</small></span></div>
  <div ref={grid} className={styles.grid} aria-label="記事一覧">{visible.map(article=><ArticleCard key={article.slug} article={article}/>)}
   {filtered.length===0&&<div className={styles.empty}><p className={styles.emptyKicker}>COMING SOON</p><h2>記事を準備しています。</h2><p>{category==="all"?"AIを学ぶヒントを、ここからお届けしていきます。":"このカテゴリの記事は、公開までしばらくお待ちください。"}</p>{category!=="all"?<button type="button" onClick={()=>choose("all")}>すべての記事を見る</button>:!samples&&<Link href="/knowledge?preview=sample">サンプルで表示を確認する<ArrowRight size={16}/></Link>}</div>}
  </div>
  {filtered.length>0&&<div className={styles.more}>{limit<filtered.length?<button type="button" onClick={()=>setLimit(value=>value+4)}>さらに記事を表示する<ArrowRight size={17}/></button>:<p>全{filtered.length}件を表示しています</p>}</div>}
 </main>;
}
