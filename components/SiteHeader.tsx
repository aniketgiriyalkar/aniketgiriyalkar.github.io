"use client";

import Link from "next/link";
import { useState } from "react";
import { profile } from "@/data/site";

const links = [
  ["Work", "/projects/"],
  ["About", "/about/"],
  ["Personal", "/personal/"],
  ["Contact", "/contact/"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <span className="brand-mark">AG</span>
          <span>Aniket Giriyalkar</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span />
          <span />
        </button>
        <nav id="site-navigation" className={open ? "nav open" : "nav"}>
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Resume ↗
          </a>
          <a
            className="nav-game"
            href="/games/emberbound/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Play Emberbound ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
