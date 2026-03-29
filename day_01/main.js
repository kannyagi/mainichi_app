const CONFIG = {
  storageKey: "gate-crowd-clash-best",
  initialCount: 10,
  trackHalfWidth: 7.8,
  runSpeed: 12.5,
  minCount: 0,
  maxVisualCrowd: 120,
  camera: {
    followDistance: 6.4,
    height: 7.2,
    fov: 70,
    xScale: 4.15,
    yScale: 6.4,
    horizonRatio: 0.16,
  },
  playerControl: {
    maxOffset: 6.4,
    dragToWorld: 0.028,
    spring: 26,
    damping: 0.84,
  },
  battle: {
    triggerDistance: 10,
    lineGap: 4.8,
    rate: 0.32,
    impactInterval: 0.08,
  },
  crowd: {
    slotSpacingX: 0.72,
    slotSpacingZ: 0.78,
    memberRadius: 0.24,
    wobble: 0.08,
  },
  effects: {
    particleLife: 0.8,
    popupLife: 0.95,
  },
};

const COLORS = {
  skyTop: "#86e2ff",
  skyBottom: "#fff0b4",
  grass: "#b8f283",
  grassDark: "#8ed25b",
  trackA: "#ffffff",
  trackB: "#ecf8ff",
  lane: "rgba(89, 159, 255, 0.18)",
  shadow: "rgba(35, 57, 80, 0.18)",
  player: "#2a78ff",
  playerDark: "#0d47b6",
  playerSoft: "#8dc5ff",
  enemy: "#ff5c7b",
  enemyDark: "#cc3657",
  enemySoft: "#ffb2c0",
  add: "#22c984",
  addSoft: "#9ff3cf",
  bad: "#ff855a",
  badSoft: "#ffd0bf",
  multiply: "#2baeff",
  multiplySoft: "#bde9ff",
  textDark: "#16345d",
  white: "#ffffff",
  gold: "#ffd661",
};

