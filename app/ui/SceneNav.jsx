"use client";
import React, { useState, useEffect } from "react";
import AussieLiftsLogoInline from "@/app/ui/AussieLiftsLogoInline";
import { Box, Square, RotateCw, Hand as HandIcon, Ruler, Grid3x3, DoorOpen } from "lucide-react";
import { useCustomisation } from "@/contexts/customisation";

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

  // Toggle logic: clicking active view -> go back to default; otherwise switch to that view
  const toggleView = (name) => {
    const next = (activeView === name ? "default" : name);
    setActiveView(next);
    setSelectedView(next);
    dispatchView(next);
  };
  return (
    <div className="absolute left-4 bottom-4 z-20 flex items-center gap-2">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur border border-gray-200 rounded-md shadow-sm px-2 py-1">
        {/* <select
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="text-xs text-gray-700 bg-transparent outline-none px-2 py-1"
        >
          <option>Entrance</option>
          <option>Car</option>
          <option>Top</option>
        </select> */}
  {/* <button className="p-2 hover:bg-gray-100 rounded" title="3D View"><Box size={16} /></button>
  <button className="p-2 hover:bg-gray-100 rounded" title="Ortho"><Square size={16} /></button>
  <button className="p-2 hover:bg-gray-100 rounded" title="Rotate"><RotateCw size={16} /></button>
  <button className="p-2 hover:bg-gray-100 rounded" title="Pan"><HandIcon size={16} /></button>
  <button className="p-2 hover:bg-gray-100 rounded" title="Measure"><Ruler size={16} /></button>
  <button className="p-2 hover:bg-gray-100 rounded" title="Grid"><Grid3x3 size={16} /></button> */}
  <button
    className={`p-2 rounded ${showDoor ? "hover:bg-gray-100" : "bg-black text-white"}`}
    title={showDoor ? "Hide Door" : "Show Door"}
    onClick={() => setShowDoor(!showDoor)}
  >
    <DoorOpen size={16} />
  </button>
        
        {/* Preset camera views */}
        <div className="ml-1 h-5 w-px bg-gray-200" />
        <div className="flex items-center gap-1">
          <button
            className={`px-2 py-1 text-xs rounded hover:bg-gray-100 ${selectedView === "walls" ? "bg-black text-white hover:bg-black" : ""}`}
            title="Walls view"
            aria-pressed={selectedView === "walls"}
            onClick={() => toggleView("walls")}
          >
            Walls
          </button>
          <button
            className={`px-2 py-1 text-xs rounded hover:bg-gray-100 ${selectedView === "ceiling" ? "bg-black text-white hover:bg-black" : ""}`}
            title="Ceiling view"
            aria-pressed={selectedView === "ceiling"}
            onClick={() => toggleView("ceiling")}
          >
            Ceiling
          </button>
          <button
            className={`px-2 py-1 text-xs rounded hover:bg-gray-100 ${selectedView === "floor" ? "bg-black text-white hover:bg-black" : ""}`}
            title="Floor view"
            aria-pressed={selectedView === "floor"}
            onClick={() => toggleView("floor")}
          >
            Floor
          </button>
          <button
            className={`px-2 py-1 text-xs rounded hover:bg-gray-100 ${selectedView === "handrail" ? "bg-black text-white hover:bg-black" : ""}`}
            title="Handrail view"
            aria-pressed={selectedView === "handrail"}
            onClick={() => toggleView("handrail")}
          >
            Handrail
          </button>
          <button
            className={`px-2 py-1 text-xs rounded hover:bg-gray-100 ${selectedView === "cop" ? "bg-black text-white hover:bg-black" : ""}`}
            title="COP view"
            aria-pressed={selectedView === "cop"}
            onClick={() => toggleView("cop")}
          >
            COP
          </button>
          
        </div>
      </div>
      <div className='flex items-center h-6 opacity-70'>
        <AussieLiftsLogoInline color="#000" />
      </div>
    </div>
  );
}
