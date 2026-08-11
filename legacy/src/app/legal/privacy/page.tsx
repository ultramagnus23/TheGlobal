import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { facts } from "@/content/facts";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: canonical("/legal/privacy") },
};

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 space-y-8">
          <h1 className="text-h1 font-bold">Privacy Policy</h1>

          <div className="space-y-4 text-legal text-ink-secondary max-w-[34em]">
            <p>
              This policy explains what information {facts.brand.name} ({facts.entities.sales.name}{" "}
              and {facts.entities.marketing.name}) collects when you use theglobal.co.in, and how we
              use it.
            </p>

            <h2 className="text-h3 font-semibold text-ink pt-4">Information we collect</h2>
            <p>
              When you submit an enquiry form, we collect your name, phone number, city, and the
              details you provide about your requirement. Email is optional and never required.
            </p>

            <h2 className="text-h3 font-semibold text-ink pt-4">How we use it</h2>
            <p>
              We use this information only to respond to your enquiry by phone, WhatsApp, or email.
              We do not sell or share your information with third parties for marketing purposes.
            </p>

            <h2 className="text-h3 font-semibold text-ink pt-4">WhatsApp</h2>
            <p>
              Where you contact us via WhatsApp, that conversation is subject to WhatsApp&apos;s own
              privacy policy in addition to this one.
            </p>

            <h2 className="text-h3 font-semibold text-ink pt-4">Contact</h2>
            <p>
              For questions about this policy, call {facts.entities.sales.phone} or{" "}
              {facts.entities.marketing.phone}.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
