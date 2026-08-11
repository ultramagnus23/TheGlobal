function srgbToLinear(c: number) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/** WCAG 2.x contrast ratio between two hex colours, e.g. contrastRatio("#0B0F14", "#FBFBF9"). */
export function contrastRatio(hexA: string, hexB: string): number {
  const lA = relativeLuminance(hexA);
  const lB = relativeLuminance(hexB);
  const lighter = Math.max(lA, lB);
  const darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
}

export function ratioLabel(ratio: number): { label: string; pass: "AAA" | "AA" | "FAIL" } {
  const r = Math.round(ratio * 100) / 100;
  if (r >= 7) return { label: `${r}:1`, pass: "AAA" };
  if (r >= 3) return { label: `${r}:1`, pass: "AA" };
  return { label: `${r}:1`, pass: "FAIL" };
}
