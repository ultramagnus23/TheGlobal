import Link from "next/link";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import type { Project } from "@/content/projects";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface ProjectPlateProps {
  project: Project;
  className?: string;
  style?: CSSProperties;
}

export function ProjectPlate({ project, className, style }: ProjectPlateProps) {
  return (
    <Link href={`/projects/${project.slug}`} className={cn("block group", className)} style={style}>
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
