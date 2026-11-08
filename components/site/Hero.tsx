'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Icon} from './Icons';
import {useMotion} from '../motion/MotionProvider';
import ArchitectureScene,{type ArchitectureSeek} from '../motion/ArchitectureScene';
import {heroMode,type HeroMode} from '@/lib/hero-motion';

export function Hero(){
 const root=useRef<HTMLElement>(null);
 const {reduced}=useMotion();
 const [mode,setMode]=useState<HeroMode>('static');
 const sceneSeek=useRef<ArchitectureSeek|null>(null);
 const progress=useRef(0);
 const registerScene=useCallback((seek:ArchitectureSeek|null)=>{sceneSeek.current=seek;seek?.(progress.current)},[]);
 useEffect(()=>{
  const update=()=>setMode(heroMode(innerWidth,innerHeight,reduced));
  update();window.addEventListener('resize',update);
  return()=>window.removeEventListener('resize',update);
 },[reduced]);
 useEffect(()=>{
  const el=root.current;if(!el)return;
  let cancelled=false;
  const context=gsap.context(()=>{
   if(!reduced){
    gsap.fromTo('.hero-entry',{y:32,opacity:0},{y:0,opacity:1,duration:1.05,stagger:.075,ease:'power3.out'});
    gsap.fromTo('.hero-photo img',{scale:1.08},{scale:1,duration:1.8,ease:'power2.out'});
   }
   if(mode==='static')return;
   const stage=el.querySelector<HTMLElement>('.hero-stage')!;
   const portrait=mode==='portrait';
   const driver={value:0};
   const render=()=>{
    progress.current=driver.value;sceneSeek.current?.(driver.value);
    stage.dataset.progress=driver.value.toFixed(4);
    stage.dataset.chapter=driver.value<.24?'1':driver.value<.66?'2':'3';
   };
   const timeline=gsap.timeline({
    onUpdate:render,
    scrollTrigger:{trigger:stage,refreshPriority:10,start:()=>`top top+=${document.querySelector('header')?.getBoundingClientRect().height||72}`,end:()=>'+='+Math.round(stage.clientHeight*(portrait?1.5:2.05)),pin:stage,scrub:portrait?.45:.75,anticipatePin:1,invalidateOnRefresh:true},
   });
   timeline.to(driver,{value:1,duration:1,ease:'none'},0)
    .to('.hero-copy',{y:portrait?-35:-65,autoAlpha:0,duration:.17,ease:'power1.in'},.015)
    .to('.hero-photo',{clipPath:portrait?'inset(4% 4% 9% 4%)':'inset(7% 6% 10% 6%)',yPercent:-8,scale:1.06,opacity:0,duration:.32,ease:'power2.inOut'},.025)
    .fromTo('.hero-drafting',{opacity:0,scale:.92},{opacity:.65,scale:1,duration:.16,immediateRender:false},.12)
    .to('.hero-drafting',{opacity:0,duration:.24},.43)
    .fromTo('.hero-model',{autoAlpha:0,scale:.86},{autoAlpha:1,scale:1,duration:.29,ease:'power2.out',immediateRender:false},.14)
    .fromTo('.hero-story-copy--plan',{autoAlpha:0,y:35},{autoAlpha:1,y:0,duration:.13,immediateRender:false},.23)
    .to('.hero-story-copy--plan',{autoAlpha:0,y:-25,duration:.1},.55)
    .fromTo('.hero-story-copy--home',{autoAlpha:0,y:35},{autoAlpha:1,y:0,duration:.14,immediateRender:false},.65)
    .fromTo('.hero-model-caption',{autoAlpha:0},{autoAlpha:1,duration:.15,immediateRender:false},.4)
    .fromTo('.hero-progress-line',{scaleX:0},{scaleX:1,duration:1,ease:'none'},0)
    .to('.hero-model',{opacity:.75,scale:.98,duration:.1},.9);
   render();
  },el);
  document.fonts.ready.then(()=>{if(!cancelled)ScrollTrigger.refresh()});
  return()=>{cancelled=true;context.revert();progress.current=0;sceneSeek.current?.(0)};
 },[reduced,mode]);

 return <section className={`hero-story hero-story--${mode}`} ref={root} aria-label="קבוצת יגאל בוחבוט" data-hero-mode={mode}>
  <div className="hero-stage" data-hero-stage data-progress="0" data-chapter="1">
   <div className="hero-studio-light" aria-hidden="true"/>
   <div className="hero-photo"><img src="/images/eyal-hero.webp" alt="הדמיית בנייני מגורים בפרויקט אייל SEVEN7 בבית שאן" fetchPriority="high"/><div className="hero-shade"/></div>
   <div className="hero-topline hero-entry"><span>ייזום והשקעות · מאז 2006</span><span dir="ltr">A PLACE TO CALL HOME</span></div>
   <div className="hero-copy">
    <p className="eyebrow hero-entry">קבוצת יגאל בוחבוט</p>
    <h1><span className="hero-entry">איכות.</span><span className="hero-entry">עיצוב. <em>מיקום.</em></span></h1>
    <div className="hero-bottom hero-entry"><p>מחשבה על הפרטים.<br/>מחויבות לאנשים שחיים בהם.</p><a href="#projects" className="button button-light"><span>גלו את הפרויקטים</span><Icon name="arrow"/></a></div>
   </div>
   <svg className="hero-drafting" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth=".65"><path d="M0 450h1600M800 0v900M0 0l1600 900M0 900 1600 0"/><rect x="330" y="190" width="940" height="520"/><rect x="520" y="280" width="560" height="340"/><circle cx="800" cy="450" r="270"/><path d="M305 190h50m-25-25v50m915 495h50m-25-25v50"/></g></svg>
   <div className="hero-model"><ArchitectureScene enabled={mode!=='static'&&!reduced} mobile={mode==='portrait'} onReady={registerScene}/></div>
   <div className="hero-story-copy hero-story-copy--plan"><span className="eyebrow">01 / המחשבה</span><h2>מהקו<br/><em>הראשון.</em></h2><p>דיוק בתכנון.<br/>מחשבה על כל פרט.</p></div>
   <div className="hero-story-copy hero-story-copy--home"><span className="eyebrow">02 / המרחב</span><h2>עד הבית<br/><em>שלכם.</em></h2><p>מהייזום והתכנון, דרך הביצוע<br/>ועד לרגע קבלת המפתח.</p><a href="#about" className="text-link">הדרך שלנו <Icon name="arrow"/></a></div>
   <span className="hero-model-caption">המחשה אדריכלית · מהתכנון אל המרחב</span>
   <a href="#projects" className="hero-skip">דלגו לפרויקטים <Icon name="arrow"/></a>
   <div className="hero-progress"><span>גללו לגלות</span><div><i className="hero-progress-line"/></div><span className="hero-chapters" aria-hidden="true"><b data-chapter-number="1">01</b><b data-chapter-number="2">02</b><b data-chapter-number="3">03</b></span></div>
  </div>
 </section>;
}
