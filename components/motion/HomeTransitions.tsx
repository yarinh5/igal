'use client';
import {useEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useMotion} from './MotionProvider';

/** Only unpinned section children animate; the scroll geometry stays stable. */
export function HomeTransitions(){
 const {reduced}=useMotion();
 useEffect(()=>{
  if(reduced)return;
  const main=document.querySelector<HTMLElement>('[data-home-motion]');
  if(!main)return;
  const media=gsap.matchMedia();
  media.add({portrait:'(max-width:899px)',desktop:'(min-width:900px)'},context=>{
   const mobile=!!context.conditions?.portrait;
   const scope=gsap.context(()=>{
    gsap.fromTo('.intro-section .year-line',{scaleX:0},{scaleX:1,transformOrigin:'right',ease:'none',scrollTrigger:{trigger:'.intro-section',start:'top 80%',end:'center 48%',scrub:.5}});
    gsap.fromTo('.craft-section',{clipPath:`inset(${mobile?3:7}% ${mobile?2:5}% 0%)`},{clipPath:'inset(0% 0% 0%)',ease:'none',scrollTrigger:{trigger:'.craft-section',start:'top 96%',end:'top 22%',scrub:.45}});
    gsap.utils.toArray<HTMLElement>('.project-image img').forEach(img=>{
     gsap.fromTo(img,{yPercent:-4,scale:1.09},{yPercent:4,scale:1.09,ease:'none',scrollTrigger:{trigger:img.closest('.project-image'),start:'top bottom',end:'bottom top',scrub:.6}});
    });
    gsap.fromTo('.blueprint-section .hyper-scene',{y:mobile?24:65,scale:.96},{y:0,scale:1,ease:'none',scrollTrigger:{trigger:'.blueprint-section',start:'top 92%',end:'center 55%',scrub:.5}});
    gsap.utils.toArray<HTMLElement>('.lottery-numbers a').forEach((item,index)=>{
     gsap.fromTo(item,{y:18,opacity:0},{y:0,opacity:1,duration:.5,delay:index*.045,ease:'power2.out',scrollTrigger:{trigger:'.lottery-numbers',start:'top 87%',toggleActions:'play none none reverse'}});
    });
   },main);
   return()=>scope.revert();
  });
  return()=>media.revert();
 },[reduced]);
 return null;
}
