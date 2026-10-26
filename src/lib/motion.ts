"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

let lenis: Lenis | null = null;
export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const NAV_OFFSET = -72;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}
