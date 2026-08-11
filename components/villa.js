'use client';
import * as THREE from 'three';

export const isSmall = () => typeof window !== 'undefined' && window.innerWidth < 780;
export const prefersReduced = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const dpr = () => Math.min((typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1), isSmall() ? 1.5 : 1.75);
export function chamfer(w,h,d,rad){
  rad = rad || 0.045;
  const sh=new THREE.Shape();
  const x=-w/2+rad, y=-h/2+rad, W=w-rad*2, H=h-rad*2;
  sh.moveTo(x,y); sh.lineTo(x+W,y); sh.lineTo(x+W,y+H); sh.lineTo(x,y+H); sh.lineTo(x,y);
  const geo=new THREE.ExtrudeGeometry(sh,{depth:d-rad*2, bevelEnabled:true, bevelThickness:rad, bevelSize:rad, bevelSegments:2, curveSegments:2});
  geo.translate(0,0,-(d-rad*2)/2); geo.computeVertexNormals();
  return geo;
}
export const MAT={
  wall:  ()=>new THREE.MeshStandardMaterial({color:0xE3DCCD, roughness:.92}),
  wall2: ()=>new THREE.MeshStandardMaterial({color:0xCFC6B4, roughness:.95}),
  dark:  ()=>new THREE.MeshStandardMaterial({color:0x2A3540, roughness:.7, metalness:.15}),
  wood:  ()=>new THREE.MeshStandardMaterial({color:0x8A6242, roughness:.85}),
  glass: ()=>new THREE.MeshStandardMaterial({color:0x24506B, roughness:.08, metalness:.5, transparent:true, opacity:.55}),
  water: ()=>new THREE.MeshStandardMaterial({color:0x2E7BA6, roughness:.12, metalness:.4}),
  pipeA: ()=>new THREE.MeshStandardMaterial({color:0x2E7BA6, roughness:.32, metalness:.2, emissive:0x0A2434}),
  pipeB: ()=>new THREE.MeshStandardMaterial({color:0x5FAFD6, roughness:.32, metalness:.2, emissive:0x0A2434}),
  tileA: ()=>new THREE.MeshStandardMaterial({color:0xD8C5B0, roughness:.35, metalness:.05}),
  tileB: ()=>new THREE.MeshStandardMaterial({color:0xC4573F, roughness:.4}),
  green: ()=>new THREE.MeshStandardMaterial({color:0x4C6046, roughness:1, flatShading:false})
};
export function buildVilla(scene, opts){
  opts=opts||{};
  const root=new THREE.Group(); scene.add(root);
  const shell=new THREE.Group(), skin=new THREE.Group(), pipes=new THREE.Group(), tiles=new THREE.Group(), site=new THREE.Group();
  root.add(shell,skin,pipes,tiles,site);
  const push=(g,geo,mat,x,y,z,rx,ry)=>{
    const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z);
    if(rx)m.rotation.x=rx; if(ry)m.rotation.y=ry;
    m.castShadow=true; m.receiveShadow=true; g.add(m); return m;
  };
  const B=(g,w,h,d,x,y,z,mat,rad)=>push(g,chamfer(w,h,d,rad),mat,x,y,z);

  /* site */
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(70,52,1,1), new THREE.MeshStandardMaterial({color:0x18222C, roughness:1}));
  ground.rotation.x=-Math.PI/2; ground.position.y=-0.28; ground.receiveShadow=true; site.add(ground);
  for(let i=0;i<7;i++) B(site, 2.0,0.06,1.5, -4.6+ (i%4)*2.15, -0.2, 3.9 + Math.floor(i/4)*1.6, MAT.wall2());
  B(site, 13.4,0.5,8.8, 0,0.05,0, MAT.dark());             // plinth
  B(site, 6.1,0.34,3.1, 6.6,-0.06,1.4, MAT.wall2());        // pool coping
  B(site, 5.6,0.2,2.6, 6.6,0.02,1.4, MAT.water());          // water
  B(site, 0.26,1.3,17, -9.6,0.4,0, MAT.wall2());            // boundary wall

  /* shell: slabs + columns */
  const slab=(y,w,d)=>B(shell,w,0.34,d, -0.3,y,0.1, MAT.wall());
  slab(0.48,11.2,6.9); slab(3.30,11.9,7.2); slab(6.10,9.2,5.9);
  [[-4.6,2.9],[3.9,2.9],[-4.6,-2.6],[3.9,-2.6]].forEach(p=>{
    const c=new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,2.8,20), MAT.dark());
    c.position.set(p[0],1.9,p[1]); c.castShadow=true; shell.add(c);
    const c2=c.clone(); c2.position.y=4.7; shell.add(c2);
  });
  /* skin: walls, glazing, mullions, railing */
  B(skin, 8.6,2.6,0.22, -1.0,1.9,-2.55, MAT.wall());        // rear wall lower
  B(skin, 0.22,2.6,5.0, -4.9,1.9,-0.1, MAT.wall());         // left wall lower
  B(skin, 5.0,2.4,0.1, 1.3,1.9,2.5, MAT.glass());           // front glazing
  for(let i=0;i<5;i++) B(skin, 0.07,2.5,0.14, -1.0+i*1.15,1.9,2.52, MAT.dark(),0.02);
  B(skin, 6.6,2.5,0.2, -1.6,4.75,-2.2, MAT.wall());         // upper rear
  B(skin, 0.2,2.5,4.4, -4.7,4.75,-0.2, MAT.wall());
  B(skin, 3.6,2.2,0.1, 1.6,4.75,1.75, MAT.glass());
  for(let i=0;i<4;i++) B(skin, 0.07,2.3,0.14, 0.2+i*0.95,4.75,1.77, MAT.dark(),0.02);
  B(skin, 5.4,0.1,0.1, 1.6,5.55,2.52, MAT.dark(),0.02);     // balcony rail top
  for(let i=0;i<14;i++){
    const p=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,.95,8), MAT.dark());
    p.position.set(-0.9+i*0.38,5.05,2.52); skin.add(p);
  }
  B(skin, 1.1,2.3,0.12, -3.3,1.8,2.52, MAT.wood());         // door
  B(skin, 3.0,0.16,1.3, -3.3,3.45,3.0, MAT.wall());         // canopy
  /* planting */
  function tree(x,z,s){
    const t=new THREE.Mesh(new THREE.CylinderGeometry(.08*s,.11*s,1.5*s,10), new THREE.MeshStandardMaterial({color:0x3A3A30, roughness:1}));
    t.position.set(x,.75*s,z); t.castShadow=true; site.add(t);
    for(let i=0;i<4;i++){
      const f=new THREE.Mesh(new THREE.IcosahedronGeometry(.6*s,1), MAT.green());
      f.position.set(x+(i-1.5)*.3*s, (1.55+i*.34)*s, z+((i%2)?.22:-.2)*s);
      f.scale.set(1,.85,1); f.castShadow=true; site.add(f);
    }
  }
  tree(-7.0,3.8,1.2); tree(10.2,-2.4,1.0); tree(-7.8,-3.2,0.85);
  for(let i=0;i<6;i++){
    const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.34,1), MAT.green());
    b.position.set(-6.2+i*0.8, 0.1, 4.7); b.scale.y=.7; site.add(b);
  }

  /* pipes: risers + branches inside the wall line */
  const riser=(x,z,r,mat)=>{
    const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,6.2,18), mat);
    m.position.set(x,3.0,z); m.castShadow=true; pipes.add(m);
  };
  riser(-2.4,-2.2,.10,MAT.pipeA()); riser(-1.7,-2.2,.08,MAT.pipeB());
  riser(1.4,-2.2,.14,MAT.pipeA()); riser(2.2,-2.2,.08,MAT.pipeB());
  [1.15,3.95].forEach(y=>{
    [[.075,4.6,'x',-0.6,y,-2.2,MAT.pipeB()],[.075,3.6,'z',1.4,y,-0.6,MAT.pipeB()],[.10,3.0,'x',1.0,y+.35,-2.35,MAT.pipeA()]].forEach(d=>{
      const m=new THREE.Mesh(new THREE.CylinderGeometry(d[0],d[0],d[1],16), d[6]);
      m.position.set(d[3],d[4],d[5]);
      if(d[2]==='x')m.rotation.z=Math.PI/2; if(d[2]==='z')m.rotation.x=Math.PI/2;
      pipes.add(m);
    });
    for(let i=0;i<3;i++){
      const e=new THREE.Mesh(new THREE.TorusGeometry(.16,.055,10,20,Math.PI/2), MAT.pipeA());
      e.position.set(-2.4+i*1.9, y+0.9, -2.2); e.rotation.y=Math.PI/2; pipes.add(e);
    }
  });
  /* tiles */
  const tileFloor=(y,w,d,x,z,mat)=>{
    const m=B(tiles,w,0.05,d,x,y,z,mat,0.01); return m;
  };
  tileFloor(0.68,9.4,5.4,-0.6,0.1,MAT.tileA());
  tileFloor(3.50,8.2,5.0,-0.9,0.1,MAT.tileA());
  B(tiles, 8.4,1.5,0.05, -1.0,1.35,-2.42, MAT.tileB(),0.01);
  B(tiles, 6.4,1.4,0.05, -1.6,4.25,-2.08, MAT.tileB(),0.01);
  B(tiles, 0.05,1.4,4.8, -4.76,1.3,-0.1, MAT.tileA(),0.01);
  for(let i=0;i<9;i++) B(tiles, 0.02,0.05,5.4, -4.9+i*1.05,0.71,0.1, MAT.wall2(),0.005);

  return {root, shell, skin, pipes, tiles, site};
}
export function makeRenderer(canvas){
  const r=new THREE.WebGLRenderer({canvas, antialias:dpr()<2, alpha:true, powerPreference:'high-performance'});
  r.setPixelRatio(dpr()); r.outputColorSpace=THREE.SRGBColorSpace;
  r.shadowMap.enabled=!isSmall(); r.shadowMap.type=THREE.PCFSoftShadowMap;
  return r;
}
export function lights(scene){
  scene.add(new THREE.HemisphereLight(0xD8E6F2, 0x0B1219, .75));
  const key=new THREE.DirectionalLight(0xFFEFD8, 1.25); key.position.set(9,14,8);
  key.castShadow=!isSmall();
  if(key.shadow && key.castShadow){key.shadow.mapSize.set(1024,1024); const c=key.shadow.camera; c.left=-18;c.right=18;c.top=18;c.bottom=-18;c.far=48;}
  scene.add(key);
  const fill=new THREE.DirectionalLight(0x5FAFD6,.35); fill.position.set(-10,5,-9); scene.add(fill);
  const warm=new THREE.PointLight(0xE58063,.6,18); warm.position.set(2,2.4,1); scene.add(warm);
}

const ticks = new Set();
let looping = false;
function pump(now) {
  if (!ticks.size) { looping = false; return; }
  ticks.forEach((f) => f(now));
  requestAnimationFrame(pump);
}
export function play(f) { ticks.add(f); if (!looping) { looping = true; requestAnimationFrame(pump); } }
export function stopTick(f) { ticks.delete(f); }
export function whenVisible(el, f) {
  const io = new IntersectionObserver((es) => { es[0].isIntersecting ? play(f) : ticks.delete(f); }, { rootMargin: '150px' });
  io.observe(el);
  const onHide = () => { if (document.hidden) ticks.delete(f); };
  document.addEventListener('visibilitychange', onHide);
  return () => { io.disconnect(); ticks.delete(f); document.removeEventListener('visibilitychange', onHide); };
}
