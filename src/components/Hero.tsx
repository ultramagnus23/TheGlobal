import { Button } from "@/components/Button";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { facts } from "@/content/facts";

export function Hero() {
  return (
    <section className="relative min-h-[640px] flex items-center justify-center overflow-hidden">
      <PlaceholderImage
        label="Jaipur warehouse, racked to the ceiling"
        alt="Interior of a warehouse racked to the ceiling with construction materials, warm light streaming through high windows"
        src="/images/generated/warehouse-hero.webp"
        dark
        priority
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-navy-900/60" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center text-white space-y-6">
        <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold text-white/85">
          Rajasthan · Since {facts.brand.established}
        </p>
        <h1 className="text-hero font-bold tracking-tight">
          The materials behind Rajasthan&apos;s buildings.
        </h1>
        <p className="text-lead text-white/90 max-w-[34em] mx-auto">
          Exclusive Somany distributor for Rajasthan. Trusted Astral partner. Supplying dealers,
          builders and infrastructure projects for {facts.brand.yearsInOperation}.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
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
      </div>
    </section>
  );
}
