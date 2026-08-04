"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay step between consecutive items, in ms. */
  step?: number;
  as?: "div" | "ul";
}

/**
 * Reveals a list of sibling items in sequence as the group scrolls into
 * view, instead of all at once — same transform/opacity language as the
 * global `.reveal` class, just staggered per item so rows read as a
 * deliberate cascade. Clones the reveal class/delay directly onto each
 * child rather than wrapping it in an extra `<div>`, so this stays safe to
 * use with `as="ul"` around `<li>` children (a wrapper div there would be
 * invalid HTML and break list semantics for screen readers) and doesn't
 * add a spurious cell to CSS grid layouts.
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
      {items.map((child, i) => {
        if (!isValidElement<{ className?: string; style?: React.CSSProperties }>(child)) return child;
        return cloneElement(child, {
          className: cn(child.props.className, "reveal", visible && "is-visible"),
          style: {
            ...child.props.style,
            transitionDelay: visible ? `${i * step}ms` : "0ms",
          },
        });
      })}
    </Tag>
  );
}
