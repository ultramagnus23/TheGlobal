import { Button } from "@/components/Button";
import { HeroVisual } from "@/components/HeroVisual";
import { facts } from "@/content/facts";

export function Hero() {
  return (
    <section
      className="relative min-h-[720px] flex flex-col items-center justify-center overflow-hidden text-center px-6 py-24"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(60,80,90,0.18), transparent 60%), var(--navy-900)",
      }}
    >
      <div className="relative w-full max-w-3xl h-[320px] md:h-[420px] mb-2">
        <HeroVisual />
      </div>

      <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold text-white/70">
        Rajasthan · Since {facts.brand.established}
      </p>
      <h1 className="text-hero font-semibold tracking-tight text-white mt-4">
        Building Rajasthan.
        <br />
        <em className="font-display font-normal" style={{ color: "var(--navy-600)" }}>
          Supplying India.
        </em>
      </h1>
      <p className="text-lead text-white/70 max-w-[34em] mx-auto mt-6">
        Exclusive Somany distributor for Rajasthan. Trusted Astral partner. Supplying dealers,
        builders and infrastructure projects for {facts.brand.yearsInOperation}.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
        <Button href="/products" tier="primary" size="large">
          View Products
        </Button>
        <Button
          href={facts.primaryContact.phoneHref}
          tier="secondary"
          size="large"
          className="!text-white !border-white/70 hover:!bg-white/10"
        >
          Call {facts.primaryContact.phoneDisplay}
        </Button>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-eyebrow uppercase tracking-[0.16em]">Scroll</span>
        <span className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent scroll-cue-stem" />
      </div>
    </section>
  );
}
