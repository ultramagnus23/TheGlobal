import { z } from "zod";

const categorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  blurb: z.string(),
  image: z.string().optional(),
});

export type Category = z.infer<typeof categorySchema>;

/**
 * Images below reuse the existing generated stand-in photography (see
 * PlaceholderImage.tsx's own note: AI-generated stand-ins pending real
 * photography) matched to the closest real product family — a CPVC pipe
 * fitting photo for cpvc-pipes, an SWR pipe photo for drainage, etc.
 * Categories with no close match fall back to the division's hero image
 * rather than showing a flat empty placeholder. None of this is invented
 * imagery; it's the same honestly-labelled stand-in assets already in
 * public/images/generated/, reused instead of left unused.
 */
export const astralCategories: Category[] = [
  {
    slug: "cpvc-pipes",
    name: "CPVC Pipes & Fittings",
    blurb: "Hot & cold water plumbing systems.",
    image: "/images/generated/astral-pipe-fitting.webp",
  },
  {
    slug: "upvc-pipes",
    name: "UPVC Pipes & Fittings",
    blurb: "Water supply and agricultural pipework.",
    image: "/images/generated/astral-hero.webp",
  },
  {
    slug: "drainage-sewerage",
    name: "Drainage & Sewerage",
    blurb: "SWR systems for waste and rainwater.",
    image: "/images/generated/swr-pipe.webp",
  },
  {
    slug: "fire-protection",
    name: "Fire Protection",
    blurb: "Piping systems for fire-fighting installations.",
    image: "/images/generated/astral-pipe-fitting.webp",
  },
  {
    slug: "adhesives-sealants",
    name: "Adhesives & Sealants",
    blurb: "Solvent cements and jointing compounds.",
    image: "/images/generated/astral-hero.webp",
  },
  {
    slug: "water-tanks",
    name: "Water Storage Tanks",
    blurb: "Overhead and underground storage solutions.",
    image: "/images/generated/warehouse-hero.webp",
  },
];

export const somanyCategories: Category[] = [
  {
    slug: "floor-tiles",
    name: "Floor Tiles",
    blurb: "Vitrified and ceramic floor tiles in every size.",
    image: "/images/generated/somany-tile-slab.webp",
  },
  {
    slug: "wall-tiles",
    name: "Wall Tiles",
    blurb: "Glazed wall tiles for kitchens and bathrooms.",
    image: "/images/generated/ceramic-wall-tile.webp",
  },
  {
    slug: "large-format-slabs",
    name: "Large Format Slabs",
    blurb: "Statement slabs for floors, walls and counters.",
    image: "/images/generated/somany-tile-slab.webp",
  },
  {
    slug: "sanitaryware",
    name: "Sanitaryware",
    blurb: "Wash basins, water closets and complete suites.",
    image: "/images/generated/water-closet.webp",
  },
  {
    slug: "bath-fittings",
    name: "Bath Fittings",
    blurb: "Faucets, showers and bathroom hardware.",
    image: "/images/generated/somany-hero.webp",
  },
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
  "Full range held in depth at our Jaipur warehouse, not ordered in after your enquiry.",
  "Site-wise dispatch, so material arrives in step with your construction schedule.",
  "Project pricing for bulk and phased orders, agreed once and honoured throughout.",
];

export const somanyWhyBuy = [
  "The only distributor in Rajasthan holding the exclusive state authorisation.",
  "Full range from floor tiles to bath fittings, matched and available together.",
  "Dealer and project pricing, with stock ready to move the same week.",
];
