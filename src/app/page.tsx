import Link from "next/link";
import { Hero } from "@/components/Hero";
import { CredentialBand } from "@/components/CredentialBand";
import { DivisionCard } from "@/components/DivisionCard";
import { BentoGrid } from "@/components/BentoGrid";
import { StatementSection } from "@/components/StatementSection";
import { ProjectPlate } from "@/components/ProjectPlate";
import { AudienceRow } from "@/components/AudienceRow";
import { ContactSection } from "@/components/ContactSection";
import { ColorRevealSection } from "@/components/ColorRevealSection";
import { projects } from "@/content/projects";
import { audiences } from "@/content/audiences";

export default function Home() {
  return (
    <main id="main-content">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Credential band — the hero ends on a dark navy scrim, so this crossfades up to it */}
      <ColorRevealSection from="var(--navy-900)" to="var(--canvas-sunken)">
        <CredentialBand />
      </ColorRevealSection>

      {/* 3. The two divisions */}
      <ColorRevealSection from="var(--canvas-sunken)" to="var(--canvas)">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-h2 font-bold text-center mb-12">Two businesses. One standard.</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <DivisionCard
                brand="somany"
                entityName="Global Marketing"
                heading="Somany tiles & sanitaryware"
                description="Exclusive authorised Somany distributor for Rajasthan — floor tiles, wall tiles, slabs, sanitaryware and bath fittings."
                href="/somany"
                imageLabel="Somany large-format slab"
                imageAlt="A single large-format Somany tile slab photographed on a near-white sweep"
              />
              <DivisionCard
                brand="astral"
                entityName="Global Sales"
                heading="Astral pipes & plumbing"
                description="Authorised Astral distributor — pipes, fittings, plumbing, water and drainage systems."
                href="/astral"
                imageLabel="Astral pipe fitting"
                imageAlt="A single Astral pipe joint photographed on a near-white sweep"
              />
            </div>
          </div>
        </section>
      </ColorRevealSection>

      {/* 4. Capability bento */}
      <ColorRevealSection from="var(--canvas)" to="var(--canvas)">
        <BentoGrid />
      </ColorRevealSection>

      {/* 5. Editorial statement — the one deliberate dark beat, Apple-style, ambient not jacked */}
      <ColorRevealSection from="var(--canvas)" to="var(--navy-900)">
        <StatementSection />
      </ColorRevealSection>

      {/* 6. Selected projects */}
      <ColorRevealSection from="var(--navy-900)" to="var(--canvas)">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-h2 font-bold text-center mb-12">Supplied, delivered, built.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectPlate key={project.slug} project={project} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/projects"
                className="text-lg font-semibold text-navy-800 underline underline-offset-4"
              >
                View all projects ›
              </Link>
            </div>
          </div>
        </section>
      </ColorRevealSection>

      {/* 7. Who we supply */}
      <ColorRevealSection from="var(--canvas)" to="var(--canvas-sunken)">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-h2 font-bold text-center mb-12">Who we supply</h2>
            <div>
              {audiences.map((audience) => (
                <AudienceRow key={audience.label} audience={audience} />
              ))}
            </div>
          </div>
        </section>
      </ColorRevealSection>

      {/* 8. Contact */}
      <ColorRevealSection from="var(--canvas-sunken)" to="var(--canvas-sunken)">
        <ContactSection />
      </ColorRevealSection>
    </main>
  );
}
