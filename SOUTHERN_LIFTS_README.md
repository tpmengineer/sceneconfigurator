# Southern Lifts Configurator — Build Blueprint

This document is a complete architectural blueprint for building a **new 3D lift configurator for southernlifts.com.au**, derived from an assessment of the existing Aussie Lifts configurator (this repo). It is written so a fresh session can scaffold a working **skeleton with placeholder primitives** (no GLB models yet) in a brand-new project, without needing to read this codebase.

**Key differences from the Aussie Lifts app:**
1. Multiple lift models (the entire Southern Lifts range), not one hard-coded "Phoenix" car — the app must be model-driven from day one.
2. Different doors per model.
3. All 3D geometry starts as parametric Three.js primitives (boxes, extrudes); GLBs get swapped in later per component.

---

## 1. Assessment of the source app (what to keep, fix, drop)

### What works well (carry over)
- **Single React Context as the source of truth** for every configurable option (materials, colours, models, dimensions, view state). UI panels and 3D components both consume the same hook (`useCustomisation()`). Simple, no Redux/Zustand needed at this scale.
- **Parametric primitive geometry.** The entire lift car frame (left/right/back/floor/roof frames, floor panel, wall panels, shadowlines, battens) is built from `<boxGeometry>` and `THREE.ExtrudeGeometry` driven by `width` / `depth` / `height` / `travel` numbers. Live dimension sliders "just work" because geometry is math, not baked meshes. **This is the model for the new skeleton.**
- **Custom-shader material system** for powdercoat / stainless / brushed metal finishes (`ShaderMaterial` with fresnel + noise grain + pseudo-env gradients). Looks good without HDR env maps and is cheap. Portable as-is.
- **Wall/ceiling LED lighting trick:** an emissive extruded "picture frame" ring sits 9 mm behind each wall panel (`emissiveIntensity: 2`) plus a Bloom post-processing pass (`luminanceThreshold: 2`) — reads as backlit panels with zero real lights.
- **Shadowline trick:** a paper-thin (0.55 mm) extruded rectangle-with-rectangular-hole behind each panel, coloured by the selected shadowline colour, creates panel gap lines.
- **Guided workflow UI:** right-hand panel with category tabs (Door → Walls → Ceiling → Floor → Handrail → COP), each with collapsible sections of swatch grids, and a "Next" button that advances the tab **and** flies the camera to the relevant preset view. Tabs and camera stay in sync both ways.
- **Constrained presentation camera:** `PresentationControls` (drei) with clamped polar/azimuth ranges instead of free OrbitControls; zoom implemented as GSAP-tweened camera `z` clamped to `[2.5, 12]`; named preset views expressed as small Euler rotations of the controls group.

### What is brittle (fix in the rewrite)
- **One hard-coded lift model.** "Phoenix" framing components, dimensions and door choices are baked into the scene graph. The new app needs a **model registry** (section 8).
- **Hooks called inside loops/`forEach`** (`useTexture` inside `generateWallMaterialProps`) — violates Rules of Hooks; it only works because array order is static. Replace with a single `useTexture` call over a map, or per-material components.
- **DOM `CustomEvent`s (`scene-set-view`, `scene-zoom-in/out`, `scene-reset`) bridge UI → Canvas.** It works but is stringly-typed and untestable. Keep the *pattern* (it cleanly decouples DOM UI from the R3F tree) but centralise event names in one constants module — or better, put camera intent (`activeView`, `zoomLevel`) in the context and have the scene react to it.
- **Dead code everywhere:** ~40% of the scene file is commented-out shaft/batten/door experiments. Bare `//shaft`-style comments inside JSX actually render as text nodes (a live bug). Start clean.
- **Bugs to not replicate:** `setDoorModel[1]` (indexing a function — no-op), a `setInterval` poll waiting for the camera ref, missing `key` props on some mapped groups, `useMemo` calls with no dependency array in `laminex.jsx`.
- **Package cruft:** both `@react-three/fiber` **and** the dead legacy `react-three-fiber` v6 package are installed; `leva`, `lil-gui`, `axios`, `papaparse`, `react-player`, `react-youtube`, `bowser` are unused or dev-only. Don't carry these into the new project.
- **Quote flow posts EmailJS credentials from the client** (service/template/user IDs hard-coded in `save_button.jsx`). Fine for MVP, but plan a `/api/quote` route in Next instead.
- **Everything metric-ish but implicit:** units are metres, but slider min/max live in context state (`minWidth` etc.) with magic numbers. Make per-model dimension limits part of the model registry.

