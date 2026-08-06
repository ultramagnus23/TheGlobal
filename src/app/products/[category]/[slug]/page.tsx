import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Gallery } from "@/components/Gallery";
import { SpecTable } from "@/components/SpecTable";
import { DownloadCard } from "@/components/DownloadCard";
import { Chip } from "@/components/Chip";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";
import { ColorRevealSection } from "@/components/ColorRevealSection";
import { StaggerReveal } from "@/components/StaggerReveal";
import { findCategory } from "@/content/divisions";
import { products, getProduct, getProductsByCategory } from "@/content/products";
import { facts } from "@/content/facts";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { canonical } from "@/lib/seo";

const availabilityTone = {
  "in-stock": "success",
  limited: "warning",
  "made-to-order": "danger",
} as const;

const availabilityLabel = {
  "in-stock": "In stock",
  limited: "Limited stock",
  "made-to-order": "Made to order",
} as const;

export function generateStaticParams() {
  return products.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const product = getProduct(category, slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.range}`,
    description: product.description,
    alternates: { canonical: canonical(`/products/${category}/${slug}`) },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const product = getProduct(category, slug);
  const found = findCategory(category);
  if (!product || !found) notFound();

  const entity = product.brand === "astral" ? facts.entities.sales : facts.entities.marketing;
  const whatsappHref = buildWhatsAppLink(
    entity.whatsapp,
    `Hello The Global, I am enquiring about ${product.name} (${product.range}).`
  );
  const related = getProductsByCategory(category).filter((p) => p.slug !== product.slug);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand === "astral" ? "Astral" : "Somany" },
    category: found.category.name,
    offers: {
      "@type": "Offer",
      availability:
        product.availability === "in-stock"
          ? "https://schema.org/InStock"
          : product.availability === "limited"
            ? "https://schema.org/LimitedAvailability"
            : "https://schema.org/PreOrder",
      seller: { "@type": "Organization", name: entity.name },
      url: canonical(`/products/${category}/${slug}`),
    },
  };

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: found.category.name, href: `/products/${category}` },
          { label: product.name },
        ]}
      />

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Gallery images={[{ label: product.imageLabel, src: product.image }]} alt={product.name} />

          <div className="space-y-6">
            <div>
              <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold text-ink-tertiary">
                {product.range}
              </p>
              <h1 className="text-h1 font-bold mt-2">{product.name}</h1>
            </div>
            <p className="text-lead text-ink-secondary max-w-[34em]">{product.description}</p>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 border-t border-hairline pt-6">
              {product.attributes.map((attr) => (
                <div key={attr.label}>
                  <dt className="text-base font-semibold text-ink-tertiary uppercase tracking-[0.05em]">
                    {attr.label}
                  </dt>
                  <dd className="text-body text-ink mt-1">{attr.value}</dd>
                </div>
              ))}
            </dl>

            <Chip tone={availabilityTone[product.availability]}>
              {availabilityLabel[product.availability]}
            </Chip>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button href={whatsappHref} tier="primary" size="large">
                Enquire About This Product
              </Button>
              <Button href={entity.phone ? `tel:${entity.phone}` : "/contact"} tier="secondary" size="large">
                Call {entity.phone}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ColorRevealSection from="var(--canvas)" to="var(--canvas-sunken)">
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-h2 font-bold mb-8">Technical specification</h2>
            <SpecTable rows={product.specs} />
          </div>
        </section>
      </ColorRevealSection>

      {product.downloads.length > 0 ? (
        <ColorRevealSection from="var(--canvas-sunken)" to="var(--canvas)">
          <section className="py-12 md:py-20">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="text-h2 font-bold mb-8">Downloads</h2>
              <StaggerReveal className="grid grid-cols-1 gap-4">
                {product.downloads.map((d) => (
                  <DownloadCard key={d.href} title={d.title} fileType="PDF" href={d.href} />
                ))}
              </StaggerReveal>
            </div>
          </section>
        </ColorRevealSection>
      ) : null}

      {related.length > 0 ? (
        <ColorRevealSection from="var(--canvas)" to="var(--canvas-sunken)">
          <section className="py-12 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-h2 font-bold mb-8">Related products</h2>
              <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" step={70}>
                {related.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </StaggerReveal>
            </div>
          </section>
        </ColorRevealSection>
      ) : null}
    </main>
  );
}
