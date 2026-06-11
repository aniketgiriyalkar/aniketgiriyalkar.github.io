import {
  WORLD,
  getFlightBounds,
  getLevel,
  getVillainRoster,
  hasFireballCollision,
  updateFireballs,
  updateObstacles,
  updatePlayer,
} from "./engine.js";
import { LocalScoreProvider, createScoreRecord } from "./score-provider.js";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = true;

const elements = {
  score: document.querySelector("#score"),
  highScore: document.querySelector("#high-score"),
  level: document.querySelector("#level"),
  start: document.querySelector("#start-screen"),
  countdown: document.querySelector("#countdown-screen"),
  countdownValue: document.querySelector("#countdown"),
  levelMessage: document.querySelector("#level-message"),
  gameover: document.querySelector("#gameover-screen"),
  gameoverTitle: document.querySelector("#gameover-title"),
  finalScore: document.querySelector("#final-score"),
  pauseLabel: document.querySelector("#pause-label"),
  levelBanner: document.querySelector("#level-banner"),
  levelBannerNumber: document.querySelector("#level-banner-number"),
  levelBannerMessage: document.querySelector("#level-banner-message"),
  pauseButton: document.querySelector("#pause-button"),
  muteButton: document.querySelector("#mute-button"),
  startButton: document.querySelector("#start-button"),
  restartButton: document.querySelector("#restart-button"),
  upButton: document.querySelector("#up-button"),
  downButton: document.querySelector("#down-button"),
};

const scoreProvider = new LocalScoreProvider();
const input = { up: false, down: false };
const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const scenery = new Image();
scenery.src = "./assets/himalayan-valley.png";
const pilotSprites = {
  woman: new Image(),
  man: new Image(),
};
pilotSprites.woman.src = "./assets/pilot-woman.png";
pilotSprites.man.src = "./assets/pilot-man.png";
const dragonSprite = new Image();
dragonSprite.src = "./assets/three-eye-dragon.png";

let state;
let highScore = 0;
let previousTime = performance.now();
let audioContext = null;
let muted = false;
let selectedPilot = "woman";

function initialState() {
  return {
    mode: "ready",
    paused: false,
    score: 0,
    elapsed: 0,
    level: getLevel(0),
    announcedLevel: 1,
    spawnTimers: { dragon: 0, wyvern: 0, warden: 0 },
    obstacleTimer: 0,
    dragonClock: 0,
    flash: 0,
    shake: 0,
    player: {
      x: 110,
      y: 270,
      width: 44,
      height: 58,
      pilot: selectedPilot,
      moveSpeed: 360,
      gravity: 145,
      velocity: 0,
      outOfBounds: false,
    },
    fireballs: [],
    obstacles: [],
    particles: [],
    clouds: Array.from({ length: 9 }, (_, index) => ({
      x: (index * 211) % WORLD.width,
      y: 90 + ((index * 71) % 260),
      scale: 0.55 + (index % 4) * 0.2,
      speed: 8 + (index % 3) * 5,
      alpha: 0.08 + (index % 3) * 0.035,
    })),
    stars: Array.from({ length: 70 }, (_, index) => ({
      x: (index * 173) % WORLD.width,
      y: 45 + ((index * 83) % 400),
      size: index % 5 === 0 ? 3 : 2,
      depth: 0.25 + (index % 4) * 0.18,
    })),
  };
}

function formatScore(score) {
  return Math.floor(score).toString().padStart(4, "0");
}

function setScreen(screen) {
  [elements.start, elements.countdown, elements.gameover].forEach((item) =>
    item.classList.remove("active"),
  );
  if (screen) screen.classList.add("active");
}

function setPaused(paused) {
  if (state.mode !== "playing") return;
  state.paused = paused;
  elements.pauseButton.textContent = paused ? "Resume" : "Pause";
  elements.pauseButton.setAttribute("aria-pressed", String(paused));
  elements.pauseLabel.classList.toggle("active", paused);
  input.up = false;
  input.down = false;
}