---

## 2. Tech stack

```
next            14.x  (App Router)
react / react-dom 18
three           ^0.167
@react-three/fiber ^8.17          (React 18-compatible line)
@react-three/drei  ^9.111         (PresentationControls, useGLTF, useTexture, Environment)
@react-three/postprocessing ^2.19 (EffectComposer + Bloom)
gsap            ^3.12             (camera + car/shaft animations; public gsap is fine, the
                                   source app used the club build but uses no club plugins)
framer-motion   ^11               (UI panel expand/collapse animations only — never in Canvas)
tailwindcss     ^3.4
lucide-react                      (UI icons)
```

Notes:
- If starting fresh you may instead use `next 15 / react 19 / @react-three/fiber v9 / drei v10` — the architecture is identical — but the versions above are the proven-working set from the source app. Pick one line and stay on it.
- No TypeScript in the source app's 3D code (`.jsx`); the new project should use TS (`.tsx`) for the registry/state layer at minimum — the option schema (section 5) benefits enormously from types.
- `tsconfig` path alias `@/*` → project root is used pervasively (`@/contexts/...`, `@/experience/...`).

---

## 3. Project structure (target for the new app)

```
southernlifts-configurator/
├── app/
│   ├── layout.tsx              # wraps everything in <CustomisationProvider>
│   ├── page.tsx                # full-viewport shell: <Scene/> + UI overlays
│   ├── globals.css
│   └── ui/                     # DOM overlay components (Tailwind, no three.js)
│       ├── TopBar.tsx              # back link + "Request quote" CTA
│       ├── RightConfigPanel.tsx    # tabbed option panel (the main UI)
│       ├── SceneNav.tsx            # bottom-left: door show/hide + preset view buttons
│       ├── VerticalZoomControls.tsx# +/− /reset buttons (dispatch zoom events)
│       ├── ModelSelector.tsx       # NEW: pick which Southern Lifts model to configure
│       ├── SwatchCard.tsx          # shared swatch button (image or colour)
│       └── RequestQuoteModal.tsx   # email capture -> sends config summary
├── configurator/
│   ├── models.ts               # ★ MODEL REGISTRY (section 8) — the heart of the app
│   ├── options.ts              # shared option catalogues (floor/wall materials, colours…)
│   └── events.ts               # scene event name constants + typed dispatch helpers
├── contexts/
│   └── customisation.tsx       # provider + useCustomisation() hook
├── experience/                 # everything inside <Canvas>
│   ├── Scene.tsx               # Canvas, lights, Bloom, PresentationControls, camera rig
│   ├── LiftCar.tsx             # composes one car from parts, driven by active model
│   ├── parts/                  # parametric primitives (w/d/h props, metres)
│   │   ├── FramePost.tsx, FrameRail.tsx   # generic box members
│   │   ├── SideFrame.tsx, BackFrame.tsx, FloorFrame.tsx, RoofFrame.tsx
│   │   ├── WallPanel.tsx       # extruded rounded-rect panel + optional LED backing
│   │   ├── CeilingPanel.tsx
│   │   ├── Shadowline.tsx      # thin extrude with rectangular hole
│   │   ├── FloorPanel.tsx      # thin textured box
│   │   ├── Handrail.tsx        # PLACEHOLDER: torus/cylinder assembly
│   │   ├── COP.tsx             # PLACEHOLDER: thin box + emissive button dots
│   │   └── doors/
│   │       ├── SwingDoor.tsx   # PLACEHOLDER: hinged box panel + handle cylinder
│   │       └── SlideDoor.tsx   # PLACEHOLDER: two overlapping sliding box panels
│   └── shaders/
│       ├── powdercoatShader.ts # port verbatim from source app
│       ├── stainlessShader.ts  # port verbatim
│       └── metalShader.ts      # port verbatim
└── public/
    └── materials/              # swatch textures (walls/, floor/) — copy or re-shoot
```

