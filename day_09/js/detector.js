/**
 * detector.js - AI 物体検出モジュール
 *
 * TensorFlow.js + COCO-SSD を使ってカメラ映像から物体を検出する。
 * モデルのロード・推論・クエスト一致判定を担当する。
 *
 * 依存: config.js (DETECTION_CONFIG, QUEST_ITEMS)
 */

'use strict';

// ============================================================
// モジュール内状態
// ============================================================

/** ロード済みモデルのインスタンス */
let _model = null;

/** 検出ループが実行中かどうか */
let _isRunning = false;

/** setTimeout のハンドル */
let _loopTimer = null;

// ============================================================
// モデル管理
// ============================================================

/**
 * COCO-SSD モデルをロードする
 *
 * モデル選定理由:
 *   mobilenet_v2 は lite_mobilenet_v2 より精度が高く、
 *   スマホのWebGLでも十分な速度で動作する。
 *   将来的により大きなモデルに切り替えやすいように
 *   ここで一元管理する。
 *
 * @param {function(number): void} onProgress - 進捗コールバック (0.0〜1.0)
 * @returns {Promise<void>}
 */
async function loadModel(onProgress) {
  onProgress(0.05);

  try {
    _model = await cocoSsd.load({
      /**
       * 'mobilenet_v2'      : 精度重視（推奨）
       * 'lite_mobilenet_v2' : 速度重視（低スペック端末向け）
       */
      base: 'mobilenet_v2',
    });

    onProgress(1.0);
    console.log('[detector] COCO-SSD モデルのロード完了');
  } catch (err) {
    console.error('[detector] モデルのロードに失敗しました:', err);
    throw err;
  }
}

/**
 * モデルがロード済みかどうかを返す
 * @returns {boolean}
 */
function isModelLoaded() {
  return _model !== null;
}

// ============================================================
// 推論
// ============================================================

/**
 * 1フレーム分の推論を実行する
 *
 * @param {HTMLVideoElement} video - カメラ映像
 * @returns {Promise<Array>} COCO-SSD の生の予測結果配列
 */
async function _detectOnce(video) {
  if (!_model) throw new Error('[detector] モデルが未ロードです');
  if (!video || video.readyState < 2) return []; // 映像未準備

  return _model.detect(video);
}

/**
 * COCO-SSD の生の予測結果を扱いやすい形式に変換する
 *
 * @param {Array} rawPredictions - cocoSsd.detect() の出力
 * @returns {Array<{label: string, score: number, bbox: number[]}>}
 *   bbox: [x, y, width, height] (ピクセル単位、video の自然サイズ基準)
 */
function _normalizePredictions(rawPredictions) {
  return rawPredictions.map(p => ({
    label: p.class,          // 英語ラベル
    score: p.score,          // 信頼度 (0〜1)
    bbox:  p.bbox,           // [x, y, w, h]
  }));
}

// ============================================================
// クエスト一致判定
// ============================================================

/**
 * 検出結果の中に指定クエストの物体があるか判定する
 *
 * 誤認識対策:
 *   - 物体ごとに設定した信頼度しきい値を適用する
 *   - aliases で同義ラベルに対応する（将来の拡張用）
 *   - 複数の候補がある場合は最もスコアの高いものを採用する
 *
 * @param {Array<{label, score, bbox}>} detections
 * @param {Object} questItem - QUEST_ITEMS のエントリ
 * @returns {{ found: boolean, score: number, bbox: number[]|null }}
 */
function checkQuestDetected(detections, questItem) {
  // 物体専用のしきい値、なければデフォルトを使用
  const threshold = (questItem.confidence !== undefined)
    ? questItem.confidence
    : DETECTION_CONFIG.DEFAULT_CONFIDENCE;

  // メインラベル + エイリアスを合わせた対象ラベル一覧
  const targetLabels = [questItem.label, ...(questItem.aliases ?? [])];

  // スコアが最も高い一致候補を探す
  let best = null;
  for (const det of detections) {
    if (!targetLabels.includes(det.label)) continue; // ラベル不一致
    if (det.score < threshold) continue;             // 信頼度不足
    if (!best || det.score > best.score) {
      best = det;
    }
  }

  return {
    found: best !== null,
    score: best ? best.score : 0,
    bbox:  best ? best.bbox  : null,
  };
}

// ============================================================
// 検出ループ
// ============================================================

/**
 * 検出ループを開始する
 * 一定間隔で推論を実行し、結果をコールバックに渡す。
 *
 * @param {HTMLVideoElement} video - カメラ映像
 * @param {function(Array): void} onDetection - 検出結果コールバック
 */
function startDetectionLoop(video, onDetection) {
  if (_isRunning) return; // 二重起動を防ぐ
  _isRunning = true;

  const runOnce = async () => {
    if (!_isRunning) return;

    try {
      const raw        = await _detectOnce(video);
      const detections = _normalizePredictions(raw);
      onDetection(detections);
    } catch (err) {
      // 推論エラーは警告だけ出してループを継続する
      console.warn('[detector] 推論エラー:', err);
    }

    if (_isRunning) {
      _loopTimer = setTimeout(runOnce, DETECTION_CONFIG.DETECTION_INTERVAL_MS);
    }
  };

  runOnce();
}

/**
 * 検出ループを停止する
 */
function stopDetectionLoop() {
  _isRunning = false;
  if (_loopTimer !== null) {
    clearTimeout(_loopTimer);
    _loopTimer = null;
  }
}
