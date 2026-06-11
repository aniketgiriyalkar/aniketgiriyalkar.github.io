import test from "node:test";
import assert from "node:assert/strict";
import {
  LocalScoreProvider,
  SCORE_STORAGE_KEY,
  createScoreRecord,
} from "../js/score-provider.js";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("stores and retrieves a valid high score", async () => {
  const provider = new LocalScoreProvider(memoryStorage());
  await provider.submitScore(createScoreRecord(1_245, 4, new Date(0)));
  const result = await provider.getHighScore();
  assert.equal(result.score, 1_245);
  assert.equal(result.level, 4);
});

test("does not replace a higher score with a lower score", async () => {
  const provider = new LocalScoreProvider(memoryStorage());
  await provider.submitScore(createScoreRecord(900, 4));
  const winner = await provider.submitScore(createScoreRecord(300, 2));
  assert.equal(winner.score, 900);
});

test("malformed stored data safely falls back to null", async () => {
  const provider = new LocalScoreProvider(
    memoryStorage({ [SCORE_STORAGE_KEY]: "{broken-json" }),
  );
  assert.equal(await provider.getHighScore(), null);
});

test("unavailable storage does not prevent score submission", async () => {
  const storage = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  const provider = new LocalScoreProvider(storage);
  const result = await provider.submitScore(createScoreRecord(500, 3));
  assert.equal(result.score, 500);
});
