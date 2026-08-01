"use client";
import React from "react";

// Small support link anchored to a free corner of the scene area.
// Mobile: bottom-left (SceneNav sits centre-left, zoom controls bottom-right).
// Desktop: bottom-right (SceneNav sits bottom-left, zoom controls centre-right).
export default function SupportLink() {
  return (
    <a
      href="https://itsybytesy.com.au"
      target="_blank"
      rel="noopener"
      title="Developed by Itsy Bytesy — contact Itsy Bytesy for support"
      className="absolute bottom-2 left-2 md:left-auto md:right-4 md:bottom-4 z-20 px-2 py-1 rounded-xs text-xxs tracking-wide text-brand-grey hover:text-brand-grey-dk transition-colors"
    >
      Support
    </a>
  );
}
