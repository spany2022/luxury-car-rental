"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/** Desktop-only cursor follower that labels imagery (`data-cursor="…"`). The native cursor stays visible. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!enabled || !ring.current) return;
    const el = ring.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const interactive = (e.target as HTMLElement | null)?.closest("a, button, select, input, textarea, label");
      const next = target?.dataset.cursor ?? "";
      setLabel(next);
      el.dataset.state = next ? "label" : interactive ? "hover" : "idle";
    };
    const leave = () => (el.dataset.state = "hidden");
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ring}
      aria-hidden
      data-state="hidden"
      className="pointer-events-none fixed left-0 top-0 z-[90] -ml-5 -mt-5 grid h-10 w-10 place-items-center rounded-full border border-gold/70 mix-blend-difference transition-[width,height,margin,opacity,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=hidden]:opacity-0 data-[state=hover]:-ml-7 data-[state=hover]:-mt-7 data-[state=hover]:h-14 data-[state=hover]:w-14 data-[state=label]:-ml-11 data-[state=label]:-mt-11 data-[state=label]:h-22 data-[state=label]:w-22 data-[state=label]:border-transparent data-[state=label]:bg-ivory data-[state=label]:mix-blend-normal"
    >
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-obsidian">{label}</span>
    </div>
  );
}
