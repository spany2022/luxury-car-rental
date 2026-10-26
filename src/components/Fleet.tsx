"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { fleet, fleetCategories, vehicleName, type FleetCategory, type Vehicle } from "@/content/fleet";
import { pricingNote } from "@/config/site";
import { quickEnquiryUrl } from "@/lib/whatsapp";
import { useBooking } from "./BookingContext";
import { WhatsAppIcon } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;

export function Fleet() {
  const [filter, setFilter] = useState<FleetCategory | "all">("all");
  const [active, setActive] = useState<Vehicle | null>(null);
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => (filter === "all" ? fleet : fleet.filter((v) => v.categories.includes(filter))),
    [filter],
  );

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    const onScroll = () => {
      const card = el.querySelector<HTMLElement>("[data-card]");
      if (!card) return;
      setIndex(Math.min(visible.length - 1, Math.round(el.scrollLeft / (card.offsetWidth + 24))));
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [visible]);

  return (
    <section id="fleet" className="relative overflow-hidden bg-graphite py-24 md:py-36" aria-labelledby="fleet-title">
      <div className="container-lux">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p data-reveal className="eyebrow mb-6 text-gold">The Showroom</p>
            <h2 id="fleet-title" data-reveal className="display text-[clamp(2.6rem,6vw,5.5rem)]">
              <em className="italic text-gold-soft">Exceptional</em> Cars.
              <br />
              Unforgettable Journeys.
            </h2>
          </div>
          <p data-reveal className="max-w-md text-ivory/65 md:justify-self-end md:text-lg md:leading-relaxed">
            Find the right vehicle for your occasion, from elegant wedding arrivals to sophisticated executive travel.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-y border-white/[0.08] py-4 md:flex-row md:items-center md:justify-between">
          <div role="tablist" aria-label="Vehicle categories" className="no-scrollbar -mx-4 flex min-w-0 gap-1 overflow-x-auto px-4 md:mx-0 md:px-0">
            {fleetCategories.map((c) => {
              const selected = filter === c.id;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={selected}
                  aria-controls="fleet-track"
                  onClick={() => setFilter(c.id)}
                  className={`relative shrink-0 px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${
                    selected ? "text-obsidian" : "text-ivory/60 hover:text-ivory"
                  }`}
                >
                  {selected && (
                    <motion.span layoutId="fleet-pill" className="absolute inset-0 -z-0 bg-gold" transition={{ duration: 0.6, ease }} />
                  )}
                  <span className="relative">{c.label}</span>
                </button>
              );
            })}
          </div>
          <div className="hidden shrink-0 items-center gap-5 md:flex">
            <span className="whitespace-nowrap font-serif text-lg tabular-nums text-ivory/70" aria-live="polite">
              <span className="text-gold">{String(index + 1).padStart(2, "0")}</span> / {String(visible.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => step(-1)} aria-label="Previous vehicle" className="grid h-12 w-12 place-items-center border border-white/15 transition-colors hover:border-gold hover:text-gold">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.3} />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next vehicle" className="grid h-12 w-12 place-items-center border border-white/15 transition-colors hover:border-gold hover:text-gold">
              <ArrowRight className="h-4 w-4" strokeWidth={1.3} />
            </button>
          </div>
        </div>
      </div>

      <div
        id="fleet-track"
        ref={track}
        role="tabpanel"
        aria-label="Vehicles"
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth track-pad pb-6"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((v, i) => (
            <motion.div
              key={v.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.06, ease } }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.35 } }}
              data-card
              className="w-[82vw] shrink-0 snap-start sm:w-[58vw] md:w-[42vw] lg:w-[33vw] xl:w-[400px]"
            >
              <VehicleCard vehicle={v} number={i + 1} onDetails={() => setActive(v)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="container-lux mt-6 text-[0.72rem] leading-relaxed text-ivory/45">
        Vehicle photography is representative. Exact model, colour and availability are confirmed when you enquire. {pricingNote}
      </p>

      <VehicleDialog vehicle={active} onClose={() => setActive(null)} />
    </section>
  );
}

