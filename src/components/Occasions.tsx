"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import type { Occasion } from "@/content/places";
import { useBooking } from "./BookingContext";

const items: {
  title: string;
  kicker: string;
  copy: string;
  cta: string;
  occasion: Occasion;
  image: string;
  alt: string;
  focus?: string;
}[] = [
  {
    kicker: "Wedding Arrivals",
    title: "The entrance they will remember",
    copy: "Make your entrance unforgettable with a premium vehicle for your special day.",
    cta: "Explore Wedding Cars",
    occasion: "Wedding",
    image: "/images/wedding-bride-car.jpg",
    alt: "Smiling bride in a white gown seated in the back of a luxury car",
    focus: "60% 50%",
  },
  {
    kicker: "Pre-Wedding & Professional Photoshoots",
    title: "A co-star with presence",
    copy: "Bring elegance, character, and cinematic appeal to your next photoshoot.",
    cta: "Book a Photoshoot Car",
    occasion: "Photoshoot",
    image: "/images/shoot-pre-wedding.jpg",
    alt: "Couple posing on the bonnet of a car on a tree-lined road for a pre-wedding shoot",
    focus: "55% 50%",
  },
  {
    kicker: "Corporate & Executive Travel",
    title: "Business, beautifully handled",
    copy: "Professional transportation for business meetings, VIP guests, and executive journeys.",
    cta: "Arrange Corporate Travel",
    occasion: "Corporate",
    image: "/images/corporate-audi.jpg",
    alt: "Black Audi parked outside a modern office building in late-afternoon sun",
    focus: "50% 55%",
  },
  {
    kicker: "Special Occasions & Personal Journeys",
    title: "For the days worth celebrating",
    copy: "Elevate anniversaries, celebrations, private events, and memorable journeys.",
    cta: "Plan Your Ride",
    occasion: "Other",
    image: "/images/wedding-champagne.jpg",
    alt: "Champagne poured into a glass beside a black luxury car",
  },
];

export function Occasions() {
  const root = useRef<HTMLElement>(null);
  const { requestBooking } = useBooking();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-occasion]").forEach((row) => {
        const mask = row.querySelector("[data-mask]");
        const img = row.querySelector("[data-parallax]");
        gsap.fromTo(
          mask,
          { clipPath: "inset(18% 12% 18% 12%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: row, start: "top 90%", end: "top 25%", scrub: 0.6 } },
        );
        gsap.fromTo(img, { yPercent: -10, scale: 1.18 }, { yPercent: 10, scale: 1.05, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from(row.querySelectorAll("[data-occ-text]"), {
          autoAlpha: 0,
          y: 40,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 70%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="occasions" className="bg-ivory py-24 text-obsidian md:py-36" aria-labelledby="occasions-title">
      <div className="container-lux">
        <div className="mx-auto max-w-4xl text-center">
          <p data-reveal className="eyebrow text-gold-ink">The Occasion Experience</p>
          <h2 id="occasions-title" data-reveal className="display mt-6 text-[clamp(2.6rem,6.4vw,6rem)]">
            One Fleet. <em className="italic text-gold-ink">Extraordinary</em> Occasions.
          </h2>
          <div data-reveal className="hairline mx-auto mt-10 w-40" />
        </div>

        <div className="mt-20 space-y-24 md:mt-28 md:space-y-40">
          {items.map((it, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={it.kicker} data-occasion className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
                <div className={`md:col-span-7 ${flip ? "md:order-2" : ""}`}>
                  <div data-mask data-cursor="Enquire" className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4]">
                    <div data-parallax className="absolute inset-0">
                      <Image src={it.image} alt={it.alt} fill sizes="(max-width: 768px) 100vw, 58vw" className="object-cover" style={{ objectPosition: it.focus }} />
                    </div>
                  </div>
                </div>
                <div className={`md:col-span-5 ${flip ? "md:order-1 md:pr-6" : "md:pl-6"}`}>
                  <p data-occ-text className="font-serif text-7xl font-light text-gold-ink/40 md:text-8xl">0{i + 1}</p>
                  <p data-occ-text className="eyebrow mt-4 text-gold-ink">{it.kicker}</p>
                  <h3 data-occ-text className="display mt-4 text-4xl md:text-5xl">{it.title}</h3>
                  <p data-occ-text className="mt-6 max-w-md text-lg leading-relaxed text-obsidian/70">{it.copy}</p>
                  <div data-occ-text className="mt-9">
                    <button type="button" className="btn btn-ink" onClick={() => requestBooking({ occasion: it.occasion })}>
                      {it.cta} <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