function tone(frequency, duration = 0.08, type = "square", gain = 0.035) {
  if (muted) return;
  audioContext ??= new AudioContext();
  const oscillator = audioContext.createOscillator();
  const volume = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  volume.gain.setValueAtTime(gain, audioContext.currentTime);
  volume.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + duration,
  );
  oscillator.connect(volume).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function startCountdown() {
  state.mode = "countdown";
  setScreen(elements.countdown);
  elements.levelMessage.textContent = "Prepare for flight";
  let count = 3;
  elements.countdownValue.textContent = count;
  tone(420, 0.08);

  const timer = setInterval(() => {
    count -= 1;
    if (count > 0) {
      elements.countdownValue.textContent = count;
      tone(420 + count * 70, 0.08);
      return;
    }
    clearInterval(timer);
    elements.countdownValue.textContent = "GO";
    tone(760, 0.15, "square", 0.05);
    setTimeout(() => {
      setScreen(null);
      state.mode = "playing";
      previousTime = performance.now();
    }, 450);
  }, 700);
}

function beginGame() {
  state = initialState();
  state.player.pilot = selectedPilot;
  elements.score.textContent = "0000";
  elements.level.textContent = "01";
  elements.pauseLabel.classList.remove("active");
  elements.pauseButton.textContent = "Pause";
  startCountdown();
}

async function endGame(reason) {
  if (state.mode !== "playing") return;
  state.mode = "gameover";
  state.shake = prefersReducedMotion ? 0 : 0.5;
  tone(120, 0.45, "sawtooth", 0.06);
  const record = await scoreProvider.submitScore(
    createScoreRecord(state.score, state.level.number),
  );
  highScore = record.score;
  elements.highScore.textContent = formatScore(highScore);
  elements.gameoverTitle.textContent =
    reason === "fireball"
      ? "A firebolt found you."
      : reason === "obstacle"
        ? "The mountain blocked your path."
        : "You flew beyond the safe route.";
  elements.finalScore.textContent = `Score ${Math.floor(state.score)} · Best ${highScore}`;
  setTimeout(() => setScreen(elements.gameover), 350);
}

function villainPosition(kind) {
  const bounds = getFlightBounds(state.level);
  if (kind === "wyvern") {
    return {
      x: 930,
      y:
        bounds.top +
        28 +
        ((Math.cos(state.dragonClock * 2.35) + 1) / 2) *
          (bounds.bottom - bounds.top - 90),
    };
  }
  if (kind === "warden") {
    return {
      x: 1085,
      y: bounds.bottom - 94 + Math.sin(state.dragonClock * 1.15) * 12,
    };
  }
  return {
    x: 1060,
    y:
    bounds.top +
    36 +
    ((Math.sin(state.dragonClock * 1.8) + 1) / 2) *
      (bounds.bottom - bounds.top - 116),
  };
}

function spawnProjectile(kind) {
  const origin = villainPosition(kind);
  const targetY = state.player.y + state.player.height / 2;
  const speed = state.level.fireballSpeed;
  const projectile =
    kind === "wyvern"
      ? {
          kind: "shard",
          x: origin.x - 20,
          y: origin.y + 28,
          width: 34,
          height: 16,
          speed,
          vx: -speed * 0.86,
          vy: (targetY - origin.y) * 0.22,
        }
      : kind === "warden"
        ? {
            kind: "orb",
            x: origin.x - 12,
            y: origin.y - 8,
            width: 30,
            height: 30,
            speed,
            vx: -speed * 0.68,
            vy: (targetY - origin.y) * 0.35,
          }
        : {
            kind: "ember",
            x: origin.x - 8,
            y: origin.y + 22,
            width: 42,
            height: 26,
            speed,
            vx: -speed * (0.92 + Math.random() * 0.16),
            vy: 0,
          };
  state.fireballs.push({
    ...projectile,
    phase: Math.random() * Math.PI * 2,
    active: true,
  });
  tone(kind === "warden" ? 110 : kind === "wyvern" ? 320 : 190, 0.05, "sawtooth", 0.012);
}

function spawnTrail() {
  if (prefersReducedMotion || Math.random() > 0.6) return;
  state.particles.push({
    x: state.player.x + 4,
    y: state.player.y + state.player.height / 2,
    vx: -55 - Math.random() * 45,
    vy: (Math.random() - 0.5) * 40,
    life: 0.5,
    color: Math.random() > 0.5 ? "#65e6c4" : "#ffc857",
  });
}

