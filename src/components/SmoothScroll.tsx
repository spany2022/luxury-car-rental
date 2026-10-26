"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, setLenis, NAV_OFFSET, prefersReducedMotion } from "@/lib/motion";

/** Lenis smooth scrolling synced with GSAP's ticker. Disabled for reduced-motion users and touch devices. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      anchors: { offset: NAV_OFFSET },
      allowNestedScroll: true,
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}

/** Fades/lifts every `[data-reveal]` element into view once. */
export function RevealOnScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    gsap.set(items, { autoAlpha: 0, y: 28 });
    const triggers = ScrollTrigger.batch(items, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.09, overwrite: true }),
    });
    return () => {
      triggers.forEach((t) => t.kill());
      gsap.set(items, { clearProps: "all" });
    };
  }, []);

  return null;
}
