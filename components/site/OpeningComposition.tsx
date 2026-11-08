'use client';
import {useEffect,useRef} from 'react';

type Player=HTMLElement&{play:()=>void;pause:()=>void};

/** Original 3s HTML/GSAP composition: no media element or autoplay permission. */
export function OpeningComposition({onStart,onEnd,onError}:{onStart:()=>void;onEnd:()=>void;onError:()=>void}){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  let disposed=false,player:Player|null=null;
  import('@hyperframes/player').then(()=>{
   if(disposed||!host.current)return;
   player=document.createElement('hyperframes-player') as Player;
   for(const [key,value] of Object.entries({src:'/compositions/opening/index.html',width:'1920',height:'1080',muted:'','assets-loading-ui':'none','disable-click-to-play':'','aria-hidden':'true',tabindex:'-1'}))player.setAttribute(key,value);
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
