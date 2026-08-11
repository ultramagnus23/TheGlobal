import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { facts } from "@/content/facts";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Use",
  alternates: { canonical: canonical("/legal/terms") },
};

export default function TermsPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]} />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 space-y-8">
          <h1 className="text-h1 font-bold">Terms of Use</h1>

          <div className="space-y-4 text-legal text-ink-secondary max-w-[34em]">
            <p>
              These terms govern your use of theglobal.co.in, operated by{" "}
              {facts.entities.sales.name} and {facts.entities.marketing.name}, Jaipur, Rajasthan.
            </p>

            <h2 className="text-h3 font-semibold text-ink pt-4">Product information</h2>
            <p>
              Specifications, pricing and stock availability shown on this site are indicative.
              Confirm current pricing, stock and delivery timelines with us directly by phone or
              WhatsApp before placing an order.
            </p>

            <h2 className="text-h3 font-semibold text-ink pt-4">Trademarks</h2>
            <p>
              Astral and Somany are trademarks of their respective owners. {facts.brand.name} is an
              authorised distributor and is not the manufacturer of either brand&apos;s products.
            </p>

            <h2 className="text-h3 font-semibold text-ink pt-4">Enquiries</h2>
            <p>
              Submitting an enquiry form does not constitute a binding order. Orders are confirmed
              separately once terms are agreed with our sales team.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