Rule of thumb from the source app that must be preserved: **`app/ui/` components never import three.js; `experience/` components never render DOM.** They meet only at the context and the event constants.

---

## 4. Scene conventions (units, origin, dimensions)

All units are **metres**. The lift car is centred at the world origin.

```
height (car internal)  h = 2.1            (fixed)
width  (car internal)  w = slider         (e.g. 0.9 – 1.1, per model)
depth  (car internal)  d = slider         (e.g. 1.3 – 1.4, per model)
travel                     = slider        (e.g. 2.8, used for shaft height)
ground                 = -h/2 - 0.1        (floor level below car centre)
shaft width            = w + 0.5
shaft depth            = d + 0.5
shaft height           = travel + 2.35 + ground + 0.1
```

Layout of one car (all positions derived from w/d/h):
- **Floor panel** at `y = -h/2`, a `w × 0.002 × d` box.
- **Wall panels** (left/right/back): extruded rounded-rect shapes of size `(w or d) × (h - 0.05)`, placed just inside the frame planes (offsets of ±0.00055 to prevent z-fighting with the shadowline behind them). Back wall omitted when `isDualEntry`.
- **Shadowlines**: one per wall + ceiling, `depth: 0.00055` extrude, outer = wall size, cutout = size − 0.15.
- **LED backing** (when lighting on): second extrude 9 mm behind the panel, emissive `#FFF3DA`, intensity 2.
- **Frames**: box members `0.02 × 0.04` cross-section arranged as posts/rails around each face (see `experience/framing_phoenix_*.jsx` in the source for exact member layout — for the skeleton, a simpler 4-post + top/bottom-rail frame per face is fine).
- **Door** sits at `z = shaft_depth/2 − 0.2`, `y = ground + 0.1` (i.e. hung at floor level of the entry face).
- **COP** on the right wall interior at roughly `[w/2 − 0.016, 0.5, d/2 − 0.4]`.
- **Handrail** on the left wall at `[−w/2 + 0.02, −h/2 + 0.9, 0]` (900 mm rail height).
- Front face of the car is **+Z**; the camera default looks at the origin from `[0, 0.5, 5]`.

The "shaft" (external structure: rings, posts, battens spaced 0.4/0.6 m vertically with door-opening exclusion zones) exists in the source app but is fully commented out except a GSAP show/hide hook. For the skeleton: model the shaft as an **optional group** that GSAP-slides up out of frame (`y: 50`, 2 s, `power2.inOut`) when `showCarOnly` is true — same mechanism, primitive geometry.

---

## 5. State model (the customisation context)

One provider (`CustomisationProvider` in `contexts/customisation.tsx`) wrapping the whole app in `layout.tsx`. Everything below is `useState` inside it, exposed via `useCustomisation()`.

