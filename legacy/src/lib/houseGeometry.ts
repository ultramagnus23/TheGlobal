/**
 * Single source of truth for "The Materials Assemble" hero: the house is
 * defined once, here, as real 3D shapes in a shared coordinate space. Both
 * the WebGL particle target sampler (particleTargets.ts) and the solidified
 * SVG overlay (AssemblyHouseSVG.tsx) read the same definitions and project
 * them with the same isometric transform, so the two systems stay pixel-
 * aligned by construction — never by syncing two independently-authored
 * geometries at runtime.
 *
 * Authoring method, disclosed plainly: this is parametric/procedural
 * geometry (boxes, cylinders, grids) defined in code, not a scan of a
 * hand-drawn Illustrator file — there was no design-tool access available
 * to author it that way in this session. It follows the brief's shape
 * requirements (two-storey, flat roof with parapet, cutaway front-right
 * quadrant revealing two bathrooms on a shared riser, external stair, roof
 * water tank, three stroke weights) as procedural geometry instead.
 *
 * Units are arbitrary "house units" (1 unit ≈ roughly 1 metre for
 * proportion purposes). Coordinate convention: +x right, +y up, +z toward
 * viewer.
 */

export interface Box {
  id: string;
  center: [number, number, number];
  size: [number, number, number];
}

export interface Cylinder {
  id: string;
  /** Points defining a polyline the pipe run follows (elbows at each vertex). */
  path: [number, number, number][];
  radius: number;
}

export interface TileField {
  id: string;
  /** Origin corner of the field. */
  origin: [number, number, number];
  /** Unit vectors (not normalised — their length sets the field's extent) along the two field axes. */
  uAxis: [number, number, number];
  vAxis: [number, number, number];
  tileSize: number;
  gapRatio: number;
}

export interface FixtureBlob {
  id: string;
  center: [number, number, number];
  radius: number;
}

export const HOUSE = {
  // Foundation + shell — structure cohort.
  foundation: { id: "foundation", center: [0, 0.15, 0], size: [7.2, 0.3, 5.6] } satisfies Box,
  groundWalls: { id: "ground-walls", center: [0, 1.65, 0], size: [7, 3, 5.4] } satisfies Box,
  firstFloorWalls: { id: "first-walls", center: [0, 4.65, 0], size: [7, 3, 5.4] } satisfies Box,
  parapet: { id: "parapet", center: [0, 6.35, 0], size: [7.1, 0.4, 5.5] } satisfies Box,
  roof: { id: "roof", center: [0, 6.55, 0], size: [7.2, 0.15, 5.6] } satisfies Box,
  stair: { id: "stair", center: [4.1, 3.3, -2.6], size: [1.4, 6.6, 1.1] } satisfies Box,
  waterTank: { id: "water-tank", center: [-2.6, 7.1, 1.6], size: [1.3, 1.1, 1.1] } satisfies Box,
  tankStaunchion: { id: "tank-staunchion", center: [-2.6, 6.65, 1.6], size: [1.4, 0.3, 1.4] } satisfies Box,

  // Astral pipe run cohort — riser + two branch runs, elbowed polylines.
  pipeRiser: {
    id: "pipe-riser",
    path: [
      [1.6, 0.3, 2.6],
      [1.6, 6.2, 2.6],
    ],
    radius: 0.09,
  } satisfies Cylinder,
  pipeBranchGround: {
    id: "pipe-branch-ground",
    path: [
      [1.6, 1.8, 2.6],
      [1.6, 1.8, 1.2],
      [0.6, 1.8, 1.2],
    ],
    radius: 0.07,
  } satisfies Cylinder,
  pipeBranchFirst: {
    id: "pipe-branch-first",
    path: [
      [1.6, 4.8, 2.6],
      [1.6, 4.8, 1.2],
      [0.6, 4.8, 1.2],
    ],
    radius: 0.07,
  } satisfies Cylinder,

  // Somany tile cohort — ground floor, ground bathroom wall, first bathroom wall.
  floorTiles: {
    id: "floor-tiles",
    origin: [-3.4, 0.31, -2.6],
    uAxis: [6.8, 0, 0],
    vAxis: [0, 0, 5.2],
    tileSize: 0.6,
    gapRatio: 0.06,
  } satisfies TileField,
  bathroomWallGround: {
    id: "bathroom-wall-ground",
    origin: [0.05, 0.31, 0.6],
    uAxis: [0, 2.9, 0],
    vAxis: [0, 0, 1.6],
    tileSize: 0.3,
    gapRatio: 0.08,
  } satisfies TileField,
  bathroomWallFirst: {
    id: "bathroom-wall-first",
    origin: [0.05, 3.31, 0.6],
    uAxis: [0, 2.9, 0],
    vAxis: [0, 0, 1.6],
    tileSize: 0.3,
    gapRatio: 0.08,
  } satisfies TileField,

  // Fixture cohort — WC + basin per bathroom (ground shown solidified; first floor echoes it).
  fixtureWcGround: { id: "fixture-wc-ground", center: [1.15, 0.55, 1.7], radius: 0.32 } satisfies FixtureBlob,
  fixtureBasinGround: { id: "fixture-basin-ground", center: [0.35, 0.95, 0.75], radius: 0.28 } satisfies FixtureBlob,
  fixtureMixerGround: { id: "fixture-mixer-ground", center: [0.35, 1.25, 0.65], radius: 0.12 } satisfies FixtureBlob,
} as const;

export const ASTRAL_PIPES: Cylinder[] = [HOUSE.pipeRiser, HOUSE.pipeBranchGround, HOUSE.pipeBranchFirst];
export const SOMANY_TILE_FIELDS: TileField[] = [HOUSE.floorTiles, HOUSE.bathroomWallGround, HOUSE.bathroomWallFirst];
export const FIXTURES: FixtureBlob[] = [HOUSE.fixtureWcGround, HOUSE.fixtureBasinGround, HOUSE.fixtureMixerGround];
export const STRUCTURE_BOXES: Box[] = [
  HOUSE.foundation,
  HOUSE.groundWalls,
  HOUSE.firstFloorWalls,
  HOUSE.parapet,
  HOUSE.roof,
  HOUSE.stair,
  HOUSE.waterTank,
  HOUSE.tankStaunchion,
];

/**
 * True isometric projection (30°/30°, matching the brief's axonometric
 * requirement) — the ONE transform shared by the WebGL orthographic camera
 * setup and the SVG overlay, so a 3D point projects to the same 2D pixel
 * in both. `scale` maps house units to SVG viewBox units.
 */
export function isoProject([x, y, z]: [number, number, number], scale = 40): [number, number] {
  const screenX = (x - z) * Math.cos(Math.PI / 6);
  const screenY = (x + z) * Math.sin(Math.PI / 6) - y;
  return [screenX * scale, screenY * scale];
}
