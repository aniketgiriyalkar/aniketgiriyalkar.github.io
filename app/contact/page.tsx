import type { Metadata } from "next";
import { profile, socialLinks } from "@/data/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main>
      <section className="contact-hero shell">
        <p className="eyebrow">Contact / Open channel</p>
        <h1>Have a hard problem or a useful idea?</h1>
        <p>
          I am interested in software engineering, data systems, application
          development, and projects that reward curiosity across disciplines.
        </p>
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email} <span>↗</span>
        </a>
        <div className="contact-links">
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume ↗
          </a>
          {socialLinks
            .filter((link) => link.external)
            .map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label} ↗
              </a>
            ))}
        </div>
      </section>
    </main>
  );
}
