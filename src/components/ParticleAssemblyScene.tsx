"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getParticleTargets } from "@/lib/particleTargets";
import { isoProject } from "@/lib/houseGeometry";

/**
 * The WebGL layer of "The Materials Assemble." One combined points buffer
 * across all four cohorts (structure/pipes/tiles/fixtures) in a single
 * draw call. Curl-noise-perturbed drift-to-target motion driven entirely
 * on the GPU (vertex shader) from a handful of scalar uniforms — no
 * per-particle JS work per frame, matching the brief's "all motion on the
 * GPU" requirement.
 *
 * Camera is a true isometric orthographic projection (same 30°/30° math as
 * `isoProject` in houseGeometry.ts), so the WebGL scene and the solidified
 * SVG overlay (AssemblyHouseSVG.tsx) read the same 3D coordinates through
 * the same transform and land in the same screen position without any
 * runtime coordinate syncing between the two systems.
 */

const COHORT = { structure: 0, pipes: 1, tiles: 2, fixtures: 3 } as const;

// Each cohort's own [start, end] window within the overall 0-1 scroll
// progress, per the brief's Beat 1-4 timing.
const COHORT_WINDOW: Record<number, [number, number]> = {
  [COHORT.structure]: [0.0, 0.2],
  [COHORT.pipes]: [0.15, 0.42],
  [COHORT.tiles]: [0.4, 0.72],
  [COHORT.fixtures]: [0.68, 0.88],
};

const VERTEX_SHADER = /* glsl */ `
attribute vec3 aHome;
attribute vec3 aTarget;
attribute float aCohort;
attribute float aDelay;
attribute vec3 aColor;

uniform float uProgressStructure;
uniform float uProgressPipes;
uniform float uProgressTiles;
uniform float uProgressFixtures;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uPixelRatio;
uniform float uPointSize;

varying vec3 vColor;
varying float vAlpha;

// --- Real 3D simplex noise + curl (Ashima Arts / Stefan Gustavson, public
// domain-licensed pattern) — used to perturb the drift-to-target path so
// travel reads as flow, not a linear tween. ---
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

vec3 curl(vec3 p){
  float e=0.15;
  float n1=snoise(vec3(p.x,p.y+e,p.z));
  float n2=snoise(vec3(p.x,p.y-e,p.z));
  float n3=snoise(vec3(p.x,p.y,p.z+e));
  float n4=snoise(vec3(p.x,p.y,p.z-e));
  float n5=snoise(vec3(p.x+e,p.y,p.z));
  float n6=snoise(vec3(p.x-e,p.y,p.z));
  float x=(n1-n2)-(n3-n4);
  float y=(n3-n4)-(n5-n6);
  float z=(n5-n6)-(n1-n2);
  return normalize(vec3(x,y,z)+1e-4);
}

float expoOut(float t){ return t>=1.0 ? 1.0 : 1.0-pow(2.0,-10.0*t); }

void main(){
  float cohortProgress =
    aCohort < 0.5 ? uProgressStructure :
    aCohort < 1.5 ? uProgressPipes :
    aCohort < 2.5 ? uProgressTiles : uProgressFixtures;

  float local = clamp((cohortProgress - aDelay*0.35) / max(0.001,(1.0-aDelay*0.35)), 0.0, 1.0);
  float eased = expoOut(local);

  vec3 base = mix(aHome, aTarget, eased);
  float turbulence = (1.0 - eased) * 1.4 + 0.05;
  vec3 flow = curl(aHome*0.6 + uTime*0.06) * turbulence;
  vec3 pos = base + flow;

  vec4 mvPosition = modelViewMatrix * vec4(pos,1.0);
  vec4 clip = projectionMatrix * mvPosition;

  // Desktop-only pointer repulsion, unassembled particles only (locked
  // geometry never reacts — assembled means held, per the brief). Pushes
  // the clip-space position directly away from the pointer in NDC space.
  vec2 ndc = clip.xy / clip.w;
  vec2 awayFromPointer = ndc - uPointer;
  float distToPointer = length(awayFromPointer);
  float repel = uPointerActive * (1.0-eased) * smoothstep(0.22,0.0,distToPointer) * 0.06;
  vec2 pushDir = distToPointer > 0.0001 ? normalize(awayFromPointer) : vec2(0.0);
  clip.xy += pushDir * repel * clip.w;
  gl_Position = clip;

  // Orthographic projection is parallel — point size must NOT scale with
  // depth the way it would under a perspective camera. The previous
  // the "* (300.0 / -mvPosition.z)" term assumed perspective foreshortening;
  // with particles scattered up to ~18 units from an origin the camera
  // sits only ~20 units from, any particle landing within a couple of
  // units of the camera along the view axis sent -mvPosition.z toward
  // zero, blowing gl_PointSize up toward infinity. A handful of those
  // oversized sprites, additively blended, is the solid white/orange
  // blowout reported live — this was never a colour or density bug.
  gl_PointSize = uPointSize * uPixelRatio * (1.0 + (1.0-eased)*0.6);

  // Beat 0 ("a faint drift of ember-coloured particles... like kiln dust in
  // torchlight") applies to every cohort while unassembled, including the
  // structure cohort — which is the majority of the particle count and
  // would otherwise sit there bone-white from the first frame, reading as
  // a pale cloud rather than dust. Colour only resolves to the cohort's
  // final material (bone structure, glaze pipes, ember tiles) as it
  // actually assembles.
  vec3 dustColor = vec3(0.83, 0.42, 0.1);
  vColor = mix(dustColor, aColor, eased);
  vAlpha = mix(0.75, 1.0, eased);
}
`;

