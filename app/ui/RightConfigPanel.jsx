"use client";
import React, { useState } from "react";
import { useCustomisation } from "@/contexts/customisation";
import { DoorOpen, Square, Sun, Hand, Layers, Gauge, X, Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SectionHeader = ({ title }) => (
  <div className="flex items-center justify-between">
    <p className="text-xs uppercase tracking-wider text-gray-500">{title}</p>
    <span className="text-gray-400">▾</span>
  </div>
);

// Generic swatch card used across image and color selections
const SwatchCard = ({ selected, onClick, imageSrc, color, title }) => (
  <button
    onClick={onClick}
    title={title}
      className={`relative aspect-square ${selected ? "ring-2 ring-green-500 ring-offset-2 ring-offset-white" : "ring-0"}`}
    aria-pressed={selected}
  >
    {/* inner gap between outline and content */}
      <div className="absolute inset-0 rounded-sm overflow-hidden flex items-center justify-center border border-1 border-[#d4d4d4]">
      {imageSrc ? (
        <img src={`/${imageSrc}`} alt={title || ""} className="w-full h-full object-cover" />
      ) : (
        <span className="w-full h-full" style={{ backgroundColor: color }} />
      )}
    </div>
    {/* selection indicator */}
    <span className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white flex items-center justify-center border border-1 border-[#d4d4d4]">
      <span className={`w-2 h-2 rounded-full ${selected ? "bg-black" : "bg-transparent"}`} />
    </span>
  </button>
);

const CategoryItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 text-sm ${
      active ? "text-gray-900" : "text-gray-600"
    }`}
    aria-pressed={active}
  >
    <Icon size={16} className={active ? "text-gray-900" : "text-gray-500"} />
    <span>{label}</span>
  </button>
);

export default function RightConfigPanel() {
  const [activeTab, setActiveTab] = useState("WALLS");
  const [materialOpen, setMaterialOpen] = useState(true);
  const [lightOpen, setLightOpen] = useState(true);
  const [shadowOpen, setShadowOpen] = useState(true);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const {
    // Walls
    wall_material,
    wall_materials,
    setWallMaterial,
    wallLighting,
    setWallLighting,
    wall_shadow,
    wall_shadows,
    setWallShadow,
    // Door
    door_model,
    door_models,
    setDoorModel,
    door_colour,
    door_colours,
    setDoorColour,
  showDoor,
  setShowDoor,
  // COP
  cop_colour,
  setCopColour,
    // Handrail
    handrail_model,
    handrail_models,
    setHandrailModel,
    handrail_colour,
    handrail_colours,
    setHandrailColour,
    // Floor
    floor_material,
    floor_materials,
    setFloorMaterial,
    // Ceiling
    ceiling_material,
    ceiling_materials,
    setCeilingMaterial,
    ceiling_shadow,
    ceiling_shadows,
    setCeilingShadow,
  } = useCustomisation();

  return (
    <aside className="flex h-full w-3/12 md:w-[360px] lg:w-[400px] bg-white border-l border-gray-200 shadow-xl z-20 flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">{activeTab[0] + activeTab.slice(1).toLowerCase()}</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          title={showCategoryMenu ? "Close" : "Open menu"}
          onClick={() => setShowCategoryMenu((v) => !v)}
        >
          {showCategoryMenu ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Category list dropdown (animated) */}
      <AnimatePresence initial={false}>
        {showCategoryMenu && (
          <motion.div
            key="category-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="px-4 py-2 border-b border-gray-100 bg-white"
          >
            <CategoryItem icon={DoorOpen} label="Door Options" active={activeTab === "DOOR"} onClick={() => { setActiveTab("DOOR"); setShowCategoryMenu(false); }} />
            <CategoryItem icon={Square} label="Walls" active={activeTab === "WALLS"} onClick={() => { setActiveTab("WALLS"); setShowCategoryMenu(false); }} />
            <CategoryItem icon={Sun} label="Ceiling" active={activeTab === "CEILING"} onClick={() => { setActiveTab("CEILING"); setShowCategoryMenu(false); }} />
            <CategoryItem icon={Hand} label="Handrail" active={activeTab === "HANDRAIL"} onClick={() => { setActiveTab("HANDRAIL"); setShowCategoryMenu(false); }} />
            <CategoryItem icon={Layers} label="Lift Flooring" active={activeTab === "FLOOR"} onClick={() => { setActiveTab("FLOOR"); setShowCategoryMenu(false); }} />
            <CategoryItem icon={Gauge} label="Car Operating Panel" active={activeTab === "COP"} onClick={() => { setActiveTab("COP"); setShowCategoryMenu(false); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content: WALLS */}
      {activeTab === "WALLS" && (
      <>
      <div className="px-5 py-4 border-b border-gray-100">
        <button className="w-full" onClick={() => setMaterialOpen((v) => !v)}>
          <SectionHeader title="Material" />
        </button>
        <AnimatePresence initial={false}>
          {materialOpen && (
            <motion.div
              key="walls-material"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <p className="mt-3 text-sm text-gray-800">{wall_material?.name || "Select"}</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {wall_materials.map((m, i) => (
                  <SwatchCard
                    key={i}
                    selected={wall_material?.name === m.name}
                    onClick={() => setWallMaterial(m)}
                    imageSrc={m.image}
                    title={m.name}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  </div>

  {/* Wall light section */}
      <div className="px-5 py-4 border-b border-gray-100">
        <button className="w-full" onClick={() => setLightOpen((v) => !v)}>
          <SectionHeader title="Wall Light" />
        </button>
        <AnimatePresence initial={false}>
          {lightOpen && (
            <motion.div
              key="walls-light"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="mt-3 flex items-center gap-3">
                <div className="flex rounded-md border border-gray-300 overflow-hidden">
                  <button
                    className={`px-4 py-1 text-xs ${!wallLighting ? "bg-black text-white" : "bg-white text-gray-700"}`}
                    onClick={() => setWallLighting(false)}
                  >
                    NO
                  </button>
                  <button
                    className={`px-4 py-1 text-xs ${wallLighting ? "bg-black text-white" : "bg-white text-gray-700"}`}
                    onClick={() => setWallLighting(true)}
                  >
                    YES
                  </button>
                </div>
                <div className="flex-1 h-8 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-[11px] text-gray-400">Intensity (placeholder)</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  </div>

      {/* Shadowline section */}
      <div className="px-5 py-4 border-b border-gray-100">
        <button className="w-full" onClick={() => setShadowOpen((v) => !v)}>
          <SectionHeader title="Shadowline" />
        </button>
        <AnimatePresence initial={false}>
          {shadowOpen && (
            <motion.div
              key="walls-shadowline"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <p className="mt-3 text-sm text-gray-800">{wall_shadow?.name || "Select"}</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {wall_shadows.map((s, i) => (
                  <SwatchCard
                    key={i}
                    selected={wall_shadow?.name === s.name}
                    onClick={() => setWallShadow(s)}
                    color={s.color}
                    title={s.name}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  </div>
  </>
  )}

      {/* Content placeholders for other tabs */}
      {activeTab === "DOOR" && (
        <div className="px-5 py-4 space-y-4">
          <div>
            <SectionHeader title="Model" />
            <div className="mt-3 flex gap-2">
              <button
                className={`px-3 py-1 text-xs rounded border ${door_model === door_models[1].model ? "border-green-500 text-green-600" : "border-gray-300 text-gray-700"}`}
                onClick={() => setDoorModel(door_models[1].model)}
              >
                Sliding
              </button>
              <button
                className={`px-3 py-1 text-xs rounded border ${door_model === door_models[0].model ? "border-green-500 text-green-600" : "border-gray-300 text-gray-700"}`}
                onClick={() => setDoorModel(door_models[0].model)}
              >
                Swing
              </button>
            </div>
          </div>
          <div>
            <SectionHeader title="Visibility" />
            <div className="mt-3 flex items-center gap-3">
              <div className="flex rounded-md border border-gray-300 overflow-hidden">
                <button
                  className={`px-4 py-1 text-xs ${showDoor ? "bg-black text-white" : "bg-white text-gray-700"}`}
                  onClick={() => setShowDoor(true)}
                >
                  SHOW
                </button>
                <button
                  className={`px-4 py-1 text-xs ${!showDoor ? "bg-black text-white" : "bg-white text-gray-700"}`}
                  onClick={() => setShowDoor(false)}
                >
                  HIDE
                </button>
              </div>
            </div>
          </div>
          <div>
            <SectionHeader title="Colour" />
            <div className="mt-3 grid grid-cols-4 gap-3">
              {door_colours.map((c, i) => (
                <SwatchCard
                  key={i}
                  selected={door_colour?.name === c.name}
                  onClick={() => setDoorColour(c)}
                  color={c.color}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "HANDRAIL" && (
        <div className="px-5 py-4 space-y-4">
          <div>
            <SectionHeader title="Model" />
            <div className="mt-3 flex gap-2">
              {handrail_models.map((m, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 text-xs rounded border ${handrail_model === m.model ? "border-green-500 text-green-600" : "border-gray-300 text-gray-700"}`}
                  onClick={() => setHandrailModel(m.model)}
                >
                  {m.model.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader title="Colour" />
            <div className="mt-3 grid grid-cols-4 gap-3">
              {handrail_colours.map((c, i) => (
                <SwatchCard
                  key={i}
                  selected={handrail_colour?.name === c.name}
                  onClick={() => setHandrailColour(c)}
                  color={c.color}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "FLOOR" && (
        <div className="px-5 py-4">
          <SectionHeader title="Material" />
          <p className="mt-3 text-sm text-gray-800">{floor_material?.name || "Select"}</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {floor_materials.map((m, i) => (
              <SwatchCard
                key={i}
                selected={floor_material?.name === m.name}
                onClick={() => setFloorMaterial(m)}
                imageSrc={m.image}
                title={m.name}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "CEILING" && (
        <>
          <div className="px-5 py-4 border-b border-gray-100">
            <button className="w-full" onClick={() => setMaterialOpen((v) => !v)}>
              <SectionHeader title="Material" />
            </button>
            <AnimatePresence initial={false}>
              {materialOpen && (
                <motion.div
                  key="ceiling-material"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <p className="mt-3 text-sm text-gray-800">{ceiling_material?.name || "Select"}</p>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {ceiling_materials.map((m, i) => (
                      <SwatchCard
                        key={i}
                        selected={ceiling_material?.name === m.name}
                        onClick={() => setCeilingMaterial(m)}
                        imageSrc={m.image}
                        title={m.name}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="px-5 py-4 border-b border-gray-100">
            <button className="w-full" onClick={() => setShadowOpen((v) => !v)}>
              <SectionHeader title="Shadow" />
            </button>
            <AnimatePresence initial={false}>
              {shadowOpen && (
                <motion.div
                  key="ceiling-shadow"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <p className="mt-3 text-sm text-gray-800">{ceiling_shadow?.name || "Select"}</p>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {ceiling_shadows.map((s, i) => (
                      <SwatchCard
                        key={i}
                        selected={ceiling_shadow?.name === s.name}
                        onClick={() => setCeilingShadow(s)}
                        color={s.color}
                        title={s.name}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {activeTab === "COP" && (
        <div className="px-5 py-4 space-y-4">
          <div>
            <SectionHeader title="Colour" />
            <p className="mt-3 text-sm text-gray-800">{cop_colour?.name || "Select"}</p>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {door_colours.map((c, i) => (
                <SwatchCard
                  key={i}
                  selected={cop_colour?.name === c.name}
                  onClick={() => setCopColour(c)}
                  color={c.color}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="mt-auto" />
    </aside>
  );
}
