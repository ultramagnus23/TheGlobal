import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { StaggerReveal } from "@/components/StaggerReveal";
import { findCategory, allCategories } from "@/content/divisions";
import { getProductsByCategory } from "@/content/products";
import { canonical } from "@/lib/seo";

export function generateStaticParams() {
  return allCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const found = findCategory(category);
  if (!found) return {};
  return {
    title: `${found.category.name} — The Global`,
    description: found.category.blurb,
    alternates: { canonical: canonical(`/products/${category}`) },
  };
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const found = findCategory(category);
  if (!found) notFound();

  const categoryProducts = getProductsByCategory(category);

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: found.category.name },
        ]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-h1 font-bold mb-4">{found.category.name}</h1>
          <p className="text-lead text-ink-secondary max-w-[34em] mb-10">{found.category.blurb}</p>

          {categoryProducts.length > 0 ? (
            <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" step={70}>
              {categoryProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </StaggerReveal>
          ) : (
            <p className="text-body text-ink-secondary">
              Full range available — call us for current stock and pricing on this category.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
