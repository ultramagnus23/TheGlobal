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
    // Under reduced motion, `.reveal` (globals.css) forces content to its
    // final opacity immediately via `!important`, ignoring the `is-visible`
    // gate below — but this component's `visible` state (and therefore the
    // background colour) was still waiting on a real scroll intersection.
    // That mismatch let text render at full opacity against the `from`
    // colour before the section ever scrolled into view, defeating the
    // "content never shown against a mid-crossfade background" invariant
    // this component documents. Settling immediately here keeps that
    // invariant true under reduced motion too.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // A section scrolling up from below the fold is caught by the BOTTOM
      // margin, not the top (top margin only matters for a target leaving
      // past the top edge, which doesn't apply here — an earlier version of
      // this fix changed the top margin and left the actual trigger timing
      // for incoming-from-below sections basically unchanged). A positive
      // bottom value extends the observed area below the real viewport, so
      // intersection fires while the section is still below the fold — set
      // to 1200px, comfortably more than the background-plus-content reveal
      // takes (400ms delay + 350ms transition each ≈ 750ms total) can cover
      // even at a fast flick-scroll speed. The old "-15%" bottom value did
      // the opposite — shrinking the observed area, triggering only once
      // already 15% visible — which combined with that ~750ms transition
      // meant any normal-to-fast scroll showed a plain, contentless colour
      // box for a real stretch of time: exactly the "empty" symptom
      // reported live.
      { rootMargin: "0px 0px 1200px 0px", threshold: 0 }
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
