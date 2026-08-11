# Shape brief: Homepage — "The Materials Assemble"

## 1. Job and audience
Five buyer types (dealers, builders/contractors, architects/specifiers, government/tender, homeowners) land on the homepage needing to believe, within seconds, that The Global holds real standing inventory rather than backordering. The homepage's job is Persuade mode: design is the product, spectacle is only earned if it maps to the real differentiator.

## 2. Outcome and proof
Primary outcome: the visitor watches raw material (dust/particles) become a finished, navigable house, understands this as a literal metaphor for "we turn scattered supply into a finished site," and lands on real product/contact CTAs. Proof: every assembled system (pipes, tiles, fixtures) is a real hyperlink into the actual Astral/Somany catalogue — the spectacle doubles as navigation, not decoration layered on top of it.

## 3. Selected direction (per your Part 3/4)
- **Visual world**: Night Warehouse (dark, OKLCH `--void`/`--ember`/`--glaze`/`--bone`) on the homepage and brand pages; Daylight Dispatch (`--day`/`--day-ink`) on catalogue/form pages. This replaces the current "Raw to Structure" dark-void palette already on the homepage with your more specific fired-clay/kiln-glow OKLCH values — a token swap, not a structural rebuild, since the current direction is already dark/night-warehouse-adjacent.
- **Structural thesis**: five choreographed scroll beats (Arrival → Pipes → Tiles → Fixtures → Reveal) over a ~350–400vh track, each cohort of particles converging into real DOM/SVG geometry that solidifies and cross-fades in, per your Part 4.2 spec.
- **Focal moment**: Beat 5, camera pulls back to a complete, hyperlinked axonometric cutaway house.
- **Implementation consequence**: this replaces `ForgeScene.tsx`/`ForgeSequence.tsx` (built earlier this session) rather than extending them — the particle-to-real-geometry cross-fade architecture, the five-beat structure, and the OKLCH palette are different enough from the current build that this is a rebuild of the hero, not a patch.

## 4. Scope and boundaries
**Building, per your explicit choice to attempt the full spec:**
- GPU-instanced particle system (Three.js, raw WebGL — no new 3D-engine dependency), curl-noise-perturbed drift-to-target motion, per-cohort progress uniforms.
- Lenis for scroll-driving (new dependency — not currently in `package.json`).
- A build-time script that samples SVG target geometry into a baked position buffer (pipes/tiles/fixtures), run at build time, not runtime.
- Real DOM/SVG solidification for each system, cross-fading in as its cohort completes, hyperlinked.
- Hand-authored axonometric cutaway house SVG meeting your Part 4.4 spec (two-storey, cutaway front-right quadrant, three stroke weights, roof water tank, real 600×1200 tile grid, junction fittings on pipe runs).
- All four fallback tiers: full WebGL, no-WebGL/weak-GPU (staged SVG stroke-dash animation), `prefers-reduced-motion` (static finished house), mobile tap-through.
- Secondary particle echoes (H1 assembly, section-transition streams, digit-assembly stats — capped at three per page) and the 404 particle-pile moment.

**Explicitly not building in this pass** (flagging now, not silently): the daylight-theme rollout to `/products`, `/astral`, `/somany`, `/projects`, `/contact`, `/downloads`, `/dealers` (Part 5's inner-page architecture) — this brief covers the homepage hero only, per your Part 1 Step 3/4 sequencing (homepage first, inner pages after). The dispatch map and BOQ builder from Part 5.1 are not in this pass either — those are separate, real backend-shaped features, not a design-pass item.

**Image-gate note**: your Part 4.4 calls for 2-3 house-style probes with your sign-off before baking particle targets. There's no live back-and-forth review cycle available in this session (you chose "attempt in one session" over the pause-and-confirm path) — I'll generate the house SVG and bake targets against it directly, and you'll be reviewing the finished result rather than approving an intermediate probe. Flagging this deviation from your spec now rather than silently skipping the gate.

## 5. States and ranges
- Capability tiers: full WebGL (45-60k desktop / 12-18k mobile particles, benchmark-detected), no-WebGL fallback, reduced-motion, mobile tap-through. Reusing/extending the `useCapabilityTier` hook already in the codebase (adding a benchmark-frame tier detection per your spec, on top of the existing WebGL/memory/CPU/reduced-motion checks already there — not replacing it).
- Content ranges: 3 Astral systems (pipe runs) → 1 label + link; ~2 tile fields (floor + bathroom wall) → 1 label + link each; 3 fixture types (WC, basin, mixer) → converge together under one Somany label/link. Matches your Beat 2-4 spec.

## 6. Interaction and layout
- Scroll scrubs progress (Lenis-smoothed), fully reversible — scrubbing backward re-plays the sequence backward with no snapping, per your Part 4.2 interaction contract.
- Pointer radial repulsion on unassembled particles, desktop only, cheap uniform-based effect, per Part 4.2.
- Keyboard: arrow keys advance beats when the canvas region has focus (your Part 7 a11y requirement); every beat pairs with real DOM text for screen readers.
- Persistent left datum rule (engineering-drawing margin) carries through as the layout spine and the particles' inter-section travel path.

## 7. Constraints and open decisions
- **New dependency**: Lenis. Confirming it's acceptable to add (not currently in this project).
- **Performance budget**: your Part 7 numbers (LCP < 2.2s, homepage JS ≤ 200KB gzipped total, 60fps desktop / stable 30fps low-tier mobile) are the target; I'll measure against them in the optimize/audit passes but can't fully guarantee a from-scratch shader system hits every number on the first build — will report actual measurements rather than assume compliance.
- **House illustration**: hand-authored SVG by me in this session (no design-tool/Illustrator access) — will be good-faith, spec-following geometry, not guaranteed to match a professional illustrator's polish. This is the single highest-risk-of-disappointing-you item in the whole brief, flagging it plainly.
- **Untouched**: existing product/content data model (`content/products.ts`, `content/divisions.ts`), the Phase 0 data-integrity validator, the Astral/Somany real catalogue data added this session.

---
**Confirming this brief, then proceeding straight to `craft` per your instructions — say stop or redirect if any of the flagged deviations (no live probe-approval cycle, homepage-only scope, Lenis as a new dependency) aren't acceptable.**
