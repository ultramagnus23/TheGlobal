import { z } from "zod";

const specRowSchema = z.object({ label: z.string(), value: z.string() });
const attributeSchema = z.object({ label: z.string(), value: z.string() });
const downloadSchema = z.object({ title: z.string(), href: z.string() });

const productSchema = z.object({
  slug: z.string(),
  category: z.string(),
  brand: z.enum(["astral", "somany"]),
  name: z.string(),
  range: z.string(),
  description: z.string(),
  imageLabel: z.string(),
  image: z.string().optional(),
  availability: z.enum(["in-stock", "limited", "made-to-order"]),
  attributes: z.array(attributeSchema),
  specs: z.array(specRowSchema),
  downloads: z.array(downloadSchema),
});

export type Product = z.infer<typeof productSchema>;

export const products: Product[] = [
  {
    slug: "cpvc-pipe-sdr-11",
    category: "cpvc-pipes",
    brand: "astral",
    name: "CPVC Pipe, SDR 11",
    range: "Astral CPVC Plumbing System",
    description:
      "Pressure-rated CPVC pipe for hot and cold water plumbing, supplied ex-stock from our Jaipur warehouse in half-inch to two-inch sizes.",
    imageLabel: "CPVC pipe length on sweep",
    image: "/images/generated/astral-pipe-fitting.webp",
    availability: "in-stock",
    attributes: [
      { label: "Size range", value: "15mm – 50mm (½\" – 2\")" },
      { label: "Application", value: "Hot & cold water plumbing" },
      { label: "Pack length", value: "3 metre length" },
      { label: "Colour", value: "Light grey (CTS)" },
    ],
    specs: [
      { label: "Standard", value: "ASTM D2846" },
      { label: "Pressure class", value: "SDR 11" },
      { label: "Working temperature", value: "Up to 82°C" },
      { label: "Pack quantity", value: "50 lengths per bundle" },
      { label: "Coverage", value: "N/A (sold by length)" },
    ],
    downloads: [
      { title: "CPVC Pipe Spec Sheet", href: "/downloads/astral-cpvc-spec.pdf" },
    ],
  },
  {
    slug: "swr-pipe-type-a",
    category: "drainage-sewerage",
    brand: "astral",
    name: "SWR Pipe, Type A",
    range: "Astral Drainage System",
    description:
      "Soil, waste and rain water pipe for drainage systems, held in depth for site-wise dispatch across Rajasthan.",
    imageLabel: "SWR pipe fitting on sweep",
    image: "/images/generated/swr-pipe.webp",
    availability: "in-stock",
    attributes: [
      { label: "Size range", value: "75mm – 160mm" },
      { label: "Application", value: "Waste & rainwater drainage" },
      { label: "Pack length", value: "3 metre length" },
      { label: "Colour", value: "Terracotta" },
    ],
    specs: [
      { label: "Standard", value: "IS 13592" },
      { label: "Pipe type", value: "Type A" },
      { label: "Joint type", value: "Solvent cement" },
      { label: "Pack quantity", value: "Sold per length" },
      { label: "Coverage", value: "N/A (sold by length)" },
    ],
    downloads: [{ title: "SWR Pipe Spec Sheet", href: "/downloads/astral-swr-spec.pdf" }],
  },
  {
    slug: "vitrified-floor-tile-600x1200",
    category: "floor-tiles",
    brand: "somany",
    name: "Vitrified Floor Tile, 600×1200",
    range: "Somany Vitrified Collection",
    description:
      "Large-format vitrified floor tile with a matt finish, held in full-range depth at our Jaipur warehouse for statewide dispatch.",
    imageLabel: "Vitrified floor tile slab on sweep",
    image: "/images/generated/somany-tile-slab.webp",
    availability: "in-stock",
    attributes: [
      { label: "Size", value: "600mm × 1200mm" },
      { label: "Finish", value: "Matt" },
      { label: "Thickness", value: "9mm" },
      { label: "Application", value: "Residential & commercial floors" },
    ],
    specs: [
      { label: "PEI rating", value: "PEI IV" },
      { label: "Water absorption", value: "< 0.5% (IS 15622)" },
      { label: "Standard", value: "IS 15622" },
      { label: "Pack quantity", value: "2 tiles per box" },
      { label: "Coverage per box", value: "1.44 sq m" },
    ],
    downloads: [{ title: "Vitrified Tile Spec Sheet", href: "/downloads/somany-vitrified-spec.pdf" }],
  },
  {
    slug: "ceramic-wall-tile-300x600",
    category: "wall-tiles",
    brand: "somany",
    name: "Ceramic Wall Tile, 300×600",
    range: "Somany Ceramic Collection",
    description: "Glazed ceramic wall tile for kitchens and bathrooms, available in a full range of finishes.",
    imageLabel: "Ceramic wall tile texture close-up",
    image: "/images/generated/ceramic-wall-tile.webp",
    availability: "in-stock",
    attributes: [
      { label: "Size", value: "300mm × 600mm" },
      { label: "Finish", value: "Glossy" },
      { label: "Thickness", value: "8mm" },
      { label: "Application", value: "Kitchen & bathroom walls" },
    ],
    specs: [
      { label: "Water absorption", value: "10–20% (IS 13755)" },
      { label: "Standard", value: "IS 13755" },
      { label: "Pack quantity", value: "8 tiles per box" },
      { label: "Coverage per box", value: "1.44 sq m" },
    ],
    downloads: [{ title: "Ceramic Wall Tile Spec Sheet", href: "/downloads/somany-ceramic-spec.pdf" }],
  },
  {
    slug: "wall-hung-water-closet",
    category: "sanitaryware",
    brand: "somany",
    name: "Wall-Hung Water Closet",
    range: "Somany Sanitaryware Collection",
    description: "Wall-hung water closet with concealed cistern compatibility, for modern bathroom fit-outs.",
    imageLabel: "Wall-hung water closet on sweep",
    image: "/images/generated/water-closet.webp",
    availability: "limited",
    attributes: [
      { label: "Type", value: "Wall-hung, S-trap" },
      { label: "Flush volume", value: "Dual flush, 3/6 litre" },
      { label: "Material", value: "Vitreous china" },
      { label: "Application", value: "Residential & commercial bathrooms" },
    ],
    specs: [
      { label: "Standard", value: "IS 2556" },
      { label: "Water efficiency", value: "Dual-flush, 3/6 litre" },
      { label: "Pack quantity", value: "1 per carton" },
    ],
    downloads: [{ title: "Water Closet Spec Sheet", href: "/downloads/somany-wc-spec.pdf" }],
  },
];

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category);
}

export function getProduct(category: string, slug: string) {
  return products.find((p) => p.category === category && p.slug === slug);
}
