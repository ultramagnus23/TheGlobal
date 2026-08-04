import Link from "next/link";
import type { CSSProperties } from "react";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { Chip } from "@/components/Chip";
import type { Product } from "@/content/products";
import { cn } from "@/lib/cn";

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

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: CSSProperties;
}

export function ProductCard({ product, className, style }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.category}/${product.slug}`}
      className={cn(
        "block rounded-2xl border border-border bg-surface overflow-hidden hover:shadow-[0_1px_2px_rgba(19,19,15,0.04)]",
        className
      )}
      style={style}
    >
      <PlaceholderImage
        label={product.imageLabel}
        alt={product.name}
        src={product.image}
        className="aspect-[4/3]"
      />
      <div className="p-6 space-y-2">
        <p className="text-h3 font-semibold text-ink">{product.name}</p>
        <p className="text-body text-ink-secondary">{product.range}</p>
        <Chip tone={availabilityTone[product.availability]}>{availabilityLabel[product.availability]}</Chip>
      </div>
    </Link>
  );
}
