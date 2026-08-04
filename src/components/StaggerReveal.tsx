"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay step between consecutive items, in ms. */
  step?: number;
  as?: "div" | "ul";
}

/**
 * Wraps a list of sibling items and reveals them in sequence as the group
 * scrolls into view, instead of all at once — same transform/opacity
 * language as the global `.reveal` class, just staggered per item so rows
 * read as a deliberate cascade rather than a single block appearing.
 * Fires once via IntersectionObserver; fully inert under reduced motion
 * (handled by the shared `.reveal` rules in globals.css).
 */
export function StaggerReveal({ children, className, step = 70, as = "div" }: StaggerRevealProps) {
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  const items = Children.toArray(children);

  return (
    <Tag ref={ref as never} className={className}>
      {items.map((child, i) => (
        <div
          key={i}
          className={cn("reveal", visible && "is-visible")}
          style={{ transitionDelay: visible ? `${i * step}ms` : "0ms" }}
        >
          {child}
        </div>
      ))}
    </Tag>
  );
}
