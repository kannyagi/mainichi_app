/**
 * game.js - ゲームコアロジック
 *
 * ゲーム状態の管理、クリア判定、タイマー制御を担当する。
 * UI の更新は ui.js に定義されたコールバック関数に委譲する。
 *
 * 依存:
 *   config.js   (DETECTION_CONFIG, GAME_MODE_CONFIG, QUEST_ITEMS, etc.)
 *   detector.js (checkQuestDetected, stopDetectionLoop)
 *   audio.js    (playTimeUpSound)
 *   ui.js       (onQuestChanged, onDetectionProgress, onQuestCleared,
 *                onTimerUpdate, updateScoreDisplay, showResult)
 */

'use strict';

// ============================================================
// ゲームステート定数
// ============================================================

/** ゲームの状態を表す定数オブジェクト */
const GameState = Object.freeze({
  IDLE:    'idle',    // ゲーム開始前
  PLAYING: 'playing', // ゲーム中
  CLEAR:   'clear',   // クリア演出中
  RESULT:  'result',  // 結果画面表示中
});

// ============================================================
// ゲームグローバル状態
// ============================================================

/**
 * ゲームの現在状態を保持するオブジェクト
 * 他モジュールからも参照できるよう const で公開する
 */
const game = {
  state:  GameState.IDLE,
  mode:   'time-attack',  // 'time-attack' | 'challenge'
  genre:  'home',         // 'home' | 'outdoor'

  // 現在のクエスト
  currentQuest: null,     // QUEST_ITEMS のエントリ

  // このセッションで使用済みのクエスト ID
  usedQuests: [],

  // --- タイムアタック ---
  startTimeMs: 0,         // ゲーム開始時刻 (Date.now())
  elapsedMs:   0,         // 経過ミリ秒

  // --- 100秒チャレンジ ---
  challengeScore:       0,     // クリア数
  challengeRemainingMs: 0,     // 残り時間 (ms)

  // --- クリア判定バッファ ---
  stableStart:  null,    // 安定認識が始まった時刻 (Date.now())
  stableFrames: 0,       // 連続して安定認識されたフレーム数

  // --- 内部タイマー ---
  _timerHandle: null,
};

// ============================================================
// ゲーム開始 / 終了
// ============================================================

/**
 * ゲームを開始する
 *
 * @param {string} mode  - 'time-attack' | 'challenge'
 * @param {string} genre - 'home' | 'outdoor'
 */
function startGame(mode, genre) {
  game.state               = GameState.PLAYING;
  game.mode                = mode;
  game.genre               = genre;
  game.usedQuests          = [];
  game.challengeScore      = 0;
  game.challengeRemainingMs = GAME_MODE_CONFIG.CHALLENGE_TOTAL_MS;
  game.startTimeMs         = Date.now();
  game.elapsedMs           = 0;

  _resetClearBuffer();
  _pickNextQuest();
  _startTimer();
}

/**
 * ゲームを終了して結果画面へ遷移する
 * タイムアップや「やめる」ボタンから呼ばれる。
 */
function endGame() {
  game.state = GameState.RESULT;
  _stopTimer();
  stopDetectionLoop();
}

// ============================================================
// クリア判定バッファ管理
// ============================================================

/**
 * クリア判定バッファをリセットする
 * 新しいクエストへの移行・認識途切れ時に呼ぶ。
 */
function _resetClearBuffer() {
  game.stableStart  = null;
  game.stableFrames = 0;
}

// ============================================================
// クエスト管理
// ============================================================

/**
 * 次のクエストをランダムに選んで設定する
 *
 * 全候補を使い切った場合はリセットして再利用する。
 * 同じクエストが連続しないよう直前の使用履歴を管理する。
 */
function _pickNextQuest() {
  const pool = QUEST_ITEMS[game.genre];

  // 未出題の候補に絞る
  let remaining = pool.filter(item => !game.usedQuests.includes(item.id));
  if (remaining.length === 0) {
    // 全問使い切り → リセット
    game.usedQuests = [];
    remaining = pool;
  }

  // ランダムに1つ選ぶ
  const idx = Math.floor(Math.random() * remaining.length);
  game.currentQuest = remaining[idx];
  game.usedQuests.push(game.currentQuest.id);

  _resetClearBuffer();

  // UI に通知
  onQuestChanged(game.currentQuest);
}

// ============================================================
// 検出結果の処理（メインの認識ロジック）
// ============================================================

/**
 * 検出ループから毎フレーム呼ばれる。
 * 誤認識対策を組み合わせてクリア判定を行う。
 *
 * 誤認識対策の仕組み:
 *   1. 信頼度しきい値 (物体ごとに設定)
 *   2. MIN_STABLE_FRAMES 連続フレームで初めて「安定」とみなす
 *   3. 安定認識が CLEAR_DURATION_MS 継続したらクリア
 *   4. 認識が1フレームでも外れたらバッファをリセット
 *
 * @param {Array<{label, score, bbox}>} detections
 */
