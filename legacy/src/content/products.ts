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
  {
    slug: "duragres-master",
    category: "floor-tiles",
    brand: "somany",
    name: "Duragres Master",
    range: "Somany Duragres Collection",
    description:
      "Glazed vitrified floor tile in a warm woodgrain-adjacent finish, held in depth for North & East India dispatch out of our Jaipur warehouse.",
    imageLabel: "Duragres Master floor tile in a living room",
    image: "/images/generated/somany-duragres-floor.webp",
    availability: "in-stock",
    attributes: [
      { label: "Size range", value: "196×1200mm, 600×600mm, 600×1200mm & 800×1600mm" },
      { label: "Finish", value: "Matt, woodgrain-adjacent" },
      { label: "Application", value: "Residential floors" },
      { label: "Region", value: "North & East India" },
    ],
    specs: [
      { label: "PEI rating", value: "PEI IV" },
      { label: "Water absorption", value: "< 0.5% (IS 15622)" },
      { label: "Standard", value: "IS 15622" },
      { label: "Coverage per box", value: "Varies by size" },
    ],
    downloads: [{ title: "Duragres Master Spec Sheet", href: "/downloads/somany-duragres-master-spec.pdf" }],
  },
  {
    slug: "durastone-master",
    category: "floor-tiles",
    brand: "somany",
    name: "Durastone Master",
    range: "Somany Durastone Heavy Duty Collection",
    description:
      "Heavy-duty vitrified tile built for high-traffic and outdoor areas, available in six sizes for pan-India dispatch.",
    imageLabel: "Durastone heavy duty tile on an outdoor patio",
    image: "/images/generated/somany-durastone-tile.webp",
    availability: "in-stock",
    attributes: [
      { label: "Size range", value: "300×300mm, 400×400mm, 600×600mm, 200×1200mm, 300×1200mm & 600×1200mm" },
      { label: "Finish", value: "Textured, anti-skid" },
      { label: "Application", value: "High-traffic & outdoor floors" },
      { label: "Region", value: "All India" },
    ],
    specs: [
      { label: "PEI rating", value: "PEI V" },
      { label: "Water absorption", value: "< 0.5% (IS 15622)" },
      { label: "Standard", value: "IS 15622" },
      { label: "Coverage per box", value: "Varies by size" },
    ],
    downloads: [{ title: "Durastone Master Spec Sheet", href: "/downloads/somany-durastone-master-spec.pdf" }],
  },
  {
    slug: "ceramica-neolla",
    category: "wall-tiles",
    brand: "somany",
    name: "Ceramica Neolla",
    range: "Somany Ceramica HD Digital Tiles Collection",
    description:
      "HD digital marble-look wall tile with a high-gloss finish, held in depth at our Jaipur warehouse for statewide dispatch.",
    imageLabel: "Ceramica Neolla marble-look tile close-up",
    image: "/images/generated/somany-ceramica-neolla.webp",
    availability: "in-stock",
    attributes: [
      { label: "Size", value: "600mm × 1200mm" },
      { label: "Finish", value: "High gloss, HD digital marble print" },
      { label: "Application", value: "Kitchen & bathroom walls" },
      { label: "Region", value: "All India" },
    ],
    specs: [
      { label: "Water absorption", value: "10–20% (IS 13755)" },
      { label: "Standard", value: "IS 13755" },
      { label: "Coverage per box", value: "Varies" },
    ],
    downloads: [{ title: "Ceramica Neolla Spec Sheet", href: "/downloads/somany-ceramica-neolla-spec.pdf" }],
  },
  {
    slug: "coverstone-technical-porcelain",
    category: "large-format-slabs",
    brand: "somany",
    name: "Coverstone Technical Porcelain",
    range: "Somany Coverstone Collection",
    description:
      "Large-format technical porcelain slab for statement floors, walls and counters, in sizes up to 800×3000mm.",
    imageLabel: "Coverstone technical porcelain slab leaning against a wall",
    image: "/images/generated/somany-coverstone-slab.webp",
    availability: "in-stock",
    attributes: [
      { label: "Size range", value: "1200×1800mm, 800×2400mm, 800×2600mm & 800×3000mm" },
      { label: "Finish", value: "Technical porcelain" },
      { label: "Application", value: "Statement floors, walls & counters" },
      { label: "Region", value: "All India" },
    ],
    specs: [
      { label: "PEI rating", value: "PEI IV" },
      { label: "Water absorption", value: "< 0.1%" },
      { label: "Coverage per slab", value: "Varies by size" },
    ],
    downloads: [{ title: "Coverstone Spec Sheet", href: "/downloads/somany-coverstone-spec.pdf" }],
  },
  {
    slug: "marvela-flortuff-master",
    category: "large-format-slabs",
    brand: "somany",
    name: "Marvela Flortuff Master",
    range: "Somany Marvela Flortuff Collection",
    description: "Large-format ceramic floor tile in a durable full-body finish, held in depth for statewide dispatch.",
    imageLabel: "Marvela Flortuff large format tile",
    image: "/images/generated/somany-tile-slab.webp",
    availability: "limited",
    attributes: [
      { label: "Size range", value: "600×600mm, 600×1200mm & 800×1600mm" },
      { label: "Finish", value: "Full body, matt" },
      { label: "Application", value: "Residential & commercial floors" },
      { label: "Region", value: "All India" },
    ],
    specs: [
      { label: "PEI rating", value: "PEI IV" },
      { label: "Water absorption", value: "< 0.5% (IS 15622)" },
      { label: "Coverage per box", value: "Varies by size" },
    ],
    downloads: [{ title: "Marvela Flortuff Spec Sheet", href: "/downloads/somany-marvela-flortuff-spec.pdf" }],
  },
  {
    slug: "somany-vanity-collection",
    category: "bath-fittings",
    brand: "somany",
    name: "Somany Vanity Collection",
    range: "Somany Bathware",
    description: "Bathroom vanity units pairing storage with basin fittings, for complete bathroom fit-outs.",
    imageLabel: "Somany vanity unit",
    availability: "made-to-order",
    attributes: [
      { label: "Type", value: "Wall-mounted & floor-standing" },
      { label: "Material", value: "Engineered wood, water-resistant finish" },
      { label: "Application", value: "Residential bathrooms" },
      { label: "Region", value: "All India" },
    ],
    specs: [{ label: "Pack quantity", value: "1 unit per carton" }],
    downloads: [{ title: "Somany Vanity Spec Sheet", href: "/downloads/somany-vanity-spec.pdf" }],
  },
  {
    slug: "somany-instant-geyser",
    category: "bath-fittings",
    brand: "somany",
    name: "Somany Instant Geyser",
    range: "Somany Bathware",
    description: "Instant water heater for residential bathrooms, sold alongside the full Somany Bathware range.",
    imageLabel: "Somany instant geyser",
    availability: "in-stock",
    attributes: [
      { label: "Type", value: "Instant, wall-mounted" },
      { label: "Application", value: "Residential bathrooms & kitchens" },
      { label: "Region", value: "All India" },
    ],
    specs: [{ label: "Standard", value: "IS 302" }],
    downloads: [{ title: "Somany Geyser Spec Sheet", href: "/downloads/somany-geyser-spec.pdf" }],
  },
];

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category);
}

export function getProduct(category: string, slug: string) {
  return products.find((p) => p.category === category && p.slug === slug);
}
