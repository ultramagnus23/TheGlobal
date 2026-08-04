"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero visual: a stacked tile slab + CPVC pipe fitting, wireframe-drawing in
 * then solidifying while slowly rotating — replaces an earlier generic house
 * model with something that reads immediately as "tiles and pipes," i.e. the
 * two actual divisions. Fewer, simpler primitives than a house model (one
 * tile stack, one pipe run) for a lighter render.
 * Client-only, mounted via HeroVisual's dynamic import, skipped entirely
 * under prefers-reduced-motion.
 */
export function ProductAssembly() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const mount = mountRef.current;
    if (!mount) return;
    const canvas = document.createElement("canvas");
    mount.appendChild(canvas);

    const stoneColor = 0xeae4d6;
    const brassColor = 0x9c7a4f;
    const astralColor = 0x5c8aa3;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 2.2, 8.2);
    camera.lookAt(0, 0.9, 0);

    function size() {
      const w = mount!.clientWidth;
      const h = mount!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    size();
    window.addEventListener("resize", size);

    const group = new THREE.Group();

    // Tile stack — three slabs, slightly offset, reading as "Somany"
    const tileGeo = new THREE.BoxGeometry(2.6, 0.14, 2.6);
    const tileEdgesMat = new THREE.LineBasicMaterial({ color: stoneColor, transparent: true, opacity: 0 });
    const tileSolidMat = new THREE.MeshStandardMaterial({
      color: 0x2a241c,
      metalness: 0.05,
      roughness: 0.7,
      transparent: true,
      opacity: 0,
    });
    const tiles: THREE.LineSegments[] = [];
    const tileSolids: THREE.Mesh[] = [];
    [0, 0.22, 0.44].forEach((y, i) => {
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(tileGeo), tileEdgesMat.clone());
      edges.position.set(-0.15 * i, y, 0.1 * i);
      const solid = new THREE.Mesh(tileGeo, tileSolidMat.clone());
      solid.position.copy(edges.position);
      tiles.push(edges);
      tileSolids.push(solid);
      group.add(edges, solid);
    });

    // Pipe run — a vertical CPVC-style pipe with an elbow, reading as "Astral"
    const pipeGeo = new THREE.CylinderGeometry(0.24, 0.24, 2.2, 16, 1, true);
    const pipeEdgesMat = new THREE.LineBasicMaterial({ color: astralColor, transparent: true, opacity: 0 });
    const pipeEdges = new THREE.LineSegments(new THREE.EdgesGeometry(pipeGeo), pipeEdgesMat);
    pipeEdges.position.set(2.1, 1.6, -0.4);
    const pipeSolidMat = new THREE.MeshStandardMaterial({
      color: astralColor,
      metalness: 0.1,
      roughness: 0.6,
      transparent: true,
      opacity: 0,
    });
    const pipeSolid = new THREE.Mesh(pipeGeo, pipeSolidMat);
    pipeSolid.position.copy(pipeEdges.position);

    const elbowGeo = new THREE.SphereGeometry(0.3, 12, 12);
    const elbowEdgesMat = new THREE.LineBasicMaterial({ color: astralColor, transparent: true, opacity: 0 });
    const elbowEdges = new THREE.LineSegments(new THREE.EdgesGeometry(elbowGeo), elbowEdgesMat);
    elbowEdges.position.set(2.1, 0.5, -0.4);
    const elbowSolidMat = new THREE.MeshStandardMaterial({
      color: astralColor,
      metalness: 0.1,
      roughness: 0.6,
      transparent: true,
      opacity: 0,
    });
    const elbowSolid = new THREE.Mesh(elbowGeo, elbowSolidMat);
    elbowSolid.position.copy(elbowEdges.position);

    group.add(pipeEdges, pipeSolid, elbowEdges, elbowSolid);

    // A thin brass line connecting the two — "one distributor, both divisions"
    const linkPts = [new THREE.Vector3(0.5, 0.44, 0), new THREE.Vector3(1.8, 0.6, -0.3)];
    const linkMat = new THREE.LineBasicMaterial({ color: brassColor, transparent: true, opacity: 0 });
    const link = new THREE.Line(new THREE.BufferGeometry().setFromPoints(linkPts), linkMat);
    group.add(link);

    group.rotation.y = -0.4;
    scene.add(group);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 0.55);
    key.position.set(4, 6, 5);
    scene.add(key);

    let start: number | null = null;
    let raf = 0;
    const wireIn = 1200;
    const holdWire = 500;
    const solidIn = 1400;
    const rotateSpan = 9000;

    function ease(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(ts: number) {
      if (start === null) start = ts;
      const t = ts - start;

      const wireT = Math.min(1, t / wireIn);
      const wireOp = ease(wireT);
      tiles.forEach((e) => ((e.material as THREE.LineBasicMaterial).opacity = wireOp));
      pipeEdgesMat.opacity = wireOp;
      elbowEdgesMat.opacity = wireOp;
      linkMat.opacity = wireOp * 0.8;

      const solidStart = wireIn + holdWire;
      if (t > solidStart) {
        const solidT = Math.min(1, (t - solidStart) / solidIn);
        const solidOp = ease(solidT);
        tileSolids.forEach((s) => ((s.material as THREE.MeshStandardMaterial).opacity = solidOp * 0.92));
        pipeSolidMat.opacity = solidOp * 0.92;
        elbowSolidMat.opacity = solidOp * 0.92;
        const fade = wireOp * (1 - solidT * 0.4);
        tiles.forEach((e) => ((e.material as THREE.LineBasicMaterial).opacity = fade));
        pipeEdgesMat.opacity = fade;
        elbowEdgesMat.opacity = fade;
      }

      const rotT = Math.min(1, t / rotateSpan);
      group.rotation.y = -0.4 + ease(rotT) * 0.14;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      renderer.dispose();
      tileGeo.dispose();
      pipeGeo.dispose();
      elbowGeo.dispose();
      tileEdgesMat.dispose();
      tileSolidMat.dispose();
      pipeEdgesMat.dispose();
      pipeSolidMat.dispose();
      elbowEdgesMat.dispose();
      elbowSolidMat.dispose();
      linkMat.dispose();
      mount.removeChild(canvas);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" aria-hidden="true" />;
}
