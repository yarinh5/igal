'use client';
import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {projects} from '@/lib/projects';
import {ProjectCard} from './ProjectCard';
import {Icon} from './Icons';
import {useMotion} from '../motion/MotionProvider';
export function ProjectRail(){const root=useRef<HTMLElement>(null);const {reduced}=useMotion();
 useEffect(()=>{if(reduced||!root.current)return;const ctx=gsap.context(()=>{const mm=gsap.matchMedia();mm.add('(min-width:1100px) and (min-height:750px)',()=>{const track=root.current!.querySelector<HTMLElement>('.project-rail')!;const frame=root.current!.querySelector<HTMLElement>('.project-rail-frame')!;const travel=()=>Math.max(0,track.scrollWidth-frame.clientWidth);gsap.to(track,{x:travel,ease:'none',scrollTrigger:{trigger:root.current!.querySelector('.project-pinned'),start:'top top+=90',end:()=>'+='+(travel()+150),pin:true,scrub:.8,invalidateOnRefresh:true}});});return()=>mm.revert()},root);return()=>ctx.revert()},[reduced]);
 return <section id="projects" className="projects-section section" ref={root}><div className="project-pinned"><div className="section-heading"><div><span className="eyebrow">02 / הפרויקטים שלנו</span><h2 data-reveal>מחשבה על המקום.<br/><em>מחשבה על החיים.</em></h2></div><a href="/projects" className="text-link">לכל הפרויקטים <Icon name="arrow"/></a></div><div className="project-rail-frame"><div className="project-rail">{projects.slice(0,3).map((p,i)=><ProjectCard key={p.slug} project={p} index={i}/>)}</div></div><div className="rail-bottom"><span>מגורים, קהילה וסביבה.</span><span dir="ltr">SELECTED PROJECTS / 01—03</span></div></div></section>
}
