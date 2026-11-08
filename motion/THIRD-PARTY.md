# Motion dependencies

The embedded compositions use the installed official HyperFrames core runtime from `@hyperframes/core` version 0.9.23, published by the [HyperFrames project](https://github.com/heygen-com/hyperframes). Each `assets/hyperframe.runtime.min.js` is an unmodified copy of the package's `dist/hyperframe.runtime.iife.js`; the `.min.js` name identifies the already-minified vendor bundle to the HyperFrames source linter.

GSAP is copied unmodified from `node_modules/gsap/dist/gsap.min.js`. Its attribution and license header remain in every copy. See the package and [GSAP's license](https://gsap.com/standard-license/).

The Assistant font is copied from the site's local, sourced font asset. See the site's asset provenance for the font source.

The registry was searched before authoring. The official `svg-line-draw-loader` component was installed into `motion/compositions/components/`; its paused GSAP stroke-drawing mechanism informed these original architectural SVG compositions. Catalog evidence is retained at `motion/catalog.json`.

All architectural geometry is conceptual decoration, not a representation of an existing Yigal Group building or a buildable architectural plan.
