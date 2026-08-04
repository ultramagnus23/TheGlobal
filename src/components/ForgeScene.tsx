"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The Forge Sequence's WebGL layer: ~1400 particles start scattered through
 * a dark void (raw material chaos) and converge, driven by `progressRef`
 * (0-1, written by the parent's scroll handler, not this component's own
 * clock), into a grid that reads as a building facade — colour sweeping
 * from ember orange to structural white as they land. Two edged boxes
 * (Astral blue, left; Somany terracotta, right) solidify alongside it as
 * the literal anchors for the HTML hotspot links the parent overlays.
 *
 * No RAF loop of its own drives progress; only render() ticks every frame.
 * Never mounted under `prefers-reduced-motion` or the "reduced" capability
 * tier — see ForgeSequence, which renders a static frame instead.
 */
export function ForgeScene({ progressRef }: { progressRef: React.RefObject<number> }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const canvas = document.createElement("canvas");
    mount.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.6, 9.5);
    camera.lookAt(0, 1.2, 0);

    function size() {
      const w = mount!.clientWidth;
      const h = mount!.clientHeight;
      // updateStyle=true (the default; explicit here): sets the canvas's CSS
      // box to the logical (CSS) pixel size, keeping its drawing buffer at
      // devicePixelRatio for crispness. Omitting this leaves the canvas's
      // rendered box at its raw device-pixel width/height, which overflows
      // the viewport on any DPR > 1 device (confirmed on mobile: a 375px
      // viewport at DPR 2 produced a 750px-wide canvas box).
      renderer.setSize(w, h, true);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    size();
    window.addEventListener("resize", size);

    // --- Particle facade: a grid of points forming a simple tower shell ---
    const cols = 14;
    const rows = 18;
    const count = cols * rows;

    const startPositions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    const emberColor = new THREE.Color(0xd97a3a);
    const voidColor = new THREE.Color(0x151726);
    const structureColor = new THREE.Color(0xf7f5f0);

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tx = (c - (cols - 1) / 2) * 0.34;
        const ty = r * 0.24;
        const tz = (Math.random() - 0.5) * 0.12;

        const sx = (Math.random() - 0.5) * 9;
        const sy = Math.random() * 7 - 1;
        const sz = (Math.random() - 0.5) * 6 - 1;

        startPositions.set([sx, sy, sz], idx * 3);
        targetPositions.set([tx, ty, tz], idx * 3);
        positions.set([sx, sy, sz], idx * 3);

        const mix = Math.random();
        const c0 = emberColor.clone().lerp(voidColor, mix);
        colors.set([c0.r, c0.g, c0.b], idx * 3);

        seeds[idx] = Math.random();
        idx++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    points.position.set(0, -1.4, 0);
    scene.add(points);

    // --- Two anchor volumes: Astral (left) and Somany (right) ---
    const astralGeo = new THREE.BoxGeometry(1.1, 2.6, 1.1);
    const astralEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(astralGeo),
      new THREE.LineBasicMaterial({ color: 0x5c9fd6, transparent: true, opacity: 0 })
    );
    astralEdges.position.set(-2.6, -0.1, 0.4);

    const somanyGeo = new THREE.BoxGeometry(1.1, 2.6, 1.1);
    const somanyEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(somanyGeo),
      new THREE.LineBasicMaterial({ color: 0xd97a3a, transparent: true, opacity: 0 })
    );
    somanyEdges.position.set(2.6, -0.1, 0.4);

    scene.add(astralEdges, somanyEdges);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    function ease(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    let raf = 0;
    let disposed = false;
    function frame() {
      if (disposed) return;
      const p = Math.max(0, Math.min(1, progressRef.current ?? 0));
      const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
      const colAttr = geo.getAttribute("color") as THREE.BufferAttribute;

      for (let i = 0; i < count; i++) {
        // Stagger convergence per-particle so it reads as a settle, not a snap.
        const local = ease(Math.max(0, Math.min(1, (p - seeds[i] * 0.25) / 0.75)));
        const sx = startPositions[i * 3];
        const sy = startPositions[i * 3 + 1];
        const sz = startPositions[i * 3 + 2];
        const tx = targetPositions[i * 3];
        const ty = targetPositions[i * 3 + 1];
        const tz = targetPositions[i * 3 + 2];

        posAttr.setXYZ(i, sx + (tx - sx) * local, sy + (ty - sy) * local, sz + (tz - sz) * local);

        const c = emberColor.clone().lerp(voidColor, seeds[i]).lerp(structureColor, local);
        colAttr.setXYZ(i, c.r, c.g, c.b);
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      const anchorT = ease(Math.max(0, Math.min(1, (p - 0.55) / 0.45)));
      astralEdges.material.opacity = anchorT * 0.9;
      somanyEdges.material.opacity = anchorT * 0.9;

      camera.position.x = Math.sin(p * 0.4) * 0.6;
      camera.lookAt(0, 1.2 - p * 0.3, 0);

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
      mat.dispose();
      astralGeo.dispose();
      somanyGeo.dispose();
      astralEdges.material.dispose();
      somanyEdges.material.dispose();
      mount.removeChild(canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
