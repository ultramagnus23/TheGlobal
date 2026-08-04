/**
 * Single source of truth for the two legal entities behind The Global.
 * No optionals, no defaults, no invented values. Every field here is a
 * business fact that must be supplied and kept current — see
 * scripts/validate-content.ts, which fails the build if any field still
 * holds a placeholder token or fails its format check.
 *
 * DEMO DATA NOTICE: every field below is placeholder content for
 * design/engineering review only (see IS_DEMO_DATA). It is deliberately
 * fake but correctly formatted, so scripts/validate-content.ts still
 * enforces real structure (E.164 phone shape, GSTIN shape, non-zero geo)
 * even in demo mode. None of it may reach a real deploy — see the PR/task
 * tracking the real-data swap.
 */

/** True while company.ts holds placeholder rather than real business data. Gate any "this is live" assumption on this being false. */
export const IS_DEMO_DATA = true;

export interface Entity {
  legalName: string;
  brandPartner: "Astral" | "Somany";
  authorisationType: string;
  gstin: string;
  registeredAddress: string;
  warehouseAddress: string;
  geo: { lat: number; lng: number };
  phoneDisplay: string;
  phoneE164: string;
  whatsappE164: string;
  email: string;
  partnershipYear: number;
}

export const entities: Record<"sales" | "marketing", Entity> = {
  sales: {
    legalName: "Global Sales",
    brandPartner: "Astral",
    authorisationType: "Authorised Distributor (DEMO)",
    gstin: "08DEMOX1234A1Z5", // DEMO — not a real GSTIN
    registeredAddress: "DEMO ADDRESS — Plot 00, Sitapura Industrial Area, Jaipur, Rajasthan 302022",
    warehouseAddress: "DEMO ADDRESS — Plot 00, Sitapura Industrial Area, Jaipur, Rajasthan 302022",
    geo: { lat: 26.7355, lng: 75.8189 }, // DEMO — approximate Sitapura industrial area, not a confirmed address
    phoneDisplay: "+91 90000 00001", // DEMO
    phoneE164: "+919000000001", // DEMO
    whatsappE164: "+919000000002", // DEMO
    email: "sales-demo@example.com", // DEMO
    partnershipYear: 2009, // DEMO — unconfirmed
  },
  marketing: {
    legalName: "Global Marketing",
    brandPartner: "Somany",
    authorisationType: "Exclusive Authorised Distributor for Rajasthan (DEMO)",
    gstin: "08DEMOY5678B2Z6", // DEMO — not a real GSTIN
    registeredAddress: "DEMO ADDRESS — Plot 00, Sitapura Industrial Area, Jaipur, Rajasthan 302022",
    warehouseAddress: "DEMO ADDRESS — Plot 00, Sitapura Industrial Area, Jaipur, Rajasthan 302022",
    geo: { lat: 26.7355, lng: 75.8189 }, // DEMO — approximate Sitapura industrial area, not a confirmed address
    phoneDisplay: "+91 90000 00003", // DEMO
    phoneE164: "+919000000003", // DEMO
    whatsappE164: "+919000000004", // DEMO
    email: "marketing-demo@example.com", // DEMO
    partnershipYear: 2012, // DEMO — unconfirmed
  },
};
