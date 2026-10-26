"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { places } from "@/content/places";
import { useBooking } from "./BookingContext";

export function Locations() {
  const [active, setActive] = useState(0);
  const { requestBooking } = useBooking();

  return (
    <section id="locations" className="bg-ivory py-24 text-obsidian md:py-36" aria-labelledby="locations-title">
      <div className="container-lux">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p data-reveal className="eyebrow text-gold-ink">Service Areas</p>
            <h2 id="locations-title" data-reveal className="display mt-6 text-[clamp(2.6rem,6.4vw,6rem)]">
              Luxury Rides Across <em className="italic text-gold-ink">Odisha</em>.
            </h2>
          </div>
          <p data-reveal className="max-w-md text-obsidian/65 md:justify-self-end md:text-lg md:leading-relaxed">
            Luxury and wedding car rental in Bhubaneswar, Cuttack and Puri. Travel to other destinations in Odisha can be
            discussed by prior arrangement, subject to confirmation.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-3 lg:h-[640px] lg:flex-row">
          {places.map((p, i) => {
            const open = active === i;
            return (
              <article
                key={p.id}
                id={p.id}
                data-reveal
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocusCapture={() => setActive(i)}
                className={`group relative isolate flex min-h-[520px] flex-col overflow-hidden bg-obsidian text-ivory transition-[flex-grow] duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-h-0 ${
                  open ? "lg:flex-[2.4]" : "lg:flex-[1]"
                }`}
              >
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className={`-z-10 object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "scale-100" : "scale-110"}`}
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian via-obsidian/45 to-obsidian/10" />

                <div className="flex flex-1 flex-col justify-between p-6 md:p-9">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-ivory/80">
                      <MapPin className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} aria-hidden /> Service area
                    </span>
                    <span className="font-serif text-lg text-ivory/60">0{i + 1}</span>
                  </div>

                  <div>
                    <p className="eyebrow text-gold">{p.theme}</p>
                    <h3 className="display mt-3 text-5xl lg:text-[clamp(2.25rem,3.6vw,3.75rem)]">{p.city}</h3>
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[1fr] opacity-100 lg:grid-rows-[0fr] lg:opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="mt-2 text-[0.7rem] uppercase tracking-[0.2em] text-ivory/50">{p.title}</p>
                        <p className="mt-4 max-w-md leading-relaxed text-ivory/75">{p.copy}</p>
                        <p className="mt-4 text-sm text-ivory/60">{p.contexts.join(" · ")}</p>
                        <button
                          type="button"
                          onClick={() => requestBooking({ location: p.city })}
                          className="link-lux mt-6 text-gold"
                        >
                          Enquire for This Location <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
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
