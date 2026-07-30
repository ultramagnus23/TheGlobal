import type { Metadata } from "next";
import Link from "next/link";
import { facts } from "@/content/facts";

export const metadata: Metadata = {
  title: "Enquiry received",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main id="main-content" className="mx-auto max-w-xl px-6 py-24 text-center space-y-6">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success text-4xl" aria-hidden="true">
        ✓
      </span>
      <h1 className="text-h1 font-bold">We have your enquiry.</h1>
      <p className="text-lead text-ink-secondary">
        We will call you within one working day.
      </p>
      <p className="text-body text-ink-secondary">
        Prefer not to wait?{" "}
        <a href={facts.primaryContact.phoneHref} className="underline text-navy-800 font-semibold">
          Call {facts.primaryContact.phoneDisplay}
        </a>
      </p>
      <Link href="/" className="inline-block text-lg font-semibold text-navy-800 underline underline-offset-4">
        Back to homepage
      </Link>
    </main>
  );
}
