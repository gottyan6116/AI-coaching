import { BookOpen, Laptop, PanelsTopLeft, Smartphone } from "lucide-react";
import type { CSSProperties } from "react";
import { roadmapSteps } from "@/lib/hero-content";

const icons = { book: BookOpen, laptop: Laptop, web: PanelsTopLeft, phone: Smartphone };
export function RoadmapCard({ index }: { index: number }) {
  const step = roadmapSteps[index];
  const Icon = icons[step.icon];
  return <li className={`roadmap-card step-${index + 1}`} style={{ "--step-color": step.color, "--step-tint": step.tint } as CSSProperties}>
    <span className="step-icon" aria-hidden="true"><Icon size={28} strokeWidth={1.5} /></span>
    <div className="step-content"><h2>{step.title}</h2><p>{step.lines[0]}<br />{step.lines[1]}</p></div>
    <span className="step-number" aria-hidden="true">0{index + 1}</span>
    <div className="step-progress" aria-hidden="true"><span /></div>
  </li>;
}
export function LearningRoadmap() {
  return <div className="learning-roadmap" aria-label="4ステップの学習ロードマップ">
    <svg className="roadmap-connections" viewBox="0 0 1672 941" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <defs><linearGradient id="roadmap-gradient" x1="615" y1="650" x2="1640" y2="105" gradientUnits="userSpaceOnUse"><stop stopColor="#F39A43"/><stop offset=".33" stopColor="#68C6DF"/><stop offset=".65" stopColor="#C4DD8F"/><stop offset="1" stopColor="#F39A43"/></linearGradient></defs>
      <path className="roadmap-line" d="M 615 650 C 640 600 680 550 740 520 S 904 442 950 367 S 1060 273 1130 283 S 1310 285 1400 220 S 1580 170 1640 105" stroke="url(#roadmap-gradient)" strokeWidth="1.5"/>
      <path d="M 1630 106 L 1640 103 L 1637 114" fill="#F39A43" opacity=".7"/>
      {[{x:679,y:561,c:"#F39A43"},{x:953,y:365,c:"#68C6DF"},{x:1322,y:257,c:"#C4DD8F"}].map(p => <g className="roadmap-dot" key={p.x}><circle cx={p.x} cy={p.y} r="11" fill={p.c} opacity=".15"/><circle cx={p.x} cy={p.y} r="6" fill={p.c} stroke="white" strokeWidth="2"/></g>)}
    </svg>
    <ol>{roadmapSteps.map((_, index) => <RoadmapCard key={index} index={index} />)}</ol>
  </div>;
}
