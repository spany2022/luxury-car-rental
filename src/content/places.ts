export type Occasion = "Wedding" | "Photoshoot" | "Corporate" | "Other";

export const occasions: Occasion[] = ["Wedding", "Photoshoot", "Corporate", "Other"];

export type Place = {
  id: string;
  city: string;
  title: string;
  theme: string;
  copy: string;
  contexts: string[];
  image: string;
  imageAlt: string;
};

/** Only list cities the business actually serves. */
export const places: Place[] = [
  {
    id: "bhubaneswar",
    city: "Bhubaneswar",
    title: "Luxury car rental in Bhubaneswar",
    theme: "The Urban Arrival",
    copy:
      "From hotel porticos to corporate campuses and wedding lawns, a refined arrival across the Temple City.",
    contexts: ["Weddings", "Executive travel", "Events", "Photoshoots"],
    image: "/images/city-bhubaneswar.jpg",
    imageAlt: "Ancient sandstone temple spires of Bhubaneswar against a clear sky",
  },
  {
    id: "cuttack",
    city: "Cuttack",
    title: "Wedding car rental in Cuttack",
    theme: "Celebrations with Elegance",
    copy:
      "Graceful transport for the Silver City's celebrations — from family ceremonies to grand reception entrances.",
    contexts: ["Wedding transportation", "Family occasions", "Photoshoots"],
    image: "/images/city-cuttack.jpg",
    imageAlt: "Wooden boats on the Mahanadi river near Cuttack with a long bridge on the horizon",
  },
  {
    id: "puri",
    city: "Puri",
    title: "Luxury car rental in Puri",
    theme: "Coastal Luxury",
    copy:
      "Sea-breeze arrivals for destination celebrations and golden-hour shoots along the Bay of Bengal.",
    contexts: ["Destination celebrations", "Photoshoots", "Leisure journeys"],
    image: "/images/city-puri.jpg",
    imageAlt: "Sun setting over the sea at Puri with waves washing onto the shore",
  },
];

export const durations = ["A few hours", "Half day", "Full day", "Multiple days", "Not sure yet"];

export const shootTypes = [
  "Pre-wedding shoot",
  "Wedding film",
  "Music video",
  "Fashion campaign",
  "Commercial / advertisement",
  "Brand photography",
  "Social media content",
  "Other",
];
