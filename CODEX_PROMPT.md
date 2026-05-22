# Sacred Dust Editor — Next.js Conversion Task
(Build a Next.js app that ports the existing standalone HTML WebGL editor.)

## Source Material
- `editor-source.html` in repo root — the original 1056-line standalone HTML editor
- This is a WebGL particle system editor with a Three.js scene, GSAP animations, and an interactive UI.

## Architecture (MANDATORY)
Use Next.js App Router (`app/` directory). The structure must be:

```
sacred-dust-next/
├── app/
│   ├── page.tsx                    # Main editor page — layout + state management
│   ├── layout.tsx                  # Already exists — keep it, add metadata
│   ├── globals.css                 # Already exists — add sacred-dust CSS vars
│   ├── components/
│   │   ├── EditorLayout.tsx        # Root layout: sidebar + canvas + top bar
│   │   ├── Sidebar.tsx             # Left sidebar control panel with sliders
│   │   ├── TopBar.tsx              # Preset buttons, save/load/export/queue
│   │   ├── WebGLCanvas.tsx         # R3F <Canvas> wrapper for the WebGL scene
│   │   ├── DustScene.tsx           # The actual Three.js scene (Points + ShaderMaterial)
│   │   ├── presets/
│   │   │   ├── PresetButton.tsx    # Individual preset button component
│   │   │   └── presets.ts          # Preset definitions (Dark Merkaba, Warm Logo, Ethereal Sphere, CRT Heavy, Minimal)
│   │   ├── controls/
│   │   │   ├── ControlGroup.tsx    # Collapsible control group
│   │   │   ├── SliderControl.tsx   # Individual slider with label + value
│   │   │   └── ColorPicker.tsx     # Hex color input
│   │   └── fps-counter/
│   │       └── FPSCounter.tsx      # FPS display overlay
│   ├── hooks/
│   │   ├── useDustEngine.ts        # Main dust engine: creates Points, ShaderMaterial, updates uniforms
│   │   ├── useGeometry.ts          # Generates particle positions/normals/randoms (Fibonacci sphere, Merkaba, etc.)
│   │   └── usePresets.ts           # Preset save/load/delete logic (localStorage)
│   ├── lib/
│   │   ├── shaders.ts              # GLSL vertex + fragment shaders
│   │   ├── geometry.ts             # Geometry generators (fibonacci sphere, merkaba, etc.)
│   │   ├── defaults.ts             # Default uniform values
│   │   └── types.ts                # TypeScript types for all configs/uniforms
│   └── configs/
│       └── .gitkeep                # Directory for saved preset JSONs
├── public/
│   └── .gitkeep
├── next.config.ts
├── tailwind.config.ts              # Add sacred-dust custom colors
└── package.json                    # Already has next, react, three, gsap
```

## Key Features to Port

### 1. WebGL Renderer
- Port the complete Three.js scene from `editor-source.html`
- Use React Three Fiber (`@react-three/fiber`), not raw Three.js renderer
- Points-based rendering with `THREE.Points` + `THREE.ShaderMaterial`
- The scene has uniforms: `uTime`, `uActivity`, `uChaos`, `uFlow`, `uPointSize`, `uGlowIntensity`, `uRGBSplit`, `uColor`, `uCRTfrequency`, `uCRTVertical`, etc.
- Mouse interaction: screen-space NDC hover + click repulsion

### 2. Control Sidebar
- **DUST ENGINE:** uActivity, uChaos, uFlow, uPointSize, uGlowIntensity, uRGBSplit, uColor (hex)
- **CRT OVERLAY:** uCRTfrequency, uCRTVertical
- Each slider live-updates the WebGL scene via uniform refs

### 3. Top Bar
- Preset buttons: Dark Merkaba, Warm Logo, Ethereal Sphere, CRT Heavy, Minimal
- "Saved presets" dropdown (localStorage)
- "Save Preset" button — saves current config to localStorage
- "Delete" button
- "Export Config" — downloads current config as JSON
- "Queue Render" — writes config to `public/configs/pending.json` (or `app/configs/pending.json`)

### 4. Preset System
- 5 built-in presets hardcoded in `presets.ts`
- User can save additional presets to localStorage
- Presets set uniforms all at once with GSAP animation for smooth transitions

### 5. Styling
- Dark theme with CSS variables from the original editor
- `--bg: #0a0a0a`, `--panel: #141414`, `--panel-2: #191919`, `--line: #2a2a2a`, `--text: #e0e0e0`, `--muted: #898989`, `--accent: #d5b26f`, `--accent-dark: #6f5728`, `--danger: #c65f5f`
- Use Tailwind with these custom colors configured in `tailwind.config.ts`

### 6. Geometry Sources
Start with Fibonacci Sphere (the default from the original editor). Make the geometry generator extensible.

## Shader Requirements
Port ALL shader logic from the original editor. The vertex shader must include:
1. Simplex noise displacement (3D)
2. Screen-space mouse interaction (hover repulsion + click explosion)
3. Flowing sand effect

The fragment shader must include:
1. Gold color palette
2. RGB split chromatic aberration
3. CRT scanner overlay
4. Edge fade with dithering
5. Additive blending for glow

## Performance Requirements
- 60 FPS maintained with 60K particles
- Use `useFrame` callback for uniform updates (don't use `useEffect` + `setInterval`)
- `depthWrite: false`, `transparent: true` for Points material
- FPS counter top-right of canvas

## Data Flow
1. `page.tsx` holds top-level state (current config)
2. Config changes update uniform refs (not React state — uniforms are refs to avoid re-renders)
3. `DustScene.tsx` receives uniform refs and applies them in `useFrame`
4. Sidebar receives config + setter, updates config
5. Top bar triggers preset loads (via GSAP tweening)

## TypeScript Requirements
- All files must be `.tsx` or `.ts`
- Define interfaces in `lib/types.ts`:
  - `DustConfig` — all uniform values
  - `Preset` — name + config
  - `GeometryType` — union of supported geometries
  - `GeometryBuffers` — positions/normals/randoms/count

## DO NOT
- Do NOT use `useMemo` for geometry creation (causes remounts)
- Do NOT use `useState` for uniform values (use `useRef` for Three.js uniforms)
- Do NOT create a monolithic 1000+ line component (split per the architecture above)
- Do NOT use Next.js Image component for WebGL stuff
- Do NOT change the repo location or remote

## After Building
1. `npm run build` must succeed
2. Commit everything with message: `feat: port sacred dust editor to Next.js`
3. Push to origin/main

Read `editor-source.html` carefully and port ALL functionality. The original is 1056 lines — make the Next.js version equivalent or better.

## Brand Context
This is the z33energy / Akult Inc. sacred dust visual editor. The particle system renders golden (alchemical gold #d5b26f) sacred geometry with noise-driven displacement, screen-space mouse interaction, and CRT overlay. Each particle is sub-pixel sized with additive blending for a cloud-like ethereal aesthetic.
