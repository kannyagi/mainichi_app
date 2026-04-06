/**
 * ui.js - UI レンダリング・画面遷移
 *
 * DOM 操作・Canvas 描画・画面切り替えを担当する。
 * game.js から呼ばれるコールバック関数を実装する。
 *
 * 依存:
 *   config.js  (MODE_LABELS, GENRE_LABELS, DETECTION_CONFIG)
 *   audio.js   (playClearSound, playDetectingStartSound)
 *   game.js    (game オブジェクト, getResultData)
 */

'use strict';

// ============================================================
// DOM 参照キャッシュ
// （initDOM() 呼び出し後に有効になる）
// ============================================================
const DOM = {};

/**
 * DOM 参照を初期化する
 * DOMContentLoaded 後に必ず1回呼ぶ。
 */
function initDOM() {
  // 画面
  DOM.screens = {};
  document.querySelectorAll('.screen').forEach(el => {
    DOM.screens[el.id] = el;
  });

  // カメラ・Canvas
  DOM.video  = document.getElementById('camera-video');
  DOM.canvas = document.getElementById('detection-canvas');
  DOM.ctx    = DOM.canvas.getContext('2d');

  // ゲームヘッダー
  DOM.gameModeLabel = document.getElementById('game-mode-label');
  DOM.gameTimer     = document.getElementById('game-timer');
  DOM.questName     = document.getElementById('quest-name');

  // 進捗
  DOM.progressOverlay = document.getElementById('progress-overlay');
  DOM.progressFill    = document.getElementById('progress-fill');
  DOM.progressLabel   = document.getElementById('progress-label');

  // フッター
  DOM.scoreArea  = document.getElementById('score-area');
  DOM.scoreCount = document.getElementById('score-count');

  // オーバーレイ
  DOM.clearOverlay = document.getElementById('clear-overlay');

  // 結果
  DOM.resultTitle = document.getElementById('result-title');
  DOM.resultStats = document.getElementById('result-stats');

  // エラー
  DOM.cameraErrorMsg = document.getElementById('camera-error-message');
}

// ============================================================
// 画面遷移
// ============================================================

/**
 * 指定した ID の画面を表示し、他を非表示にする
 * @param {string} screenId - screen 要素の id
 */
function showScreen(screenId) {
  Object.values(DOM.screens).forEach(el => el.classList.remove('active'));
  const target = DOM.screens[screenId];
  if (target) {
    target.classList.add('active');
  } else {
    console.warn('[ui] 存在しない画面 ID:', screenId);
  }
}

// ============================================================
// ローディング画面
// ============================================================

/**
 * ローディングバーと進捗テキストを更新する
 * @param {number} progress - 0.0〜1.0
 */
function updateLoadingBar(progress) {
  const bar  = document.getElementById('loading-bar');
  const text = document.getElementById('loading-text');

  if (bar)  bar.style.width = `${Math.round(progress * 100)}%`;
  if (text) {
    if (progress < 1) {
      text.textContent = `AIモデル読み込み中... ${Math.round(progress * 100)}%`;
    } else {
      text.textContent = '準備完了！';
    }
  }
}

// ============================================================
// ゲーム画面セットアップ
// ============================================================

/**
 * ゲーム開始前にゲーム画面の初期状態をセットする
 * @param {string} mode
 * @param {string} genre
 */
function setupGameScreen(mode, genre) {
  DOM.gameModeLabel.textContent = MODE_LABELS[mode] ?? mode;
  DOM.gameTimer.textContent     = (mode === 'time-attack') ? '0.0s' : '100s';
  DOM.gameTimer.classList.remove('warning');

  // スコアエリアはチャレンジモードのみ表示
  if (mode === 'challenge') {
    DOM.scoreArea.classList.remove('hidden');
    DOM.scoreCount.textContent = '0';
  } else {
    DOM.scoreArea.classList.add('hidden');
  }

  // 進捗バー・クリアオーバーレイは最初は隠す
  DOM.progressOverlay.classList.add('hidden');
  DOM.clearOverlay.classList.add('hidden');
  DOM.questName.textContent = '...';
}

// ============================================================
// カメラ管理
// ============================================================

/**
 * カメラを起動して video 要素に接続する
 * スマホでは背面カメラ（environment）を優先する。
 * @returns {Promise<void>}
 */
