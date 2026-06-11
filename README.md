# Aniket Giriyalkar — Portfolio

A statically exported Next.js portfolio organized around software engineering,
data engineering and science, app development, and selected personal interests.
It also includes **Emberbound**, an original browser arcade game evolved from a
historical Python/Pygame training project, plus a current resume download and
links to the supporting project repositories behind the portfolio.

## Stack

- Next.js App Router with TypeScript
- Static export for GitHub Pages
- Content modeled in typed local data
- Dependency-free HTML Canvas game
- Node test runner for game rules and score persistence
- Resume and project links are served as static assets for GitHub Pages

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run build` generates the deployable site in `out/`. The Emberbound source
lives in `games/emberbound/` and is synchronized to the public static tree by
the `predev` and `prebuild` hooks.

## Content Updates

Portfolio projects, profile details, social links, experience, education, and
personal placeholders are defined in `data/site.ts`. Replace items marked as
placeholders when refreshed details are available.

The current public resume is stored at
`public/resume/Aniket-Giriyalkar-Resume.pdf`. Replacing that file preserves the
resume links used across the header, homepage, contact page, and footer.

## Linked Projects

The website points to a small collection of supporting repositories. Each one
describes a different part of the portfolio and can be modernized in a future
pass without changing the public site design.

- `Arcade_Game-Internshala-Certified-Python-Training-` - original Maryo/Pygame
  training project preserved as the historical baseline.
- `Soccer-Analytics` - World Cup xG modeling and player analysis notebooks.
- `Orders_Microservice` - order-processing API with Sequelize and PostgreSQL.
- `Appointment-booking-management-system` - Vue appointment management app.
- `ShoppingCart` - Vue storefront with cart, filters, and routing.
- `login_flutter` - Flutter login/register prototype backed by PHP/MySQL.
- `Traffic-Alert-System-Using-VANET` - location-aware traffic alert project.
- `ARP-Spoof-Detection-Algorithm-Using-ICMP-Protocol` - network-security
  detection prototype based on the referenced paper.

## Suggested Revamps

If you revisit the remaining repositories, these are the most sensible upgrade
paths:

- Arcade game: `Phaser 3` or `TypeScript + Canvas` for a browser-first game.
- Soccer analytics: `Python + Polars + DuckDB + Streamlit` or `Quarto` for a
  more polished analytics experience.
- Orders microservice: `FastAPI` or `NestJS` with `Prisma`, Docker, and a
  cleaner OpenAPI-first contract.
- Vue booking and cart apps: `Vue 3 + TypeScript + Vite + Pinia`.
- Flutter login: `Flutter + Supabase` or `Flutter + Firebase Auth` instead of
  handwritten PHP session plumbing.
- Traffic alert system: `React Native` or `Flutter` with `PostGIS`-backed maps.
- ARP detection: a `Python + FastAPI` dashboard, or a `Go`/`Rust` agent with a
  web UI for real-time findings.

## Deployment

The GitHub Actions workflow builds and deploys `out/` to GitHub Pages. Pages is
static hosting: a future shared Emberbound leaderboard must run as a separately
hosted API. The planned boundary is an asynchronous score-provider interface,
allowing a FastAPI/PostgreSQL adapter without coupling database concerns to the
game loop.

No secrets or database credentials are used by this project.
