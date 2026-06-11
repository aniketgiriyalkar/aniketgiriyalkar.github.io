import Link from "next/link";
import { domains, projects } from "@/data/site";
import type { DomainKey } from "@/types/content";
import { ProjectCard } from "@/components/ProjectCard";

export function DomainPage({ domainKey }: { domainKey: DomainKey }) {
  const domain = domains.find((item) => item.key === domainKey);
  if (!domain) return null;
  const domainProjects = projects.filter((project) =>
    project.domains.includes(domain.key),
  );

  return (
    <main>
      <section className="page-hero shell">
        <p className="eyebrow">{domain.eyebrow}</p>
        <h1>{domain.title}</h1>
        <p className="page-lede">{domain.description}</p>
        <ul className="tag-list large" aria-label={`${domain.title} skills`}>
          {domain.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </section>
      <section className="section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Selected evidence</p>
            <h2>Projects in this domain</h2>
          </div>
          <Link href="/projects/">View all work →</Link>
        </div>
        <div className="project-grid">
          {domainProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
