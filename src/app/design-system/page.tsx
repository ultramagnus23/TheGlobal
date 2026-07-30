import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { contrastRatio, ratioLabel } from "@/lib/contrast";

export const metadata: Metadata = {
  title: "Design System — internal",
  robots: { index: false, follow: false },
};

const CANVAS = "#FBFBF9";
const NAVY_800 = "#0E2A47";
const WHITE = "#FFFFFF";

const colorRows: Array<{ token: string; hex: string; bg: string; note: string }> = [
  { token: "--ink on --canvas", hex: "#0B0F14", bg: CANVAS, note: "Headings, primary body" },
  { token: "--ink-secondary on --canvas", hex: "#454C56", bg: CANVAS, note: "Sub-lines, captions" },
  { token: "--ink-tertiary on --canvas", hex: "#5E6673", bg: CANVAS, note: "Legal text, 18px min" },
  { token: "--navy-800 on --canvas", hex: NAVY_800, bg: CANVAS, note: "Primary brand colour" },
  { token: "white on --navy-800", hex: WHITE, bg: NAVY_800, note: "Primary button label" },
  { token: "--brass-text on --canvas", hex: "#8A6520", bg: CANVAS, note: "Only gold permitted as text <24px" },
  { token: "--astral-text on --canvas", hex: "#005AB4", bg: CANVAS, note: "Astral route text-safe variant" },
  { token: "--somany-text on --canvas", hex: "#B31E1E", bg: CANVAS, note: "Somany route text-safe variant" },
  { token: "white on --success", hex: WHITE, bg: "#1F6B34", note: "In-stock chip" },
  { token: "white on --warning", hex: WHITE, bg: "#8A5A00", note: "Limited-stock chip" },
  { token: "white on --danger", hex: WHITE, bg: "#A3221F", note: "Made-to-order chip" },
];

const typeScale: Array<{ role: string; mobile: string; desktop: string; weight: string }> = [
  { role: "Hero display", mobile: "40px", desktop: "76px", weight: "700" },
  { role: "H1", mobile: "34px", desktop: "60px", weight: "700" },
  { role: "H2", mobile: "28px", desktop: "44px", weight: "700" },
  { role: "H3", mobile: "23px", desktop: "30px", weight: "600" },
  { role: "Lead paragraph", mobile: "20px", desktop: "24px", weight: "400" },
  { role: "Body", mobile: "18px", desktop: "20px", weight: "400" },
  { role: "Spec / table", mobile: "17px", desktop: "18px", weight: "400" },
  { role: "Eyebrow label", mobile: "14px", desktop: "15px", weight: "600" },
  { role: "Legal / footnote", mobile: "16px", desktop: "16px", weight: "400" },
  { role: "Display numeral", mobile: "44px", desktop: "72px", weight: "600" },
];

