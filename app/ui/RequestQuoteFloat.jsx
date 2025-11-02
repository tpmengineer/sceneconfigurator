"use client";
import React from "react";

// A floating Request Quote button aligned to the left edge of the right config panel
// On md screens the panel is 360px; on lg it's 400px. We offset by +16px gap.
export default function RequestQuoteFloat() {
  return (
    <>
      {/* lg+ breakpoint (panel ~400px) */}
      <button
        className="hidden lg:block absolute top-3 right-3 z-30 px-4 h-9 bg-black text-white rounded-sm text-xs tracking-wide"
      >
        REQUEST QUOTE
      </button>
    </>
  );
}
