import type { Metadata } from "next";
import { personalCards, socialLinks } from "@/data/site";

export const metadata: Metadata = { title: "Personal" };

export default function PersonalPage() {
  return (
    <main>
      <section className="page-hero shell">
        <p className="eyebrow">Off the clock / Still curious</p>
        <h1>The interests behind the work.</h1>
        <p className="page-lede">
          Good portfolios leave room for the person doing the building. This
          section will grow into a living map of hobbies, games, communities,
          and the things I follow simply because they are interesting.
        </p>
      </section>
      <section className="section shell">
        <div className="personal-grid">
          {personalCards.map((card) => (
            <article key={card.index} className="personal-card">
              <span>{card.index}</span>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
              <small>{card.status}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="section shell social-panel">
        <div>
          <p className="eyebrow">Find me online</p>
          <h2>Public channels, no noise.</h2>
        </div>
        <div className="social-list">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
            >
              <span>{link.label}</span>
              <span>↗</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
