"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The Forge Sequence's WebGL layer.
 *
 * Rebuilt after real user feedback that the hero looked "completely
 * blank" on open. Two root causes, both fixed here:
 *  1. Ambient spark particles used to lerp toward a near-black "void"
 *     colour that was almost identical to the page background, so half
 *     of them were effectively invisible at rest. Sparks now render with
 *     THREE.AdditiveBlending and never dip below a visible brightness
 *     floor — additive blending can only add light to the background, it
 *     structurally cannot vanish into it the way a dim opaque colour can.
 *  2. There was nothing recognisable on screen until the user scrolled.
 *     A ghost wireframe house is now visible from the very first frame
 *     (dim, incomplete) and pipes (cylinders, Astral blue) and tile chips
 *     (flat boxes, Somany terracotta) fly in from the chaos and visibly
 *     attach to it as `progress` advances, so "pipes and tiles becoming
 *     a house" is literal geometry, not an abstract particle grid.
 *
 * Also new: `pointer` (a ref updated by ForgeSequence's pointermove
 * listener, normalised -1..1) drives a subtle camera parallax so the
 * scene visibly reacts to the cursor even before any scrolling happens.
 *
 * No RAF loop of its own drives progress; only render() ticks every
 * frame. Never mounted under `prefers-reduced-motion` or the "reduced"
 * capability tier — see ForgeSequence, which renders a static frame
 * instead.
 */
