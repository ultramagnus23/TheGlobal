import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductsFilterGrid } from "@/components/ProductsFilterGrid";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Products — Astral Pipes & Somany Tiles",
  description:
    "Browse Astral pipes and plumbing systems, and Somany tiles and sanitaryware, held in stock at our Jaipur warehouse for statewide dispatch.",
  alternates: { canonical: canonical("/products") },
};

export default function ProductsIndexPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-h1 font-bold mb-4">Products</h1>
          <p className="text-lead text-ink-secondary max-w-[34em] mb-10">
            Astral pipes and plumbing systems, and Somany tiles and sanitaryware — every range we
            carry in Jaipur warehouse stock.
          </p>
          <ProductsFilterGrid />
        </div>
      </section>
    </main>
  );
}
