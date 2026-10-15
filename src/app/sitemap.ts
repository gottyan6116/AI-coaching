import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/knowledge";
import { siteUrl } from "@/lib/knowledge-types";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const articles=await getArticles();
 return [{url:siteUrl},{url:`${siteUrl}/knowledge`},...articles.map(({metadata})=>({url:`${siteUrl}/knowledge/${metadata.slug}`,lastModified:new Date(metadata.updatedAt)}))];
}
