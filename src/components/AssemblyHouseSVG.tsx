"use client";

import Link from "next/link";
import { HOUSE, ASTRAL_PIPES, SOMANY_TILE_FIELDS, isoProject, type Box } from "@/lib/houseGeometry";

/**
 * The "destination" the particles resolve into — real SVG, in the DOM,
 * hyperlinked and crawlable, not a canvas drawing. Projects the exact same
 * HOUSE geometry the particle sampler reads (particleTargets.ts) through
 * the exact same isoProject() transform the WebGL camera uses, so this
 * overlay lands in the same screen position as the particle convergence
 * without any runtime alignment step.
 *
 * Three stroke weights per the brief: structure 2px, systems 1.25px,
 * detail 0.75px — applied consistently, never mixed ad hoc.
 */

const SCALE = 40;
const STRUCTURE_STROKE = 2;
const SYSTEM_STROKE = 1.25;
const DETAIL_STROKE = 0.75;

function boxFaces(box: Box) {
  const [cx, cy, cz] = box.center;
  const [sx, sy, sz] = box.size;
  const hx = sx / 2,
    hy = sy / 2,
    hz = sz / 2;
  const p = (x: number, y: number, z: number) => isoProject([x, y, z], SCALE);

  // Visible faces for a camera in the (+x,+y,+z) octant: top, right (+x), front (+z).
  const top = [p(cx - hx, cy + hy, cz - hz), p(cx + hx, cy + hy, cz - hz), p(cx + hx, cy + hy, cz + hz), p(cx - hx, cy + hy, cz + hz)];
  const right = [p(cx + hx, cy + hy, cz - hz), p(cx + hx, cy + hy, cz + hz), p(cx + hx, cy - hy, cz + hz), p(cx + hx, cy - hy, cz - hz)];
  const front = [p(cx - hx, cy + hy, cz + hz), p(cx + hx, cy + hy, cz + hz), p(cx + hx, cy - hy, cz + hz), p(cx - hx, cy - hy, cz + hz)];
  const toPoints = (pts: [number, number][]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return { top: toPoints(top), right: toPoints(right), front: toPoints(front) };
}

export function AssemblyHouseSVG({ className, interactive = true }: { className?: string; interactive?: boolean }) {
  const structureBoxes = [
    HOUSE.foundation,
    HOUSE.groundWalls,
    HOUSE.firstFloorWalls,
    HOUSE.parapet,
    HOUSE.roof,
    HOUSE.stair,
    HOUSE.waterTank,
    HOUSE.tankStaunchion,
  ];

  // Compute a viewBox that frames the whole house with a margin.
  const allPts = structureBoxes.flatMap((b) => {
    const [cx, cy, cz] = b.center;
    const [sx, sy, sz] = b.size;
    const corners: [number, number, number][] = [
      [cx - sx / 2, cy - sy / 2, cz - sz / 2],
      [cx + sx / 2, cy + sy / 2, cz + sz / 2],
    ];
    return corners.map((c) => isoProject(c, SCALE));
  });
  const xs = allPts.map((p) => p[0]);
  const ys = allPts.map((p) => p[1]);
  const margin = 40;
  const minX = Math.min(...xs) - margin;
  const maxX = Math.max(...xs) + margin;
  const minY = Math.min(...ys) - margin;
  const maxY = Math.max(...ys) + margin;

  const Wrap = interactive ? Link : "g";

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      className={className}
      role="img"
      aria-label="Cutaway diagram of a two-storey house showing Astral pipe runs and Somany tile and fixture placements, each linking to the matching catalogue"
    >
      <g stroke="var(--bone)" strokeWidth={STRUCTURE_STROKE} fill="var(--void-raised)" fillOpacity={0.55} strokeLinejoin="round">
        {structureBoxes.map((box) => {
          const faces = boxFaces(box);
          return (
            <g key={box.id}>
              <polygon points={faces.top} fillOpacity={0.7} pathLength={1} />
              <polygon points={faces.right} fillOpacity={0.45} pathLength={1} />
              <polygon points={faces.front} fillOpacity={0.3} pathLength={1} />
            </g>
          );
        })}
      </g>

      {/* Astral pipe runs — systems weight, glaze colour, real link */}
      <Wrap href="/astral" aria-label="Astral pipe systems: view the CPVC, UPVC and SWR range">
        <g stroke="var(--glaze)" strokeWidth={SYSTEM_STROKE} fill="none" strokeLinecap="round">
          {ASTRAL_PIPES.map((pipe) => {
            const pts = pipe.path.map((pt) => isoProject(pt, SCALE));
            const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
            return <path key={pipe.id} d={d} pathLength={1} />;
          })}
          {ASTRAL_PIPES.flatMap((pipe) =>
            pipe.path.slice(1, -1).map((pt, i) => {
              const [x, y] = isoProject(pt, SCALE);
              return <circle key={`${pipe.id}-joint-${i}`} cx={x} cy={y} r={3} fill="var(--glaze)" stroke="none" />;
            })
          )}
        </g>
      </Wrap>

      {/* Somany tile fields — detail weight, ember colour, real link */}
      <Wrap href="/somany" aria-label="Somany tile and sanitaryware range: view floor, wall and bath fittings">
        <g stroke="var(--void)" strokeWidth={DETAIL_STROKE} fill="var(--ember)">
          {SOMANY_TILE_FIELDS.flatMap((field) => {
            const uLen = Math.hypot(...field.uAxis);
            const vLen = Math.hypot(...field.vAxis);
            const uSteps = Math.max(1, Math.round(uLen / field.tileSize));
            const vSteps = Math.max(1, Math.round(vLen / field.tileSize));
            const uUnit = field.uAxis.map((c) => c / uLen);
            const vUnit = field.vAxis.map((c) => c / vLen);
            const tiles: React.ReactElement[] = [];
            for (let ui = 0; ui < uSteps; ui++) {
              for (let vi = 0; vi < vSteps; vi++) {
                const inset = field.gapRatio / 2;
                const corners: [number, number, number][] = [
                  [0, 0],
                  [1, 0],
                  [1, 1],
                  [0, 1],
                ].map(([du, dv]) => {
                  const u = (ui + inset + du * (1 - field.gapRatio)) * field.tileSize;
                  const v = (vi + inset + dv * (1 - field.gapRatio)) * field.tileSize;
                  return [
                    field.origin[0] + uUnit[0] * u + vUnit[0] * v,
                    field.origin[1] + uUnit[1] * u + vUnit[1] * v,
                    field.origin[2] + uUnit[2] * u + vUnit[2] * v,
                  ];
                }) as [number, number, number][];
                const pts = corners.map((c) => isoProject(c, SCALE));
                tiles.push(
                  <polygon
                    key={`${field.id}-${ui}-${vi}`}
                    points={pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}
                    pathLength={1}
                  />
                );
              }
            }
            return tiles;
          })}
        </g>
      </Wrap>

      {/* Fixtures — small ellipses at each fixture centre */}
      <Wrap href="/somany" aria-label="Somany sanitaryware fixtures">
        <g fill="var(--bone)" stroke="var(--void)" strokeWidth={DETAIL_STROKE}>
          {[HOUSE.fixtureWcGround, HOUSE.fixtureBasinGround, HOUSE.fixtureMixerGround].map((fx) => {
            const [x, y] = isoProject(fx.center as [number, number, number], SCALE);
            return <ellipse key={fx.id} cx={x} cy={y} rx={fx.radius * SCALE * 0.9} ry={fx.radius * SCALE * 0.5} />;
          })}
        </g>
      </Wrap>
    </svg>
  );
}
