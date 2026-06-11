import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/site";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <main>
      <section className="page-hero shell">
        <p className="eyebrow">Work / Selected repository archive</p>
        <h1>Projects across the stack.</h1>
        <p className="page-lede">
          A curated set of systems, analytical work, mobile prototypes, and
          interactive builds. Each card links back to its source.
        </p>
      </section>
      <section className="section shell">
        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
