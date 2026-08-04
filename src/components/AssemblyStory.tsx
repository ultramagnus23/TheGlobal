const stages = [
  {
    num: "01",
    title: "The structure.",
    body: "Every building starts as geometry — a shell, a set of floors, a roof. Before a single material is chosen, the building already knows its shape.",
  },
  {
    num: "02",
    title: "Water & drainage.",
    body: "CPVC, PVC and SWR systems thread through every wall — the part no one sees, and the part that can least afford to fail.",
    powered: { label: "Powered by Astral", brand: "astral" as const },
  },
  {
    num: "03",
    title: "Surfaces & finish.",
    body: "Tiles, sanitaryware and bath fittings turn a structure into a place someone actually lives.",
    powered: { label: "Finished with Somany", brand: "somany" as const },
  },
];

export function AssemblyStory() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
      {stages.map((stage) => (
        <div key={stage.num} className="space-y-3">
          <span className="font-display text-lg text-ink-tertiary block">{stage.num}</span>
          <h3 className="text-h3 font-semibold text-ink">{stage.title}</h3>
          <p className="text-body text-ink-secondary">{stage.body}</p>
          {stage.powered ? (
            <span
              data-brand={stage.powered.brand}
              className="inline-block mt-2 text-eyebrow uppercase tracking-[0.1em] font-semibold px-3 py-1.5 rounded-full border"
              style={{ color: "var(--partner-text)", borderColor: "var(--partner)" }}
            >
              {stage.powered.label}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
