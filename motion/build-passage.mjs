import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const destination=path.join(project,'public','compositions','passage');
const duration=7;
const assets=[
 ['node_modules/@hyperframes/core/dist/hyperframe.runtime.iife.js','hyperframe.runtime.min.js'],
 ['node_modules/gsap/dist/gsap.min.js','gsap.min.js'],
 ['public/fonts/assistant-hebrew.woff2','assistant-hebrew.woff2'],
];

function makeComposition(mobile){
 const width=mobile?720:1600,height=mobile?900:560;
 const frameWidth=mobile?570:1280,frameHeight=mobile?710:430;
 const frames=Array.from({length:7},(_,index)=>`<div class="frame frame-${index}" aria-hidden="true"><i></i><b></b><span></span></div>`).join('');
 const html=`<!doctype html><html lang="he" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=${width},height=${height}"><title>תכנון. ביצוע. בית. — Yigal Group</title><script src="assets/hyperframe.runtime.min.js"></script><script src="assets/gsap.min.js"></script><style>
@font-face{font-family:Assistant;src:url('assets/assistant-hebrew.woff2') format('woff2');font-weight:200 800;font-display:block}*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0}body{font-family:Assistant,sans-serif;background:#25241f;color:#f2efe8;overflow:hidden}#root,.scene{position:absolute;inset:0;overflow:hidden}.scene{perspective:${mobile?820:1100}px;perspective-origin:50% 50%;background:radial-gradient(circle at 50% 52%,#4b504a 0,#252a27 35%,#171b19 75%)}.world{position:absolute;inset:0;transform-style:preserve-3d}.frame{position:absolute;left:${(width-frameWidth)/2}px;top:${(height-frameHeight)/2}px;width:${frameWidth}px;height:${frameHeight}px;transform-style:preserve-3d;border:${mobile?28:34}px solid #c9c0b1;border-left-color:#71695e;border-bottom-color:#81786b;box-shadow:0 0 0 1px #e7dfd144,inset 0 0 75px #0005}.frame i,.frame b{position:absolute;display:block;background:#a57d57;opacity:.75}.frame i{height:1px;left:${mobile?28:48}px;right:${mobile?28:48}px;top:${mobile?42:52}px}.frame b{width:1px;top:${mobile?42:52}px;bottom:${mobile?42:52}px;right:${mobile?28:48}px}.frame span{position:absolute;width:7px;height:7px;border:1px solid #d7b78f;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg)}.wash{position:absolute;inset:-15%;background:#f2efe8;opacity:0}.grid{position:absolute;inset:0;opacity:.22;background-image:linear-gradient(#d5c3a51f 1px,transparent 1px),linear-gradient(90deg,#d5c3a51f 1px,transparent 1px);background-size:${mobile?72:100}px ${mobile?72:100}px}.copy{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:${mobile?55:70}px;visibility:hidden;opacity:0;color:#25241f}.brand{font-size:${mobile?21:20}px;letter-spacing:.28em;direction:ltr;margin:0 0 ${mobile?30:22}px}.words{font-size:${mobile?80:92}px;line-height:1.04;letter-spacing:-.045em;font-weight:350;margin:0}.words span{display:${mobile?'block':'inline-block'};overflow:hidden;padding:.04em .04em .22em}.words b{display:block;font-weight:350}.words em{font-style:normal;color:#926c4d}.rule{height:1px;width:${mobile?52:72}px;background:#9a7652;margin-top:${mobile?24:22}px;transform-origin:center}.chapter{position:absolute;right:${mobile?34:58}px;bottom:${mobile?34:35}px;font-size:${mobile?20:15}px;letter-spacing:.08em;color:#f2efe8;background:#1c201ed9;padding:8px 11px}.chapter:before{content:'';display:inline-block;width:28px;height:1px;background:#d1a97e;margin-left:12px;vertical-align:middle}
</style></head><body><div id="root" data-composition-id="passage" data-start="0" data-duration="${duration}" data-width="${width}" data-height="${height}"><section class="scene" aria-label="מסגרות אדריכליות נפתחות לחלל בהיר"><div class="grid" aria-hidden="true"></div><div class="world" data-layout-allow-overflow>${frames}</div><div class="wash" aria-hidden="true" data-layout-ignore></div><div class="copy"><p class="brand">YIGAL GROUP</p><h1 class="words"><span><b>תכנון.</b></span> <span><b>ביצוע.</b></span> <span><b><em>בית.</em></b></span></h1><i class="rule" aria-hidden="true"></i></div><div class="chapter">הדרך שלנו</div></section></div><script>
const tl=gsap.timeline({paused:true});tl.addLabel('draw',0).addLabel('flight',.55).addLabel('light',4.1).addLabel('copy',4.45);
${Array.from({length:7},(_,index)=>`tl.set('.frame-${index}',{z:${-index*(mobile?250:330)},rotationY:${index%2?-.75:.75},rotationX:${index%2?.35:-.35}},0);`).join('\n')}
tl.fromTo('.frame',{opacity:0,scale:.92},{opacity:1,scale:1,duration:1.1,stagger:.08,ease:'power2.out'},0)
 .fromTo('.frame i',{scaleX:0},{scaleX:1,transformOrigin:'right',duration:1.25,stagger:.08,ease:'power2.inOut'},.12)
 .fromTo('.frame b',{scaleY:0},{scaleY:1,transformOrigin:'top',duration:1.05,stagger:.08,ease:'power2.inOut'},.2)
 .fromTo('.world',{z:${mobile?-450:-580},rotationY:${mobile?-4:-3.5},x:${mobile?28:55}},{z:${mobile?1540:2250},rotationY:0,x:0,duration:4.75,ease:'power2.inOut'},.55)
 .to('.grid',{opacity:0,duration:1.2,ease:'power1.in'},3.7)
 .to('.wash',{opacity:1,duration:.72,ease:'power2.inOut'},4.1)
 .set('.copy',{autoAlpha:1},4.42)
 .fromTo('.brand',{opacity:0,y:12},{opacity:1,y:0,duration:.5,ease:'power2.out'},4.47)
 .fromTo('.words b',{yPercent:116},{yPercent:0,duration:.62,stagger:.07,ease:'power3.out'},4.47)
 .fromTo('.rule',{scaleX:0},{scaleX:1,duration:.6,ease:'power2.inOut'},4.73);
window.__timelines=window.__timelines||{};window.__timelines.passage=tl;</script></body></html>`;
 const fallback=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#f2efe8"/><rect x="${mobile?28:90}" y="${mobile?28:45}" width="${width-(mobile?56:180)}" height="${height-(mobile?56:90)}" fill="none" stroke="#c8beae"/><g text-anchor="middle" font-family="Arial,sans-serif" fill="#25241f"><text x="${width/2}" y="${mobile?300:195}" font-size="${mobile?22:20}" letter-spacing="5">YIGAL GROUP</text><text x="${width/2}" y="${mobile?445:310}" font-size="${mobile?68:82}" direction="rtl">תכנון. ביצוע. בית.</text></g><path d="M${width/2-30} ${mobile?520:375}h60" stroke="#9a7652"/></svg>`;
 return {width,height,html,fallback};
}

