import Link from "next/link";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { cn } from "@/lib/cn";

interface DivisionCardProps {
  brand: "astral" | "somany";
  entityName: string;
  heading: string;
  description: string;
  href: string;
  imageLabel: string;
  imageAlt: string;
  categories?: { slug: string; name: string }[];
  whyBuy?: string[];
}

export function DivisionCard({
  brand,
  entityName,
  heading,
  description,
  href,
  imageLabel,
  imageAlt,
  categories,
  whyBuy,
}: DivisionCardProps) {
  return (
    <div data-brand={brand} className="flex-1 rounded-3xl overflow-hidden border border-border bg-surface">
      <PlaceholderImage label={imageLabel} alt={imageAlt} className="aspect-[4/3]" />
      <div className={cn("border-t-[3px] p-6 md:p-8 space-y-4")} style={{ borderColor: "var(--partner)" }}>
        <div className="space-y-3">
          <p
            className="text-eyebrow uppercase tracking-[0.1em] font-semibold"
            style={{ color: "var(--partner-text)" }}
          >
            {entityName}
          </p>
          <h3 className="text-h3 font-bold text-ink">{heading}</h3>
          <p className="text-body text-ink-secondary">{description}</p>
        </div>

        {categories && categories.length > 0 ? (
          <ul className="flex flex-wrap gap-2" aria-label={`${heading} categories`}>
            {categories.map((c) => (
              <li
                key={c.slug}
                className="rounded-full border border-border px-3 py-1 text-sm font-medium text-ink-secondary"
              >
                {c.name}
              </li>
            ))}
          </ul>
        ) : null}

        {whyBuy && whyBuy.length > 0 ? (
          <ul className="space-y-1.5 border-t border-hairline pt-4">
            {whyBuy.map((reason) => (
              <li key={reason} className="flex gap-2 text-sm text-ink-secondary">
                <span aria-hidden="true" style={{ color: "var(--partner-text)" }}>
                  ✓
                </span>
                {reason}
              </li>
            ))}
          </ul>
        ) : null}

        <Link
          href={href}
          className="inline-flex items-center gap-1 text-lg font-semibold underline underline-offset-4"
          style={{ color: "var(--partner-text)" }}
        >
          Explore <span aria-hidden="true">›</span>
        </Link>
      </div>
    </div>
  );
}
