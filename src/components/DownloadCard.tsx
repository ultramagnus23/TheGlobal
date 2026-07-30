interface DownloadCardProps {
  title: string;
  fileType: string;
  href: string;
}

export function DownloadCard({ title, fileType, href }: DownloadCardProps) {
  return (
    <a
      href={href}
      className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-6 hover:bg-canvas-sunken min-h-14"
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
