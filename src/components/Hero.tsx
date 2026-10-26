"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { useBooking } from "./BookingContext";
import { SplitLines } from "./ui";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { requestBooking } = useBooking();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo("[data-hero-img]", { scale: 1.22, filter: "brightness(0.15)" }, { scale: 1.06, filter: "brightness(1)", duration: 3.2, ease: "power2.out" })
        .fromTo("[data-hero-glow]", { opacity: 0 }, { opacity: 1, duration: 1.6, ease: "power2.inOut" }, 0.6)
        .from("[data-line]", { yPercent: 110, duration: 1.5, stagger: 0.12 }, 0.5)
        .from("[data-hero-fade]", { autoAlpha: 0, y: 18, duration: 1.2, stagger: 0.1 }, 1.0);

      // Slow push-in as the visitor scrolls away
      gsap.to("[data-hero-media]", {
        yPercent: 14,
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-copy]", {
        yPercent: -18,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="top" className="grain relative isolate flex min-h-[max(640px,100svh)] flex-col overflow-hidden bg-obsidian" aria-label="Introduction">
      <div data-hero-media className="absolute inset-0 -z-10 overflow-hidden will-change-transform md:left-[30%]">
        <Image
          data-hero-img
          src="/images/hero-mercedes-dusk.jpg"
          alt="Black Mercedes-Benz with headlights on, parked on a rain-wet road at dusk"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-[50%_60%] md:object-[45%_62%]"
        />
        {/* Warm headlight bloom + editorial shading */}
        <div data-hero-glow className="absolute inset-0 bg-[radial-gradient(ellipse_45%_20%_at_38%_64%,rgba(255,226,170,0.22),transparent_70%)] mix-blend-screen" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-obsidian via-obsidian/10 via-35% to-transparent md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/30 md:via-transparent md:to-obsidian/40" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-light-sweep" />
      </div>

      <div data-hero-copy className="container-lux flex flex-1 flex-col justify-end pb-28 pt-32 md:justify-center md:pb-28">
        <p data-hero-fade className="eyebrow mb-6 flex items-center gap-3 text-gold">
          <span className="h-px w-10 bg-gold" /> Driven by Elegance
        </p>

        <h1 className="display max-w-[14ch] text-[length:clamp(3rem,min(8.4vw,12.5svh),7.75rem)] text-ivory">
          <SplitLines
            lines={[
              <>Make Every</>,
              <>
                <em className="font-light italic text-gold-soft">Arrival</em>
              </>,
              <>Extraordinary.</>,
            ]}
          />
        </h1>

        <p data-hero-fade className="mt-7 max-w-md text-[0.98rem] leading-relaxed text-ivory/75 md:text-lg">
          Discover premium luxury cars for weddings, photoshoots, corporate journeys, and life&apos;s most memorable
          occasions across Odisha.
        </p>

        <div data-hero-fade className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="#fleet" className="btn btn-gold">
            Explore Our Fleet
          </a>
          <button type="button" className="btn btn-ghost" onClick={() => requestBooking()}>
            Book Your Luxury Ride
          </button>
        </div>

        <p data-hero-fade className="mt-8 flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.24em] text-silver">
          <MapPin className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} aria-hidden />
          Bhubaneswar <span className="text-gold">·</span> Cuttack <span className="text-gold">·</span> Puri
        </p>
      </div>

      {/* Service strip + scroll cue */}
      <div data-hero-fade className="absolute inset-x-0 bottom-0 border-t border-white/[0.08]">
        <div className="container-lux flex h-16 items-center justify-between gap-6 text-[0.65rem] uppercase tracking-[0.28em] text-ivory/60">
          <p className="truncate">
            Wedding Arrivals <span className="mx-2 text-gold">·</span> Photoshoot Experiences{" "}
            <span className="mx-2 hidden text-gold sm:inline">·</span>
            <span className="hidden sm:inline">Corporate Travel</span>
          </p>
          <a href="#fleet" className="hidden items-center gap-4 md:flex" aria-label="Scroll to the fleet">
            Scroll
            <span className="relative block h-10 w-px overflow-hidden bg-white/15">
              <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/3 bg-gold" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
