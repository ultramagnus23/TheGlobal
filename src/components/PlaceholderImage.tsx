import { cn } from "@/lib/cn";

// TODO: replace every PlaceholderImage usage with real photography per
// PHOTOGRAPHY-BRIEF.md — warm, low-contrast, natural light, no HDR crunch.

interface PlaceholderImageProps {
  label: string;
  alt: string;
  className?: string;
  dark?: boolean;
}

export function PlaceholderImage({ label, alt, className, dark }: PlaceholderImageProps) {
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
