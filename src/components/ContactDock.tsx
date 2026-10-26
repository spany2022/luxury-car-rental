"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buildEnquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { useBooking } from "./BookingContext";
import { WhatsAppIcon } from "./ui";

/** Persistent WhatsApp action: a bottom bar on mobile, a restrained floating button on desktop. */
export function ContactDock() {
  const [visible, setVisible] = useState(false);
  const { requestBooking } = useBooking();
  const wa = whatsappUrl(buildEnquiryMessage({}));

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Mobile bar — always available */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-white/10 bg-obsidian/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <button type="button" onClick={() => requestBooking()} className="min-h-14 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ivory">
          Enquire
        </button>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center gap-2 bg-gold text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-obsidian">
          <WhatsAppIcon /> WhatsApp
        </a>
      </div>

      {/* Desktop floating button */}
      <AnimatePresence>
        {visible && (
          <motion.a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book on WhatsApp"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group fixed bottom-6 right-6 z-40 hidden items-center gap-3 md:flex"
          >
            <span className="pointer-events-none translate-x-2 bg-obsidian/90 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-ivory opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
              Book on WhatsApp
            </span>
            <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/60 bg-obsidian/90 text-gold shadow-[0_10px_40px_-10px_rgba(198,165,107,0.5)] backdrop-blur transition-colors duration-500 group-hover:bg-gold group-hover:text-obsidian">
              <WhatsAppIcon className="h-5 w-5" />
            </span>
          </motion.a>
        )}
      </AnimatePresence>
    </>
  );
}
