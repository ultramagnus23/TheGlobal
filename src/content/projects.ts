import { z } from "zod";

const projectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  city: z.string(),
  year: z.number(),
  range: z.string(),
  blurb: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

/**
 * TODO: replace with real project case studies and photography per
 * PHOTOGRAPHY-BRIEF.md. Until then these are honestly captioned by product
 * range rather than naming a client relationship we cannot verify.
 */
export const projects: Project[] = [
  {
    slug: "residential-tower-floor-tiling",
    name: "Residential tower, floor tiling",
    city: "Jaipur",
    year: 2024,
    range: "Somany vitrified tiles, 600×1200",
    blurb: "Full-floor supply from Jaipur warehouse stock, dispatched in phases as each floor topped out.",
  },
  {
    slug: "commercial-plumbing-drainage",
    name: "Commercial complex, plumbing & drainage",
    city: "Jodhpur",
    year: 2023,
    range: "Astral CPVC and SWR pipework",
    blurb: "Site-wise dispatch across three tower blocks on a single project pricing agreement.",
  },
  {
    slug: "township-sanitaryware-fitout",
    name: "Township phase 1, sanitaryware fit-out",
    city: "Udaipur",
    year: 2024,
    range: "Somany sanitaryware and bath fittings",
    blurb: "Bulk order held in Jaipur inventory and released to site in step with handover schedule.",
  },
];

export const projectsSchema = z.array(projectSchema);
