"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { Button } from "@/components/Button";
import { AssemblyHouseSVG } from "@/components/AssemblyHouseSVG";
import { detectAssemblyCapability, type AssemblyCapability } from "@/lib/capability";
import { COHORT_WINDOW, COHORT } from "@/components/ParticleAssemblyScene";
import { facts } from "@/content/facts";
import { cn } from "@/lib/cn";

const ParticleAssemblyScene = dynamic(
  () => import("@/components/ParticleAssemblyScene").then((m) => m.ParticleAssemblyScene),
  { ssr: false }
);

const TRACK_VH = 380; // within the brief's 350-400vh range
const BEAT_COUNT = 5; // Arrival, Pipes, Tiles, Fixtures, Reveal — for mobile tap-through

function cohortProgressFrom(overall: number) {
  const of = (id: number) => {
    const [start, end] = COHORT_WINDOW[id];
    return Math.max(0, Math.min(1, (overall - start) / (end - start)));
  };
  return {
    structure: of(COHORT.structure),
    pipes: of(COHORT.pipes),
    tiles: of(COHORT.tiles),
    fixtures: of(COHORT.fixtures),
  };
}

/**
 * "The Materials Assemble" — the homepage hero. Routes to one of four
 * complete experiences based on `detectAssemblyCapability()`, per the
 * brief's fallback ladder (Part 4.2): full WebGL, no-WebGL/weak-GPU SVG
 * stroke-draw, prefers-reduced-motion static reveal, or mobile tap-through.
 * Every tier shows the real house SVG, the same two system links, and the
 * same closing line — no information is exclusive to the live WebGL path.
 */
export function ParticleAssemblyHero() {
  const [capability, setCapability] = useState<AssemblyCapability | null>(null);

  // A capability check that passed can still be followed by the renderer
  // itself failing to construct, or the GL context being lost mid-session
  // (a real driver/GPU failure, not a hypothetical — hit directly in this
  // project's own dev session). Either one flips this and the component
  // falls back to the no-WebGL tier instead of leaving a dead canvas up.
  const [runtimeError, setRuntimeError] = useState(false);

  useEffect(() => {
    setCapability(detectAssemblyCapability());
  }, []);

  // Capability not yet resolved (first client paint) — render the static
  // tier so there is never a blank frame while detection runs.
  if (!capability) return <StaticReveal />;
  if (capability.prefersReducedMotion) return <StaticReveal />;
  if (!capability.hasWebGL || runtimeError) return <NoWebglFallback />;
  if (capability.isMobileLike)
    return <MobileTapThrough tier={capability.deviceTier} onWebglError={() => setRuntimeError(true)} />;
  return <ScrollDrivenAssembly tier={capability.deviceTier} onWebglError={() => setRuntimeError(true)} />;
}

function HeroCopy({ show }: { show: boolean }) {
  return (
    <div
      className={cn(
        "relative z-10 flex flex-col items-center text-center px-6 pointer-events-none transition-opacity duration-700",
        show ? "opacity-100" : "opacity-0"
      )}
    >
      <h1 className="font-sans font-black tracking-tight text-[var(--bone)] leading-[0.95] text-[11vw] sm:text-[8vw] md:text-[5.5vw]">
        Everything a building needs.
        <br />
        Already here.
      </h1>
      <p className="text-lead text-[var(--bone)]/70 max-w-[34em] mx-auto mt-6 pointer-events-auto">
        Astral pipes and Somany tiles, held in stock in Jaipur — since {facts.brand.established}.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 pointer-events-auto">
        <Button href="/products" tier="primary" size="large" className="!bg-[var(--bone)] !text-[var(--void)] !border-[var(--bone)]">
          View Products
        </Button>
        <Button
          href={facts.primaryContact.phoneHref}
          tier="secondary"
          size="large"
          className="!text-[var(--bone)] !border-[var(--bone)]/70 hover:!bg-[var(--bone)]/10"
        >
          Call {facts.primaryContact.phoneDisplay}
        </Button>
      </div>
    </div>
  );
}

function ClosingLine({ show }: { show: boolean }) {
  return (
    <p
      className={cn(
        "font-display text-h2 md:text-[3vw] font-semibold text-[var(--bone)] text-center max-w-[16ch] transition-all duration-700",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      )}
    >
      We hold stock. That is the entire business model.
    </p>
  );
}

