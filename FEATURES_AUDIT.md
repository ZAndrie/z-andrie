# FEATURES_AUDIT.md

Reference: https://diallo.digital/ · Audited 2026-10-27 · Target: z-andrie (Next.js 16 portfolio)

## 0. Method and limits (read first)

I had **no interactive browser tool** in this session. I could not scroll, hover, click, resize, or screenshot the live site. The audit is a **static analysis** of what the server sends:

- the HTML shell (`/`)
- the minified JS bundles: `index-*.js` (app), `animation-*.js` (GSAP + Lenis), `r3f-*.js`, `postprocessing-*.js`, `three-*.js`
- the CSS bundle
- `site.webmanifest`, `og.jpg`

Each finding is tagged:

- **[Confirmed]**: read directly from code, CSS, or markup.
- **[Inferred]**: deduced from code. The visual result was not observed.
- **[Unverified]**: could not be checked statically. Needs a human look in a real browser.

Per-element hover behavior, exact timings, and visual feel are mostly [Inferred] or [Unverified]. Section 9 lists what I'd like you to eyeball.

## 1. Stack [Confirmed]

| Layer | Finding |
|---|---|
| Build | **Vite + Rolldown** SPA (`rolldown-runtime`). The HTML is an empty `<div id="root">`, so content is client-rendered. There is a `<noscript>` fallback with a text bio. |
| UI | React 19 (React DOM with resource hints). State is in a small global store (zustand-like `k(e => e.chapter)` selectors). |
| 3D | **Three.js** with **React Three Fiber** (`r3f` chunk). Raw `<mesh>`, `<points>`, `<pointLight>` JSX, **no drei** detected. |
| Post-processing | A dedicated `postprocessing` chunk (94 KB). The EffectComposer/Bloom class names were not found by name, so the exact effects are [Unverified]. |
| Animation | **GSAP 3** and **Lenis 3.15.0** (in the `animation` chunk). Plus a CSS `IntersectionObserver` reveal system (`reveal-ready` and `is-in` classes). No Framer Motion. |
| Audio | **Procedural Web Audio API** (oscillators, filtered noise buffers, no audio files): hum, clicks, chimes. A "Sound on/off" toggle. |
| Fonts | Big Shoulders Stencil (display), IBM Plex Sans (text), IBM Plex Mono (UI/HUD), Inter Tight 800 (rasterised for shadow text), Caveat (handwritten "UV ink"). The font stylesheet is intentionally render-blocking, because the intro covers the wait. |
| SEO | `theme-color #070605`, canonical, OG and Twitter large-image card (**1200×630 `og.jpg`**, 55 KB), JSON-LD `Person` schema, web manifest, `apple-touch-icon`. |

Bundle weight: about 330 KB app JS, 243 KB r3f, 132 KB animation, 94 KB postprocessing, plus three. The 3D scene is **not** lazy-loaded; it is the whole site.

## 2. Concept and art direction

**Concept ("Penumbra", the localStorage key `penumbra:secrets`) [Confirmed]:** a dark room lit by one pendant lamp. Floating dust particles cast a shadow on a back wall, and that shadow forms words ("DIALLO" and other text). The portfolio is "read by lamplight" (the OG alt text says so). Scroll moves through "chapters". A **UV/blacklight** mode reveals hidden handwritten text on the wall. A **projector** mode is used for the Work section.

**Palette [Confirmed]:**

| Token | Value |
|---|---|
| `--night` | `#070707` |
| `--night-2` | `#0c0c0c` |
| `--ink` | `#e7e5df` |
| `--dim` | `#e7e5dfa8` |
| `--faint` | `#e7e5df6b` |
| `--line` | `#e7e5df24` |
| `--lit` (lamp warm) | `#f2dcb4` |
| `--alert` | `#ff6159` |

The scene materials are warm browns and greys (`#786c5f` wall, `#26231f` metal, `#e8d2ae` lamp light).

**Layout system [Confirmed]:**

- `--gutter: clamp(18px, 2.6vw, 40px)`
- `--inset: clamp(0, 8.4vw, 150px)`
- Easing: `--ease-out: cubic-bezier(.16, 1, .3, 1)` and `--ease-io: cubic-bezier(.76, 0, .24, 1)`
- Breakpoints: `900px`, `560px`, `(hover: none)`, `prefers-reduced-motion`
- Display type is huge and condensed. HUD and UI text is small mono.

