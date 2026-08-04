import Link from "next/link";
import { ForgeSequence } from "@/components/ForgeSequence";
import { CredentialBand } from "@/components/CredentialBand";
import { AssemblyStory } from "@/components/AssemblyStory";
import { StatementSection } from "@/components/StatementSection";
import { TimelineSection } from "@/components/TimelineSection";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { StockPulse } from "@/components/StockPulse";
import { CollisionSection } from "@/components/CollisionSection";
import { ProjectScreen } from "@/components/ProjectScreen";
import { LogisticsSection } from "@/components/LogisticsSection";
import { AudienceRow } from "@/components/AudienceRow";
import { ContactSection } from "@/components/ContactSection";
import { ColorRevealSection } from "@/components/ColorRevealSection";
import { StaggerReveal } from "@/components/StaggerReveal";
import { CareSection } from "@/components/CareSection";
import { projects } from "@/content/projects";
import { audiences } from "@/content/audiences";
import { facts } from "@/content/facts";

export default function Home() {
  return (
    <main id="main-content">
      {/* 1. Hero: The Forge Sequence */}
      <ForgeSequence />

      {/* 2. Credential band */}
      <ColorRevealSection from="var(--navy-900)" to="var(--canvas-sunken)">
        <CredentialBand />
      </ColorRevealSection>

      {/* 3. Who we supply: surfaced early so each of the five buyer types
          reaches their next step before the editorial brand story, not after it */}
      <ColorRevealSection from="var(--canvas-sunken)" to="var(--canvas)">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-display text-h2 font-semibold text-ink text-center mb-12">
              Who we supply
            </h2>
            <StaggerReveal>
              {audiences.map((audience) => (
                <AudienceRow key={audience.label} audience={audience} />
              ))}
            </StaggerReveal>
          </div>
        </section>
      </ColorRevealSection>

      {/* 4. Assembly story: from foundation to finish */}
      <ColorRevealSection from="var(--canvas)" to="var(--canvas)">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-[42ch] mb-16">
              <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold text-ink-tertiary">
                From Foundation to Finish
              </p>
              <h2 className="font-display text-h2 font-semibold text-ink mt-3">
                Every remarkable building begins with invisible decisions.
              </h2>
            </div>
            <AssemblyStory />
          </div>
        </section>
      </ColorRevealSection>

      {/* 5. Editorial statement */}
      <ColorRevealSection from="var(--canvas)" to="var(--navy-900)">
        <StatementSection />
      </ColorRevealSection>

      {/* 6. Who we are / timeline */}
      <ColorRevealSection from="var(--navy-900)" to="var(--canvas)">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold text-ink-tertiary">
              Who We Are
            </p>
            <h2 className="font-display text-h2 font-semibold text-ink mt-3 max-w-[22ch]">
              {facts.brand.yearsInOperation} of quietly keeping Rajasthan&apos;s construction sites
              supplied.
            </h2>
            <div className="mt-12">
              <TimelineSection />
            </div>
            <PlaceholderImage
              label="Warehouse & distribution network"
              alt="Warehouse and distribution network"
              src="/images/real/warehouse-network.webp"
              className="mt-12 h-[340px] rounded-2xl"
            />
          </div>
        </section>
      </ColorRevealSection>

      {/* 6b. What reliability means here */}
      <ColorRevealSection from="var(--canvas)" to="var(--canvas)">
        <CareSection />
      </ColorRevealSection>

      {/* 7. The Stock Pulse */}
      <ColorRevealSection from="var(--canvas)" to="var(--navy-900)">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <StockPulse />
          </div>
        </section>
      </ColorRevealSection>

      {/* 8. The Collision: Astral x Somany */}
      <ColorRevealSection from="var(--navy-900)" to="var(--navy-900)">
        <CollisionSection />
      </ColorRevealSection>

      {/* 9. Projects */}
      <ColorRevealSection from="var(--navy-900)" to="var(--canvas)">
        <section className="pt-24 md:pt-32">
          <div className="mx-auto max-w-6xl px-6 pb-16">
            <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold text-ink-tertiary">
              Projects
            </p>
            <h2 className="font-display text-h2 font-semibold text-ink mt-3">
              Where the materials end up.
            </h2>
          </div>
          {projects.map((project) => (
            <ProjectScreen key={project.slug} project={project} />
          ))}
          <div className="text-center py-12 border-t border-hairline">
            <Link
              href="/projects"
              className="text-lg font-semibold text-navy-800 underline underline-offset-4"
            >
              View all projects ›
            </Link>
          </div>
        </section>
      </ColorRevealSection>

      {/* 10. Logistics */}
      <ColorRevealSection from="var(--canvas)" to="var(--canvas-sunken)">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <p className="text-eyebrow uppercase tracking-[0.1em] font-semibold text-ink-tertiary">
              Logistics
            </p>
            <h2 className="font-display text-h2 font-semibold text-ink mt-3 mb-12 max-w-[18ch]">
              From one warehouse in Jaipur, across every district that&apos;s building.
            </h2>
            <LogisticsSection />
          </div>
        </section>
      </ColorRevealSection>

      {/* 11. Contact */}
      <ColorRevealSection from="var(--canvas-sunken)" to="var(--canvas-sunken)">
        <ContactSection />
      </ColorRevealSection>
    </main>
  );
}
