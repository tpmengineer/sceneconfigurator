"use client";
import React from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

function dispatch(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

// Tooltip that appears to the left as a black speech bubble
const TooltipLeft = ({ label, children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
    >
      {children}
      <div
        role="tooltip"
        className={`pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 transition-opacity duration-150 z-30 ${open ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="relative bg-black text-white text-xs rounded px-2 py-1 shadow-md whitespace-nowrap">
          {label}
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-black rotate-45 origin-center" />
        </div>
      </div>
    </div>
  );
};

export default function VerticalZoomControls() {
  return (
    <div className="absolute right-4 bottom-24 md:bottom-1/2 translate-y-1/2 z-20 flex flex-col bg-[#f2f2f2] backdrop-blur border border-gray-200 rounded-xs shadow-sm p-1 gap-1">
      <TooltipLeft label="Zoom In">
        <button
          className="p-2 hover:bg-gray-100"
          aria-label="Zoom In"
          onClick={() => dispatch("scene-zoom-in")}
        >
          <ZoomIn size={16} />
        </button>
      </TooltipLeft>
      <TooltipLeft label="Zoom Out">
        <button
          className="p-2 hover:bg-gray-100"
          aria-label="Zoom Out"
          onClick={() => dispatch("scene-zoom-out")}
        >
          <ZoomOut size={16} />
        </button>
      </TooltipLeft>
      <TooltipLeft label="Reset View">
        <button
          className="p-2 hover:bg-gray-100"
          aria-label="Reset View"
          onClick={() => dispatch("scene-reset")}
        >
          <RotateCcw size={16} />
        </button>
      </TooltipLeft>
    </div>
  );
}
