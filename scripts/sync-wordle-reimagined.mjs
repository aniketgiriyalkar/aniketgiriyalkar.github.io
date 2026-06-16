import { access, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const candidates = [
  process.env.WORDLE_REIMAGINED_OUT,
  resolve("../Wordle-Reimagined/apps/web/out"),
  resolve("../wordle-reimagined/apps/web/out"),
].filter(Boolean);

const destination = resolve("public/games/wordle-reimagined");

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
  console.warn("Wordle-Reimagined sync skipped; preserving last-known-good artifact.");
  process.exit(0);
}

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });

console.log(`Synced Wordle-Reimagined from ${source}`);
