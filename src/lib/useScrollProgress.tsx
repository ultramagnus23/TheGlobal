"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import Lenis from "lenis";
import { useMotionValue, useTransform, type MotionValue } from "framer-motion";

/**
 * Single source of truth for scroll state on the homepage. One Lenis
 * instance, one `scrollY` motion value, fed by exactly one listener (or, for
 * `prefers-reduced-motion`, one native `scroll` listener as a substitute for
 * Lenis's smoothing — never both at once). Every scroll-driven animation on
 * the page — the R3F hero, framer-motion fades, pinned sections — derives
 * from this value via `useTransform`/`useSectionProgress`. Nothing else may
 * register its own scroll listener.
 */

interface ScrollContextValue {
  scrollY: MotionValue<number>;
  reducedMotion: boolean;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const scrollY = useMotionValue(0);
  // Starts false on both server and client so the first client render
  // matches the server-rendered HTML; the real value lands one tick later
  // via the effect below, and updates live if the OS setting changes.
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      const onScroll = () => scrollY.set(window.scrollY);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({ autoRaf: true });
    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      scrollY.set(scroll);
    });
    return () => {
      lenis.destroy();
    };
  }, [scrollY, reducedMotion]);

  const value = useMemo(() => ({ scrollY, reducedMotion }), [scrollY, reducedMotion]);

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

function useScrollContext(): ScrollContextValue {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error("useScrollProgress hooks must be used within a <ScrollProvider>");
  }
  return ctx;
}

export function useRawScrollY(): MotionValue<number> {
  return useScrollContext().scrollY;
}

export function usePrefersReducedMotion(): boolean {
  return useScrollContext().reducedMotion;
}

/**
 * 0 -> 1 progress through a tall "track" element (e.g. a `380vh` pinned
 * section), derived purely from the single shared `scrollY` value. Re-reads
 * the track's geometry on resize only — never on scroll.
 */
export function useSectionProgress(trackRef: RefObject<HTMLElement | null>): MotionValue<number> {
  const { scrollY } = useScrollContext();
  const bounds = useRef({ top: 0, height: 1 });

  useEffect(() => {
    function measure() {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const currentScroll = window.scrollY;
      bounds.current = {
        top: rect.top + currentScroll,
        height: Math.max(el.offsetHeight - window.innerHeight, 1),
      };
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [trackRef]);

  return useTransform(scrollY, (y) => {
    const { top, height } = bounds.current;
    return Math.min(1, Math.max(0, (y - top) / height));
  });
}