async function startCamera() {
  const constraints = {
    video: {
      facingMode: { ideal: 'environment' }, // 背面カメラ優先
      width:  { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  DOM.video.srcObject = stream;

  // 映像メタデータが来るまで待機してから Canvas サイズを合わせる
  return new Promise(resolve => {
    DOM.video.onloadedmetadata = () => {
      DOM.video.play();
      resizeCanvas();
      resolve();
    };
  });
}

/**
 * カメラを停止し、ストリームを解放する
 */
function stopCamera() {
  if (DOM.video.srcObject) {
    DOM.video.srcObject.getTracks().forEach(t => t.stop());
    DOM.video.srcObject = null;
  }
}

/**
 * Canvas のサイズをカメラコンテナに合わせる
 * ウィンドウリサイズや画面回転時に呼ぶ。
 */
function resizeCanvas() {
  const container = DOM.canvas.parentElement;
  DOM.canvas.width  = container.offsetWidth;
  DOM.canvas.height = container.offsetHeight;
}

// ============================================================
// Canvas 描画
// ============================================================

/**
 * object-fit: cover でカメラ映像を表示しているとき、
 * 映像座標（videoWidth × videoHeight）をキャンバス座標に変換する係数を計算する。
 *
 * @returns {{ scale: number, offsetX: number, offsetY: number }}
 */
function _getCoverTransform() {
  const vw = DOM.video.videoWidth;
  const vh = DOM.video.videoHeight;
  const cw = DOM.canvas.width;
  const ch = DOM.canvas.height;

  if (!vw || !vh) return { scale: 1, offsetX: 0, offsetY: 0 };

  const videoAR     = vw / vh;
  const containerAR = cw / ch;

  let scale, offsetX, offsetY;

  if (videoAR > containerAR) {
    // 映像が横に広い → 高さに合わせてスケール、左右をクロップ
    scale   = ch / vh;
    offsetX = (cw - vw * scale) / 2;
    offsetY = 0;
  } else {
    // 映像が縦に長い → 幅に合わせてスケール、上下をクロップ
    scale   = cw / vw;
    offsetX = 0;
    offsetY = (ch - vh * scale) / 2;
  }

  return { scale, offsetX, offsetY };
}

// Canvas 描画で使う色定数
const DRAW_COLORS = {
  targetBox:   '#4ecca3',  // ターゲット検出時の枠
  targetLabel: '#0f0f14',  // ターゲットラベル文字色
  targetBg:    '#4ecca3',  // ターゲットラベル背景
};

/**
 * Canvas をクリアする
 */
function clearCanvas() {
  if (DOM.ctx) {
    DOM.ctx.clearRect(0, 0, DOM.canvas.width, DOM.canvas.height);
  }
}

/**
 * 検出ボックスとラベルを Canvas に描画する
 *
 * ターゲット物体のみ強調表示し、それ以外は描画しない
 * （画面をすっきり保つため）。
 *
 * @param {Array<{label, score, bbox}>} detections
 * @param {Object|null} questItem - 現在のクエスト
 */
function drawDetections(detections, questItem) {
  clearCanvas();
  if (!detections || !questItem || detections.length === 0) return;

  const targetLabels = [questItem.label, ...(questItem.aliases ?? [])];
  const { scale, offsetX, offsetY } = _getCoverTransform();
  const ctx = DOM.ctx;

  for (const det of detections) {
    if (!targetLabels.includes(det.label)) continue; // ターゲット以外はスキップ

    const [bx, by, bw, bh] = det.bbox;
    const x = bx * scale + offsetX;
    const y = by * scale + offsetY;
    const w = bw * scale;
    const h = bh * scale;

    // --- 枠線 ---
    ctx.strokeStyle = DRAW_COLORS.targetBox;
    ctx.lineWidth   = 3;
    ctx.lineJoin    = 'round';
    ctx.strokeRect(x, y, w, h);

    // --- ラベル ---
    const labelText = `${questItem.name}  ${Math.round(det.score * 100)}%`;
    const fontSize  = 14;
    ctx.font = `bold ${fontSize}px -apple-system, sans-serif`;

    const textMetrics = ctx.measureText(labelText);
    const labelW = textMetrics.width + 12;
    const labelH = fontSize + 10;
    const labelX = x;
    const labelY = y - labelH;

    // ラベルをカメラ外に出さないよう位置調整
    const drawLabelY = (labelY < 0) ? y + 2 : labelY;

    ctx.fillStyle = DRAW_COLORS.targetBg;
    ctx.beginPath();
    // roundRect は古い Safari で未対応のためフォールバックを用意する
    if (ctx.roundRect) {
      ctx.roundRect(labelX, drawLabelY, labelW, labelH, 4);
    } else {
      ctx.rect(labelX, drawLabelY, labelW, labelH);
    }
    ctx.fill();

    ctx.fillStyle = DRAW_COLORS.targetLabel;
    ctx.fillText(labelText, labelX + 6, drawLabelY + fontSize);
  }
}

// ============================================================
// game.js から呼ばれるコールバック関数
// ============================================================

/**
 * クエストが変わったときに呼ばれる
 * @param {Object} questItem
 */
function onQuestChanged(questItem) {
  DOM.questName.textContent = questItem.name;
  DOM.progressOverlay.classList.add('hidden');
  DOM.clearOverlay.classList.add('hidden');
  clearCanvas();
}

/**
 * 安定検出が始まったとき（最初の1回）に呼ばれる
 * 音フィードバックを出す。
 */
function onDetectionStable() {
  playDetectingStartSound();
}

/**
 * 毎フレームの検出進捗を受け取る
 *
 * @param {number}        progress  - 0.0〜1.0（クリアまでの進捗）
 * @param {number[]|null} bbox      - ハイライト対象のバウンディングボックス
 * @param {number}        score     - 検出スコア
 * @param {Array}         detections - 全検出結果（描画用）
 */
function onDetectionProgress(progress, bbox, score, detections) {
  // Canvas にボックスを描画
  drawDetections(detections, game.currentQuest);

  if (progress > 0) {
    // 進捗バーを表示・更新
    DOM.progressOverlay.classList.remove('hidden');
    DOM.progressFill.style.width = `${Math.round(progress * 100)}%`;
    DOM.progressLabel.textContent = `認識中 ${Math.round(progress * 100)}%`;
  } else {
    // 認識が外れたら進捗バーを隠す
    DOM.progressOverlay.classList.add('hidden');
  }
}

/**
 * クリアしたときに呼ばれる
 * 演出を表示し効果音を鳴らす。
 */
function onQuestCleared() {
  playClearSound();
  DOM.clearOverlay.classList.remove('hidden');
  DOM.progressOverlay.classList.add('hidden');
  clearCanvas();
}

/**
 * タイマーが更新されるたびに呼ばれる
 *
 * @param {number}  ms        - タイムアタック: 経過ms / チャレンジ: 残りms
 * @param {boolean} isTimeUp  - タイムアップかどうか
 * @param {boolean} isWarning - 残り時間が警告レベルかどうか
 */
function onTimerUpdate(ms, isTimeUp, isWarning = false) {
  if (game.mode === 'time-attack') {
    DOM.gameTimer.textContent = `${(ms / 1000).toFixed(1)}s`;
    DOM.gameTimer.classList.remove('warning');
  } else {
    const sec = Math.ceil(ms / 1000);
    DOM.gameTimer.textContent = `${sec}s`;

    if (isWarning) {
      DOM.gameTimer.classList.add('warning');
    }
  }
}

/**
 * スコア表示を更新する（チャレンジモード）
 * @param {number} score
 */
function updateScoreDisplay(score) {
  DOM.scoreCount.textContent = score;
}

// ============================================================
// 結果画面
// ============================================================

/**
 * 結果画面を表示する
 * game.js の endGame() 後に呼ばれる。
 */
function showResult() {
  stopCamera();
  clearCanvas();

  const data = getResultData();

  if (data.mode === 'time-attack') {
    DOM.resultTitle.textContent = '🎉 クリア！';
    DOM.resultStats.innerHTML = `
      <div class="result-stat">
        <span class="result-stat-label">お題</span>
        <span class="result-stat-value">${data.quest ? data.quest.name : '---'}</span>
      </div>
      <div class="result-stat">
        <span class="result-stat-label">タイム</span>
        <span class="result-stat-value">${(data.elapsedMs / 1000).toFixed(2)} 秒</span>
      </div>
      <div class="result-stat">
        <span class="result-stat-label">ジャンル</span>
        <span class="result-stat-value">${GENRE_LABELS[data.genre]}</span>
      </div>
    `;
  } else {
    DOM.resultTitle.textContent = 'タイムアップ！';
    DOM.resultStats.innerHTML = `
      <div class="result-stat">
        <span class="result-stat-label">クリア数</span>
        <span class="result-stat-value">${data.score} 問</span>
      </div>
      <div class="result-stat">
        <span class="result-stat-label">ジャンル</span>
        <span class="result-stat-value">${GENRE_LABELS[data.genre]}</span>
      </div>
    `;
  }

  showScreen('screen-result');
}

// ============================================================
// カメラエラー表示
// ============================================================

/**
 * カメラエラーの内容に応じたメッセージを表示する
 * @param {Error} err - getUserMedia が投げたエラー
 */
function showCameraError(err) {
  let message = 'カメラへのアクセスに失敗しました。';

  if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
    message = 'カメラの使用を許可してください。\nブラウザのアドレスバー横のアイコンから許可できます。';
  } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
    message = 'カメラが見つかりません。\nカメラが接続されているか確認してください。';
  } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
    message = 'カメラが他のアプリで使用中です。\n他のアプリを閉じてから再試行してください。';
  } else if (err.name === 'OverconstrainedError') {
    message = 'カメラの設定に問題があります。ページを再読み込みしてください。';
  }

  DOM.cameraErrorMsg.textContent = message;
  showScreen('screen-camera-error');
}
