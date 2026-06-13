import { execFile } from "node:child_process";
import { cp, mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const destination = resolve("public/football-lab");
const staging = resolve("public/.football-lab-next");
const localSource = resolve(
  process.env.FOOTBALL_LAB_SOURCE ?? "../Soccer-Analytics/out",
);
const releaseUrl =
  process.env.FOOTBALL_LAB_RELEASE_URL ??
  "https://github.com/aniketgiriyalkar/Soccer-Analytics/releases/download/football-lab-latest/football-lab.zip";
const useRemote = process.argv.includes("--remote") || process.env.FOOTBALL_LAB_REMOTE === "1";

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function fetchRelease() {
  const response = await fetch(releaseUrl);
  if (!response.ok) {
    throw new Error(`Football Lab release returned HTTP ${response.status}`);
  }
  const archive = resolve(tmpdir(), `football-lab-${Date.now()}.zip`);
  const extract = resolve(tmpdir(), `football-lab-${Date.now()}`);
  await writeFile(archive, Buffer.from(await response.arrayBuffer()));
  await mkdir(extract, { recursive: true });
  await execFileAsync("unzip", ["-q", archive, "-d", extract]);
  await rm(archive, { force: true });
  return extract;
}

async function validate(source) {
  const required = ["index.html", "build-manifest.json", "data/football-lab.json"];
  for (const path of required) {
    if (!(await exists(resolve(source, path)))) {
      throw new Error(`Football Lab artifact is missing ${path}`);
    }
  }
  const manifest = JSON.parse(
    await readFile(resolve(source, "build-manifest.json"), "utf8"),
  );
  if (manifest.product !== "football-lab" || manifest.canonicalPath !== "/football-lab/") {
    throw new Error("Football Lab build manifest does not match the portfolio route");
  }
  return manifest;
}

let source = localSource;
let temporarySource;

try {
  if (useRemote) {
    temporarySource = await fetchRelease();
    source = temporarySource;
  } else if (!(await exists(source))) {
    if (await exists(destination)) {
      console.log("Football Lab source not present; preserving the vendored artifact.");
      process.exit(0);
    }
    throw new Error(`Football Lab source does not exist: ${source}`);
  }

  const manifest = await validate(source);
  await rm(staging, { recursive: true, force: true });
  await mkdir(staging, { recursive: true });
  await cp(source, staging, { recursive: true });
  await rm(destination, { recursive: true, force: true });
  await rename(staging, destination);

  console.log(
    `Synced Football Lab ${manifest.sourceCommit.slice(0, 12)} (${manifest.dataVersion}) from ${basename(source)}`,
  );
} catch (error) {
  await rm(staging, { recursive: true, force: true });
  if (await exists(destination)) {
    console.warn(`Football Lab sync skipped; preserving last-known-good artifact: ${error.message}`);
  } else {
    throw error;
  }
} finally {
  if (temporarySource) {
    await rm(temporarySource, { recursive: true, force: true });
  }
}
