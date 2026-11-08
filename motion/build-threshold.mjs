import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(project, 'public', 'compositions', 'threshold');
const duration = 8;
const assets = [
  ['node_modules/@hyperframes/core/dist/hyperframe.runtime.iife.js', 'hyperframe.runtime.min.js'],
  ['node_modules/gsap/dist/gsap.min.js', 'gsap.min.js'],
  ['public/fonts/assistant-hebrew.woff2', 'assistant-hebrew.woff2'],
];

function makeComposition(mobile) {
  const width = mobile ? 720 : 1600;
  const height = mobile ? 720 : 700;
  const portalWidth = mobile ? 960 : 1440;
  const portalHeight = mobile ? 1050 : 1050;
  const depthStep = mobile ? 270 : 350;
  const perspective = mobile ? 780 : 1000;
  const endZ = mobile ? 1850 : 2500;
  const thickness = mobile ? 94 : 110;
  const portals = Array.from({ length: 6 }, (_, i) => `
    <div class="portal portal-${i}" style="--stone-light:${['#b7aea0','#c8bfb0','#d3cbbd','#e0d8cc','#e7e1d6','#ede8df'][i]};--stone-dark:${['#625d53','#7c7466','#968b7a','#aaa08e','#bdb3a1','#cfc5b5'][i]}" aria-hidden="true" data-layout-ignore>
      <div class="portal-reveal"><div class="portal-face"></div><div class="inner-jamb left-jamb"></div><div class="inner-jamb right-jamb"></div>
        <svg class="portal-detail" viewBox="0 0 ${portalWidth} ${portalHeight}" fill="none" aria-hidden="true" data-layout-ignore>
          <path class="copper copper-${i}" pathLength="1" d="M${thickness-8} ${portalHeight-thickness+8}V${thickness-8}H${portalWidth-thickness+8}V${portalHeight-thickness+8}" stroke="#ae8963" stroke-width="1.5"/>
          <path d="M0 ${thickness/2}H${portalWidth}M${thickness/2} 0V${portalHeight}M${portalWidth-thickness/2} 0V${portalHeight}" stroke="#25241f" stroke-opacity=".12" stroke-width="1"/>
          <path d="M${thickness+8} ${portalHeight-thickness-8}H${portalWidth-thickness-8}" stroke="#f2efe8" stroke-opacity=".6" stroke-width="1"/>
        </svg>
      </div>
    </div>`).join('');
  const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=${width},height=${height}"><title>מהמחשבה אל המרחב. — Yigal Group</title>
<script src="assets/hyperframe.runtime.min.js"></script><script src="assets/gsap.min.js"></script>
<style>
@font-face{font-family:Assistant;src:url('assets/assistant-hebrew.woff2') format('woff2');font-weight:200 800;font-style:normal;font-display:block}
*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0}body{background:#25241f;color:#25241f;font-family:Assistant,sans-serif}#root{position:relative;width:100%;height:100%;overflow:hidden;background:#25241f}#threshold-scene{position:absolute;inset:0}
.perspective-stage{position:absolute;inset:0;perspective:${perspective}px;perspective-origin:50% 50%}
.passage-world{position:absolute;inset:0;transform-style:preserve-3d}
.portal{position:absolute;left:${(width-portalWidth)/2}px;top:${(height-portalHeight)/2}px;width:${portalWidth}px;height:${portalHeight}px;transform-style:preserve-3d}
.portal-reveal{position:absolute;inset:0;transform-style:preserve-3d}
.portal-face{position:absolute;inset:0;border:${thickness}px solid var(--stone-light);border-left-color:var(--stone-dark);border-bottom-color:var(--stone-dark);backface-visibility:hidden}
.inner-jamb{position:absolute;top:${thickness}px;height:${portalHeight-thickness*2}px;width:66px;background:var(--stone-dark);backface-visibility:hidden}
.left-jamb{left:${thickness}px;transform-origin:left center;transform:rotateY(90deg)}
.right-jamb{right:${thickness}px;transform-origin:right center;transform:rotateY(-90deg);background:var(--stone-light)}
.portal-detail{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;backface-visibility:hidden}.copper{stroke-dasharray:1;stroke-dashoffset:0}
.daylight{position:absolute;left:${(width-5200)/2}px;top:${(height-3400)/2}px;width:5200px;height:3400px;background:#f2efe8;backface-visibility:hidden}
.shutter{position:absolute;top:0;bottom:0;width:50%;background:#25241f}.shutter-left{left:0}.shutter-right{right:0}
.seam{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.seam-path{stroke-dasharray:1;stroke-dashoffset:0}
.finish-space{position:absolute;inset:0;background:#f2efe8;pointer-events:none}
.lockup{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${mobile?25:29}px;text-align:center;padding:${mobile?'44px':'60px'};color:#25241f}
.brand{font-size:${mobile?24:25}px;font-weight:400;letter-spacing:.25em;direction:ltr;margin:0}
h1{display:flex;${mobile?'flex-direction:column;gap:0':'gap:.22em'};align-items:center;justify-content:center;font-size:${mobile?82:112}px;font-weight:400;line-height:1.12;letter-spacing:-.035em;margin:0}
.word-window{overflow:hidden;padding:0 .08em .1em}.word{display:block}.closing-rule{width:${mobile?44:64}px;height:1px;background:#98754f;margin-top:${mobile?12:22}px;transform-origin:center}
</style></head><body>
<div id="root" data-composition-id="threshold" data-start="0" data-duration="8" data-width="${width}" data-height="${height}">
  <section id="threshold-scene" aria-label="מעבר אדריכלי מהחושך אל חלל בהיר">
    <div class="perspective-stage" aria-hidden="true"><div class="passage-world" data-layout-allow-overflow><div class="daylight" data-layout-ignore></div>${portals}</div></div>
    <div class="shutter shutter-left" aria-hidden="true" data-layout-allow-overflow></div><div class="shutter shutter-right" aria-hidden="true" data-layout-allow-overflow></div>
    <svg class="seam" viewBox="0 0 ${width} ${height}" aria-hidden="true"><path class="seam-path" pathLength="1" d="M${width/2-10} ${height*.16}H${width/2}V${height*.84}H${width/2+10}" fill="none" stroke="#ae8963" stroke-width="1.8"/></svg>
    <div class="finish-space" aria-hidden="true" data-layout-ignore></div>
    <div class="lockup"><p class="brand">YIGAL GROUP</p><h1><span class="word-window"><span class="word" data-layout-allow-overflow>מהמחשבה</span></span><span class="word-window"><span class="word" data-layout-allow-overflow>אל המרחב.</span></span></h1><div class="closing-rule" aria-hidden="true"></div></div>
  </section>
</div>
<script>
const tl=gsap.timeline({paused:true});
tl.addLabel('seam',0).addLabel('opening',.65).addLabel('passage',1.5).addLabel('daylight',5).addLabel('lockup',5.2);
tl.set('.daylight',{z:${-depthStep*6-300}},0);
${Array.from({length:6},(_,i)=>`tl.set('.portal-${i}',{z:${-depthStep*i}},0);`).join('\n')}
tl.fromTo('.seam-path',{strokeDashoffset:1},{strokeDashoffset:0,autoRound:false,duration:1.25,ease:'power2.inOut'},0)
  .fromTo('.shutter-left',{xPercent:0},{xPercent:-100,duration:2.05,ease:'power3.inOut'},.65)
  .fromTo('.shutter-right',{xPercent:0},{xPercent:100,duration:2.05,ease:'power3.inOut'},.65)
  .fromTo('.seam',{opacity:1},{opacity:0,duration:.45,ease:'power1.in'},1.0)
  .fromTo('.passage-world',{z:${mobile?-480:-600},x:${mobile?28:54},rotationY:${mobile?-3.6:-4.8}},{z:${endZ},x:0,rotationY:0,duration:5.65,ease:'power2.inOut'},.85)
  .fromTo('.copper',{strokeDashoffset:1},{strokeDashoffset:0,autoRound:false,duration:1.6,stagger:.18,ease:'power2.inOut'},1)
  .fromTo('.finish-space',{opacity:0},{opacity:1,duration:.6,ease:'power1.inOut'},5)
  .fromTo('.lockup',{autoAlpha:0},{autoAlpha:1,duration:.01},5.1)
  .fromTo('.brand',{opacity:0,y:12},{opacity:1,y:0,duration:.6,ease:'power2.out'},5.2)
  .fromTo('.word',{yPercent:118},{yPercent:0,duration:.65,stagger:.1,ease:'power3.out'},5.2)
  .fromTo('.closing-rule',{scaleX:0,opacity:0},{scaleX:1,opacity:1,duration:.6,ease:'power2.inOut'},5.4);
window.__timelines=window.__timelines||{};window.__timelines.threshold=tl;
</script></body></html>`;
  const label = mobile ? `<text x="360" y="345">מהמחשבה</text><text x="360" y="440">אל המרחב.</text>` : `<text x="800" y="390">מהמחשבה אל המרחב.</text>`;
  const fallback = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#f2efe8"/><g fill="none" stroke="#bdb3a1" stroke-width="1" opacity=".5"><path d="M${mobile?25:70} ${mobile?25:45}H${width-(mobile?25:70)}V${height-(mobile?25:45)}H${mobile?25:70}Z"/></g><g font-family="Arial,sans-serif" fill="#25241f" text-anchor="middle"><text x="${width/2}" y="${mobile?225:245}" font-size="${mobile?23:24}" letter-spacing="5">YIGAL GROUP</text><g direction="rtl" font-size="${mobile?70:94}">${label}</g></g><path d="M${width/2-26} ${mobile?510:480}h52" stroke="#98754f" stroke-width="1"/></svg>`;
  return { width, height, html, fallback };
}

for(const mobile of [false,true]) {
  const folder = mobile ? path.join(destination,'mobile') : destination;
  const composition = makeComposition(mobile);
  fs.mkdirSync(path.join(folder,'assets'),{recursive:true});
  for(const [source, name] of assets) fs.copyFileSync(path.join(project,source),path.join(folder,'assets',name));
  fs.writeFileSync(path.join(folder,'index.html'),composition.html);
  fs.writeFileSync(path.join(folder,'fallback.svg'),composition.fallback);
  fs.writeFileSync(path.join(folder,'index.motion.json'),JSON.stringify({duration,assertions:[{kind:'appearsBy',selector:'.brand',bySec:7.2},{kind:'appearsBy',selector:'h1',bySec:7.4}]},null,2));
}

const manifestPath=path.join(project,'public','compositions','manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const entry={id:'threshold',title:'מהמחשבה אל המרחב.',duration,desktop:{src:'/compositions/threshold/index.html',width:1600,height:700},mobile:{src:'/compositions/threshold/mobile/index.html',width:720,height:720,fallback:'/compositions/threshold/mobile/fallback.svg'},fallback:'/compositions/threshold/fallback.svg'};
const current=manifest.findIndex(item=>item.id==='threshold');
if(current<0)manifest.push(entry);else manifest[current]=entry;
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2));
console.log('Built threshold desktop 1600×700 and mobile 720×720, both 8 seconds.');
