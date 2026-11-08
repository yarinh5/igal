import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'public', 'compositions');
const bundledAssets = [
  ['node_modules/gsap/dist/gsap.min.js', 'gsap.min.js'],
  ['node_modules/@hyperframes/core/dist/hyperframe.runtime.iife.js', 'hyperframe.runtime.min.js'],
  ['public/fonts/assistant-hebrew.woff2', 'assistant-hebrew.woff2'],
];

const line = (d, classes = '', fill = 'none', extra = '') => `<path class="trace ${classes}" pathLength="1" d="${d}" fill="${fill}" ${extra}/>`;
const colors = { stone: '#eee9df', ink: '#25241f', red: '#8f302c', muted: '#bcb4a4' };
const grid = (w, h) => `<g class="draft-grid" stroke="#bcb4a4" stroke-width="1" opacity=".28">${Array.from({length:Math.floor(w / 100) - 1}, (_,i)=>`<path d="M${(i+1)*100} 80V${h-80}"/>`).join('')}${Array.from({length:Math.floor(h / 100) - 1},(_,i)=>`<path d="M80 ${(i+1)*100}H${w-80}"/>`).join('')}</g>`;

function building() {
  let windows = '';
  for (let floor=0;floor<6;floor++) for(let col=0;col<5;col++) {
    const x=477+col*53, y=286+floor*54+col*14;
    windows += `<path class="window" d="M${x} ${y}l31 8v30l-31-8z" fill="#8f302c" opacity=".72"/>`;
  }
  let rails = '';
  for (let floor=0;floor<7;floor++) rails += line(`M440 ${270+floor*54}L765 ${356+floor*54}L1105 ${175+floor*54}`, 'slab');
  return `<g class="facade" stroke="#25241f" stroke-width="1.8" stroke-linejoin="miter">
    <path class="face face-left" d="M440 270L765 356V734L440 648Z" fill="#d8d0c2" stroke="none"/>
    <path class="face face-right" d="M765 356L1105 175V553L765 734Z" fill="#bcb4a4" stroke="none"/>
    <path class="face face-top" d="M440 270L780 90L1105 175L765 356Z" fill="#f8f4ed" stroke="none"/>
    ${line('M440 270L780 90L1105 175L765 356Z','roof')}
    ${line('M440 270V648L765 734L1105 553V175','outline')}
    ${line('M765 356V734','corner')}
    ${rails}
    <g stroke="none">${windows}</g>
    ${[0,1,2,3,4].map(i=>line(`M${817+i*55} ${328-i*29}V${706-i*29}`, 'mullion')).join('')}
    <path class="accent-plane" d="M729 346L765 356V734L729 725Z" fill="#8f302c" stroke="none"/>
    ${line('M412 666L765 761L1133 565','dimension','none','stroke="#8f302c"')}
    ${line('M400 655L426 677M752 747L779 774M1120 552L1146 577','dimension','none','stroke="#8f302c"')}
  </g>`;
}

