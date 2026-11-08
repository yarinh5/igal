# Embedded HyperFrames compositions

Three silent compositions are implemented with the official HyperFrames contract and runtime. Each has a dedicated portrait composition and an SVG fallback. The HTML registers a paused GSAP timeline under the matching `window.__timelines[id]`; no composition starts its own playback loop. Runtime, GSAP and fonts are local assets, with no runtime CDN dependency.

| ID | Duration | Visual development |
| --- | --- | --- |
| `blueprint` | 8 seconds | Drafting grid, axonometric facade line drawing, material planes, windows and dimensional marks |
| `process` | 9 seconds | Right-to-left planning, construction and handover, with a vertical mobile layout |
| `chapter` | 7 seconds | Nested architectural apertures and staggered masked reveal of “איכות. עיצוב. מיקום.” |

Desktop sources are `/compositions/{id}/index.html` at 1600×900. Portrait sources are `/compositions/{id}/mobile/index.html` at 720×960. Every source has an adjacent `fallback.svg`. Exact paths and durations are in `public/compositions/manifest.json`.

## Host integration

Import `@hyperframes/player` to register the official `<hyperframes-player>` element. Set `src` to the selected composition variant and `width` / `height` to its intrinsic dimensions. For scroll-controlled scenes, omit `autoplay`, `loop` and `controls`; set `assets-loading-ui="none"`, `disable-click-to-play`, `low-power-idle` and `muted`. Lazy-load when the scene approaches the viewport.

The official element exposes `seek(seconds)`, `pause()`, `duration`, `currentTime` and `ready`. On `ready`, immediately seek to the latest scroll-derived time rather than restarting at zero. The event detail contains `{ duration, compositionWidth, compositionHeight }`. Use a clamped `progress * duration` for scrolling in both directions. On `error`, show the matching SVG. Under reduced motion, render the static fallback and preserve the explanatory page copy without creating a player.

The website host owns ScrollTrigger, layout refresh, scroll restoration, responsive source replacement and the visitor's reduced-motion preference. Those integration paths are outside this motion-asset check.

## Rebuilding and verifying

Run `node motion/build-compositions.mjs` after changing the composition generator or updating local runtime/font dependencies. It generates the six standalone projects and manifest. Run `node scripts/check-motion.mjs` for the official HyperFrames CLI browser checks across all six variants. Individual names are accepted, for example `node scripts/check-motion.mjs process-mobile`.

The check script saves reports in `motion/reports/` and five snapshot frames for each variant in `motion/previews/`. It removes generated `.hyperframes` folders from the public deployment tree after copying evidence. Only explicitly bounded generated artifact paths are cleaned.

All six final variants passed the official HyperFrames 0.9.23 check with zero lint, runtime, layout, motion, contrast or craft warnings/errors. There is an expected informational `audio_none` finding: these website animations are deliberately silent. Heading-appearance assertions are included in each `index.motion.json`.

Visual inspection covered final desktop and portrait frames, the three process phases and the blueprint's five-frame SVG keyframe strip. It revealed SVG transform-origin drift that automated layout checks did not detect; the cause was assigning the SVG origin only in the ending tween state. Both ends now specify the same absolute SVG origin. Chapter spacing was widened vertically to keep its frames clear of the text, then checked again. The text-mask reveal intentionally moves words beyond their clipping container and declares that specific overflow in the composition metadata.

These are composition-level checks, not a claim that the website's scrolling, refresh, anchors, resize or accessibility controls have been browser-tested. Those checks belong to the integrated page. No MP4 was requested or rendered.

Dependency and registry attribution is recorded in `motion/THIRD-PARTY.md`.
