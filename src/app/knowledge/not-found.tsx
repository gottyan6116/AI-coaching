import Link from "next/link";
import styles from "@/components/knowledge/knowledge.module.css";
export default function KnowledgeNotFound(){return <main id="knowledge-main" className={styles.article}><p className={styles.label}>NOT FOUND</p><h1>記事が見つかりませんでした。</h1><p>URLをご確認いただくか、記事一覧からお探しください。</p><Link className={styles.backLink} href="/knowledge">Knowledgeの記事一覧へ</Link></main>;}
