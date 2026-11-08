# Verification — 2026-11-08

## Verified implementation

Hebrew RTL website with sourced project pages, company/commercial/contact pages, nine searchable lottery libraries and all 535 unique original PDF links. Actual Three.js geometry, GSAP/ScrollTrigger entrance and reversible pinned timelines, desktop Lenis, three official HyperFrames compositions in six desktop/mobile variants, native mobile scrolling and a persistent reduced-motion preference.

## Checks actually run

- Production build via the Sites build helper: passed after final code changes. TypeScript `tsc --noEmit`: passed. Three input/navigation contract tests: passed.
- `node scripts/import-source.mjs --derive`: 30 source pages, 9 lotteries, 554 PDF occurrences / 535 unique PDF URLs. Exact imported/source comparison and six unit-link spot checks passed.
- Official HyperFrames CLI checks: all six variants passed lint, runtime, layout, motion, contrast and craft checks with no warnings/errors. Reports are in `motion/reports/`; preview frames in `motion/previews/`. No audio is intentionally used.
- `node scripts/verify-local.mjs`: 54 new/legacy page requests, unknown-route 404, and nine real inquiry API scenarios passed. Includes valid persistence, identical retries, mismatched retries, invalid phone, honeypot, origin, malformed JSON, oversized body and content type. Evidence: `http-checks.json`.
- Local D1 table temporarily renamed/restored in a `finally` block: POST returned 503 on unavailable storage. Existing test rows remained intact.
- Browser form: empty submission showed field errors; valid synthetic details produced success. Direct D1 query confirmed the stored name, interest and message.
- Browser desktop: 1265×720 and 1440×900. Actual WebGL canvas/model inspected, pinned hero at header offset 88px, forward/reverse animation and skip link checked. Horizontal project rail moved forward and reversed with no horizontal document overflow.
- Browser responsive: 360×740, 390×844, 768×1024, 844×390. Main CTA remained inside opening viewport; no horizontal document overflow. Mobile/short landscape had no pin spacers. Mobile avoided creating the hidden WebGL canvas.
- Browser navigation: refresh from depth cleared saved hash and returned to zero; direct `#lotteries` and `#approach` navigations and in-page project anchor worked. Resizing rebuilt desktop pins and selected mobile scene sources.
- Browser motion: all three players reached ready, with DOM-observed durations of 9/7/8 seconds. Forward/reverse process progress changed from approximately .318 to .977 and back to .318. Reduced motion removed players/pins, kept content, and preserved the viewed section position (including desktop pin removal).
- Browser fallback fault injection: temporarily renamed the mobile process HTML, loaded the page, observed loaded SVG fallback with opacity 1 and failed player opacity 0. Restored the original HTML before final build.
- Browser interactions: menu open/close/Escape/focus return and background scroll lock; project filter returned two active projects; gallery advanced from 1/4 to 2/4 by keyboard and returned focus on Escape; lottery search returned one result; keyboard tabs plus D36/apartment 6 filtering returned one correct document.
- Screenshots saved in `docs/screenshots/`. Read-only independent code review completed; all important findings fixed.

## Demonstrated defects corrected

Initial motion preference changes repeated the scroll-reset effect; separated one-time restoration from interactive navigation. Hero pinning used the padded parent as trigger and doubled the header offset; it now uses the stage. Hidden hero links used opacity alone; synchronized visibility now removes invisible focus targets. Excluded open dialogs from Lenis handling. Raised the menu target to 44px, named dialogs, and added roving keyboard tabs. Phone validation now counts real digits. Form retries preserve an ID only for the same payload; server compares conflicting payloads instead of silently losing edits. Encoded legacy Hebrew path params are decoded before source lookup. Database failure logs now include the error class only, after the fault test demonstrated that a Drizzle error message contains submitted fields. Removed mismatched chapter player aspect ratio and adapted short landscape opening height.

## Limits and operational notes

- Browser checks used the available Chromium environment, not physical iOS/Android devices, Safari or Firefox. OS-level reduced-motion emulation was not available; the site toggle and implementation of the media preference were checked. No formal WCAG certification or measured Lighthouse score is claimed.
- Source PDF mapping is exhaustive; the contents and availability of all 535 external PDFs were not individually verified. Progress updates remain linked to their original project pages. No sales-availability claim is made from a displayed apartment plan.
- Inquiries are stored in D1. No email delivery, CRM integration or original-domain migration is configured. Contact telephone, email and WhatsApp links use the researched public business details.
- Local success is distinct from hosted persistence. Deployment result and any hosted check are recorded separately at handoff.
- Build emitted a chunk-size advisory for the dynamically loaded Three.js module. It is not loaded on mobile/short screens or reduced-motion mode. Development-only HMR connection-closed notices occurred while concurrent code/build updates were running; no composition runtime error was observed in the restored normal path.
