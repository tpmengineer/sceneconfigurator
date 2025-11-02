"use client";
import React, { useState } from "react";
import AussieLiftsLogoInline from "@/app/ui/AussieLiftsLogoInline";
import { Box, Square, RotateCw, Hand as HandIcon, Ruler, Grid3x3, DoorOpen } from "lucide-react";
import { useCustomisation } from "@/contexts/customisation";

export default function SceneNav() {
  const [entry, setEntry] = useState("Entrance");
  const { showDoor, setShowDoor } = useCustomisation();
  return (
    <div className="absolute left-4 bottom-4 z-20 flex items-center gap-2">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur border border-gray-200 rounded-md shadow-sm px-2 py-1">
        <select
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="text-xs text-gray-700 bg-transparent outline-none px-2 py-1"
        >
          <option>Entrance</option>
          <option>Car</option>
          <option>Top</option>
        </select>
  <button className="p-2 hover:bg-gray-100 rounded" title="3D View"><Box size={16} /></button>
  <button className="p-2 hover:bg-gray-100 rounded" title="Ortho"><Square size={16} /></button>
  <button className="p-2 hover:bg-gray-100 rounded" title="Rotate"><RotateCw size={16} /></button>
  <button className="p-2 hover:bg-gray-100 rounded" title="Pan"><HandIcon size={16} /></button>
  <button className="p-2 hover:bg-gray-100 rounded" title="Measure"><Ruler size={16} /></button>
  <button className="p-2 hover:bg-gray-100 rounded" title="Grid"><Grid3x3 size={16} /></button>
  <button
    className={`p-2 rounded ${showDoor ? "hover:bg-gray-100" : "bg-black text-white"}`}
    title={showDoor ? "Hide Door" : "Show Door"}
    onClick={() => setShowDoor(!showDoor)}
  >
    <DoorOpen size={16} />
  </button>
        <button className="p-2 hover:bg-gray-100 rounded" title="Section">▦</button>
        <button className="p-2 hover:bg-gray-100 rounded" title="Dimensions">∑</button>
      </div>
      <div className='flex items-center h-6 opacity-70'>
        <AussieLiftsLogoInline color="#000" />
      </div>
    </div>
  );
}
