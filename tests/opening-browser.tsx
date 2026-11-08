import React from 'react';
import {createRoot} from 'react-dom/client';
import {Opening} from '../components/site/Opening';
import '../app/opening.css';
const nativePlay=HTMLMediaElement.prototype.play;
const root=createRoot(document.getElementById('root')!);
function run(mode:string){
 HTMLMediaElement.prototype.play=mode==='blocked'?()=>Promise.reject(new DOMException('Autoplay blocked','NotAllowedError')):mode==='stalled'?function(this:HTMLMediaElement){this.autoplay=false;this.pause();return new Promise(()=>{})}:nativePlay;
 localStorage.setItem('yigal-motion',mode==='reduced'?'reduce':'full');
 root.render(<Opening key={Date.now()}><main id="main"><h1>Opening test complete</h1><button onClick={()=>location.reload()}>Reset</button></main></Opening>);
}
const report=document.createElement('pre');document.body.appendChild(report);
function schedule(mode:string){
 report.textContent='Scheduled '+mode;
 setTimeout(()=>{
  run(mode);const began=performance.now();
  const capture=setInterval(()=>{
   const opening=document.querySelector('.brand-opening');
   const p=document.querySelector('hyperframes-player') as any;
   const doc=p?.iframeElement?.contentDocument;
   report.textContent+='\n'+JSON.stringify({ms:Math.round(performance.now()-began),active:!!opening,playing:opening?.getAttribute('data-playing'),video:!!document.querySelector('video'),composition:!!p,time:p?.currentTime,name:doc?.querySelector('#brand-name')?.textContent,nameOpacity:doc?.querySelector('#brand-bohbot')?.style.opacity,fragment:doc?.querySelector('.logo-fragment')?.style.transform});
   if(!opening||performance.now()-began>9000)clearInterval(capture);
  },400);
 },2000);
}
root.render(<main><h1>Opening browser checks</h1>{['blocked','stalled','reduced','normal'].map(mode=><button key={mode} onClick={()=>schedule(mode)}>{mode}</button>)}</main>);
