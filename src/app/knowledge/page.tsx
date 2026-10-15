import type { Metadata } from "next";
import { getArticles, includesSamples } from "@/lib/knowledge";
import { siteUrl, knowledgeCategories } from "@/lib/knowledge-types";
import { KnowledgeIndex } from "@/components/knowledge/knowledge-index";
type Props={searchParams:Promise<{preview?:string|string[];category?:string|string[]}>};
export async function generateMetadata({searchParams}:Props):Promise<Metadata>{
 const samples=includesSamples((await searchParams).preview);
 return {title:"Knowledge｜AI COACHING",description:"AIの基礎知識、ビジネス活用、Web・アプリ開発を学ぶヒントをお届けするAI COACHINGのナレッジページ。",alternates:{canonical:`${siteUrl}/knowledge`},robots:samples?{index:false,follow:false}:undefined,openGraph:{title:"Knowledge｜AI COACHING",description:"AIを知る。学ぶ。可能性を広げる。",url:`${siteUrl}/knowledge`,type:"website",locale:"ja_JP"}};
}
export default async function KnowledgePage({searchParams}:Props){const query=await searchParams;const samples=includesSamples(query.preview);const articles=await getArticles(samples);const category=knowledgeCategories.find(item=>item.id===query.category)?.id??"all";return <KnowledgeIndex key={category} initialCategory={category} articles={articles.map(article=>article.metadata)} samples={samples}/>;}
