interface SpecTableProps {
  rows: Array<{ label: string; value: string }>;
}

/** Full technical spec table, per §2.7 — unglamorous, dense, complete. */
export function SpecTable({ rows }: SpecTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full border-collapse text-spec">
        <thead>
          <tr className="bg-canvas-sunken text-left">
            <th className="p-4 border-b border-border font-semibold">Specification</th>
            <th className="p-4 border-b border-border font-semibold">Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 1 ? "bg-[#FAFAF8]" : undefined}>
              <td className="p-4 border-b border-hairline text-ink-secondary">{row.label}</td>
              <td className="p-4 border-b border-hairline tabular text-ink font-medium">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