export function ForgeScene({
  progressRef,
  pointerRef,
}: {
  progressRef: React.RefObject<number>;
  pointerRef: React.RefObject<{ x: number; y: number }>;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const canvas = document.createElement("canvas");
    mount.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    const baseCamPos = new THREE.Vector3(0, 2.0, 10.5);
    camera.position.copy(baseCamPos);
    camera.lookAt(0, 1.3, 0);

    function size() {
      const w = mount!.clientWidth;
      const h = mount!.clientHeight;
      renderer.setSize(w, h, true);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    size();
    window.addEventListener("resize", size);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xfff2e0, 0.6);
    key.position.set(4, 6, 5);
    scene.add(key);

    // --- Forge glow: a big soft additive gradient behind everything, so the
    // frame has real colour mass from the first paint instead of reading as
    // a mostly-empty dark canvas with a few thin lines on it. Built from a
    // canvas-generated radial-gradient texture (cheap, no asset download). ---
    function makeGlowTexture(hex: string) {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const ctx = c.getContext("2d")!;
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, hex);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(c);
    }
    const glowGroup = new THREE.Group();
    const glowSpecs: { tex: string; pos: [number, number, number]; scale: number }[] = [
      { tex: "rgba(217,122,63,0.55)", pos: [-2.2, 1.6, -3], scale: 9 },
      { tex: "rgba(92,159,214,0.5)", pos: [2.4, 1.2, -3.5], scale: 8 },
      { tex: "rgba(255,180,120,0.35)", pos: [0, 2.2, -4], scale: 11 },
    ];
    for (const g of glowSpecs) {
      const mat = new THREE.SpriteMaterial({ map: makeGlowTexture(g.tex), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(...g.pos);
      sprite.scale.set(g.scale, g.scale, 1);
      glowGroup.add(sprite);
    }
    scene.add(glowGroup);

    // --- The house: a ghost wireframe visible from frame one, solidifying
    // and gaining its roof/pipes/tiles as progress advances. Proportions
    // borrowed from AssemblyScene's house model for a consistent silhouette
    // language across the site. Solid low-opacity fill planes ride along
    // with the edge wireframe so the house reads as a volume, not just
    // outlines — pure edges left the frame looking too sparse. ---
    const stoneColor = 0xf2ede2;
    // Bumped from 0.3: at the old floor the wireframe read as barely-there
    // against the spark field, so the "pipes and tiles becoming a house"
    // story was legible only once heavily resolved — the house itself needs
    // to read clearly from frame one, not just glow around it.
    const houseMat = new THREE.LineBasicMaterial({ color: stoneColor, transparent: true, opacity: 0.55 });
    // Kept deliberately faint (opacity capped well below the wireframe/tiles/
    // pipes) — an earlier, more solid version of this fill read as a large
    // flat floating rectangle ("floating doors") rather than a house wall,
    // competing with the actual pipe/tile geometry that's supposed to be the
    // visible story. This is ambient volume shading now, not a distinct shape.
    const fillMat = new THREE.MeshStandardMaterial({ color: 0x2a2440, transparent: true, opacity: 0.08, roughness: 0.8, side: THREE.DoubleSide });

    function edgesOf(geo: THREE.BufferGeometry) {
      return new THREE.LineSegments(new THREE.EdgesGeometry(geo), houseMat.clone());
    }

    const houseGroup = new THREE.Group();
    const fillMeshes: THREE.Mesh[] = [];

    const foundationGeo = new THREE.BoxGeometry(3.4, 0.4, 2.6);
    const foundation = edgesOf(foundationGeo);
    const foundationFill = new THREE.Mesh(foundationGeo, fillMat.clone());
    foundation.position.y = foundationFill.position.y = 0.2;

    const wallsGeo = new THREE.BoxGeometry(3.2, 1.7, 2.4);
    const walls = edgesOf(wallsGeo);
    const wallsFill = new THREE.Mesh(wallsGeo, fillMat.clone());
    walls.position.y = wallsFill.position.y = 1.25;

    const roofGeo = new THREE.ConeGeometry(2.5, 1.15, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roof = edgesOf(roofGeo);
    const roofFill = new THREE.Mesh(roofGeo, fillMat.clone());
    roof.position.y = roofFill.position.y = 2.65;

    fillMeshes.push(foundationFill, wallsFill, roofFill);
    houseGroup.add(foundation, walls, roof, foundationFill, wallsFill, roofFill);
    houseGroup.position.y = -1.3;
    houseGroup.rotation.y = -0.5;
    scene.add(houseGroup);

    // Solid roof tiles (Somany) fill in as progress advances — the literal
    // "tiles coming together" the hero is meant to show, so kept dense and
    // large enough to read clearly, not as background texture.
    const tileGeo = new THREE.BoxGeometry(0.5, 0.06, 0.5);
    const tileMat = new THREE.MeshStandardMaterial({ color: 0xd9773f, roughness: 0.7, transparent: true, opacity: 0 });
    const tiles: THREE.Mesh[] = [];
    const tileStarts: THREE.Vector3[] = [];
    const tileTargets: THREE.Vector3[] = [];
    const tileCount = 16;
    for (let i = 0; i < tileCount; i++) {
      const t = new THREE.Mesh(tileGeo, tileMat.clone());
      const angle = (i / tileCount) * Math.PI * 2;
      const targetPos = new THREE.Vector3(Math.cos(angle) * 1.15, 2.35 + (i % 3) * 0.22, Math.sin(angle) * 0.75);
      const startPos = new THREE.Vector3((Math.random() - 0.5) * 8, Math.random() * 5 + 2, (Math.random() - 0.5) * 6 - 2);
      t.position.copy(startPos);
      tiles.push(t);
      tileStarts.push(startPos);
      tileTargets.push(targetPos);
      houseGroup.add(t);
    }

    // Pipe run (Astral) that snakes up and attaches to the wall as progress advances.
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x5c9fd6, metalness: 0.15, roughness: 0.5, transparent: true, opacity: 0 });
    const pipeSegs: THREE.Mesh[] = [];
    const pipeStarts: THREE.Vector3[] = [];
    const pipeTargets: { pos: THREE.Vector3; rot: THREE.Euler }[] = [];
    const pipeSpecs: { target: THREE.Vector3; rot: THREE.Euler; len: number }[] = [
      { target: new THREE.Vector3(-1.7, 0.3, 1.25), rot: new THREE.Euler(0, 0, Math.PI / 2), len: 1.0 },
      { target: new THREE.Vector3(-1.7, 1.1, 1.25), rot: new THREE.Euler(0, 0, 0), len: 1.4 },
      { target: new THREE.Vector3(-1.15, 1.75, 1.25), rot: new THREE.Euler(0, 0, Math.PI / 2), len: 1.0 },
    ];
    for (const spec of pipeSpecs) {
      const geo = new THREE.CylinderGeometry(0.13, 0.13, spec.len, 12);
      const mesh = new THREE.Mesh(geo, pipeMat.clone());
      const start = new THREE.Vector3((Math.random() - 0.5) * 8, Math.random() * 5 + 1, (Math.random() - 0.5) * 6 - 2);
      mesh.position.copy(start);
      pipeSegs.push(mesh);
      pipeStarts.push(start);
      pipeTargets.push({ pos: spec.target, rot: spec.rot });
      houseGroup.add(mesh);
    }

    // --- Ambient sparks: additive blending, never fades toward the
    // background colour, always reads as visible embers in motion. Count
    // and opacity cut back from an earlier pass that made the field read
    // as generic sparkly noise, burying the actual house/pipes/tiles
    // narrative — these are atmosphere now, not the main event. ---
    const sparkCount = 380;
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkColors = new Float32Array(sparkCount * 3);
    const sparkPhase = new Float32Array(sparkCount);
    const sparkRadius = new Float32Array(sparkCount);
    const emberA = new THREE.Color(0xff9a4d);
    const emberB = new THREE.Color(0x5cb8e8);
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 2.5 + Math.random() * 5;
      sparkPositions[i * 3] = Math.cos(angle) * r;
      sparkPositions[i * 3 + 1] = Math.random() * 6 - 1.5;
      sparkPositions[i * 3 + 2] = Math.sin(angle) * r * 0.6 - 1;
      const c = Math.random() > 0.7 ? emberB : emberA;
      sparkColors.set([c.r, c.g, c.b], i * 3);
      sparkPhase[i] = Math.random() * Math.PI * 2;
      sparkRadius[i] = r;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    sparkGeo.setAttribute("color", new THREE.BufferAttribute(sparkColors, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);

    function ease(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    let raf = 0;
    let disposed = false;
    let clock = 0;
    function frame() {
      if (disposed) return;
      clock += 1;
      const p = Math.max(0, Math.min(1, progressRef.current ?? 0));
      const pointer = pointerRef.current ?? { x: 0, y: 0 };

      // House solidifies from a clearly-visible ghost (never below 0.55) to fully solid.
      const solidT = ease(p);
      houseGroup.children.forEach((child) => {
        if (child instanceof THREE.LineSegments) {
          (child.material as THREE.LineBasicMaterial).opacity = 0.55 + solidT * 0.4;
        }
      });
      fillMeshes.forEach((mesh) => {
        (mesh.material as THREE.MeshStandardMaterial).opacity = 0.03 + solidT * 0.09;
      });

      // The house itself keeps a slow continuous turn, independent of scroll —
      // it's a living object being built, not a static model that only
      // reacts when the visitor scrolls.
      houseGroup.rotation.y = -0.5 + Math.sin(clock * 0.0015) * 0.12 + p * 0.22;

      // Tiles fly in and land between 20% and 70% scroll.
      const tileT = ease(Math.max(0, Math.min(1, (p - 0.2) / 0.5)));
      tiles.forEach((t, i) => {
        t.position.lerpVectors(tileStarts[i], tileTargets[i], tileT);
        (t.material as THREE.MeshStandardMaterial).opacity = tileT * 0.95;
      });

      // Pipes fly in and attach between 10% and 55% scroll.
      const pipeT = ease(Math.max(0, Math.min(1, (p - 0.1) / 0.45)));
      pipeSegs.forEach((seg, i) => {
        seg.position.lerpVectors(pipeStarts[i], pipeTargets[i].pos, pipeT);
        seg.rotation.set(
          pipeTargets[i].rot.x * pipeT,
          pipeTargets[i].rot.y * pipeT,
          pipeTargets[i].rot.z * pipeT
        );
        (seg.material as THREE.MeshStandardMaterial).opacity = pipeT * 0.95;
      });

      // Sparks: always visible (additive), orbit gently, drawn inward as the house resolves.
      const posAttr = sparkGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < sparkCount; i++) {
        const t = clock * 0.004 + sparkPhase[i];
        const pull = 1 - solidT * 0.55;
        const r = sparkRadius[i] * pull;
        const angle = t + sparkPhase[i];
        posAttr.setX(i, Math.cos(angle) * r);
        posAttr.setZ(i, Math.sin(angle) * r * 0.6 - 1);
        posAttr.setY(i, posAttr.getY(i) + Math.sin(t * 2) * 0.0015);
      }
      posAttr.needsUpdate = true;
      sparkMat.opacity = 0.5 - solidT * 0.25;

      // Cursor parallax: camera drifts toward the pointer, independent of scroll.
      const targetX = baseCamPos.x + pointer.x * 0.9;
      const targetY = baseCamPos.y + pointer.y * 0.5;
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
      camera.lookAt(pointer.x * -0.3, 1.3 - p * 0.25, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      renderer.dispose();
      foundationGeo.dispose();
      wallsGeo.dispose();
      roofGeo.dispose();
      houseMat.dispose();
      fillMat.dispose();
      fillMeshes.forEach((m) => (m.material as THREE.Material).dispose());
      tileGeo.dispose();
      tileMat.dispose();
      pipeMat.dispose();
      pipeSegs.forEach((s) => s.geometry.dispose());
      glowGroup.children.forEach((sprite) => {
        const spr = sprite as THREE.Sprite;
        (spr.material as THREE.SpriteMaterial).map?.dispose();
        spr.material.dispose();
      });
      sparkGeo.dispose();
      sparkMat.dispose();
      mount.removeChild(canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