## 3. Sections, in order [Confirmed from the chapter table]

| # | id | Title | 3D mode | Contents |
|---|---|---|---|---|
| – | intro | Preloader | – | See §4.1 |
| 01 | `hero` | Home | shadow | Name and role in a fixed HUD. A visually hidden `<h1>`. Hint text ("point the lamp at the wall"). "Start a project" CTA. A "Scroll" cue with a line. |
| 02 | `craft` | Craft | shadow | "Disciplines" cards (title, sub, body) with staggered delays. A facts list (`dl`). A tech stack chip list. The hint changes by device: "hold the mouse down" on desktop, "tap UV up top" on touch. |
| 03 | `work` | Work | projector | A **pinned (sticky) section** whose height is `projects × N + 100vh`. A numbered counter with an odometer digit roll (`01 / 05`) and ←/→ key hints. One project card at a time (links: Open, View app or Visit site, Source). A numbered project list as buttons. A progress bar (`scaleX`). Archived projects show a disabled "Archived" label. |
| 04 | `path` | Experience | shadow | Also pinned, with a timeline of roles. A vertical timeline of buttons (`is-active` and `is-past`). A card per role with bullet points. |
| 05 | `hello` | Contact | shadow | A split text-reveal heading ("Tell me what / you're building"), where each line sits in an overflow-hidden span. An email link plus a **Copy** button that shows "Copied ✓". A validated contact form with a sending state. A **cord to switch the lamp off**. An outro line. |

Persistent HUD: brand (name and role), menu button (full-screen menu), **Sound on/off** with an animated equaliser, **UV** toggle, secrets counter toast, and "Back to the start".

## 4. Animations and interactions

### 4.1 Intro and loading [Confirmed]

- A full-screen black intro with a top bar (`diallo.digital` and `2026`).
- Centered **pull-cord** control labelled "Loading", then "Pull the cord to switch on the lamp" once assets are ready.
- A progress or glow value (`glow = loaded%`) drives the cord's brightness.
- **The user must pull or click the cord** to enter. This gesture also unlocks the AudioContext, which browsers require. Then the lamp turns on and the room fades up through a `#veil` overlay.
- The cord is draggable (`cursor: grab` and `grabbing`, a `--pull` CSS var) and has a keyboard-accessible bead button.

### 4.2 Scroll model [Confirmed / Inferred]

- **Lenis 3.15** smooth scroll with a custom `scrollTo` (duration 1.6 s, easing `1 - (1-t)^4`). It falls back to `window.scrollTo` and respects reduced motion.
- A **store** holds `chapter`, `index` (sub-step inside pinned sections), and `phase` (`live`, `off`, and so on). Chapters set the 3D `mode`.
- Pinned sections (`work`, `path`) use tall wrappers with `position: sticky` inner stages. Scroll position maps to the sub-index (`no('work', N)`). It does **not** use ScrollTrigger pin.
- Items fade in via `IntersectionObserver`, which adds `.is-in` and then unobserves. The root gets `reveal-ready` only if IO exists (progressive enhancement).
- Keyboard: arrow keys move through work items, plus a hidden terminal (see §4.5).

### 4.3 Text and UI motion [Confirmed keyframes: `rise`, `fade-up`, `eq`, `nudge`, `drip`, `toast`]

- Line-by-line mask reveals (`.line > span` translating up).
- Staggered discipline cards (`animation-delay: i%2 × 0.12s`).
- Odometer counter (`translateY(-n×10%)` on a `0123456789` strip).
- Toasts for the secrets system.

### 4.4 Cursor [Confirmed from CSS]

- `cursor: none !important` on the scene (a custom light or lamp cursor is likely).
- `--mx` and `--my` CSS vars follow the pointer, used by `.lamplight` radial glow overlays (`lamplight--warm`).
- Native cursors are kept for text (`text`), the cord (`grab` and `grabbing`), and loading (`progress`).
- On `(hover: none)`: cursor effects off, and a **DeviceOrientation** handler (`ja()`) lets tilting the phone act as pointer input. [Inferred]

### 4.5 Easter eggs [Confirmed]

