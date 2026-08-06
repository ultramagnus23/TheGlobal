import Link from "next/link";
import { products } from "@/content/products";
import { cn } from "@/lib/cn";

/**
 * Replaces the old flat stat-counter row (which rendered literal "0" in
 * SSR HTML until CountUp's JS animated it up — a real bug a strict audit
 * caught) with a pulse per real SKU in the catalogue, sized and coloured
 * by that product's actual `availability` value from content/products.ts.
 * Pulse intensity is a direct function of real data, never decorative:
 * in-stock pulses bright and fast, limited pulses dimmer and slower,
 * made-to-order sits still. Every node is a real link to that product's
 * page (Server Component, no client JS required for the links or the
 * data itself — only the pulse animation is decorative, and it's pure
 * CSS, gated by prefers-reduced-motion in globals.css).
 *
 * This is a demo-catalogue snapshot (5 SKUs, not the 60+ a full launch
 * needs), not a live feed — labelled as such rather than implying
 * real-time data the site doesn't have.
 */
const TONE: Record<string, { dot: string; ring: string; label: string; speed: string }> = {
  "in-stock": { dot: "#7ad6a0", ring: "rgba(122,214,160,0.35)", label: "In stock", speed: "1.6s" },
  limited: { dot: "#e8c26a", ring: "rgba(232,194,106,0.3)", label: "Limited stock", speed: "2.6s" },
  "made-to-order": { dot: "#8b8b80", ring: "rgba(139,139,128,0.2)", label: "Made to order", speed: "0s" },
};

export function StockPulse() {
  return (
    <div>
      <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold text-white/50 text-center mb-2">
        Demo stock snapshot, not a live feed
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 mt-8">
        {products.map((product) => {
          const tone = TONE[product.availability];
          return (
            <Link
              key={product.slug}
              href={`/products/${product.category}/${product.slug}`}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <span
                className="relative flex items-center justify-center w-14 h-14 rounded-full"
                style={{ background: tone.ring }}
              >
                <span
                  className={cn("absolute inset-0 rounded-full stock-pulse-ring", tone.speed === "0s" && "opacity-0")}
                  style={{ background: tone.ring, animationDuration: tone.speed }}
                  aria-hidden="true"
                />
                <span className="relative w-3.5 h-3.5 rounded-full" style={{ background: tone.dot }} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-white group-hover:underline max-w-[14ch]">
                {product.name}
              </span>
              <span className="text-xs uppercase tracking-[0.08em] text-white/50">{tone.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
