import { BookingProvider } from "@/components/BookingContext";
import { SmoothScroll, RevealOnScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Fleet } from "@/components/Fleet";
import { Occasions } from "@/components/Occasions";
import { Story } from "@/components/Story";
import { Wedding } from "@/components/Wedding";
import { Photoshoot } from "@/components/Photoshoot";
import { Locations } from "@/components/Locations";
import { WhyUs } from "@/components/WhyUs";
import { Booking } from "@/components/Booking";
import { Footer } from "@/components/Footer";
import { ContactDock } from "@/components/ContactDock";
import { Cursor } from "@/components/Cursor";

export default function Home() {
  return (
    <BookingProvider>
      <SmoothScroll />
      <Nav />
      <main id="main">
        <Hero />
        <Fleet />
        <Occasions />
        <Story />
        <Wedding />
        <Photoshoot />
        <Locations />
        <WhyUs />
        <Booking />
      </main>
      <Footer />
      <ContactDock />
      <Cursor />
      <RevealOnScroll />
    </BookingProvider>
  );
}
