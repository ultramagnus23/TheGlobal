import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EnquiryForm } from "@/components/EnquiryForm";
import { MapEmbed } from "@/components/MapEmbed";
import { facts } from "@/content/facts";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { canonical } from "@/lib/seo";
import { FaqSection } from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call, WhatsApp, or write to The Global. Global Sales (Astral) and Global Marketing (Somany), Jaipur, Rajasthan.",
  alternates: { canonical: canonical("/contact") },
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-h1 font-bold mb-4">Call us. We answer.</h1>
          <p className="text-lead text-ink-secondary max-w-[34em] mb-12">
            Send an enquiry below, or call either entity directly — we hold stock and answer the
            phone during business hours.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-surface rounded-3xl p-6 md:p-10 border border-border">
              <EnquiryForm />
            </div>

            <div className="space-y-10">
              {[facts.entities.sales, facts.entities.marketing].map((entity) => {
                const whatsappHref = buildWhatsAppLink(
                  entity.whatsapp,
                  "Hello The Global, I am enquiring about your products."
                );
                return (
                  <div key={entity.name} className="space-y-3">
                    <p className="text-h3 font-semibold text-ink">{entity.name}</p>
                    <p className="text-body text-ink-secondary max-w-[34em]">{entity.mandate}</p>
                    <p className="text-body text-ink-secondary">{entity.address}</p>
                    <p className="text-body text-ink-secondary">GSTIN: {entity.gstin}</p>
                    <div className="flex flex-wrap gap-4 pt-1">
                      <a
                        href={`tel:${entity.phone}`}
                        className="text-xl font-semibold text-navy-800 underline underline-offset-4"
                      >
                        {entity.phone}
                      </a>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center min-h-14 px-5 rounded-xl bg-whatsapp text-white text-xl font-bold"
                      >
                        WhatsApp
                      </a>
                    </div>
                    <MapEmbed query={entity.address} label={`Map to ${entity.name}`} />
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(entity.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center min-h-14 px-6 rounded-xl border-[1.5px] border-border-interactive text-lg font-semibold text-navy-800 hover:bg-navy-100"
                    >
                      Get Directions
                    </a>
                  </div>
                );
              })}

              <p className="text-body text-ink-secondary border-t border-border pt-6">{facts.hours}</p>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
    </main>
  );
}
