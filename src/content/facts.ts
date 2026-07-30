import { z } from "zod";

/**
 * Single source of truth for every verifiable business fact used across the
 * site. Nothing here is invented — where a real figure is not yet supplied,
 * the value is a clearly named `{{TOKEN}}` placeholder. Fill these in once;
 * every page that imports `facts` picks up the change automatically.
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
      gstin: "{{GLOBAL_SALES_GSTIN}}",
      address: "{{GLOBAL_SALES_REGISTERED_ADDRESS}}, Jaipur, Rajasthan",
      phone: "{{GLOBAL_SALES_PHONE}}",
      whatsapp: "{{GLOBAL_SALES_WHATSAPP_NUMBER}}",
    },
    marketing: {
      name: "Global Marketing",
      mandate: "Exclusive Authorised Somany Distributor for Rajasthan — tiles, sanitaryware, bath fittings",
      gstin: "{{GLOBAL_MARKETING_GSTIN}}",
      address: "{{GLOBAL_MARKETING_REGISTERED_ADDRESS}}, Jaipur, Rajasthan",
      phone: "{{GLOBAL_MARKETING_PHONE}}",
      whatsapp: "{{GLOBAL_MARKETING_WHATSAPP_NUMBER}}",
    },
  },
  hours: "Mon–Sat, 10:00–19:00 IST",
  primaryContact: {
    phoneDisplay: "{{PRIMARY_PHONE_DISPLAY}}",
    phoneHref: "tel:+91{{PRIMARY_PHONE_DIGITS}}",
    whatsappNumber: "91{{PRIMARY_WHATSAPP_DIGITS}}",
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
    warehouseSqft: "{{WAREHOUSE_SQFT}}",
    districtsServed: "33",
    dispatch: "Pan-India",
  },
});

export type Facts = z.infer<typeof factsSchema>;
