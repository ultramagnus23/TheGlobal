import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-navy-100 text-navy-800",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

const toneIcon: Record<Tone, string> = {
  neutral: "",
  success: "✓",
  warning: "!",
  danger: "✕",
};

interface ChipProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

/** Icon + label pairing, never colour alone, per §3.5. */
export function Chip({ tone = "neutral", children, className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-base font-semibold",
        toneClasses[tone],
        className
      )}
    >
      {toneIcon[tone] ? <span aria-hidden="true">{toneIcon[tone]}</span> : null}
      {children}
    </span>
  );
}
