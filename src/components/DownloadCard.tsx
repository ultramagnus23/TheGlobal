import fs from "node:fs";
import path from "node:path";
import type { CSSProperties } from "react";
import { facts } from "@/content/facts";
import { cn } from "@/lib/cn";

interface DownloadCardProps {
  title: string;
  fileType: string;
  href: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Server component: checks the file actually exists in /public before
 * offering it as a download. Content briefs and READMEs can say "the PDF
 * goes here" all they want — until it does, a visitor clicking this must
 * not hit a dead 404. Missing files fall back to a disabled state with a
 * direct call CTA instead of a broken link.
 */
export function DownloadCard({ title, fileType, href, className, style }: DownloadCardProps) {
  const filePath = path.join(process.cwd(), "public", href);
  const available = fs.existsSync(filePath);

  if (!available) {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-4 rounded-2xl border border-dashed border-border bg-canvas-sunken p-6 min-h-14",
          className
        )}
        style={style}
      >
        <div>
          <p className="text-h3 font-semibold text-ink-secondary">{title}</p>
          <p className="text-base text-ink-tertiary mt-1">
            Not posted online yet,{" "}
            <a href={facts.primaryContact.phoneHref} className="underline underline-offset-2 text-ink-secondary">
              call us
            </a>{" "}
            and we&apos;ll send it straight over.
          </p>
        </div>
      </div>
    );
  }

  return (
    <a
      href={href}
      className={cn(
        "flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-6 hover:bg-canvas-sunken min-h-14",
        className
      )}
      style={style}
    >
      <div>
        <p className="text-h3 font-semibold text-ink">{title}</p>
        <p className="text-base text-ink-tertiary mt-1 uppercase tracking-[0.05em]">{fileType}</p>
      </div>
      <span aria-hidden="true" className="text-2xl text-navy-800 shrink-0">
        ↓
      </span>
    </a>
  );
}
