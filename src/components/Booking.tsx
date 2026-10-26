"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Phone, RotateCcw } from "lucide-react";
import { fleet, vehicleName } from "@/content/fleet";
import { durations, occasions, places, shootTypes, type Occasion } from "@/content/places";
import { pricingNote, site } from "@/config/site";
import { buildEnquiryMessage, formatDate, normalisePhone, whatsappUrl, type EnquiryDetails } from "@/lib/whatsapp";
import { useBooking } from "./BookingContext";
import { WhatsAppIcon } from "./ui";

type Form = {
  name: string;
  phone: string;
  occasion: Occasion | "";
  vehicle: string;
  date: string;
  pickup: string;
  destination: string;
  duration: string;
  notes: string;
  decoration: string;
  shootType: string;
  vehicleCount: string;
  production: string;
  company: string;
};

const empty: Form = {
  name: "",
  phone: "",
  occasion: "",
  vehicle: "",
  date: "",
  pickup: "",
  destination: "",
  duration: "",
  notes: "",
  decoration: "",
  shootType: "",
  vehicleCount: "",
  production: "",
  company: "",
};

type Errors = Partial<Record<keyof Form, string>>;

const STORAGE_KEY = "wcl-enquiry";
const OTHER_PICKUP = "Elsewhere in Odisha (details below)";
const vehicleOptions = [
  "No preference — please suggest",
  ...fleet.map(vehicleName),
  "Any luxury sedan",
  "Any premium SUV",
];

const destinationLabel: Record<Occasion, string> = {
  Wedding: "Wedding venue / destination",
  Photoshoot: "Shoot location",
  Corporate: "Destination / meeting venue",
  Other: "Destination",
};

