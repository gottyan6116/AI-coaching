export const heroAssets = {
  woman: "/images/hero/woman.webp",
  warmRibbon: "/images/hero/ribbon-warm.webp",
  coolRibbon: "/images/hero/ribbon-cool.webp",
  city: "/images/hero/city.webp",
  handwriting: "/images/hero/handwriting.webp",
} as const;

export const roadmapSteps = [
  { title: "基礎", lines: ["AIの仕組みと", "使い方を学ぶ"], icon: "book", color: "#F39A43", tint: "#fff0e5" },
  { title: "業務活用", lines: ["仕事を効率化し", "生産性を高める"], icon: "laptop", color: "#68C6DF", tint: "#e4f7ff" },
  { title: "Web制作", lines: ["AIを活用して", "Webサイトをつくる"], icon: "web", color: "#B7308C", tint: "#ffe8f5" },
  { title: "アプリ開発", lines: ["アイデアを形に", "アプリをつくる"], icon: "phone", color: "#C4DD8F", tint: "#f2fbe4" },
] as const;

export type InformationTopic = "consultation" | "courses" | "pricing" | "articles";
export const informationTitles: Record<InformationTopic, string> = {
  consultation: "無料相談について",
  courses: "コース内容",
  pricing: "料金について",
  articles: "お役立ち記事",
};