```ts
// ---- NEW for Southern Lifts: active model drives everything else
activeModel: LiftModelId            // e.g. 'model-a' | 'model-b' | ... (see registry)

// ---- selections (objects from the option catalogues, not just ids)
floor_material:   { name, texture, image }        // texture = filename stem
wall_material:    { name, texture, image }
ceiling_material: same shape (source app reuses the wall catalogue)
wall_shadow:      { name, color }                 // shadowline colour
ceiling_shadow:   { name, color }
handrail_model:   string                          // 'Shaft and Post' | 'Returned'
handrail_colour:  { name, color, metalness, roughness }
door_model:       string                          // 'swing' | 'slide' (per-model set)
door_colour:      { name, color, metalness, roughness }
cop_colour:       same shape

// ---- booleans
showCarOnly: boolean      // hides/raises the shaft
wallLighting: boolean     // LED backing on side walls
hideReturns: boolean      // front return frames
isDualEntry: boolean      // opens the back wall, second door
showDoor: boolean         // door visibility (auto-hidden in focus views)

// ---- dimensions (metres) + per-model limits
width, depth, travel: number
minWidth, maxWidth, minDepth, maxDepth: number   // ← derive from model registry

// ---- camera/view sync
activeView: 'default' | 'door' | 'walls' | 'ceiling' | 'floor' | 'handrail' | 'cop'
```

Two behaviours worth porting exactly:
- **Colour-set filtering per door model:** swing doors offer powdercoat white/black; sliding doors offer stainless/black. A `useEffect` resets `door_colour` to the first valid option whenever the model switch makes the current selection invalid. Generalise this: every dependent option gets a validity effect.
- **Option objects (not indices) are stored in state**, so 3D components can read `.color` / `.texture` / `.metalness` directly.

For Southern Lifts, add one more effect: **when `activeModel` changes, clamp/reset dimensions and re-validate every selection** against that model's allowed option sets.

---

## 6. Camera & view system

- `<Canvas dpr={[1,2]} camera={{ position: [0, 1.5, 8], fov: 50 }}>`; the real camera ref is captured in `onCreated` and animated with GSAP (always calling `camera.lookAt(target)` in `onUpdate`).
- Model sits inside `<PresentationControls global speed={1.5} zoom={1.1} rotation={pcRotation} polar={[-π/12, π/6]} azimuth={[-π/6, π/6]} snap={snapEnabled} config={{ mass:1, tension:100, friction:26 }}>`. The user can nudge-rotate the whole car within those limits; it springs back when a focus view is locked.
- **Preset views** = a rotation Euler for the controls group + a camera `z` distance:

| view     | rotation [x, y, z]   | camera z |
|----------|----------------------|----------|
| default  | [0, 0, 0]            | 5.0      |
| walls    | [0.12, −0.22, 0]     | 5.0      |
| ceiling  | [−0.25, 0, 0]        | 4.2      |
| door     | [0.15, 0, 0]         | 3.2      |
| floor    | [−0.12, 0.08, 0]     | 3.0      |
| cop      | [0.10, 0.28, 0]      | 3.2      |
| handrail | [0.18, −0.28, 0]     | 3.2      |

- **Events** (dispatched on `window`, listened to inside the scene component):
  - `scene-set-view` (detail = view name) — from SceneNav buttons and the panel's "Next" button
  - `scene-zoom-in` / `scene-zoom-out` — ±0.5 on camera z, clamped [2.5, 12], 0.3 s tween
  - `scene-reset` — camera and rotation back to default, unlocks controls
- Selecting any non-default view **hides the door** (`setShowDoor(false)`) so the interior is visible, and locks rotation (snap springs back to the preset). A pointer-drag beyond 4 px on the canvas unlocks back to `default`. Mouse wheel zooms via the same clamped-z tween (listener on the canvas element, `preventDefault` to stop page scroll).
- Two-way sync: `activeView` in context ⇄ active tab in the right panel (changing either updates the other).

Lighting/post (whole rig, deliberately minimal):
```jsx
<EffectComposer><Bloom intensity={0.5} luminanceThreshold={2} luminanceSmoothing={0.2}/></EffectComposer>
<ambientLight intensity={1} />
<pointLight position={[2, 5, 5]} intensity={0.5} distance={10} decay={0} />
```
The interior "glow" comes from the emissive LED extrudes + Bloom, not from lights. Keep it this way — it's the app's signature look and it's cheap.

