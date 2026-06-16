const games = [
  {
    title: "Wordle-Reimagined",
    status: "New / Word logic",
    description:
      "A polished 4- and 5-letter word game with physical keyboard play, color feedback, offline fallback, and an optional NestJS backend for daily puzzles.",
    href: "/games/wordle-reimagined/",
    repo: "https://github.com/aniketgiriyalkar/Wordle-Reimagined",
    accent: "#6bb8ff",
  },
  {
    title: "Emberbound",
    status: "Arcade / Canvas",
    description:
      "A responsive browser arcade game evolved from a Python training project, with endless hazards, local high scores, and touch-friendly controls.",
    href: "/games/emberbound/",
    repo: "https://github.com/aniketgiriyalkar/Arcade_Game-Internshala-Certified-Python-Training-",
    accent: "#ff7043",
  },
];

export default function GamesPage() {
  return (
    <main>
      <section className="page-hero shell games-hero">
        <p className="eyebrow">Games / Interactive work</p>
        <h1>Playable experiments with real product polish.</h1>
        <p>
          A small arcade of browser-first projects, from fast word logic to canvas action.
        </p>
      </section>

      <section className="section shell">
        <div className="games-grid">
          {games.map((game) => (
            <article
              className="game-launch-card"
              key={game.title}
              style={{ "--card-accent": game.accent } as React.CSSProperties}
            >
              <div>
                <span>{game.status}</span>
                <h2>{game.title}</h2>
                <p>{game.description}</p>
              </div>
              <div className="card-actions">
                <a href={game.href}>Play Game <span aria-hidden="true">↗</span></a>
                <a href={game.repo} target="_blank" rel="noopener noreferrer">
                  Repository <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
