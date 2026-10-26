/**
 * Business details. Everything customer-facing that must be verified by the
 * business lives here or in `src/content/*`. Contact details come from
 * environment variables so they are never hard-coded as placeholders.
 */

const env = (value: string | undefined) => (value ?? "").trim();

export const site = {
  name: "Wedding Cars.Lux",
  legalName: "Wedding Cars.Lux",
  monogram: "CS",
  tagline: "Elegant transportation for your special day",
  description:
    "Premium luxury cars for weddings, pre-wedding photoshoots, corporate travel and special occasions across Bhubaneswar, Cuttack and Puri, Odisha.",
  url: env(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000",
  logo: "/brand/logo.webp",

  /** Digits only, international format (e.g. 91XXXXXXXXXX). */
  whatsappNumber: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER).replace(/\D/g, ""),
  phone: env(process.env.NEXT_PUBLIC_PHONE),
  email: env(process.env.NEXT_PUBLIC_EMAIL),

  social: [
    { label: "Instagram", href: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL) },
    { label: "Facebook", href: env(process.env.NEXT_PUBLIC_FACEBOOK_URL) },
    { label: "YouTube", href: env(process.env.NEXT_PUBLIC_YOUTUBE_URL) },
  ].filter((s) => s.href),

  region: "Odisha",
  country: "IN",
} as const;

export const pricingNote =
  "Prices, availability, rental duration, deposits and final terms are confirmed directly by our team.";
