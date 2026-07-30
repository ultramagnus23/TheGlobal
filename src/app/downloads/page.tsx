import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DownloadCard } from "@/components/DownloadCard";
import { downloads } from "@/content/downloads";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Downloads — Catalogues, Price Lists & Authorisation Letters",
  description:
    "Download Astral and Somany catalogues, price lists, and The Global's authorisation and GST documentation.",
  alternates: { canonical: canonical("/downloads") },
};

const groups = [
  { brand: "somany" as const, label: "Somany — Global Marketing" },
  { brand: "astral" as const, label: "Astral — Global Sales" },
  { brand: "company" as const, label: "Company documentation" },
];

export default function DownloadsPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Downloads" }]} />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 space-y-16">
          <div>
            <h1 className="text-h1 font-bold mb-4">Downloads</h1>
            <p className="text-lead text-ink-secondary max-w-[34em]">
              Catalogues, price lists and authorisation documentation for architects, specifiers and
              tender submissions.
            </p>
          </div>

          {groups.map((group) => {
            const items = downloads.filter((d) => d.brand === group.brand);
            if (items.length === 0) return null;
            return (
              <div key={group.brand} className="space-y-4">
                <h2 className="text-h3 font-semibold text-ink">{group.label}</h2>
                <div className="grid grid-cols-1 gap-4">
                  {items.map((item) => (
                    <DownloadCard key={item.href} title={item.title} fileType="PDF" href={item.href} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
