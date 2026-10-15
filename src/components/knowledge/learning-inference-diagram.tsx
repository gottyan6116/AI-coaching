import styles from "./learning-inference-diagram.module.css";

export function LearningInferenceDiagram() {
  const lanes = [
    { name: "モデルをつくるとき", label: "学習", steps: [{ title: "例を用意する", text: "入力と正解などのデータ" }, { title: "数値を調整する", text: "結果のずれを手がかりに調整" }, { title: "モデルができる", text: "学習結果を利用できる状態へ" }] },
    { name: "モデルを使うとき", label: "推論", steps: [{ title: "新しい入力", text: "届いたメールや質問" }, { title: "モデルで計算", text: "学習済みの数値を使う" }, { title: "結果を出力", text: "判定・予測・文章など" }] },
  ];
  return <figure className={styles.figure} aria-label="機械学習における学習と推論の流れ" data-article-reveal>
    {lanes.map(lane => <div className={styles.lane} key={lane.label}><div className={styles.label}><span>{lane.name}</span><strong>{lane.label}</strong></div><ol>{lane.steps.map(step => <li key={step.title}><strong>{step.title}</strong><span>{step.text}</span></li>)}</ol></div>)}
    <figcaption>機械学習の流れを簡略化した図です。学習方法や出力の種類は、モデルと目的によって異なります。</figcaption>
  </figure>;
}
