"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ColorRevealSectionProps {
  /** CSS colour value the section starts at, e.g. "var(--canvas-sunken)". */
  from: string;
  /** CSS colour value the section settles to once scrolled into view. */
  to: string;
  children: ReactNode;
  className?: string;
}

/**
 * Ambient scroll-linked background crossfade — the ONLY scroll effect on this
 * site. Deliberately not scroll-jacking: native scroll speed is untouched,
 * nothing pins, this only toggles a CSS transition once via IntersectionObserver.
 * Content is sequenced to fade in only after the background settles (see
 * `.reveal-delayed` in globals.css), so text is never shown mid-crossfade
 * against the wrong background — contrast ratios are never at risk.
 * Fully collapses to an instant, non-animated state under prefers-reduced-motion.
 *
 * Triggers on the section's leading edge crossing a fixed point near the
 * bottom of the viewport (rootMargin), not on a percentage of its own area
 * becoming visible (threshold). The area-based approach fires inconsistently
 * across sections of different heights — late and sluggish for tall ones,
 * near-instant for short ones — which reads as erratic rather than deliberate.
 * An edge trigger fires at a predictable moment regardless of section height.
 */
export function ColorRevealSection({ from, to, children, className }: ColorRevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        backgroundColor: visible ? to : from,
        transition: "background-color 400ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className={cn("reveal reveal-delayed", visible && "is-visible")}>{children}</div>
    </div>
  );
}
