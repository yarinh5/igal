# Cinematic opening upgrade — 2026-11-08

User direction: make the opening substantially more impressive with actual scroll-controlled 3D, GSAP and HyperFrames, smooth section transitions, especially mobile. Existing public audience and all sourced business content remain unchanged.

Chosen direction: architectural atelier. Preserve the actual-project photograph and immediate CTA, then reveal a dark architectural stage where separated floors assemble while the camera orbits. A dedicated HyperFrames passage brings dark space into the ivory editorial content. This extends the current architecture rather than replacing the site or adding a blocking intro.

Execution:
- Replace the simple block model with detailed stone/glass/balcony geometry, warm windows, fine drafting lines and an on-demand renderer. Share unit geometry/materials; limit DPR on mobile. No continuous idle GPU rendering, no external 3D asset dependency.
- One seekable GSAP hero timeline drives photo mask, copy, model progress and chapter markers. Desktop and portrait mobile have different camera framing, durations and text placement. Short landscape and reduced-motion stay unpinned with complete content.
- Add threshold composition (desktop/mobile), built with official HyperFrames tooling, with local assets and SVG fallbacks. Use manifest dimensions to avoid mismatched player ratios; coalesce seeks once per frame and suspend work outside the viewport.
- Add scoped section choreography: directional reveals, fine rule drawing, image parallax and restrained depth. Do not transform pinned parents or modify content routes, forms or documents.

Acceptance: readable CTA on first screen at 360/390/768/1440 widths; visible real WebGL on portrait mobile and desktop; forward/reverse scroll restores matching model/copy; no overflow or stuck pins after resize/reduced-motion/reload/anchors; no ongoing render activity at idle; official composition checks, TypeScript/build and browser verification pass. Keep public access after deployment.

Changes touch Hero, ArchitectureScene, HyperScene, MotionProvider coordination and a dedicated homepage transition component/styles. Existing inquiry and document contracts are regression-tested, not rewritten. Verification evidence and limitations will be appended here.

## Verification and resolved causes

- TypeScript (`npx tsc --noEmit`): passed on the final runtime revision. All five Node contract/hero tests passed. The first hero-test run failed with the missing pose module before implementation; final tests cover deterministic reverse sampling, finite camera values and static/portrait/desktop boundaries.
- Production build via the official Sites build helper: exit 0. Vite reports its existing large-chunk warning for the lazy Three.js bundle; no build error. The scene is dynamically imported, uses eight draw calls, caps pixel ratio, and renders only when needed.
- Browser checked at 1440×900, 390×844, 360×667, 768×1024, 844×390 and 1440×640. Inspected actual WebGL pixels, intro CTA, portrait copy, menus, horizontal gallery and the process/threshold compositions. No horizontal document overflow or browser console errors in the final observed local session.
- Forward/backward scrolling restores the mobile model: at scrollY 642, settled pose 0.5544 forward / 0.5545 reverse (rounding tolerance). Threshold sought from 7.967 seconds back to 0.933 seconds. The final lockup is visible before the composition leaves the viewport.
- Idle renderer counter stayed at 75 across separate observations at pose 0.8300. The offscreen renderer stayed at 3 throughout several later-section scrolls. These are render-work checks, not a physical-device FPS benchmark.
- The skip link landed #projects at 71.55px below a 72px mobile header. Fresh direct navigation to #about landed at 88.44px below an 88px desktop header. Reload from #projects cleared its fragment and returned to scrollY 0.
- Resize from a pinned 360px layout to 768px recomputed the stage to 753×948 after the built-in resize debounce, with one pin. At 1440×640 and 844×390 there were no pins. Reduced-motion toggle removed all WebGL canvases, players and pin spacers while retaining the photograph, CTA and complete content; re-enabling restored motion. OS preference handling was reviewed in code, not separately changed in the operating system.
- Existing regression script passed 54 current/legacy HTTP routes, unknown-route 404 and nine local D1 inquiry paths. No production inquiry was sent. Backend/CRM behavior is unchanged.
- Both new HyperFrames variants passed official CLI lint/runtime/layout/motion/contrast/craft checks; actual reports and sampled frames are in motion/reports and motion/previews. Existing three scenes were not regenerated.
- Focused independent code review completed; the one concrete breakpoint issue was fixed and covered. Integrated browser testing remained the acceptance gate.

Found and fixed: the hero's state-driven pin was created after the project gallery, so gallery coordinates omitted the hero spacer. Browser evidence showed the gallery fixed at y=89 while its parent was still y=1655. Giving the hero refreshPriority 10 makes pin calculations occur in page order; recheck showed the gallery static until its own section reached the header. This follows the installed GSAP implementation and [official sorting contract](https://www.gsap.com/docs/v3/Plugins/ScrollTrigger/static.sort%28%29/).

Found and fixed: legacy short-viewport CSS forces relative positioning through height 649; active pinning previously started at 620. The mode cutoff now matches 650 and boundary assertions cover 640/649/667. Also completed the threshold timeline earlier in its visible passage so its concluding text is readable, and used explicit progress-bar initial state when returning from reduced motion.

Limits: no physical iPhone/Android device or Safari run, no GPU throttling/FPS benchmark and no forced WebGL-context-loss/network-failure browser simulation. Fallback assets were inspected and reduced-motion fallback rendering was exercised. Screenshots: docs/screenshots/opening-3d-desktop.jpg, opening-3d-mobile.jpg, threshold-mobile.jpg. Source implementation and local acceptance are complete; production publication is recorded in the ignored outputs handoff after deployment.
