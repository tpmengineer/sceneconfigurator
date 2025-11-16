"use client";
import React, { useState, useEffect } from "react";
import AussieLiftsLogoInline from "@/app/ui/AussieLiftsLogoInline";
import { Rotate3D, DoorOpen, Square, Sun, Hand, Layers,  X, Menu, SquareArrowUp } from "lucide-react";
import { useCustomisation } from "@/contexts/customisation";

// Tooltip that appears above on hover/focus and hides on leave/blur
const Tooltip = ({ label, children }) => {
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
        className={`pointer-events-none absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2 transition-opacity duration-150 z-30 ${open ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="relative bg-black text-white text-xs rounded px-2 py-1 shadow-md whitespace-nowrap">
          {label}
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rotate-45 origin-center" />
        </div>
      </div>
    </div>
  );
};

// Label that smoothly animates width when text changes
const SmoothWidthLabel = ({ text }) => {
  const measureRef = React.useRef(null);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    if (measureRef.current) {
      setWidth(measureRef.current.offsetWidth);
    }
  }, [text]);
  return (
    <div className="relative inline-block" style={{ width: width || undefined, transition: width ? 'width 200ms ease' : undefined }}>
      <span className="px-2 text-sm text-gray-900 select-none whitespace-nowrap">{text}</span>
      {/* hidden measurer */}
      <span ref={measureRef} className="absolute left-0 top-0 -z-10 opacity-0 pointer-events-none px-2 text-sm whitespace-nowrap">
        {text}
      </span>
    </div>
  );
};

export default function SceneNav() {
  const [entry, setEntry] = useState("Entrance");
  const { showDoor, setShowDoor, activeView, setActiveView } = useCustomisation();
  // local mirror for button pressed animations if needed
  const [selectedView, setSelectedView] = useState(activeView || "default");

  useEffect(() => {
    setSelectedView(activeView || "default");
  }, [activeView]);
  
  // Dispatch a custom event that the 3D scene listens to
  const dispatchView = (name) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("scene-set-view", { detail: name }));
    }
  };

  // Toggle logic: clicking active -> go back to default; otherwise switch to that
  const toggleView = (name) => {
    const next = (activeView === name ? "default" : name);
    setActiveView(next);
    setSelectedView(next);
    dispatchView(next);
  };
  
  const VIEW_LABELS = {
    walls: 'Walls',
    ceiling: 'Ceiling',
    floor: 'Floor',
    handrail: 'Handrail',
    cop: 'COP',
  };
  const displayLabel = (selectedView && selectedView !== 'default' && selectedView !== 'door')
    ? (VIEW_LABELS[selectedView] || 'Scene View')
    : 'Scene View';
  return (
    <div className="absolute left-4 bottom-4 z-20 flex items-center gap-2">
      <div className="flex items-center gap-2 bg-[#f2f2f2] backdrop-blur border border-gray-200 rounded-xs shadow-sm p-1">
        <SmoothWidthLabel text={displayLabel} />
        {/* <div className="h-5 w-px bg-gray-200" /> */}
  <Tooltip label="Scene View">
    <button
      className={`p-2 text-xs hover:bg-gray-100 ${selectedView === "default" ? "bg-white text-black shadow-md hover:bg-white" : ""}`}
      aria-pressed={selectedView === "default"}
      aria-label="Scene View"
      onClick={() => toggleView("default")}
    >
      <Rotate3D size={16} />
    </button>
  </Tooltip>
  <Tooltip label={showDoor ? "Hide Door" : "Show Door"}>
    <button
      className={`p-2 ${showDoor ? "hover:bg-gray-100" : "bg-white text-black shadow-md"}`}
      onClick={() => setShowDoor(!showDoor)}
      aria-label={showDoor ? "Hide Door" : "Show Door"}
    >
      <DoorOpen size={16} />
    </button>
  </Tooltip>
        
        {/* Preset cameras */}
        <div className="ml-1 h-5 w-px bg-gray-200" />
        <div className="flex items-center gap-1">
          <Tooltip label="Walls">
            <button
              className={`p-2 text-xs hover:bg-gray-100 ${selectedView === "walls" ? "bg-white text-black shadow-md hover:bg-white" : ""}`}
              aria-pressed={selectedView === "walls"}
              aria-label="Walls"
              onClick={() => toggleView("walls")}
            >
              {/* Walls */}
              <Square size={16} />
            </button>
          </Tooltip>
          <Tooltip label="Ceiling">
            <button
              className={`p-2 text-xs hover:bg-gray-100 ${selectedView === "ceiling" ? "bg-white text-black shadow-md hover:bg-white" : ""}`}
              aria-pressed={selectedView === "ceiling"}
              aria-label="Ceiling"
              onClick={() => toggleView("ceiling")}
            >
              <Sun size={16} />
            </button>
          </Tooltip>
          <Tooltip label="Floor">
            <button
              className={`p-2 text-xs hover:bg-gray-100 ${selectedView === "floor" ? "bg-white text-black shadow-md hover:bg-white" : ""}`}
              aria-pressed={selectedView === "floor"}
              aria-label="Floor"
              onClick={() => toggleView("floor")}
            >
              <Layers size={16} />
            </button>
          </Tooltip>
          <Tooltip label="Handrail">
            <button
              className={`p-2 text-xs hover:bg-gray-100 ${selectedView === "handrail" ? "bg-white text-black shadow-md hover:bg-white" : ""}`}
              aria-pressed={selectedView === "handrail"}
              aria-label="Handrail"
              onClick={() => toggleView("handrail")}
            >
              <Hand size={16} />
            </button>
          </Tooltip>
          <Tooltip label="COP">
            <button
              className={`p-2 text-xs hover:bg-gray-100 ${selectedView === "cop" ? "bg-white text-black shadow-md hover:bg-white" : ""}`}
              aria-pressed={selectedView === "cop"}
              aria-label="COP"
              onClick={() => toggleView("cop")}
            >
              {/* COP */}
              <SquareArrowUp size={16} />
            </button>
          </Tooltip>
          
        </div>
      </div>
      <div className='flex items-center h-6 opacity-70'>
        <AussieLiftsLogoInline color="#000" />
      </div>
    </div>
  );
}
