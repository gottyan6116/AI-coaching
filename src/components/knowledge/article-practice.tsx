"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Clipboard } from "lucide-react";
import styles from "./article-template.module.css";

export function PromptLab({ prompt, title = "そのまま試せるプロンプト" }: { prompt: string; title?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [busy, setBusy] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const text = useRef<HTMLPreElement>(null);
  const id = useId();
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);
  const copy = async () => {
    setBusy(true);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(prompt);
      setStatus("copied");
    } catch { setStatus("failed"); }
    finally { setBusy(false); }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setStatus("idle"), 5000);
  };
  const select = () => {
    const selection = window.getSelection();
    if (!text.current || !selection) return;
    const range = document.createRange(); range.selectNodeContents(text.current); selection.removeAllRanges(); selection.addRange(range);
  };
  return <section className={styles.prompt} aria-labelledby={id} data-article-reveal>
    <div className={styles.widgetTop}><p className={styles.widgetLabel}>PROMPT LAB</p><button type="button" onClick={copy} disabled={busy} aria-label="プロンプトをコピー">{status === "copied" ? <Check size={16} aria-hidden="true" /> : <Clipboard size={16} aria-hidden="true" />}{busy ? "コピー中…" : status === "copied" ? "コピーしました" : "コピーする"}</button></div>
    <p id={id} className={styles.widgetTitle}>{title}</p><pre ref={text}>{prompt}</pre>
    <p className={styles.copyStatus} role="status">{status === "copied" ? "コピーしました" : status === "failed" ? <>コピーできませんでした。<button type="button" onClick={select}>テキストを選択</button>して手動でコピーしてください。</> : "内容を自分の目的に合わせて調整してみましょう。"}</p>
  </section>;
}

export function TryItYourself({ items, title = "小さく、ひとつ試してみましょう" }: { items: string[]; title?: string }) {
  const [checked, setChecked] = useState<number[]>([]);
  return <fieldset className={styles.tryIt} data-article-reveal><legend className={styles.widgetLabel}>TRY IT YOURSELF</legend><p className={styles.widgetTitle}>{title}</p><div className={styles.checklist}>{items.map((item, index) => <label key={`${index}-${item}`}><input type="checkbox" checked={checked.includes(index)} onChange={event => setChecked(values => event.target.checked ? [...values, index] : values.filter(value => value !== index))} /><span>{item}</span></label>)}</div><p className={styles.progress} aria-live="polite">{checked.length} / {items.length} 完了</p></fieldset>;
}
