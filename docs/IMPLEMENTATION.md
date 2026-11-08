# Yigal Group — implementation and verification

## Brief and design decisions

The user's detailed brief authorizes full implementation. Source of truth: ../SITE-STUDY.he.md and the public source pages. Hebrew RTL, restrained architectural editorial design, ivory/ink/oxblood, actual project imagery. New marketing statistics, invented testimonials, customer identities and fabricated availability are prohibited. The 3D model is explicitly abstract architectural artwork, not a project representation.

Implementation choice: React/Vinext + Three.js + GSAP/ScrollTrigger + Lenis, official @hyperframes/player, self-hosted fonts/media and real HyperFrames compositions. New private Sites deployment; existing yigal-group.com remains its source. No source-site credentials or original CRM connection have been supplied.

## Files and work boundaries

- app/: Hebrew shell, homepage, project/detail/archive/contact routes and document library; API POST /api/inquiries.
- components/site/: navigation, sections, project/gallery/dialog/form components.
- components/motion/: a single animation coordinator, Three.js architectural object, lazy official HyperFrames player wrapper.
- lib/: sourced content adapters, inquiry validation and navigation helpers.
- content/: imported source-page/link inventory, lottery/building/apartment mapping and image provenance (asset worker).
- public/images/: optimized original-site media (asset worker).
- public/compositions/ and motion/: seekable scenes and fallbacks (motion worker).
- db/: real inquiry storage via Sites D1, schema migrations.
- tests/: input contracts and integration checks. docs/VERIFICATION.md records checks actually completed.

## Build sequence

- [x] Source assets, content and all lottery PDF targets; preserve source mappings rather than infer identity from old URLs.
- [x] Implement a full responsive editorial UI with project details, completed work, company content, commercial content, lottery/building/apartment filtering and lead/contact actions.
- [x] Implement SSR-safe motion: staged entry plus one scroll timeline, real 3D, three real HyperFrames scenes, desktop smooth scrolling, mobile natural flow, accessible skip and reduced-motion setting.
- [x] Implement real server-side inquiry persistence with validation; success only after stored response. Do not claim email delivery or CRM integration.
- [x] Verify build/typecheck, input contracts, source coverage and HyperFrames checks.
- [x] Browser QA at desktop and multiple mobile sizes, forward/reverse scroll, reload from depth, fresh deep link and in-page anchors, resizing, reduced motion, menu/dialogs/search/gallery/form paths.
- [x] Fix observed defects and document verification. Private publication follows the verified build.

## Acceptance and stopping conditions

1. All key existing content types are reachable and 9 lottery records retain source identities and documents; unknown details remain labelled or link to authoritative source.
2. First screen has clear Hebrew heading and accessible main CTA; no loading screen blocks navigation.
3. Scroll control is deterministic in both directions. Reload returns to zero and drops a stale hash; fresh direct anchors and ordinary anchor navigation work.
4. WebGL, player and asset failures leave legible content and usable actions. Reduced motion disables pinning/smooth scroll/scrubbing while preserving content.
5. No horizontal overflow at tested widths, including short landscape; buttons at least 44px touch targets and visible focus. Dialog focus trap/return and Esc work.
6. A successful form stores a real record. Invalid input, persistence failure and duplicate request are handled honestly; no exposed list endpoint.
7. Build passes. Official composition checks and browser checks are documented with actual results, not inferred.

## Known risks to cover

- Wix paths for lotteries 1969 and 1975 are swapped relative to their titles.
- Original contact href points to a template email; new link uses the visible business email, and all source correction is documented.
- Some documents are icon-only links and require source heading association; do not label a contract as a floor plan.
- Mobile short-height screens must avoid a pinned dead zone.
- Player iframe readiness, font layout changes, async Three loading and browser history must not race scroll state.
