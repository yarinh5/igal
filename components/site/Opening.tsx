'use client';
import {createContext,useCallback,useContext,useEffect,useRef,useState} from 'react';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {OpeningComposition} from './OpeningComposition';

const OpeningContext=createContext(true);
export const useOpening=()=>useContext(OpeningContext);

/** One bounded introduction per document load; never persists a visited flag. */
export function Opening({children}:{children:React.ReactNode}){
 const [active,setActive]=useState(true);
 const [animate,setAnimate]=useState(false);
 const [playing,setPlaying]=useState(false);
 const [composition,setComposition]=useState(false);
 const playbackStarted=useRef(false);
 const playbackTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const content=useRef<HTMLDivElement>(null);
 const video=useRef<HTMLVideoElement>(null);
 const skip=useRef<HTMLButtonElement>(null);
 const finish=useCallback(()=>setActive(false),[]);
 const still=useCallback(()=>{setAnimate(false);setPlaying(false)},[]);
 const useComposition=useCallback(()=>{
  if(playbackTimer.current)clearTimeout(playbackTimer.current);
  playbackStarted.current=false;setPlaying(false);setComposition(true);
 },[]);
 useEffect(()=>{
  if(!active)return;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let saved:string|null=null;try{saved=localStorage.getItem('yigal-motion')}catch{}
  setAnimate(saved!=='reduce'&&(saved==='full'||!media.matches));
  const update=()=>{if(media.matches)setAnimate(false)};
  media.addEventListener('change',update);
  const bodyOverflow=document.body.style.overflow;
  const htmlOverflow=document.documentElement.style.overflow;
  document.body.style.overflow='hidden';document.documentElement.style.overflow='hidden';
  if(content.current)content.current.inert=true;
  // This is only the failure ceiling. Successful playback owns its full 3s.
  const timer=window.setTimeout(()=>setActive(false),8000);
  return()=>{
   clearTimeout(timer);media.removeEventListener('change',update);
   if(playbackTimer.current)clearTimeout(playbackTimer.current);
   document.body.style.overflow=bodyOverflow;document.documentElement.style.overflow=htmlOverflow;
   if(content.current)content.current.inert=false;
  };
 },[active]);
 useEffect(()=>{
  if(!active)return;
  if(animate){
   if(composition)return;
   let disposed=false;
   // Some mobile browsers neither reject play() nor emit playing.
   const timer=setTimeout(()=>{if(!playbackStarted.current)useComposition()},1500);
   if(video.current){video.current.muted=true;video.current.play().catch(()=>{if(!disposed)useComposition()})}
   return()=>{disposed=true;clearTimeout(timer)};
  }
  const timer=setTimeout(()=>setActive(false),3000);
  return()=>clearTimeout(timer);
 },[animate,active,composition,useComposition]);
 const started=useCallback(()=>{
  setPlaying(true);
  if(playbackStarted.current)return;
  playbackStarted.current=true;
  // Ended normally closes the opening; this handles a mid-playback stall.
  playbackTimer.current=setTimeout(finish,3500);
 },[finish]);
 useEffect(()=>{
  if(active)return;
  const frame=requestAnimationFrame(()=>{ScrollTrigger.refresh();
   if(location.hash){try{document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()}catch{}}
  });
  return()=>cancelAnimationFrame(frame);
 },[active]);
 const dismiss=()=>{const focused=document.activeElement===skip.current;finish();if(focused)requestAnimationFrame(()=>{const main=document.getElementById('main');main?.setAttribute('tabindex','-1');main?.focus({preventScroll:true})})};
 return <OpeningContext.Provider value={active}>
  <div ref={content}>{children}</div>
  {active&&<div className="brand-opening" data-opening data-playing={playing&&animate} data-lenis-prevent role="region" aria-label="פתיחת קבוצת יגאל בוחבוט" onKeyDown={e=>{if(e.key==='Escape')dismiss()}}>
   <img className="brand-opening-fallback" src="/media/yigal-opening-poster.webp" alt="" aria-hidden="true"/>
   {animate&&(composition?<OpeningComposition onStart={started} onEnd={finish} onError={still}/>:<video ref={video} className="brand-opening-video" src="/media/yigal-opening.mp4" autoPlay muted playsInline preload="auto" aria-hidden="true" onPlaying={started} onError={useComposition} onEnded={finish}/>)}
   <button ref={skip} className="brand-opening-skip" onClick={dismiss}>דלגו לאתר</button>
  </div>}
  <noscript><style>{'.brand-opening{display:none!important}'}</style></noscript>
 </OpeningContext.Provider>;
}