---

## 7. Materials & shaders

Three tiers, in order of use:

1. **Texture swatches** (walls, ceiling, floor): plain `meshStandardMaterial` with a `map` from `useTexture('/materials/walls/<stem>.jpg')`. Wall maps use `MirroredRepeatWrapping`, `repeat(1, 0.5)`, `offset(0.5, 0.5)`; floor maps use `NearestFilter` and per-material repeats (e.g. carpet `repeat(5,2)`). The 2D swatch in the UI is the *same image file* — one asset per material, listed once in the option catalogue (`{ name, texture, image }`).
2. **Simple parameterised standard materials** (handrail, fallbacks): colour + metalness + roughness straight off the selected option object, rebuilt in `useMemo` keyed on the selection.
3. **Custom `ShaderMaterial`s** for hero metal finishes — port these three files verbatim, they are self-contained:
   - `powdercoatShader.js` — matte grain (hash noise over UV), fresnel rim, vertical pseudo-env gradient, fake lambert shadowing. Exposes `createPowdercoatMaterial()`, `getPowdercoatPreset(name, hex)` (with a white variant), `applyPowdercoatPreset(mat, preset)`, `isPowdercoatSelection(name)`.
   - `stainlessShader.js` — brushed-metal look without env maps.
   - `metalShader.js` — generic bright metal for hardware (handles, tracks).
   Selection logic (from the door components): if the chosen colour name contains "powdercoat" → powdercoat shader with preset; if it's "Stainless Steel" → stainless shader; else → standard material tinted with the option's colour. Materials are created once in `useMemo` and mutated via uniforms in a `useEffect` on selection change — **no material re-creation per change**.

---

## 8. Model registry (the core new abstraction)

This is the main architectural change vs. the source app. Everything model-specific becomes data:

```ts
// configurator/models.ts
export interface LiftModelDef {
  id: string;
  name: string;                       // display name, e.g. from Southern Lifts range
  description: string;
  // dimension envelope (metres)
  dims: {
    width:  { min: number; max: number; default: number };
    depth:  { min: number; max: number; default: number };
    travel: { min: number; max: number; default: number };
    height: number;                   // fixed internal height
  };
  // which door types this model supports, and their colour sets
  doors: Array<{
    type: string;                     // 'swing' | 'slide' | model-specific
    component: 'SwingDoor' | 'SlideDoor' | string;   // maps to a component
    colours: ColourOption[];
  }>;
  // feature flags per model
  features: {
    dualEntry: boolean;
    wallLighting: boolean;
    handrail: boolean;
    shaftVisualisation: boolean;
  };
  // option catalogues (can reference shared sets or model-specific ones)
  wallMaterials: MaterialOption[];
  floorMaterials: MaterialOption[];
  shadowlineColours: ColourOption[];
  copColours: ColourOption[];
  handrailModels: string[];
  handrailColours: ColourOption[];
}

export const LIFT_MODELS: Record<string, LiftModelDef> = {
  // TODO: populate with the actual Southern Lifts range (one entry per lift model).
  // Start the skeleton with 2–3 placeholder entries with different dimension
  // envelopes and door sets to prove the switching architecture, e.g.:
  'residential-a': { /* compact home lift: swing door, 0.9–1.1 w */ },
  'residential-b': { /* larger home lift: slide door, dual entry */ },
  'commercial-a':  { /* commercial: slide door, bigger envelope */ },
};
```

`LiftCar.tsx` reads `LIFT_MODELS[activeModel]` and composes the parts accordingly; `RightConfigPanel` renders option grids from the same definition. **No component may hard-code a model name.** Adding a Southern Lifts model then = one registry entry + (later) its GLB door/detail components.

A `ModelSelector` UI (landing choice or a dropdown in the TopBar) sets `activeModel`, which resets dimensions to the model defaults and re-validates all selections.

