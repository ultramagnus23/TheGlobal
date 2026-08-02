import Link from "next/link";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import type { Category } from "@/content/divisions";

/**
 * One large featured range + a quiet list for the rest — not a wall of
 * identical cards. Matches the Foster + Partners reference from the brief
 * (large plate photography, nothing competing for attention) while keeping
 * every item's full description always visible (no hover-only information).
 */
export function CategoryShowcase({
  categories,
  basePath,
}: {
  categories: Category[];
  basePath: string;
}) {
  const [featured, ...rest] = categories;

  return (
    <div className="space-y-12">
      <Link
        href={`${basePath}/${featured.slug}`}
        className="group grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-border bg-surface"
      >
        <PlaceholderImage
          label={featured.name}
          alt={`${featured.name} — featured range`}
          className="aspect-[4/3] md:aspect-auto"
        />
        <div
          className="p-8 md:p-12 flex flex-col justify-center border-t-[3px] md:border-t-0 md:border-l-[3px]"
          style={{ borderColor: "var(--partner)" }}
        >
          <p
            className="text-eyebrow uppercase tracking-[0.1em] font-semibold"
            style={{ color: "var(--partner-text)" }}
          >
            Featured range
          </p>
          <h3 className="text-h2 font-bold text-ink mt-3 group-hover:underline">{featured.name}</h3>
          <p className="text-lead text-ink-secondary mt-4 max-w-[30em]">{featured.blurb}</p>
          <span
            className="inline-flex items-center gap-1 mt-6 text-lg font-semibold"
            style={{ color: "var(--partner-text)" }}
          >
            Explore <span aria-hidden="true">›</span>
          </span>
        </div>
      </Link>

      <ul className="border-t border-hairline">
        {rest.map((category) => (
          <li key={category.slug} className="border-b border-hairline">
            <Link
              href={`${basePath}/${category.slug}`}
              className="flex items-center justify-between gap-6 py-6 px-2 -mx-2 rounded-lg hover:bg-canvas-sunken"
            >
              <div>
                <p className="text-h3 font-semibold text-ink">{category.name}</p>
                <p className="text-body text-ink-secondary mt-1 max-w-[50ch]">{category.blurb}</p>
              </div>
              <span
                aria-hidden="true"
                className="text-2xl shrink-0"
                style={{ color: "var(--partner-text)" }}
              >
                ›
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
