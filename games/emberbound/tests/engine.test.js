import test from "node:test";
import assert from "node:assert/strict";
import {
  LEVELS,
  getFlightBounds,
  getLevel,
  getVillainRoster,
  hasFireballCollision,
  updateObstacles,
  updatePlayer,
} from "../js/engine.js";

test("level thresholds continue indefinitely in 250-point steps", () => {
  assert.equal(getLevel(0).number, 1);
  assert.equal(getLevel(249).number, 1);
  assert.equal(getLevel(250).number, 2);
  assert.equal(getLevel(500).number, 3);
  assert.equal(getLevel(750).number, 4);
  assert.equal(getLevel(1_000).number, 5);
  assert.equal(getLevel(2_250).number, 10);
  assert.equal(getLevel(10_000).number, 41);
});

test("all active fireballs are checked for collision", () => {
  const player = { x: 10, y: 10, width: 20, height: 20 };
  const fireballs = [
    { x: 100, y: 100, width: 10, height: 10, active: true },
    { x: 15, y: 15, width: 10, height: 10, active: true },
    { x: 300, y: 300, width: 10, height: 10, active: true },
  ];
  assert.equal(hasFireballCollision(player, fireballs), true);
});

test("inactive fireballs do not collide", () => {
  const player = { x: 10, y: 10, width: 20, height: 20 };
  assert.equal(
    hasFireballCollision(player, [
      { x: 15, y: 15, width: 10, height: 10, active: false },
    ]),
    false,
  );
});

test("gravity moves an idle player downward using delta time", () => {
  const player = {
    x: 10,
    y: 100,
    width: 20,
    height: 20,
    moveSpeed: 300,
    gravity: 100,
  };
  const next = updatePlayer(
    player,
    { up: false, down: false },
    0.5,
    getFlightBounds(LEVELS[0]),
  );
  assert.equal(next.y, 150);
  assert.equal(next.velocity, 100);
});

test("flight bounds stay fixed while difficulty moves into obstacles", () => {
  const first = getFlightBounds(LEVELS[0]);
  const late = getFlightBounds(getLevel(4_000));
  assert.deepEqual(late, first);
});

test("obstacles move across the path and expired obstacles are removed", () => {
  const obstacles = updateObstacles(
    [
      { x: 300, width: 60, speed: 100 },
      { x: -100, width: 20, speed: 100 },
    ],
    0.5,
  );
  assert.equal(obstacles.length, 1);
  assert.equal(obstacles[0].x, 250);
});

test("multiple villains enter after level ten", () => {
  assert.deepEqual(getVillainRoster(10), ["dragon"]);
  assert.deepEqual(getVillainRoster(11), ["dragon", "wyvern", "warden"]);
});
