import Link from "next/link";
import { profile, socialLinks } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="brand" href="/">
            <span className="brand-mark">AG</span>
            <span>Aniket Giriyalkar</span>
          </Link>
          <p>Engineering thoughtful systems, useful data, and interactive work.</p>
        </div>
        <div className="footer-links">
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="footer-meta">
          Built with Next.js. Static by design.
          <br />© {new Date().getFullYear()} Aniket Giriyalkar
        </p>
      </div>
    </footer>
  );
}
