"use client";
import React from "react";
import AussieLiftsLogoInline from "@/app/ui/AussieLiftsLogoInline";
import { ChevronLeft } from "lucide-react";

export default function TopBar() {
  return (
    <div className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between w-fit">
      <button onClick={() => history.back()} className="text-xs md:text-sm text-gray-700 hover:text-black flex items-center gap-1">
        <ChevronLeft size={16} className="text-gray-500" /> BACK
      </button>
      <div className="hidden md:flex items-center gap-2" />
    </div>
  );
}
