import Link from "next/link";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { Chip } from "@/components/Chip";
import type { Product } from "@/content/products";

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

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.category}/${product.slug}`}
      className="block rounded-2xl border border-border bg-surface overflow-hidden hover:shadow-[0_1px_2px_rgba(11,15,20,0.04)]"
    >
      <PlaceholderImage label={product.imageLabel} alt={product.name} className="aspect-[4/3]" />
      <div className="p-6 space-y-2">
        <p className="text-h3 font-semibold text-ink">{product.name}</p>
        <p className="text-body text-ink-secondary">{product.range}</p>
        <Chip tone={availabilityTone[product.availability]}>{availabilityLabel[product.availability]}</Chip>
      </div>
    </Link>
  );
}
