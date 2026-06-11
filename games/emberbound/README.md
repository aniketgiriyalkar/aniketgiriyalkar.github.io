# Emberbound

Emberbound is an original browser arcade game derived from the mechanics of the
historical Python/Pygame project **Maryo**. The old repository remains unchanged;
this version is a clean-room web implementation with original generated
characters, a photorealistic landscape, and procedural sound.

## Architecture

- `index.html` supplies the accessible game shell, HUD, overlays, and controls.
- `styles.css` handles the responsive 2:1 playfield and touch interface.
- `js/engine.js` contains deterministic level, movement, bounds, and collision
  rules. It has no browser dependencies and is unit-tested.
- `assets/` contains the generated Himalayan backdrop, cinematic expedition
  pilots with jetpacks, and the original three-eyed fire dragon.
- `js/game.js` owns the Canvas render loop, pilot choice, moving obstacles,
  particles, sound, and UI.
- `js/score-provider.js` defines the `ScoreRecord` shape and asynchronous
  `ScoreProvider` contract, with `LocalScoreProvider` as the current adapter.

The game simulates a fixed 1200×600 world and lets CSS scale the Canvas while
preserving its aspect ratio. Motion uses elapsed seconds rather than frames.

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Rise | Up Arrow or W | Rise button |
| Dive | Down Arrow or S | Dive button |
| Pause | P or Escape | Pause button |
| Mute | M | Sound button |
| Restart | Enter | Fly again button |

Choose a man or woman pilot before starting. When no movement key is held,
gravity pulls the player downward.

## Scoring and Levels

The score increases while the player survives. Levels advance every 250 points
without pausing the simulation. Progression is endless. Fixed flight boundaries
keep the playable space stable while cliffs, pine trees, rock spires, and ruins
cross the route. Projectile speed and frequency also increase. After level 10,
a wyvern and an ember warden join the three-eyed dragon with independent
movement and projectile patterns.

Collision detection uses `Array.prototype.some`, ensuring every active
projectile and obstacle is checked. This corrects the early-return bug in the
historical Python loop.

## Local Setup

From the portfolio repository:

```bash
npm install
npm run dev
```

The `predev` script synchronizes this directory into
`public/games/emberbound/`. Open:

```text
http://localhost:3000/games/emberbound/
```

Run the engine and storage tests with:

```bash
npm test
```

## High Scores and Future PostgreSQL Support

`LocalScoreProvider` persists a versioned score record under
`emberbound:high-score:v1`. Invalid or unavailable browser storage falls back
without preventing gameplay.

A shared leaderboard should be implemented as a separate HTTPS API because
GitHub Pages cannot run Python or PostgreSQL. A future
`HttpLeaderboardProvider` can implement the same asynchronous interface:

```js
class HttpLeaderboardProvider {
  async getHighScore() {}
  async submitScore(record) {}
}
```

The suggested service is FastAPI with PostgreSQL, server-side validation,
rate-limiting, name moderation, restricted CORS, and credentials stored only in
the deployment platform. No database credentials or secrets belong in this
repository.
