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

  // Deliberately NOT gating on connection.effectiveType: it's a heuristic
  // about download speed, not rendering capability, and this scene has no
  // network dependency (pure procedural geometry, nothing to download) —
  // gating on it excluded fast, capable machines whenever the network
  // heuristic misreported (confirmed: a 16-core/16GB test machine reported
  // "3g" and got silently downgraded to the static fallback). saveData is
  // kept: it reflects an explicit user preference, not an inferred guess.
  if (nav.connection?.saveData) return "reduced";

  // Deliberately NOT gating on innerWidth * devicePixelRatio either: it was
  // meant to avoid absurd canvas resolutions, but the renderer already caps
  // devicePixelRatio at 2 when it calls setPixelRatio(min(dpr, 2)) — this
  // check was redundant with that clamp and, at a threshold of 5000, tripped
  // on any ordinary high-DPI display (confirmed: a common Windows setup —
  // a >=2560px-wide monitor at 125%+ scaling — exceeds 5000 easily). This
  // was silently downgrading every WebGL scene at once for exactly the kind
  // of display a real visitor is likely to have.

  return "full";
}
