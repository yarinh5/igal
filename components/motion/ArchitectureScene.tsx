'use client';
import {useEffect,useRef} from 'react';
import {architecturePose} from '@/lib/hero-motion';

export type ArchitectureSeek=(progress:number)=>void;
type Props={enabled:boolean;mobile:boolean;onReady:(seek:ArchitectureSeek|null)=>void};

export default function ArchitectureScene({enabled,mobile,onReady}:Props){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!enabled||!root.current)return;
  const host:HTMLDivElement=root.current;
  let disposed=false;
  let release=()=>{};
  import('three').then(THREE=>{
   if(disposed)return;
   let renderer:import('three').WebGLRenderer;
   try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}
   catch{host.dataset.fallback='true';return;}
   const pixelRatio=Math.min(devicePixelRatio,mobile?1.25:1.6);
   renderer.setPixelRatio(pixelRatio);
   renderer.setClearColor(0x181c1b,0);
   renderer.outputColorSpace=THREE.SRGBColorSpace;
   renderer.toneMapping=THREE.ACESFilmicToneMapping;
   renderer.toneMappingExposure=1.15;
   host.appendChild(renderer.domElement);

   const scene=new THREE.Scene();
   const camera=new THREE.PerspectiveCamera(mobile?37:34,1,.1,80);
   const model=new THREE.Group();
   scene.add(model);
   scene.add(new THREE.HemisphereLight(0xdce5e6,0x4c4338,2));
   const key=new THREE.DirectionalLight(0xffe6bf,3.3);
   key.position.set(-5,12,8);scene.add(key);
   const fill=new THREE.DirectionalLight(0xdbe9f1,1.8);
   fill.position.set(7,6,-5);scene.add(fill);

   const materials={
    stone:new THREE.MeshStandardMaterial({color:0xe0d6c4,roughness:.74,metalness:.06}),
    trim:new THREE.MeshStandardMaterial({color:0x353b38,roughness:.42,metalness:.5}),
    glass:new THREE.MeshStandardMaterial({color:0x6d8582,roughness:.23,metalness:.72}),
    bronze:new THREE.MeshStandardMaterial({color:0x9d7960,roughness:.4,metalness:.65}),
    window:new THREE.MeshStandardMaterial({color:0xd0b58c,roughness:.48,emissive:0xd6a66c,emissiveIntensity:.28}),
    leaf:new THREE.MeshStandardMaterial({color:0x394c3e,roughness:1}),
   };
   type Kind=keyof typeof materials;
   type Part={x:number;y:number;z:number;w:number;h:number;d:number;level:number;wing:number;cx:number;cz:number};
   const parts:Record<Kind,Part[]>={stone:[],trim:[],glass:[],bronze:[],window:[],leaf:[]};
   const wings=[{x:-1.95,z:-.4,w:3.1,d:3.2,n:7},{x:1.85,z:.65,w:2.8,d:3.65,n:5}];
   const add=(kind:Kind,w:number,h:number,d:number,x:number,y:number,z:number,level=-1,wing=-1)=>{
    const origin=wings[wing];
    parts[kind].push({w,h,d,x:x+(origin?.x||0),y:y+(level<0?0:level*.76),z:z+(origin?.z||0),level,wing,cx:origin?.x||0,cz:origin?.z||0});
   };
   // Stone podium, courtyard path and fine bronze perimeter.
   add('stone',9,.2,7,0,-.3,0);
   add('trim',8.5,.065,6.5,0,-.16,0);
   add('stone',1.3,.08,6.5,0,-.1,0);
   for(const x of [-4.3,4.3])add('bronze',.025,.02,6.6,x,-.04,0);
   for(const z of [-3.3,3.3])add('bronze',8.6,.02,.025,0,-.04,z);

   wings.forEach((wing,index)=>{
    for(let level=0;level<wing.n;level++){
     const {w,d}=wing;
     add('stone',w+.48,.12,d+.62,0,0,0,level,index);
     add('glass',w-.3,.58,d-.22,0,.36,-.08,level,index);
     // Solid side walls, recessed glazing and alternating warm windows.
     for(const side of [-1,1]){
      add('stone',.16,.64,d-.25,side*(w/2-.08),.37,-.1,level,index);
      for(let bay=0;bay<3;bay++)add('trim',.035,.59,.06,-w/2+.38+bay*(w-.76)/2,.36,side*d/2,level,index);
     }
     for(let bay=0;bay<3;bay++){
      const x=-w/2+.5+bay*(w-1)/2;
      if((bay+level+index)%3!==1)add('window',.52,.43,.025,x,.35,d/2-.12,level,index);
      add('trim',.035,.58,.05,x+.3,.35,d/2-.09,level,index);
     }
     // Deep balcony edge, thin handrail and vertical fins.
     add('stone',w+.5,.07,.14,0,.12,d/2+.28,level,index);
     add('trim',w+.42,.035,.035,0,.48,d/2+.28,level,index);
     for(let post=0;post<6;post++)add('bronze',.022,.36,.022,-w/2+.05+post*(w-.1)/5,.3,d/2+.28,level,index);
     for(const side of [-1,1]){
      add('trim',.035,.035,.7,side*(w/2+.18),.48,d/2-.05,level,index);
      add('stone',.1,.64,.58,side*(w/2+.15),.38,-d/2+.15,level,index);
     }
     // Planters belong to the same moving floor; no independent drifting objects.
     if(level>0&&level%2===0){add('stone',.58,.18,.3,-w/2+.4,.2,d/2+.06,level,index);add('leaf',.52,.1,.26,-w/2+.4,.33,d/2+.06,level,index);}
    }
    add('stone',wing.w+.5,.16,wing.d+.6,0,.08,0,wing.n,index);
    add('trim',wing.w-.25,.06,wing.d-.2,0,.19,0,wing.n,index);
    for(const side of [-1,1])add('stone',.12,.3,wing.d+.5,side*(wing.w/2+.17),.26,0,wing.n,index);
    add('stone',wing.w+.45,.3,.12,0,.26,-wing.d/2-.2,wing.n,index);
   });
   // A small grove on the podium, composed of shared box geometry.
   for(const [x,z] of [[-3.65,2.6],[-2.8,2.6],[3.55,-2.6],[2.75,-2.6]]){
    add('bronze',.07,.8,.07,x,.25,z);
    add('leaf',.5,.85,.5,x,.85,z);
    add('stone',.65,.14,.65,x,-.04,z);
   }
   const box=new THREE.BoxGeometry(1,1,1);
   const batches=(Object.keys(parts) as Kind[]).map(kind=>{
    const mesh=new THREE.InstancedMesh(box,materials[kind],parts[kind].length);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled=false;
    model.add(mesh);
    return {mesh,parts:parts[kind]};
   });
   const dummy=new THREE.Object3D();
   // Static architectural grid and a soft contact shadow require no shadow pass.
   const grid=new THREE.GridHelper(22,44,0xb29670,0x6b736a);
   grid.position.y=-.43;grid.material.transparent=true;grid.material.opacity=.14;scene.add(grid);
   const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;
   const ctx=shadowCanvas.getContext('2d')!;
   const gradient=ctx.createRadialGradient(64,64,8,64,64,64);
   gradient.addColorStop(0,'rgba(0,0,0,.65)');gradient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
   const shadowTexture=new THREE.CanvasTexture(shadowCanvas);
   const shadowGeometry=new THREE.PlaneGeometry(15,12);
   const shadowMaterial=new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false});
   const shadow=new THREE.Mesh(shadowGeometry,shadowMaterial);shadow.rotation.x=-Math.PI/2;shadow.position.y=-.39;scene.add(shadow);

   let progress=0,frame=0,visible=true,contextLost=false,draws=0;
   function requestDraw(){if(!disposed&&!frame&&visible&&!document.hidden&&!contextLost)frame=requestAnimationFrame(draw);}
   function draw(){
    frame=0;if(disposed||!visible||document.hidden||contextLost)return;
    const pose=architecturePose(progress,mobile);
    for(const batch of batches){
     batch.parts.forEach((part,i)=>{
      const moving=part.level>=0;
      const twist=moving?pose.explosion*part.level*.012*(part.wing===0?1:-1):0;
      const localX=part.x-part.cx,localZ=part.z-part.cz;
      dummy.position.set(
       part.cx+Math.cos(twist)*localX-Math.sin(twist)*localZ+(moving?(part.wing===0?-1:1)*pose.explosion*.52:0),
       part.y+(moving?pose.explosion*(part.level*.27+.18):0),
       part.cz+Math.sin(twist)*localX+Math.cos(twist)*localZ,
      );
      dummy.rotation.set(0,twist,0);dummy.scale.set(part.w,part.h,part.d);dummy.updateMatrix();batch.mesh.setMatrixAt(i,dummy.matrix);
     });
     batch.mesh.instanceMatrix.needsUpdate=true;
    }
    model.rotation.y=pose.rotation;
    materials.window.emissiveIntensity=pose.windowGlow;
    grid.material.opacity=.045+pose.blueprintOpacity*.3;
    camera.position.set(Math.sin(pose.angle)*pose.distance,pose.elevation,Math.cos(pose.angle)*pose.distance);
    camera.lookAt(0,pose.targetY,0);
    renderer.render(scene,camera);
    host.dataset.ready='true';host.dataset.renders=String(++draws);
    host.dataset.pose=progress.toFixed(4);host.dataset.drawCalls=String(renderer.info.render.calls);
   }
   const seek:ArchitectureSeek=value=>{if(Math.abs(value-progress)<.00008&&draws)return;progress=value;requestDraw()};
   function resize(){const rect=host.getBoundingClientRect();if(rect.width<1||rect.height<1)return;renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();requestDraw()}
   const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
   const visibilityObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)requestDraw();else if(frame){cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'});visibilityObserver.observe(host);
   const wake=()=>{if(!document.hidden)requestDraw();else if(frame){cancelAnimationFrame(frame);frame=0;}};
   const lost=(event:Event)=>{event.preventDefault();contextLost=true;delete host.dataset.ready;host.dataset.fallback='true';};
   const restored=()=>{contextLost=false;delete host.dataset.fallback;resize()};
   document.addEventListener('visibilitychange',wake);
   renderer.domElement.addEventListener('webglcontextlost',lost);
   renderer.domElement.addEventListener('webglcontextrestored',restored);
   resize();onReady(seek);
   release=()=>{
    onReady(null);cancelAnimationFrame(frame);resizeObserver.disconnect();visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange',wake);
    renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.domElement.removeEventListener('webglcontextrestored',restored);
    box.dispose();batches.forEach(({mesh})=>mesh.dispose());Object.values(materials).forEach(m=>m.dispose());
    grid.geometry.dispose();grid.material.dispose();shadowTexture.dispose();shadowGeometry.dispose();shadowMaterial.dispose();
    renderer.dispose();renderer.domElement.remove();delete host.dataset.ready;
   };
  }).catch(()=>{if(!disposed)host.dataset.fallback='true'});
  return()=>{disposed=true;release()};
 },[enabled,mobile,onReady]);
 return <div ref={root} className="architecture-scene" aria-hidden="true"><svg className="architecture-fallback" viewBox="0 0 700 640" fill="none"><g stroke="currentColor" strokeWidth="1.2"><path d="m90 470 230-100 270 100-240 115Z"/><path d="M160 430V190l130-50 130 45v245l-130 58Z"/><path d="M290 140v348m-130-298 130 48 130-53"/>{Array.from({length:8},(_,i)=><path key={i} d={`M160 ${210+i*28}l130 48 130-53`}/>)}<path d="m420 430 100-42V245l-100-35m-110 54 110 40 100-59"/></g></svg></div>;
}
