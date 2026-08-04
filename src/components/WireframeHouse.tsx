"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Wireframe-to-solid house model for the hero, adapted from the client's
 * reference mockup. Client-only (mounted via next/dynamic with ssr:false in
 * Hero.tsx) and skipped entirely under prefers-reduced-motion — this is pure
 * decoration, not content, so there's nothing lost by not rendering it.
 */
export function WireframeHouse() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const mount = mountRef.current;
    const canvas = document.createElement("canvas");
    if (!mount) return;
    mount.appendChild(canvas);

    const stoneColor = 0xeae4d6;
    const astralColor = 0x5c8aa3;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 2.6, 8.4);
    camera.lookAt(0, 1.1, 0);

    function size() {
      const w = mount!.clientWidth;
      const h = mount!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    size();
    window.addEventListener("resize", size);

    const villa = new THREE.Group();

    const baseGeo = new THREE.BoxGeometry(4.2, 2.2, 3.2);
    const baseEdgesMat = new THREE.LineBasicMaterial({ color: stoneColor, transparent: true, opacity: 0 });
    const baseEdges = new THREE.LineSegments(new THREE.EdgesGeometry(baseGeo), baseEdgesMat);
    baseEdges.position.y = 1.1;
    const baseSolidMat = new THREE.MeshStandardMaterial({
      color: 0x1e1e18,
      metalness: 0.1,
      roughness: 0.85,
      transparent: true,
      opacity: 0,
    });
    const baseSolid = new THREE.Mesh(baseGeo, baseSolidMat);
    baseSolid.position.y = 1.1;

    const winGeo = new THREE.BoxGeometry(0.62, 0.82, 0.05);
    const windowEdges: THREE.LineSegments[] = [];
    const windowEdgesMats: THREE.LineBasicMaterial[] = [];
    [-1.35, -0.35, 0.65, 1.65].forEach((x) => {
      const mat = new THREE.LineBasicMaterial({ color: stoneColor, transparent: true, opacity: 0 });
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(winGeo), mat);
      e.position.set(x, 1.5, 1.63);
      windowEdges.push(e);
      windowEdgesMats.push(mat);
    });

    const roofGeo = new THREE.ConeGeometry(3.05, 1.3, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roofEdgesMat = new THREE.LineBasicMaterial({ color: stoneColor, transparent: true, opacity: 0 });
    const roofEdges = new THREE.LineSegments(new THREE.EdgesGeometry(roofGeo), roofEdgesMat);
    roofEdges.position.y = 2.85;
    const roofSolidMat = new THREE.MeshStandardMaterial({
      color: 0x2a241c,
      metalness: 0.05,
      roughness: 0.9,
      transparent: true,
      opacity: 0,
    });
    const roofSolid = new THREE.Mesh(roofGeo, roofSolidMat);
    roofSolid.position.y = 2.85;

    const pipePts = [
      new THREE.Vector3(-1.4, 0.05, 1.7),
      new THREE.Vector3(-1.4, 1.6, 1.7),
      new THREE.Vector3(-1.4, 1.6, -1.6),
      new THREE.Vector3(1.5, 1.6, -1.6),
    ];
    const pipeMat = new THREE.LineBasicMaterial({ color: astralColor, transparent: true, opacity: 0 });
    const pipe = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pipePts), pipeMat);

    villa.add(baseEdges, baseSolid, roofEdges, roofSolid, pipe, ...windowEdges);
    villa.rotation.y = -0.5;
    scene.add(villa);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 0.6);
    key.position.set(4, 6, 5);
    scene.add(key);

    let start: number | null = null;
    let raf = 0;
    const wireIn = 1400;
    const holdWire = 700;
    const solidIn = 1800;
    const rotateSpan = 10000;

    function ease(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(ts: number) {
      if (start === null) start = ts;
      const t = ts - start;

      const wireT = Math.min(1, t / wireIn);
      const wireOp = ease(wireT);
      baseEdgesMat.opacity = wireOp;
      roofEdgesMat.opacity = wireOp;
      windowEdgesMats.forEach((m) => (m.opacity = wireOp));
      pipeMat.opacity = wireOp * 0.9;

      const solidStart = wireIn + holdWire;
      if (t > solidStart) {
        const solidT = Math.min(1, (t - solidStart) / solidIn);
        const solidOp = ease(solidT);
        baseSolidMat.opacity = solidOp * 0.9;
        roofSolidMat.opacity = solidOp * 0.9;
        baseEdgesMat.opacity = wireOp * (1 - solidT * 0.4);
        roofEdgesMat.opacity = wireOp * (1 - solidT * 0.4);
      }

      const rotT = Math.min(1, t / rotateSpan);
      villa.rotation.y = -0.5 + ease(rotT) * 0.16;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      renderer.dispose();
      baseGeo.dispose();
      roofGeo.dispose();
      winGeo.dispose();
      baseEdgesMat.dispose();
      baseSolidMat.dispose();
      roofEdgesMat.dispose();
      roofSolidMat.dispose();
      pipeMat.dispose();
      windowEdgesMats.forEach((m) => m.dispose());
      mount.removeChild(canvas);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" aria-hidden="true" />;
}
