import Link from "next/link";

interface BrandHalfProps {
  brand: "astral" | "somany";
  entityName: string;
  heading: string;
  description: string;
  tags: string[];
  href: string;
}

function BrandHalf({ brand, entityName, heading, description, tags, href }: BrandHalfProps) {
  return (
    <Link
      href={href}
      data-brand={brand}
      className="group flex-1 min-h-[420px] md:min-h-[560px] flex flex-col justify-end p-8 md:p-12"
      style={{ background: "linear-gradient(160deg, var(--partner-ink), var(--navy-900))" }}
    >
      <p
        className="text-eyebrow uppercase tracking-[0.1em] font-semibold"
        style={{ color: "var(--partner-glow)" }}
      >
        {entityName}
      </p>
      <h3 className="font-display text-h1 font-semibold text-white mt-2">{heading}</h3>
      <p className="text-body text-white/70 mt-3 max-w-[34ch]">{description}</p>
      <div className="flex flex-wrap gap-2 mt-6">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-eyebrow uppercase tracking-[0.06em] px-3 py-1.5 rounded-full border border-white/20 text-white/70"
          >
            {tag}
          </span>
        ))}
      </div>
      <span
        className="inline-flex items-center gap-1 mt-6 text-lg font-semibold group-hover:underline"
        style={{ color: "var(--partner-glow)" }}
      >
        Explore <span aria-hidden="true">›</span>
      </span>
    </Link>
  );
}

export function BrandSplitFull() {
  return (
    <div className="flex flex-col md:flex-row">
      <BrandHalf
        brand="somany"
        entityName="Global Marketing · Exclusive Authorised Distributor"
        heading="Somany"
        description="Tiles, sanitaryware and bath fittings — the surfaces and finishes that decide how a space actually feels to live in."
        tags={["Tiles", "Bathware", "Sanitaryware", "Building Solutions"]}
        href="/somany"
      />
      <BrandHalf
        brand="astral"
        entityName="Global Sales · Trusted Distribution Partner"
        heading="Astral"
        description="CPVC, PVC, SWR and water tanks — the systems that carry water through a building without anyone thinking twice about it."
        tags={["Pipes", "Fittings", "Tanks", "Adhesives"]}
        href="/astral"
      />
    </div>
  );
}
