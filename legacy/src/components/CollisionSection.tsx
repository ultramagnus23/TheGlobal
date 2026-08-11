"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { BrandSplitFull } from "@/components/BrandSplitFull";
import { useCapabilityTier } from "@/lib/useCapabilityTier";

const CollisionCanvas = dynamic(() => import("@/components/CollisionCanvas").then((m) => m.CollisionCanvas), {
  ssr: false,
});

const MAX_OVERLAY_MS = 6000;

/**
 * The Collision: cool Astral particles and warm Somany particles rush
 * together and scatter across the real BrandSplitFull content, which
 * renders underneath and is visible the entire time — the canvas has no
 * background fill, only particles, and is `pointer-events-none`, so it is
 * structurally incapable of hiding or blocking the real links beneath it,
 * mid-animation or otherwise. (An earlier version put a solid-colour div
 * behind the canvas and only revealed the real content once a timed
 * animation reported done; any interruption to that timer left the
 * section looking completely empty — this version can't do that, and a
 * hard timeout unmounts the canvas regardless as a second safety net.)
 * Fires once, the first time the section scrolls into view.
 */
export function CollisionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [done, setDone] = useState(false);
  const tier = useCapabilityTier();
  const live = tier === "full";

  useEffect(() => {
    if (!live) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [live]);

  useEffect(() => {
    if (!triggered || done) return;
    const timeout = setTimeout(() => setDone(true), MAX_OVERLAY_MS);
    return () => clearTimeout(timeout);
  }, [triggered, done]);

  return (
    <div ref={ref} className="relative">
      <BrandSplitFull />
      {live && triggered && !done ? (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <CollisionCanvas onDone={() => setDone(true)} />
        </div>
      ) : null}
    </div>
  );
}
