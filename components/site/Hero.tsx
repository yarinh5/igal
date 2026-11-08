'use client';
import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Icon} from './Icons';
import {useMotion} from '../motion/MotionProvider';
import ArchitectureScene from '../motion/ArchitectureScene';

export function Hero(){const root=useRef<HTMLElement>(null);const {reduced}=useMotion();
 useEffect(()=>{const el=root.current;if(!el)return;const context=gsap.context(()=>{const mm=gsap.matchMedia();
  if(!reduced){gsap.fromTo('.hero-entry',{y:44,opacity:0},{y:0,opacity:1,duration:1.25,stagger:.12,ease:'power3.out',delay:.12});gsap.fromTo('.hero-photo img',{scale:1.12},{scale:1,duration:2,ease:'power2.out'});}
  mm.add('(min-width: 900px) and (min-height: 650px)',()=>{if(reduced)return;const stage=el.querySelector<HTMLElement>('.hero-stage')!;const progress={value:0};const timeline=gsap.timeline({scrollTrigger:{trigger:stage,start:'top top+=88',end:()=>'+='+Math.round(innerHeight*1.15),pin:stage,scrub:1,invalidateOnRefresh:true,onUpdate:self=>stage.setAttribute('data-progress',String(self.progress))}});
    timeline.to('.hero-copy',{y:-70,autoAlpha:0,duration:.3},0).to('.hero-photo',{clipPath:'inset(7% 55% 8% 4%)',opacity:.22,duration:.65,ease:'power2.inOut'},.1).fromTo('.hero-model',{opacity:0,x:-90},{opacity:1,x:0,duration:.6,immediateRender:false},.3).fromTo('.hero-next-copy',{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.45,immediateRender:false},.48).to('.hero-topline,.hero-skip,.hero-progress',{color:'#25241f',duration:.4},.32).to(progress,{value:1,duration:1},0).to('.hero-progress-line',{scaleX:1,duration:1,ease:'none'},0);
  });return()=>mm.revert();
 },el);document.fonts.ready.then(()=>ScrollTrigger.refresh());return()=>context.revert();},[reduced]);
 return <section className="hero-story" ref={root} aria-label="קבוצת יגאל בוחבוט"><div className="hero-stage" data-hero-stage data-progress="0">
  <div className="hero-photo"><img src="/images/eyal-hero.webp" alt="הדמיית בנייני מגורים בפרויקט אייל SEVEN7 בבית שאן" fetchPriority="high"/><div className="hero-shade"/></div>
  <div className="hero-topline hero-entry"><span>ייזום והשקעות · מאז 2006</span><span dir="ltr">A PLACE TO CALL HOME</span></div>
  <div className="hero-copy"><p className="eyebrow hero-entry">קבוצת יגאל בוחבוט</p><h1><span className="hero-entry">איכות.</span><span className="hero-entry">עיצוב. <em>מיקום.</em></span></h1><div className="hero-bottom hero-entry"><p>מחשבה על הפרטים.<br/>מחויבות לאנשים שחיים בהם.</p><a href="#projects" className="button button-light"><span>גלו את הפרויקטים</span><Icon name="arrow"/></a></div></div>
  <div className="hero-model"><ArchitectureScene/><span className="model-caption">המחשה אדריכלית · מהתכנון אל המרחב</span></div>
  <div className="hero-next-copy"><span className="eyebrow">01 / הדרך שלנו</span><h2>בכל שלב.<br/><em>בכל פרט.</em></h2><p>מהייזום והתכנון, דרך הביצוע<br/>ועד לרגע קבלת המפתח.</p><a href="/about" className="text-link">להכיר את הקבוצה <Icon name="arrow"/></a></div>
  <a href="#projects" className="hero-skip">דלגו לפרויקטים <Icon name="arrow"/></a><div className="hero-progress"><span>גללו לגלות</span><div><i className="hero-progress-line"/></div><span dir="ltr">01 — 03</span></div>
 </div></section>
}
