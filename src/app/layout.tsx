import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { site } from "@/config/site";
import { places } from "@/content/places";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const title = "Luxury & Wedding Car Rental in Bhubaneswar, Cuttack & Puri";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${title} | ${site.name}`, template: `%s | ${site.name}` },
  description:
    "Mercedes-Benz, Audi, BMW, Jaguar and Range Rover for weddings, pre-wedding photoshoots, corporate travel and special occasions across Bhubaneswar, Cuttack and Puri, Odisha. Enquire on WhatsApp.",
  alternates: { canonical: "/" },
  icons: { icon: site.logo, apple: site.logo },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: "/images/fleet-mercedes.jpg", width: 1800, height: 2250, alt: "Black Mercedes-Benz luxury sedan" }],
  },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
  colorScheme: "dark light",
};

function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: site.name,
    description: site.description,
    url: site.url,
    logo: new URL(site.logo, site.url).toString(),
    image: new URL("/images/fleet-mercedes.jpg", site.url).toString(),
    address: { "@type": "PostalAddress", addressRegion: site.region, addressCountry: site.country },
    areaServed: places.map((p) => ({
      "@type": "City",
      name: p.city,
      containedInPlace: { "@type": "State", name: site.region },
    })),
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.email ? { email: site.email } : {}),
    ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
