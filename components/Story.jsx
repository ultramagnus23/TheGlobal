'use client';
import { useEffect, useRef } from 'react';
import { buildVilla, makeRenderer, lights, whenVisible, isSmall, prefersReduced } from './villa';
import * as THREE from 'three';

export default function Story() {
  const canvasRef = useRef(null);
  const holderRef = useRef(null);
  useEffect(() => {
    const small = isSmall();
    const rmv = prefersReduced();
    let cleanup = () => {};

  const canvas=canvasRef.current; if(!canvas) return;
  const holder=holderRef.current, wrap=canvas.parentElement, renderer=makeRenderer(canvas);
  const scene=new THREE.Scene(); scene.fog=new THREE.Fog(0x16212C,24,60); lights(scene);
  const camera=new THREE.PerspectiveCamera(34,1,.1,140);
  const v=buildVilla(scene);
  v.pipes.traverse(o=>{ if(o.material){o.material.transparent=true; o.material.opacity=0;} });
  v.tiles.traverse(o=>{ if(o.material){o.material.transparent=true; o.material.opacity=0;} });
  const skinMats=[]; v.skin.traverse(o=>{ if(o.material){o.material.transparent=true; skinMats.push(o.material);} });
  const KEY=[
    {p:[13,7.4,17], t:[0,2.4,0]},
    {p:[6.2,4.4,7.4], t:[-0.4,2.6,-1.4]},
    {p:[2.6,2.2,3.6], t:[-0.8,1.2,-1.8]},
    {p:[2.2,1.25,2.4], t:[-0.6,0.55,-0.4]}
  ];
  const head=document.getElementById('story-head'), chA=document.getElementById('ch-astral'), chS=document.getElementById('ch-somany');
  const bars=document.querySelectorAll('.storybar i');
  function size(){ const w=wrap.clientWidth,h=wrap.clientHeight; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); }
  size(); addEventListener('resize',size);
  const sm=t=>t*t*(3-2*t);
  const lerp=(a,b,t)=>a+(b-a)*t;
  let cur=0, last=0; const stp=small?33:0;
  function frame(now){
    if(now-last<stp) return; last=now;
    const rect=holder.getBoundingClientRect();
    const total=holder.offsetHeight-innerHeight;
    let p=total>0 ? Math.min(Math.max(-rect.top/total,0),1) : 0;
    cur+=(p-cur)*(rmv?1:0.11);
    const seg=cur*3, i=Math.min(Math.floor(seg),2), f=sm(Math.min(seg-i,1));
    const a=KEY[i], b=KEY[i+1];
    camera.position.set(lerp(a.p[0],b.p[0],f), lerp(a.p[1],b.p[1],f), lerp(a.p[2],b.p[2],f));
    camera.lookAt(lerp(a.t[0],b.t[0],f), lerp(a.t[1],b.t[1],f), lerp(a.t[2],b.t[2],f));
    const pipeOp=Math.min(Math.max((cur-0.18)/0.22,0),1);
    const tileOp=Math.min(Math.max((cur-0.60)/0.22,0),1);
    const skinOp=1-Math.min(Math.max((cur-0.16)/0.2,0),1)*0.92;
    v.pipes.traverse(o=>{ if(o.material) o.material.opacity=pipeOp; });
    v.tiles.traverse(o=>{ if(o.material) o.material.opacity=tileOp; });
    skinMats.forEach(m=>m.opacity=skinOp*(m.color.getHex()===0x24506B?.55:1));
    v.root.rotation.y=-0.16+cur*0.42;
    head.style.opacity=String(1-Math.min(cur/0.16,1));
    head.style.transform='translateY('+(-cur*40)+'px)';
    chA.classList.toggle('on', cur>0.22 && cur<0.6);
    chS.classList.toggle('on', cur>=0.66);
    bars[0].classList.toggle('on',cur<0.22); bars[1].classList.toggle('on',cur>=0.22&&cur<0.66); bars[2].classList.toggle('on',cur>=0.66);
    renderer.render(scene,camera);
  }
  cleanup = whenVisible(holder, frame);

    return () => cleanup();
  }, []);

  return (
    <div className="story" id="work" ref={holderRef}>
      <div className="story-stick">
        <canvas ref={canvasRef} />
        <div className="story-head" id="story-head">
          <span className="eyebrow">From foundation to finish</span>
          <h2>Every remarkable building begins with decisions nobody sees.</h2>
        </div>
        <div className="storybar"><i className="on" /><i /><i /></div>
        <div className="chapter astral" id="ch-astral">
          <span className="tag">Powered by Astral</span>
          <h3>Water learns its route.</h3>
          <p>CPVC, PVC and SWR threaded through the walls before a single tile is cut. The part nobody sees, and the part that can least afford to fail ten years in.</p>
        </div>
        <div className="chapter somany" id="ch-somany">
          <span className="tag">Finished with Somany</span>
          <h3>And then it becomes a home.</h3>
          <p>Tiles, sanitaryware and bath fittings. The surfaces that decide how a room sounds underfoot and how it feels at seven in the morning.</p>
        </div>
      </div>
    </div>
  );
}