---

## 9. Placeholder primitives (skeleton phase — no GLBs)

The source app uses GLBs only for: doors (`phoenix_door.glb`, `orion_door.glb`), handrail (`handrail.glb`), COP (`cop.glb`), the backdrop wall (`wall_sample.glb`), and shaft posts. Everything else is already primitives. Skeleton replacements:

| Component | Placeholder primitive spec |
|---|---|
| **SwingDoor** | Group at the entry face: door panel `boxGeometry [0.8·w, 2.0, 0.04]` hinged on one edge (offset the geometry so rotation.y swings it open — nice demo), handle = `cylinderGeometry` r 0.015 × 0.15 mounted vertically, small glass inset = transparent box (`roughness 0.12, opacity 0.9, depthWrite:false`). Panel uses the door material selection logic (section 7). |
| **SlideDoor** | Two panels `[0.45·w, 2.0, 0.03]` overlapping, plus a header track box `[w, 0.08, 0.06]`; optional GSAP slide-open on click. Stainless shader by default. |
| **COP** | Faceplate box `[0.09, 0.35, 0.01]` on the right wall + column of 4–5 emissive dot cylinders (r 0.008) + a tiny emissive "display" box at top. Faceplate takes `cop_colour` via the same material selection logic. |
| **Handrail (Shaft & Post)** | Horizontal cylinder r 0.019, length `d − 0.2`, at rail height, with 2–3 short cylinder standoffs (r 0.01, length 0.05) to the wall. |
| **Handrail (Returned)** | Same rail but ends curve back to the wall — approximate with two quarter-torus (`torusGeometry args={[0.05, 0.019, 12, 8, Math.PI/2]}`) elbows + short return cylinders. |
| **Backdrop wall** | Big plane or thin box behind/around the car (e.g. 6 × 3 m) with a neutral `#d8d8d8` standard material and a rectangular opening in front of the car (build from 4 boxes or an extrude-with-hole) so the car is seen "installed". |
| **Shaft posts/battens** (optional) | 4 corner boxes `[0.09, shaft_height, 0.09]` + horizontal batten boxes `[shaft_width, 0.04, 0.04]` every 0.6 m, skipping door-opening ranges `[0.1, 2.2]` and `[travel+0.1, travel+2.3]` on the entry face. |

Keep the props contract from day one: every part takes `{ w, d, h }` (or explicit `width/height/position/rotation`) so GLB versions can later drop in behind the same interface.

---

## 10. UI shell

- **`page.tsx`**: full-viewport `main` (`h-[100vh] overflow-hidden`, neutral `#adadad` background); Canvas fills the remaining space with `TopBar` (top), `SceneNav` + `VerticalZoomControls` + `RequestQuoteFloat` overlaid absolute inside the canvas area, and `RightConfigPanel` as a fixed right sidebar (`w-[360-400px]`, white, border-l, shadow). Track `window.innerHeight` for mobile viewport correctness.
- **`RightConfigPanel`**: header (current tab title + hamburger toggling the category list), category list (Door / Walls / Ceiling / Handrail / Lift Flooring / Car Operating Panel — with lucide icons), then per-tab collapsible sections (framer-motion height/opacity, 0.2 s easeOut). Sections contain 3–4-column grids of `SwatchCard`s (aspect-square button; image swatch or flat colour; ring highlight + dot indicator when selected). Bottom of each tab: `Next / <next tab>` button → advances the tab, dispatches the matching camera view, hides the door.
  - Tab order & view mapping: `DOOR→door, WALLS→walls, CEILING→ceiling, FLOOR→floor, HANDRAIL→handrail, COP→cop`.
  - **Add for Southern Lifts:** a Dimensions section (width/depth/travel sliders bound to the registry envelope) and the model selector. The source app has sliders built (`slider.jsx`, `SliderAdvanced.jsx`) but currently not wired into the visible panel.