function blueprint(mobile) {
  const width=mobile?720:1600, height=mobile?960:900;
  return {
    id:'blueprint',width,height,duration:8, title:'מהקו אל המרחב',
    markup:`<svg class="architecture" viewBox="0 0 ${width} ${height}" aria-hidden="true" data-layout-ignore>
      ${grid(width,height)}
      <g class="draft-guide" fill="none" stroke="#bcb4a4" stroke-width="1.4">${line(mobile?'M52 740H668M360 250V800':'M180 770H1420M800 70V820','guide')}</g>
      <g class="scene-geometry" transform="${mobile?'translate(-170 150) scale(.68)':'translate(-120 -10)'}">${building()}</g>
      <g class="datum" fill="#8f302c"><circle cx="${mobile?52:180}" cy="${mobile?740:770}" r="5"/><path d="${mobile?'M44 740h16M52 732v16':'M172 770h16M180 762v16'}" stroke="#8f302c" stroke-width="1.2"/></g>
    </svg>
    <div class="caption"><span class="eyebrow">YIGAL GROUP</span><h1>מהקו אל המרחב</h1><p>איכות. עיצוב. מיקום.</p></div>
    <div class="corner-note" aria-hidden="true">01 / ARCHITECTURE</div>`,
    css:`.caption{position:absolute;${mobile?'top:68px;right:48px;left:48px':'bottom:88px;right:110px'};text-align:right}.caption h1{font-size:${mobile?64:64}px;line-height:1.1;margin:18px 0 12px;font-weight:500}.caption p{font-size:${mobile?28:27}px;margin:0;color:#625b50}.eyebrow{font-size:${mobile?23:24}px;letter-spacing:.22em;direction:ltr;display:block}.corner-note{position:absolute;bottom:${mobile?54:55}px;left:${mobile?48:85}px;font-size:24px;letter-spacing:.16em;direction:ltr;color:#625b50}.architecture{width:100%;height:100%;display:block}.trace{stroke-dasharray:1;stroke-dashoffset:0}.face,.window,.accent-plane{opacity:1}`,
    js:`tl.fromTo('.draft-grid',{opacity:0},{opacity:.28,duration:1.4,ease:'power1.out'},0)
      .fromTo('.guide',{strokeDashoffset:1},{strokeDashoffset:0,duration:2,ease:'power2.inOut',stagger:.12},.2)
      .fromTo('.roof,.outline,.corner',{strokeDashoffset:1},{strokeDashoffset:0,duration:2.2,stagger:.18,ease:'power2.inOut'},.4)
      .fromTo('.slab',{strokeDashoffset:1},{strokeDashoffset:0,duration:1.4,stagger:.12,ease:'power2.inOut'},1.4)
      .fromTo('.mullion',{strokeDashoffset:1},{strokeDashoffset:0,duration:1.1,stagger:.13,ease:'power2.inOut'},2.1)
      .fromTo('.face',{opacity:0},{opacity:1,duration:1.7,stagger:.2,ease:'power2.inOut'},3)
      .fromTo('.window',{opacity:0,y:22},{opacity:.72,y:0,duration:.6,stagger:.035,ease:'power2.out'},3.6)
      .fromTo('.accent-plane',{opacity:0},{opacity:1,duration:1.1},4.1)
      .fromTo('.facade',{y:40},{y:0,duration:5.4,ease:'power2.inOut'},.6)
      .fromTo('.dimension',{strokeDashoffset:1},{strokeDashoffset:0,duration:1,stagger:.1,ease:'power2.inOut'},5.2)
      .fromTo('.caption > *',{opacity:0,y:24},{opacity:1,y:0,duration:.9,stagger:.14,ease:'power2.out'},.8)
      .fromTo('.datum,.corner-note',{opacity:0},{opacity:1,duration:1},5.4);`,
    fallbackGeometry:`<g transform="translate(-120 -10)">${building()}</g>`
  };
}

