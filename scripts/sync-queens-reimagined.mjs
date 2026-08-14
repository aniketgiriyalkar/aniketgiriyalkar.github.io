import { access, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const candidates = [
  process.env.DAILY_GAMES_REIMAGINED_OUT,
  resolve("../Daily-Games-Reimagined/out"),
  resolve("../daily-games-reimagined/out"),
].filter(Boolean);

const destination = resolve("public/games/queens-reimagined");

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

let source;

for (const candidate of candidates) {
  if (await exists(candidate)) {
    source = candidate;
    break;
  }
}

if (!source) {
  console.warn("Queens-Reimagined sync skipped; preserving last-known-good artifact.");
  process.exit(0);
}

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });

console.log(`Synced Queens-Reimagined from ${source}`);
