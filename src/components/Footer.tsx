"use client";

import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { fleetCategories } from "@/content/fleet";
import { places } from "@/content/places";
import { buildEnquiryMessage, quickEnquiryUrl, whatsappUrl } from "@/lib/whatsapp";
import { useBooking } from "./BookingContext";
import { Logo, WhatsAppIcon } from "./ui";

export function Footer() {
  const { requestBooking } = useBooking();
  const wa = whatsappUrl(buildEnquiryMessage({}));
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-obsidian">
      {/* Final CTA */}
      <div className="grain relative isolate overflow-hidden">
        <Image
          src="/images/grille-dark.jpg"
          alt="Luxury car grille and headlights glowing softly in darkness"
          fill
          sizes="100vw"
          className="-z-10 object-cover opacity-70"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(11,11,13,0.9)_75%)]" />
        <div className="container-lux flex min-h-[86svh] flex-col items-center justify-center py-28 text-center">
          <p data-reveal className="eyebrow text-gold">Your Arrival Awaits</p>
          <h2 data-reveal className="display mt-6 max-w-[16ch] text-[clamp(2.8rem,7vw,6.75rem)]">
            Make Your Next Arrival <em className="italic text-gold-soft">Unforgettable</em>.
          </h2>
          <p data-reveal className="mt-7 max-w-xl text-ivory/70 md:text-lg">
            From wedding celebrations to executive journeys, discover a more refined way to travel across Bhubaneswar,
            Cuttack, and Puri.
          </p>
          <div data-reveal className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <a href="#fleet" className="btn btn-ghost">Explore the Fleet</a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              <WhatsAppIcon /> Book on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.08]">
        <div className="container-lux grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <Logo size={64} />
              <p className="font-serif text-2xl">
                Wedding Cars<span className="text-gold">.Lux</span>
              </p>
            </div>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ivory/55">
              {site.tagline}. Premium cars for weddings, photoshoots, corporate travel and special occasions across Odisha.
            </p>
            <button type="button" onClick={() => requestBooking()} className="btn btn-gold mt-8">
              Book Your Next Ride
            </button>
          </div>

          <FooterCol title="The Fleet">
            {fleetCategories.slice(1).map((c) => (
              <li key={c.id}>
                <a href="#fleet">{c.label}</a>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Enquiries">
            <li><a href={quickEnquiryUrl({ occasion: "Wedding" })} target="_blank" rel="noopener noreferrer">Wedding car enquiries</a></li>
            <li><a href={quickEnquiryUrl({ occasion: "Photoshoot" })} target="_blank" rel="noopener noreferrer">Photoshoot bookings</a></li>
            <li><a href={quickEnquiryUrl({ occasion: "Corporate" })} target="_blank" rel="noopener noreferrer">Corporate travel</a></li>
            <li><a href="#book">Booking form</a></li>
          </FooterCol>

          <FooterCol title="Service Areas">
            {places.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`}>{p.city}, Odisha</a>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Contact">
            {site.phone && (
              <li><a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>{site.phone}</a></li>
            )}
            <li>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
              </a>
            </li>
            {site.email && (
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            )}
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              </li>
            ))}
          </FooterCol>
        </div>

        <div className="container-lux flex flex-col gap-4 border-t border-white/[0.06] py-8 pb-28 text-xs text-ivory/40 md:flex-row md:items-center md:justify-between md:pb-8">
          <p>© {year} {site.legalName}. All rights reserved.</p>
          <p className="flex gap-6">
            <Link href="/privacy" className="hover:text-gold">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold">Terms &amp; Booking Conditions</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-gold">{title}</p>
      <ul className="mt-6 space-y-3 text-sm text-ivory/65 [&_a]:transition-colors [&_a:hover]:text-ivory">{children}</ul>
    </div>
  );
}
