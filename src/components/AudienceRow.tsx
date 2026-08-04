import Link from "next/link";
import type { CSSProperties } from "react";
import type { Audience } from "@/content/audiences";
import { cn } from "@/lib/cn";

interface AudienceRowProps {
  audience: Audience;
  className?: string;
  style?: CSSProperties;
}

export function AudienceRow({ audience, className, style }: AudienceRowProps) {
  return (
    <Link
      href={audience.href}
      className={cn(
        "flex items-center justify-between gap-6 py-6 border-b border-hairline hover:bg-canvas-sunken -mx-4 px-4 rounded-lg",
        className
      )}
      style={style}
    >
      <div>
        <p className="text-h3 font-semibold text-ink">{audience.label}</p>
        <p className="text-body text-ink-secondary mt-1">{audience.value}</p>
      </div>
      <span aria-hidden="true" className="text-2xl text-ink-secondary shrink-0">
        ›
      </span>
    </Link>
  );
}