function processDetections(detections) {
  // ゲームプレイ中のみ処理する
  if (game.state !== GameState.PLAYING) return;
  if (!game.currentQuest) return;

  const result = checkQuestDetected(detections, game.currentQuest);

  if (result.found) {
    // --- 今フレームは検出あり ---
    game.stableFrames++;

    if (game.stableFrames >= DETECTION_CONFIG.MIN_STABLE_FRAMES) {
      // 安定フレーム数を満たした → 時間計測を開始 or 継続

      if (game.stableStart === null) {
        // 初めて安定したタイミング
        game.stableStart = Date.now();
        onDetectionStable(); // 音などのフィードバック
      }

      const elapsed  = Date.now() - game.stableStart;
      const progress = Math.min(elapsed / DETECTION_CONFIG.CLEAR_DURATION_MS, 1.0);

      // UI へ進捗を通知（バー・ボックス描画）
      onDetectionProgress(progress, result.bbox, result.score, detections);

      if (elapsed >= DETECTION_CONFIG.CLEAR_DURATION_MS) {
        // ---- クリア達成 ----
        _handleClear();
      }
    } else {
      // まだ安定フレーム数に達していない（ノイズ扱い）
      onDetectionProgress(0, null, 0, detections);
    }

  } else {
    // --- 今フレームは検出なし → バッファをリセット ---
    if (game.stableStart !== null) {
      // 認識が途切れた
      _resetClearBuffer();
    }
    onDetectionProgress(0, null, 0, detections);
  }
}

/**
 * クリア処理
 * 演出を表示してから次の問題へ進む（またはゲーム終了）。
 */
function _handleClear() {
  game.state = GameState.CLEAR;
  _resetClearBuffer();

  // クリア演出を UI に通知
  onQuestCleared();

  setTimeout(() => {
    if (game.mode === 'time-attack') {
      // タイムアタックは1問クリアでゲーム終了
      game.elapsedMs = Date.now() - game.startTimeMs;
      endGame();
      showResult();
    } else {
      // 100秒チャレンジは次のクエストへ
      game.challengeScore++;
      game.state = GameState.PLAYING;
      updateScoreDisplay(game.challengeScore);
      _pickNextQuest();
    }
  }, DETECTION_CONFIG.NEXT_QUEST_DELAY_MS);
}

// ============================================================
// タイマー
// ============================================================

/**
 * ゲームタイマーを開始する
 */
function _startTimer() {
  _stopTimer();
  _timerTick(); // 即時実行
  game._timerHandle = setInterval(_timerTick, GAME_MODE_CONFIG.TIMER_TICK_MS);
}

/**
 * ゲームタイマーを停止する
 */
function _stopTimer() {
  if (game._timerHandle !== null) {
    clearInterval(game._timerHandle);
    game._timerHandle = null;
  }
}

/**
 * タイマーの 1 ティック処理
 * TIMER_TICK_MS 間隔で呼ばれる。
 */
function _timerTick() {
  if (game.mode === 'time-attack') {
    // タイムアタック: 経過時間を加算して表示
    game.elapsedMs = Date.now() - game.startTimeMs;
    onTimerUpdate(game.elapsedMs, false, false);

  } else {
    // 100秒チャレンジ: 残り時間を減算
    game.challengeRemainingMs = Math.max(
      0,
      game.challengeRemainingMs - GAME_MODE_CONFIG.TIMER_TICK_MS
    );

    const isWarning = game.challengeRemainingMs <= GAME_MODE_CONFIG.TIMER_WARNING_MS;
    onTimerUpdate(game.challengeRemainingMs, false, isWarning);

    if (game.challengeRemainingMs <= 0) {
      // タイムアップ
      _stopTimer();
      stopDetectionLoop();
      playTimeUpSound();
      onTimerUpdate(0, true, true);

      setTimeout(() => {
        endGame();
        showResult();
      }, 900);
    }
  }
}

// ============================================================
// 結果データ
// ============================================================

/**
 * 結果画面用のデータを返す
 * ui.js の showResult() から呼ばれる。
 *
 * @returns {Object}
 */
function getResultData() {
  if (game.mode === 'time-attack') {
    return {
      mode:       game.mode,
      genre:      game.genre,
      quest:      game.currentQuest,
      elapsedMs:  game.elapsedMs,
    };
  } else {
    return {
      mode:    game.mode,
      genre:   game.genre,
      score:   game.challengeScore,
      totalMs: GAME_MODE_CONFIG.CHALLENGE_TOTAL_MS,
    };
  }
}