function spawnObstacle() {
  const fromTop = Math.random() > 0.5;
  const types = fromTop ? ["cliff", "ruin"] : ["pine", "spire", "ruin"];
  const kind = types[Math.floor(Math.random() * types.length)];
  const height =
    kind === "pine"
      ? 105 + Math.random() * 85
      : kind === "ruin"
        ? 100 + Math.random() * 75
        : 120 + Math.random() * 105;
  const width = kind === "ruin" ? 64 : 72 + Math.random() * 52;
  state.obstacles.push({
    kind,
    x: WORLD.width + 30,
    y: fromTop ? 0 : WORLD.height - height,
    width,
    height,
    side: fromTop ? "top" : "bottom",
    speed: 205 + state.level.number * 9,
    active: true,
  });
}

function update(deltaSeconds) {
  if (state.mode !== "playing" || state.paused) return;

  state.elapsed += deltaSeconds;
  state.dragonClock += deltaSeconds;
  state.score += deltaSeconds * 26;

  const nextLevel = getLevel(state.score);
  if (nextLevel.number !== state.level.number) {
    state.level = nextLevel;
    state.announcedLevel = nextLevel.number;
    state.flash = prefersReducedMotion ? 0 : 0.35;
    const bounds = getFlightBounds(nextLevel);
    state.player.y = Math.min(
      bounds.bottom - state.player.height - 12,
      Math.max(bounds.top + 12, state.player.y),
    );
    elements.level.textContent = String(nextLevel.number).padStart(2, "0");
    tone(840, 0.2, "square", 0.04);
    elements.levelBannerNumber.textContent = `Level ${nextLevel.number}`;
    elements.levelBannerMessage.textContent =
      nextLevel.number === 11
        ? "The wyvern and warden enter"
        : nextLevel.number > 11
          ? "The hunt intensifies"
          : "New obstacles ahead";
    elements.levelBanner.classList.add("active");
    setTimeout(() => elements.levelBanner.classList.remove("active"), 1800);
  }

  const bounds = getFlightBounds(state.level);
  state.player = updatePlayer(state.player, input, deltaSeconds, bounds);
  state.obstacleTimer += deltaSeconds;
  const obstacleInterval = Math.max(1.15, 2.65 - state.level.number * 0.065);
  if (state.obstacleTimer >= obstacleInterval) {
    state.obstacleTimer %= obstacleInterval;
    spawnObstacle();
  }
  const roster = getVillainRoster(state.level.number);
  state.spawnTimers.dragon += deltaSeconds;
  if (state.spawnTimers.dragon >= state.level.spawnEvery) {
    state.spawnTimers.dragon %= state.level.spawnEvery;
    spawnProjectile("dragon");
  }
  if (roster.includes("wyvern")) {
    state.spawnTimers.wyvern += deltaSeconds;
    if (state.spawnTimers.wyvern >= Math.max(0.9, state.level.spawnEvery * 1.8)) {
      state.spawnTimers.wyvern = 0;
      spawnProjectile("wyvern");
    }
    state.spawnTimers.warden += deltaSeconds;
    if (state.spawnTimers.warden >= Math.max(1.35, state.level.spawnEvery * 2.5)) {
      state.spawnTimers.warden = 0;
      spawnProjectile("warden");
    }
  }

  state.fireballs = updateFireballs(state.fireballs, deltaSeconds);
  state.obstacles = updateObstacles(state.obstacles, deltaSeconds);
  state.fireballs.forEach((fireball) => {
    fireball.phase += deltaSeconds * 12;
  });
  spawnTrail();
  state.particles = state.particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx * deltaSeconds,
      y: particle.y + particle.vy * deltaSeconds,
      life: particle.life - deltaSeconds,
    }))
    .filter((particle) => particle.life > 0);

  if (state.player.outOfBounds) {
    endGame("hazard");
  } else if (hasFireballCollision(state.player, state.fireballs)) {
    endGame("fireball");
  } else if (hasFireballCollision(state.player, state.obstacles)) {
    endGame("obstacle");
  }

  state.flash = Math.max(0, state.flash - deltaSeconds);
  state.shake = Math.max(0, state.shake - deltaSeconds);
  elements.score.textContent = formatScore(state.score);
}

function rect(x, y, width, height, color, radius = 0) {
  context.fillStyle = color;
  if (!radius) {
    context.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
    return;
  }
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
}

function ellipse(x, y, radiusX, radiusY, color, rotation = 0) {
  context.fillStyle = color;
  context.beginPath();
  context.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI * 2);
  context.fill();
}

