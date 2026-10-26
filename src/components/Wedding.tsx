"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { fleet, vehicleName } from "@/content/fleet";
import { quickEnquiryUrl } from "@/lib/whatsapp";
import { useBooking } from "./BookingContext";
import { WhatsAppIcon } from "./ui";

const moments = [
  ["Bride & groom arrivals", "A composed, elegant arrival at the mandap or venue gate."],
  ["Wedding ceremonies", "Transport between home, temple and venue on the day."],
  ["Reception entrances", "A grand evening entrance for the newly-weds."],
  ["Family & VIP transportation", "Comfortable travel for parents, elders and special guests."],
  ["Wedding-day photography", "A beautiful vehicle for portraits between the rituals."],
];

const gallery = [
  { src: "/images/wedding-roses-car.jpg", alt: "White rose bouquet resting on the seat of a wedding car", cls: "row-span-2" },
  { src: "/images/fleet-audi-white.jpg", alt: "White Audi sedan in soft evening light", cls: "" },
  { src: "/images/shoot-couple-umbrella.jpg", alt: "Smiling couple in wedding attire beside a black Mercedes-Benz, holding a lace parasol", cls: "row-span-2" },
  { src: "/images/wedding-reception.jpg", alt: "Elegant outdoor wedding reception with draped canopy and set tables", cls: "" },
];

export function Wedding() {
  const root = useRef<HTMLElement>(null);
  const { requestBooking } = useBooking();
  const weddingCars = fleet.filter((v) => v.categories.includes("wedding"));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-wed-bg]", { scale: 1.2, yPercent: -8 }, { scale: 1, yPercent: 8, ease: "none", scrollTrigger: { trigger: "[data-wed-hero]", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.from("[data-wed-hero] [data-line]", { yPercent: 110, duration: 1.4, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: "[data-wed-hero]", start: "top 55%" } });
      gsap.utils.toArray<HTMLElement>("[data-wed-tile]").forEach((tile, i) => {
        gsap.fromTo(tile, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, delay: i * 0.08, ease: "expo.inOut", scrollTrigger: { trigger: tile, start: "top 88%" } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="weddings" aria-labelledby="wedding-title">
      <div data-wed-hero className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-obsidian">
        <div data-wed-bg className="absolute inset-0 -z-10">
          <Image
            src="/images/wedding-venue-marigold.jpg"
            alt="Wedding stage decorated with cascading marigold garlands and warm lights"
            fill
            sizes="100vw"
            className="object-cover object-[50%_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/45 to-obsidian/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/75 via-obsidian/30 to-transparent" />
        </div>
        <div className="container-lux pb-20 pt-40 md:pb-28">
          <p className="eyebrow text-gold">The Wedding Collection</p>
          <h2 id="wedding-title" className="display mt-6 max-w-[15ch] text-[clamp(2.8rem,7.4vw,7rem)]">
            <span className="block overflow-hidden pb-[0.08em]"><span data-line className="block">Arrive Like the</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><span data-line className="block"><em className="italic text-gold-soft">Moment</em> Belongs</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><span data-line className="block">to You.</span></span>
          </h2>
        </div>
      </div>

      <div className="bg-ivory py-24 text-obsidian md:py-32">
        <div className="container-lux grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p data-reveal className="max-w-md font-serif text-2xl leading-snug md:text-3xl">
              Your wedding day is a sequence of entrances. We help you choose a vehicle worthy of each one.
            </p>
            <ol className="mt-12 border-t border-obsidian/10">
              {moments.map(([title, copy], i) => (
                <li key={title} data-reveal className="grid grid-cols-[3rem_1fr] gap-2 border-b border-obsidian/10 py-5">
                  <span className="font-serif text-lg text-gold-ink">0{i + 1}</span>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="mt-1 text-sm text-obsidian/60">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div data-reveal className="mt-12">
              <p className="eyebrow text-obsidian/50">Suited for weddings</p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-serif text-2xl">
                {weddingCars.map((v) => (
                  <li key={v.id}>
                    <a href={quickEnquiryUrl({ occasion: "Wedding", vehicle: vehicleName(v) })} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold-ink">
                      {vehicleName(v)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal className="mt-12 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="btn btn-ink" onClick={() => requestBooking({ occasion: "Wedding" })}>
                Reserve Your Wedding Car
              </button>
              <a href={quickEnquiryUrl({ occasion: "Wedding" })} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-ink">
                <WhatsAppIcon /> Ask on WhatsApp
              </a>
            </div>
            <p data-reveal className="mt-6 max-w-md text-xs leading-relaxed text-obsidian/55">
              Specific vehicles, decoration options and your date are subject to availability and are confirmed by our team
              before any booking is final.
            </p>
          </div>

          <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[240px] md:gap-4 lg:col-span-7 lg:auto-rows-[260px]">
            {gallery.map((g) => (
              <figure key={g.src} data-wed-tile className={`relative overflow-hidden ${g.cls}`}>
                <Image src={g.src} alt={g.alt} fill sizes="(max-width: 1024px) 50vw, 30vw" className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
