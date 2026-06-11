import Link from "next/link";
import { domains, profile, projects } from "@/data/site";
import { ProjectCard } from "@/components/ProjectCard";

export default function Home() {
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <main>
      <section className="hero shell">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Portfolio / 2026</p>
            <h1>
              Building across
              <span> systems, data,</span>
              and experiences.
            </h1>
            <p className="hero-lede">{profile.intro}</p>
            <div className="hero-actions">
              <Link className="button primary" href="/projects/">
                Explore the work
              </Link>
              <a className="button ghost" href={`mailto:${profile.email}`}>
                Start a conversation
              </a>
              <a
                className="button ghost"
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View resume ↗
              </a>
            </div>
          </div>
          <div className="hero-console" aria-label="Profile summary">
            <div className="console-bar">
              <span />
              <span />
              <span />
              <b>aniket.profile</b>
            </div>
            <div className="console-content">
              <p><i>const</i> focus = [</p>
              <p className="indent">&quot;software engineering&quot;,</p>
              <p className="indent">&quot;data + intelligence&quot;,</p>
              <p className="indent">&quot;web + mobile apps&quot;</p>
              <p>];</p>
              <p className="console-result">
                → curious, cross-functional, always shipping
              </p>
            </div>
          </div>
        </div>
        <div className="hero-index" aria-hidden="true">AG / 03</div>
      </section>

      <section className="section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Navigate by domain</p>
            <h2>One builder, multiple lenses.</h2>
          </div>
          <p>Choose a discipline to see the projects and capabilities behind it.</p>
        </div>
        <div className="domain-grid">
          {domains.map((domain) => (
            <Link
              className="domain-card"
              href={domain.href}
              key={domain.key}
              style={{ "--card-accent": domain.accent } as React.CSSProperties}
            >
              <span className="domain-eyebrow">{domain.eyebrow}</span>
              <h3>{domain.title}</h3>
              <p>{domain.description}</p>
              <span className="domain-arrow">Explore domain →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured work</p>
            <h2>Projects with a point of view.</h2>
          </div>
          <Link href="/projects/">All projects →</Link>
        </div>
        <div className="project-grid">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </section>

    </main>
  );
}
