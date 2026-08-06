"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import {
  generateScatterFormation,
  generateCoalescenceFormation,
  generateHouseFormation,
  familySplit,
} from "@/lib/particleFormations";

/** Hard phase boundaries — kept as named constants so timing can't drift into mush. */
const PHASE = {
  coalesceStart: 0.15,
  coalesceEnd: 0.55,
  assembleStart: 0.55,
  assembleEnd: 0.85,
};

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Resolves a CSS colour value (including oklch(), which THREE.Color can't
 * parse on its own) via the same engine the browser uses to paint the DOM,
 * so the particle palette always matches globals.css exactly. */
function resolveCssColor(raw: string, fallbackHex: string): THREE.Color {
  if (typeof document === "undefined" || !raw) return new THREE.Color(fallbackHex);
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Color(fallbackHex);
    ctx.fillStyle = raw;
    return new THREE.Color(ctx.fillStyle || fallbackHex);
  } catch {
    return new THREE.Color(fallbackHex);
  }
}

interface ParticleCloudProps {
  progress: MotionValue<number>;
  count: number;
  emberColor: string;
  glazeColor: string;
}

function ParticleCloud({ progress, count, emberColor, glazeColor }: ParticleCloudProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const elapsed = useRef(0);

  const { scatter, coalesce, house, delays, colorAttr } = useMemo(() => {
    const scatter = generateScatterFormation({ count, seed: 11 });
    const coalesce = generateCoalescenceFormation({ count, seed: 22 });
    const house = generateHouseFormation({ count, seed: 33 });
    const { tileCount } = familySplit(count);
    const ember = resolveCssColor(emberColor, "#d9843f");
    const glaze = resolveCssColor(glazeColor, "#a9d8dc");
    const delays = new Float32Array(count);
    const colorAttr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      delays[i] = Math.random();
      const c = i < tileCount ? ember : glaze;
      colorAttr[i * 3] = c.r;
      colorAttr[i * 3 + 1] = c.g;
      colorAttr[i * 3 + 2] = c.b;
    }
    return { scatter, coalesce, house, delays, colorAttr };
  }, [count, emberColor, glazeColor]);

  // Initial position buffer — mutated in place every frame, never reallocated.
  const positionAttr = useMemo(() => new Float32Array(scatter), [scatter]);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const geometry = pointsRef.current?.geometry;
    const attr = geometry?.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (!attr) return;
    const arr = attr.array as Float32Array;
    const p = progress.get();
    const t = elapsed.current;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // per-particle stagger so the coalescence reads as flowing-together,
      // not a uniform teleport
      const stagger = delays[i] * 0.12;

      const tCoal = smoothstep(PHASE.coalesceStart + stagger, PHASE.coalesceEnd, p);
      const tHouse = smoothstep(PHASE.assembleStart + stagger, PHASE.assembleEnd, p);

      let x = scatter[idx] + (coalesce[idx] - scatter[idx]) * tCoal;
      let y = scatter[idx + 1] + (coalesce[idx + 1] - scatter[idx + 1]) * tCoal;
      let z = scatter[idx + 2] + (coalesce[idx + 2] - scatter[idx + 2]) * tCoal;

      x += (house[idx] - x) * tHouse;
      y += (house[idx + 1] - y) * tHouse;
      z += (house[idx + 2] - z) * tHouse;

      // ambient drift, fades out once a particle starts committing to a target
      const settle = Math.max(tCoal, tHouse);
      const driftAmount = 0.04 * (1 - settle);
      x += Math.sin(t * 0.4 + i) * driftAmount;
      y += Math.cos(t * 0.35 + i * 1.7) * driftAmount;

      arr[idx] = x;
      arr[idx + 1] = y;
      arr[idx + 2] = z;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positionAttr, 3]} />
        <bufferAttribute attach="attributes-color" args={[colorAttr, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function CameraDrift() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.05) * 0.15;
    camera.position.y = 0.15 + Math.cos(t * 0.04) * 0.08;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

interface ParticleHeroProps {
  progress: MotionValue<number>;
  count: number;
  emberColor: string;
  glazeColor: string;
}

export function ParticleHero({ progress, count, emberColor, glazeColor }: ParticleHeroProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.2, 6.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <CameraDrift />
      <ParticleCloud progress={progress} count={count} emberColor={emberColor} glazeColor={glazeColor} />
    </Canvas>
  );
}
