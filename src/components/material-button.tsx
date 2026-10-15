"use client";

import { useEffect, useRef, useState, type ComponentProps, type CSSProperties } from "react";
import styles from "./material-button.module.css";

type Props = ComponentProps<"button"> & { tone?: "dark" | "pink" | "light" };

/** Native button semantics with a tactile state layer and an origin-aware ink ripple. */
export function MaterialButton({ children, className = "", tone = "dark", type = "button", onPointerDown, onPointerCancel, onKeyDown, onClick, ...props }: Props) {
  const sequence = useRef(0);
  const [ripple, setRipple] = useState<{ id: number; x: number; y: number; size: number } | null>(null);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clearInk = () => { if (motion.matches) setRipple(null); };
    motion.addEventListener("change", clearInk);
    return () => motion.removeEventListener("change", clearInk);
  }, []);
  const ink = (button: HTMLButtonElement, x?: number, y?: number) => {
    if (button.disabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = button.getBoundingClientRect();
    const localX = x === undefined ? rect.width / 2 : x - rect.left;
    const localY = y === undefined ? rect.height / 2 : y - rect.top;
    const size = Math.hypot(Math.max(localX, rect.width - localX), Math.max(localY, rect.height - localY)) * 2;
    setRipple({ id: ++sequence.current, x: localX, y: localY, size });
  };
  return <button {...props} type={type} className={`${className} ${styles.button}`} data-material-cta data-tone={tone}
    onPointerDown={event => { onPointerDown?.(event); if (!event.defaultPrevented && event.isPrimary && event.button === 0) ink(event.currentTarget, event.clientX, event.clientY); }}
    onPointerCancel={event => { setRipple(null); onPointerCancel?.(event); }}
    onKeyDown={event => { onKeyDown?.(event); if (!event.defaultPrevented && !event.repeat && (event.key === "Enter" || event.key === " ")) ink(event.currentTarget); }}
    onClick={event => { if (event.detail === 0 && !ripple) ink(event.currentTarget); onClick?.(event); }}>
    <span className={styles.content}>{children}</span>
    {ripple && <span key={ripple.id} aria-hidden="true" className={styles.ripple} style={{ "--ink-x": `${ripple.x}px`, "--ink-y": `${ripple.y}px`, "--ink-size": `${ripple.size}px` } as CSSProperties} onAnimationEnd={() => setRipple(current => current?.id === ripple.id ? null : current)} />}
  </button>;
}
