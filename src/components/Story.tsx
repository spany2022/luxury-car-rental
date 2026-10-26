"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/motion";

const scenes = [
  {
    chapter: "Out of the dark",
    line: "Every arrival begins with a moment of anticipation.",
    image: "/images/grille-dark.jpg",
    alt: "Front grille and headlights of a dark car emerging from shadow",
    reveal: "fade",
  },
  {
    chapter: "Light finds the form",
    line: "A silhouette drawn in reflections, polished and poised.",
    image: "/images/mercedes-autumn.jpg",
    alt: "Black luxury sedan on an autumn road, light tracing its bodywork",
    reveal: "circle",
  },
  {
    chapter: "The gaze",
    line: "Closer now — the signature of light that announces you.",
    image: "/images/headlight-bmw.jpg",
    alt: "Close-up of glowing luxury car headlights at night",
    reveal: "up",
  },
  {
    chapter: "A private sanctuary",
    line: "Hand-finished leather, quiet comfort, a moment to breathe.",
    image: "/images/interior-mercedes.jpg",
    alt: "Luxury car interior with leather steering wheel and illuminated dashboard",
    reveal: "side",
  },
  {
    chapter: "The wedding",
    line: "White roses on the seat. The day you have waited for.",
    image: "/images/wedding-roses-car.jpg",
    alt: "Bouquet of white roses resting inside a luxury wedding car",
    reveal: "up",
  },
  {
    chapter: "The frame",
    line: "Every angle composed, every frame a statement.",
    image: "/images/shoot-couple-formal.jpg",
    alt: "Black-and-white portrait of a couple in formal wear beside a Mercedes-Benz",
    reveal: "circle",
  },
  {
    chapter: "The arrival",
    line: "And then, the destination — exactly on cue.",
    image: "/images/hero-mercedes-dusk.jpg",
    alt: "Black Mercedes-Benz arriving with headlights on along a rain-wet drive at dusk",
    reveal: "side",
  },
] as const;

const hidden: Record<string, string> = {
  fade: "inset(0% 0% 0% 0%)",
  circle: "circle(0% at 50% 50%)",
  up: "inset(100% 0% 0% 0%)",
  side: "inset(0% 0% 0% 100%)",
};
const shown: Record<string, string> = {
  fade: "inset(0% 0% 0% 0%)",
  circle: "circle(75% at 50% 50%)",
  up: "inset(0% 0% 0% 0%)",
  side: "inset(0% 0% 0% 0%)",
};

/** Pinned, scroll-scrubbed campaign sequence. Falls back to a static editorial list for reduced motion. */
export function Story() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)" },
      (ctx) => {
        const { mobile } = ctx.conditions as { mobile: boolean };
        const el = root.current!;
        el.dataset.animated = "true";
        const layers = gsap.utils.toArray<HTMLElement>("[data-scene]", el);
        const captions = gsap.utils.toArray<HTMLElement>("[data-caption]", el);
        const ticks = gsap.utils.toArray<HTMLElement>("[data-tick]", el);
        const counter = el.querySelector<HTMLElement>("[data-counter]");

        layers.forEach((layer, i) => {
          const type = scenes[i].reveal;
          gsap.set(layer, { clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : hidden[type] });
        });
        gsap.set(captions, { autoAlpha: 0, y: 40 });
        gsap.set(captions[0], { autoAlpha: 1, y: 0 });
        gsap.set(layers[0].querySelector("img"), { filter: "brightness(0)", scale: 1.25 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el.querySelector("[data-stage]"),
            start: "top top",
            end: () => `+=${window.innerHeight * (mobile ? 0.8 : 1.1) * scenes.length}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(scenes.length - 1, Math.floor((self.animation?.time() ?? 0) + 0.35));
              if (counter) counter.textContent = String(idx + 1).padStart(2, "0");
              ticks.forEach((t, i) => (t.style.backgroundColor = i <= idx ? "var(--color-gold)" : ""));
            },
          },
        });

        // Scene 1: light slowly reveals the car from total darkness
        tl.to(layers[0].querySelector("img"), { filter: "brightness(1)", scale: 1.05, duration: 1 });

        for (let i = 1; i < scenes.length; i++) {
          const img = layers[i].querySelector("img");
          const at = i;
          tl.to(layers[i], { clipPath: shown[scenes[i].reveal], duration: 0.7, ease: "power2.inOut" }, at)
            .fromTo(img, { scale: 1.35 }, { scale: 1.05, duration: 1.2 }, at)
            .to(layers[i - 1].querySelector("img"), { scale: "+=0.08", filter: "brightness(0.5)", duration: 0.7 }, at)
            .to(captions[i - 1], { autoAlpha: 0, y: -40, duration: 0.3 }, at)
            .to(captions[i], { autoAlpha: 1, y: 0, duration: 0.35 }, at + 0.35);
        }
        tl.to({}, { duration: 0.4 });

        return () => {
          delete el.dataset.animated;
        };
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="story" className="group/story relative bg-obsidian" aria-labelledby="story-title">
      <div data-stage className="relative group-data-[animated=true]/story:h-[100svh] group-data-[animated=true]/story:overflow-hidden">
        {/* Animated stage (hidden in reduced-motion via the list below taking over) */}
        <div className="absolute inset-0 hidden group-data-[animated=true]/story:block">
          {scenes.map((s, i) => (
            <div key={s.chapter} data-scene className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
              <Image src={s.image} alt={s.alt} fill sizes="100vw" className="object-cover" loading={i < 2 ? "eager" : "lazy"} />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-obsidian/50" />
            </div>
          ))}
          <div className="grain pointer-events-none absolute inset-0 z-20" />

          <div className="container-lux pointer-events-none relative z-30 flex h-full flex-col justify-between pb-14 pt-28">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow text-gold">The Journey</p>
                <h2 id="story-title" className="display mt-4 max-w-[16ch] text-[clamp(2rem,4.2vw,3.75rem)]">
                  From the First Glance to the <em className="italic text-gold-soft">Perfect Arrival</em>.
                </h2>
              </div>
              <p className="hidden font-serif text-2xl tabular-nums text-ivory/70 md:block">
                <span data-counter className="text-gold">01</span> / {String(scenes.length).padStart(2, "0")}
              </p>
            </div>

            <div className="relative min-h-[9rem]">
              {scenes.map((s, i) => (
                <div key={s.chapter} data-caption className="absolute inset-x-0 bottom-0">
                  <p className="eyebrow text-ivory/60">
                    Chapter {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="display mt-3 text-[clamp(2.4rem,6vw,5.5rem)] italic">{s.chapter}</p>
                  <p className="mt-3 max-w-md text-ivory/75 md:text-lg">{s.line}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2" aria-hidden>
              {scenes.map((s) => (
                <span key={s.chapter} data-tick className="h-px flex-1 bg-white/20 transition-colors duration-500" />
              ))}
            </div>
          </div>
        </div>

        {/* Static fallback for reduced motion */}
        <div className="group-data-[animated=true]/story:hidden">
          <div className="container-lux py-24">
            <p className="eyebrow text-gold">The Journey</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,5vw,4rem)]">
              From the First Glance to the <em className="italic text-gold-soft">Perfect Arrival</em>.
            </h2>
            <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {scenes.map((s, i) => (
                <li key={s.chapter}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={s.image} alt={s.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <p className="eyebrow mt-5 text-ivory/50">Chapter {String(i + 1).padStart(2, "0")}</p>
                  <p className="display mt-2 text-3xl italic">{s.chapter}</p>
                  <p className="mt-2 text-ivory/70">{s.line}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
