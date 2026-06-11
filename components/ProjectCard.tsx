import type { Project } from "@/types/content";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className="project-card"
      style={{ "--card-accent": project.accent } as React.CSSProperties}
    >
      <div className="project-topline">
        <span>PROJECT / {String(index + 1).padStart(2, "0")}</span>
        <span>{project.status ?? project.year}</span>
      </div>
      <div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
      </div>
      <ul className="tag-list" aria-label="Technologies">
        {project.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <div className="card-actions">
        {project.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
          >
            {link.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </article>
  );
}
