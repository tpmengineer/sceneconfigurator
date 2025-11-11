"use client";
import React, { useState, useEffect } from "react";
import { useCustomisation } from "@/contexts/customisation";
import { DoorOpen, Square, Sun, Hand, Layers,  X, Menu, SquareArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SectionHeader = ({ title }) => (
  <div className="flex items-center justify-between">
    <p className="text-xs uppercase tracking-wider text-gray-500">{title}</p>
    <span className="text-gray-400">▾</span>
  </div>
);

// Generic swatch card used across image and color selections
const SwatchCard = ({ selected, onClick, imageSrc, color, title }) => {
  const name = (title || '').toLowerCase();

  // Simple brushed metal previews for stainless/aluminium without needing image assets
  const isStainless = name.includes('stainless');
  const isAluminium = name.includes('aluminium') || name.includes('aluminum');

  // Build a CSS background that looks metallic
  const metalBackground = isStainless
    ? {
        backgroundImage:
          'linear-gradient(135deg, #8f96a0 0%, #c7cbd1 45%, #8a9098 55%, #d4d8de 100%), repeating-linear-gradient(0deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px)',
        backgroundBlendMode: 'soft-light, normal',
      }
    : isAluminium
    ? {
        backgroundImage:
          'linear-gradient(135deg, #c9cfd6 0%, #eef1f4 45%, #c1c7cf 55%, #f5f7f9 100%), repeating-linear-gradient(0deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1px, rgba(0,0,0,0.04) 1px, rgba(0,0,0,0.04) 2px)',
        backgroundBlendMode: 'soft-light, normal',
      }
    : null;

  return (
    <button
      onClick={onClick}
      title={title}
      className={`relative aspect-square ${selected ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-white' : 'ring-0'}`}
      aria-pressed={selected}
    >
      {/* inner gap between outline and content */}
      <div className="absolute inset-0 rounded-sm overflow-hidden flex items-center justify-center border border-1 border-[#d4d4d4]">
        {imageSrc ? (
          <img src={`/${imageSrc}`} alt={title || ''} className="w-full h-full object-cover" />
        ) : metalBackground ? (
          <span className="w-full h-full" style={metalBackground} />
        ) : (
          <span className="w-full h-full" style={{ backgroundColor: color }} />
        )}
      </div>
      {/* selection indicator */}
      <span className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white flex items-center justify-center border border-1 border-[#d4d4d4]">
        <span className={`w-2 h-2 rounded-full ${selected ? 'bg-black' : 'bg-transparent'}`} />
      </span>
    </button>
  );
};

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
  const [activeTab, setActiveTab] = useState("DOOR");
  const [materialOpen, setMaterialOpen] = useState(true);      // Walls material (first dropdown open by default)
  const [lightOpen, setLightOpen] = useState(true);             // Walls light (expanded by default)
  const [shadowOpen, setShadowOpen] = useState(true);           // Walls shadowline (expanded by default)
  const [doorModelOpen, setDoorModelOpen] = useState(true);     // Door model (first dropdown)
  const [doorColourOpen, setDoorColourOpen] = useState(true);
  const [handrailModelOpen, setHandrailModelOpen] = useState(true); // Handrail model (first dropdown)
  const [handrailColourOpen, setHandrailColourOpen] = useState(true); // Handrail colour (expanded by default)
  const [floorOpen, setFloorOpen] = useState(true);             // Floor material (first dropdown)
  const [ceilingMaterialOpen, setCeilingMaterialOpen] = useState(true); // Ceiling material (first dropdown)
  const [ceilingShadowOpen, setCeilingShadowOpen] = useState(true); // Ceiling shadow (expanded by default)
  const [copOpen, setCopOpen] = useState(true);                 // COP colour (first dropdown)
  const [showCategoryMenu, setShowCategoryMenu] = useState(true);
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
  door_colours_current,
    setDoorColour,
  showDoor,
  setShowDoor,
  // COP
  cop_colour,
  cop_colours,
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
    // Scene view
    activeView,
    setActiveView,

  } = useCustomisation();

  // Helper to format the header title; keep COP fully uppercase
  const formatTabTitle = (tab) => (tab === "COP" ? "COP" : tab[0] + tab.slice(1).toLowerCase());

  // Workflow: tab order and camera view mapping
  const TAB_ORDER = ["DOOR", "WALLS", "CEILING", "FLOOR", "HANDRAIL", "COP"];
  const VIEW_BY_TAB = {
    DOOR: "door",
    WALLS: "walls",
    CEILING: "ceiling",
    HANDRAIL: "handrail",
    FLOOR: "floor",
    COP: "cop",
  };
  const TAB_BY_VIEW = {
    door: "DOOR",
    walls: "WALLS",
    ceiling: "CEILING",
    handrail: "HANDRAIL",
    floor: "FLOOR",
    cop: "COP",
  };
  const getNextTab = (current) => {
    const idx = TAB_ORDER.indexOf(current);
    return TAB_ORDER[(idx + 1) % TAB_ORDER.length];
  };
  const handleNext = (current) => {
    const next = getNextTab(current);
    // Dispatch camera change to the next tab's relevant view
    const view = VIEW_BY_TAB[next] || "default";
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("scene-set-view", { detail: view }));
    }
    // Update global active view immediately for UI reflect
    if (typeof setActiveView === "function") {
      setActiveView(view);
    }
    setActiveTab(next);
    setShowDoor(false);
  };

  // Sync active tab when a view is activated from SceneNav or elsewhere
  useEffect(() => {
    if (!activeView || activeView === "default") return;
    const nextTab = TAB_BY_VIEW[activeView];
    if (nextTab && nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  }, [activeView]);

  return (
  <aside className="flex h-full max-h-screen overflow-y-auto w-3/12 md:w-[360px] lg:w-[400px] bg-white border-l border-gray-200 shadow-xl z-20 flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">{formatTabTitle(activeTab)}</h2>
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
            <CategoryItem icon={DoorOpen} label="Door Options" active={activeTab === "DOOR"} onClick={() => { setActiveTab("DOOR"); }} />
            <CategoryItem icon={Square} label="Walls" active={activeTab === "WALLS"} onClick={() => { setActiveTab("WALLS"); }} />
            <CategoryItem icon={Sun} label="Ceiling" active={activeTab === "CEILING"} onClick={() => { setActiveTab("CEILING"); }} />
            <CategoryItem icon={Hand} label="Handrail" active={activeTab === "HANDRAIL"} onClick={() => { setActiveTab("HANDRAIL"); }} />
            <CategoryItem icon={Layers} label="Lift Flooring" active={activeTab === "FLOOR"} onClick={() => { setActiveTab("FLOOR"); }} />
            <CategoryItem icon={SquareArrowUp} label="Car Operating Panel" active={activeTab === "COP"} onClick={() => { setActiveTab("COP"); }} />
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
        {/* Header to match screenshot: icon + uppercase label + thin rule (clickable to collapse) */}
        <button className="w-full" onClick={() => setLightOpen((v) => !v)}>
          <div className="flex items-center gap-2">
            <Sun size={16} className="text-gray-700" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-gray-900">Wall Light</span>
            <div className="ml-2 flex-1 border-t border-gray-200" />
          </div>
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
              <div className="mt-3">
                {/* Segmented control to match screenshot: selected is white/elevated, unselected sits on light grey */}
                <div className="inline-flex rounded-[2px] bg-gray-100 p-1">
                  <button
                    className={`px-6 py-2 text-[12px] uppercase tracking-[0.2em] transition-colors ${
                      !wallLighting
                        ? "bg-white text-black shadow-sm ring-1 ring-gray-200"
                        : "bg-transparent text-gray-600"
                    }`}
                    onClick={() => setWallLighting(false)}
                    aria-pressed={!wallLighting}
                  >
                    NO
                  </button>
                  <button
                    className={`px-6 py-2 text-[12px] uppercase tracking-[0.2em] transition-colors ${
                      wallLighting
                        ? "bg-white text-black shadow-sm ring-1 ring-gray-200"
                        : "bg-transparent text-gray-600"
                    }`}
                    onClick={() => setWallLighting(true)}
                    aria-pressed={wallLighting}
                  >
                    YES
                  </button>
                </div>
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
  <div className="px-5 py-4 flex justify-end">
    <button
      className="inline-flex items-center border-2 border-black px-6 py-2 text-[12px] tracking-[0.2em] uppercase bg-white text-black hover:bg-black hover:text-white transition-colors"
      onClick={() => handleNext("WALLS")}
    >
      {`Next / ${getNextTab("WALLS").toLowerCase()}`}
    </button>
  </div>
  </>
  )}

      {/* Content placeholders for other tabs */}
      {activeTab === "DOOR" && (
        <div className="px-5 py-4 space-y-4">
          <div>
            <button className="w-full" onClick={() => setDoorModelOpen((v) => !v)}>
              <SectionHeader title="Model" />
            </button>
            <AnimatePresence initial={false}>
              {doorModelOpen && (
                <motion.div
                  key="door-model"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="mt-3"
                >
                  <div className="flex gap-2">
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* <div>
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
          </div> */}
          <div>
            <button className="w-full" onClick={() => setDoorColourOpen((v) => !v)}>
              <SectionHeader title="Colour" />
            </button>
            <AnimatePresence initial={false}>
              {doorColourOpen && (
                <motion.div
                  key="door-colour"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {door_colours_current.map((c, i) => (
                      <SwatchCard
                        key={i}
                        selected={door_colour?.name === c.name}
                        onClick={() => setDoorColour(c)}
                        color={c.color}
                        title={c.name}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="px-5 py-4 flex justify-end">
            <button
              className="inline-flex items-center border-2 border-black px-6 py-2 text-[12px] tracking-[0.2em] uppercase bg-white text-black hover:bg-black hover:text-white transition-colors"
              onClick={() => handleNext("DOOR")}
            >
              {`Next / ${getNextTab("DOOR").toLowerCase()}`}
            </button>
          </div>
        </div>
      )}

  {activeTab === "HANDRAIL" && (
        <div className="px-5 py-4 space-y-4">
          <div>
            <button className="w-full" onClick={() => setHandrailModelOpen((v) => !v)}>
              <SectionHeader title="Model" />
            </button>
            <AnimatePresence initial={false}>
              {handrailModelOpen && (
                <motion.div
                  key="handrail-model"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="mt-3"
                >
                  <div className="flex gap-2">
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div>
            <button className="w-full" onClick={() => setHandrailColourOpen((v) => !v)}>
              <SectionHeader title="Colour" />
            </button>
            <AnimatePresence initial={false}>
              {handrailColourOpen && (
                <motion.div
                  key="handrail-colour"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="px-5 py-4 flex justify-end">
            <button
              className="inline-flex items-center border-2 border-black px-6 py-2 text-[12px] tracking-[0.2em] uppercase bg-white text-black hover:bg-black hover:text-white transition-colors"
              onClick={() => handleNext("HANDRAIL")}
            >
              {`Next / ${getNextTab("HANDRAIL").toLowerCase()}`}
            </button>
          </div>
        </div>
      )}

  {activeTab === "FLOOR" && (
        <div className="px-5 py-4">
          <button className="w-full" onClick={() => setFloorOpen((v) => !v)}>
            <SectionHeader title="Material" />
          </button>
          <AnimatePresence initial={false}>
            {floorOpen && (
              <motion.div
                key="floor-material"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>
          <div className="px-5 py-4 flex justify-end">
            <button
              className="inline-flex items-center border-2 border-black px-6 py-2 text-[12px] tracking-[0.2em] uppercase bg-white text-black hover:bg-black hover:text-white transition-colors"
              onClick={() => handleNext("FLOOR")}
            >
              {`Next / ${getNextTab("FLOOR").toLowerCase()}`}
            </button>
          </div>
        </div>
      )}

      {activeTab === "CEILING" && (
        <>
          <div className="px-5 py-4 border-b border-gray-100">
            <button className="w-full" onClick={() => setCeilingMaterialOpen((v) => !v)}>
              <SectionHeader title="Material" />
            </button>
            <AnimatePresence initial={false}>
              {ceilingMaterialOpen && (
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
            <button className="w-full" onClick={() => setCeilingShadowOpen((v) => !v)}>
              <SectionHeader title="Shadow" />
            </button>
            <AnimatePresence initial={false}>
              {ceilingShadowOpen && (
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

          <div className="px-5 py-4 flex justify-end">
            <button
              className="inline-flex items-center border-2 border-black px-6 py-2 text-[12px] tracking-[0.2em] uppercase bg-white text-black hover:bg-black hover:text-white transition-colors"
              onClick={() => handleNext("CEILING")}
            >
              {`Next / ${getNextTab("CEILING").toLowerCase()}`}
            </button>
          </div>
        </>
      )}

  {activeTab === "COP" && (
        <div className="px-5 py-4 space-y-4">
          <div>
            <button className="w-full" onClick={() => setCopOpen((v) => !v)}>
              <SectionHeader title="Colour" />
            </button>
            <AnimatePresence initial={false}>
              {copOpen && (
                <motion.div
                  key="cop-colour"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <p className="mt-3 text-sm text-gray-800">{cop_colour?.name || "Select"}</p>
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {cop_colours.map((c, i) => (
                      <SwatchCard
                        key={i}
                        selected={cop_colour?.name === c.name}
                        onClick={() => setCopColour(c)}
                        color={c.color}
                        title={c.name}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* <div className="pt-2">
            <button className="w-full px-3 py-2 text-sm rounded bg-black text-white" onClick={() => handleNext("COP")}>
              Next: Door
            </button>
          </div> */}
        </div>
      )}

      {/* Spacer */}
      <div className="mt-auto" />
    </aside>
  );
}
