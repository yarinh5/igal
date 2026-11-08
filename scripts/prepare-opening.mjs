// Publish the approved source composition unchanged in timing and design.
// The HTML player is the no-video fallback for blocked mobile autoplay.
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
const target=new URL('../public/compositions/opening/',import.meta.url);
await mkdir(new URL('assets/',target),{recursive:true});
let html=await readFile(new URL('../motion/loader-sample/index.html',import.meta.url),'utf8');
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>',
 '<title>Yigal Group opening</title><script src="assets/hyperframe.runtime.min.js"></script><script src="assets/gsap.min.js"></script>')
 .replaceAll('.media/images/logo_001.webp','assets/logo.webp');
await writeFile(new URL('index.html',target),html);
await copyFile(new URL('../motion/loader-sample/index.motion.json',import.meta.url),new URL('index.motion.json',target));
for(const file of ['hyperframe.runtime.min.js','gsap.min.js'])await copyFile(new URL(`../public/compositions/chapter/assets/${file}`,import.meta.url),new URL(`assets/${file}`,target));
await copyFile(new URL('../motion/loader-sample/.media/images/logo_001.webp',import.meta.url),new URL('assets/logo.webp',target));
