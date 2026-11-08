export type HeroMode='static'|'portrait'|'desktop';
export type RenderProfile={tier:'compact'|'mobile'|'desktop';dpr:number;antialias:boolean};
export const clamp01=(value:number)=>Math.min(1,Math.max(0,value));
const smooth=(value:number)=>{const t=clamp01(value);return t*t*(3-2*t)};

export function heroMode(width:number,height:number,reduced:boolean):HeroMode {
 if(reduced||height<650)return 'static';
 return width<900?'portrait':'desktop';
}

/** Keeps mobile fill-rate bounded while preserving the same deterministic story. */
export function renderProfile(mobile:boolean,cores:number,memory:number|undefined,pixelRatio:number):RenderProfile {
 const dpr=Math.max(.75,pixelRatio||1);
 if(!mobile)return {tier:'desktop',dpr:Math.min(dpr,1.6),antialias:true};
 const mobileDpr=dpr>=1?Math.max(1.25,dpr):dpr;
 const constrained=cores<=4||(memory!==undefined&&memory<=4);
 return constrained
  ?{tier:'compact',dpr:Math.min(mobileDpr,1.25),antialias:true}
  :{tier:'mobile',dpr:Math.min(mobileDpr,1.5),antialias:true};
}

/** Pure pose sampling makes reverse scrolling and late WebGL loading deterministic. */
export function architecturePose(progress:number,mobile:boolean){
 const p=clamp01(progress),assembly=smooth((p-.16)/.55),orbit=smooth(p);
 return {
  explosion:1-assembly,
  angle:(mobile?-.82:-.78)+orbit*(mobile?1.62:1.72),
  elevation:(mobile?11.7:10.7)-orbit*4.5,
  distance:(mobile?26.8:22.5)-orbit*(mobile?3.6:5),
  targetX:(mobile?-.25:-.25)+orbit*(mobile?.4:.45),
  targetY:2.72-orbit*.32,
  rotation:-.16+orbit*.13,
  modelLift:(1-assembly)*(mobile?.18:.15),
  blueprintOpacity:(1-smooth((p-.38)/.4))*.42,
  windowGlow:.12+assembly*.48,
 };
}
