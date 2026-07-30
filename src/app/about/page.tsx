import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { facts } from "@/content/facts";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Global has supplied dealers, builders and infrastructure projects across Rajasthan since 2007, through Global Sales (Astral) and Global Marketing (Somany).",
  alternates: { canonical: canonical("/about") },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 space-y-6">
          <h1 className="text-h1 font-bold">18 years of holding stock.</h1>
          <p className="text-lead text-ink-secondary max-w-[34em]">
            The Global has operated out of Jaipur since {facts.brand.established}, distributing
            construction materials to dealers, builders and infrastructure projects across
            Rajasthan.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-canvas-sunken">
        <div className="mx-auto max-w-3xl px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {[facts.entities.sales, facts.entities.marketing].map((entity) => (
            <div key={entity.name} className="space-y-3">
              <h2 className="text-h3 font-semibold text-ink">{entity.name}</h2>
              <p className="text-body text-ink-secondary">{entity.mandate}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <PlaceholderImage
            label="Jaipur warehouse racking"
            alt="Racked inventory inside The Global's Jaipur warehouse"
            className="aspect-[4/3] rounded-2xl"
          />
          <div className="space-y-4">
            <h2 className="text-h2 font-bold">The warehouse</h2>
            <p className="text-body text-ink-secondary max-w-[34em]">
              Our Jaipur warehouse holds standing inventory across both divisions — {facts.capability.warehouseSqft} sq ft, racked and ready to dispatch, so a dealer or builder anywhere in Rajasthan gets material this week rather than next month.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-canvas-sunken">
        <div className="mx-auto max-w-5xl px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 order-2 md:order-1">
            <h2 className="text-h2 font-bold">The team</h2>
            <p className="text-body text-ink-secondary max-w-[34em]">
              A dedicated team runs procurement, warehousing and dispatch out of Jaipur, supporting
              dealers and site teams across all 33 districts of Rajasthan.
            </p>
          </div>
          <PlaceholderImage
            label="The team on the warehouse floor"
            alt="The Global's team at the Jaipur warehouse"
            className="aspect-[4/3] rounded-2xl order-1 md:order-2"
          />
        </div>
      </section>
    </main>
  );
}
