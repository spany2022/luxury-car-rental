"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { fleet, vehicleName } from "@/content/fleet";
import { shootTypes } from "@/content/places";
import { useBooking } from "./BookingContext";

const frames = [
  { src: "/images/shoot-pre-wedding.jpg", alt: "Couple posing beside a car on a tree-lined road for a pre-wedding shoot", label: "Pre-wedding", span: "md:col-span-7", aspect: "aspect-[4/5] md:aspect-[3/2]" },
  { src: "/images/shoot-couple-formal.jpg", alt: "Black-and-white portrait of a couple in formal wear beside a Mercedes-Benz", label: "Wedding film", span: "md:col-span-5", aspect: "aspect-[4/5] md:aspect-auto md:h-full" },
  { src: "/images/headlight-detail.jpg", alt: "Dramatic close-up of a car headlight in low light", label: "Brand campaign", span: "md:col-span-4", aspect: "aspect-[4/5]" },
  { src: "/images/mercedes-autumn.jpg", alt: "Black luxury sedan on a road covered in autumn leaves", label: "Editorial", span: "md:col-span-4", aspect: "aspect-[4/5]" },
  { src: "/images/interior-mercedes.jpg", alt: "Luxury car cabin with leather steering wheel and illuminated dashboard", label: "Detail & interiors", span: "md:col-span-4", aspect: "aspect-[4/5]" },
];

export function Photoshoot() {
  const root = useRef<HTMLElement>(null);
  const { requestBooking } = useBooking();
  const cars = fleet.filter((v) => v.categories.includes("photoshoot"));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-frame]").forEach((f) => {
        gsap.fromTo(f.querySelector("img"), { yPercent: -6, scale: 1.14 }, { yPercent: 6, scale: 1.04, ease: "none", scrollTrigger: { trigger: f, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from(f, { autoAlpha: 0, y: 60, duration: 1.3, ease: "power3.out", scrollTrigger: { trigger: f, start: "top 90%" } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="photoshoots" className="relative overflow-hidden bg-obsidian py-24 md:py-36" aria-labelledby="shoot-title">
      <div className="container-lux">
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          <div>
            <p data-reveal className="eyebrow flex items-center gap-3 text-gold">
              <Camera className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden /> Photoshoot &amp; Production
            </p>
            <h2 id="shoot-title" data-reveal className="display mt-6 text-[clamp(2.6rem,6.4vw,6rem)]">
              Every Frame Deserves a <em className="italic text-gold-soft">Statement</em>.
            </h2>
          </div>
          <div data-reveal className="md:justify-self-end">
            <p className="max-w-md text-ivory/65 md:text-lg md:leading-relaxed">
              For photographers, filmmakers, agencies, creators and couples planning a pre-wedding shoot — tell us the
              location, date and look you are after, and we will suggest suitable vehicles.
            </p>
            <button type="button" className="btn btn-gold mt-8" onClick={() => requestBooking({ occasion: "Photoshoot" })}>
              Plan Your Photoshoot
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-16 overflow-hidden border-y border-white/[0.08] py-5" aria-hidden>
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap font-serif text-2xl italic text-ivory/50 md:text-3xl">
          {[...shootTypes.filter((s) => s !== "Other"), ...shootTypes.filter((s) => s !== "Other")].map((s, i) => (
            <span key={i} className="flex items-center gap-12">
              {s} <span className="text-gold not-italic">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-lux mt-16 grid gap-4 md:grid-cols-12 md:gap-5">
        {frames.map((f, i) => (
          <figure key={f.src} data-frame data-cursor="Frame" className={`group relative overflow-hidden ${f.span}`}>
            <div className={`relative w-full ${f.aspect}`}>
              <Image src={f.src} alt={f.alt} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
            </div>
            {/* Viewfinder corners */}
            <span className="pointer-events-none absolute inset-4 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
              <span className="absolute left-0 top-0 h-6 w-6 border-l border-t border-ivory/80" />
              <span className="absolute right-0 top-0 h-6 w-6 border-r border-t border-ivory/80" />
              <span className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-ivory/80" />
              <span className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-ivory/80" />
            </span>
            <figcaption className="absolute bottom-5 left-5 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.28em] text-ivory/85">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Frame {String(i + 1).padStart(2, "0")} — {f.label}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="container-lux mt-16 grid gap-8 border-t border-white/[0.08] pt-10 md:grid-cols-3">
        <div data-reveal>
          <p className="eyebrow text-ivory/50">Camera-ready vehicles</p>
          <p className="mt-3 font-serif text-2xl">{cars.map(vehicleName).join(" · ")}</p>
        </div>
        <div data-reveal>
          <p className="eyebrow text-ivory/50">Tell us about</p>
          <p className="mt-3 text-ivory/70">Shoot type, location, date, duration, how many vehicles you need and any production requirements.</p>
        </div>
        <div data-reveal>
          <p className="eyebrow text-ivory/50">Please note</p>
          <p className="mt-3 text-ivory/70">Shoot durations, multiple-vehicle requests and location access are confirmed by our team on enquiry.</p>
        </div>
      </div>
    </section>
  );
}
