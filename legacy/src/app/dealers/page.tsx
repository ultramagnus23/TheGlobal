import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EnquiryForm } from "@/components/EnquiryForm";
import { StaggerReveal } from "@/components/StaggerReveal";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Become a Dealer",
  description:
    "Stock availability, margins and credit terms for dealers and retailers across Rajasthan. Enquire to become an authorised Global dealer.",
  alternates: { canonical: canonical("/dealers") },
};

const benefits = [
  "Stock availability across both Astral and Somany ranges, held in Jaipur warehouse depth.",
  "Margins and credit terms discussed directly, dealer to dealer.",
  "Onboarding support from enquiry through to your first order.",
];

export default function DealersPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Become a Dealer" }]} />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-h1 font-bold mb-4">Stock you can sell. Support you can reach.</h1>
          <p className="text-lead text-ink-secondary max-w-[34em] mb-12">
            We onboard dealers and retailers across Rajasthan for both the Astral and Somany
            ranges. Tell us about your business below.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6 order-2 lg:order-1">
              <StaggerReveal as="ul" className="space-y-6" step={110}>
                {benefits.map((point) => (
                  <li key={point} className="flex gap-3 text-body text-ink-secondary">
                    <span className="text-success shrink-0" aria-hidden="true">✓</span>
                    {point}
                  </li>
                ))}
              </StaggerReveal>
            </div>

            <div className="bg-surface rounded-3xl p-6 md:p-10 border border-border order-1 lg:order-2">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
