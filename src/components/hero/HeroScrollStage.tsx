"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useTransform } from "framer-motion";
import { Button } from "@/components/Button";
import { facts } from "@/content/facts";
import { useSectionProgress, usePrefersReducedMotion } from "@/lib/useScrollProgress";

// WebGL only ever loads client-side, and only after hydration — the headline
// below is real DOM, server-rendered, so it paints (and is the LCP element)
// whether or not the canvas has finished initializing.
const ParticleHero = dynamic(() => import("./ParticleHero").then((m) => m.ParticleHero), {
  ssr: false,
});

function useParticleCount() {
  const [count, setCount] = useState(1200);
  useEffect(() => {
    function update() {
      setCount(window.innerWidth < 768 ? 1200 : 4000);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

function EyebrowAndHeadline() {
  return (
    <>
      <p className="text-eyebrow uppercase tracking-[0.14em] font-semibold text-[color:var(--glaze)]">
        Rajasthan · Since {facts.brand.established}
      </p>
      <h1 className="mt-4 max-w-4xl text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight text-[color:var(--bone)]">
        Everything a building needs.
        <br />
        Already here.
      </h1>
      <p className="mt-4 max-w-xl text-body text-[color:var(--bone)]/80">
        Exclusive Somany distributor for Rajasthan. Trusted Astral partner. Standing warehouse
        inventory in Jaipur — not ordered in after your enquiry.
      </p>
    </>
  );
}

function CtaRow() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <Button
        href="/products"
        tier="primary"
        size="large"
        className="!bg-[color:var(--ember)] !border-[color:var(--ember)] hover:!bg-[color:var(--ember-hot)] hover:!border-[color:var(--ember-hot)]"
      >
        View Products
      </Button>
      <Button
        href={facts.primaryContact.phoneHref}
        tier="secondary"
        size="large"
        className="!text-[color:var(--bone)] !border-[color:var(--bone)]/50 hover:!bg-[color:var(--bone)]/10"
      >
        Call {facts.primaryContact.phoneDisplay}
      </Button>
    </div>
  );
}

/** Static hero, no canvas, no scroll-driven motion — the complete
 * `prefers-reduced-motion` experience, not an apology for one. */
function StaticHero() {
  return (
    <section className="theme-night relative">
      <div className="flex min-h-[80svh] flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <div className="flex flex-col items-center">
          <EyebrowAndHeadline />
        </div>
        <p className="max-w-2xl text-[clamp(1.375rem,2.6vw,2.25rem)] font-semibold leading-tight text-[color:var(--bone)]">
          We hold stock. That is the entire business model.
        </p>
        <CtaRow />
      </div>
    </section>
  );
}

export function HeroScrollStage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(trackRef);
  const reducedMotion = usePrefersReducedMotion();
  const particleCount = useParticleCount();

  const [emberRaw, setEmberRaw] = useState("");
  const [glazeRaw, setGlazeRaw] = useState("");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const style = getComputedStyle(el);
    setEmberRaw(style.getPropertyValue("--ember").trim());
    setGlazeRaw(style.getPropertyValue("--glaze").trim());
  }, []);

  const introOpacity = useTransform(progress, [0, 0.1], [1, 0]);
  const introY = useTransform(progress, [0, 0.12], [0, -24]);
  const closingOpacity = useTransform(progress, [0.86, 0.95], [0, 1]);
  const closingY = useTransform(progress, [0.86, 0.95], [16, 0]);

  if (reducedMotion) {
    return <StaticHero />;
  }

  return (
    <section
      ref={sectionRef}
      className="theme-night relative"
      aria-label="The Global — everything a building needs, already here"
    >
      <div ref={trackRef} className="relative h-[380vh]">
        <div className="sticky top-16 md:top-[72px] h-[calc(100svh-4rem)] overflow-hidden md:h-[calc(100svh-72px)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,var(--void-raised),var(--void))]" />

          <div className="absolute inset-0" aria-hidden="true">
            <ParticleHero
              progress={progress}
              count={particleCount}
              emberColor={emberRaw}
              glazeColor={glazeRaw}
            />
          </div>

          <motion.div
            style={{ opacity: introOpacity, y: introY }}
            className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center px-6 pt-[8vh] text-center sm:pt-[10vh]"
          >
            <EyebrowAndHeadline />
            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[color:var(--bone)]/50">
              Scroll to watch it come together
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: closingOpacity, y: closingY }}
            className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-6 px-6 pb-14 text-center sm:pb-20"
          >
            <p className="max-w-2xl text-[clamp(1.375rem,2.6vw,2.25rem)] font-semibold leading-tight text-[color:var(--bone)]">
              We hold stock. That is the entire business model.
            </p>
            <CtaRow />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
