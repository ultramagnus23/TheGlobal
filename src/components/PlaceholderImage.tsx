import Image from "next/image";
import { cn } from "@/lib/cn";

// Remaining flat-colour instances (no `src` passed) are TODO: replace with
// real photography per PHOTOGRAPHY-BRIEF.md — warm, low-contrast, natural
// light, no HDR crunch. Where `src` is passed, that's already done (see
// public/images/generated/ — AI-generated stand-ins pending real photography).

interface PlaceholderImageProps {
  label: string;
  alt: string;
  className?: string;
  dark?: boolean;
  /** Real (or generated stand-in) image path. Omit to render the flat labelled placeholder. */
  src?: string;
  priority?: boolean;
  /** Scale up slightly on hover — only meaningful when the parent has `group`. */
  zoomOnHover?: boolean;
}

export function PlaceholderImage({ label, alt, className, dark, src, priority, zoomOnHover }: PlaceholderImageProps) {
  if (src) {
    return (
      // bg-navy-900 fallback here isn't decorative — if the image request ever
      // fails (seen in production: Vercel's on-the-fly optimizer erroring on
      // these pre-optimized local webp files), a dark scrim on top of nothing
      // renders as a flat muddy grey instead of a proper dark backdrop.
      <div className={cn("relative overflow-hidden", dark && "bg-navy-900", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className={cn("object-cover", zoomOnHover && "transition-transform duration-700 ease-out group-hover:scale-105")}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative flex items-end overflow-hidden",
        // Solid fill (not a gradient) for the dark variant: it sits behind white
        // hero/division text, and CSS Color 4 gradient interpolation (oklab)
        // isn't reliably parsed by some automated contrast-checking tools.
        dark ? "bg-navy-900" : "bg-gradient-to-br from-canvas-sunken to-border",
        className
      )}
    >
      {/* Diagonal drafting-line pattern so an unphotographed slot reads as a
          deliberate "spec drawing, photo pending" placeholder rather than a
          plain empty box — see the TODO above for why this exists at all. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 12px)`,
          color: dark ? "#ffffff" : "#16150f",
        }}
      />
      {label ? (
        <span
          className={cn(
            "relative m-4 rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-[0.08em]",
            dark ? "bg-white/10 text-white" : "bg-white/70 text-ink-secondary"
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
