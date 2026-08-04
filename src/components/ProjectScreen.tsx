import Link from "next/link";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import type { Project } from "@/content/projects";

export function ProjectScreen({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex min-h-[420px] md:min-h-[520px] items-end p-8 md:p-12 border-t border-hairline overflow-hidden"
    >
      <div className="absolute inset-0">
        <PlaceholderImage
          label={project.range}
          alt={`${project.name} in ${project.city}`}
          src={project.image}
          dark
          zoomOnHover
          className="h-full w-full"
        />
      </div>
      <div className="absolute inset-0 bg-navy-900/55" aria-hidden="true" />
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-6 w-full">
        <div>
          <h3 className="font-display text-h2 font-semibold text-white group-hover:underline">
            {project.name}
          </h3>
          <p className="text-body text-white/70 mt-2">
            {project.city} · {project.year}
          </p>
        </div>
        <p className="text-spec text-white/70 text-right leading-loose">
          RANGE SUPPLIED
          <br />
          <span className="text-white font-medium">{project.range}</span>
        </p>
      </div>
    </Link>
  );
}
