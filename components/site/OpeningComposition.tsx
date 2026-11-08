'use client';
import {useEffect,useRef} from 'react';

type Player=HTMLElement&{play:()=>void;pause:()=>void};

/** Shared 3s HTML/GSAP opening: no media element or autoplay permission. */
export function OpeningComposition({onStart,onEnd,onError}:{onStart:()=>void;onEnd:()=>void;onError:()=>void}){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  let disposed=false,player:Player|null=null;
  import('@hyperframes/player').then(()=>{
   if(disposed||!host.current)return;
   const portrait=matchMedia('(max-width:600px) and (orientation:portrait)').matches;
   host.current.dataset.portrait=String(portrait);
   player=document.createElement('hyperframes-player') as Player;
   for(const [key,value] of Object.entries({src:portrait?'/compositions/opening/mobile/index.html':'/compositions/opening/index.html',width:portrait?'900':'1920',height:portrait?'1200':'1080',muted:'','assets-loading-ui':'none','disable-click-to-play':'','aria-hidden':'true',tabindex:'-1'}))player.setAttribute(key,value);
   player.addEventListener('ready',()=>{if(!disposed)player?.play()});
   player.addEventListener('play',()=>{if(!disposed)onStart()});
   player.addEventListener('ended',()=>{if(!disposed)onEnd()});
   player.addEventListener('error',()=>{if(!disposed)onError()});
   host.current.appendChild(player);
  }).catch(()=>{if(!disposed)onError()});
  return()=>{disposed=true;player?.pause();player?.remove()};
 },[onStart,onEnd,onError]);
 return <div ref={host} className="brand-opening-composition" aria-hidden="true"/>;
}
