import Link from "next/link";
import type { Category } from "@/content/divisions";

export function CategoryCard({ category, basePath }: { category: Category; basePath: string }) {
  return (
    <Link
      href={`${basePath}/${category.slug}`}
      className="block rounded-2xl border border-border bg-surface p-6 border-t-[3px] hover:shadow-[0_1px_2px_rgba(11,15,20,0.04)]"
      style={{ borderTopColor: "var(--partner)" }}
    >
      <p className="text-h3 font-semibold text-ink">{category.name}</p>
      <p className="text-body text-ink-secondary mt-2">{category.blurb}</p>
    </Link>
  );
}
