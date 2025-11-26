"use client";
import React, { useCallback, useState } from "react";
import AussieLiftsLogoInline from "@/app/ui/AussieLiftsLogoInline";
import { ChevronLeft } from "lucide-react";

export default function TopBar() {
  const [lost, setLost] = useState(false);
  const handleForceLoss = useCallback(() => {
    if (typeof window !== 'undefined' && typeof window.forceContextLoss === 'function') {
      window.forceContextLoss();
      setLost(true);
    } else {
      console.warn('forceContextLoss hook unavailable (Canvas not ready yet).');
    }
  }, []);

  return (
    <div className="absolute top-3 left-4 right-4 z-30 flex items-center gap-3 pl-24">
      {/* Back button placeholder */}
      {/* <button onClick={() => history.back()} className="text-xs md:text-sm text-gray-700 hover:text-black flex items-center gap-1">
        <ChevronLeft size={16} className="text-gray-500" /> BACK
      </button> */}
      {/* <button
        disabled={lost}
        onClick={handleForceLoss}
        title="Force the WebGL context to be lost (irreversible without reload)"
        className={`text-xs md:text-sm font-semibold px-3 py-2 rounded shadow transition-colors ${lost ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
      >
        {lost ? 'Context Lost' : 'Force GL Context Loss'}
      </button> */}
    </div>
  );
}
