/**
 * Single source of truth for the two legal entities behind The Global.
 * No optionals, no defaults, no invented values. Every field here is a
 * business fact that must be supplied and kept current — see
 * scripts/validate-content.ts, which fails the build if any field still
 * holds a placeholder token or fails its format check.
 *
 * Values below are intentionally still placeholder tokens (matching the
 * validator's `{{...}}` pattern) until the real figures are supplied. This
 * is deliberate: the build is meant to fail closed until they land, rather
 * than ship an unrendered token to production (the failure mode this file
 * replaces — see the previous `src/content/facts.ts`).
 */

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
    authorisationType: "{{GLOBAL_SALES_AUTHORISATION_TYPE}}",
    gstin: "{{GLOBAL_SALES_GSTIN}}",
    registeredAddress: "{{GLOBAL_SALES_REGISTERED_ADDRESS}}",
    warehouseAddress: "{{GLOBAL_SALES_WAREHOUSE_ADDRESS}}",
    geo: { lat: 0, lng: 0 },
    phoneDisplay: "{{GLOBAL_SALES_PHONE_DISPLAY}}",
    phoneE164: "{{GLOBAL_SALES_PHONE_E164}}",
    whatsappE164: "{{GLOBAL_SALES_WHATSAPP_E164}}",
    email: "{{GLOBAL_SALES_EMAIL}}",
    partnershipYear: 0,
  },
  marketing: {
    legalName: "Global Marketing",
    brandPartner: "Somany",
    authorisationType: "{{GLOBAL_MARKETING_AUTHORISATION_TYPE}}",
    gstin: "{{GLOBAL_MARKETING_GSTIN}}",
    registeredAddress: "{{GLOBAL_MARKETING_REGISTERED_ADDRESS}}",
    warehouseAddress: "{{GLOBAL_MARKETING_WAREHOUSE_ADDRESS}}",
    geo: { lat: 0, lng: 0 },
    phoneDisplay: "{{GLOBAL_MARKETING_PHONE_DISPLAY}}",
    phoneE164: "{{GLOBAL_MARKETING_PHONE_E164}}",
    whatsappE164: "{{GLOBAL_MARKETING_WHATSAPP_E164}}",
    email: "{{GLOBAL_MARKETING_EMAIL}}",
    partnershipYear: 0,
  },
};