function VehicleCard({ vehicle: v, number, onDetails }: { vehicle: Vehicle; number: number; onDetails: () => void }) {
  const frame = useRef<HTMLDivElement>(null);

  // Subtle perspective tilt on fine pointers only
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !frame.current) return;
    const r = frame.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    frame.current.style.transform = `perspective(1100px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
  };
  const onLeave = () => {
    if (frame.current) frame.current.style.transform = "";
  };

  return (
    <article className="group">
      <div
        ref={frame}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        data-cursor="View"
        className="relative aspect-[4/5] overflow-hidden bg-obsidian transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        <Image
          src={v.image}
          alt={v.imageAlt}
          fill
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 45vw, 400px"
          className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          style={{ objectPosition: v.focus }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/10 to-obsidian/50" />
        <span className="absolute left-5 top-5 font-serif text-sm text-ivory/70">{String(number).padStart(2, "0")}</span>
        <span className="absolute right-5 top-5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold">{v.class}</span>
        <button type="button" onClick={onDetails} className="absolute inset-0 z-10" aria-label={`View details for ${vehicleName(v)}`} />
        <div className="pointer-events-none absolute inset-x-5 bottom-5">
          <h3 className="display text-4xl md:text-[2.6rem]">{vehicleName(v)}</h3>
          <p className="mt-2 text-[0.72rem] uppercase tracking-[0.18em] text-ivory/60">{v.suitability.join(" · ")}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-sm text-ivory/55">
          Price <span className="text-ivory/80">on request</span>
        </p>
        <div className="flex items-center gap-5">
          <button type="button" onClick={onDetails} className="link-lux text-ivory/85 hover:text-ivory">
            Details
          </button>
          <a
            href={quickEnquiryUrl({ vehicle: vehicleName(v) })}
            target="_blank"
            rel="noopener noreferrer"
            className="link-lux text-gold"
            aria-label={`Check availability for ${vehicleName(v)} on WhatsApp`}
          >
            <WhatsAppIcon className="h-3.5 w-3.5" /> Availability
          </a>
        </div>
      </div>
    </article>
  );
}

function VehicleDialog({ vehicle, onClose }: { vehicle: Vehicle | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { requestBooking } = useBooking();
  const [shown, setShown] = useState(vehicle);
  const [img, setImg] = useState(0);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (vehicle) {
      setShown(vehicle);
      setImg(0);
      if (!d.open) d.showModal();
    } else if (d.open) d.close();
  }, [vehicle]);

  const v = shown;
  const images = v ? [{ src: v.image, alt: v.imageAlt }, ...(v.gallery ?? [])] : [];
  const spec = v
    ? [
        ["Category", v.class],
        ["Seating", v.seats ? `${v.seats} passengers` : "Confirmed on enquiry"],
        ["Chauffeur", v.chauffeur === undefined ? "Confirmed on enquiry" : v.chauffeur ? "Available" : "Self-drive only"],
        ["Rental durations", v.durations?.join(", ") || "Discussed on enquiry"],
        ["Pricing", v.priceFrom ? `From ${v.priceFrom}` : "Shared on enquiry"],
      ]
    : [];

  return (
    <dialog
      ref={ref}
      data-lenis-prevent
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto max-h-[92svh] w-[min(1100px,94vw)] overflow-hidden bg-graphite p-0 text-ivory backdrop:bg-obsidian/80 backdrop:backdrop-blur-sm"
      aria-labelledby="vehicle-dialog-title"
    >
      {v && (
        <div className="grid max-h-[92svh] overflow-y-auto md:grid-cols-[1.15fr_1fr]">
          <div className="relative">
            <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[560px]">
              <Image key={images[img]?.src} src={images[img].src} alt={images[img].alt} fill sizes="(max-width: 768px) 94vw, 600px" className="object-cover" style={{ objectPosition: img === 0 ? v.focus : undefined }} />
            </div>
            {images.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                {images.map((im, i) => (
                  <button
                    key={im.src}
                    type="button"
                    onClick={() => setImg(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={img === i}
                    className={`relative h-14 w-14 overflow-hidden border transition-colors ${img === i ? "border-gold" : "border-white/20"}`}
                  >
                    <Image src={im.src} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col p-6 md:p-10">
            <div className="flex items-start justify-between gap-4">
              <p className="eyebrow text-gold">{v.class}</p>
              <button type="button" onClick={onClose} aria-label="Close details" className="-mr-2 -mt-2 grid h-10 w-10 place-items-center text-ivory/70 hover:text-gold">
                <X className="h-5 w-5" strokeWidth={1.3} />
              </button>
            </div>
            <h3 id="vehicle-dialog-title" className="display mt-3 text-5xl md:text-6xl">
              {vehicleName(v)}
            </h3>
            <p className="mt-5 leading-relaxed text-ivory/70">{v.line}</p>

            <p className="eyebrow mt-8 text-ivory/50">Ideal for</p>
            <p className="mt-2 font-serif text-xl italic text-gold-soft">{v.suitability.join(" · ")}</p>

            <dl className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08] text-sm">
              {spec.map(([k, val]) => (
                <div key={k} className="flex justify-between gap-6 py-3">
                  <dt className="text-ivory/50">{k}</dt>
                  <dd className="text-right text-ivory/85">{val}</dd>
                </div>
              ))}
            </dl>

            {v.representativeImage && (
              <p className="mt-4 text-xs leading-relaxed text-ivory/40">
                Representative photography — the exact vehicle, colour and model year are confirmed when you enquire.
              </p>
            )}

            <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
              <button
                type="button"
                className="btn btn-gold flex-1"
                onClick={() => {
                  onClose();
                  requestBooking({ vehicle: vehicleName(v) });
                }}
              >
                Enquire for this car
              </button>
              <a href={quickEnquiryUrl({ vehicle: vehicleName(v) })} target="_blank" rel="noopener noreferrer" className="btn btn-ghost flex-1">
                <WhatsAppIcon /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
