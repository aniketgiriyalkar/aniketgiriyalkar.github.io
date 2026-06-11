import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const source = resolve("games/emberbound");
const destination = resolve("public/games/emberbound");

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, {
  recursive: true,
  filter: (path) => !path.includes("/tests") && !path.endsWith("README.md"),
});

console.log("Synced Emberbound into public/games/emberbound");
