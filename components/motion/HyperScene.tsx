'use client';
import {useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useMotion} from './MotionProvider';

type Player=HTMLElement&{seek:(time:number)=>void;pause:()=>void;ready:boolean;currentTime:number;duration:number};
export function HyperScene({scene,label,className=''}:{scene:'blueprint'|'process'|'chapter';label:string;className?:string}){
 const root=useRef<HTMLDivElement>(null);const [status,setStatus]=useState<'fallback'|'ready'>('fallback');const {reduced}=useMotion();const [mobile,setMobile]=useState(false);
 useEffect(()=>{const media=matchMedia('(max-width:600px)');const update=()=>setMobile(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 useEffect(()=>{const host=root.current;if(!host||reduced){setStatus('fallback');return;}let disposed=false,player:Player|null=null,trigger:ScrollTrigger|undefined,timer:ReturnType<typeof setTimeout>;let progress=0;
  setStatus('fallback');const observer=new IntersectionObserver(entries=>{if(!entries.some(x=>x.isIntersecting))return;observer.disconnect();import('@hyperframes/player').then(()=>{if(disposed)return;player=document.createElement('hyperframes-player') as Player;player.setAttribute('src',`/compositions/${scene}/${mobile?'mobile/':''}index.html`);player.setAttribute('width',mobile?'720':'1600');player.setAttribute('height',mobile?'960':'900');player.setAttribute('muted','');player.setAttribute('assets-loading-ui','none');player.setAttribute('disable-click-to-play','');player.setAttribute('low-power-idle','');player.setAttribute('aria-hidden','true');player.setAttribute('tabindex','-1');
   player.addEventListener('ready',()=>{if(disposed||!player)return;clearTimeout(timer);host.dataset.duration=String(player.duration);setStatus('ready');player.pause();player.seek(progress*player.duration);trigger=ScrollTrigger.create({trigger:host,start:'top 85%',end:'bottom 15%',scrub:true,onUpdate:self=>{progress=self.progress;host.dataset.progress=String(progress);player?.seek(Math.min((player?.duration||8)-.04,progress*(player?.duration||8)))},onRefresh:self=>{progress=self.progress;host.dataset.progress=String(progress);player?.seek(progress*Math.max(0,(player?.duration||8)-.04))}});ScrollTrigger.refresh()});
   player.addEventListener('error',()=>{if(!disposed){setStatus('fallback');trigger?.kill()}});host.appendChild(player);timer=setTimeout(()=>{if(!player?.ready)setStatus('fallback')},14000);
  }).catch(()=>setStatus('fallback'));},{rootMargin:'500px'});observer.observe(host);
  return()=>{disposed=true;observer.disconnect();clearTimeout(timer);trigger?.kill();player?.remove();};
 },[scene,reduced,mobile]);
 return <div ref={root} className={`hyper-scene ${className}`} data-scene={scene} data-status={status} role="img" aria-label={label}><img src={`/compositions/${scene}/${mobile?'mobile/':''}fallback.svg`} className="hyper-fallback" alt="" loading="lazy"/></div>;
}
