"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Lazy-load modal to avoid SSR mismatch and heavy initial render
const RequestQuoteModal = dynamic(() => import("./RequestQuoteModal"), { ssr: false });

// A floating Request Quote button aligned to the left edge of the right config panel
// On md screens the panel is 360px; on lg it's 400px. We offset by +16px gap.
export default function RequestQuoteFloat() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* lg+ breakpoint (panel ~400px) */}
      <button
        className="hidden lg:block absolute top-3 right-3 z-30 px-4 h-9 bg-black text-white rounded-sm text-xs tracking-wide"
        onClick={() => setOpen(true)}
      >
        REQUEST QUOTE
      </button>

      <RequestQuoteModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
