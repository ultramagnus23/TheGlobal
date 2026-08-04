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
}

export function PlaceholderImage({ label, alt, className, dark, src, priority }: PlaceholderImageProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
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
      <span
        className={cn(
          "m-4 rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-[0.08em]",
          dark ? "bg-white/10 text-white" : "bg-white/70 text-ink-secondary"
        )}
      >
        {label}
      </span>
    </div>
  );
}
