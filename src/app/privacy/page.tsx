import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles the details you share when enquiring about a luxury car.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="26 October 2026">
      <p>
        This policy explains how {site.name} handles personal information when you use this website or enquire about
        a vehicle.
      </p>

      <h2>What this website collects</h2>
      <p>
        The booking form does not send your details to our servers. When you press “Check Availability on WhatsApp”,
        your entries are assembled into a message that opens in WhatsApp on your device. Nothing is shared with us until
        you choose to send that message.
      </p>
      <p>
        To save you retyping, an unsent draft of the form is kept in your browser’s session storage and is cleared when
        you close the browser tab.
      </p>

      <h2>Information you send us</h2>
      <p>When you contact us on WhatsApp, by phone or by email, we receive what you choose to share, such as:</p>
      <ul>
        <li>your name and mobile number;</li>
        <li>your occasion, preferred vehicle, date, pickup location and destination;</li>
        <li>any additional requirements you include.</li>
      </ul>
      <p>
        We use this only to respond to your enquiry, provide quotes, arrange and manage bookings, and meet legal
        obligations. We do not sell your personal information.
      </p>

      <h2>Third-party services</h2>
      <p>
        Messages sent through WhatsApp are handled under WhatsApp’s own terms and privacy policy. Fonts and images on
        this website are served from our own domain.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct or delete the personal information we hold about you by contacting us
        {site.email ? ` at ${site.email}` : " through any of the contact options on this website"}.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy from time to time. The date at the top shows when it was last revised.</p>
    </LegalPage>
  );
}
