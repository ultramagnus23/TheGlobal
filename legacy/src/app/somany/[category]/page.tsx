import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { StaggerReveal } from "@/components/StaggerReveal";
import { somanyCategories } from "@/content/divisions";
import { getProductsByCategory } from "@/content/products";
import { canonical } from "@/lib/seo";

export function generateStaticParams() {
  return somanyCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const found = somanyCategories.find((c) => c.slug === category);
  if (!found) return {};
  return {
    title: `${found.name} — Somany, The Global`,
    description: found.blurb,
    alternates: { canonical: canonical(`/somany/${category}`) },
  };
}

export default async function SomanyCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const found = somanyCategories.find((c) => c.slug === category);
  if (!found) notFound();

  const categoryProducts = getProductsByCategory(category);

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Somany", href: "/somany" },
          { label: found.name },
        ]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-h1 font-bold mb-4">{found.name}</h1>
          <p className="text-lead text-ink-secondary max-w-[34em] mb-10">{found.blurb}</p>

          {categoryProducts.length > 0 ? (
            <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" step={70}>
              {categoryProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </StaggerReveal>
          ) : (
            <div className="max-w-2xl">
              <PlaceholderImage
                label={found.name}
                alt={`${found.name}, full range available`}
                src={found.image}
                className="aspect-[16/9] rounded-2xl mb-8"
              />
              <p className="text-body text-ink-secondary">
                Full range available. Call us for current stock and pricing on this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
