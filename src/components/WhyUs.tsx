import Image from "next/image";
import { CalendarHeart, Gem, MessagesSquare, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Gem,
    title: "Curated Premium Fleet",
    copy: "Discover vehicles selected for elegance, comfort, and the occasion.",
  },
  {
    icon: ShieldCheck,
    title: "Professional Service",
    copy: "A booking experience designed around punctuality, communication, and customer convenience.",
  },
  {
    icon: CalendarHeart,
    title: "Occasion-Focused Options",
    copy: "Explore suitable vehicle options for weddings, photoshoots, corporate travel, and special events.",
  },
  {
    icon: MessagesSquare,
    title: "Personalised Enquiries",
    copy: "Discuss your date, destination, preferred vehicle, and requirements before confirming a booking.",
  },
];

export function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-graphite py-24 md:py-36" aria-labelledby="why-title">
      <div className="container-lux grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow text-gold">Why Choose Us</p>
          <h2 id="why-title" data-reveal className="display mt-6 text-[clamp(2.6rem,5.6vw,5.25rem)]">
            Luxury Is in Every <em className="italic text-gold-soft">Detail</em>.
          </h2>
          <div data-reveal className="relative mt-12 hidden aspect-[4/5] overflow-hidden lg:block">
            <Image src="/images/mercedes-star.jpg" alt="Polished Mercedes-Benz star on a dark grille" fill sizes="40vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-graphite/70 to-transparent" />
          </div>
        </div>

        <div className="lg:col-span-7 lg:pt-28">
          <ul className="grid gap-px bg-white/[0.08] sm:grid-cols-2">
            {features.map(({ icon: Icon, title, copy }, i) => (
              <li key={title} data-reveal className="group relative bg-graphite p-8 transition-colors duration-700 hover:bg-charcoal md:p-10">
                <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                <div className="flex items-center justify-between">
                  <Icon className="h-7 w-7 text-gold transition-transform duration-700 group-hover:-translate-y-1" strokeWidth={1} aria-hidden />
                  <span className="font-serif text-ivory/30">0{i + 1}</span>
                </div>
                <h3 className="mt-10 font-serif text-3xl">{title}</h3>
                <p className="mt-4 leading-relaxed text-ivory/60">{copy}</p>
              </li>
            ))}
          </ul>
          <p data-reveal className="mt-8 max-w-xl text-sm leading-relaxed text-ivory/45">
            Ask us about chauffeur arrangements, vehicle preparation and any documentation you need for your event — we
            will share the details that apply to your booking.
          </p>
        </div>
      </div>
    </section>
  );
}
