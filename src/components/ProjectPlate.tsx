import Link from "next/link";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import type { Project } from "@/content/projects";

export function ProjectPlate({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="block group">
      <PlaceholderImage
        label={project.range}
        alt={`${project.name} in ${project.city}`}
        className="aspect-[4/3] rounded-2xl"
      />
      <p className="mt-4 text-h3 font-semibold text-ink group-hover:underline">{project.name}</p>
      <p className="text-body text-ink-secondary">
        {project.city} · {project.year}
      </p>
    </Link>
  );
}