- **`SceneNav`** (bottom-left pill): door show/hide toggle + one small button per preset view; clicking an active view returns to `default`.
- **`VerticalZoomControls`**: + / − / reset buttons dispatching the zoom events.
- **Quote flow**: modal capturing email, then sends the whole config summary (every selection name + dimensions) — source app uses EmailJS client-side; new app should do it via a Next API route. Include `activeModel` in the payload.

---

## 11. Skeleton build order (suggested phases for the new session)

1. **Scaffold**: `create-next-app` (App Router, Tailwind, TS) + install the 3D deps (section 2). Add `@/*` alias. Empty `CustomisationProvider` wired into `layout.tsx`.
2. **Canvas + camera rig**: `Scene.tsx` with lights, Bloom, PresentationControls, GSAP camera, event listeners (port the handlers from section 6). A test box to verify.
3. **Model registry + context**: `models.ts` with 2–3 placeholder models, full option state per section 5, model-switch validation effects.
4. **Parametric car**: floor panel → wall panels (extruded rounded rects) → shadowlines → LED backing → frames. Verify width/depth sliders reshape everything live.
5. **Placeholder details**: doors (swing + slide), COP, handrail (both styles), backdrop wall — per section 9 specs, wired to their option selections.
6. **Shaders**: port the three shader files; wire the door/COP/handrail material-selection logic.
7. **UI shell**: RightConfigPanel with all tabs + Next-workflow, SceneNav, zoom controls, model selector, dimension sliders.
8. **Polish**: showCarOnly/shaft animation, dual-entry toggle, quote modal stub.

### Acceptance checklist for the skeleton
- [ ] Switching lift model changes dimension limits, door options, and re-renders the car without stale selections.
- [ ] Width/depth/travel sliders reshape the car and shaft live.
- [ ] Every tab's swatches visibly change the 3D scene instantly.
- [ ] "Next" walks Door→Walls→Ceiling→Floor→Handrail→COP with camera flying to each view; door auto-hides in focus views; dragging unlocks back to default.
- [ ] Wall lighting toggle produces the LED glow (emissive + bloom).
- [ ] Dual entry removes the back wall; swing/slide door types render different placeholder geometry with their own colour sets.
- [ ] No console errors, no Rules-of-Hooks violations, no text nodes leaking into the Canvas.

---

## 12. Gotchas learned from the source app

- **Never put bare `//` comments or stray strings inside R3F JSX** — they become text nodes in the scene graph and throw/render garbage. Use `{/* */}`.
- Keep tiny **z-offsets (0.00055–0.009 m)** between coplanar panels/shadowlines/LED layers or you'll get z-fighting at exactly the panel gaps you're trying to show.
- Mutate shader uniforms / material properties in effects; **don't recreate materials on every selection change** (texture/GPU churn).
- `useTexture` must be called an identical number of times every render — drive it from a static catalogue, never from filtered/conditional lists.
- GSAP + R3F: animate refs (`camera.position`, `group.position`), call `lookAt` in `onUpdate`; never tween React state per frame.
- drei's `PresentationControls` `rotation` prop is spring-interpolated on change — that's what makes the preset views feel animated for free.
- `dpr={[1, 2]}` and StandardMaterial-based glass (opacity, `depthWrite:false`) instead of physical transmission keep it fast on laptops/tablets — this app is a sales tool, it will be opened on mediocre hardware.
- Wrap the provider **outside** `<html>` works (source app does it) but wrap it inside `<body>` in the new app to be spec-correct.

---

*Source of truth for anything unclear: the Aussie Lifts configurator repo (`aussieliftsconfigurator`), especially `contexts/customisation.jsx` (state), `experience/car_configurator.jsx` (scene + camera), `experience/laminex.jsx` / `shadowline.jsx` / `floor_panel.jsx` (panel construction), `experience/shaders/*` (finishes), and `app/ui/RightConfigPanel.jsx` (workflow UI).*