const planArt=`<g fill="none" stroke="#25241f" stroke-width="2.5"><path class="plan-trace" pathLength="1" d="M85 95H325V335H85ZM85 215H195V95M195 215H325M195 215V335M85 155H145V215M255 215V335"/><path class="plan-trace" pathLength="1" d="M74 84H336V346H74ZM195 215A70 70 0 0 1 265 285" stroke-width="1"/><path class="plan-trace" pathLength="1" d="M50 95V335M40 95H60M40 335H60M85 365H325M85 355V375M325 355V375" stroke="#8f302c" stroke-width="1.5"/></g><path class="plan-room" d="M198 218H322V332H198Z" fill="#8f302c" opacity=".14"/>`;
const buildArt=`<g fill="none" stroke="#25241f" stroke-width="2.5"><path class="build-trace" pathLength="1" d="M75 335H345M100 335V105H320V335M100 155H320M100 215H320M100 275H320M145 105V335M210 105V335M275 105V335"/><path class="build-trace" pathLength="1" d="M70 85H330M70 72V98M330 72V98M350 105V335M338 105H362M338 335H362" stroke="#8f302c" stroke-width="1.5"/></g><g class="build-panels" fill="#bcb4a4">${[0,1,2].map(y=>[0,1,2].map(x=>`<path class="panel-piece" d="M${151+x*55} ${163+y*59}h42v39h-42Z"/>`).join('')).join('')}</g><path class="build-accent" d="M102 107H143V333H102Z" fill="#8f302c"/>`;
const homeArt=`<g stroke="#25241f" stroke-width="2.5" fill="none"><path class="home-trace" pathLength="1" d="M65 335H355M105 335V95H315V335M115 335V105H305V335"/><path class="home-trace" pathLength="1" d="M125 335V115H295V335M165 115V335"/></g><path class="door-plane" d="M165 115L278 146V335L165 335Z" fill="#8f302c"/><path class="door-light" d="M278 146L295 115V335H278Z" fill="#d5cbb9"/><path class="door-handle" d="M250 222v37" fill="none" stroke="#eee9df" stroke-width="6"/><g class="home-plant" stroke="#625b50" stroke-width="2" fill="none"><path d="M78 335V268M78 296Q43 288 50 261Q78 264 78 296M78 308Q107 289 100 272Q78 279 78 308"/></g>`;

function process(mobile) {
  const width=mobile?720:1600,height=mobile?960:900;
  const stages=[['תכנון','01',planArt],['ביצוע','02',buildArt],['מסירה','03',homeArt]];
  const panels=stages.map(([label,number,art],i)=>`<div class="process-panel panel-${i+1}"><div class="stage-head"><span class="stage-number">${number}</span><h2>${label}</h2></div><svg viewBox="0 0 420 420" aria-hidden="true" data-layout-ignore>${art}</svg><div class="progress-rule"><span class="stage-progress progress-${i+1}"></span></div></div>`).join('');
  return {id:'process',width,height,duration:9,title:'מהתכנון אל הבית',markup:`<header class="process-title"><span>YIGAL GROUP</span><h1>מהתכנון אל הבית</h1></header><div class="process-panels">${panels}</div>`,
    css:`.process-title{position:absolute;top:${mobile?44:75}px;right:${mobile?48:100}px;left:${mobile?48:100}px;text-align:right}.process-title span{font-size:${mobile?23:24}px;letter-spacing:.2em;direction:ltr;display:block}.process-title h1{font-size:${mobile?59:76}px;font-weight:500;line-height:1.1;margin:14px 0 0}.process-panels{position:absolute;${mobile?'top:205px;right:48px;left:48px;bottom:50px;display:flex;flex-direction:column;gap:20px':'top:295px;left:95px;right:95px;bottom:90px;display:grid;grid-template-columns:repeat(3,1fr);gap:55px'};direction:rtl}.process-panel{position:relative;${mobile?'min-height:0;flex:1;display:grid;grid-template-columns:1fr 210px;align-items:center;gap:12px':'padding-inline-start:0;display:flex;flex-direction:column'}}.stage-head{display:flex;align-items:center;gap:26px;${mobile?'padding:0 10px':'padding-inline:25px'}}.stage-number{font-size:${mobile?23:24}px;color:#8f302c;letter-spacing:.1em;direction:ltr}.stage-head h2{font-size:${mobile?48:47}px;font-weight:500;margin:0;line-height:1.1}.process-panel svg{display:block;width:100%;${mobile?'height:200px':'height:390px;flex:1'};overflow:visible}.progress-rule{position:absolute;bottom:0;left:0;right:0;height:1px;background:#bcb4a4}.stage-progress{position:absolute;inset:0;display:block;background:#8f302c;transform-origin:right center}.plan-trace,.build-trace,.home-trace{stroke-dasharray:1;stroke-dashoffset:0}`,
    js:`tl.fromTo('.process-title > *',{opacity:0,y:22},{opacity:1,y:0,duration:.85,stagger:.12,ease:'power2.out'},0)
      .fromTo('.panel-1 .stage-head',{opacity:.3,y:12},{opacity:1,y:0,duration:.6},.4)
      .fromTo('.plan-trace',{strokeDashoffset:1},{strokeDashoffset:0,duration:1.8,stagger:.2,ease:'power2.inOut'},.7)
      .fromTo('.plan-room',{opacity:0},{opacity:.14,duration:.8},2)
      .fromTo('.progress-1',{scaleX:0},{scaleX:1,duration:1.9,ease:'power2.inOut'},.8)
      .fromTo('.panel-2 .stage-head',{opacity:.3,y:12},{opacity:1,y:0,duration:.6},2.7)
      .fromTo('.build-trace',{strokeDashoffset:1},{strokeDashoffset:0,duration:1.7,stagger:.18,ease:'power2.inOut'},2.8)
      .fromTo('.panel-piece',{opacity:0,y:34},{opacity:1,y:0,duration:.65,stagger:.08,ease:'power2.out'},3.4)
      .fromTo('.build-accent',{scaleY:0,svgOrigin:'102 333'},{scaleY:1,svgOrigin:'102 333',duration:1.1,ease:'power2.out'},3.7)
      .fromTo('.progress-2',{scaleX:0},{scaleX:1,duration:2.1,ease:'power2.inOut'},2.8)
      .fromTo('.panel-3 .stage-head',{opacity:.3,y:12},{opacity:1,y:0,duration:.6},5)
      .fromTo('.home-trace',{strokeDashoffset:1},{strokeDashoffset:0,duration:1.5,stagger:.15,ease:'power2.inOut'},5.2)
      .fromTo('.door-plane',{scaleX:0,svgOrigin:'165 335'},{scaleX:1,svgOrigin:'165 335',duration:1.3,ease:'power2.inOut'},5.8)
      .fromTo('.door-light,.door-handle,.home-plant',{opacity:0},{opacity:1,duration:1.1,stagger:.15},6.2)
      .fromTo('.progress-3',{scaleX:0},{scaleX:1,duration:2,ease:'power2.inOut'},5.5);`,
    fallbackGeometry:`<g transform="translate(100 260)">${planArt}</g><g transform="translate(590 260)">${buildArt}</g><g transform="translate(1080 260)">${homeArt}</g>`};
}

