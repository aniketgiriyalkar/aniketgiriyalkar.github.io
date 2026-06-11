import type { Metadata } from "next";
import { education, experience, profile } from "@/data/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero shell">
        <p className="eyebrow">About / Builder profile</p>
        <h1>Technical range, grounded in outcomes.</h1>
        <p className="page-lede">
          My background crosses software delivery, data management, analytics,
          and product-facing development. I care about understanding the whole
          system, then making the complicated parts legible.
        </p>
        <div className="notice">{profile.note}</div>
      </section>
      <section className="section shell split-section">
        <div>
          <p className="eyebrow">Experience</p>
          <h2>Where I have worked.</h2>
        </div>
        <div className="timeline">
          {experience.map((item) => (
            <article key={item.organization}>
              <span>{item.period}</span>
              <h3>{item.role}</h3>
              <h4>{item.organization}</h4>
              <p>{item.summary}</p>
              <small>{item.technologies}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="section shell split-section">
        <div>
          <p className="eyebrow">Education</p>
          <h2>Formal foundations.</h2>
        </div>
        <div className="education-grid">
          {education.map((item) => (
            <article key={item.school}>
              <span>{item.status}</span>
              <h3>{item.school}</h3>
              <p>{item.degree}</p>
              <small>{item.focus}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
