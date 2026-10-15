"use client";

import { ArrowRight } from "lucide-react";
import { MaterialButton } from "../material-button";
import { useKnowledgeConsultation } from "./knowledge-shell";
import styles from "./article-template.module.css";

export function ArticleCTA() {
  const consult = useKnowledgeConsultation();
  return <section className={styles.cta} aria-labelledby="article-next-step" data-article-cta>
    <span className={styles.ctaOrbit} aria-hidden="true" />
    <p className={styles.ctaLabel} data-cta-copy>LEARN WITH US</p><h2 id="article-next-step" data-cta-copy>読んでわかった、その次は。<br/>一緒に「できる」へ。</h2>
    <p className={styles.ctaDescription} data-cta-copy>AIの基礎からビジネス活用、Webサイト・アプリ開発まで。<br/>あなたの目的やレベルに合わせて、マンツーマンで実践的にサポートします。</p>
    <MaterialButton className={styles.ctaButton} tone="pink" onClick={consult}>無料カウンセリングで相談する<ArrowRight size={20} aria-hidden="true" /></MaterialButton>
    <p className={styles.ctaNotice}>現在、無料相談の受付窓口を準備しています。</p>
  </section>;
}
