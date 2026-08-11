"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  side: "astral" | "somany";
}

/**
 * Canvas 2D particle collision: cool Astral-blue particles rush in from the
 * left, warm Somany-terracotta from the right, meet at center in a
 * scatter, then settle into two calm bands and fade out, handing off to
 * the real BrandSplitFull content underneath (see CollisionSection). Runs
 * once, driven by its own timestamp-based clock, not scroll position —
 * simpler and more robust than a continuous scroll-scrub for a one-shot
 * transition effect, and still resolves the same story: two distinct
 * worlds meeting and settling before the real content takes over.
 */
export function CollisionCanvas({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function size() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      canvas!.width = parent.clientWidth * Math.min(window.devicePixelRatio, 2);
      canvas!.height = parent.clientHeight * Math.min(window.devicePixelRatio, 2);
    }
    size();
    window.addEventListener("resize", size);

    const astralColor = "92,159,214";
    const somanyColor = "217,122,58";

    const particles: Particle[] = [];
    const count = 140;
    for (let i = 0; i < count; i++) {
      const astral = i < count / 2;
      const w = canvas.width;
      const h = canvas.height;
      particles.push({
        x: astral ? -20 : w + 20,
        y: h * (0.15 + Math.random() * 0.7),
        vx: (astral ? 1 : -1) * (2 + Math.random() * 3),
        vy: (Math.random() - 0.5) * 1.5,
        r: 2 + Math.random() * 3.5,
        side: astral ? "astral" : "somany",
      });
    }

    let start: number | null = null;
    let raf = 0;
    let disposed = false;
    const collideAt = 1600;
    const scatterFor = 700;
    const settleFor = 1200;
    const totalDuration = collideAt + scatterFor + settleFor;

    function frame(ts: number) {
      if (disposed) return;
      if (start === null) start = ts;
      const t = ts - start;
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      if (t < collideAt) {
        const tt = t / collideAt;
        for (const p of particles) {
          p.x += p.vx * tt * 1.4;
          p.y += p.vy * 0.3;
          drawDot(ctx!, p);
        }
      } else if (t < collideAt + scatterFor) {
        const tt = (t - collideAt) / scatterFor;
        for (const p of particles) {
          const cx = w / 2 + (p.side === "astral" ? 1 : -1) * tt * (60 + p.r * 8) * Math.sin(tt * 6 + p.r);
          const cy = p.y + Math.sin(tt * 10 + p.r) * tt * 30;
          ctx!.globalAlpha = 1 - tt * 0.3;
          drawDotAt(ctx!, cx, cy, p.r, p.side === "astral" ? astralColor : somanyColor);
        }
        ctx!.globalAlpha = 1;
      } else {
        const tt = Math.min(1, (t - collideAt - scatterFor) / settleFor);
        const fadeOut = tt;
        ctx!.globalAlpha = Math.max(0, 1 - fadeOut);
        for (const p of particles) {
          const targetX = p.side === "astral" ? w * 0.25 : w * 0.75;
          const x = p.x + (targetX - p.x) * tt;
          const y = h / 2 + (p.y - h / 2) * (1 - tt * 0.6);
          drawDotAt(ctx!, x, y, p.r, p.side === "astral" ? astralColor : somanyColor);
        }
        ctx!.globalAlpha = 1;
      }

      if (t >= totalDuration) {
        disposed = true;
        onDone();
        return;
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
}

function drawDot(ctx: CanvasRenderingContext2D, p: Particle) {
  drawDotAt(ctx, p.x, p.y, p.r, p.side === "astral" ? "92,159,214" : "217,122,58");
}

function drawDotAt(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rgb: string) {
  ctx.beginPath();
  ctx.fillStyle = `rgba(${rgb},0.9)`;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
