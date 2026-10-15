export const possibilitiesHeading = {
  label: "DISCOVER THE POSSIBILITIES",
  title: "AIで、こんなことまで。",
  subtitle: "まだ知らない可能性が、きっとある。",
  lead: "仕事も、学びも、ものづくりも。AIがあなたのできることを広げます。",
};

export const possibilities = [
  {
    id: "documents", number: "01", accentColor: "#B7308C", tint: "#fae6f1",
    title: "面倒な資料作成をもっと簡単に",
    subtitle: "文章の下書きや資料の構成案をAIと作成",
    description: "企画書やレポート、プレゼン資料のたたき台をAIが素早く作成。文章の整理やデザインのアイデア出しで、資料づくりにかかる時間を大幅に減らせます。",
    image: "/images/possibilities/documents.webp",
    alt: "グラフやレポートを表示したノートPCと、ノートやコーヒーのある明るいデスク",
  },
  {
    id: "website", number: "02", accentColor: "#347fe0", tint: "#e8f1ff",
    title: "自分のWebサイトを作る",
    subtitle: "アイデアを形にするWeb制作",
    description: "AIと一緒に、デザイン・文章・構成を考えながら、オリジナルのWebサイトを作成できます。専門知識がなくても、あなたの想いをカタチにできます。",
    image: "/images/possibilities/website.webp",
    alt: "Webサイトのデザインを選びながらノートPCを操作する様子",
  },
  {
    id: "app", number: "03", accentColor: "#4b9e31", tint: "#e8f6e2",
    title: "アプリ開発をもっと身近に",
    subtitle: "アイデアをアプリでカタチに",
    description: "AIのサポートで、アプリの企画・設計・コード生成までスムーズに。プログラミングが初めてでも、アイデアを形にする楽しさを体験できます。",
    image: "/images/possibilities/app.webp",
    alt: "緑を基調としたタスク管理アプリを表示したスマートフォンを持つ手",
  },
  {
    id: "automation", number: "04", accentColor: "#e9a100", tint: "#fff2cf",
    title: "くり返す作業を自動化する",
    subtitle: "日々の仕事をもっとスマートに",
    description: "メール対応やデータ整理、レポート作成など、くり返しの作業をAIで自動化。大切なことに集中できる、ゆとりのある時間をつくれます。",
    image: "/images/possibilities/automation.webp",
    alt: "業務自動化のフローをノートPCの画面で組み立てるイメージ",
  },
] as const;

export type Possibility = (typeof possibilities)[number];
