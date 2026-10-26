/**
 * Fleet showcase.
 *
 * IMPORTANT — keep this list limited to vehicles the business has confirmed it
 * rents out. Only fill `seats`, `chauffeur`, `durations` and `priceFrom` once
 * the business has verified them; empty fields render as "confirmed on
 * enquiry" rather than invented values. Photography is representative until
 * the business supplies photos of its own vehicles (`representativeImage`).
 */

export type FleetCategory =
  | "luxury-sedans"
  | "executive"
  | "wedding"
  | "suv"
  | "photoshoot"
  | "chauffeur";

export const fleetCategories: { id: FleetCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "luxury-sedans", label: "Luxury Sedans" },
  { id: "executive", label: "Executive Cars" },
  { id: "wedding", label: "Wedding Special" },
  { id: "suv", label: "Premium SUVs" },
  { id: "photoshoot", label: "Photoshoot" },
  { id: "chauffeur", label: "Chauffeur-Driven" },
];

export type Vehicle = {
  id: string;
  brand: string;
  /** Leave undefined until the exact model is confirmed. */
  model?: string;
  class: string;
  categories: FleetCategory[];
  line: string;
  suitability: string[];
  image: string;
  imageAlt: string;
  /** CSS object-position for the card crop. */
  focus?: string;
  gallery?: { src: string; alt: string }[];
  representativeImage: boolean;
  seats?: number;
  chauffeur?: boolean;
  durations?: string[];
  priceFrom?: string;
};

export const fleet: Vehicle[] = [
  {
    id: "mercedes-benz",
    brand: "Mercedes-Benz",
    class: "Flagship Luxury Sedan",
    categories: ["luxury-sedans", "executive", "wedding", "chauffeur"],
    line: "Quiet authority and unmistakable presence — the classic choice for a grand arrival.",
    suitability: ["Wedding arrivals", "VIP transfers", "Executive travel"],
    image: "/images/fleet-mercedes.jpg",
    imageAlt: "Black Mercedes-Benz luxury sedan parked on a cobblestone street between modern buildings",
    focus: "50% 62%",
    gallery: [
      { src: "/images/mercedes-star.jpg", alt: "Close-up of the Mercedes-Benz star on a dark grille" },
      { src: "/images/interior-mercedes.jpg", alt: "Mercedes-Benz cabin with leather steering wheel and digital dashboard" },
    ],
    representativeImage: true,
  },
  {
    id: "audi",
    brand: "Audi",
    class: "Premium Executive Sedan",
    categories: ["luxury-sedans", "executive", "wedding", "photoshoot"],
    line: "Clean lines and modern precision, beautiful in ivory for a wedding day.",
    suitability: ["Wedding couples", "Pre-wedding shoots", "Corporate guests"],
    image: "/images/fleet-audi.jpg",
    imageAlt: "White Audi sedan parked outside a brick shopfront in warm afternoon light",
    focus: "50% 58%",
    gallery: [
      { src: "/images/fleet-audi-white.jpg", alt: "White Audi sedan backlit by the evening sun beside a glass building" },
    ],
    representativeImage: true,
  },
  {
    id: "bmw",
    brand: "BMW",
    class: "Executive Car",
    categories: ["executive", "luxury-sedans", "photoshoot", "chauffeur"],
    line: "Poised, athletic and composed — made for business days and confident entrances.",
    suitability: ["Business meetings", "Airport transfers", "Brand shoots"],
    image: "/images/fleet-bmw.jpg",
    imageAlt: "Black BMW executive car on an open rooftop under a blue sky",
    focus: "40% 60%",
    gallery: [
      { src: "/images/headlight-bmw.jpg", alt: "BMW headlights glowing in the dark" },
    ],
    representativeImage: true,
  },
  {
    id: "jaguar",
    brand: "Jaguar",
    class: "British Luxury Saloon",
    categories: ["luxury-sedans", "photoshoot", "wedding"],
    line: "British character with a sculpted, sporting edge that photographs beautifully.",
    suitability: ["Photoshoots", "Anniversaries", "Celebrations"],
    image: "/images/fleet-jaguar.jpg",
    imageAlt: "Front corner of a deep red Jaguar saloon with sculpted headlight and alloy wheel",
    focus: "50% 40%",
    gallery: [
      { src: "/images/jaguar-leaper.jpg", alt: "Chrome Jaguar leaper ornament" },
    ],
    representativeImage: true,
  },
  {
    id: "range-rover",
    brand: "Range Rover",
    class: "Premium Luxury SUV",
    categories: ["suv", "executive", "wedding", "chauffeur"],
    line: "Commanding comfort for families, VIP guests and journeys beyond the city.",
    suitability: ["Family & VIP transport", "Destination travel", "Corporate guests"],
    image: "/images/fleet-range-rover.jpg",
    imageAlt: "Black Range Rover SUV on a city street with high-rise buildings behind",
    focus: "50% 55%",
    representativeImage: true,
  },
];

export const vehicleName = (v: Vehicle) => (v.model ? `${v.brand} ${v.model}` : v.brand);