function glow(x, y, radius, inner, outer) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(1, outer);
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function drawSky() {
  if (scenery.complete && scenery.naturalWidth) {
    const sourceWidth = Math.min(scenery.naturalWidth, scenery.naturalHeight * 2);
    const availablePan = Math.max(0, scenery.naturalWidth - sourceWidth);
    const sourceX =
      availablePan * (0.5 + Math.sin(state.elapsed * 0.035) * 0.5);
    context.drawImage(
      scenery,
      sourceX,
      0,
      sourceWidth,
      scenery.naturalHeight,
      0,
      0,
      WORLD.width,
      WORLD.height,
    );
    const shade = context.createLinearGradient(0, 0, WORLD.width, WORLD.height);
    shade.addColorStop(0, "rgba(5,12,21,.2)");
    shade.addColorStop(0.55, "rgba(9,12,22,.06)");
    shade.addColorStop(1, "rgba(43,18,22,.16)");
    context.fillStyle = shade;
    context.fillRect(0, 0, WORLD.width, WORLD.height);
    return;
  }
  const gradient = context.createLinearGradient(0, 0, 0, WORLD.height);
  gradient.addColorStop(0, "#11142f");
  gradient.addColorStop(0.62, "#2b1738");
  gradient.addColorStop(1, "#5b252f");
  context.fillStyle = gradient;
  context.fillRect(0, 0, WORLD.width, WORLD.height);

  const drift = state.elapsed * 15;
  state.stars.forEach((star) => {
    const x = (star.x - drift * star.depth + WORLD.width) % WORLD.width;
    rect(x, star.y, star.size, star.size, star.size === 3 ? "#ffe7a6" : "#9896c0");
  });

  glow(900, 106, 125, "rgba(255,224,153,.32)", "rgba(255,210,122,0)");
  ellipse(900, 106, 50, 50, "#ffd98b");
  ellipse(883, 90, 10, 7, "rgba(126,84,87,.18)", -0.3);

  state.clouds.forEach((cloud) => {
    const x = (cloud.x - state.elapsed * cloud.speed + WORLD.width + 180) % (WORLD.width + 180) - 90;
    const y = cloud.y;
    const color = `rgba(218,214,231,${cloud.alpha})`;
    ellipse(x, y, 65 * cloud.scale, 20 * cloud.scale, color);
    ellipse(x + 42 * cloud.scale, y - 8, 50 * cloud.scale, 25 * cloud.scale, color);
    ellipse(x - 42 * cloud.scale, y - 4, 42 * cloud.scale, 18 * cloud.scale, color);
  });

  const farOffset = (state.elapsed * 9) % 360;
  for (let index = -1; index < 5; index += 1) {
    const x = index * 360 - farOffset;
    const mountainGradient = context.createLinearGradient(x, 220, x, 510);
    mountainGradient.addColorStop(0, "#383653");
    mountainGradient.addColorStop(1, "#18182a");
    context.fillStyle = mountainGradient;
    context.beginPath();
    context.moveTo(x, 500);
    context.lineTo(x + 180, 215);
    context.lineTo(x + 360, 500);
    context.fill();
  }

  const nearOffset = (state.elapsed * 20) % 500;
  for (let index = -1; index < 4; index += 1) {
    const x = index * 500 - nearOffset;
    const nearGradient = context.createLinearGradient(x, 300, x, 540);
    nearGradient.addColorStop(0, "#51314b");
    nearGradient.addColorStop(1, "#211522");
    context.fillStyle = nearGradient;
    context.beginPath();
    context.moveTo(x, 530);
    context.lineTo(x + 220, 310);
    context.lineTo(x + 500, 530);
    context.fill();
  }
}

