import { facts } from "@/content/facts";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Facts } from "@/content/facts";

interface DivisionContactBlockProps {
  entity: Facts["entities"]["sales"];
  divisionLabel: string;
}

export function DivisionContactBlock({ entity, divisionLabel }: DivisionContactBlockProps) {
  const whatsappHref = buildWhatsAppLink(
    entity.whatsapp,
    `Hello The Global, I am enquiring about ${divisionLabel} for a project in `
  );

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center space-y-4">
        <h2 className="text-h2 font-bold">Talk to {entity.name} directly.</h2>
        <p className="text-body text-ink-secondary max-w-[34em] mx-auto">{entity.address}</p>
        <p className="text-body text-ink-secondary">{facts.hours}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={`tel:${entity.phone}`}
            className="inline-flex items-center justify-center min-h-16 px-8 rounded-xl bg-navy-800 text-white text-xl font-semibold"
          >
            Call {entity.phone}
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-16 px-8 rounded-xl bg-whatsapp text-white text-xl font-bold"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
