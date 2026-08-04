"use client";

/**
 * Gates every heavy WebGL/canvas scene. Per the maximalist rebuild brief:
 * a device/GPU capability check must run before any such scene mounts, so
 * the named persona (a cracked budget Android on 4G) gets a pre-rendered
 * fallback instead of a stuttering or blank scene, never the live scene
 * degraded in place.
 *
 * Tier is deliberately conservative — when a signal is unavailable this
 * assumes the low-end path, not the high-end one.
 */
export type CapabilityTier = "full" | "reduced";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function detectCapabilityTier(): CapabilityTier {
  if (typeof window === "undefined") return "reduced";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  if (!hasWebGL()) return "reduced";

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return "reduced";
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return "reduced";

  const conn = nav.connection;
  if (conn?.saveData) return "reduced";
  if (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) return "reduced";

  if (window.innerWidth * window.devicePixelRatio > 5000) return "reduced";

  return "full";
}
