export const firstStepHeading = {
  label: "YOUR FIRST STEP",
  title: ["「自分にもできるかな？」", "その不安から、一緒に。"],
  lead: [
    "AIがはじめての方でも、まったく問題ありません。",
    "画面を共有しながら、一緒に操作して学んでいけるので、安心して始められます。",
  ],
};

export const firstSteps = [
  {
    id: "share", number: "01", color: "#B7308C", tint: "#fae6f1",
    title: "画面を共有して学ぶ",
    description: "まずは画面を共有しながら、AIの基本や使い方をやさしく説明します。わからないことはその場で気軽に質問できます。",
    image: "/images/first-step/share.webp",
    alt: "オンラインで講師と画面を共有しながら学ぶノートPC",
  },
  {
    id: "practice", number: "02", color: "#347fe0", tint: "#e8f1ff",
    title: "一緒に操作する",
    description: "実際の画面を見ながら、一緒にAIを操作していきます。つまずきやすいポイントも丁寧にサポートするので、安心して進められます。",
    image: "/images/first-step/practice.webp",
    alt: "ノートPCの画面を指し示しながらAIの操作方法を学ぶ様子",
  },
  {
    id: "create", number: "03", color: "#4b9e31", tint: "#e8f6e2",
    title: "実際につくってみる",
    description: "一緒にアイデアを出しながら、文章・資料・画像など、実際にAIを使ってつくってみます。あなたの目的に合わせて、具体的にサポートします。",
    image: "/images/first-step/create.webp",
    alt: "AIと作成した企画アイデア案を表示するノートPC",
  },
  {
    id: "grow", number: "04", color: "#e9a100", tint: "#fff2cf",
    title: "できたを積み重ねる",
    description: "小さな「できた」を重ねながら、少しずつできることの幅を広げていきます。継続的にサポートするので、AIを仕事や日常に活かせる力が身につきます。",
    image: "/images/first-step/grow.webp",
    alt: "ノートPCでの制作ができて笑顔で喜ぶ女性",
  },
] as const;

export type FirstStep = (typeof firstSteps)[number];