- A **hidden terminal**. Commands include `work`, `path`, `lamp on|off`, `uv`, `sound on|off`, `shadow <word>`, `morse <text>`, `secrets`, `hire`, `email`, `coffee`, `clear`, `exit`.
- A secrets tracker (`n/total`) persisted in localStorage.
- Others: `morse`, `bulb` ("you broke it", from 6 rapid cord pulls within 8 s), `puppets`, "disco", a robot screen, a CRT-style `uDegauss` shader.

## 5. The 3D / WebGL scene

### Renderer [Confirmed]

- R3F `<Canvas>` with `shadows: { type: 1 }` (PCF), camera at `[0, 1, 7.4]`, **fov 34**, near 0.1, far 40.
- `gl: { antialias: false, powerPreference: "high-performance", stencil: false }`
- `outputColorSpace: srgb`, `toneMapping: 0` (none).
- A `webglcontextlost` handler calls `preventDefault`.
- An error boundary around the Canvas sets a flag to drop the scene. The fallback is `null`.

### Objects and lighting [Confirmed / Inferred]

- A **wall** (a `planeGeometry` 14×8 with `meshStandardMaterial` `#786c5f`, roughness .68, with a procedural **bump map**) and a floor plane.
- A **pendant lamp**: cord (`cordGeo`), cone shade (custom material, `renderOrder 10`, `raycast: null`), and a `pointLight` (`#e8d2ae`, distance 6, decay 1.4) whose intensity is animated from 0 when the lamp is switched on.
- Furniture or props: a metal rod (cylinder, metalness .6), a glider, and robot and puppet props. These are inferred from the secrets and the string "I'm partial to the glider."
- A **CRT screen shader** (`uMap`, `uTime`, `uGlow`, `uDegauss`) for the robot screen.
- A **dust particle `<points>` system** with a custom shader. Uniforms: `uCos`, `uPower`, `uPixel`, and a camera-relative light cone. Dust drifts, is stirred by the pointer (`stir`, `stirKick`), and **settles** (`dustSettled`).
- Dust particles **cast a shadow word** onto the wall. Words are rasterised from Inter Tight 800 onto a texture, and shadow maps are 1024² (low-power) or 2048² (otherwise). `shadowDirty` triggers re-render of the shadow only when the word changes. The word "coherence" (`lampCoherence`, `coherence`) controls how readable the shadow is, depending on where the lamp points. [Inferred]
- The `work` chapter uses **projector** mode (`projector` 0→1 reduces `uPower` by up to 60%), so project imagery or text is projected. [Inferred]

### Input response [Confirmed / Inferred]

- Pointer position steers the lamp or beam aim (`aim`, `beam`, `pointer` in the store). **Pressing or holding the mouse** triggers UV (also the UV toggle and a `uvLatch`).
- Scroll chapter changes drive `mode`, `focus`, and `power` uniforms.
- Mobile: tilt via DeviceOrientation, with touch-hold or a UV button in place of mouse-down.

## 6. Performance and fallback strategy [Confirmed]

This is the most reusable part, and it matches your Step 4 goals closely:

- `O.lowPower` = `hardwareConcurrency ≤ 4` **or** `deviceMemory ≤ 4` **or** viewport ≤ 640px.
- `O.integratedGpu` is detected via `WEBGL_debug_renderer_info` and a regex (`intel|uhd|iris|mali|adreno|powervr`).
- **DPR** = `min(devicePixelRatio, lowPower ? 1.25 : 1.75) × (integratedGpu ? 0.7 : 1)`. A `?dpr=` query override exists.
- Low power halves shadow-map resolution (2048→1024).
- `O.reduced` reads `prefers-reduced-motion`.
- A `visibilitychange` listener is used (to pause audio or the scene).
- Antialiasing is off, and `stencil` is off.
- Weaknesses to avoid copying: the scene is not lazy-loaded, the whole experience needs JS (SPA, no SSR), and the first paint is gated behind a user gesture and a blocking font stylesheet. That is bad for Lighthouse.

## 7. Navigation and mobile

- **Navigation** [Confirmed]: a fixed HUD, a full-screen menu (`hud__btn--menu`), numbered chapters (01–05), and `scrollTo(id)` with a 1.6 s ease. Brand click goes to `#hero`. The active chapter lives in the store, so it is visible in the UI.
- **Mobile** [Confirmed from CSS and JS]: `@media (width<=900px)` and `(width<=560px)` re-layout. `(hover:none)` swaps hints and UV controls. `lowPower` is forced at ≤640px. The device-tilt substitute exists. [Unverified] how the pinned sections feel on touch.
- **Accessibility** [Confirmed]: `sr-only` `<h1>`, `aria-labelledby` per section, `aria-hidden` on decorative layers, `aria-label` on controls, `aria-live="polite"` on the Copy button, `<noscript>` content, `prefers-reduced-motion` media block.

