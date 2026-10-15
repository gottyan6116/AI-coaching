export const learningThemes = [
  {
    id: "basics", label: "AIの基礎・プロンプト", image: "/images/learning/basics.webp", alt: "AIツールの操作画面を表示したノートPC", icon: "chat",
    skills: ["ChatGPTなどのAIツールの基本操作", "効果的なプロンプトの設計", "AIの仕組みと得意・不得意", "情報収集・要約・整理の方法", "AIツールの比較と使い分け", "自分専用のAIカスタム設定", "AIの回答を確認・検証する方法"],
    recommended: ["AIを使ったことがない", "まずは基本から学びたい", "日常や仕事でAIを活用したい"],
    deliverables: ["文章作成用プロンプト集", "情報整理・リサーチ用テンプレート", "自分専用のAIアシスタント設定"],
    summary: "AIの基礎・プロンプト設計", color: "#B7308C", tint: "#fae6f1",
  },
  {
    id: "business", label: "ビジネス活用・資料作成", image: "/images/learning/business.webp", alt: "表計算やグラフを使って資料とデータを分析する画面", icon: "chart",
    skills: ["PowerPoint資料の構成と作成", "Excel・スプレッドシートの効率的な活用", "AIを使ったデータ分析・可視化", "市場調査・競合分析・リサーチ", "企画書・提案書・レポートの作成", "会議議事録・メール・文書作成", "AIによる分析結果の読み解きと検証"],
    recommended: ["日々の事務作業を効率化したい", "資料作成に時間がかかっている", "データ分析や企画業務のスキルを伸ばしたい"],
    deliverables: ["プレゼンテーション資料", "データ分析レポート", "業務で使える資料作成テンプレート"],
    summary: "ビジネス活用・資料作成・分析", color: "#164098", tint: "#e8f1ff",
  },
  {
    id: "automation", label: "業務自動化・カスタマイズ", image: "/images/learning/automation.webp", alt: "AIと外部ツールをつなぐワークフローの設計画面", icon: "settings",
    skills: ["業務自動化の基本的な考え方", "定型業務の洗い出しと自動化設計", "AIのカスタム指示・設定", "自分専用のAIアシスタント構築", "外部ツール・API連携の基礎", "ワークフロー自動化", "自動化の動作確認と改善"],
    recommended: ["同じ作業を繰り返している", "AIを自分の仕事に合わせて設定したい", "業務効率化の仕組みを自分で作りたい"],
    deliverables: ["メール・データ整理フロー", "レポート作成の半自動化", "自分専用のAIアシスタント"],
    summary: "業務自動化・カスタマイズ", color: "#36832e", tint: "#e8f6e2",
  },
  {
    id: "development", label: "Web・アプリ開発", image: "/images/learning/development.webp", alt: "Webサイトとスマートフォンで動くアプリの開発イメージ", icon: "code",
    skills: ["Webサイトの仕組み", "HTML・CSS・JavaScriptの基礎概念", "AIを使ったWebサイト制作", "Webアプリケーション開発の基本", "データベースの役割と基礎", "クラウドサービスの仕組みと使い方", "GitHub・Vercelなどによる公開", "AIを活用した開発・修正・動作確認", "公開後の基本的な運用と改善"],
    recommended: ["自分のWebサイトを作ってみたい", "オリジナルアプリを制作したい", "AIを活用した開発に興味がある"],
    deliverables: ["オリジナルWebサイト", "小規模なWebアプリ", "自分のアイデアを試すMVP"],
    note: "クラウドサービスや外部ツールは、目的と必要性に合わせて選びます。",
    summary: "Web・アプリ開発・クラウド", color: "#b26418", tint: "#fff2df",
  },
] as const;

export const learningOutcomes = [
  { id: "reports", title: "プレゼン資料・分析レポート", description: "PowerPoint・Excel・データ分析などを活用し、ビジネス資料や可視化レポートを制作。", tags: ["資料作成", "データ分析", "リサーチ"], image: "/images/learning/outcome-reports.webp", alt: "グラフや指標をまとめた分析レポートの完成イメージ" },
  { id: "website", title: "オリジナルWebサイト", description: "デザイン・構成・コーディング・公開まで。AIと一緒に自分のWebサイトを制作。", tags: ["Webデザイン", "コーディング", "公開"], image: "/images/learning/outcome-website.webp", alt: "写真と文章を組み合わせたWebサイトの完成イメージ" },
  { id: "app", title: "Webアプリケーション", description: "アイデアから設計・開発・動作確認まで。実際に動く小規模なアプリを制作。", tags: ["アプリ開発", "データベース", "クラウド"], image: "/images/learning/outcome-app.webp", alt: "PCとスマートフォンで利用するWebアプリの完成イメージ" },
  { id: "tools", title: "業務自動化・AIツール", description: "繰り返しの作業を効率化したり、自分専用のAIアシスタントを構築したりする仕組みを制作。", tags: ["自動化", "API連携", "カスタマイズ"], image: "/images/learning/outcome-tools.webp", alt: "業務フローと分析画面を備えたAIツールの完成イメージ" },
] as const;
