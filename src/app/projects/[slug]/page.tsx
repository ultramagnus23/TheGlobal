import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { projects } from "@/content/projects";
import { canonical } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — ${project.city}`,
    description: project.blurb,
    alternates: { canonical: canonical(`/projects/${slug}`) },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project.name },
        ]}
      />

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-4xl px-6 space-y-8">
          <PlaceholderImage
            label={project.range}
            alt={`${project.name} in ${project.city}`}
            src={project.image}
            className="aspect-[16/9] rounded-2xl"
          />
          <div>
            <h1 className="text-h1 font-bold">{project.name}</h1>
            <p className="text-lead text-ink-secondary mt-2">
              {project.city} · {project.year}
            </p>
          </div>
          <p className="text-body text-ink-secondary max-w-[34em]">{project.blurb}</p>
          <p className="text-body font-semibold text-ink">Range supplied: {project.range}</p>
        </div>
      </section>
    </main>
  );
}
