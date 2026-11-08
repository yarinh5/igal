'use client';
import {useEffect,useRef,useState} from 'react';
import {useMotion} from './MotionProvider';

export default function ArchitectureScene(){
 const root=useRef<HTMLDivElement>(null);const {reduced}=useMotion();const [desktop,setDesktop]=useState(false);
 useEffect(()=>{const media=matchMedia('(min-width:900px) and (min-height:650px)');const update=()=>setDesktop(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 useEffect(()=>{if(reduced||!desktop||!root.current)return;let disposed=false;let cleanup:()=>void=()=>{};import('three').then(THREE=>{
  if(disposed||!root.current)return;const host=root.current;let renderer:import('three').WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'})}catch{host.dataset.fallback='true';return}
  host.appendChild(renderer.domElement);renderer.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(max-width:700px)').matches?1.25:1.75));renderer.setClearColor(0xeee9df,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.45;
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(11,8,13);const model=new THREE.Group();scene.add(model);model.rotation.y=-.25;
  scene.add(new THREE.HemisphereLight(0xffffff,0xa39b8d,3));const light=new THREE.DirectionalLight(0xffffff,4);light.position.set(5,10,8);scene.add(light);const rim=new THREE.DirectionalLight(0xd7bda1,2);rim.position.set(-8,5,-4);scene.add(rim);
  const stone=new THREE.MeshStandardMaterial({color:0xe0d9ca,roughness:.76,metalness:.03});const dark=new THREE.MeshStandardMaterial({color:0x343c38,roughness:.28,metalness:.3});const glass=new THREE.MeshStandardMaterial({color:0x82908a,roughness:.15,metalness:.68});const red=new THREE.MeshStandardMaterial({color:0x843b35,roughness:.58});
  const geometries:import('three').BufferGeometry[]=[];const floors:{mesh:import('three').Group;base:number;wing:number}[]=[];
  function box(w:number,h:number,d:number,x:number,y:number,z:number,material:import('three').Material,parent:import('three').Object3D=model){const geometry=new THREE.BoxGeometry(w,h,d);geometries.push(geometry);const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);parent.add(mesh);return mesh}
  box(8,.2,6,0,-.4,0,stone);box(7.5,.1,5.5,0,-.25,0,dark);
  const wings=[{x:-2.1,z:0,w:2.2,d:3.6,n:7},{x:.7,z:-1,w:2.8,d:2,n:5},{x:2.45,z:.7,w:1.2,d:3.8,n:4}];
  wings.forEach((w,wing)=>{for(let f=0;f<w.n;f++){const floor=new THREE.Group();floor.position.set(w.x,f*.64,w.z);model.add(floor);floors.push({mesh:floor,base:f*.64,wing});box(w.w+.22,.12,w.d+.22,0,0,0,stone,floor);box(w.w,.48,w.d,0,.3,0,glass,floor);for(let s=-1;s<=1;s++){box(.085,.55,w.d+.07,s*w.w/2,.31,0,stone,floor)}box(w.w+.1,.16,.06,0,.52,w.d/2+.04,stone,floor);box(.14,.54,w.d+.12,w.w/2,.29,0,wing===0?red:stone,floor)}box(w.w+.3,.15,w.d+.3,w.x,w.n*.64,w.z,stone)});
  for(let i=0;i<5;i++){box(.055,3.8,.055,-3.3+i*.3,1.7,2.3,red)}
  const ground=new THREE.Mesh(new THREE.CircleGeometry(7,64),new THREE.MeshBasicMaterial({color:0xbcb4a4,transparent:true,opacity:.12}));ground.rotation.x=-Math.PI/2;ground.position.y=-.52;scene.add(ground);geometries.push(ground.geometry);
  let frame=0;let visible=true;let lastProgress=-1;const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!frame)draw()},{rootMargin:'200px'});observer.observe(host);
  function resize(){const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/Math.max(height,1);camera.updateProjectionMatrix();lastProgress=-1}
  const ro=new ResizeObserver(resize);ro.observe(host);resize();
  function draw(){if(disposed)return;frame=0;if(!visible||document.hidden)return;const progress=Number(host.closest('[data-hero-stage]')?.getAttribute('data-progress')||0);if(progress===lastProgress){frame=requestAnimationFrame(draw);return}lastProgress=progress;model.rotation.y=-.35+progress*.48;const spread=Math.sin(progress*Math.PI)*.16;floors.forEach(f=>f.mesh.position.y=f.base*(1+spread));camera.position.set(11-progress*2,8-progress*1.7,13-progress*2);camera.lookAt(0,1.7,0);renderer.render(scene,camera);frame=requestAnimationFrame(draw)}
  const wake=()=>{if(!document.hidden&&!frame)draw()};document.addEventListener('visibilitychange',wake);draw();host.dataset.ready='true';
  cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();ro.disconnect();document.removeEventListener('visibilitychange',wake);geometries.forEach(g=>g.dispose());[stone,dark,glass,red,ground.material].forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();delete host.dataset.ready;};
 }).catch(()=>{if(root.current)root.current.dataset.fallback='true'});return()=>{disposed=true;cleanup()};},[reduced,desktop]);
 return <div ref={root} className="architecture-scene" aria-hidden="true"><svg className="architecture-fallback" viewBox="0 0 600 500" fill="none"><g stroke="currentColor" strokeWidth="1"><path d="m90 380 200-90 210 80-205 105Z"/><path d="M150 345V150l110-45 105 40v194l-105 47Z"/><path d="M260 105v280m-110-235 110 40 105-45"/>{Array.from({length:7},(_,i)=><path key={i} d={`M150 ${175+i*24}l110 40 105-45`}/>)}</g></svg></div>
}
