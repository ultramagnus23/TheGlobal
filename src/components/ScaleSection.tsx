import { facts } from "@/content/facts";
import { StaggerReveal } from "@/components/StaggerReveal";
import { CountUp } from "@/components/CountUp";

const rows = [
  {
    numeral: facts.capability.years,
    label: "Years of engineering reliable supply chains across Rajasthan.",
  },
  {
    numeral: facts.capability.warehouseSqft,
    label: "Sq ft of Jaipur warehouse — standing inventory, ready to move.",
  },
  {
    numeral: facts.capability.districtsServed,
    label: "Districts served, statewide, from one warehouse.",
  },
  {
    numeral: "2",
    label: "National brands, one authorised distributor — Astral and Somany, under one roof.",
  },
];

export function ScaleSection() {
  return (
    <StaggerReveal className="flex flex-col" step={90}>
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-wrap items-baseline justify-between gap-8 py-10 md:py-12 border-b border-hairline last:border-b-0"
        >
          <span className="font-display font-semibold text-numeral leading-none text-ink tabular">
            <CountUp value={row.numeral} />
          </span>
          <span className="text-body text-ink-secondary text-right max-w-[26ch]">{row.label}</span>
        </div>
      ))}
    </StaggerReveal>
  );
}
