import { z } from "zod";

/**
 * Single source of truth for every verifiable business fact used across the
 * site. Being superseded by content/company.ts (the typed Entity schema
 * from the full-rebuild brief) — until the migration lands, this still
 * feeds the 25 existing consumers.
 *
 * DEMO DATA NOTICE: every value below marked DEMO is placeholder content
 * for design/engineering review only — clearly fake but correctly
 * formatted so it passes scripts/validate-content.ts. See IS_DEMO_DATA in
 * content/company.ts. None of it is real and none of it may ship.
 */

const factsSchema = z.object({
  brand: z.object({
    name: z.string(),
    domain: z.string(),
    established: z.number(),
    yearsInOperation: z.string(),
    hqCity: z.string(),
    hqState: z.string(),
  }),
  entities: z.object({
    sales: z.object({
      name: z.string(),
      mandate: z.string(),
      gstin: z.string(),
      address: z.string(),
      phone: z.string(),
      whatsapp: z.string(),
    }),
    marketing: z.object({
      name: z.string(),
      mandate: z.string(),
      gstin: z.string(),
      address: z.string(),
      phone: z.string(),
      whatsapp: z.string(),
    }),
  }),
  hours: z.string(),
  primaryContact: z.object({
    phoneDisplay: z.string(),
    phoneHref: z.string(),
    whatsappNumber: z.string(),
  }),
  claims: z.array(z.string()),
  capability: z.object({
    years: z.string(),
    warehouseSqft: z.string(),
    districtsServed: z.string(),
    dispatch: z.string(),
  }),
});

export const facts = factsSchema.parse({
  brand: {
    name: "The Global",
    domain: "https://theglobal.co.in",
    established: 2007,
    yearsInOperation: "18+ years",
    hqCity: "Jaipur",
    hqState: "Rajasthan",
  },
  entities: {
    sales: {
      name: "Global Sales",
      mandate: "Authorised Astral Distributor — pipes, fittings, plumbing, water & drainage systems",
      gstin: "08DEMOX1234A1Z5", // DEMO — not a real GSTIN
      address: "DEMO ADDRESS — Plot 00, Sitapura Industrial Area, Jaipur, Rajasthan 302022",
      phone: "+919000000001", // DEMO
      whatsapp: "919000000002", // DEMO
    },
    marketing: {
      name: "Global Marketing",
      mandate: "Exclusive Authorised Somany Distributor for Rajasthan — tiles, sanitaryware, bath fittings",
      gstin: "08DEMOY5678B2Z6", // DEMO — not a real GSTIN
      address: "DEMO ADDRESS — Plot 00, Sitapura Industrial Area, Jaipur, Rajasthan 302022",
      phone: "+919000000003", // DEMO
      whatsapp: "919000000004", // DEMO
    },
  },
  hours: "Mon–Sat, 10:00–19:00 IST",
  primaryContact: {
    phoneDisplay: "+91 90000 00000", // DEMO
    phoneHref: "tel:+919000000000",
    whatsappNumber: "919000000000", // DEMO
  },
  claims: [
    "Exclusive Authorised Somany distributor for the state of Rajasthan",
    "Trusted Astral distribution partner",
    "18+ years in operation",
    "Warehousing based in Jaipur",
    "Statewide supply across Rajasthan",
    "Pan-India shipping",
    "Large standing inventory",
    "Fast delivery",
    "Competitive project pricing",
    "Trusted by dealers, builders and large construction projects",
  ],
  capability: {
    years: "18+",
    warehouseSqft: "50,000 sq ft (DEMO)",
    districtsServed: "33",
    dispatch: "Pan-India",
  },
});

export type Facts = z.infer<typeof factsSchema>;
