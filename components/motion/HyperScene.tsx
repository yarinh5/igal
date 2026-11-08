'use client';
import {useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {useMotion} from './MotionProvider';
import manifest from '@/public/compositions/manifest.json';

type Player=HTMLElement&{seek:(seconds:number)=>void;pause:()=>void};
type Scene='blueprint'|'process'|'chapter'|'threshold';
export function HyperScene({scene,label,className=''}:{scene:Scene;label:string;className?:string}){
 const root=useRef<HTMLDivElement>(null);
 const {reduced}=useMotion();
 const [mobile,setMobile]=useState(false);
 const [status,setStatus]=useState<'fallback'|'ready'>('fallback');
 const definition=manifest.find(entry=>entry.id===scene)!;
 const variant=mobile?definition.mobile:definition.desktop;
 useEffect(()=>{
  const media=matchMedia('(max-width:600px)');const update=()=>setMobile(media.matches);
  update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);
 },[]);
 useEffect(()=>{
  const host=root.current;
  if(!host||reduced){setStatus('fallback');return;}
  let disposed=false,ready=false,visible=false,player:Player|null=null;
  let animation:gsap.core.Tween|undefined,timer:ReturnType<typeof setTimeout>|undefined,frame=0;
  let duration=definition.duration,lastTime=-1;
  const playhead={value:0};
  setStatus('fallback');delete host.dataset.duration;delete host.dataset.time;
  const paint=()=>{
   frame=0;if(disposed||!ready||!visible||document.hidden||!player)return;
   const fps=mobile?30:60;
   const target=Math.min(duration-.025,Math.max(0,Math.round(playhead.value*duration*fps)/fps));
   if(Math.abs(lastTime-target)<1/fps*.5)return;
   player.seek(target);lastTime=target;
   host.dataset.progress=playhead.value.toFixed(4);host.dataset.time=target.toFixed(3);
  };
  const schedule=()=>{if(!frame&&ready&&visible&&!document.hidden)frame=requestAnimationFrame(paint)};
  const fail=()=>{if(disposed)return;setStatus('fallback');ready=false;animation?.scrollTrigger?.kill();animation?.kill();if(frame)cancelAnimationFrame(frame);frame=0;player?.remove();player=null;};
  const inView=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)schedule();else if(frame){cancelAnimationFrame(frame);frame=0;}},{threshold:0});
  inView.observe(host);
  const lazy=new IntersectionObserver(entries=>{
   if(!entries.some(entry=>entry.isIntersecting))return;
   lazy.disconnect();
   import('@hyperframes/player').then(()=>{
    if(disposed)return;
    player=document.createElement('hyperframes-player') as Player;
    for(const [key,value] of Object.entries({src:variant.src,width:String(variant.width),height:String(variant.height),muted:'','assets-loading-ui':'none','disable-click-to-play':'','low-power-idle':'','aria-hidden':'true',tabindex:'-1'}))player.setAttribute(key,value);
    player.addEventListener('ready',event=>{
     if(disposed||!player)return;
     ready=true;clearTimeout(timer);
     duration=(event as CustomEvent<{duration:number}>).detail.duration||definition.duration;
     host.dataset.duration=String(duration);setStatus('ready');player.pause();
     animation=gsap.fromTo(playhead,{value:0},{value:1,duration:1,ease:'none',onUpdate:schedule,scrollTrigger:{trigger:host,start:scene==='threshold'?'top 94%':'top 86%',end:scene==='threshold'?'top 15%':'bottom 14%',scrub:mobile?.3:.5,invalidateOnRefresh:true,onRefresh:schedule}});
     schedule();
    });
    player.addEventListener('error',fail);
    host.appendChild(player);
    timer=setTimeout(()=>{if(!ready)fail()},14000);
   }).catch(fail);
  },{rootMargin:mobile?'350px':'600px'});
  lazy.observe(host);
  document.addEventListener('visibilitychange',schedule);
  return()=>{disposed=true;clearTimeout(timer);cancelAnimationFrame(frame);lazy.disconnect();inView.disconnect();animation?.scrollTrigger?.kill();animation?.kill();document.removeEventListener('visibilitychange',schedule);player?.remove()};
 },[scene,reduced,mobile,definition,variant]);
 return <div ref={root} className={`hyper-scene ${className}`} style={{aspectRatio:`${variant.width}/${variant.height}`}} data-scene={scene} data-status={status} role="img" aria-label={label}><img src={mobile?definition.mobile.fallback:definition.fallback} className="hyper-fallback" alt="" loading="lazy"/></div>;
}
