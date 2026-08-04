"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/cn";

const AssemblyScene = dynamic(() => import("@/components/AssemblyScene").then((m) => m.AssemblyScene), {
  ssr: false,
});

const stages = [
  {
    num: "01",
    title: "The structure.",
    body: "Every building starts as geometry: a shell, a set of floors, a roof. Before a single material is chosen, the building already knows its shape.",
    from: 0,
  },
  {
    num: "02",
    title: "Water & drainage.",
    body: "CPVC, PVC and SWR systems thread through every wall: the part no one sees, and the part that can least afford to fail.",
    powered: { label: "Powered by Astral", brand: "astral" as const },
    from: 0.34,
  },
  {
    num: "03",
    title: "Surfaces & finish.",
    body: "Tiles, sanitaryware and bath fittings turn a structure into a place someone actually lives.",
    powered: { label: "Finished with Somany", brand: "somany" as const },
    from: 0.67,
  },
];

/**
 * Scroll-scrubbed build story: a tall (300vh) track with a sticky 3D house
 * on one side that assembles itself — foundation, then plumbing, then
 * roof/tiles — in lockstep with how far the reader has scrolled through the
 * text stages on the other side. Progress is pushed into a ref (not React
 * state) so the 60fps scroll handler never triggers a re-render; only the
 * discrete "which stage is active" transition re-renders for the copy
 * highlight and badge fades.
 */
export function AssemblyStory() {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [activeStage, setActiveStage] = useState(-1);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    const stage = v < 0.32 ? 0 : v < 0.65 ? 1 : 2;
    setActiveStage((prev) => (prev === stage ? prev : stage));
  });

  return (
    <div ref={trackRef} className="relative" style={{ height: reducedMotion ? undefined : "300vh" }}>
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16", !reducedMotion && "md:sticky md:top-0 md:h-screen md:items-center")}>
        <div className="relative order-2 md:order-1 h-[46vh] md:h-[62vh]">
          {reducedMotion ? (
            <div className="w-full h-full rounded-2xl bg-canvas-sunken flex items-center justify-center">
              <span className="text-eyebrow uppercase tracking-[0.1em] text-ink-tertiary">
                Foundation → plumbing → finish
              </span>
            </div>
          ) : (
            <AssemblyScene progressRef={progressRef} />
          )}

          <div
            className={cn(
              "absolute left-1/2 top-[18%] -translate-x-1/2 px-3.5 py-2 rounded-full text-eyebrow uppercase tracking-[0.1em] font-semibold border transition-all duration-500",
              activeStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            )}
            style={{ color: "var(--partner-glow, #6fa0bc)", borderColor: "rgba(111,160,188,0.4)", background: "rgba(14,13,10,0.55)" }}
          >
            Powered by Astral
          </div>
          <div
            className={cn(
              "absolute left-1/2 bottom-[14%] -translate-x-1/2 px-3.5 py-2 rounded-full text-eyebrow uppercase tracking-[0.1em] font-semibold border transition-all duration-500",
              activeStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            )}
            style={{ color: "var(--partner-glow, #d4b98a)", borderColor: "rgba(212,185,138,0.4)", background: "rgba(14,13,10,0.55)" }}
          >
            Finished with Somany
          </div>
        </div>

        <div className="order-1 md:order-2 flex flex-col justify-center gap-10 md:gap-14 py-4">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.num}
              className="space-y-3"
              animate={{ opacity: activeStage === i || reducedMotion ? 1 : 0.35 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <span className="font-display text-lg text-ink-tertiary block">{stage.num}</span>
              <h3 className="text-h3 font-semibold text-ink">{stage.title}</h3>
              <p className="text-body text-ink-secondary">{stage.body}</p>
              {stage.powered ? (
                <span
                  data-brand={stage.powered.brand}
                  className="inline-block mt-2 text-eyebrow uppercase tracking-[0.1em] font-semibold px-3 py-1.5 rounded-full border"
                  style={{ color: "var(--partner-text)", borderColor: "var(--partner)" }}
                >
                  {stage.powered.label}
                </span>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
