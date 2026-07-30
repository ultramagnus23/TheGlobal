import { EnquiryForm } from "@/components/EnquiryForm";
import { facts } from "@/content/facts";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function ContactSection() {
  const whatsappHref = buildWhatsAppLink(
    facts.primaryContact.whatsappNumber,
    "Hello The Global, I am enquiring about your products."
  );

  return (
    <section className="bg-canvas-sunken py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-h2 font-bold text-center mb-12">Call us. We answer.</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-surface rounded-3xl p-6 md:p-10 border border-border">
            <EnquiryForm />
          </div>

          <div className="space-y-8">
            {[facts.entities.sales, facts.entities.marketing].map((entity) => (
              <div key={entity.name} className="space-y-2">
                <p className="text-h3 font-semibold text-ink">{entity.name}</p>
                <p className="text-body text-ink-secondary max-w-[34em]">{entity.mandate}</p>
                <p className="text-body text-ink-secondary">{entity.address}</p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href={`tel:${entity.phone}`}
                    className="text-xl font-semibold text-navy-800 underline underline-offset-4"
                  >
                    {entity.phone}
                  </a>
                  <a
                    href={buildWhatsAppLink(entity.whatsapp, "Hello The Global, I am enquiring about your products.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-14 px-5 rounded-xl bg-whatsapp text-white text-xl font-bold"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-body text-ink-secondary">{facts.hours}</p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-14 px-5 rounded-xl bg-whatsapp text-white text-xl font-bold"
              >
                Message us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
