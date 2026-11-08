# Yigal Group

Hebrew RTL website for קבוצת יגאל בוחבוט, with Three.js, GSAP/ScrollTrigger, Lenis and official HyperFrames compositions.

## Vercel handoff

See [VERCEL.md](./VERCEL.md) for import settings, deployment instructions and the current contact behavior.

```sh
npm ci
npm run dev:vercel
```

Node.js 22.x. Production verification:

```sh
npm test
npm run build:vercel
npm run start:vercel
```

`vercel.json` selects Next.js and the Vercel build script. No mandatory credentials or database are needed. `SITE_URL` optionally sets the final sharing-metadata origin; Vercel's URL is detected automatically.

## Contact behavior

Contact is currently by phone, WhatsApp and email only, as requested. No form collects data. `POST /api/inquiries` deliberately returns 503 and never reports successful storage. The previous database schema and migrations are retained for future integration, but are not used by the active app.

## Existing Sites workflow

The original `npm run dev`, `npm run build` and `npm start` commands remain available for the separate Sites/Vinext/Cloudflare workflow. They are not the Vercel commands. Existing `.openai/hosting.json`, `worker/`, `db/`, `drizzle/` and supporting scripts belong to that workflow.

Historical checks under `docs/` describe earlier deployments, including the former D1 form; they do not imply an active database in this handoff.

## Source and motion assets

Content and image provenance are in `content/`. All deployment-ready assets and animations are already in `public/`. Authored compositions are in `motion/`; production builds do not invoke a browser, renderer or remote asset service.

The Hebrew opening uses a shared HTML/GSAP timeline with landscape and portrait layouts and respects reduced motion. `node scripts/prepare-opening.mjs` republishes its authored sources when editing the animation. The scripts in `scripts/check-motion.mjs` validate the other scene compositions.