for(const mobile of [false,true]){
 const folder=mobile?path.join(destination,'mobile'):destination;
 const composition=makeComposition(mobile);
 fs.mkdirSync(path.join(folder,'assets'),{recursive:true});
 for(const [source,name] of assets)fs.copyFileSync(path.join(project,source),path.join(folder,'assets',name));
 fs.writeFileSync(path.join(folder,'index.html'),composition.html);
 fs.writeFileSync(path.join(folder,'fallback.svg'),composition.fallback);
 fs.writeFileSync(path.join(folder,'index.motion.json'),JSON.stringify({duration,assertions:[{kind:'appearsBy',selector:'.brand',bySec:6.4},{kind:'appearsBy',selector:'.words',bySec:6.5}]},null,2));
}
const manifestPath=path.join(project,'public','compositions','manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const entry={id:'passage',title:'תכנון. ביצוע. בית.',duration,desktop:{src:'/compositions/passage/index.html',width:1600,height:560},mobile:{src:'/compositions/passage/mobile/index.html',width:720,height:900,fallback:'/compositions/passage/mobile/fallback.svg'},fallback:'/compositions/passage/fallback.svg'};
const current=manifest.findIndex(item=>item.id==='passage');if(current<0)manifest.push(entry);else manifest[current]=entry;
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2));
console.log('Built passage desktop 1600×560 and mobile 720×900, both 7 seconds.');