const STAGES = [
  {
    name: "ウォームアップ",
    length: 132,
    runSpeed: 12.5,
    theme: {
      skyTop: "#86e2ff",
      skyBottom: "#fff0b4",
      grass: "#b8f283",
      grassDark: "#8ed25b",
    },
    enemy: {
      x: 0,
      z: 120,
      count: 150,
    },
    gates: [
      {
        z: 24,
        options: [
          { x: -3.9, width: 6.8, type: "add", value: 10, label: "+10" },
          { x: 3.9, width: 6.8, type: "mul", value: 2, label: "×2" },
        ],
      },
      {
        z: 42,
        options: [
          { x: -5.1, width: 4.6, type: "add", value: -3, label: "-3" },
          { x: 0, width: 4.6, type: "add", value: 12, label: "+12" },
          { x: 5.1, width: 4.6, type: "mul", value: 3, label: "×3" },
        ],
      },
      {
        z: 60,
        options: [
          { x: -3.9, width: 6.8, type: "div", value: 2, label: "÷2" },
          { x: 3.9, width: 6.8, type: "add", value: 18, label: "+18" },
        ],
      },
      {
        z: 78,
        options: [
          { x: -5.1, width: 4.6, type: "mul", value: 2, label: "×2" },
          { x: 0, width: 4.6, type: "add", value: -8, label: "-8" },
          { x: 5.1, width: 4.6, type: "add", value: 25, label: "+25" },
        ],
      },
      {
        z: 96,
        options: [
          { x: -3.9, width: 6.8, type: "add", value: 20, label: "+20" },
          { x: 3.9, width: 6.8, type: "mul", value: 2, label: "×2" },
        ],
      },
    ],
  },
  {
    name: "ダブルラッシュ",
    length: 136,
    runSpeed: 13,
    theme: {
      skyTop: "#7bd5ff",
      skyBottom: "#ffe9bf",
      grass: "#baf58d",
      grassDark: "#88d563",
    },
    enemy: {
      x: 0,
      z: 122,
      count: 220,
    },
    gates: [
      {
        z: 22,
        options: [
          { x: -3.9, width: 6.8, type: "add", value: 20, label: "+20" },
          { x: 3.9, width: 6.8, type: "mul", value: 2, label: "×2" },
        ],
      },
      {
        z: 40,
        options: [
          { x: -5.1, width: 4.6, type: "add", value: 18, label: "+18" },
          { x: 0, width: 4.6, type: "add", value: -5, label: "-5" },
          { x: 5.1, width: 4.6, type: "mul", value: 3, label: "×3" },
        ],
      },
      {
        z: 58,
        options: [
          { x: -3.9, width: 6.8, type: "div", value: 2, label: "÷2" },
          { x: 3.9, width: 6.8, type: "add", value: 24, label: "+24" },
        ],
      },
      {
        z: 76,
        options: [
          { x: -5.1, width: 4.6, type: "mul", value: 2, label: "×2" },
          { x: 0, width: 4.6, type: "add", value: 15, label: "+15" },
          { x: 5.1, width: 4.6, type: "add", value: -12, label: "-12" },
        ],
      },
      {
        z: 94,
        options: [
          { x: -3.9, width: 6.8, type: "add", value: 30, label: "+30" },
          { x: 3.9, width: 6.8, type: "mul", value: 2, label: "×2" },
        ],
      },
    ],
  },
  {
    name: "トリプルレーン",
    length: 138,
    runSpeed: 13.6,
    theme: {
      skyTop: "#71d1ff",
      skyBottom: "#ffe4b7",
      grass: "#b6f689",
      grassDark: "#80cc57",
    },
    enemy: {
      x: 0,
      z: 124,
      count: 300,
    },
    gates: [
      {
        z: 22,
        options: [
          { x: -3.9, width: 6.8, type: "add", value: 18, label: "+18" },
          { x: 3.9, width: 6.8, type: "mul", value: 2, label: "×2" },
        ],
      },
      {
        z: 42,
        options: [
          { x: -5.1, width: 4.6, type: "add", value: -6, label: "-6" },
          { x: 0, width: 4.6, type: "add", value: 14, label: "+14" },
          { x: 5.1, width: 4.6, type: "mul", value: 3, label: "×3" },
        ],
      },
      {
        z: 62,
        options: [
          { x: -3.9, width: 6.8, type: "div", value: 2, label: "÷2" },
          { x: 3.9, width: 6.8, type: "add", value: 28, label: "+28" },
        ],
      },
      {
        z: 82,
        options: [
          { x: -5.1, width: 4.6, type: "mul", value: 2, label: "×2" },
          { x: 0, width: 4.6, type: "add", value: -10, label: "-10" },
          { x: 5.1, width: 4.6, type: "add", value: 20, label: "+20" },
        ],
      },
      {
        z: 102,
        options: [
          { x: -3.9, width: 6.8, type: "add", value: 32, label: "+32" },
          { x: 3.9, width: 6.8, type: "mul", value: 3, label: "×3" },
        ],
      },
    ],
  },
  {
    name: "ラストスパート",
    length: 144,
    runSpeed: 14.2,
    theme: {
      skyTop: "#6cc8ff",
      skyBottom: "#ffdca9",
      grass: "#b0f37f",
      grassDark: "#76c94d",
    },
    enemy: {
      x: 0,
      z: 128,
      count: 420,
    },
    gates: [
      {
        z: 24,
        options: [
          { x: -5.1, width: 4.6, type: "add", value: 12, label: "+12" },
          { x: 0, width: 4.6, type: "mul", value: 2, label: "×2" },
          { x: 5.1, width: 4.6, type: "mul", value: 3, label: "×3" },
        ],
      },
      {
        z: 44,
        options: [
          { x: -5.1, width: 4.6, type: "add", value: -8, label: "-8" },
          { x: 0, width: 4.6, type: "add", value: 24, label: "+24" },
          { x: 5.1, width: 4.6, type: "div", value: 2, label: "÷2" },
        ],
      },
      {
        z: 64,
        options: [
          { x: -5.1, width: 4.6, type: "mul", value: 2, label: "×2" },
          { x: 0, width: 4.6, type: "add", value: 18, label: "+18" },
          { x: 5.1, width: 4.6, type: "add", value: -12, label: "-12" },
        ],
      },
      {
        z: 84,
        options: [
          { x: -5.1, width: 4.6, type: "add", value: 36, label: "+36" },
          { x: 0, width: 4.6, type: "div", value: 2, label: "÷2" },
          { x: 5.1, width: 4.6, type: "mul", value: 2, label: "×2" },
        ],
      },
      {
        z: 104,
        options: [
          { x: -3.9, width: 6.8, type: "add", value: 28, label: "+28" },
          { x: 3.9, width: 6.8, type: "mul", value: 3, label: "×3" },
        ],
      },
    ],
  },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (from, to, alpha) => from + (to - from) * alpha;
const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

class SoundManager {
  constructor() {
    this.context = null;
    this.enabled = false;
    this.lastBattleHit = 0;
  }

  unlock() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return;
    }

    if (!this.context) {
      this.context = new AudioCtx();
    }

    if (this.context.state === "suspended") {
      this.context.resume().catch(() => {});
    }

    this.enabled = true;
  }

  tone({ frequency, duration, type = "sine", gain = 0.03, slideTo = frequency }) {
    if (!this.enabled || !this.context) {
      return;
    }

    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.linearRampToValueAtTime(slideTo, now + duration);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  }

  gateGood() {
    this.tone({
      frequency: 520,
      slideTo: 760,
      duration: 0.12,
      type: "triangle",
      gain: 0.035,
    });
  }

  gateBad() {
    this.tone({
      frequency: 360,
      slideTo: 180,
      duration: 0.18,
      type: "square",
      gain: 0.026,
    });
  }

  battleHit(nowMs) {
    if (nowMs - this.lastBattleHit < 80) {
      return;
    }

    this.lastBattleHit = nowMs;
    this.tone({
      frequency: 180,
      slideTo: 120,
      duration: 0.08,
      type: "sawtooth",
      gain: 0.018,
    });
  }

  victory() {
    this.tone({
      frequency: 600,
      slideTo: 820,
      duration: 0.14,
      type: "triangle",
      gain: 0.04,
    });
    setTimeout(() => {
      this.tone({
        frequency: 760,
        slideTo: 1040,
        duration: 0.18,
        type: "triangle",
        gain: 0.035,
      });
    }, 90);
  }

  defeat() {
    this.tone({
      frequency: 280,
      slideTo: 160,
      duration: 0.28,
      type: "square",
      gain: 0.022,
    });
  }
}

class CrowdGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.crowdValueEl = document.getElementById("crowdValue");
    this.bestValueEl = document.getElementById("bestValue");
    this.progressFillEl = document.getElementById("progressFill");
    this.stageLabelEl = document.getElementById("stageLabel");
    this.bossLabelEl = document.getElementById("bossLabel");
    this.dragHintEl = document.getElementById("dragHint");
    this.startOverlayEl = document.getElementById("startOverlay");
    this.resultOverlayEl = document.getElementById("resultOverlay");
    this.resultEyebrowEl = document.getElementById("resultEyebrow");
    this.resultTitleEl = document.getElementById("resultTitle");
    this.resultMessageEl = document.getElementById("resultMessage");
    this.startButtonEl = document.getElementById("startButton");
    this.retryButtonEl = document.getElementById("retryButton");

    this.sound = new SoundManager();
    this.bestRemaining = this.loadBest();
    this.bestValueEl.textContent = String(this.bestRemaining);

    this.lastFrame = 0;
    this.time = 0;
    this.cameraZ = 0;
    this.screen = { width: 0, height: 0, dpr: 1 };
    this.shake = 0;
    this.hiddenHint = false;
    this.currentStageIndex = 0;
    this.totalStages = STAGES.length;
    this.resultAction = "restart";

    this.formationSlots = this.createFormationSlots(220);
    this.particles = [];
    this.popups = [];

    this.pointer = {
      active: false,
      pointerId: null,
      startX: 0,
      baseTargetX: 0,
      currentX: 0,
    };

    this.resetState();
    this.attachEvents();
    this.resize();
    this.render();
    requestAnimationFrame((time) => this.frame(time));
  }

  cloneStage(index) {
    return JSON.parse(JSON.stringify(STAGES[index]));
  }

  resetState() {
    this.phase = "ready";
    this.hiddenHint = false;
    this.stage = this.cloneStage(this.currentStageIndex);
    this.stagePalette = {
      skyTop: COLORS.skyTop,
      skyBottom: COLORS.skyBottom,
      grass: COLORS.grass,
      grassDark: COLORS.grassDark,
      trackA: COLORS.trackA,
      trackB: COLORS.trackB,
      ...(this.stage.theme || {}),
    };
    this.stage.gates.forEach((gate) => {
      gate.used = false;
      gate.flash = 0;
      gate.selectedIndex = -1;
      gate.fade = 1;
    });

    this.player = {
      x: 0,
      vx: 0,
      targetX: 0,
      z: 8,
      count: CONFIG.initialCount,
      renderCount: CONFIG.initialCount,
      hitFlash: 0,
    };

    this.enemy = {
      x: 0,
      z: this.stage.enemy.z,
      count: this.stage.enemy.count,
      renderCount: this.stage.enemy.count,
      hitFlash: 0,
    };

    this.particles.length = 0;
    this.popups.length = 0;
    this.battleImpactClock = 0;
    this.resultOverlayEl.classList.add("hidden");
    this.progressFillEl.style.width = "0%";
    this.crowdValueEl.textContent = String(CONFIG.initialCount);
    this.dragHintEl.textContent = "左右にドラッグ";
    this.resultEyebrowEl.textContent = "ステージ結果";
    this.retryButtonEl.textContent = "リトライ";
    this.resultAction = "restart";
    this.stageLabelEl.textContent = `ステージ ${this.currentStageIndex + 1} / ${this.totalStages}`;
    this.bossLabelEl.textContent = `ボス ${this.stage.enemy.count}`;
  }

  attachEvents() {
    window.addEventListener("resize", () => this.resize());

    this.canvas.addEventListener("pointerdown", (event) => {
      this.pointer.active = true;
      this.pointer.pointerId = event.pointerId;
      this.pointer.startX = event.clientX;
      this.pointer.currentX = event.clientX;
      this.pointer.baseTargetX = this.player.targetX;
      this.canvas.setPointerCapture?.(event.pointerId);
      this.hideHint();
    });

    this.canvas.addEventListener("pointermove", (event) => {
      if (!this.pointer.active || event.pointerId !== this.pointer.pointerId) {
        return;
      }

      this.pointer.currentX = event.clientX;
      const delta = event.clientX - this.pointer.startX;
      const target =
        this.pointer.baseTargetX + delta * CONFIG.playerControl.dragToWorld;

      this.player.targetX = clamp(
        target,
        -CONFIG.playerControl.maxOffset,
        CONFIG.playerControl.maxOffset
      );
    });

    const stopPointer = (event) => {
      if (!this.pointer.active || event.pointerId !== this.pointer.pointerId) {
        return;
      }

      this.pointer.active = false;
      this.pointer.pointerId = null;
    };

    this.canvas.addEventListener("pointerup", stopPointer);
    this.canvas.addEventListener("pointercancel", stopPointer);
    this.canvas.addEventListener("pointerleave", stopPointer);

    this.startButtonEl.addEventListener("click", () => {
      this.sound.unlock();
      this.startCampaign();
    });

    this.retryButtonEl.addEventListener("click", () => {
      this.sound.unlock();
      this.handleResultAction();
    });
  }

  loadBest() {
    const saved = window.localStorage.getItem(CONFIG.storageKey);
    const parsed = Number(saved);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  saveBest(value) {
    this.bestRemaining = Math.max(this.bestRemaining, value);
    this.bestValueEl.textContent = String(this.bestRemaining);
    window.localStorage.setItem(CONFIG.storageKey, String(this.bestRemaining));
  }

  startCampaign() {
    this.beginStage(0);
  }

  beginStage(stageIndex) {
    this.currentStageIndex = stageIndex;
    this.resetState();
    this.phase = "running";
    this.startOverlayEl.classList.add("hidden");
    this.resultOverlayEl.classList.add("hidden");
  }

  handleResultAction() {
    if (this.resultAction === "next") {
      this.beginStage(Math.min(this.currentStageIndex + 1, this.totalStages - 1));
      return;
    }

    if (this.resultAction === "retry") {
      this.beginStage(this.currentStageIndex);
      return;
    }

    this.startCampaign();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.screen.width = rect.width;
    this.screen.height = rect.height;
    this.screen.dpr = dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  frame(timestamp) {
    if (!this.lastFrame) {
      this.lastFrame = timestamp;
    }

    const dt = Math.min((timestamp - this.lastFrame) / 1000, 0.033);
    this.lastFrame = timestamp;
    this.time += dt;

    this.update(dt, timestamp);
    this.render();

    requestAnimationFrame((time) => this.frame(time));
  }

  update(dt, timestamp) {
    this.shake = Math.max(0, this.shake - dt * 3.8);
    this.updateEffects(dt);

    if (this.phase === "running") {
      this.updateRunning(dt);
    } else if (this.phase === "battle") {
      this.updateBattle(dt, timestamp);
    }

    this.player.renderCount = lerp(this.player.renderCount, this.player.count, 0.18);
    this.enemy.renderCount = lerp(this.enemy.renderCount, this.enemy.count, 0.18);

    this.player.hitFlash = Math.max(0, this.player.hitFlash - dt * 2.6);
    this.enemy.hitFlash = Math.max(0, this.enemy.hitFlash - dt * 2.6);

    this.cameraZ = Math.max(0, this.player.z - CONFIG.camera.followDistance);
    this.updateUi();
  }

  updateRunning(dt) {
    const control = CONFIG.playerControl;
    const acceleration = (this.player.targetX - this.player.x) * control.spring;
    this.player.vx += acceleration * dt;
    this.player.vx *= Math.pow(control.damping, dt * 60);
    this.player.x += this.player.vx * dt;
    this.player.x = clamp(
      this.player.x,
      -CONFIG.playerControl.maxOffset,
      CONFIG.playerControl.maxOffset
    );

    this.player.z += (this.stage.runSpeed || CONFIG.runSpeed) * dt;

    const nextGate = this.stage.gates.find((gate) => !gate.used);
    if (nextGate) {
      nextGate.selectedIndex = this.getClosestGateIndex(nextGate, this.player.x);
      if (nextGate.z - this.player.z < 0.9) {
        const selected = nextGate.options[nextGate.selectedIndex];
        this.applyGate(nextGate, selected);
      }
    }

    this.stage.gates.forEach((gate) => {
      gate.flash = Math.max(0, gate.flash - dt * 3.4);
      if (gate.used) {
        gate.fade = Math.max(0, gate.fade - dt * 4.2);
      }
    });

    if (this.player.count <= 0.001) {
      this.finishRun(false);
      return;
    }

    if (this.player.z >= this.enemy.z - CONFIG.battle.triggerDistance) {
      this.startBattle();
    }
  }

  startBattle() {
    this.phase = "battle";
    this.player.targetX = 0;
    this.pointer.active = false;
    this.dragHintEl.textContent = "ぶつかれ！";
  }

  updateBattle(dt, timestamp) {
    this.player.targetX = lerp(this.player.targetX, 0, 0.2);
    const battleLineZ = this.enemy.z - CONFIG.battle.lineGap;
    this.player.x = lerp(this.player.x, 0, 0.12);
    this.player.z = lerp(this.player.z, battleLineZ, 0.11);

    const playerDamage = this.enemy.count * CONFIG.battle.rate * dt;
    const enemyDamage = this.player.count * CONFIG.battle.rate * dt;

    this.player.count = Math.max(0, this.player.count - playerDamage);
    this.enemy.count = Math.max(0, this.enemy.count - enemyDamage);

    this.battleImpactClock += dt;
    if (this.battleImpactClock >= CONFIG.battle.impactInterval) {
      this.battleImpactClock = 0;
      this.spawnImpactBurst();
      this.player.hitFlash = 1;
      this.enemy.hitFlash = 1;
      this.shake = Math.max(this.shake, 0.18);
      this.sound.battleHit(timestamp);
    }

    if (this.enemy.count <= 0.001 || this.player.count <= 0.001) {
      this.finishRun(this.player.count > this.enemy.count);
    }
  }

  finishRun(playerWon) {
    this.phase = "result";

    const remaining = Math.max(0, Math.ceil(this.player.count));
    const stageNumber = this.currentStageIndex + 1;
    const finalStage = this.currentStageIndex === this.totalStages - 1;
    this.resultEyebrowEl.textContent = `ステージ ${stageNumber} / ${this.totalStages}`;

    if (playerWon && remaining > 0) {
      this.resultTitleEl.textContent = finalStage ? "全ステージ制覇" : "ステージクリア";
      this.resultMessageEl.textContent = finalStage
        ? `${this.stage.name}を突破！ 残り${remaining}人で全ステージクリアです。`
        : `${this.stage.name}を突破！ 残り${remaining}人で次へ進めます。`;
      this.retryButtonEl.textContent = finalStage ? "最初から遊ぶ" : "次のステージへ";
      this.resultAction = finalStage ? "restart" : "next";
      this.spawnResultBurst(true);
      this.saveBest(remaining);
      this.sound.victory();
    } else {
      this.resultTitleEl.textContent = "敗北";
      this.resultMessageEl.textContent =
        `${this.stage.name}で押し負けました。ルートを変えてもう一度挑戦しましょう。`;
      this.retryButtonEl.textContent = "リトライ";
      this.resultAction = "retry";
      this.spawnResultBurst(false);
      this.sound.defeat();
    }

    this.crowdValueEl.textContent = String(remaining);
    this.resultOverlayEl.classList.remove("hidden");
  }

  getClosestGateIndex(gate, x) {
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    gate.options.forEach((option, index) => {
      const distance = Math.abs(option.x - x);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    return bestIndex;
  }

  applyGate(gate, option) {
    if (gate.used) {
      return;
    }

    gate.used = true;
    gate.flash = 1.2;
    gate.selectedIndex = gate.options.indexOf(option);

    const before = Math.max(0, Math.round(this.player.count));
    let after = before;

    if (option.type === "add") {
      after = before + option.value;
    } else if (option.type === "mul") {
      after = before * option.value;
    } else if (option.type === "div") {
      after = Math.floor(before / option.value);
    }

    after = Math.max(CONFIG.minCount, after);
    this.player.count = after;
    this.player.hitFlash = 1;
    this.crowdValueEl.textContent = String(after);

    const isGood = after >= before;
    this.spawnGateFeedback(option, isGood);
    this.shake = Math.max(this.shake, 0.22);

    if (isGood) {
      this.sound.gateGood();
    } else {
      this.sound.gateBad();
    }
  }

  spawnGateFeedback(option, isGood) {
    const anchor = this.project(this.player.x, 1.4, this.player.z);
    this.popups.push({
      text: option.label,
      worldX: this.player.x,
      worldZ: this.player.z + 0.8,
      rise: 1.4,
      ttl: CONFIG.effects.popupLife,
      maxTtl: CONFIG.effects.popupLife,
      color: isGood ? COLORS.add : COLORS.bad,
    });

    const color = isGood ? COLORS.add : COLORS.bad;
    const accent = isGood ? COLORS.multiply : COLORS.enemy;
    for (let index = 0; index < 18; index += 1) {
      const angle = (Math.PI * 2 * index) / 18 + Math.random() * 0.4;
      const speed = 52 + Math.random() * 74;
      this.particles.push({
        x: (anchor ? anchor.x : this.screen.width * 0.5) + (Math.random() - 0.5) * 42,
        y: (anchor ? anchor.y : this.screen.height * 0.7) + (Math.random() - 0.5) * 24,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 36,
        size: 4 + Math.random() * 6,
        color: Math.random() > 0.5 ? color : accent,
        life: CONFIG.effects.particleLife,
        maxLife: CONFIG.effects.particleLife,
        gravity: 80,
      });
    }
  }

  spawnImpactBurst() {
    const focus = this.project(0, 0.7, this.enemy.z - CONFIG.battle.lineGap * 0.5);
    if (!focus) {
      return;
    }

    for (let index = 0; index < 8; index += 1) {
      const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * Math.PI;
      const speed = 30 + Math.random() * 45;
      this.particles.push({
        x: focus.x,
        y: focus.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        color: Math.random() > 0.5 ? COLORS.white : COLORS.gold,
        life: 0.35 + Math.random() * 0.28,
        maxLife: 0.55,
        gravity: 24,
      });
    }
  }

  spawnResultBurst(victory) {
    const colorA = victory ? COLORS.gold : COLORS.enemy;
    const colorB = victory ? COLORS.add : COLORS.bad;
    for (let index = 0; index < 42; index += 1) {
      const angle = (Math.PI * 2 * index) / 42;
      const speed = 46 + Math.random() * 92;
      this.particles.push({
        x: this.screen.width * 0.5,
        y: this.screen.height * 0.38,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 26,
        size: 4 + Math.random() * 6,
        color: Math.random() > 0.5 ? colorA : colorB,
        life: 1 + Math.random() * 0.45,
        maxLife: 1.45,
        gravity: 66,
      });
    }
  }

  updateEffects(dt) {
    this.particles = this.particles.filter((particle) => {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += particle.gravity * dt;
      return particle.life > 0;
    });

    this.popups = this.popups.filter((popup) => {
      popup.ttl -= dt;
      popup.worldZ += dt * 0.8;
      return popup.ttl > 0;
    });
  }

  hideHint() {
    if (this.hiddenHint) {
      return;
    }

    this.hiddenHint = true;
    this.dragHintEl.textContent = "いいゲートを狙おう";
  }

  updateUi() {
    const progress = clamp(this.player.z / this.enemy.z, 0, 1);
    this.progressFillEl.style.width = `${(progress * 100).toFixed(1)}%`;
    this.bossLabelEl.textContent =
      this.phase === "battle" || this.phase === "result"
        ? `敵 ${Math.max(0, Math.ceil(this.enemy.count))}`
        : `ボス ${this.stage.enemy.count}`;

    const displayCount =
      this.phase === "battle" || this.phase === "result"
        ? Math.max(0, Math.ceil(this.player.count))
        : Math.max(0, Math.round(this.player.count));
    this.crowdValueEl.textContent = String(displayCount);
  }

  createFormationSlots(count) {
    const slots = [];
    let row = 0;
    while (slots.length < count) {
      const rowSize = Math.min(11, 1 + row);
      for (let column = 0; column < rowSize && slots.length < count; column += 1) {
        const centered = column - (rowSize - 1) * 0.5;
        slots.push({
          x: centered * CONFIG.crowd.slotSpacingX,
          z: row * CONFIG.crowd.slotSpacingZ,
          seed: Math.random() * Math.PI * 2,
        });
      }
      row += 1;
    }
    return slots;
  }

  getVisualCount(actualCount) {
    const rounded = Math.max(0, Math.ceil(actualCount));
    if (rounded <= 35) {
      return rounded;
    }

    return clamp(
      35 + Math.floor(Math.sqrt(rounded - 35) * 9),
      0,
      CONFIG.maxVisualCrowd
    );
  }

  project(x, y, z) {
    const depth = z - this.cameraZ;
    if (depth <= 0.2) {
      return null;
    }

    const scale = CONFIG.camera.fov / depth;
    const screenX = this.screen.width * 0.5 + x * scale * CONFIG.camera.xScale;
    const screenY =
      this.screen.height * CONFIG.camera.horizonRatio +
      (CONFIG.camera.height - y) * scale * CONFIG.camera.yScale;

    return {
      x: screenX,
      y: screenY,
      scale,
      depth,
    };
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.screen.width, this.screen.height);
    ctx.save();

    if (this.shake > 0) {
      const magnitude = this.shake * 6;
      ctx.translate(
        (Math.random() - 0.5) * magnitude,
        (Math.random() - 0.5) * magnitude
      );
    }

    this.drawBackground();
    this.drawTrack();
    this.drawStageObjects();
    this.drawCrowdBubble(this.player, true);
    this.drawEffects();

    ctx.restore();
  }

  drawBackground() {
    const ctx = this.ctx;
    const palette = this.stagePalette || COLORS;
    const gradient = ctx.createLinearGradient(0, 0, 0, this.screen.height);
    gradient.addColorStop(0, palette.skyTop);
    gradient.addColorStop(0.58, "#c7f3ff");
    gradient.addColorStop(1, palette.skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.screen.width, this.screen.height);

    ctx.fillStyle = "rgba(255,255,255,0.76)";
    this.drawCloud(this.screen.width * 0.16, this.screen.height * 0.12, 44);
    this.drawCloud(this.screen.width * 0.74, this.screen.height * 0.11, 58);
    this.drawCloud(this.screen.width * 0.62, this.screen.height * 0.2, 34);

    const sunGradient = ctx.createRadialGradient(
      this.screen.width * 0.78,
      this.screen.height * 0.16,
      10,
      this.screen.width * 0.78,
      this.screen.height * 0.16,
      86
    );
    sunGradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    sunGradient.addColorStop(1, "rgba(255, 241, 173, 0)");
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(
      this.screen.width * 0.78,
      this.screen.height * 0.16,
      86,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  drawCloud(x, y, size) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.42, 0, Math.PI * 2);
    ctx.arc(x + size * 0.35, y - size * 0.12, size * 0.32, 0, Math.PI * 2);
    ctx.arc(x + size * 0.64, y, size * 0.28, 0, Math.PI * 2);
    ctx.arc(x + size * 0.25, y + size * 0.14, size * 0.28, 0, Math.PI * 2);
    ctx.fill();
  }

  drawTrack() {
    const ctx = this.ctx;
    const palette = this.stagePalette || COLORS;
    const farStart = Math.floor(this.cameraZ + 4);
    const farEnd = (this.stage?.length || 132) + 22;
    const segmentLength = 2.2;

    for (let z = farEnd; z >= farStart; z -= segmentLength) {
      const p1 = this.project(-CONFIG.trackHalfWidth, 0, z);
      const p2 = this.project(CONFIG.trackHalfWidth, 0, z);
      const p3 = this.project(CONFIG.trackHalfWidth, 0, z + segmentLength);
      const p4 = this.project(-CONFIG.trackHalfWidth, 0, z + segmentLength);

      if (!p1 || !p2 || !p3 || !p4) {
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.fillStyle =
        Math.floor(z / segmentLength) % 2 === 0 ? palette.trackA : palette.trackB;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.lineTo(0, this.screen.height);
      ctx.lineTo(0, this.screen.height * 0.42);
      ctx.closePath();
      ctx.fillStyle =
        Math.floor(z / segmentLength) % 2 === 0 ? palette.grass : palette.grassDark;
      ctx.globalAlpha = 0.6;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(this.screen.width, this.screen.height * 0.42);
      ctx.lineTo(this.screen.width, this.screen.height);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    const stripeXs = [-CONFIG.trackHalfWidth * 0.42, 0, CONFIG.trackHalfWidth * 0.42];
    stripeXs.forEach((centerX, stripeIndex) => {
      for (let z = farEnd; z >= farStart; z -= 6) {
        const left = this.project(centerX - 0.14, 0.01, z);
        const right = this.project(centerX + 0.14, 0.01, z);
        const rightFar = this.project(centerX + 0.14, 0.01, z + 2.2);
        const leftFar = this.project(centerX - 0.14, 0.01, z + 2.2);
        if (!left || !right || !rightFar || !leftFar) {
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.lineTo(rightFar.x, rightFar.y);
        ctx.lineTo(leftFar.x, leftFar.y);
        ctx.closePath();
        ctx.fillStyle =
          stripeIndex === 1 ? COLORS.lane : "rgba(255,255,255,0.14)";
        ctx.fill();
      }
    });
  }

  drawStageObjects() {
    const gateObjects = this.stage.gates
      .filter((gate) => gate.fade > 0.02)
      .sort((a, b) => b.z - a.z);

    gateObjects.forEach((gate) => this.drawGateSet(gate));
    this.drawCrowd(this.enemy, false);
    this.drawCrowd(this.player, true);
    this.drawEnemyBadge();
  }

  drawGateSet(gate) {
    const nextGate = this.stage.gates.find((entry) => !entry.used);
    gate.options.forEach((option, index) => {
      const selected = nextGate === gate && gate.selectedIndex === index;
      this.drawGate(option, gate.z, selected, gate.flash, gate.fade);
    });
  }

  drawGate(option, z, selected, flash, fade) {
    const ctx = this.ctx;
    const leftBase = this.project(option.x - option.width * 0.5, 0, z);
    const rightBase = this.project(option.x + option.width * 0.5, 0, z);
    const leftTop = this.project(option.x - option.width * 0.5, 2.7, z);
    const rightTop = this.project(option.x + option.width * 0.5, 2.7, z);
    const labelPos = this.project(option.x, 1.7, z);

    if (!leftBase || !rightBase || !leftTop || !rightTop || !labelPos) {
      return;
    }

    const palette = this.getGatePalette(option.type, option.value);
    const postWidth = clamp(labelPos.scale * 0.8, 4, 16);
    const glow = selected ? 1 + Math.sin(this.time * 10) * 0.18 : 1;
    const alpha = fade;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineCap = "round";

    ctx.strokeStyle = palette.glow;
    ctx.lineWidth = postWidth * 1.9 * glow;
    ctx.shadowColor = palette.glow;
    ctx.shadowBlur = selected ? 26 : 14;
    ctx.beginPath();
    ctx.moveTo(leftBase.x, leftBase.y);
    ctx.lineTo(leftTop.x, leftTop.y);
    ctx.moveTo(rightBase.x, rightBase.y);
    ctx.lineTo(rightTop.x, rightTop.y);
    ctx.moveTo(leftTop.x, leftTop.y);
    ctx.lineTo(rightTop.x, rightTop.y);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = palette.main;
    ctx.lineWidth = postWidth * glow;
    ctx.beginPath();
    ctx.moveTo(leftBase.x, leftBase.y);
    ctx.lineTo(leftTop.x, leftTop.y);
    ctx.moveTo(rightBase.x, rightBase.y);
    ctx.lineTo(rightTop.x, rightTop.y);
    ctx.moveTo(leftTop.x, leftTop.y);
    ctx.lineTo(rightTop.x, rightTop.y);
    ctx.stroke();

    const labelWidth = Math.abs(rightTop.x - leftTop.x) * 0.72;
    const labelHeight = clamp(postWidth * 4.3, 24, 54) * (selected ? 1.08 : 1);
    const pulse =
      flash > 0 ? 1 + easeOutBack(1 - Math.max(0, flash - 0.2) / 1) * 0.12 : 1;

    ctx.translate(labelPos.x, labelPos.y);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = palette.panel;
    this.roundRect(
      ctx,
      -labelWidth * 0.5,
      -labelHeight * 0.5,
      labelWidth,
      labelHeight,
      16,
      true
    );
    ctx.strokeStyle = palette.main;
    ctx.lineWidth = 3;
    this.roundRect(
      ctx,
      -labelWidth * 0.5,
      -labelHeight * 0.5,
      labelWidth,
      labelHeight,
      16,
      false
    );

    ctx.fillStyle = COLORS.textDark;
    ctx.font = `800 ${clamp(labelHeight * 0.62, 16, 30)}px "M PLUS Rounded 1c"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(option.label, 0, 1);
    ctx.restore();
  }

  getGatePalette(type, value) {
    if (type === "mul") {
      return {
        main: COLORS.multiply,
        glow: COLORS.multiplySoft,
        panel: "rgba(212, 241, 255, 0.94)",
      };
    }

    if (type === "add" && value >= 0) {
      return {
        main: COLORS.add,
        glow: COLORS.addSoft,
        panel: "rgba(221, 255, 238, 0.94)",
      };
    }

    return {
      main: COLORS.bad,
      glow: COLORS.badSoft,
      panel: "rgba(255, 237, 229, 0.94)",
    };
  }

  drawCrowd(entity, isPlayer) {
    const ctx = this.ctx;
    const count = this.getVisualCount(entity.renderCount);
    const actualCount = Math.max(0, Math.ceil(entity.count));
    const teamColor = isPlayer ? COLORS.player : COLORS.enemy;
    const teamDark = isPlayer ? COLORS.playerDark : COLORS.enemyDark;
    const soft = isPlayer ? COLORS.playerSoft : COLORS.enemySoft;
    const hitMix = entity.hitFlash;

    const aura = this.project(entity.x, 0.05, isPlayer ? entity.z - 1 : entity.z + 1);
    if (aura) {
      ctx.save();
      ctx.globalAlpha = isPlayer ? 0.18 : 0.16;
      ctx.fillStyle = soft;
      ctx.beginPath();
      ctx.ellipse(
        aura.x,
        aura.y + 12,
        clamp(aura.scale * (1.4 + Math.sqrt(Math.max(6, actualCount))), 28, 110),
        clamp(aura.scale * 0.42, 10, 24),
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }

    const members = [];
    for (let index = 0; index < count; index += 1) {
      const slot = this.formationSlots[index];
      const wave = Math.sin(this.time * 5.4 + slot.seed) * CONFIG.crowd.wobble;
      const spread = 1 + Math.min(actualCount / 105, 0.7);
      const x = entity.x + slot.x * spread + wave * 0.55;
      const z = isPlayer ? entity.z - slot.z * spread : entity.z + slot.z * spread;
      const projection = this.project(x, 0, z);
      if (!projection) {
        continue;
      }
      members.push({ slot, projection });
    }

    members.sort((a, b) => b.projection.depth - a.projection.depth);

    members.forEach(({ slot, projection }, index) => {
      const bob = Math.sin(this.time * 7 + slot.seed + index * 0.07) * 0.08;
      const size = clamp(
        projection.scale * (CONFIG.crowd.memberRadius + 0.08) * (1 + hitMix * 0.18),
        4,
        14
      );
      this.drawRunner(projection.x, projection.y, size, bob * projection.scale, {
        teamColor,
        teamDark,
        soft,
        hitMix,
        index,
      });
    });
  }

  drawRunner(x, y, size, bobOffset, palette) {
    const ctx = this.ctx;
    const bodyWidth = size * 1.08;
    const bodyHeight = size * 1.36;
    const bodyTop = y - size * 1.12 + bobOffset;
    const legY = bodyTop + bodyHeight;
    const headRadius = size * 0.44;
    const headY = bodyTop - headRadius * 0.12;
    const outline = Math.max(1.2, size * 0.16);
    const armSwing = Math.sin(this.time * 8 + palette.index * 0.19) * size * 0.16;

    ctx.fillStyle = COLORS.shadow;
    ctx.beginPath();
    ctx.ellipse(x, y + size * 0.46, size * 0.78, size * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = palette.teamDark;
    ctx.lineWidth = outline;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - size * 0.2, legY);
    ctx.lineTo(x - size * 0.34, legY + size * 0.56);
    ctx.moveTo(x + size * 0.2, legY);
    ctx.lineTo(x + size * 0.34, legY + size * 0.56);
    ctx.moveTo(x - bodyWidth * 0.56, bodyTop + bodyHeight * 0.44);
    ctx.lineTo(x - size * 0.14 - armSwing, bodyTop + bodyHeight * 0.62);
    ctx.moveTo(x + bodyWidth * 0.56, bodyTop + bodyHeight * 0.44);
    ctx.lineTo(x + size * 0.14 + armSwing, bodyTop + bodyHeight * 0.62);
    ctx.stroke();

    ctx.fillStyle = palette.hitMix > 0.2 ? COLORS.white : palette.teamColor;
    this.roundRect(
      ctx,
      x - bodyWidth * 0.5,
      bodyTop,
      bodyWidth,
      bodyHeight,
      size * 0.34,
      true
    );

    ctx.strokeStyle = palette.teamDark;
    ctx.lineWidth = outline;
    this.roundRect(
      ctx,
      x - bodyWidth * 0.5,
      bodyTop,
      bodyWidth,
      bodyHeight,
      size * 0.34,
      false
    );

    ctx.fillStyle = palette.soft;
    this.roundRect(
      ctx,
      x - bodyWidth * 0.28,
      bodyTop + bodyHeight * 0.16,
      bodyWidth * 0.56,
      bodyHeight * 0.22,
      size * 0.12,
      true
    );

    ctx.fillStyle = COLORS.white;
    ctx.beginPath();
    ctx.arc(x, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = palette.teamDark;
    ctx.lineWidth = outline;
    ctx.stroke();

    ctx.fillStyle = palette.teamDark;
    ctx.beginPath();
    ctx.arc(x, headY - headRadius * 0.02, headRadius * 0.96, Math.PI, 0);
    ctx.lineTo(x + headRadius * 0.96, headY);
    ctx.lineTo(x - headRadius * 0.96, headY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = palette.teamDark;
    ctx.beginPath();
    ctx.arc(x - headRadius * 0.22, headY + headRadius * 0.08, headRadius * 0.08, 0, Math.PI * 2);
    ctx.arc(x + headRadius * 0.22, headY + headRadius * 0.08, headRadius * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCrowdBubble(entity, isPlayer) {
    const anchor = this.project(entity.x, 3.5, isPlayer ? entity.z - 1.2 : entity.z);
    if (!anchor) {
      return;
    }

    const ctx = this.ctx;
    const countText = String(Math.max(0, Math.ceil(entity.count)));
    const teamLabel = isPlayer ? "\u5473\u65b9" : "\u6575";
    const strokeColor = isPlayer ? COLORS.player : COLORS.enemy;
    const bubbleWidth = 92 + countText.length * 16;
    const bubbleHeight = 52;
    const x = anchor.x - bubbleWidth * 0.5;
    const y = anchor.y - bubbleHeight - 12;

    ctx.fillStyle = "rgba(255,255,255,0.94)";
    this.roundRect(ctx, x, y, bubbleWidth, bubbleHeight, 18, true);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    this.roundRect(ctx, x, y, bubbleWidth, bubbleHeight, 18, false);

    ctx.fillStyle = strokeColor;
    ctx.font = '700 11px "M PLUS Rounded 1c"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(teamLabel, anchor.x, y + 13);

    ctx.fillStyle = COLORS.textDark;
    ctx.font = '800 22px "M PLUS Rounded 1c"';
    ctx.fillText(countText, anchor.x, y + 33);
  }

  drawEnemyBadge() {
    this.drawCrowdBubble(this.enemy, false);
  }

  drawEffects() {
    const ctx = this.ctx;

    this.popups.forEach((popup) => {
      const anchor = this.project(
        popup.worldX,
        2.4 + (1 - popup.ttl / popup.maxTtl) * popup.rise,
        popup.worldZ
      );
      if (!anchor) {
        return;
      }

      const alpha = popup.ttl / popup.maxTtl;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = popup.color;
      ctx.font = `800 ${18 + (1 - alpha) * 8}px "M PLUS Rounded 1c"`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 5;
      ctx.strokeText(popup.text, anchor.x, anchor.y);
      ctx.fillText(popup.text, anchor.x, anchor.y);
      ctx.globalAlpha = 1;
    });

    this.particles.forEach((particle) => {
      const alpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  roundRect(ctx, x, y, width, height, radius, fill) {
    const safeRadius = Math.min(radius, width * 0.5, height * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + safeRadius, y);
    ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
    ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
    ctx.arcTo(x, y + height, x, y, safeRadius);
    ctx.arcTo(x, y, x + width, y, safeRadius);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new CrowdGame();
});
