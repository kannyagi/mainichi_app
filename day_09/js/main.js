/**
 * main.js - エントリポイント
 *
 * 初期化フローとイベントリスナーの設定を行う。
 * 他のモジュールの橋渡し役。
 *
 * 依存:
 *   config.js   detector.js   audio.js
 *   game.js     ui.js
 */

'use strict';

// ============================================================
// 選択状態（タイトル画面での選択を保持）
// ============================================================
let _selectedMode  = 'time-attack';
let _selectedGenre = 'home';

// ============================================================
// 初期化
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  // DOM 参照を初期化
  initDOM();

  // ローディング画面を表示
  showScreen('screen-loading');

  // イベントリスナーを登録
  _setupEventListeners();

  // AI モデルをロード
  try {
    await loadModel(progress => {
      updateLoadingBar(progress);
    });

    // ロード完了後、短いウェイトを挟んでタイトル画面へ
    setTimeout(() => {
      showScreen('screen-title');
    }, 500);

  } catch (err) {
    console.error('[main] モデルロードエラー:', err);
    const text = document.getElementById('loading-text');
    if (text) {
      text.textContent = '⚠️ モデルの読み込みに失敗しました。ページを再読み込みしてください。';
    }
  }
});

// ============================================================
// イベントリスナー
// ============================================================

function _setupEventListeners() {

  // ---- モード選択ボタン ----
  document.querySelectorAll('.btn-mode').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-mode').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _selectedMode = btn.dataset.mode;
    });
  });

  // ---- ジャンル選択ボタン ----
  document.querySelectorAll('.btn-genre').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-genre').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _selectedGenre = btn.dataset.genre;
    });
  });

  // ---- スタートボタン ----
  document.getElementById('btn-start').addEventListener('click', async () => {
    // playStartSound を最初のユーザー操作で呼ぶことで
    // AudioContext をここで初期化する
    playStartSound();
    await _startGameFlow(_selectedMode, _selectedGenre);
  });

  // ---- やめるボタン ----
  document.getElementById('btn-quit').addEventListener('click', () => {
    stopDetectionLoop();
    endGame();
    stopCamera();
    clearCanvas();
    showScreen('screen-title');
  });

  // ---- もう一度ボタン（結果画面） ----
  document.getElementById('btn-retry').addEventListener('click', async () => {
    await _startGameFlow(_selectedMode, _selectedGenre);
  });

  // ---- タイトルへボタン（結果画面） ----
  document.getElementById('btn-home').addEventListener('click', () => {
    showScreen('screen-title');
  });

  // ---- カメラ再試行ボタン ----
  document.getElementById('btn-retry-camera').addEventListener('click', async () => {
    await _startGameFlow(_selectedMode, _selectedGenre);
  });

  // ---- カメラエラー画面からタイトルへ ----
  document.getElementById('btn-camera-home').addEventListener('click', () => {
    showScreen('screen-title');
  });

  // ---- ウィンドウリサイズ・画面回転時に Canvas を調整 ----
  window.addEventListener('resize', () => {
    if (
      game.state === GameState.PLAYING ||
      game.state === GameState.CLEAR
    ) {
      resizeCanvas();
    }
  });
}

// ============================================================
// ゲーム開始フロー
// ============================================================

/**
 * カメラ起動 → ゲーム開始の一連のフローを実行する
 *
 * @param {string} mode  - 'time-attack' | 'challenge'
 * @param {string} genre - 'home' | 'outdoor'
 */
async function _startGameFlow(mode, genre) {
  // 前のゲームをクリーンアップ
  stopDetectionLoop();
  stopCamera();
  clearCanvas();

  // ゲーム画面を初期化して表示
  setupGameScreen(mode, genre);
  showScreen('screen-game');

  // カメラを起動する
  try {
    await startCamera();
  } catch (err) {
    console.error('[main] カメラ起動エラー:', err);
    showCameraError(err);
    return;
  }

  // ゲームロジックを開始
  startGame(mode, genre);

  // 物体検出ループを開始（game.js の processDetections に渡す）
  startDetectionLoop(DOM.video, processDetections);
}
