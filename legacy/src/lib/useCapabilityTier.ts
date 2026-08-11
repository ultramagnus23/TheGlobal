"use client";

import { useEffect, useState } from "react";
import { detectCapabilityTier, type CapabilityTier } from "@/lib/capability";

/**
 * Starts "reduced" (matches server-rendered markup, avoids a hydration
 * mismatch) and upgrades to "full" on mount only if the device clears
 * every capability check. Components should render their static/video
 * fallback for "reduced" and only mount the live WebGL scene for "full".
 */
export function useCapabilityTier(): CapabilityTier {
  const [tier, setTier] = useState<CapabilityTier>("reduced");

  useEffect(() => {
    setTier(detectCapabilityTier());
  }, []);

  return tier;
}
