"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/content/products";
import { astralCategories, somanyCategories } from "@/content/divisions";
import { cn } from "@/lib/cn";

const allCategories = [...astralCategories, ...somanyCategories];

export function ProductsFilterGrid() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const visible = activeCategory ? products.filter((p) => p.category === activeCategory) : products;

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-12" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          aria-pressed={activeCategory === null}
          className={cn(
            "min-h-14 px-5 rounded-full border-[1.5px] text-lg font-medium",
            activeCategory === null
              ? "bg-navy-800 text-white border-navy-800"
              : "border-border-interactive text-ink hover:bg-canvas-sunken"
          )}
        >
          All Products
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setActiveCategory(cat.slug)}
            aria-pressed={activeCategory === cat.slug}
            className={cn(
              "min-h-14 px-5 rounded-full border-[1.5px] text-lg font-medium",
              activeCategory === cat.slug
                ? "bg-navy-800 text-white border-navy-800"
                : "border-border-interactive text-ink hover:bg-canvas-sunken"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </>
  );
}
