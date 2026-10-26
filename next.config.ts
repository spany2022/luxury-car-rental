import type { NextConfig } from "next";

if (!process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) {
  console.warn(
    "\n⚠  NEXT_PUBLIC_WHATSAPP_NUMBER is not set. WhatsApp buttons will open WhatsApp without a recipient.\n" +
      "   Add the business number to .env.local before deploying (see .env.example).\n",
  );
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
  },
  poweredByHeader: false,
};

export default nextConfig;
