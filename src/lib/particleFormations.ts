/**
 * Pure functions generating target point-cloud positions for the hero's
 * particle system. No React, no Three.js imports — just Float32Arrays of
 * xyz positions — so these are trivially testable and keep
 * `ParticleHero.tsx` from ballooning.
 *
 * Every formation is split into two families of equal intent across the
 * whole scene: the first `count / 2` indices are the "tile" family (Somany),
 * the remaining indices are the "pipe" family (Astral). The split is
 * consistent across every formation function, so particle `i` always
 * belongs to the same family and its identity carries through scatter ->
 * coalescence -> house without ever reassigning which cluster it's part of.
 */

export interface FormationOptions {
  count: number;
  seed?: number;
}

function mulberry32(seed: number) {
  let t = seed;
  return function random() {
    t += 0x6d2b79f5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function familySplit(count: number) {
  const tileCount = Math.floor(count / 2);
  return { tileCount, pipeCount: count - tileCount };
}

/** Phase 1 — loose ambient drift, no pattern, full volume. */
export function generateScatterFormation({ count, seed = 1 }: FormationOptions): Float32Array {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() - 0.5) * 14;
    positions[i * 3 + 1] = (rand() - 0.5) * 8 + 0.5;
    positions[i * 3 + 2] = (rand() - 0.5) * 6 - 2;
  }
  return positions;
}

/** Phase 2 (left cluster) — a stacked tile grid, Somany. */
function fillTileGrid(positions: Float32Array, offset: number, tileCount: number, rand: () => number) {
  const cols = 6;
  const rows = 4;
  const tileW = 0.42;
  const tileH = 0.3;
  const gap = 0.06;
  for (let i = 0; i < tileCount; i++) {
    const tileIndex = i % (cols * rows);
    const col = tileIndex % cols;
    const row = Math.floor(tileIndex / cols);
    const baseX = -3.4 + col * (tileW + gap);
    const baseY = -1.4 + row * (tileH + gap);
    const idx = (offset + i) * 3;
    positions[idx] = baseX + (rand() - 0.5) * tileW * 0.85;
    positions[idx + 1] = baseY + (rand() - 0.5) * tileH * 0.85;
    // slight per-tile stack offset so tiles read as "settling" rather than already flat
    positions[idx + 2] = (rand() - 0.5) * 0.06 + ((tileIndex % 3) - 1) * 0.02;
  }
}

/** Phase 2 (right cluster) — a pipe riser with an elbow joint, Astral. */
function fillPipeRun(positions: Float32Array, offset: number, pipeCount: number, rand: () => number) {
  const radius = 0.16;
  const riserLength = 2.0;
  const branchLength = 1.2;
  const totalLength = riserLength + branchLength;
  for (let i = 0; i < pipeCount; i++) {
    const t = rand() * totalLength;
    const theta = rand() * Math.PI * 2;
    let cx: number;
    let cy: number;
    if (t < riserLength) {
      cx = 1.8;
      cy = -1.6 + t;
    } else {
      const bend = t - riserLength;
      cx = 1.8 + bend;
      cy = -1.6 + riserLength;
    }
    const idx = (offset + i) * 3;
    positions[idx] = cx + Math.cos(theta) * radius;
    positions[idx + 1] = cy + Math.sin(theta) * radius * 0.6;
    positions[idx + 2] = Math.sin(theta) * radius;
  }
}

export function generateCoalescenceFormation({ count, seed = 2 }: FormationOptions): Float32Array {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const { tileCount, pipeCount } = familySplit(count);
  fillTileGrid(positions, 0, tileCount, rand);
  fillPipeRun(positions, tileCount, pipeCount, rand);
  return positions;
}

/**
 * Phase 3 — both clusters assemble into a low-poly house silhouette: the
 * tile family becomes the wall face, roofline and floor edge; the pipe
 * family becomes a single visible riser up the side of the house. Kept
 * abstract/geometric on purpose, not literal architecture.
 */
function fillHouseBody(positions: Float32Array, offset: number, tileCount: number, rand: () => number) {
  for (let i = 0; i < tileCount; i++) {
    const t = i / tileCount;
    let x: number;
    let y: number;
    if (t < 0.55) {
      // wall face fill
      x = -1.3 + rand() * 2.6;
      y = -1.3 + rand() * 1.6;
    } else if (t < 0.85) {
      // roofline ridge, two slopes meeting at the apex
      const local = (t - 0.55) / 0.3;
      if (local < 0.5) {
        const lt = local / 0.5;
        x = -1.4 + lt * 1.4;
        y = 0.3 + lt * 0.95;
      } else {
        const lt = (local - 0.5) / 0.5;
        x = 0 + lt * 1.4;
        y = 1.25 - lt * 0.95;
      }
      x += (rand() - 0.5) * 0.1;
      y += (rand() - 0.5) * 0.1;
    } else {
      // floor edge
      x = -1.4 + rand() * 2.8;
      y = -1.3 + (rand() - 0.5) * 0.08;
    }
    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = (rand() - 0.5) * 0.12;
  }
}

function fillHouseRiser(positions: Float32Array, offset: number, pipeCount: number, rand: () => number) {
  const radius = 0.08;
  const length = 2.9;
  for (let i = 0; i < pipeCount; i++) {
    const t = rand();
    const theta = rand() * Math.PI * 2;
    const idx = (offset + i) * 3;
    positions[idx] = 1.65 + Math.cos(theta) * radius;
    positions[idx + 1] = -1.3 + t * length + Math.sin(theta) * radius * 0.6;
    positions[idx + 2] = Math.sin(theta) * radius;
  }
}

export function generateHouseFormation({ count, seed = 3 }: FormationOptions): Float32Array {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const { tileCount, pipeCount } = familySplit(count);
  fillHouseBody(positions, 0, tileCount, rand);
  fillHouseRiser(positions, tileCount, pipeCount, rand);
  return positions;
}

export function particleFamily(index: number, count: number): "tile" | "pipe" {
  const { tileCount } = familySplit(count);
  return index < tileCount ? "tile" : "pipe";
}
