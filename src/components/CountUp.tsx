"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up from 0 to the leading integer in `value` once it scrolls into
 * view, keeping any non-numeric prefix/suffix ("18+", "{{WAREHOUSE_SQFT}}")
 * static — a token with no leading digit renders as plain text with no
 * animation rather than guessing at a number that isn't there.
 */
export function CountUp({ value, durationMs = 1100 }: { value: string; durationMs?: number }) {
  const match = value.match(/^(\d+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(match ? "0" : value);

  useEffect(() => {
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(`${target}${suffix}`);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        function tick(now: number) {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(`${Math.round(eased * target)}${suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
