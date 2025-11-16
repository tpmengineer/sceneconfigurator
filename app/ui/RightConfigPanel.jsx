"use client";
import React, { useState, useEffect } from "react";
import { useCustomisation } from "@/contexts/customisation";
import { DoorOpen, Lightbulb, Square, SquareSquare, Sun, Hand, Layers,  X, Menu, SquareArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SectionHeader = ({ title }) => (
  <div className="flex items-center justify-between">
    <p className="text-xs uppercase tracking-wider text-gray-500">{title}</p>
  </div>
);

// Standardized header with icon + uppercase label + thin rule
const IconHeader = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2">
    <Icon size={16} className="text-gray-700" />
    <span className="text-[11px] uppercase tracking-[0.2em] text-gray-900">{label}</span>
    <div className="ml-2 flex-1 border-t border-gray-200" />
  </div>
);

// Image card used for door/handrail/COP; supports portrait or square aspect
const DoorImageCard = ({ selected, onClick, imageSrc, title, square = false }) => (
  <button
    onClick={onClick}
    title={title}
    className={`relative w-full overflow-hidden bg-white ${
      selected
        ? 'ring-[3px] ring-[#66a20b] border border-transparent'
        : 'ring-2 ring-transparent hover:ring-gray-400 hover:ring-offset-0 border border-[#d4d4d4]'
    } transition-colors`}
    aria-pressed={selected}
  >
    <span className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white flex items-center justify-center border border-1 border-[#d4d4d4]">
      <span className={`w-2 h-2 rounded-full ${selected ? 'bg-black' : 'bg-transparent'}`} />
    </span>
    <div className={`w-full ${square ? 'aspect-square' : 'aspect-[3/4]'} overflow-hidden flex items-center justify-center`}>
      <img src={`/${imageSrc}`} alt={title || ''} className="w-full h-full object-contain" />
    </div>
  </button>
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
      className={`relative aspect-square ${
        selected
          ? 'ring-[3px] ring-[#66a20b] ring-offset-2 ring-offset-white'
          : 'ring-2 ring-transparent hover:ring-gray-400 hover:ring-offset-0'
      } transition-colors`}
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

// Helper that renders an image if provided, otherwise a large colour block, using door-style framing
const DoorColourCard = ({ selected, onClick, imageSrc, color, title, square = false }) => {
  if (imageSrc) {
    return (
      <DoorImageCard selected={selected} onClick={onClick} imageSrc={imageSrc} title={title} square={square} />
    );
  }
  // Fallback to large swatch styled like a card
  return (
    <button
      onClick={onClick}
      title={title}
      className={`relative w-full overflow-hidden bg-white ${
        selected
          ? 'ring-[3px] ring-[#66a20b] ring-offset-2 ring-offset-white'
          : 'ring-2 ring-transparent hover:ring-gray-400 hover:ring-offset-0'
      } transition-colors`}
      aria-pressed={selected}
    >
      <span className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white flex items-center justify-center border border-1 border-[#d4d4d4]">
        <span className={`w-2 h-2 rounded-full ${selected ? 'bg-black' : 'bg-transparent'}`} />
      </span>
      <div className="w-full aspect-[3/4] overflow-hidden border border-1 border-[#d4d4d4]" style={{ backgroundColor: color || '#f3f4f6' }} />
    </button>
  );
};

const CategoryItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-sm ${
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

  // Ensure door is shown whenever Door tab becomes active
  useEffect(() => {
    if (activeTab === "DOOR") {
      if (typeof setShowDoor === "function") {
        setShowDoor(true);
      }
    }
  }, [activeTab]);

  return (
  <aside className="flex h-full max-h-screen overflow-y-auto w-4/12 md:w-[400px] lg:w-[500px] bg-white border-l border-gray-200 shadow-xl z-20 flex flex-col">
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
            className="bg-gray-50 px-4 py-2 border-b border-gray-100 bg-white"
          >
            <CategoryItem icon={DoorOpen} label="Door Options" active={activeTab === "DOOR"} onClick={() => { setActiveTab("DOOR"); }} />
            <CategoryItem icon={Square} label="Walls" active={activeTab === "WALLS"} onClick={() => { setActiveTab("WALLS"); }} />
            <CategoryItem icon={Sun} label="Ceiling" active={activeTab === "CEILING"} onClick={() => { setActiveTab("CEILING"); }} />
            <CategoryItem icon={Layers} label="Lift Flooring" active={activeTab === "FLOOR"} onClick={() => { setActiveTab("FLOOR"); }} />
            <CategoryItem icon={Hand} label="Handrail" active={activeTab === "HANDRAIL"} onClick={() => { setActiveTab("HANDRAIL"); }} />
            <CategoryItem icon={SquareArrowUp} label="Car Operating Panel" active={activeTab === "COP"} onClick={() => { setActiveTab("COP"); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content: WALLS */}
      {activeTab === "WALLS" && (
      <>
      <div className="px-5 py-4">
        <IconHeader icon={Square} label="Walls" />
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
  </div>

  {/* Wall light section */}
      <div className="px-5 py-4">
        <IconHeader icon={Lightbulb} label="Wall Light" />
        <div className="mt-3">
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
  </div>

      {/* Shadowline section */}
      <div className="px-5 py-4">
        <IconHeader icon={SquareSquare} label="Shadowline" />
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
            <IconHeader icon={DoorOpen} label="Door Options" />
            {/* Segmented control styling to match reference button look */}
            <div className="inline-flex rounded-[2px] bg-gray-100 p-1 mt-3
            ">
              <button
                className={`px-6 py-2 text-[13px] tracking-[0.02em] transition-colors ${
                  door_model === 'slide'
                    ? 'bg-white text-black shadow-sm ring-1 ring-gray-200'
                    : 'bg-transparent text-gray-600'
                }`}
                onClick={() => setDoorModel('slide')}
                aria-pressed={door_model === 'slide'}
              >
                Sliding Door
              </button>
              <button
                className={`px-6 py-2 text-[13px] tracking-[0.02em] transition-colors ${
                  door_model === 'swing'
                    ? 'bg-white text-black shadow-sm ring-1 ring-gray-200'
                    : 'bg-transparent text-gray-600'
                }`}
                onClick={() => setDoorModel('swing')}
                aria-pressed={door_model === 'swing'}
              >
                Swing Door
              </button>
            </div>
          </div>
          
          <div>
            {/* <IconHeader icon={DoorOpen} label="Door Colour" /> */}
            {/* Show only the current door model's options; image cards when available */}
            {(() => {
              const imageMap = {
                swing: {
                  'Powdercoat White': 'images/swing_door_white.webp',
                  'Powdercoat Black': 'images/swing_door_black.webp',
                },
                slide: {
                  'Stainless Steel': 'images/sliding_door_stainless.webp',
                  'Powdercoat Black': 'images/sliding_door_black.webp',
                },
              };
              const titleByModel = {
                swing: 'Powder Coated White',
                slide: 'Stainless',
              };
              const options = door_colours_current;
              return (
                <div className="mt-4">
                  <p className="mb-2 text-sm text-gray-800">{titleByModel[door_model]}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {options.map((c, i) => {
                      const isSelected = door_colour?.name === c.name;
                      const img = imageMap[door_model]?.[c.name] || null;
                      return (
                        <div key={i} className="flex flex-col gap-2">
                          <DoorColourCard
                            selected={isSelected}
                            onClick={() => setDoorColour(c)}
                            imageSrc={img}
                            color={c.color}
                            title={c.name}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
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
            <IconHeader icon={Hand} label="Handrail Options" />
            {(() => {
              const variants = [
                { model: 'Shaft and Post', name: 'Stainless Steel', image: 'images/renders/shaft-and-post-stainless.jpg' },
                { model: 'Shaft and Post', name: 'Powdercoat Black', image: 'images/renders/shaft-and-post-black.jpg' },
                { model: 'Returned', name: 'Stainless Steel', image: 'images/renders/returned-stainless.jpg' },
                { model: 'Returned', name: 'Powdercoat Black', image: 'images/renders/returned-black.jpg' },
              ];
              return (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {variants.map((v, i) => {
                    const isSelected = handrail_model === v.model && handrail_colour?.name === v.name;
                    const colourObj = handrail_colours.find((c) => c.name === v.name) || null;
                    return (
                      <DoorColourCard
                        key={`${v.model}-${v.name}`}
                        selected={isSelected}
                        onClick={() => {
                          setHandrailModel(v.model);
                          if (colourObj) setHandrailColour(colourObj);
                        }}
                        imageSrc={v.image}
                        color={colourObj?.color}
                        square
                        title={`${v.model} • ${v.name}`}
                      />
                    );
                  })}
                </div>
              );
            })()}
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
          <IconHeader icon={Layers} label="Floor Material" />
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
          <div className="px-5 py-4">
            <IconHeader icon={Square} label="Ceiling" />
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
          </div>

          <div className="px-5 py-4">
            <IconHeader icon={SquareSquare} label="Shadowline" />
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
            <IconHeader icon={SquareArrowUp} label="COP Colour" />
            <p className="mt-3 text-sm text-gray-800">{cop_colour?.name || "Select"}</p>
            {(() => {
              const copImages = {
                'Powdercoat White': 'images/renders/cop-white.jpg',
                'Powdercoat Black': 'images/renders/cop_black.jpg',
                Aluminium: 'images/renders/cop_aluminium.jpg',
              };
              return (
                <div className="mt-3 grid grid-cols-3 gap-4">
                  {cop_colours.map((c, i) => (
                    <DoorColourCard
                      key={i}
                      selected={cop_colour?.name === c.name}
                      onClick={() => setCopColour(c)}
                      imageSrc={copImages[c.name] || null}
                      color={c.color}
                      title={c.name}
                    />
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="mt-auto" />
    </aside>
  );
}
