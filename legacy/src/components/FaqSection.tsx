import { faqItems } from "@/content/faq";

export function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="py-16 md:py-24 bg-canvas-sunken">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-h2 font-bold mb-10">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <details key={item.question} className="rounded-2xl border border-border bg-surface p-6 group">
              <summary className="text-h3 font-semibold text-ink cursor-pointer list-none flex items-center justify-between gap-4 min-h-14">
                {item.question}
                <span aria-hidden="true" className="text-2xl text-ink-secondary group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="text-body text-ink-secondary mt-4 max-w-[34em]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
