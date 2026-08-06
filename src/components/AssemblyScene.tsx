"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Sticky, scroll-scrubbed companion to AssemblyStory: a house model that
 * builds itself in three passes — foundation drops in, walls/pipe rise,
 * roof/tiles finish — driven directly by `progress` (0–1, the fraction of
 * the story section that has scrolled past), not by its own clock. No RAF
 * loop of its own; the parent's scroll handler calls `render(progress)`.
 * Client-only, skipped under prefers-reduced-motion (parent doesn't mount it).
 */
export function AssemblyScene({ progressRef }: { progressRef: React.RefObject<number> }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const canvas = document.createElement("canvas");
    mount.appendChild(canvas);

    const stoneColor = 0xeae4d6;
    const astralColor = 0x5c8aa3;
    const somanyColor = 0xb99a6b;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(3.4, 2.5, 6.2);
    camera.lookAt(0, 1.1, 0);

    function size() {
      const w = mount!.clientWidth;
      const h = mount!.clientHeight;
      // updateStyle=true: without it the canvas's CSS box renders at its raw
      // device-pixel width/height rather than the logical size, overflowing
      // the viewport on any DPR > 1 device (confirmed on mobile).
      renderer.setSize(w, h, true);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    size();
    window.addEventListener("resize", size);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 0.55);
    key.position.set(4, 6, 4);
    scene.add(key);

    const lineMat = new THREE.LineBasicMaterial({ color: stoneColor, transparent: true, opacity: 0.9 });
    function edgesOf(geo: THREE.BufferGeometry) {
      return new THREE.LineSegments(new THREE.EdgesGeometry(geo), lineMat.clone());
    }

    const group = new THREE.Group();

    const foundationGeo = new THREE.BoxGeometry(3.6, 0.5, 2.8);
    const foundation = edgesOf(foundationGeo);
    const foundationRestY = 0.25;

    const wallsGeo = new THREE.BoxGeometry(3.4, 1.6, 2.6);
    const walls = edgesOf(wallsGeo);
    const wallsRestY = 1.3;

    const winGeo = new THREE.BoxGeometry(0.5, 0.6, 0.04);
    const windows = new THREE.Group();
    [-1.05, -0.3, 0.45, 1.2].forEach((x) => {
      const w = edgesOf(winGeo);
      w.position.set(x, 0, 1.31);
      windows.add(w);
    });
    windows.position.y = wallsRestY;

    const roofGeo = new THREE.ConeGeometry(2.6, 1.1, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roof = edgesOf(roofGeo);
    const roofRestY = 2.65;

    const chimneyGeo = new THREE.BoxGeometry(0.24, 0.7, 0.24);
    const chimney = edgesOf(chimneyGeo);
    const chimneyRestY = 3.35;
    chimney.position.set(0.9, chimneyRestY, -0.6);

    const pipeGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.1, -0.7, 1.0),
      new THREE.Vector3(-1.1, 0.7, 1.0),
      new THREE.Vector3(-1.1, 0.7, -1.0),
      new THREE.Vector3(1.1, 0.7, -1.0),
    ]);
    const pipe = new THREE.Line(pipeGeo, new THREE.LineBasicMaterial({ color: astralColor, transparent: true, opacity: 0 }));
    pipe.position.y = wallsRestY;

    const tileGroup = new THREE.Group();
    const tileMat = new THREE.MeshStandardMaterial({ color: somanyColor, transparent: true, opacity: 0, roughness: 0.7 });
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        const t = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.04, 0.62), tileMat);
        t.position.set(-0.7 + i * 0.72, 0.27, -0.36 + j * 0.72);
        tileGroup.add(t);
      }
    }

    group.add(foundation, walls, windows, roof, chimney, pipe, tileGroup);
    group.rotation.y = -0.55;
    scene.add(group);

    function ease(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    let raf = 0;
    let disposed = false;
    function frame() {
      if (disposed) return;
      const p = Math.max(0, Math.min(1, progressRef.current ?? 0));

      // Stage 0 -> 1: foundation settles, walls/windows/pipe rise in.
      const structureT = ease(Math.min(1, p / 0.45));
      // Stage 1 -> 2: pipe fully appears through the walls.
      const plumbingT = ease(Math.min(1, Math.max(0, (p - 0.3) / 0.35)));
      // Stage 2 -> 3: roof settles, tiles lay down.
      const finishT = ease(Math.min(1, Math.max(0, (p - 0.6) / 0.4)));

      foundation.position.y = foundationRestY - (1 - structureT) * 1.4;
      walls.position.y = wallsRestY + (1 - structureT) * 1.6;
      windows.position.y = wallsRestY + (1 - structureT) * 1.6;
      roof.position.y = roofRestY + (1 - finishT) * 1.8;
      chimney.position.y = chimneyRestY + (1 - finishT) * 1.8;

      pipe.material.opacity = plumbingT * 0.95;
      tileMat.opacity = finishT * 0.95;

      const roofOp = finishT > 0.02 || structureT > 0.02 ? 1 : structureT;
      (roof.material as THREE.LineBasicMaterial).opacity = Math.max(0.15, structureT);
      (chimney.material as THREE.LineBasicMaterial).opacity = Math.max(0.15, structureT);
      void roofOp;

      group.rotation.y = -0.55 + p * 0.22;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      renderer.dispose();
      [foundationGeo, wallsGeo, winGeo, roofGeo, chimneyGeo, pipeGeo].forEach((g) => g.dispose());
      tileMat.dispose();
      lineMat.dispose();
      mount.removeChild(canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className="w-full h-full" aria-hidden="true" />;
}
