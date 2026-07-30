import { z } from "zod";

const categorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  blurb: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

export const astralCategories: Category[] = [
  { slug: "cpvc-pipes", name: "CPVC Pipes & Fittings", blurb: "Hot & cold water plumbing systems." },
  { slug: "upvc-pipes", name: "UPVC Pipes & Fittings", blurb: "Water supply and agricultural pipework." },
  { slug: "drainage-sewerage", name: "Drainage & Sewerage", blurb: "SWR systems for waste and rainwater." },
  { slug: "fire-protection", name: "Fire Protection", blurb: "Piping systems for fire-fighting installations." },
  { slug: "adhesives-sealants", name: "Adhesives & Sealants", blurb: "Solvent cements and jointing compounds." },
  { slug: "water-tanks", name: "Water Storage Tanks", blurb: "Overhead and underground storage solutions." },
];

export const somanyCategories: Category[] = [
  { slug: "floor-tiles", name: "Floor Tiles", blurb: "Vitrified and ceramic floor tiles in every size." },
  { slug: "wall-tiles", name: "Wall Tiles", blurb: "Glazed wall tiles for kitchens and bathrooms." },
  { slug: "large-format-slabs", name: "Large Format Slabs", blurb: "Statement slabs for floors, walls and counters." },
  { slug: "sanitaryware", name: "Sanitaryware", blurb: "Wash basins, water closets and complete suites." },
  { slug: "bath-fittings", name: "Bath Fittings", blurb: "Faucets, showers and bathroom hardware." },
];

export function findCategory(slug: string): { category: Category; brand: "astral" | "somany" } | undefined {
  const astral = astralCategories.find((c) => c.slug === slug);
  if (astral) return { category: astral, brand: "astral" };
  const somany = somanyCategories.find((c) => c.slug === slug);
  if (somany) return { category: somany, brand: "somany" };
  return undefined;
}

export const allCategories = [...astralCategories, ...somanyCategories];

export const astralWhyBuy = [
  "Full range held in depth at our Jaipur warehouse — not ordered in after your enquiry.",
  "Site-wise dispatch, so material arrives in step with your construction schedule.",
  "Project pricing for bulk and phased orders, agreed once and honoured throughout.",
];

export const somanyWhyBuy = [
  "The only distributor in Rajasthan holding the exclusive state authorisation.",
  "Full range from floor tiles to bath fittings, matched and available together.",
  "Dealer and project pricing, with stock ready to move the same week.",
];
