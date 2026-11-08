'use client';
import {createContext,useCallback,useContext,useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {initialScrollAction} from '@/lib/navigation';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ignoreMobileResize:true});
type MotionContextValue={reduced:boolean;toggle:()=>void;scrollTo:(hash:string)=>void};
const MotionContext=createContext<MotionContextValue>({reduced:true,toggle:()=>{},scrollTo:()=>{}});
export const useMotion=()=>useContext(MotionContext);
export function MotionProvider({children}:{children:React.ReactNode}){
 const [reduced,setReduced]=useState(true);const [preference,setPreference]=useState<'auto'|'reduce'|'full'>('auto');
 const pref=useRef<'auto'|'reduce'|'full'>('auto');
 const lenis=useRef<import('lenis').default|null>(null);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');let saved:'auto'|'reduce'|'full'='auto';try{const p=localStorage.getItem('yigal-motion');if(p==='reduce'||p==='full')saved=p;}catch{}pref.current=saved;setPreference(saved);const update=()=>setReduced(pref.current==='reduce'||(pref.current==='auto'&&media.matches));update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 const toggle=useCallback(()=>{const next=reduced?'full':'reduce';pref.current=next;setPreference(next);setReduced(next==='reduce');try{localStorage.setItem('yigal-motion',next)}catch{}},[reduced]);
 const scrollTo=useCallback((hash:string)=>{const id=decodeURIComponent(hash.slice(1));const target=document.getElementById(id);if(!target)return;const y=target.getBoundingClientRect().top+window.scrollY-(document.querySelector('header')?.getBoundingClientRect().height||72);if(lenis.current)lenis.current.scrollTo(y,{duration:1.15});else window.scrollTo({top:y,behavior:reduced?'instant':'smooth'});history.pushState(null,'',hash);target.setAttribute('tabindex','-1');target.focus({preventScroll:true});},[reduced]);
 useEffect(()=>{document.documentElement.dataset.motion=reduced?'reduced':'full';let cancelled=false;let ticker:((time:number)=>void)|undefined;
   if(!reduced&&matchMedia('(pointer:fine) and (min-width:900px)').matches){import('lenis').then(({default:Lenis})=>{if(cancelled)return;const instance=new Lenis({autoRaf:false,duration:1.1,smoothWheel:true,syncTouch:false,anchors:false,prevent:()=>!!document.querySelector("dialog[open]")});lenis.current=instance;instance.on('scroll',ScrollTrigger.update);ticker=t=>instance.raf(t*1000);gsap.ticker.add(ticker);gsap.ticker.lagSmoothing(0);});}
   const context=gsap.context(()=>{if(!reduced){gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>{gsap.fromTo(el,{y:38,opacity:0},{y:0,opacity:1,duration:1.0,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',toggleActions:'play none none reverse'}})});}});
   const refresh=()=>{ScrollTrigger.refresh();lenis.current?.resize()};document.fonts.ready.then(()=>{if(!cancelled)refresh()});window.addEventListener('load',refresh);const timeout=setTimeout(refresh,600);
   return()=>{cancelled=true;clearTimeout(timeout);window.removeEventListener('load',refresh);context.revert();if(ticker)gsap.ticker.remove(ticker);lenis.current?.destroy();lenis.current=null;};
 },[reduced]);
 useEffect(()=>{history.scrollRestoration='manual';const nav=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined;const action=initialScrollAction(nav?.type||'navigate',location.hash);let timer:ReturnType<typeof setTimeout>;
   if(action.reset){if(location.hash)history.replaceState(null,'',location.pathname+location.search);window.scrollTo(0,0);timer=setTimeout(()=>window.scrollTo(0,0),80);}else{timer=setTimeout(()=>{const el=document.getElementById(decodeURIComponent(action.hash.slice(1)));if(el)window.scrollTo(0,el.getBoundingClientRect().top+window.scrollY-(document.querySelector('header')?.getBoundingClientRect().height||72))},700)}
   return()=>clearTimeout(timer);
 },[]);
 useEffect(()=>{
   const click=(event:MouseEvent)=>{const a=(event.target as Element)?.closest<HTMLAnchorElement>('a[href]');if(!a||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||a.target||a.download)return;const url=new URL(a.href,location.href);if(url.origin!==location.origin)return;if(url.pathname===location.pathname&&url.hash){event.preventDefault();scrollTo(url.hash);}else if(url.pathname!==location.pathname&&!reduced&&!url.pathname.startsWith('/api/')&&!a.hasAttribute('data-no-transition')){event.preventDefault();const cover=document.getElementById('route-curtain');if(cover){cover.setAttribute('aria-hidden','false');gsap.fromTo(cover,{scaleY:0},{scaleY:1,duration:0.35,ease:'power3.inOut',onComplete:()=>location.assign(a.href)})}else location.assign(a.href);}};
   const hashchange=()=>{const el=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(el)window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-(document.querySelector('header')?.getBoundingClientRect().height||72),behavior:'instant'})};
   const pageshow=(event:PageTransitionEvent)=>{const cover=document.getElementById('route-curtain');if(cover){gsap.set(cover,{scaleY:0});cover.setAttribute('aria-hidden','true')}if(event.persisted)ScrollTrigger.refresh()};
   document.addEventListener('click',click);window.addEventListener('hashchange',hashchange);window.addEventListener('pageshow',pageshow);return()=>{document.removeEventListener('click',click);window.removeEventListener('hashchange',hashchange);window.removeEventListener('pageshow',pageshow)};
 },[scrollTo,reduced]);
 return <MotionContext.Provider value={{reduced,toggle,scrollTo}}>{children}<div id="route-curtain" aria-hidden="true"><span>YIGAL GROUP</span></div><span hidden data-motion-preference={preference}/></MotionContext.Provider>;
}
