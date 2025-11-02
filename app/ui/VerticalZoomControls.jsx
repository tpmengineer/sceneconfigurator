"use client";
import React from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

function dispatch(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export default function VerticalZoomControls() {
  return (
    <div className="absolute right-4 bottom-24 md:bottom-1/2 translate-y-1/2 z-20 flex flex-col bg-white/90 backdrop-blur border border-gray-200 rounded-md shadow-sm">
      <button
        className="px-3 py-2 hover:bg-gray-100 border-b border-gray-200"
        title="Zoom in"
        onClick={() => dispatch("scene-zoom-in")}
      >
        <ZoomIn size={16} />
      </button>
      <button
        className="px-3 py-2 hover:bg-gray-100 border-b border-gray-200"
        title="Zoom out"
        onClick={() => dispatch("scene-zoom-out")}
      >
        <ZoomOut size={16} />
      </button>
      <button
        className="px-3 py-2 hover:bg-gray-100"
        title="Reset view"
        onClick={() => dispatch("scene-reset")}
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
}
