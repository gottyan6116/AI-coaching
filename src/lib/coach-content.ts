export const coachProfile = {
  label: "MEET YOUR COACH",
  titleParts: ["あなたの可能性に、", "伴走する。"],
  lead: ["教育の経験と、ビジネス・開発の実践経験を活かして。", "あなたの「やってみたい」を、一緒にカタチにします。"],
  // Set a local public image path here when the coach's own photograph is ready.
  photo: { src: null as string | null, alt: "AI COACHINGのコーチ", placeholder: "COACH PHOTO", placeholderLabel: "コーチの写真（準備中）" },
  backgroundLabel: "BACKGROUND & EXPERIENCE",
  experience: [
    { id: "education", years: "4", unit: "年", title: "英語教育業界", description: ["教育・学習支援領域での実務経験。初心者への指導や、学習者の理解度に合わせたサポートの経験を活かします。"], color: "#B7308C" },
    { id: "marketing", prefix: "約", years: "5", unit: "年", title: "マーケティング業界", description: ["マーケティング戦略、データ分析、業務改善など、ビジネスの現場で培った知識と経験を活かします。"], color: "#164098" },
    { id: "development", title: "AI・Web開発の実務経験", description: ["需要予測ツール、企業Webサイト、Webアプリケーションなど、多様なシステム・サービスの開発経験があります。", "AI活用から設計・開発・公開まで、実践的な知識をもとにサポートします。"], color: "#36832e" },
  ],
  introduction: {
    title: "知識を教えるだけでなく、実際に一緒につくる。",
    paragraphs: ["英語教育、マーケティング、そしてAI・Web開発。異なる領域で培ってきた経験を活かし、AIを「知る」だけでなく、「使える」「つくれる」ところまで伴走します。", "AIの基本操作から、仕事への活用、Webサイト・アプリ開発まで。画面を共有しながら一緒に操作し、実際に手を動かすことで、一人ひとりの「できた」を積み重ねていきます。"],
  },
  expertise: [
    { title: "教育・学習支援", description: "初心者の理解度に合わせた指導", icon: "education", color: "#B7308C", tint: "#fae6f1" },
    { title: "マーケティング・分析", description: "戦略立案・データ活用・業務改善", icon: "marketing", color: "#164098", tint: "#e8f1ff" },
    { title: "AI活用・自動化", description: "生成AI・業務効率化・ツール連携", icon: "automation", color: "#36832e", tint: "#e8f6e2" },
    { title: "Web・アプリ開発", description: "Webサイト・アプリ・クラウド活用", icon: "development", color: "#b26418", tint: "#fff2df" },
  ],
} as const;
