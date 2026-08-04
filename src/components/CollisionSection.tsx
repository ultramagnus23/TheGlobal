"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { BrandSplitFull } from "@/components/BrandSplitFull";
import { useCapabilityTier } from "@/lib/useCapabilityTier";

const CollisionCanvas = dynamic(() => import("@/components/CollisionCanvas").then((m) => m.CollisionCanvas), {
  ssr: false,
});

/**
 * The Collision: cool Astral particles and warm Somany particles rush
 * together and scatter, then the overlay fades to reveal the real
 * BrandSplitFull content, which is always present underneath (progressive
 * enhancement — the real links work with JS disabled, mid-animation, or
 * on the "reduced" capability tier, which skips the canvas outright).
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

  return (
    <div ref={ref} className="relative">
      <BrandSplitFull />
      {live && triggered && !done ? (
        <div
          className="absolute inset-0 z-10 flex bg-[#0c0a14] transition-opacity duration-500"
          style={{ opacity: done ? 0 : 1 }}
        >
          <CollisionCanvas onDone={() => setDone(true)} />
        </div>
      ) : null}
    </div>
  );
}
