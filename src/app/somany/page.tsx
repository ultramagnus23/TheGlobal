import type { Metadata } from "next";
import { DivisionHero } from "@/components/DivisionHero";
import { AuthorisationBlock } from "@/components/AuthorisationBlock";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { DownloadCard } from "@/components/DownloadCard";
import { DivisionContactBlock } from "@/components/DivisionContactBlock";
import { ColorRevealSection } from "@/components/ColorRevealSection";
import { somanyCategories, somanyWhyBuy } from "@/content/divisions";
import { facts } from "@/content/facts";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Somany Tiles Distributor — Rajasthan, Exclusive Authorisation",
  description:
    "Exclusive Authorised Somany distributor for Rajasthan. Floor tiles, wall tiles, large format slabs, sanitaryware and bath fittings from Jaipur warehouse stock.",
  alternates: { canonical: canonical("/somany") },
};

export default function SomanyPage() {
  return (
    <main id="main-content">
      <DivisionHero
        eyebrow="Global Marketing · Exclusive Authorised Somany Distributor"
        heading="Somany tiles & sanitaryware."
        sub="Floor tiles, wall tiles, slabs, sanitaryware and bath fittings — the full range, in stock, for Rajasthan."
        imageLabel="Somany large-format slab on sweep"
        imageAlt="Stack of large-format marble-look tile slabs in a showroom"
        imageSrc="/images/generated/somany-hero.webp"
        ctaHref="/contact"
        ctaLabel="Enquire Now"
      />

      <ColorRevealSection from="var(--navy-900)" to="var(--canvas-sunken)">
        <AuthorisationBlock
          eyebrow="Exclusive Authorisation — Rajasthan"
          statement="The only exclusive Somany distributor in the state."
          detail="Global Marketing holds the exclusive Authorised Somany Distributor mandate for the state of Rajasthan — no other distributor carries this state-wide authorisation."
        />
      </ColorRevealSection>

      <ColorRevealSection from="var(--canvas-sunken)" to="var(--canvas)">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-h2 font-bold text-center mb-12">Product categories</h2>
            <CategoryShowcase categories={somanyCategories} basePath="/somany" />
          </div>
        </section>
      </ColorRevealSection>

      <ColorRevealSection from="var(--canvas)" to="var(--canvas-sunken)">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-h2 font-bold text-center mb-12">Why buy Somany from The Global</h2>
            <ul className="space-y-6">
              {somanyWhyBuy.map((point) => (
                <li key={point} className="flex gap-3 text-body text-ink-secondary">
                  <span className="text-success shrink-0" aria-hidden="true">✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </ColorRevealSection>

      <ColorRevealSection from="var(--canvas-sunken)" to="var(--canvas)">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-h2 font-bold text-center mb-12">Downloads</h2>
            <div className="grid grid-cols-1 gap-4">
              <DownloadCard title="Somany Product Catalogue" fileType="PDF" href="/downloads/somany-catalogue.pdf" />
              <DownloadCard title="Somany Price List" fileType="PDF" href="/downloads/somany-price-list.pdf" />
              <DownloadCard
                title="Global Marketing — Somany Exclusive Authorisation Letter"
                fileType="PDF"
                href="/downloads/somany-authorisation.pdf"
              />
            </div>
          </div>
        </section>
      </ColorRevealSection>

      <ColorRevealSection from="var(--canvas)" to="var(--canvas)">
        <DivisionContactBlock entity={facts.entities.marketing} divisionLabel="Somany tiles and sanitaryware" />
      </ColorRevealSection>
    </main>
  );
}
