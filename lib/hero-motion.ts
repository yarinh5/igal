export type HeroMode='static'|'portrait'|'desktop';
export const clamp01=(value:number)=>Math.min(1,Math.max(0,value));
const smooth=(value:number)=>{const t=clamp01(value);return t*t*(3-2*t)};

export function heroMode(width:number,height:number,reduced:boolean):HeroMode {
 if(reduced||height<650)return 'static';
 return width<900?'portrait':'desktop';
}

/** Pure pose sampling makes reverse scrolling and late WebGL loading deterministic. */
export function architecturePose(progress:number,mobile:boolean){
 const p=clamp01(progress),assembly=smooth((p-.16)/.55),orbit=smooth(p);
 return {
  explosion:1-assembly,
  angle:-.72+orbit*1.62,
  elevation:(mobile?11.5:10.5)-orbit*4.4,
  distance:(mobile?26.5:22)-orbit*(mobile?3.5:4.5),
  targetY:2.65-orbit*.25,
  rotation:-.13+orbit*.08,
  blueprintOpacity:(1-smooth((p-.38)/.4))*.42,
  windowGlow:.12+assembly*.48,
 };
}
