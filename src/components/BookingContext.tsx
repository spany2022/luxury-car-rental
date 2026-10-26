"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Occasion } from "@/content/places";
import { scrollToId } from "@/lib/motion";

export type Prefill = { occasion?: Occasion; vehicle?: string; location?: string };

type Ctx = {
  prefill: (Prefill & { nonce: number }) | null;
  requestBooking: (p?: Prefill) => void;
};

const BookingCtx = createContext<Ctx | null>(null);

/** Lets any CTA on the page pre-select occasion / vehicle / location in the booking form. */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<Ctx["prefill"]>(null);

  const requestBooking = useCallback((p: Prefill = {}) => {
    setPrefill({ ...p, nonce: Date.now() });
    scrollToId("book");
  }, []);

  return <BookingCtx.Provider value={{ prefill, requestBooking }}>{children}</BookingCtx.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