## 8. Gap analysis: reference vs. current z-andrie codebase

I read the repo (Next.js 16.2.11 App Router, React 19.2.4, Tailwind 4, `next dev --webpack`). Note that `node_modules` is **not installed** yet, so the Next 16 docs that `AGENTS.md` tells me to read are not available. I will run `npm install` and read `node_modules/next/dist/docs/` before writing any code.

| Feature | Reference | Current repo | Plan implication |
|---|---|---|---|
| Framework | Vite SPA | Next.js App Router (SSR/RSC) | The 3D scene must be a client-only `dynamic(..., { ssr: false })` island, which is **better** for SEO and LCP than the reference. |
| GSAP | Yes | Already installed (`gsap`, `@gsap/react`), used in Hero, About, Portfolio and others | Reuse. Add the ScrollTrigger plugin (ships with gsap). |
| Lenis | Yes | **Missing** | Add `lenis`. Note the layout currently sets `data-scroll-behavior="smooth"`, which may conflict, so it needs handling. |
| three / R3F / drei | three + r3f | **Missing** | Add `three`, `@react-three/fiber`. `drei` is optional (the reference didn't use it). I'd skip it unless needed, to save bundle size. |
| Framer Motion | No | Installed (`framer-motion`) | Candidate for route transitions. |
| Custom cursor | Light cursor | `CustomCursor.tsx` exists | Extend with hover states. |
| Preloader | Gesture-gated cord | `Preloader` skeleton (1.2 s) in `ClientUtilities.tsx` | Replace with a progress-based reveal. I will **not** gate on a click. |
| Particles | WebGL dust and shadow text | 2D DOM `TechParticles.tsx` | Replace or augment with WebGL points. Keep DOM version as the **fallback**. |
| Scroll progress | Bar plus counter | `ScrollProgress` exists | Restyle if needed. |
| SEO and OG | Complete, 1200×630 | Metadata exists, but OG points to `/image.jpg` (placeholder) | Generate a real 1200×630 OG image, add `themeColor` via `viewport`, JSON-LD. |
| Sound | Procedural | None | Optional. Not requested, so I'd leave it off by default. |

## 9. Recommended adaptation (for approval, no code written yet)

The reference concept ("dust that casts a shadow word under a lamp") is distinctive to that site. To avoid copying it, my proposal for **your** identity:

- **Hero concept:** a warm cream-and-terracotta (`#D4694F`) **particle field that morphs into "Z ANDRIE" (or your logo)**. The particles are sampled from a rasterised text or logo canvas. They are attracted or repelled by the pointer, shift gently with scroll, and **scatter into a loose drift** as you leave the hero. Rendered on a light background so it matches the editorial look.
- **Performance gates borrowed from §6:** the `hardwareConcurrency` and `deviceMemory` low-power check, a DPR cap of 1.5 (you asked for this, versus the reference's 1.75), an integrated-GPU factor, adjustable particle count (about 1.5k–6k), `visibilitychange` and `IntersectionObserver` pausing, a lazy dynamic import, disposal on unmount, and a `webglcontextlost` handler.
- **Fallback:** the existing DOM `TechParticles` or a static CSS hero when there is no WebGL, `prefers-reduced-motion` is set, or the 3D scene errors out.
- **Intro:** a progress preloader that reveals into the hero automatically. No click-gate, which is better for Lighthouse and for returning visitors.
- **Sticky project showcase:** the pinned counter, odometer, and list pattern from the reference's Work section, rebuilt for your `Works` page and data.

## 10. Needs a human eye (I could not observe these)

1. Exact intro timing, and what the cursor looks like.
2. Feel of the pinned Work and Experience scrubbing on desktop and on touch.
3. The visual look of the shadow words and UV text.
4. What the post-processing chunk actually does, if anything visible.
5. Real-device frame rate.

If you can screen-record the reference for 30–60 s, or add a browser tool, I can tighten §4 and §5.
