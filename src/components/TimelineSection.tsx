import { timeline } from "@/content/timeline";
import { StaggerReveal } from "@/components/StaggerReveal";

export function TimelineSection() {
  return (
    <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-hairline">
      {timeline.map((item) => (
        <div key={item.desc} className="p-6 flex flex-col gap-2 border-r border-b border-hairline h-full">
          <span className="font-display text-h3 font-semibold text-ink">{item.year}</span>
          <span className="text-spec text-ink-secondary">{item.desc}</span>
        </div>
      ))}
    </StaggerReveal>
  );
}
