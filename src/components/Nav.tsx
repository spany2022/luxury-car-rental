"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { site } from "@/config/site";
import { whatsappUrl, buildEnquiryMessage } from "@/lib/whatsapp";
import { Logo, WhatsAppIcon } from "./ui";

const links = [
  { href: "#fleet", label: "Fleet" },
  { href: "#occasions", label: "Occasions" },
  { href: "#weddings", label: "Weddings" },
  { href: "#photoshoots", label: "Photoshoots" },
  { href: "#locations", label: "Locations" },
  { href: "#book", label: "Book" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const wa = whatsappUrl(buildEnquiryMessage({}));

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-obsidian"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700 ${
          scrolled ? "border-b border-white/[0.06] bg-obsidian/85 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <nav className="container-lux flex h-[72px] items-center justify-between gap-6" aria-label="Primary">
          <a href="#top" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
            <Logo size={44} />
            <span className="hidden whitespace-nowrap font-serif text-xl tracking-wide sm:block lg:hidden xl:block">
              Wedding Cars<span className="text-gold">.Lux</span>
            </span>
          </a>

          <ul className="hidden items-center gap-7 lg:flex xl:gap-9">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-ivory/75 transition-colors duration-500 hover:text-gold">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost hidden min-h-11 px-5 md:inline-flex"
            >
              <WhatsAppIcon /> Book on WhatsApp
            </a>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center text-ivory lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-6 w-6" strokeWidth={1.2} /> : <Menu className="h-6 w-6" strokeWidth={1.2} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-obsidian px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-1 flex-col gap-1">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-white/[0.07] py-4 font-serif text-4xl"
                  >
                    <span className="font-sans text-[0.65rem] tracking-[0.3em] text-gold">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-gold w-full">
              <WhatsAppIcon /> Book on WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
