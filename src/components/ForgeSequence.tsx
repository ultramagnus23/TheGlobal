"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/Button";
import { useCapabilityTier } from "@/lib/useCapabilityTier";
import { facts } from "@/content/facts";
import { cn } from "@/lib/cn";

const ForgeScene = dynamic(() => import("@/components/ForgeScene").then((m) => m.ForgeScene), { ssr: false });

/**
 * Homepage hero. A ghost wireframe house is visible from the very first
 * frame (never blank), with real pipe (cylinder, Astral blue) and tile
 * (flat box, Somany terracotta) geometry flying in from scattered chaos
 * and visibly attaching to it as the visitor scrolls a 300vh track;
 * ambient ember/spark particles use additive blending so they never fade
 * into the background the way a dim opaque colour can. The camera also
 * drifts toward the cursor independent of scroll (see `pointer`), so the
 * scene visibly reacts before the visitor scrolls at all. Two anchor
 * points solidify at the end as the home for the Astral/Somany hotspot
 * links, real `Link` components layered over the canvas rather than
 * WebGL-picked meshes, so they stay keyboard- and screen-reader-reachable
 * regardless of what the scene is doing.
 *
 * Below the "full" capability tier (see useCapabilityTier: no WebGL,
 * reduced-motion, low memory/CPU, save-data, or a slow connection), skips
 * the canvas entirely and renders a static SVG of the same ghost house
 * with the same copy and the same two hotspot links, so nobody on that
 * path sees an empty gradient either.
 */
export function ForgeSequence() {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [resolved, setResolved] = useState(false);
  const tier = useCapabilityTier();
  const live = tier === "full";

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    const isResolved = v > 0.72;
    setResolved((prev) => (prev === isResolved ? prev : isResolved));
  });

  useEffect(() => {
    if (!live) return;
    function onMove(e: PointerEvent) {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [live]);

  const introOpacity = useTransform(scrollYProgress, [0, 0.18], live ? [1, 0] : [1, 1]);
  const introY = useTransform(scrollYProgress, [0, 0.3], live ? [0, -40] : [0, 0]);

  return (
    <div ref={trackRef} className="relative" style={{ height: live ? "300vh" : undefined }}>
      <section
        className={cn(
          "relative overflow-hidden flex flex-col items-center justify-center text-center px-6",
          live ? "sticky top-0 h-screen" : "min-h-[760px] py-24"
        )}
        style={{ background: "radial-gradient(ellipse at 50% 30%, #1f1a2e, #0c0a14 70%)" }}
      >
        {live ? (
          <ForgeScene progressRef={progressRef} pointerRef={pointerRef} />
        ) : (
          <GhostHouseStatic />
        )}

        <motion.div
          style={live ? { opacity: introOpacity, y: introY } : undefined}
          className="relative z-10 flex flex-col items-center pointer-events-none"
        >
          <p className="text-eyebrow uppercase tracking-[0.15em] font-semibold text-white/60">
            Rajasthan · Since {facts.brand.established}
          </p>
          <h1 className="font-sans font-black tracking-tight text-white mt-4 leading-[0.95] text-[13vw] sm:text-[9vw] md:text-[6.5vw]">
            Raw to
            <br />
            structure.
          </h1>
          <p className="text-lead text-white/70 max-w-[34em] mx-auto mt-6 pointer-events-auto">
            Astral pipes and Somany tiles, held in stock in Jaipur, not ordered in after you ask.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 pointer-events-auto">
            <Button href="/products" tier="primary" size="large" className="!bg-white !text-[#151726] !border-white">
              View Products
            </Button>
            <Button
              href={facts.primaryContact.phoneHref}
              tier="secondary"
              size="large"
              className="!text-white !border-white/70 hover:!bg-white/10"
            >
              Call {facts.primaryContact.phoneDisplay}
            </Button>
          </div>
        </motion.div>

        <div
          className={cn(
            "absolute z-20 left-1/2 -translate-x-1/2 transition-all duration-700",
            resolved || !live ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
          )}
          style={{ bottom: live ? "8%" : undefined, position: live ? "absolute" : "static", marginTop: live ? undefined : "3rem" }}
        >
          <p className="font-display text-h2 md:text-[3.4vw] font-semibold text-white text-center max-w-[16ch]">
            We hold stock. That is the entire business model.
          </p>
        </div>

        {/* Hotspots: real Link components anchored to the two resolved volumes, not WebGL-picked meshes */}
        <Link
          href="/astral"
          className={cn(
            "absolute z-20 flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border transition-all duration-700",
            live ? "left-[30%] top-1/2 -translate-y-1/2" : "left-6 bottom-6",
            resolved || !live ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          style={{ borderColor: "rgba(92,159,214,0.5)", background: "rgba(12,10,20,0.65)" }}
        >
          <span className="text-eyebrow uppercase tracking-[0.1em] font-semibold" style={{ color: "#8fc1e8" }}>
            Astral
          </span>
          <span className="text-sm text-white/70">Pipes &amp; plumbing</span>
        </Link>
        <Link
          href="/somany"
          className={cn(
            "absolute z-20 flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border transition-all duration-700",
            live ? "right-[30%] top-1/2 -translate-y-1/2" : "right-6 bottom-6",
            resolved || !live ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          style={{ borderColor: "rgba(217,122,58,0.5)", background: "rgba(12,10,20,0.65)" }}
        >
          <span className="text-eyebrow uppercase tracking-[0.1em] font-semibold" style={{ color: "#e8a878" }}>
            Somany
          </span>
          <span className="text-sm text-white/70">Tiles &amp; sanitaryware</span>
        </Link>

        {live ? (
          <div
            aria-hidden="true"
            className={cn(
              "absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50 transition-opacity duration-500",
              resolved ? "opacity-0" : "opacity-100"
            )}
          >
            <span className="text-eyebrow uppercase tracking-[0.16em]">Scroll</span>
            <span className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent scroll-cue-stem" />
          </div>
        ) : null}
      </section>
    </div>
  );
}

/**
 * Static-tier fallback: the same ghost-house language as ForgeScene, drawn
 * once as inline SVG instead of animated. Used whenever the live WebGL
 * scene is skipped (reduced motion, low capability), so that path never
 * shows a plain gradient with nothing recognisable on it.
 */
function GhostHouseStatic() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 400 300" className="w-full max-w-2xl h-auto opacity-80" fill="none">
        <polyline
          points="60,180 60,110 200,30 340,110 340,180"
          stroke="#f2ede2"
          strokeOpacity="0.5"
          strokeWidth="2"
        />
        <rect x="60" y="180" width="280" height="16" stroke="#f2ede2" strokeOpacity="0.5" strokeWidth="2" />
        <line x1="140" y1="120" x2="140" y2="60" stroke="#5c9fd6" strokeWidth="4" strokeLinecap="round" />
        <line x1="140" y1="120" x2="180" y2="120" stroke="#5c9fd6" strokeWidth="4" strokeLinecap="round" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect
            key={i}
            x={90 + (i % 3) * 75}
            y={i < 3 ? 40 : 65}
            width="28"
            height="10"
            fill="#d9773f"
            opacity="0.75"
          />
        ))}
      </svg>
    </div>
  );
}
