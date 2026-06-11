# Pull Request: Emberbound and Portfolio Revamp

## Summary

- Replace the legacy Bootstrap/jQuery portfolio with a statically exported
  Next.js App Router site.
- Organize work across software engineering, data engineering and science, and
  app development.
- Add curated project, about, personal, and contact pages.
- Add Emberbound, an original responsive Canvas remake of the historical Maryo
  Python game.
- Refresh the portfolio README so it documents the linked repositories, the
  resume, and likely modernization paths.

## Emberbound

- Endless 250-point levels with uninterrupted transitions and survival scoring.
- Three-eyed dragon, wyvern, and ember warden encounters after level 10.
- Man/woman pilot selection and a generated photorealistic mountain backdrop.
- Frame-rate-independent movement, gravity, moving route obstacles, and
  complete collision checks across every active threat.
- Keyboard and touch controls, pause, mute, restart, countdowns, particles, and
  procedural sound.
- Versioned local high-score persistence behind an asynchronous provider
  interface ready for a future FastAPI/PostgreSQL implementation.
- Original generated jetpack pilots, three-eyed dragon, and Himalayan scenery;
  no Mario graphics or music are included.

## Portfolio

- Dark technical editorial visual system with responsive card navigation.
- Accessible focus states, semantic structure, and reduced-motion support.
- Verified GitHub, LinkedIn, repository, and email links.
- Add the latest resume as a static PDF linked from the navigation, homepage,
  contact page, and footer.
- Explicit placeholders for current career dates, personal interests, and
  PlayStation details that still need refreshed content.

## Repository Docs Sweep

- Updated the README in the original Maryo/Pygame repo so it clearly explains
  the historical role of that project and its browser-first successor.
- Reworked the README files in the linked analytics, backend, Vue, Flutter, and
  network/security repositories so they read like user-facing project docs.
- Added modernization notes across the project READMEs to point at stronger
  2026-era stacks such as `Phaser 3`, `FastAPI`, `Vue 3 + Vite`, `Flutter +
  Supabase`, and `PostGIS`-backed location services.

## Validation

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Manual desktop/mobile review of the exported portfolio and game

## Deployment

The included GitHub Actions workflow validates and exports the site, then
deploys `out/` to GitHub Pages. No backend, secrets, or database credentials are
included.

## Future Work

- Replace remaining profile placeholders with current details.
- Add richer project case studies and live demos.
- Implement a separately hosted FastAPI/PostgreSQL leaderboard with rate
  limiting, validation, moderation, and restricted CORS.
