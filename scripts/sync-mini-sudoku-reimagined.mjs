import { access, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const candidates = [
  process.env.MINI_SUDOKU_REIMAGINED_OUT,
  resolve("../Daily-Games-Reimagined/apps/mini-sudoku/out"),
  resolve("../daily-games-reimagined/apps/mini-sudoku/out"),
].filter(Boolean);

const destination = resolve("public/games/mini-sudoku-reimagined");

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
  console.warn("Mini Sudoku-Reimagined sync skipped; preserving last-known-good artifact.");
  process.exit(0);
}

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });

console.log(`Synced Mini Sudoku-Reimagined from ${source}`);
