/**
 * config.js - ゲーム全体の設定定数
 *
 * ここを変更することで、認識精度・ゲームバランスを
 * 一か所で調整できる。マジックナンバーはここに集約する。
 */

'use strict';

// ============================================================
// AI 検出設定
// ============================================================
const DETECTION_CONFIG = {
  /**
   * デフォルトの信頼度しきい値 (0〜1)
   * 下げると認識しやすいが誤認識も増える。
   * 物体ごとに上書き可能（QUEST_ITEMS の confidence フィールド）。
   */
  DEFAULT_CONFIDENCE: 0.60,

  /**
   * クリア判定に必要な継続認識時間 (ミリ秒)
   * この時間ずっと同じ物体を認識し続けるとクリア。
   */
  CLEAR_DURATION_MS: 2000,

  /**
   * 検出ループの実行間隔 (ミリ秒)
   * 小さくするほど滑らかだが CPU / バッテリー負荷が増える。
   */
  DETECTION_INTERVAL_MS: 150,

  /**
   * ノイズ除去: 何フレーム連続して検出されたら「安定」と見なすか。
   * 1〜2フレームの瞬間的な誤検出をスキップする。
   */
  MIN_STABLE_FRAMES: 3,

  /**
   * クリア後、次の問題に進むまでの待機時間 (ミリ秒)
   * 演出アニメーションの表示時間と合わせる。
   */
  NEXT_QUEST_DELAY_MS: 1600,
};

// ============================================================
// ゲームモード設定
// ============================================================
const GAME_MODE_CONFIG = {
  /** 100秒チャレンジの制限時間 (ミリ秒) */
  CHALLENGE_TOTAL_MS: 100 * 1000,

  /** タイマー警告開始の残り時間 (ミリ秒) / 残りN秒でタイマーを赤くする */
  TIMER_WARNING_MS: 20 * 1000,

  /** タイマー更新間隔 (ミリ秒) */
  TIMER_TICK_MS: 100,
};

// ============================================================
// 出題候補の定義
//
// 各フィールドの説明:
//   id         : 内部識別子 (英数字、ユニーク)
//   label      : COCO-SSD が返す英語ラベル名 (完全一致)
//   name       : ゲーム画面に表示する日本語名
//   confidence : この物体専用の信頼度しきい値
//                未設定時は DETECTION_CONFIG.DEFAULT_CONFIDENCE を使用
//   aliases    : 同義と扱う追加ラベル（将来のラベルマッピング拡張用）
//
// 採用基準:
//   - COCO 80クラスに存在すること
//   - 実際のカメラ映像で安定して認識できること
//   - 多くの家庭・屋外環境で見つけやすいこと
// ============================================================
const QUEST_ITEMS = {

  // ----------------------------------------------------------
  // 家モード
  // ----------------------------------------------------------
  home: [
    {
      id: 'cup',
      label: 'cup',
      name: 'コップ',
      confidence: 0.60,
      aliases: [],
    },
    {
      id: 'chair',
      label: 'chair',
      name: 'イス',
      confidence: 0.60,
      aliases: [],
    },
    {
      id: 'bed',
      label: 'bed',
      name: 'ベッド',
      confidence: 0.62,
      aliases: [],
    },
    {
      id: 'tv',
      label: 'tv',
      name: 'テレビ',
      confidence: 0.65,
      // モニターも TV として認識されることが多い
      aliases: [],
    },
    {
      id: 'refrigerator',
      label: 'refrigerator',
      name: '冷蔵庫',
      confidence: 0.65,
      aliases: [],
    },
    {
      id: 'couch',
      label: 'couch',
      name: 'ソファ',
      confidence: 0.62,
      aliases: [],
    },
    {
      id: 'book',
      label: 'book',
      name: '本',
      confidence: 0.60,
      aliases: [],
    },
    {
      id: 'clock',
      label: 'clock',
      name: '時計',
      confidence: 0.62,
      aliases: [],
    },
    {
      id: 'laptop',
      label: 'laptop',
      name: 'ノートPC',
      confidence: 0.65,
      aliases: [],
    },
    {
      id: 'cell_phone',
      label: 'cell phone',
      name: 'スマホ',
      confidence: 0.62,
      // 別の人のスマホをカメラで映してもよい
      aliases: [],
    },
    {
      id: 'bottle',
      label: 'bottle',
      name: 'ペットボトル',
      confidence: 0.60,
      aliases: [],
    },
    {
      id: 'potted_plant',
      label: 'potted plant',
      name: '植木鉢',
      confidence: 0.60,
      aliases: [],
    },
  ],

  // ----------------------------------------------------------
  // 外モード
  // ----------------------------------------------------------
  outdoor: [
    {
      id: 'car',
      label: 'car',
      name: '車',
      confidence: 0.60,
      // トラックも「車」扱いにする
      aliases: ['truck'],
    },
    {
      id: 'bicycle',
      label: 'bicycle',
      name: '自転車',
      confidence: 0.62,
      aliases: [],
    },
    {
      id: 'motorcycle',
      label: 'motorcycle',
      name: 'バイク',
      confidence: 0.62,
      aliases: [],
    },
    {
      id: 'traffic_light',
      label: 'traffic light',
      name: '信号機',
      confidence: 0.65,
      aliases: [],
    },
    {
      id: 'bus',
      label: 'bus',
      name: 'バス',
      confidence: 0.62,
      aliases: [],
    },
    {
      id: 'bench',
      label: 'bench',
      name: 'ベンチ',
      confidence: 0.60,
      aliases: [],
    },
    {
      id: 'stop_sign',
      label: 'stop sign',
      name: '一時停止標識',
      confidence: 0.65,
      aliases: [],
    },
    {
      id: 'dog',
      label: 'dog',
      name: 'イヌ',
      confidence: 0.65,
      aliases: [],
    },
    {
      id: 'cat',
      label: 'cat',
      name: 'ネコ',
      confidence: 0.65,
      aliases: [],
    },
    {
      id: 'bird',
      label: 'bird',
      name: 'トリ',
      confidence: 0.60,
      aliases: [],
    },
  ],
};

// ============================================================
// 表示名マッピング
// ============================================================

/** ゲームモードの表示名 */
const MODE_LABELS = {
  'time-attack': 'タイムアタック',
  'challenge':   '100秒チャレンジ',
};

/** ジャンルの表示名 */
const GENRE_LABELS = {
  home:    '🏠 家の中',
  outdoor: '🏙️ 外',
};
