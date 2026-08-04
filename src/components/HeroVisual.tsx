"use client";

import dynamic from "next/dynamic";

const ProductAssembly = dynamic(() => import("@/components/ProductAssembly").then((m) => m.ProductAssembly), {
  ssr: false,
});

export function HeroVisual() {
  return <ProductAssembly />;
}
