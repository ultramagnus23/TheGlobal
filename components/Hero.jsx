'use client';
import { useEffect, useRef } from 'react';
import { buildVilla, makeRenderer, lights, whenVisible, isSmall, prefersReduced } from './villa';
import * as THREE from 'three';

export default function Hero() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const small = isSmall();
    const rmv = prefersReduced();
    let cleanup = () => {};

  const canvas=canvasRef.current; if(!canvas) return;
  const wrap=canvas.parentElement, renderer=makeRenderer(canvas);
  const scene=new THREE.Scene(); scene.fog=new THREE.Fog(0x0F1720,26,58); lights(scene);
  const camera=new THREE.PerspectiveCamera(31,1,.1,140);
  const v=buildVilla(scene); v.pipes.visible=false;
  v.root.traverse(o=>{ if(o.material){o.material.transparent=true; o.material.opacity=0;} });
  const items=[]; v.root.traverse(o=>{ if(o.isMesh) items.push({o, op:o.material.opacity, mat:o.material, target:(o.material.name==='glass'?.55:1)}); });
  items.forEach(i=>{ i.target = i.mat.transparent && i.mat.color.getHex()===0x24506B ? .55 : 1; i.from=i.o.position.y-.6; i.to=i.o.position.y; });
  items.sort((a,b)=>a.to-b.to).forEach((i,k)=>i.delay=260+k*14);
  function size(){ const w=wrap.clientWidth,h=wrap.clientHeight; renderer.setSize(w,h,false);
    camera.aspect=w/h; camera.position.set(w<780?15:12.5, w<780?8:7.2, w<780?19:16); camera.lookAt(0,2.4,0); camera.updateProjectionMatrix(); }
  size(); addEventListener('resize',size);
  let mx=0,my=0,tx=0,ty=0,sy=0,built=false,last=0; const stp=small?33:0, t0=performance.now(), baseY=()=>camera.position.y;
  if(!small) addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5; ty=e.clientY/innerHeight-.5;},{passive:true});
  addEventListener('scroll',()=>{sy=Math.min(scrollY,900);},{passive:true});
  const ease=t=>1-Math.pow(1-t,4);
  function frame(now){
    if(now-last<stp) return; last=now;
    const el=now-t0;
    if(!built){ let done=true;
      for(const i of items){ const t=Math.min(Math.max((el-i.delay)/900,0),1); if(t<1)done=false;
        const e=rmv?1:ease(t); i.mat.opacity=i.target*e; i.o.position.y=i.from+(i.to-i.from)*e; }
      built=done;
      if(built) items.forEach(i=>{ if(i.target===1) i.mat.transparent=false; });
    }
    mx+=(tx-mx)*.06; my+=(ty-my)*.06;
    v.root.rotation.y=-0.16+mx*.2+Math.sin(el*.00011)*.045;
    v.root.rotation.x=my*.04;
    camera.position.y=(small?8:7.2)-sy*.0016; camera.lookAt(0,2.4,0);
    renderer.render(scene,camera);
  }
  cleanup = whenVisible(wrap, frame);

    return () => cleanup();
  }, []);

  return (
    <section className="hero" id="top">
      <canvas ref={canvasRef} />
      <div className="wrap">
        <span className="badge"><b />Jaipur, Rajasthan &middot; since 2008</span>
        <h1 style={{ marginTop: '1.4rem' }}>Building Rajasthan.<br /><em>Supplying India.</em></h1>
        <p className="sub">Exclusive authorised Somany distributor for Rajasthan. Trusted Astral distribution partner. Two generations of getting the right material to the right site on the day it was promised.</p>
        <div className="ctas">
          <a href="/catalogue" className="btn btn-solid">View the catalogue</a>
          <a href="#work" className="btn btn-ghost">How a house comes together</a>
        </div>
        <div className="hero-strip">
          <div><b>Astral</b> pipes, fittings, tanks</div>
          <div><b>Somany</b> tiles, bathware, sanitaryware</div>
          <div><b>Same week</b> dispatch statewide</div>
          <div><b>18</b> years</div>
        </div>
      </div>
    </section>
  );
}