function chapter(mobile) {
  const width=mobile?720:1600,height=mobile?960:900;
  const cx=width/2,cy=height/2, frameW=mobile?470:990,frameH=mobile?660:720;
  const x=cx-frameW/2,y=cy-frameH/2;
  const frames=Array.from({length:5},(_,i)=>{const inset=i*(mobile?20:29);return `<path class="aperture aperture-${i}" pathLength="1" d="M${x+inset} ${y+inset}H${x+frameW-inset}V${y+frameH-inset}H${x+inset}Z"/>`;}).join('');
  return {id:'chapter',width,height,duration:7,title:'איכות. עיצוב. מיקום.',dark:true,
    markup:`<svg class="chapter-geometry" viewBox="0 0 ${width} ${height}" aria-hidden="true" data-layout-ignore><g fill="none" stroke="#bcb4a4" stroke-width="1" opacity=".6">${frames}</g><path class="red-edge" d="M${x-1} ${y}V${y+frameH}" stroke="#b94e44" stroke-width="5"/><path class="red-tick" d="M${cx-20} ${y-34}h40" stroke="#b94e44" stroke-width="2"/></svg><div class="chapter-copy"><span class="chapter-kicker">YIGAL GROUP</span><div class="word-mask"><h1 data-layout-allow-overflow class="chapter-word word-1">איכות.</h1></div><div class="word-mask"><p data-layout-allow-overflow class="chapter-word word-2">עיצוב.</p></div><div class="word-mask"><p data-layout-allow-overflow class="chapter-word word-3">מיקום.</p></div></div>`,
    css:`body{background:#25241f;color:#eee9df}.chapter-geometry{position:absolute;inset:0;width:100%;height:100%}.aperture{stroke-dasharray:1;stroke-dashoffset:0}.chapter-copy{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding-top:${mobile?22:18}px}.chapter-kicker{font-size:${mobile?23:24}px;letter-spacing:.26em;direction:ltr;margin-bottom:${mobile?35:28}px;color:#d4cbbd}.word-mask{overflow:hidden;padding:0 .2em}.chapter-word{font-size:${mobile?102:118}px;line-height:1.03;letter-spacing:-.05em;font-weight:400;margin:0;padding:0 0 8px}.word-2{color:#d4cbbd}.word-3{color:#eee9df}`,
    js:`tl.fromTo('.aperture',{strokeDashoffset:1},{strokeDashoffset:0,duration:2.2,stagger:.16,ease:'power2.inOut'},0)
      .fromTo('.aperture-0',{scale:.96,svgOrigin:'${cx} ${cy}'},{scale:1,svgOrigin:'${cx} ${cy}',duration:5,ease:'power2.inOut'},.3)
      .fromTo('.aperture-1',{scale:.96,svgOrigin:'${cx} ${cy}'},{scale:1,svgOrigin:'${cx} ${cy}',duration:5.2,ease:'power2.inOut'},.3)
      .fromTo('.aperture-2',{scale:.96,svgOrigin:'${cx} ${cy}'},{scale:1,svgOrigin:'${cx} ${cy}',duration:5.4,ease:'power2.inOut'},.3)
      .fromTo('.aperture-3',{scale:.96,svgOrigin:'${cx} ${cy}'},{scale:1,svgOrigin:'${cx} ${cy}',duration:5.6,ease:'power2.inOut'},.3)
      .fromTo('.aperture-4',{scale:.96,svgOrigin:'${cx} ${cy}'},{scale:1,svgOrigin:'${cx} ${cy}',duration:5.8,ease:'power2.inOut'},.3)
      .fromTo('.red-edge',{scaleY:0,svgOrigin:'${x-1} ${y+frameH}'},{scaleY:1,svgOrigin:'${x-1} ${y+frameH}',duration:2,ease:'power3.inOut'},.6)
      .fromTo('.red-tick,.chapter-kicker',{opacity:0},{opacity:1,duration:1},1)
      .fromTo('.word-1',{yPercent:115},{yPercent:0,duration:1.2,ease:'power3.out'},1.5)
      .fromTo('.word-2',{yPercent:115},{yPercent:0,duration:1.2,ease:'power3.out'},2.05)
      .fromTo('.word-3',{yPercent:115},{yPercent:0,duration:1.2,ease:'power3.out'},2.6);`,
    fallbackGeometry:`<g fill="none" stroke="#bcb4a4" stroke-width="1" opacity=".6">${frames}</g><path d="M${x} ${y}V${y+frameH}" stroke="#b94e44" stroke-width="5"/>`};
}

