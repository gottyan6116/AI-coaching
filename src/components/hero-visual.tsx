import Image from "next/image";
import { heroAssets } from "@/lib/hero-content";

export function FloatingRibbon({ variant, className = "" }: { variant: "warm" | "cool"; className?: string }) {
  return <div className={`floating-ribbon ribbon-${variant} ${className}`} aria-hidden="true"><Image src={variant === "warm" ? heroAssets.warmRibbon : heroAssets.coolRibbon} alt="" width={2172} height={724} sizes="(max-width: 1023px) 220vw, 100vw" loading="eager" /></div>;
}
export function HeroVisual() {
  return <>
    <div className="hero-background" aria-hidden="true" />
    <div className="city-silhouette scene-reveal" aria-hidden="true"><Image src={heroAssets.city} alt="" width={2172} height={724} sizes="(max-width: 1023px) 220vw, 108vw" loading="eager" /></div>
    <FloatingRibbon variant="warm" /><FloatingRibbon variant="cool" />
    <FloatingRibbon variant="cool" className="ribbon-blue-accent" />
    <div className="hero-person scene-reveal"><Image src={heroAssets.woman} alt="ノートパソコンを抱え、未来を見つめる女性" width={1122} height={1402} sizes="(max-width: 1023px) 85vw, 36vw" preload /></div>
    <div className="hero-handwriting scene-reveal"><Image src={heroAssets.handwriting} alt="AIと、なりたい自分へ。" width={1536} height={1024} sizes="17vw" /></div>
    <div className="growth-card scene-reveal"><p>スキルが、<br />未来の選択肢をつくる。</p><div className="growth-bars" aria-hidden="true">{[12,24,39,57,77,100].map(height => <span key={height} style={{ height: `${height}%` }} />)}</div></div>
  </>;
}
