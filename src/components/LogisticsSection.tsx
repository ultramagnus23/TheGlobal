import { facts } from "@/content/facts";

export function LogisticsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
      <svg viewBox="0 0 300 340" className="w-full max-w-xs mx-auto" aria-hidden="true">
        <path
          d="M150 10 L230 60 L260 140 L230 250 L160 320 L90 260 L50 160 L70 70 Z"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <circle cx="150" cy="120" r="6" fill="var(--navy-600)" />
        <circle cx="110" cy="180" r="3" fill="var(--navy-600)" />
        <circle cx="190" cy="200" r="3" fill="var(--navy-600)" />
        <circle cx="140" cy="240" r="3" fill="var(--navy-600)" />
        <path d="M150 120 L110 180" stroke="var(--brass)" strokeWidth="1" strokeDasharray="6 5" opacity="0.6" />
        <path d="M150 120 L190 200" stroke="var(--brass)" strokeWidth="1" strokeDasharray="6 5" opacity="0.6" />
        <path d="M150 120 L140 240" stroke="var(--brass)" strokeWidth="1" strokeDasharray="6 5" opacity="0.6" />
      </svg>
      <p className="text-lead text-ink-secondary max-w-[32ch]">
        One warehouse in Jaipur. Every road out of it leads to one of {facts.capability.districtsServed} districts that&apos;s already building — materials dispatched before the schedule notices they were needed.
      </p>
    </div>
  );
}
