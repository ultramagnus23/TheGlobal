"use server";

import { headers } from "next/headers";
import { enquiryFormSchema, type EnquiryFormValues } from "@/lib/schemas/enquiry";

export interface EnquiryActionResult {
  ok: boolean;
  error?: string;
}

// Naive single-instance rate limiter (5 submissions / 10 minutes per IP).
// Sufficient for a low-traffic MVP; if this deploys across multiple serverless
// instances, replace with a shared store (e.g. Upstash Redis) — see README.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissions.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  submissions.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

export async function submitEnquiry(values: EnquiryFormValues): Promise<EnquiryActionResult> {
  const parsed = enquiryFormSchema.safeParse(values);
  if (!parsed.data) {
    return { ok: false, error: "Please check the form and try again." };
  }

  // Honeypot: a filled `company` field means a bot filled every input, not just visible ones.
  if (parsed.data.company) {
    return { ok: true };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return { ok: false, error: "Too many enquiries submitted. Please call us instead." };
  }

  // TODO: wire to Resend/Nodemailer once RESEND_API_KEY / SMTP env vars are set.
  // See README.md "Environment variables" for the exact names expected.
  console.log("[enquiry] new submission", {
    name: parsed.data.name,
    phone: parsed.data.phone,
    city: parsed.data.city,
    role: parsed.data.role,
    interest: parsed.data.interest,
  });

  return { ok: true };
}
