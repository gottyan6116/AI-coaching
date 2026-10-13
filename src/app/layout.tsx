import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-noto-sans", display: "swap" });
export const metadata: Metadata = {
  title: "AI COACHING｜AIで可能性を広げる",
  description: "AIの基礎から、Webサイト・アプリ開発まで。あなたの目的に合わせて、実践ベースで伴走するAIオンラインコーチング。",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body className={notoSans.variable}>{children}</body></html>;
}
