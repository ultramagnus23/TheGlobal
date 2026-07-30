import { z } from "zod";

const audienceSchema = z.object({
  label: z.string(),
  value: z.string(),
  href: z.string(),
});

export type Audience = z.infer<typeof audienceSchema>;

export const audiences: Audience[] = [
  {
    label: "Dealers",
    value: "Stock availability, margins and credit terms on request.",
    href: "/dealers",
  },
  {
    label: "Builders & Contractors",
    value: "Bulk pricing and site-wise dispatch from Jaipur warehouse stock.",
    href: "/contact",
  },
  {
    label: "Architects & Specifiers",
    value: "Full catalogues and technical spec sheets for every range we carry.",
    href: "/downloads",
  },
  {
    label: "Government & Infrastructure",
    value: "Authorisation letters, GSTIN and tender-grade documentation available.",
    href: "/downloads",
  },
  {
    label: "Homeowners",
    value: "See the Somany range in person at our showroom or nearest dealer.",
    href: "/somany",
  },
];
