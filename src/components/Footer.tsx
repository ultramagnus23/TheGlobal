import Link from "next/link";
import { facts } from "@/content/facts";

const SITEMAP = [
  { label: "Products", href: "/products" },
  { label: "Astral", href: "/astral" },
  { label: "Somany", href: "/somany" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Become a Dealer", href: "/dealers" },
  { label: "Downloads", href: "/downloads" },
  { label: "Contact", href: "/contact" },
];

function EntityBlock({
  entity,
}: {
  entity: typeof facts.entities.sales;
}) {
  return (
    <div className="space-y-2">
      <p className="text-lg font-semibold text-white">{entity.name}</p>
      <p className="text-base text-[#C9C2AE]">{entity.mandate}</p>
      <p className="text-base text-[#C9C2AE]">{entity.address}</p>
      <p className="text-base text-[#C9C2AE]">GSTIN: {entity.gstin}</p>
      <a href={`tel:${entity.phone}`} className="block text-base text-white underline underline-offset-2">
        {entity.phone}
      </a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white border-t-2 border-brass">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-3">
            <p className="font-display text-2xl font-semibold">{facts.brand.name}</p>
            <p className="font-display italic text-lg text-[#C9C2AE]">Building Rajasthan, since {facts.brand.established}.</p>
            <p className="text-base text-[#C9C2AE] max-w-[28ch]">
              Construction materials distribution, headquartered in Jaipur, Rajasthan.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-base font-semibold uppercase tracking-[0.1em] text-[#C9C2AE]">
              Sitemap
            </p>
            <ul className="space-y-2">
              {SITEMAP.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-base text-white hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <EntityBlock entity={facts.entities.sales} />
          <EntityBlock entity={facts.entities.marketing} />
        </div>

        <div className="mt-12 pt-8 border-t border-white/15 space-y-2">
          <p className="text-base text-[#C9C2AE]">{facts.hours}</p>
        </div>

        <div className="mt-8 pt-8 border-t border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-base text-[#C9C2AE]">
            © {new Date().getFullYear()} {facts.brand.name}. Global Sales &amp; Global Marketing,
            Jaipur, Rajasthan.
          </p>
          <Link href="/hi" className="text-base text-white underline underline-offset-2">
            हिंदी
          </Link>
        </div>
      </div>
    </footer>
  );
}