const ease = [0.22, 1, 0.36, 1] as const;

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function Booking() {
  const { prefill } = useBooking();
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<{ url: string; details: EnquiryDetails } | null>(null);
  const [minDate, setMinDate] = useState<string>();
  const [shake, setShake] = useState(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  // Restore an unsent draft (per-visitor convenience only)
  useEffect(() => {
    setMinDate(todayISO());
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setForm({ ...empty, ...JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {}
  }, [form]);

  // Pre-select details chosen elsewhere on the page
  useEffect(() => {
    if (!prefill) return;
    setSent(null);
    setErrors({});
    setForm((f) => ({
      ...f,
      ...(prefill.occasion ? { occasion: prefill.occasion } : {}),
      ...(prefill.vehicle ? { vehicle: prefill.vehicle } : {}),
      ...(prefill.location ? { pickup: prefill.location } : {}),
    }));
    const t = setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 1300);
    return () => clearTimeout(t);
  }, [prefill]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.occasion) e.occasion = "Choose the occasion.";
    if (form.name.trim().length < 2) e.name = "Please tell us your name.";
    if (!normalisePhone(form.phone)) e.phone = "Enter a valid 10-digit mobile number (or include your country code).";
    if (!form.date) e.date = "Choose your date.";
    else if (minDate && form.date < minDate) e.date = "Please choose today or a future date.";
    if (!form.pickup) e.pickup = "Choose a pickup location.";
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      setShake((s) => s + 1);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const occ = form.occasion as Occasion;
    const extra: [string, string][] =
      occ === "Wedding"
        ? [["Decoration requirements", form.decoration]]
        : occ === "Photoshoot"
          ? [
              ["Shoot type", form.shootType],
              ["Vehicles needed", form.vehicleCount],
              ["Production requirements", form.production],
            ]
          : occ === "Corporate"
            ? [["Company / organisation", form.company]]
            : [];

    const details: EnquiryDetails = {
      name: form.name,
      phone: normalisePhone(form.phone)!,
      occasion: occ,
      vehicle: form.vehicle,
      date: form.date,
      pickup: form.pickup,
      destination: form.destination,
      destinationLabel: destinationLabel[occ],
      duration: form.duration,
      extra,
      notes: form.notes,
    };
    const url = whatsappUrl(buildEnquiryMessage(details));
    setSent({ url, details });
    // "noopener" in the features string makes window.open return null, so detach the opener manually.
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
  };

  const err = (k: keyof Form) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${uid}-${k}-err` } : {};

  const ErrorText = ({ k }: { k: keyof Form }) => (
    <AnimatePresence>
      {errors[k] && (
        <motion.p
          id={`${uid}-${k}-err`}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 text-xs text-[#9b2c2c]"
        >
          {errors[k]}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <section id="book" className="relative bg-ivory py-24 text-obsidian md:py-36" aria-labelledby="book-title">
      <div className="container-lux grid gap-16 lg:grid-cols-12 lg:gap-20">
        {/* Left — context and trust */}
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow text-gold-ink">Booking Enquiry</p>
          <h2 id="book-title" data-reveal className="display mt-6 text-[clamp(2.6rem,5.6vw,5.25rem)]">
            Your Next <em className="italic text-gold-ink">Journey</em> Starts Here.
          </h2>
          <p data-reveal className="mt-6 max-w-md text-lg leading-relaxed text-obsidian/70">
            Tell us about your occasion, preferred vehicle, date, and destination. We&apos;ll help you enquire about the
            right luxury ride.
          </p>

          <ol className="mt-12 space-y-0 border-t border-obsidian/10">
            {[
              ["Share your details", "Fill in the form — it takes about a minute."],
              ["Continue on WhatsApp", "Your enquiry opens in WhatsApp, ready to send to our team."],
              ["We confirm with you", "We reply with availability, pricing and booking terms. Your booking is confirmed only then."],
            ].map(([t, c], i) => (
              <li key={t} data-reveal className="grid grid-cols-[3rem_1fr] border-b border-obsidian/10 py-5">
                <span className="font-serif text-xl text-gold-ink">{i + 1}.</span>
                <div>
                  <p className="font-medium">{t}</p>
                  <p className="mt-1 text-sm text-obsidian/60">{c}</p>
                </div>
              </li>
            ))}
          </ol>

          <p data-reveal className="mt-8 max-w-md text-sm leading-relaxed text-obsidian/55">{pricingNote}</p>

          {(site.phone || site.whatsappNumber) && (
            <div data-reveal className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {site.phone && (
                <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="link-lux text-obsidian">
                  <Phone className="h-3.5 w-3.5" strokeWidth={1.5} /> {site.phone}
                </a>
              )}
              {site.whatsappNumber && (
                <a href={whatsappUrl(buildEnquiryMessage({}))} target="_blank" rel="noopener noreferrer" className="link-lux text-obsidian">
                  <WhatsAppIcon className="h-3.5 w-3.5" /> Chat directly
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right — form */}
        <div className="lg:col-span-7">
          <div className="relative border border-obsidian/10 bg-white/60 p-6 shadow-[0_40px_80px_-40px_rgba(11,11,13,0.25)] md:p-12">
            <span className="absolute inset-x-0 top-0 h-[2px] bg-gold" aria-hidden />
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <Confirmation key="sent" sent={sent} onEdit={() => setSent(null)} />
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  noValidate
                  onSubmit={onSubmit}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.6, ease }}
                  aria-describedby={`${uid}-note`}
                >
                  <fieldset>
                    <legend className="field-label">Occasion *</legend>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" {...err("occasion")}>
                      {occasions.map((o) => (
                        <label
                          key={o}
                          className={`relative flex min-h-12 cursor-pointer items-center justify-center border px-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-ink ${
                            form.occasion === o ? "border-obsidian bg-obsidian text-ivory" : "border-obsidian/20 hover:border-obsidian/50"
                          }`}
                        >
                          <input type="radio" name="occasion" value={o} checked={form.occasion === o} onChange={() => set("occasion", o)} className="sr-only" />
                          {o}
                        </label>
                      ))}
                    </div>
                    <ErrorText k="occasion" />
                  </fieldset>

                  <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`${uid}-name`} className="field-label">Name *</label>
                      <input ref={nameRef} id={`${uid}-name`} name="name" className="field" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" {...err("name")} />
                      <ErrorText k="name" />
                    </div>
                    <div>
                      <label htmlFor={`${uid}-phone`} className="field-label">Mobile number *</label>
                      <input
                        id={`${uid}-phone`}
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        className="field"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        onBlur={() => {
                          const n = normalisePhone(form.phone);
                          if (n) set("phone", n);
                        }}
                        placeholder="10-digit mobile number"
                        {...err("phone")}
                      />
                      <ErrorText k="phone" />
                    </div>
                    <div>
                      <label htmlFor={`${uid}-vehicle`} className="field-label">Preferred vehicle</label>
                      <select id={`${uid}-vehicle`} name="vehicle" className="field" value={form.vehicle} onChange={(e) => set("vehicle", e.target.value)}>
                        <option value="">Select a vehicle or category</option>
                        {vehicleOptions.map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`${uid}-date`} className="field-label">Date *</label>
                      <input id={`${uid}-date`} name="date" type="date" min={minDate} className="field" value={form.date} onChange={(e) => set("date", e.target.value)} {...err("date")} />
                      <ErrorText k="date" />
                    </div>
                    <div>
                      <label htmlFor={`${uid}-pickup`} className="field-label">Pickup location *</label>
                      <select id={`${uid}-pickup`} name="pickup" className="field" value={form.pickup} onChange={(e) => set("pickup", e.target.value)} {...err("pickup")}>
                        <option value="">Select a city</option>
                        {places.map((p) => (
                          <option key={p.id}>{p.city}</option>
                        ))}
                        <option>{OTHER_PICKUP}</option>
                      </select>
                      <ErrorText k="pickup" />
                    </div>
                    <div>
                      <label htmlFor={`${uid}-dest`} className="field-label">
                        {form.occasion ? destinationLabel[form.occasion] : "Destination"}
                      </label>
                      <input id={`${uid}-dest`} name="destination" className="field" value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="Venue, hotel or area" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`${uid}-duration`} className="field-label">Rental duration (preferred)</label>
                      <select id={`${uid}-duration`} name="duration" className="field" value={form.duration} onChange={(e) => set("duration", e.target.value)}>
                        <option value="">Select a duration</option>
                        {durations.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Occasion-specific details expand smoothly */}
                  <AnimatePresence initial={false} mode="wait">
                    {form.occasion && form.occasion !== "Other" && (
                      <motion.div
                        key={form.occasion}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease }}
                        className="overflow-hidden"
                      >
                        <div className="mt-8 border-l-2 border-gold pl-5">
                          <p className="eyebrow text-gold-ink">{form.occasion} details</p>
                          {form.occasion === "Wedding" && (
                            <div className="mt-5">
                              <label htmlFor={`${uid}-deco`} className="field-label">Decoration requirements</label>
                              <textarea id={`${uid}-deco`} name="decoration" className="field" value={form.decoration} onChange={(e) => set("decoration", e.target.value)} placeholder="Flowers, ribbons, colour theme… (availability confirmed by our team)" />
                            </div>
                          )}
                          {form.occasion === "Photoshoot" && (
                            <div className="mt-5 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                              <div>
                                <label htmlFor={`${uid}-shoot`} className="field-label">Type of shoot</label>
                                <select id={`${uid}-shoot`} name="shootType" className="field" value={form.shootType} onChange={(e) => set("shootType", e.target.value)}>
                                  <option value="">Select</option>
                                  {shootTypes.map((s) => (
                                    <option key={s}>{s}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label htmlFor={`${uid}-count`} className="field-label">Vehicles needed</label>
                                <select id={`${uid}-count`} name="vehicleCount" className="field" value={form.vehicleCount} onChange={(e) => set("vehicleCount", e.target.value)}>
                                  <option value="">Select</option>
                                  <option>1 vehicle</option>
                                  <option>2 vehicles</option>
                                  <option>3 or more vehicles</option>
                                </select>
                              </div>
                              <div className="sm:col-span-2">
                                <label htmlFor={`${uid}-prod`} className="field-label">Production requirements</label>
                                <textarea id={`${uid}-prod`} name="production" className="field" value={form.production} onChange={(e) => set("production", e.target.value)} placeholder="Shoot hours, vehicle positioning, crew size, permits…" />
                              </div>
                            </div>
                          )}
                          {form.occasion === "Corporate" && (
                            <div className="mt-5">
                              <label htmlFor={`${uid}-company`} className="field-label">Company / organisation</label>
                              <input id={`${uid}-company`} name="company" className="field" autoComplete="organization" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Optional" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-8">
                    <label htmlFor={`${uid}-notes`} className="field-label">Additional requirements</label>
                    <textarea id={`${uid}-notes`} name="notes" className="field" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Timings, number of passengers, special requests…" />
                  </div>

                  <motion.div key={shake} animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.45 }} className="mt-10">
                    <button type="submit" className="btn btn-gold w-full sm:w-auto">
                      <WhatsAppIcon /> Check Availability on WhatsApp
                    </button>
                  </motion.div>
                  <p id={`${uid}-note`} className="mt-4 text-xs leading-relaxed text-obsidian/55">
                    This sends an availability enquiry, not a confirmed reservation. Your details open in WhatsApp for you to
                    review and send — nothing is stored on this website.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Confirmation({ sent, onEdit }: { sent: { url: string; details: EnquiryDetails }; onEdit: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  const d = sent.details;
  const rows: [string, string | undefined][] = [
    ["Occasion", d.occasion],
    ["Vehicle", d.vehicle],
    ["Date", d.date ? formatDate(d.date) : undefined],
    ["Pickup", d.pickup],
    [d.destinationLabel ?? "Destination", d.destination],
    ["Duration", d.duration],
  ];

  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      role="status"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease }}
      className="outline-none"
    >
      <span className="grid h-14 w-14 place-items-center rounded-full border border-gold-ink text-gold-ink">
        <Check className="h-6 w-6" strokeWidth={1.3} />
      </span>
      <h3 className="display mt-8 text-4xl md:text-5xl">Your enquiry is ready in WhatsApp.</h3>
      <p className="mt-4 max-w-lg leading-relaxed text-obsidian/70">
        Thank you, {d.name?.split(" ")[0]}. Press send in WhatsApp and our team will reply with availability and
        pricing. <strong className="font-semibold text-obsidian">Your booking is not confirmed until we confirm it with you.</strong>
      </p>

      <dl className="mt-8 grid gap-x-8 border-t border-obsidian/10 sm:grid-cols-2">
        {rows
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-obsidian/10 py-3 text-sm">
              <dt className="text-obsidian/50">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
      </dl>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <a href={sent.url} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
          <WhatsAppIcon /> Open WhatsApp again
        </a>
        <button type="button" onClick={onEdit} className="btn btn-ghost-ink">
          <RotateCcw className="h-4 w-4" strokeWidth={1.4} /> Edit enquiry
        </button>
      </div>
    </motion.div>
  );
}
