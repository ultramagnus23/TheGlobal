import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProjectPlate } from "@/components/ProjectPlate";
import { StaggerReveal } from "@/components/StaggerReveal";
import { projects } from "@/content/projects";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Materials supplied by The Global to residential and commercial projects across Rajasthan.",
  alternates: { canonical: canonical("/projects") },
};

export default function ProjectsIndexPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects" }]} />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-h1 font-bold mb-4">Supplied, delivered, built.</h1>
          <p className="text-lead text-ink-secondary max-w-[34em] mb-12">
            Real projects, captioned honestly by the product range we supplied — not a client list
            we cannot verify.
          </p>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-8" step={90}>
            {projects.map((project) => (
              <ProjectPlate key={project.slug} project={project} />
            ))}
          </StaggerReveal>
        </div>
      </section>
    </main>
  );
}