const FRAGMENT_SHADER = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float glow = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor, glow * vAlpha);
}
`;

export function ParticleAssemblyScene({
  tier,
  cohortProgressRef,
  pointerRef,
  onError,
}: {
  tier: "full" | "reduced";
  cohortProgressRef: React.RefObject<{ structure: number; pipes: number; tiles: number; fixtures: number }>;
  pointerRef: React.RefObject<{ x: number; y: number; active: boolean }>;
  /** Called if the renderer fails to construct, or the GL context is lost
   * after a successful start — a capability check (hasWebGL) can pass and
   * the actual renderer/driver can still fail (confirmed in this project's
   * own dev session: a GPU/ANGLE driver error after context creation had
   * already probed successfully). The caller falls back to the no-WebGL
   * tier rather than leaving a dead canvas on screen. */
  onError?: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const canvas = document.createElement("canvas");
    mount.appendChild(canvas);

    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      onError?.();
    });

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, failIfMajorPerformanceCaveat: false });
    } catch {
      onError?.();
      mount.removeChild(canvas);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();

    // True isometric orthographic camera — same 30deg/30deg convention as
    // isoProject(), positioned along the (1,1,1)-family diagonal.
    const frustumSize = 12;
    const camera = new THREE.OrthographicCamera(-frustumSize, frustumSize, frustumSize, -frustumSize, 0.1, 100);
    const isoAngle = Math.atan(1 / Math.sqrt(2));
    const dist = 20;
    camera.position.set(
      dist * Math.cos(isoAngle) * Math.cos(Math.PI / 4),
      dist * Math.sin(isoAngle),
      dist * Math.cos(isoAngle) * Math.sin(Math.PI / 4)
    );
    camera.lookAt(0, 2.5, 0);

    function size() {
      const w = mount!.clientWidth;
      const h = mount!.clientHeight;
      renderer.setSize(w, h, true);
      const aspect = w / h;
      camera.left = -frustumSize * aspect;
      camera.right = frustumSize * aspect;
      camera.top = frustumSize;
      camera.bottom = -frustumSize;
      camera.updateProjectionMatrix();
    }
    size();
    window.addEventListener("resize", size);

    const { structure, pipes, tiles, fixtures } = getParticleTargets(tier);
    const cohortDatas = [
      { cohort: structure, id: COHORT.structure, color: new THREE.Color("#ebe7e2") },
      { cohort: pipes, id: COHORT.pipes, color: new THREE.Color("#6cd9d8") },
      { cohort: tiles, id: COHORT.tiles, color: new THREE.Color("#f3680f") },
      { cohort: fixtures, id: COHORT.fixtures, color: new THREE.Color("#ff9639") },
    ];
    const totalCount = cohortDatas.reduce((sum, c) => sum + c.cohort.count, 0);

    const homes = new Float32Array(totalCount * 3);
    const targets = new Float32Array(totalCount * 3);
    const cohortAttr = new Float32Array(totalCount);
    const delays = new Float32Array(totalCount);
    const colors = new Float32Array(totalCount * 3);

    let offset = 0;
    const rand = (() => {
      let seed = 7;
      return () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
    })();
    for (const { cohort, id, color } of cohortDatas) {
      for (let i = 0; i < cohort.count; i++) {
        const idx = offset + i;
        targets[idx * 3] = cohort.positions[i * 3];
        targets[idx * 3 + 1] = cohort.positions[i * 3 + 1];
        targets[idx * 3 + 2] = cohort.positions[i * 3 + 2];

        const theta = rand() * Math.PI * 2;
        const r = 8 + rand() * 10;
        homes[idx * 3] = Math.cos(theta) * r;
        homes[idx * 3 + 1] = rand() * 10 - 1;
        homes[idx * 3 + 2] = Math.sin(theta) * r - 2;

        cohortAttr[idx] = id;
        delays[idx] = rand();
        colors[idx * 3] = color.r;
        colors[idx * 3 + 1] = color.g;
        colors[idx * 3 + 2] = color.b;
      }
      offset += cohort.count;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("aHome", new THREE.BufferAttribute(homes, 3));
    geo.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
    geo.setAttribute("aCohort", new THREE.BufferAttribute(cohortAttr, 1));
    geo.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    // `position` is required by BufferGeometry/THREE.Points, but the real
    // rendered position is computed in the vertex shader from aHome/aTarget
    // (interpolated, curl-perturbed) — this attribute is never read by the
    // shader. Populated with `homes` (a real, non-degenerate point cloud)
    // purely so Three.js's automatic bounding-sphere computation has real
    // data to work from; frustumCulled is also disabled below since no
    // static attribute can capture the shader's true dynamic range anyway
    // (home -> target -> curl noise -> repulsion). Leaving this at all-zero,
    // as an earlier version did, collapses the bounding sphere to a single
    // point and risks the whole draw call being frustum-culled regardless
    // of where the shader actually places the particles.
    geo.setAttribute("position", new THREE.BufferAttribute(homes.slice(), 3));

    const uniforms = {
      uProgressStructure: { value: 0 },
      uProgressPipes: { value: 0 },
      uProgressTiles: { value: 0 },
      uProgressFixtures: { value: 0 },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerActive: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uPointSize: { value: tier === "full" ? 3.2 : 3.8 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, material);
    points.frustumCulled = false;
    scene.add(points);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    let raf = 0;
    let disposed = false;
    function frame(t: number) {
      if (disposed) return;
      const cp = cohortProgressRef.current;
      uniforms.uProgressStructure.value = cp?.structure ?? 0;
      uniforms.uProgressPipes.value = cp?.pipes ?? 0;
      uniforms.uProgressTiles.value = cp?.tiles ?? 0;
      uniforms.uProgressFixtures.value = cp?.fixtures ?? 0;
      uniforms.uTime.value = t * 0.001;
      const pointer = pointerRef.current;
      if (pointer) {
        uniforms.uPointer.value.set(pointer.x, pointer.y);
        uniforms.uPointerActive.value = pointer.active ? 1 : 0;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      renderer.dispose();
      geo.dispose();
      material.dispose();
      mount.removeChild(canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}

export { COHORT, COHORT_WINDOW, isoProject };
