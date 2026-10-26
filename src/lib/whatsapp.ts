import { site } from "@/config/site";

export type EnquiryDetails = {
  name?: string;
  phone?: string;
  occasion?: string;
  vehicle?: string;
  date?: string;
  pickup?: string;
  destination?: string;
  destinationLabel?: string;
  duration?: string;
  extra?: [label: string, value: string][];
  notes?: string;
};

export function whatsappUrl(message: string) {
  const text = encodeURIComponent(message);
  return site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Builds the enquiry from whatever the visitor actually selected; empty values are omitted. */
export function buildEnquiryMessage(e: EnquiryDetails) {
  const lines: [string, string | undefined][] = [
    ["Name", e.name],
    ["Mobile", e.phone],
    ["Occasion", e.occasion],
    ["Preferred vehicle", e.vehicle],
    ["Date", e.date ? formatDate(e.date) : undefined],
    ["Pickup location", e.pickup],
    [e.destinationLabel ?? "Destination", e.destination],
    ["Rental duration", e.duration],
    ...(e.extra ?? []),
    ["Additional requirements", e.notes],
  ];

  const body = lines
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v!.trim()}`)
    .join("\n");

  return [
    "Hello, I'm interested in booking a luxury car.",
    body,
    "Please share availability, pricing, and booking details.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Short enquiry used by contextual buttons (fleet cards, location panels, etc.). */
export function quickEnquiryUrl(context: { occasion?: string; vehicle?: string; location?: string }) {
  return whatsappUrl(
    buildEnquiryMessage({
      occasion: context.occasion,
      vehicle: context.vehicle,
      pickup: context.location,
    }),
  );
}

/** Indian mobile numbers (10 digits, optional +91/0) or any international number with a leading +. */
export function normalisePhone(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  let local = digits;
  if (local.length === 12 && local.startsWith("91")) local = local.slice(2);
  else if (local.length === 11 && local.startsWith("0")) local = local.slice(1);
  if (/^[6-9]\d{9}$/.test(local)) return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  if (trimmed.startsWith("+") && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return null;
}
