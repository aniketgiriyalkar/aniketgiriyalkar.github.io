export const WORLD = Object.freeze({ width: 1200, height: 600 });

export const LEVELS = Object.freeze([
  { number: 1, threshold: 0, spawnEvery: 1.35, fireballSpeed: 350 },
  { number: 2, threshold: 250, spawnEvery: 1.15, fireballSpeed: 410 },
  { number: 3, threshold: 500, spawnEvery: 0.98, fireballSpeed: 475 },
  { number: 4, threshold: 750, spawnEvery: 0.84, fireballSpeed: 545 },
]);

export function getLevel(score) {
  const safeScore = Number.isFinite(score) ? Math.max(0, score) : 0;
  const number = Math.floor(safeScore / 250) + 1;
  if (number <= LEVELS.length) return LEVELS[number - 1];

  const extra = number - LEVELS.length;
  return {
    number,
    threshold: (number - 1) * 250,
    spawnEvery: Math.max(0.3, LEVELS[3].spawnEvery - extra * 0.025),
    fireballSpeed: Math.min(860, LEVELS[3].fireballSpeed + extra * 22),
  };
}

export function rectanglesOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function hasFireballCollision(player, fireballs) {
  return fireballs.some(
    (fireball) => fireball.active !== false && rectanglesOverlap(player, fireball),
  );
}

export function getFlightBounds() {
  return {
    top: 26,
    bottom: WORLD.height - 24,
  };
}

export function getVillainRoster(levelNumber) {
  const roster = ["dragon"];
  if (levelNumber > 10) roster.push("wyvern", "warden");
  return roster;
}

export function updatePlayer(player, input, deltaSeconds, bounds) {
  const direction = Number(input.down) - Number(input.up);
  const controlVelocity = direction * player.moveSpeed;
  const velocity = direction === 0 ? player.gravity : controlVelocity;
  const y = player.y + velocity * deltaSeconds;
  return {
    ...player,
    y,
    velocity,
    outOfBounds: y <= bounds.top || y + player.height >= bounds.bottom,
  };
}

export function updateFireballs(fireballs, deltaSeconds) {
  return fireballs
    .map((fireball) => ({
      ...fireball,
      x:
        fireball.x +
        (fireball.vx ?? -fireball.speed) * deltaSeconds,
      y: fireball.y + (fireball.vy ?? 0) * deltaSeconds,
    }))
    .filter(
      (fireball) =>
        fireball.x + fireball.width > -40 &&
        fireball.y + fireball.height > -40 &&
        fireball.y < WORLD.height + 40,
    );
}

export function updateObstacles(obstacles, deltaSeconds) {
  return obstacles
    .map((obstacle) => ({
      ...obstacle,
      x: obstacle.x - obstacle.speed * deltaSeconds,
    }))
    .filter((obstacle) => obstacle.x + obstacle.width > -60);
}
