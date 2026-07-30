import type { Metadata } from "next";
import { DivisionHero } from "@/components/DivisionHero";
import { AuthorisationBlock } from "@/components/AuthorisationBlock";
import { CategoryCard } from "@/components/CategoryCard";
import { DownloadCard } from "@/components/DownloadCard";
import { DivisionContactBlock } from "@/components/DivisionContactBlock";
import { astralCategories, astralWhyBuy } from "@/content/divisions";
import { facts } from "@/content/facts";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Astral Pipes & Plumbing Distributor — Jaipur, Rajasthan",
  description:
    "Authorised Astral distributor in Jaipur, Rajasthan. CPVC and UPVC pipes, fittings, drainage and fire protection systems, dispatched statewide.",
  alternates: { canonical: canonical("/astral") },
};

export default function AstralPage() {
  return (
    <main id="main-content">
      <DivisionHero
        eyebrow="Global Sales · Authorised Astral Distributor"
        heading="Astral pipes & plumbing systems."
        sub="Pipes, fittings, plumbing, water and drainage systems — held in depth at our Jaipur warehouse."
        imageLabel="Astral pipe fitting on sweep"
        imageAlt="A single Astral pipe joint photographed on a near-white sweep"
        ctaHref="/contact"
        ctaLabel="Enquire Now"
      />

      <AuthorisationBlock
        eyebrow="Authorised Distribution Partner"
        statement="Trusted Astral distribution partner since 2007."
        detail="Global Sales carries the full Astral range in depth at our Jaipur warehouse, so dealers and builders across Rajasthan get material without waiting on a factory order."
      />

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-h2 font-bold text-center mb-12">Product categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {astralCategories.map((category) => (
              <CategoryCard key={category.slug} category={category} basePath="/astral" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-canvas-sunken">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-h2 font-bold text-center mb-12">Why buy Astral from The Global</h2>
          <ul className="space-y-6">
            {astralWhyBuy.map((point) => (
              <li key={point} className="flex gap-3 text-body text-ink-secondary">
                <span className="text-success shrink-0" aria-hidden="true">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-h2 font-bold text-center mb-12">Downloads</h2>
          <div className="grid grid-cols-1 gap-4">
            <DownloadCard title="Astral Product Catalogue" fileType="PDF" href="/downloads/astral-catalogue.pdf" />
            <DownloadCard title="Astral Price List" fileType="PDF" href="/downloads/astral-price-list.pdf" />
            <DownloadCard title="Global Sales — Astral Authorisation Letter" fileType="PDF" href="/downloads/astral-authorisation.pdf" />
          </div>
        </div>
      </section>

      <DivisionContactBlock entity={facts.entities.sales} divisionLabel="Astral pipes and plumbing" />
    </main>
  );
}
