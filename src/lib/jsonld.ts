import { facts } from "@/content/facts";
import { canonical } from "@/lib/seo";

function localBusiness(entity: typeof facts.entities.sales) {
  return {
    "@type": "LocalBusiness",
    name: entity.name,
    description: entity.mandate,
    address: {
      "@type": "PostalAddress",
      streetAddress: entity.address,
      addressRegion: facts.brand.hqState,
      addressCountry: "IN",
    },
    telephone: entity.phone,
    areaServed: facts.brand.hqState,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
    parentOrganization: { "@type": "Organization", name: facts.brand.name },
  };
}

export function buildSiteJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: facts.brand.name,
      url: facts.brand.domain,
      foundingDate: String(facts.brand.established),
      areaServed: facts.brand.hqState,
      sameAs: [],
    },
    { "@context": "https://schema.org", ...localBusiness(facts.entities.sales) },
    { "@context": "https://schema.org", ...localBusiness(facts.entities.marketing) },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: facts.brand.name,
      url: facts.brand.domain,
      // No SearchAction — the site has no functioning full-text search yet.
      // Add one here (and a matching /search route) if that's built later.
    },
  ];
}

export { canonical };
