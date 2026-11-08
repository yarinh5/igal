# Mobile Scroll Experience Design

## Intent

Extend the approved architectural-atelier direction into a richer scroll journey, with mobile as the primary acceptance surface. Preserve every business statement, route, form, link and document. Motion must help visitors understand the sequence from thought to place; it must not become a blocking intro or a continuous GPU demo.

## Goals

- Make the 3D opening feel more cinematic on portrait phones through a longer, three-beat scroll timeline: photograph, drafting aperture, assembled building.
- Give every homepage section a distinct, reversible GSAP choreography while keeping one shared visual language of stone, charcoal, copper lines, masks and measured depth.
- Add a fifth genuine HyperFrames scene as a transition from projects to process. Use the existing threshold, process, chapter and blueprint scenes as part of the same scroll rhythm.
- Keep mobile responsive at 360, 390 and 768 CSS pixels. Suspend rendering outside the viewport, quantize HyperFrames seeking and lower WebGL quality only on demonstrably constrained devices.
- Preserve reduced-motion with complete content, working anchors and no pin spacers, canvases or players.

## Constraints

- RTL Hebrew, existing typography, assets and sourced copy remain authoritative.
- Animate transforms, opacity, clip paths and SVG strokes. Avoid layout-property animation.
- No required hover, no forced horizontal overflow, no long mobile pin after the hero, and no scroll-snap.
- HyperFrames compositions use local assets, one paused seek-safe timeline, desktop/mobile art direction and SVG fallbacks.
- Publication keeps the existing public audience and URL.

## Approaches considered

1. Add many independent GSAP reveals. This is inexpensive, but it would feel like disconnected effects and would not satisfy the request for more HyperFrames.
2. Use the catalog's WebGL portal block between sections. Its experimental HTML-to-canvas dependency, full-frame shader and continuous renderer are a poor fit for reliable mobile browsing.
3. Chosen: extend the current scroll system, add one lightweight DOM-3D HyperFrames passage, and deepen each section with coordinated GSAP timelines. This reuses the proven player, keeps draw work bounded and makes the added motion reversible.

## Experience

The hero retains the real project image and CTA on first paint. Three dark aperture panels and copper frame lines then reveal the architectural studio. The building travels through a wider camera arc and settles as the final home copy arrives. The mobile scroll distance grows modestly, without hiding the skip link.

The company section draws its rule and reveals copy on different depth planes. Project cards arrive as an architectural elevation, then the new HyperFrames passage carries the page into the process section. Process steps brighten in sequence beside the seeked composition. The chapter scene expands into the lottery section; lottery numbers cascade as a measured grid; the blueprint and contact areas close the story with line drawing and opposing depth.

## Acceptance

- Actual WebGL canvas on portrait mobile and desktop; deterministic forward/reverse pose.
- New HyperFrames passage desktop and mobile variants pass official lint/runtime/layout/motion/contrast/craft checks.
- No document overflow, stuck pin or console error after resize, anchor navigation, reverse scrolling or reduced-motion toggle.
- Idle/offscreen render counters do not advance.
- TypeScript, focused motion tests, production build and existing route/API regression checks pass before public deployment.

