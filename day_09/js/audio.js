/**
 * audio.js - Web Audio API を使った効果音
 *
 * 外部ファイル不要でブラウザ内で音を合成する。
 * ユーザー操作後に AudioContext を初期化するため、
 * 最初に playStartSound() 等を呼ぶことで初期化される。
 */

'use strict';

// AudioContext のシングルトン（遅延初期化）
let _audioCtx = null;

/**
 * AudioContext を取得する（なければ作る）
 * ブラウザのポリシーにより、ユーザー操作後でないと
 * AudioContext を resume できない。
 * @returns {AudioContext}
 */
function getAudioContext() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // suspended 状態なら resume する
  if (_audioCtx.state === 'suspended') {
    _audioCtx.resume();
  }
  return _audioCtx;
}

/**
 * 基本的なビープ音を再生する内部ユーティリティ
 *
 * @param {number} freq     - 周波数 (Hz)
 * @param {number} duration - 長さ (秒)
 * @param {string} type     - 波形 ('sine' | 'square' | 'triangle' | 'sawtooth')
 * @param {number} gain     - 音量 (0〜1)
 * @param {number} delay    - 再生開始までの遅延 (秒)
 */
function _beep(freq, duration, type = 'sine', gain = 0.3, delay = 0) {
  try {
    const ctx = getAudioContext();
    const osc      = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    // フェードアウトで音のクリックノイズを防ぐ
    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.05);
  } catch (e) {
    // 音の失敗はゲームに影響させない
    console.warn('[audio] 再生失敗:', e);
  }
}

// ============================================================
// 公開 API
// ============================================================

/**
 * ゲームスタート音（短い上昇音）
 * スタートボタンを押したときに鳴らす。
 * ※ この呼び出しで AudioContext を初期化する。
 */
function playStartSound() {
  _beep(523, 0.12, 'sine', 0.28, 0.00); // C5
  _beep(784, 0.15, 'sine', 0.28, 0.12); // G5
}

/**
 * クリア成功音（明るい上昇和音）
 * 物体を 2 秒間認識してクリアしたときに鳴らす。
 */
function playClearSound() {
  // C5 → E5 → G5 → C6 と順に鳴らす
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    _beep(freq, 0.25, 'sine', 0.35, i * 0.08);
  });
}

/**
 * 認識開始音（短いピン音）
 * 安定認識が始まったとき（1回だけ）鳴らす。
 */
function playDetectingStartSound() {
  _beep(880, 0.07, 'sine', 0.18);
}

/**
 * タイムアップ音（低い下降音）
 * 100秒チャレンジの時間切れに鳴らす。
 */
function playTimeUpSound() {
  _beep(330, 0.40, 'square', 0.22, 0.00);
  _beep(220, 0.60, 'square', 0.18, 0.35);
}
