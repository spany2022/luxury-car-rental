import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms & Booking Conditions",
  description: `How enquiries and bookings work with ${site.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Booking Conditions" updated="26 October 2026">
      <p>
        These terms describe how enquiries made through this website work. The specific terms for your booking —
        including price, deposit, duration, cancellation and any vehicle conditions — are shared with you directly by our
        team before you confirm.
      </p>

      <h2>Enquiries are not bookings</h2>
      <ul>
        <li>Submitting the booking form or sending a WhatsApp message is an availability enquiry, not a reservation.</li>
        <li>A booking is confirmed only when our team confirms it to you in writing (for example, on WhatsApp).</li>
        <li>Until then, no vehicle, date or time is held for you.</li>
      </ul>

      <h2>Vehicles and photography</h2>
      <ul>
        <li>Photography on this website is representative and may not show the exact vehicle you are offered.</li>
        <li>The model, colour and specification available for your date are confirmed during your enquiry.</li>
      </ul>

      <h2>Prices and extras</h2>
      <ul>
        <li>Prices, deposits, rental durations and any additional charges are quoted individually.</li>
        <li>Decorations, multiple vehicles and travel beyond our service areas are subject to availability and confirmation.</li>
      </ul>

      <h2>Service areas</h2>
      <p>
        We serve Bhubaneswar, Cuttack and Puri. Journeys to other destinations may be possible by prior arrangement and
        are confirmed case by case.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these terms or your booking, please contact us
        {site.phone ? ` on ${site.phone}` : ""} or through WhatsApp.
      </p>
    </LegalPage>
  );
}