function drawHazards() {
  const vignette = context.createLinearGradient(0, 0, 0, WORLD.height);
  vignette.addColorStop(0, "rgba(3,7,12,.28)");
  vignette.addColorStop(0.12, "rgba(3,7,12,0)");
  vignette.addColorStop(0.88, "rgba(3,7,12,0)");
  vignette.addColorStop(1, "rgba(3,7,12,.32)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, WORLD.width, WORLD.height);
}

function drawHero() {
  const { x, y } = state.player;
  const isWoman = state.player.pilot === "woman";
  const sprite = pilotSprites[state.player.pilot] ?? pilotSprites.woman;
  const bob = state.mode === "playing" ? Math.sin(state.elapsed * 12) * 2 : 0;
  const py = y + bob;
  context.save();
  context.translate(x + 22, py + 29);
  context.rotate(Math.max(-0.16, Math.min(0.16, state.player.velocity / 1800)));
  if (sprite.complete && sprite.naturalWidth) {
    const spriteWidth = 176;
    const spriteHeight = 118;
    glow(-38, 6, 42, "rgba(255,182,77,.28)", "rgba(255,102,61,0)");
    context.drawImage(
      sprite,
      -spriteWidth * 0.57,
      -spriteHeight * 0.5,
      spriteWidth,
      spriteHeight,
    );
    context.restore();
    return;
  }
  glow(-27, 4, 27, "rgba(255,200,87,.4)", "rgba(255,102,61,0)");
  context.fillStyle = "#ffbe4e";
  context.beginPath();
  context.moveTo(-18, -4);
  context.lineTo(-43, 3);
  context.lineTo(-19, 10);
  context.fill();
  ellipse(0, 2, 18, 25, isWoman ? "#387f8d" : "#355c8a", -0.12);
  ellipse(3, -17, 15, 14, isWoman ? "#e7b374" : "#b77851");
  ellipse(
    0,
    -22,
    isWoman ? 19 : 16,
    isWoman ? 10 : 7,
    isWoman ? "#492d2c" : "#231c1b",
    -0.12,
  );
  ellipse(11, -18, 4, 3, "#fff3c6");
  ellipse(12, -18, 1.8, 1.8, "#1a1b28");
  context.fillStyle = isWoman ? "#71e3ca" : "#88aee8";
  context.beginPath();
  context.moveTo(-9, -2);
  context.lineTo(-31, -15);
  context.lineTo(-15, 8);
  context.fill();
  context.beginPath();
  context.moveTo(7, 17);
  context.lineTo(18, 31);
  context.lineTo(4, 29);
  context.fill();
  rect(-13, 18, 10, 22, "#29354b", 4);
  rect(5, 18, 10, 22, "#29354b", 4);
  context.restore();
}

function drawObstacle(obstacle) {
  const { x, y, width, height, side, kind } = obstacle;
  context.save();
  if (kind === "pine") {
    rect(
      x + width * 0.43,
      y + height * 0.5,
      width * 0.13,
      height * 0.5,
      "#493326",
      4,
    );
    for (let layer = 0; layer < 4; layer += 1) {
      const layerY = y + layer * height * 0.17;
      context.fillStyle = layer % 2 ? "#174c39" : "#236247";
      context.beginPath();
      context.moveTo(x + width / 2, layerY);
      context.lineTo(
        x + width * (0.05 + layer * 0.05),
        layerY + height * 0.36,
      );
      context.lineTo(
        x + width * (0.95 - layer * 0.05),
        layerY + height * 0.36,
      );
      context.closePath();
      context.fill();
    }
  } else if (kind === "ruin") {
    const stone = context.createLinearGradient(x, y, x + width, y);
    stone.addColorStop(0, "#5a5d57");
    stone.addColorStop(0.5, "#8a8978");
    stone.addColorStop(1, "#454943");
    rect(x, y, width, height, stone, 3);
    for (let row = 0; row < height; row += 24) {
      rect(x + 8, y + row + 6, width - 16, 2, "rgba(28,32,30,.35)");
    }
    rect(
      x + width * 0.32,
      side === "top" ? y + height - 54 : y,
      width * 0.36,
      54,
      "#222a27",
      18,
    );
  } else {
    const rock = context.createLinearGradient(x, y, x + width, y + height);
    rock.addColorStop(0, "#777a72");
    rock.addColorStop(0.5, "#464c49");
    rock.addColorStop(1, "#252d2c");
    context.fillStyle = rock;
    context.beginPath();
    if (side === "top") {
      context.moveTo(x, y);
      context.lineTo(x + width, y);
      context.lineTo(x + width * 0.72, y + height * 0.75);
      context.lineTo(x + width * 0.48, y + height);
      context.lineTo(x + width * 0.2, y + height * 0.68);
    } else {
      context.moveTo(x, y + height);
      context.lineTo(x + width, y + height);
      context.lineTo(x + width * 0.78, y + height * 0.22);
      context.lineTo(x + width * 0.48, y);
      context.lineTo(x + width * 0.16, y + height * 0.28);
    }
    context.closePath();
    context.fill();
  }
  context.restore();
}

function drawDragon() {
  const { x, y } = villainPosition("dragon");
  context.save();
  context.translate(x, y + 42);
  if (dragonSprite.complete && dragonSprite.naturalWidth) {
    const pulse = 1 + Math.sin(state.elapsed * 7) * 0.018;
    context.scale(pulse, pulse);
    glow(2, 5, 88, "rgba(255,111,44,.2)", "rgba(255,71,26,0)");
    context.drawImage(dragonSprite, -148, -84, 270, 180);
    context.restore();
    return;
  }
  const wing = Math.sin(state.elapsed * 7) * 0.18;
  context.fillStyle = "#5d2140";
  context.beginPath();
  context.moveTo(25, -12);
  context.quadraticCurveTo(75, -68 - wing * 60, 105, -25);
  context.lineTo(61, 0);
  context.fill();
  context.beginPath();
  context.moveTo(31, 15);
  context.quadraticCurveTo(80, 62 + wing * 55, 110, 28);
  context.lineTo(62, 3);
  context.fill();
  ellipse(30, 3, 49, 29, "#84364b", 0.08);
  ellipse(-18, 5, 31, 23, "#b84a4c", -0.1);
  context.fillStyle = "#d26854";
  context.beginPath();
  context.moveTo(-45, 1);
  context.lineTo(-69, 12);
  context.lineTo(-43, 18);
  context.fill();
  ellipse(-35, -7, 4, 4, "#ffe178");
  ellipse(-23, -8, 4, 4, "#ffe178");
  ellipse(-29, 2, 4, 4, "#ffe178");
  ellipse(-35, -7, 1.5, 1.5, "#1b1018");
  ellipse(-23, -8, 1.5, 1.5, "#1b1018");
  ellipse(-29, 2, 1.5, 1.5, "#1b1018");
  context.strokeStyle = "#542039";
  context.lineWidth = 10;
  context.beginPath();
  context.moveTo(69, 5);
  context.quadraticCurveTo(112, 14, 137, -9);
  context.stroke();
  context.restore();
}

function drawWyvern() {
  const { x, y } = villainPosition("wyvern");
  context.save();
  context.translate(x, y + 28);
  const wing = Math.sin(state.elapsed * 10) * 16;
  context.fillStyle = "rgba(72,151,159,.8)";
  context.beginPath();
  context.moveTo(10, 0);
  context.lineTo(48, -42 - wing);
  context.lineTo(64, -3);
  context.fill();
  context.beginPath();
  context.moveTo(5, 5);
  context.lineTo(45, 39 + wing);
  context.lineTo(62, 8);
  context.fill();
  ellipse(2, 4, 30, 16, "#3d7e8b", -0.15);
  ellipse(-24, 3, 18, 12, "#62b6ad");
  ellipse(-31, 0, 3, 3, "#dfffae");
  context.strokeStyle = "#2e5b70";
  context.lineWidth = 6;
  context.beginPath();
  context.moveTo(27, 6);
  context.quadraticCurveTo(66, 20, 82, 1);
  context.stroke();
  context.restore();
}

function drawWarden() {
  const { x, y } = villainPosition("warden");
  context.save();
  context.translate(x, y);
  glow(0, 0, 62, "rgba(159,75,220,.25)", "rgba(90,34,121,0)");
  context.fillStyle = "#39254b";
  context.beginPath();
  context.moveTo(-28, 42);
  context.quadraticCurveTo(0, -55, 31, 42);
  context.closePath();
  context.fill();
  ellipse(0, -17, 19, 20, "#5a346c");
  ellipse(-7, -19, 3, 3, "#efccff");
  ellipse(7, -19, 3, 3, "#efccff");
  context.strokeStyle = "#c16ee8";
  context.lineWidth = 5;
  context.beginPath();
  context.moveTo(-27, -4);
  context.lineTo(-43, 32);
  context.moveTo(27, -4);
  context.lineTo(43, 32);
  context.stroke();
  context.restore();
}

function drawFireball(fireball) {
  const flicker = Math.sin(fireball.phase) * 3;
  if (fireball.kind === "shard") {
    glow(fireball.x + 8, fireball.y + 8, 28, "rgba(101,230,196,.45)", "rgba(101,230,196,0)");
    context.fillStyle = "#9df4e0";
    context.beginPath();
    context.moveTo(fireball.x - 14, fireball.y + 8);
    context.lineTo(fireball.x + 20, fireball.y);
    context.lineTo(fireball.x + 28, fireball.y + 8);
    context.lineTo(fireball.x + 20, fireball.y + 16);
    context.fill();
    return;
  }
  if (fireball.kind === "orb") {
    glow(fireball.x + 15, fireball.y + 15, 38, "rgba(210,113,255,.55)", "rgba(108,36,153,0)");
    ellipse(fireball.x + 15, fireball.y + 15, 13 + flicker * 0.2, 13, "#d47aff");
    ellipse(fireball.x + 11, fireball.y + 10, 4, 4, "#fff0ff");
    return;
  }
  glow(fireball.x + 10, fireball.y + 13, 42, "rgba(255,130,54,.5)", "rgba(255,70,30,0)");
  context.fillStyle = "#d93d38";
  context.beginPath();
  context.moveTo(fireball.x - 24 - flicker, fireball.y + 13);
  context.lineTo(fireball.x + 6, fireball.y + 2);
  context.lineTo(fireball.x + 6, fireball.y + 24);
  context.fill();
  ellipse(fireball.x + 12, fireball.y + 13, 18, 12, "#ff713d");
  ellipse(fireball.x + 18, fireball.y + 11, 10, 7, "#ffe48c");
}

function render() {
  context.save();
  if (state.shake > 0) {
    context.translate((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12);
  }
  drawSky();
  drawHazards();
  state.obstacles.forEach(drawObstacle);
  state.particles.forEach((particle) =>
    rect(particle.x, particle.y, 5, 5, particle.color),
  );
  drawHero();
  drawDragon();
  if (state.level.number > 10) {
    drawWyvern();
    drawWarden();
  }
  state.fireballs.forEach(drawFireball);

  if (state.flash > 0) {
    context.fillStyle = `rgba(255, 206, 87, ${state.flash})`;
    context.fillRect(0, 0, WORLD.width, WORLD.height);
  }
  context.restore();
}

function frame(now) {
  const deltaSeconds = Math.min((now - previousTime) / 1000, 0.05);
  previousTime = now;
  update(deltaSeconds);
  render();
  requestAnimationFrame(frame);
}

function setInput(key, active) {
  if (key === "ArrowUp" || key.toLowerCase() === "w") input.up = active;
  if (key === "ArrowDown" || key.toLowerCase() === "s") input.down = active;
}

function bindHoldButton(button, key) {
  const start = (event) => {
    event.preventDefault();
    input[key] = true;
    button.classList.add("active");
  };
  const stop = (event) => {
    event.preventDefault();
    input[key] = false;
    button.classList.remove("active");
  };
  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", stop);
  button.addEventListener("pointercancel", stop);
  button.addEventListener("pointerleave", stop);
}

document.addEventListener("keydown", (event) => {
  if (["ArrowUp", "ArrowDown", "w", "W", "s", "S"].includes(event.key)) {
    event.preventDefault();
    setInput(event.key, true);
  }
  if (event.repeat) return;
  if (event.key.toLowerCase() === "p" || event.key === "Escape") {
    setPaused(!state.paused);
  }
  if (event.key.toLowerCase() === "m") elements.muteButton.click();
  if (event.key === "Enter" && ["ready", "gameover"].includes(state.mode)) beginGame();
});

document.addEventListener("keyup", (event) => setInput(event.key, false));
window.addEventListener("blur", () => {
  if (state.mode === "playing") setPaused(true);
});

elements.startButton.addEventListener("click", beginGame);
elements.restartButton.addEventListener("click", beginGame);
document.querySelectorAll(".pilot-option").forEach((button) => {
  button.addEventListener("click", () => {
    selectedPilot = button.dataset.pilot;
    document.querySelectorAll(".pilot-option").forEach((option) => {
      const active = option === button;
      option.classList.toggle("active", active);
      option.setAttribute("aria-pressed", String(active));
    });
  });
});
elements.pauseButton.addEventListener("click", () => setPaused(!state.paused));
elements.muteButton.addEventListener("click", () => {
  muted = !muted;
  elements.muteButton.textContent = muted ? "Sound: off" : "Sound: on";
  elements.muteButton.setAttribute("aria-pressed", String(muted));
  if (!muted) tone(520);
});
bindHoldButton(elements.upButton, "up");
bindHoldButton(elements.downButton, "down");

state = initialState();
scoreProvider.getHighScore().then((record) => {
  highScore = record?.score ?? 0;
  elements.highScore.textContent = formatScore(highScore);
});
requestAnimationFrame(frame);
