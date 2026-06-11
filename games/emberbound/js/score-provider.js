/**
 * @typedef {Object} ScoreRecord
 * @property {number} score
 * @property {number} level
 * @property {string} achievedAt
 * @property {1} version
 */

/**
 * @interface ScoreProvider
 * @property {() => Promise<ScoreRecord | null>} getHighScore
 * @property {(record: ScoreRecord) => Promise<ScoreRecord>} submitScore
 */

export const SCORE_STORAGE_KEY = "emberbound:high-score:v1";

function normalizeRecord(value) {
  if (
    !value ||
    typeof value !== "object" ||
    !Number.isFinite(value.score) ||
    value.score < 0 ||
    !Number.isInteger(value.level) ||
    value.level < 1
  ) {
    return null;
  }

  return {
    score: Math.floor(value.score),
    level: value.level,
    achievedAt:
      typeof value.achievedAt === "string"
        ? value.achievedAt
        : new Date(0).toISOString(),
    version: 1,
  };
}

export class LocalScoreProvider {
  constructor(storage = globalThis.localStorage) {
    this.storage = storage;
  }

  async getHighScore() {
    try {
      const raw = this.storage?.getItem(SCORE_STORAGE_KEY);
      return raw ? normalizeRecord(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  }

  async submitScore(record) {
    const candidate = normalizeRecord(record);
    if (!candidate) {
      throw new TypeError("Invalid Emberbound score record");
    }

    const existing = await this.getHighScore();
    const winner = !existing || candidate.score > existing.score ? candidate : existing;

    try {
      this.storage?.setItem(SCORE_STORAGE_KEY, JSON.stringify(winner));
    } catch {
      // Gameplay remains available when storage is blocked or full.
    }

    return winner;
  }
}

export function createScoreRecord(score, level, now = new Date()) {
  return {
    score: Math.max(0, Math.floor(score)),
    level: Math.max(1, Math.floor(level)),
    achievedAt: now.toISOString(),
    version: 1,
  };
}
