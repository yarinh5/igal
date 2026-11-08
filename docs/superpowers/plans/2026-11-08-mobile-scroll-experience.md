# Mobile Scroll Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver a richer, mobile-first GSAP and HyperFrames scroll experience without changing Yigal Group content or functionality.

**Architecture:** Keep the current React/GSAP/Three.js/HyperFrames integration. Add pure motion-profile logic for device quality, one new seek-safe passage composition, and one homepage choreography component that owns section-local ScrollTriggers. Continue using the existing player and on-demand WebGL renderer.

**Tech Stack:** React 19, TypeScript, GSAP ScrollTrigger, Three.js, HyperFrames 0.9.23, Vinext/Vite.

**Spec:** `docs/superpowers/specs/2026-11-08-mobile-scroll-experience-design.md`

## Global Constraints

- Preserve sourced business copy, routes, forms, D1 behavior and public access.
- Use mobile HyperFrames variants through 899px.
- Reduced motion must remove pinning and active renderers while preserving all content.
- All motion must reverse correctly and use local assets/fallbacks.

## Review Focus

- Portrait resize around 899px must swap composition variants without duplicate players or stale ScrollTriggers.
- 360×667 must keep the CTA and skip link reachable while running the 3D story.
- Low-core/low-memory devices must receive the reduced DPR/antialias profile.
- A passage player failing or timing out must leave a styled SVG fallback and stable section height.
- Direct anchors and refresh restoration must account for new passage height and existing header.

---

### Task 1: Motion profile and hero depth

**Files:**
- Modify: `lib/hero-motion.ts`
- Modify: `tests/hero-motion.test.ts`
- Modify: `components/motion/ArchitectureScene.tsx`
- Modify: `components/site/Hero.tsx`
- Modify: `app/cinematic.css`

**Interfaces:**
- Produces: `renderProfile(mobile, cores, memory, devicePixelRatio)`
- Preserves: `ArchitectureSeek(progress)` and deterministic `architecturePose(progress, mobile)`

- [ ] Add failing assertions for constrained/standard render profiles and expanded finite pose channels.
- [ ] Implement the profile and new camera target/model lift values.
- [ ] Add aperture/frame markup and one reversible GSAP hero timeline with a slightly longer portrait scroll.
- [ ] Verify tests, TypeScript and 360/390/768 browser states.

### Task 2: Section choreography

**Files:**
- Modify: `components/motion/HomeTransitions.tsx`
- Modify: `components/site/HomePage.tsx`
- Modify: `components/site/ProjectCard.tsx`
- Modify: `components/site/ContactSection.tsx`
- Modify: `app/cinematic.css`

**Interfaces:**
- Consumes: existing `useMotion().reduced`
- Produces: section-scoped, reversible ScrollTriggers and `data-scroll-section` QA state

- [ ] Add semantic motion hooks without changing copy or navigation.
- [ ] Implement mobile/desktop matchMedia timelines for intro, projects, process, chapter, lottery, blueprint and contact.
- [ ] Keep every effect on children; do not transform pinned section parents.
- [ ] Verify reverse scrolling, resize cleanup and no overflow.

### Task 3: HyperFrames passage and player mode

**Files:**
- Create: `motion/build-passage.mjs`
- Create: `public/compositions/passage/**` (generated)
- Modify: `public/compositions/manifest.json` (generated)
- Modify: `components/motion/HyperScene.tsx`
- Modify: `components/site/HomePage.tsx`
- Modify: `scripts/check-motion.mjs`
- Modify: `app/cinematic.css`

**Interfaces:**
- Produces: manifest scene `passage`, desktop 1600×560 and mobile 720×900, 7 seconds
- Extends: `HyperScene({scene, label, mode?: 'inline'|'passage'})`

- [ ] Generate a local-asset DOM-3D architectural passage with one paused timeline and SVG fallback.
- [ ] Add a parent-driven sticky passage scrub and switch mobile variants at 899px.
- [ ] Run official checks for passage desktop/mobile and inspect proof frames.
- [ ] Confirm player seek stops offscreen and reverses deterministically.

### Task 4: Integrated verification and publication

**Files:**
- Modify: `docs/OPENING-UPGRADE.md`
- Generated/ignored: `outputs/yigal-group.tar.gz`

- [ ] Run TypeScript, focused tests, official HyperFrames checks and 54-route/9-API local regression.
- [ ] Build production and inspect 1440×900, 768×1024, 390×844, 360×667 and short landscape.
- [ ] Review reduced motion, anchors, reload, backward scroll, idle counters and console errors.
- [ ] Push/package with the Sites helper, save version and deploy to the existing public URL.

