# Threshold transition

`threshold` is an eight-second silent HyperFrames composition for the premium opening. The copper architectural seam draws, two dark solid planes part, and six stone portals recede in real CSS perspective. A single camera-like world transform advances in `z`, gently corrects its lateral position and rotation, and crosses the planes into an ivory space. The final Hebrew line is fully settled from 6.0 to 8.0 seconds.

| Variant | Source | Intrinsic dimensions | Fallback |
| --- | --- | --- | --- |
| Desktop | `/compositions/threshold/index.html` | 1600 × 700 | `/compositions/threshold/fallback.svg` |
| Mobile | `/compositions/threshold/mobile/index.html` | 720 × 720 | `/compositions/threshold/mobile/fallback.svg` |

The mobile scene has its own perspective, portal geometry, travel distance and two-line typography. It is not a cropped desktop frame. Both variants register one synchronously built paused GSAP timeline as `window.__timelines.threshold`, matching their root `data-composition-id="threshold"` and `data-duration="8"`. The official player uses `seek(progress * 8)` in either direction; no timers, requestAnimationFrame loops or scroll listeners run inside the composition.

Runtime, GSAP and the Assistant font are local. The official HyperFrames 0.9.23 runtime is copied unmodified from `@hyperframes/core/dist/hyperframe.runtime.iife.js` to each variant's `assets/hyperframe.runtime.min.js`. GSAP's attribution header is retained. The runtime uses the `.min.js` filename to identify the vendor bundle to the source linter.

The catalog was queried for an architectural passage before authoring. `panel-reveal` was installed and inspected; its deterministic opening-state pattern informed the paired shutters, while the stone geometry and perspective choreography are bespoke. The catalog response and inspected registry source are retained under `motion/reports/threshold-*`. This is conceptual architecture, not a project rendering or a business claim.

## Rebuild

Run `node motion/build-threshold.mjs`. It regenerates only the two threshold compositions, their local assets, fallbacks and motion assertions, and appends/replaces only the threshold manifest entry. If rebuilding the original scenes using `motion/build-compositions.mjs`, run the threshold generator afterward because the original generator rewrites its three-entry manifest.

## Verification

Both final variants passed the official HyperFrames CLI check with zero lint, runtime, layout, motion, contrast or craft findings. Each check includes five snapshots at 0, 0.55, 2.7, 6 and 8 seconds. The expected informational `audio_none` result reflects the intentionally silent scene. Additional exact-time snapshots document 2.1, 3.2 and 4.2 seconds of the passage.

The first validation found that hidden masked text was included in contrast sampling and that the closing hold was too short. The lockup now has a real visibility lifecycle and settles by 6 seconds. Motion geometry remains available to the craft audit; only deliberately out-of-frame decorative planes opt out of layout bounds checks.

Focused SVG inspection found GSAP's default pixel rounding made the normalized 1→0 dash value snap. `autoRound:false` now preserves fractional stroke values. Architectural end marks give the fine seam nonzero SVG bounds, and the final focused strip shows continuous drawing before the shutters open. This was verified in rendered pixels, not inferred from the timeline alone.

Evidence is in `motion/reports/threshold-desktop.json`, `motion/reports/threshold-mobile.json`, `motion/reports/threshold-keyframes.json`, `motion/reports/threshold-seam-keyframes.json` and `motion/previews/threshold-*`. The keyframe report confirms the continuous `z`, `x` and `rotationY` pose change; the final contact frames confirm the actual passage and typography.

These are asset-level checks. The host still owns scroll synchronization, responsive source switching, reduced-motion fallbacks and integrated browser verification. No MP4 was requested or rendered.
