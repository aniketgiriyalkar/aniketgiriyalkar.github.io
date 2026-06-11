# Aniket Giriyalkar — Portfolio

A statically exported Next.js portfolio organized around software engineering,
data engineering and science, app development, and selected personal interests.
It also includes **Emberbound**, an original browser arcade game evolved from a
historical Python/Pygame training project.

## Stack

- Next.js App Router with TypeScript
- Static export for GitHub Pages
- Content modeled in typed local data
- Dependency-free HTML Canvas game
- Node test runner for game rules and score persistence

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

## Deployment

The GitHub Actions workflow builds and deploys `out/` to GitHub Pages. Pages is
static hosting: a future shared Emberbound leaderboard must run as a separately
hosted API. The planned boundary is an asynchronous score-provider interface,
allowing a FastAPI/PostgreSQL adapter without coupling database concerns to the
game loop.

No secrets or database credentials are used by this project.