function documentFor(c) {
  return `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=${c.width}, height=${c.height}"><title>${c.title} — Yigal Group</title>
<script src="assets/hyperframe.runtime.min.js"></script><script src="assets/gsap.min.js"></script>
<style>@font-face{font-family:Assistant;src:url('assets/assistant-hebrew.woff2') format('woff2');font-weight:200 800;font-style:normal;font-display:block}*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0}body{font-family:Assistant,sans-serif;background:#eee9df;color:#25241f}#root{width:100%;height:100%;position:relative;overflow:hidden}.composition-content{position:absolute;inset:0}${c.css}</style></head>
<body><div id="root" data-composition-id="${c.id}" data-start="0" data-width="${c.width}" data-height="${c.height}" data-duration="${c.duration}"><section id="${c.id}-scene" class="composition-content">${c.markup}</section></div>
<script>const tl=gsap.timeline({paused:true});${c.js}window.__timelines=window.__timelines||{};window.__timelines['${c.id}']=tl;</script></body></html>`;
}

function fallbackFor(c) {
  const dark=!!c.dark,mobile=c.width===720,cx=c.width/2;
  let geometry=c.fallbackGeometry,words='';
  if(c.id==='chapter'){
    const top=mobile?380:330,gap=mobile?130:140;
    words=['איכות.','עיצוב.','מיקום.'].map((word,i)=>`<text x="${cx}" y="${top+i*gap}">${word}</text>`).join('');
  }else if(c.id==='process'){
    const arts=[planArt,buildArt,homeArt],labels=['תכנון','ביצוע','מסירה'];
    words=`<text x="${cx}" y="${mobile?130:160}">מהתכנון אל הבית</text>`;
    geometry=arts.map((art,i)=>mobile?`<g transform="translate(48 ${205+i*235}) scale(.5)">${art}</g>`:`<g transform="translate(${1080-i*490} 260)">${art}</g>`).join('');
    words+=labels.map((label,i)=>`<text x="${mobile?550:1290-i*490}" y="${mobile?325+i*235:780}" font-size="${mobile?46:50}">${label}</text>`).join('');
  }else{
    geometry=`<g transform="${mobile?'translate(-170 150) scale(.68)':'translate(-120 -10)'}">${building()}</g>`;
    words=`<text x="${mobile?cx:1270}" y="${mobile?160:800}" text-anchor="${mobile?'middle':'end'}">מהקו אל המרחב</text>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${c.width}" height="${c.height}" viewBox="0 0 ${c.width} ${c.height}"><rect width="${c.width}" height="${c.height}" fill="${dark?colors.ink:colors.stone}"/>${geometry}<g font-family="Arial,sans-serif" font-size="${c.id==='chapter'?(mobile?102:116):(mobile?56:64)}" fill="${dark?colors.stone:colors.ink}" text-anchor="middle" direction="rtl">${words}</g></svg>`;
}

const manifest=[];
for (const factory of [blueprint,process,chapter]) {
  const desktop=factory(false),mobile=factory(true),folder=path.join(output,desktop.id);
  fs.mkdirSync(folder,{recursive:true});
  fs.mkdirSync(path.join(folder,'mobile'),{recursive:true});
  fs.writeFileSync(path.join(folder,'index.html'),documentFor(desktop));
  fs.writeFileSync(path.join(folder,'mobile','index.html'),documentFor(mobile));
  for(const variantFolder of [folder,path.join(folder,'mobile')]){
    fs.mkdirSync(path.join(variantFolder,'assets'),{recursive:true});
    for(const [source,file] of bundledAssets) fs.copyFileSync(path.join(root,source),path.join(variantFolder,'assets',file));
  }
  fs.writeFileSync(path.join(folder,'fallback.svg'),fallbackFor(desktop));
  fs.writeFileSync(path.join(folder,'mobile','fallback.svg'),fallbackFor(mobile));
  const checks={duration:desktop.duration,assertions:[{kind:'appearsBy',selector:desktop.id==='blueprint'?'.caption h1':desktop.id==='process'?'.process-title h1':'.word-3',bySec:desktop.id==='chapter'?4.2:2.2}]};
  fs.writeFileSync(path.join(folder,'index.motion.json'),JSON.stringify(checks,null,2));
  fs.writeFileSync(path.join(folder,'mobile','index.motion.json'),JSON.stringify(checks,null,2));
  manifest.push({id:desktop.id,title:desktop.title,duration:desktop.duration,desktop:{src:`/compositions/${desktop.id}/index.html`,width:1600,height:900},mobile:{src:`/compositions/${desktop.id}/mobile/index.html`,width:720,height:960,fallback:`/compositions/${desktop.id}/mobile/fallback.svg`},fallback:`/compositions/${desktop.id}/fallback.svg`});
}
fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2));
console.log(`Built ${manifest.length} paired desktop/mobile HyperFrames compositions.`);