function Swatch({ label, hex, textOn }: { label: string; hex: string; textOn?: "light" | "dark" }) {
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div
        className="h-20 flex items-end p-3"
        style={{ backgroundColor: hex }}
      >
        <span
          className="text-sm font-semibold tabular"
          style={{ color: textOn === "dark" ? "#fff" : "#0B0F14" }}
        >
          {hex}
        </span>
      </div>
      <div className="px-3 py-2 text-base text-ink-secondary">{label}</div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 space-y-24">
      <header className="space-y-3">
        <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold text-ink-tertiary">
          Internal · noindex
        </p>
        <h1 className="text-h1 font-bold">Design system</h1>
        <p className="text-body text-ink-secondary max-w-[34em]">
          Every token, contrast ratio, and component state used across The Global, rendered here so
          it can be audited before pages are built on top of it.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-h2 font-bold">Colour — neutral foundation</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Swatch label="Canvas" hex="#FBFBF9" />
          <Swatch label="Canvas sunken" hex="#F4F4F1" />
          <Swatch label="Surface" hex="#FFFFFF" />
          <Swatch label="Border interactive" hex="#8B908C" textOn="dark" />
          <Swatch label="Ink" hex="#0B0F14" textOn="dark" />
          <Swatch label="Ink secondary" hex="#454C56" textOn="dark" />
          <Swatch label="Ink tertiary" hex="#5E6673" textOn="dark" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h2 font-bold">Colour — Meridian Navy &amp; Brass</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Swatch label="Navy 900" hex="#0A1F33" textOn="dark" />
          <Swatch label="Navy 800 — primary brand" hex="#0E2A47" textOn="dark" />
          <Swatch label="Navy 700 — hover" hex="#143A5E" textOn="dark" />
          <Swatch label="Navy 600 — focus/link" hex="#1A4A78" textOn="dark" />
          <Swatch label="Brass — non-text only" hex="#B68A35" />
          <Swatch label="Brass text (5.11:1)" hex="#8A6520" textOn="dark" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h2 font-bold">Colour — quarantined partner brands</h2>
        <p className="text-body text-ink-secondary max-w-[34em]">
          These only resolve inside <code>[data-brand=&quot;astral&quot;]</code> /{" "}
          <code>[data-brand=&quot;somany&quot;]</code> subtrees — see the two boxes below, and{" "}
          <code>globals.css</code> for the scoping mechanism.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div data-brand="astral" className="rounded-2xl border-2 p-6 space-y-2" style={{ borderColor: "var(--partner)" }}>
            <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--partner-text)" }}>
              data-brand=&quot;astral&quot;
            </p>
            <p className="text-body">
              <a href="#" style={{ color: "var(--partner-text)" }} className="underline">
                Astral-coloured link (6.49:1)
              </a>
            </p>
          </div>
          <div data-brand="somany" className="rounded-2xl border-2 p-6 space-y-2" style={{ borderColor: "var(--partner)" }}>
            <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--partner-text)" }}>
              data-brand=&quot;somany&quot;
            </p>
            <p className="text-body">
              <a href="#" style={{ color: "var(--partner-text)" }} className="underline">
                Somany-coloured link (6.49:1)
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h2 font-bold">Computed contrast ratios</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-spec">
            <thead>
              <tr className="bg-canvas-sunken text-left">
                <th className="p-3 border-b border-border">Pair</th>
                <th className="p-3 border-b border-border">Ratio</th>
                <th className="p-3 border-b border-border">Result</th>
                <th className="p-3 border-b border-border">Used for</th>
              </tr>
            </thead>
            <tbody>
              {colorRows.map((row) => {
                const ratio = contrastRatio(row.hex, row.bg);
                const { label, pass } = ratioLabel(ratio);
                return (
                  <tr key={row.token} className="odd:bg-[#FAFAF8]">
                    <td className="p-3 border-b border-hairline">{row.token}</td>
                    <td className="p-3 border-b border-hairline tabular">{label}</td>
                    <td className="p-3 border-b border-hairline">
                      <Chip tone={pass === "FAIL" ? "danger" : pass === "AA" ? "warning" : "success"}>
                        {pass}
                      </Chip>
                    </td>
                    <td className="p-3 border-b border-hairline text-ink-secondary">{row.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h2 font-bold">Type scale</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-spec">
            <thead>
              <tr className="bg-canvas-sunken text-left">
                <th className="p-3 border-b border-border">Role</th>
                <th className="p-3 border-b border-border">Mobile</th>
                <th className="p-3 border-b border-border">Desktop</th>
                <th className="p-3 border-b border-border">Weight</th>
              </tr>
            </thead>
            <tbody>
              {typeScale.map((row) => (
                <tr key={row.role} className="odd:bg-[#FAFAF8]">
                  <td className="p-3 border-b border-hairline">{row.role}</td>
                  <td className="p-3 border-b border-hairline tabular">{row.mobile}</td>
                  <td className="p-3 border-b border-hairline tabular">{row.desktop}</td>
                  <td className="p-3 border-b border-hairline tabular">{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-legal text-ink-tertiary">
          Body floor is 18px on mobile — nothing on the site, including the footer and legal line, is smaller.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-h2 font-bold">Buttons — 3 tiers × 4 states</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold text-ink-tertiary">Primary</p>
            <Button tier="primary">Default</Button>
            <Button tier="primary" className="bg-navy-700 border-navy-700">Hover</Button>
            <Button tier="primary" className="outline outline-3 outline-navy-600 outline-offset-[3px]">Focus</Button>
            <Button tier="primary" disabled>Disabled</Button>
          </div>
          <div className="space-y-3">
            <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold text-ink-tertiary">Secondary</p>
            <Button tier="secondary">Default</Button>
            <Button tier="secondary" className="bg-navy-100">Hover</Button>
            <Button tier="secondary" className="outline outline-3 outline-navy-600 outline-offset-[3px]">Focus</Button>
            <Button tier="secondary" disabled>Disabled</Button>
          </div>
          <div className="space-y-3">
            <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold text-ink-tertiary">Tertiary</p>
            <Button tier="tertiary" chevron>Learn more</Button>
            <Button tier="tertiary" chevron className="underline">Learn more</Button>
            <Button tier="tertiary" chevron className="outline outline-3 outline-navy-600 outline-offset-[3px]">Learn more</Button>
            <Button tier="tertiary" chevron disabled>Learn more</Button>
          </div>
        </div>
      </section>

      <section className="space-y-6 pb-24">
        <h2 className="text-h2 font-bold">Status chips</h2>
        <div className="flex flex-wrap gap-4">
          <Chip tone="success">In stock</Chip>
          <Chip tone="warning">Limited stock</Chip>
          <Chip tone="danger">Made to order</Chip>
        </div>
      </section>
    </main>
  );
}