/** Full desktop experience: Lenis-smoothed scroll drives a 380vh track. */
function ScrollDrivenAssembly({ tier, onWebglError }: { tier: "full" | "reduced"; onWebglError: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const overallProgressRef = useRef(0);
  const cohortProgressRef = useRef(cohortProgressFrom(0));
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const [introVisible, setIntroVisible] = useState(true);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ smoothWheel: true, lerp: 0.1 });
    let raf = 0;
    function loop(time: number) {
      lenis.raf(time);
      const track = trackRef.current;
      if (track) {
        const rect = track.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const progressed = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
        overallProgressRef.current = progressed;
        cohortProgressRef.current = cohortProgressFrom(progressed);
        setIntroVisible((prev) => {
          const next = progressed < 0.06;
          return prev === next ? prev : next;
        });
        setResolved((prev) => {
          const next = progressed > 0.86;
          return prev === next ? prev : next;
        });
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    function onPointerMove(e: PointerEvent) {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
        active: true,
      };
    }
    function onPointerLeave() {
      pointerRef.current.active = false;
    }
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div ref={trackRef} className="relative" style={{ height: `${TRACK_VH}vh` }}>
      <section
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "var(--void)" }}
      >
        <ParticleAssemblyScene tier={tier} cohortProgressRef={cohortProgressRef} pointerRef={pointerRef} onError={onWebglError} />
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <AssemblyHouseSVG
            className={cn("max-h-[70vh] max-w-[90vw] transition-opacity duration-700", resolved ? "opacity-100" : "opacity-0")}
          />
        </div>
        <HeroCopy show={introVisible} />
        <div className="absolute z-10 bottom-[8%] left-1/2 -translate-x-1/2">
          <ClosingLine show={resolved} />
        </div>
        <div
          aria-hidden="true"
          className={cn(
            "absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[var(--bone)]/50 transition-opacity duration-500",
            introVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <span className="text-eyebrow uppercase tracking-[0.16em]">Scroll</span>
          <span className="w-px h-8 bg-gradient-to-b from-[var(--bone)]/50 to-transparent scroll-cue-stem" />
        </div>
      </section>
    </div>
  );
}

/** No-WebGL / weak-GPU: the same house, stroke-drawn on rather than particle-assembled. */
function NoWebglFallback() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[760px] py-24 flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ background: "var(--void)" }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-10 pointer-events-none">
        <AssemblyHouseSVG
          interactive={false}
          className={cn("assembly-stroke-draw max-h-[60vh] max-w-[90vw]", drawn && "is-drawn")}
        />
      </div>
      <HeroCopy show />
      <div className="mt-10">
        <ClosingLine show={drawn} />
      </div>
    </section>
  );
}

/** prefers-reduced-motion: the finished house, immediately, fully linked. */
function StaticReveal() {
  return (
    <section
      className="relative min-h-[760px] py-24 flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ background: "var(--void)" }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-10">
        <AssemblyHouseSVG className="max-h-[60vh] max-w-[90vw] opacity-100" />
      </div>
      <HeroCopy show />
      <div className="mt-10">
        <ClosingLine show />
      </div>
    </section>
  );
}

const BEAT_LABELS = ["Dust", "Astral pipes", "Somany tiles", "Fixtures", "The house"];

/** Mobile: full particle system at the reduced tier, advanced by tap rather
 * than a long scrub-scroll, which the brief calls out as miserable on a
 * short phone viewport. */
function MobileTapThrough({ tier, onWebglError }: { tier: "full" | "reduced"; onWebglError: () => void }) {
  const [beat, setBeat] = useState(0);
  const cohortProgressRef = useRef(cohortProgressFrom(0));
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const overall = beat / (BEAT_COUNT - 1);

  useEffect(() => {
    cohortProgressRef.current = cohortProgressFrom(overall);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat]);

  const resolved = beat === BEAT_COUNT - 1;

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 overflow-hidden" style={{ background: "var(--void)" }}>
      <ParticleAssemblyScene tier={tier} cohortProgressRef={cohortProgressRef} pointerRef={pointerRef} onError={onWebglError} />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <AssemblyHouseSVG className={cn("max-h-[55vh] max-w-[92vw] transition-opacity duration-700", resolved ? "opacity-100" : "opacity-0")} />
      </div>
      <HeroCopy show={beat === 0} />
      {resolved ? <ClosingLine show /> : null}

      <div className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        {!resolved ? (
          <button
            type="button"
            onClick={() => setBeat((b) => Math.min(BEAT_COUNT - 1, b + 1))}
            className="min-h-14 px-6 rounded-xl font-semibold bg-[var(--bone)] text-[var(--void)]"
          >
            Assemble: {BEAT_LABELS[beat + 1]} ▸
          </button>
        ) : (
          <Link href="/products" className="min-h-14 px-6 flex items-center rounded-xl font-semibold bg-[var(--bone)] text-[var(--void)]">
            View Products
          </Link>
        )}
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: BEAT_COUNT }).map((_, i) => (
            <span
              key={i}
              className={cn("w-6 h-1 rounded-full transition-colors", i <= beat ? "bg-[var(--ember)]" : "bg-[var(--bone)]/25")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
