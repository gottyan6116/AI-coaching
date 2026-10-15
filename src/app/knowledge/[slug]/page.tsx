import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticle, getArticles, includesSamples } from "@/lib/knowledge";
import { categoryLabel, formatArticleDate, siteUrl } from "@/lib/knowledge-types";
import { ArticleCard } from "@/components/knowledge/knowledge-index";
import styles from "@/components/knowledge/knowledge.module.css";
type Props={params:Promise<{slug:string}>;searchParams:Promise<{preview?:string|string[]}>};
export async function generateMetadata({params,searchParams}:Props):Promise<Metadata>{
 const article=await getArticle((await params).slug,includesSamples((await searchParams).preview));if(!article)return {title:"記事が見つかりません｜AI COACHING",robots:{index:false}};
 const m=article.metadata,sample=m.status==="sample";
 return {title:`${m.title}｜AI COACHING`,description:m.description,alternates:{canonical:`${siteUrl}${sample?"/knowledge":`/knowledge/${m.slug}`}`},robots:sample?{index:false,follow:false}:undefined,openGraph:{title:m.title,description:m.description,url:`${siteUrl}/knowledge/${m.slug}`,type:"article",locale:"ja_JP",images:[{url:`${siteUrl}${m.thumbnail}`,alt:m.title}],publishedTime:m.publishedAt??undefined,modifiedTime:m.updatedAt,tags:m.tags}};
}
export default async function ArticlePage({params,searchParams}:Props){
 const samples=includesSamples((await searchParams).preview), article=await getArticle((await params).slug,samples);if(!article)notFound();
 const {metadata:m,Content}=article;
 const related=(await getArticles(samples)).filter(other=>other.metadata.slug!==m.slug).sort((a,b)=>Number(b.metadata.category===m.category)-Number(a.metadata.category===m.category)).slice(0,3);
 const listHref=samples?"/knowledge?preview=sample":"/knowledge";
 const breadcrumb={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"ホーム",item:siteUrl},{"@type":"ListItem",position:2,name:"Knowledge",item:`${siteUrl}/knowledge`},{"@type":"ListItem",position:3,name:m.title,item:`${siteUrl}/knowledge/${m.slug}`}]};
 const structured={"@context":"https://schema.org","@type":"Article",headline:m.title,description:m.description,image:[`${siteUrl}${m.thumbnail}`],datePublished:m.publishedAt,dateModified:m.updatedAt,mainEntityOfPage:`${siteUrl}/knowledge/${m.slug}`,publisher:{"@type":"Organization",name:"AI COACHING",url:siteUrl}};
 return <main id="knowledge-main">
  <article className={styles.article}>
   <nav aria-label="パンくずリスト"><ol className={styles.breadcrumbs}><li><Link href="/">ホーム</Link></li><li><Link href={listHref}>Knowledge</Link></li><li aria-current="page">{m.title}</li></ol></nav>
   {m.status==="sample"&&<aside className={styles.previewNote}>表示確認用サンプルです。公開記事ではありません。</aside>}
   <header className={styles.articleHeader}><span className={styles.articleCategory}>{categoryLabel(m.category)}</span><h1>{m.title}</h1><div className={styles.articleDates}>{m.publishedAt?<><span>公開日 <time dateTime={m.publishedAt}>{formatArticleDate(m.publishedAt)}</time></span><span>更新日 <time dateTime={m.updatedAt}>{formatArticleDate(m.updatedAt)}</time></span></>:<span>サンプル原稿・公開日未設定</span>}</div></header>
   <div className={styles.cover}><Image src={m.thumbnail} alt={m.title} fill sizes="(max-width: 767px) 90vw, 832px" loading="eager"/></div>
   <div className={styles.prose}><Content/></div>
   <ul className={styles.tags} aria-label="記事のタグ">{m.tags.map(tag=><li key={tag}>{tag}</li>)}</ul>
   <Link className={styles.backLink} href={listHref}>記事一覧へ戻る</Link>
  </article>
  {related.length>0&&<section className={styles.related} aria-labelledby="related-title"><h2 id="related-title">あわせて読みたい</h2><div className={styles.grid}>{related.map(item=><ArticleCard key={item.metadata.slug} article={item.metadata}/>)}</div></section>}
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb).replace(/</g,"\\u003c")}}/>
  {m.status==="published"&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,"\\u003c")}}/>}
 </main>;
}
