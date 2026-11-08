'use client';
import {useEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useMotion} from './MotionProvider';

/** Reversible, section-local choreography. Pinned parents never receive transforms. */
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
    const scrub=mobile?.28:.55;
    const reveal=(target:gsap.TweenTarget,trigger:gsap.DOMTarget,from:gsap.TweenVars,to:gsap.TweenVars={})=>gsap.fromTo(target,from,{...to,ease:'none',scrollTrigger:{trigger,start:'top 90%',end:'center 55%',scrub,invalidateOnRefresh:true}});

    reveal('.threshold-section .hyper-scene','.threshold-section',{scale:1.045,yPercent:-1},{scale:1,yPercent:0,scrollTrigger:{trigger:'.threshold-section',start:'top 92%',end:'bottom 40%',scrub}});
    reveal('.intro-section h2','.intro-section',{y:mobile?48:78,clipPath:'inset(0 0 100% 0)'},{y:0,clipPath:'inset(0 0 0% 0)'});
    reveal('.intro-text','.intro-section',{x:mobile?28:55,opacity:.25},{x:0,opacity:1});
    reveal('.intro-year','.intro-section',{y:mobile?30:60,opacity:.2},{y:0,opacity:1});
    gsap.fromTo('.intro-section .year-line',{scaleX:0},{scaleX:1,transformOrigin:'right',ease:'none',scrollTrigger:{trigger:'.intro-section',start:'top 82%',end:'center 48%',scrub}});

    reveal('.projects-section .section-heading h2','.projects-section',{y:mobile?44:70,clipPath:'inset(0 0 100% 0)'},{y:0,clipPath:'inset(0 0 0% 0)'});
    reveal('.projects-section .section-heading .text-link','.projects-section',{x:mobile?-24:-45,opacity:0},{x:0,opacity:1});
    gsap.utils.toArray<HTMLElement>('.project-card').forEach((card,index)=>{
     reveal(card,card,{y:mobile?34:62,opacity:.45,scale:.985},{y:0,opacity:1,scale:1,scrollTrigger:{trigger:card,start:`top ${mobile?94-index*2:91}%`,end:'center 58%',scrub}});
     const image=card.querySelector('img');if(image)gsap.fromTo(image,{yPercent:-5,scale:1.1},{yPercent:5,scale:1.1,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub}});
     const caption=card.querySelector('.project-card-caption');if(caption)reveal(caption,card,{y:20,opacity:.2},{y:0,opacity:1});
    });

    reveal('.craft-top h2','.craft-section',{y:mobile?48:76,clipPath:'inset(0 0 100% 0)'},{y:0,clipPath:'inset(0 0 0% 0)'});
    reveal('.craft-top>p','.craft-section',{x:mobile?26:-45,opacity:.2},{x:0,opacity:1});
    reveal('.craft-content .hyper-scene','.craft-section',{y:mobile?35:70,scale:.955,opacity:.5},{y:0,scale:1,opacity:1});
    gsap.utils.toArray<HTMLElement>('.craft-steps>div').forEach((step,index)=>reveal(step,step,{x:mobile?30:55,opacity:.15},{x:0,opacity:1,scrollTrigger:{trigger:step,start:`top ${92-index*2}%`,end:'center 66%',scrub}}));

    gsap.fromTo('.chapter-section .hyper-scene',{scale:1.075,clipPath:mobile?'inset(4% 0 8%)':'inset(7% 5%)'},{scale:1,clipPath:'inset(0% 0%)',ease:'none',scrollTrigger:{trigger:'.chapter-section',start:'top 94%',end:'center 46%',scrub}});
    reveal('.chapter-caption','.chapter-section',{y:22,opacity:.25},{y:0,opacity:1});

    reveal('.lottery-copy h2','.lottery-intro',{y:mobile?45:72,clipPath:'inset(0 0 100% 0)'},{y:0,clipPath:'inset(0 0 0% 0)'});
    reveal('.lottery-copy>p','.lottery-intro',{y:25,opacity:.2},{y:0,opacity:1});
    gsap.utils.toArray<HTMLElement>('.lottery-numbers a').forEach((item,index)=>gsap.fromTo(item,{y:mobile?20:32,opacity:0,scale:.96},{y:0,opacity:1,scale:1,ease:'none',scrollTrigger:{trigger:item,start:`top ${96-(index%3)*2}%`,end:'center 72%',scrub:mobile?.22:.35}}));

    reveal('.blueprint-section>div','.blueprint-section',{x:mobile?28:65,opacity:.25},{x:0,opacity:1});
    gsap.fromTo('.blueprint-section .hyper-scene',{y:mobile?30:75,scale:.945,rotate:.35},{y:0,scale:1,rotate:0,ease:'none',scrollTrigger:{trigger:'.blueprint-section',start:'top 93%',end:'center 52%',scrub}});

    reveal('.contact-copy','.contact-section',{y:mobile?34:65,opacity:.25},{y:0,opacity:1});
    gsap.utils.toArray<HTMLElement>('.contact-form label,.contact-form .form-note,.contact-form button').forEach((item,index)=>gsap.fromTo(item,{y:18,opacity:0},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.contact-form',start:`top ${94-index*1.5}%`,end:'center 58%',scrub:mobile?.2:.32}}));

    gsap.utils.toArray<HTMLElement>('[data-scroll-section]').forEach(section=>ScrollTrigger.create({trigger:section,start:'top bottom',end:'bottom top',onUpdate:self=>{section.dataset.scrollProgress=self.progress.toFixed(3)}}));
   },main);
   return()=>scope.revert();
  });
  return()=>media.revert();
 },[reduced]);
 return null;
}
