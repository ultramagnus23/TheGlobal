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

  const delivered = await deliverEnquiry(parsed.data);
  if (!delivered) {
    // Never lose a submission: if email delivery isn't configured or fails,
    // it's still logged server-side so it isn't silently dropped.
    console.log("[enquiry] new submission (not emailed — see below)", {
      name: parsed.data.name,
      phone: parsed.data.phone,
      city: parsed.data.city,
      role: parsed.data.role,
      interest: parsed.data.interest,
    });
  }

  return { ok: true };
}

/**
 * Sends the enquiry via Resend's REST API when RESEND_API_KEY and
 * ENQUIRY_NOTIFICATION_EMAIL are set (see README "Environment variables").
 * Returns false — never throws — on missing config or delivery failure, so
 * a broken/unset key degrades to the console-log fallback instead of
 * breaking the form for the visitor.
 */
async function deliverEnquiry(data: EnquiryFormValues): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFICATION_EMAIL;
  if (!apiKey || !to) return false;

  const interestLabel = { astral: "Astral (pipes & plumbing)", somany: "Somany (tiles & sanitaryware)", both: "Both" }[
    data.interest
  ];
  const roleLabel = data.role.charAt(0).toUpperCase() + data.role.slice(1);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM_EMAIL ?? "The Global Website <onboarding@resend.dev>",
        to: [to],
        reply_to: undefined,
        subject: `New enquiry — ${data.name} (${roleLabel})`,
        text: [
          `Name: ${data.name}`,
          `Phone: ${data.phone}`,
          `City: ${data.city}`,
          `I am a: ${roleLabel}`,
          `Interested in: ${interestLabel}`,
          data.message ? `Message: ${data.message}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
