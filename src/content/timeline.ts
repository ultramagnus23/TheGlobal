export interface TimelineItem {
  year: string;
  desc: string;
}

/** {{TOKEN}} years are real milestones without a confirmed date yet — fill in content/facts.ts style, not fabricated here. */
export const timeline: TimelineItem[] = [
  { year: "2007", desc: "First warehouse opens in Jaipur." },
  { year: "{{SOMANY_AUTHORISATION_YEAR}}", desc: "Named Exclusive Somany Distributor for Rajasthan." },
  { year: "{{ASTRAL_PARTNERSHIP_YEAR}}", desc: "Astral distribution partnership begins." },
  { year: "Today", desc: "Supplying Rajasthan. Shipping across India." },
];
