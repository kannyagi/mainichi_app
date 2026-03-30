const QUIZ_LENGTH = 6;
const DATA_URL = "./data/pokemon.json";
const APP_URL = "https://kannyagi.github.io/mainichi_app/day_01/";
const STORAGE_KEYS = {
  records: "pokemon-quiz-lab-records-v2",
  sound: "pokemon-quiz-lab-sound-v1",
  visual: "pokemon-quiz-lab-visual-v1",
  locale: "pokemon-q-locale-v1",
};

const TYPE_ORDER = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

const MODE_CONFIG = {
  silhouette: {
    label: { ja: "シルエット", en: "Silhouette" },
    shortLabel: { ja: "シルエット", en: "Silhouette" },
    deckLabel: { ja: "入力で当てるシルエット", en: "Type the silhouette answer" },
    description: {
      ja: "名前をキーボード入力で当てます。ひらがな・カタカナのどちらでもOKです。",
      en: "Type the Pokemon's name. Official English names are accepted in English mode.",
    },
  },
  type: {
    label: { ja: "タイプクイズ", en: "Type Quiz" },
    shortLabel: { ja: "タイプ", en: "Type" },
    deckLabel: { ja: "タイプを2つまで選ぶ", en: "Pick up to two types" },
    description: {
      ja: "全18タイプから選択します。単タイプでも2つ選べる状態で挑戦できます。",
      en: "Choose from all 18 types. You can still pick up to two for single-type Pokemon.",
    },
  },
  weight: {
    label: { ja: "どっちが重い？", en: "Who's Heavier?" },
    shortLabel: { ja: "重さ", en: "Weight" },
    deckLabel: { ja: "重さを見比べる", en: "Compare by weight" },
    description: {
      ja: "2匹を見比べて、より重いポケモンを選びます。",
      en: "Compare two Pokemon and pick the heavier one.",
    },
  },
  height: {
    label: { ja: "どっちが高い？", en: "Who's Taller?" },
    shortLabel: { ja: "高さ", en: "Height" },
    deckLabel: { ja: "高さを見比べる", en: "Compare by height" },
    description: {
      ja: "2匹を見比べて、より背が高いポケモンを選びます。",
      en: "Compare two Pokemon and pick the taller one.",
    },
  },
  shiritori: {
    label: { ja: "しりとり真ん中あて", en: "Name Chain" },
    shortLabel: { ja: "しりとり", en: "Chain" },
    deckLabel: { ja: "真ん中を入力する", en: "Fill in the middle name" },
    description: {
      ja: "前後のポケモン名から、真ん中に入る名前をキーボード入力で当てます。",
      en: "Use the names before and after to type the Pokemon that fits in the middle.",
    },
  },
};

const UI_COPY = {
  ja: {
    title: "ポケモンQ",
    heroKicker: "Day 01 / PokeAPI Quiz Game",
    heroText:
      "全ポケモンを収録したスマホ向けクイズゲームです。名前入力、タイプ選択、重さ・高さくらべ、しりとりクイズを、日本語と英語の切り替えやイラスト・ドット絵の表示切り替えつきで遊べます。",
    heroModeChip: "5モード",
    heroStyleChip: "入力 + 選択式",
    allPokemonLabel: "全ポケモン収録",
    languageToggle: "English",
    soundOn: "サウンド ON",
    soundOff: "サウンド OFF",
    visualArt: "イラスト",
    visualPixel: "ドット",
    countSuffix: "匹収録",
    statusMode: "モード",
    statusRound: "ラウンド",
    statusScore: "スコア",
    statusBest: "ベスト",
    loadingEyebrow: "読み込み中",
    loadingTitle: "ポケモン図鑑を準備しています",
    loadingText: "PokeAPI 由来の全ポケモンデータを読み込んで、すぐ遊べる状態にしています。",
    restart: "このモードをやり直す",
    restartDone: "このモードでもう一度",
    next: "次の問題へ",
    results: "結果を見る",
    submit: "こたえる",
    judge: "判定する",
    shareHeading: "Share",
    shareX: "Xでシェア",
    shareCopy: "URLをコピー",
    back: "一覧ページへ戻る",
    ready: "準備中",
    readyTitlePrefix: "Ready",
    summaryScore: "スコア",
    summaryBest: "自己ベスト",
    summaryStreak: "ベスト連続",
    summaryPlays: "プレイ回数",
    summaryVisual: "表示モード",
    visualModeArt: "イラスト",
    visualModePixel: "ドット",
    selectionCount: "選択中",
    singleTypeHint: "単タイプのポケモンは 1 つだけ選べば正解です。",
    answerInput: "あなたの入力",
    answerChoice: "あなたの選択",
    noInput: "未入力",
    dexMemo: "ずかんメモ",
    correct: "正解",
    notQuite: "ざんねん",
    sessionComplete: "結果",
    retry: "再読み込み",
    newBestTitle: "ベストスコア更新です",
    roundLabel: "第{round}問",
    loadErrorEyebrow: "読み込みエラー",
    loadErrorTitle: "クイズデータを読み込めませんでした",
    reloadHint: "通信が安定した状態で再度開くと、クイズを開始できます。",
    shareText:
      "ポケモンQでクイズに挑戦！みんなも遊んでみよう！\n#ポケモンQ #PokemonQ #PokeAPI",
  },
  en: {
    title: "PokemonQ",
    heroKicker: "Day 01 / PokeAPI Quiz Game",
    heroText:
      "PokemonQ is a mobile-first quiz game built with the full PokeAPI Pokedex. Switch between Japanese and English, type official Pokemon names, pick official types, compare size stats, and swap between artwork and pixel sprites.",
    heroModeChip: "5 modes",
    heroStyleChip: "Typing + tapping",
    allPokemonLabel: "Full Pokedex",
    languageToggle: "日本語",
    soundOn: "Sound ON",
    soundOff: "Sound OFF",
    visualArt: "Artwork",
    visualPixel: "Pixel",
    countSuffix: "Pokemon",
    statusMode: "Mode",
    statusRound: "Round",
    statusScore: "Score",
    statusBest: "Best",
    loadingEyebrow: "Loading",
    loadingTitle: "Preparing the Pokedex",
    loadingText: "Loading full Pokemon data from PokeAPI so the quiz is ready to play.",
    restart: "Restart This Mode",
    restartDone: "Play This Mode Again",
    next: "Next Question",
    results: "See Results",
    submit: "Submit",
    judge: "Check",
    shareHeading: "Share",
    shareX: "Share on X",
    shareCopy: "Copy URL",
    back: "Back to Index",
    ready: "Ready",
    readyTitlePrefix: "Ready",
    summaryScore: "Score",
    summaryBest: "Best Score",
    summaryStreak: "Best Streak",
    summaryPlays: "Plays",
    summaryVisual: "Visual Mode",
    visualModeArt: "Artwork",
    visualModePixel: "Pixel",
    selectionCount: "Selected",
    singleTypeHint: "Single-type Pokemon are correct with just one selected type.",
    answerInput: "Your answer",
    answerChoice: "Your choice",
    noInput: "No input",
    dexMemo: "Pokedex note",
    correct: "Correct",
    notQuite: "Not Quite",
    sessionComplete: "Session Complete",
    retry: "Retry",
    newBestTitle: "New personal best!",
    roundLabel: "Round {round}",
    loadErrorEyebrow: "Load Error",
    loadErrorTitle: "Couldn't load the quiz data",
    reloadHint: "Reload the page once your connection is stable to start playing.",
    shareText:
      "I'm playing PokemonQ. Come give it a try!\n#PokemonQ #PokeAPI",
  },
};

const dom = {
  heroCountChip: document.querySelector("#hero-count-chip"),
  heroKicker: document.querySelector("#hero-kicker"),
  appTitle: document.querySelector("#app-title"),
  heroText: document.querySelector("#hero-text"),
  heroModeChip: document.querySelector("#hero-mode-chip"),
  heroStyleChip: document.querySelector("#hero-style-chip"),
  languageToggle: document.querySelector("#language-toggle"),
  soundToggle: document.querySelector("#sound-toggle"),
  visualToggle: document.querySelector("#visual-toggle"),
  modeStrip: document.querySelector("#mode-strip"),
  questionStage: document.querySelector("#question-stage"),
  interactionPanel: document.querySelector("#interaction-panel"),
  feedbackPanel: document.querySelector("#feedback-panel"),
  restartButton: document.querySelector("#restart-button"),
  nextButton: document.querySelector("#next-button"),
  statusLabelMode: document.querySelector("#status-label-mode"),
  statusLabelRound: document.querySelector("#status-label-round"),
  statusLabelScore: document.querySelector("#status-label-score"),
  statusLabelBest: document.querySelector("#status-label-best"),
  statusMode: document.querySelector("#status-mode"),
  statusRound: document.querySelector("#status-round"),
  statusScore: document.querySelector("#status-score"),
  statusBest: document.querySelector("#status-best"),
  shareHeading: document.querySelector("#share-heading"),
  shareX: document.querySelector("#share-x"),
  shareCopy: document.querySelector("#share-copy"),
  backLink: document.querySelector("#back-link"),
};

const state = {
  data: [],
  index: null,
  mode: "silhouette",
  locale: loadLocalePreference(),
  visualMode: loadVisualPreference(),
  currentQuestion: null,
  selectedTypes: [],
  selectedCompare: null,
  textDraft: "",
  lastSubmission: null,
  answered: false,
  awaitingSummary: false,
  summary: null,
  loading: true,
  soundEnabled: loadSoundPreference(),
  records: loadRecords(),
  audio: null,
};

function createSession() {
  return {
    round: 1,
    correct: 0,
    streak: 0,
    bestStreak: 0,
    total: QUIZ_LENGTH,
    usedIds: [],
  };
}

state.session = createSession();

function copyForLocale() {
  return UI_COPY[state.locale];
}

function modeText(mode, key) {
  return MODE_CONFIG[mode][key][state.locale];
}

function getLocalizedName(pokemon) {
  return pokemon.displayName[state.locale];
}

function getLocalizedCategory(pokemon) {
  return pokemon.displayCategory[state.locale];
}

function getLocalizedFlavor(pokemon) {
  return pokemon.displayFlavor[state.locale];
}

function getLocalizedPrimaryType(pokemon) {
  return pokemon.primaryTypeLocalized[state.locale];
}

function getLocalizedTypeLabel(type) {
  return state.locale === "en" ? type.labelEn : type.label;
}

function applyStaticCopy() {
  const copy = copyForLocale();

  document.title = copy.title;
  document.documentElement.lang = state.locale;
  dom.heroKicker.textContent = copy.heroKicker;
  dom.appTitle.textContent = copy.title;
  dom.heroText.textContent = copy.heroText;
  dom.heroModeChip.textContent = copy.heroModeChip;
  dom.heroStyleChip.textContent = copy.heroStyleChip;
  dom.heroCountChip.textContent = state.data.length
    ? state.locale === "en"
      ? `${state.data.length} ${copy.countSuffix}`
      : `${state.data.length}${copy.countSuffix}`
    : copy.allPokemonLabel;
  dom.languageToggle.textContent = copy.languageToggle;
  dom.languageToggle.setAttribute("aria-label", copy.languageToggle);
  dom.modeStrip.setAttribute("aria-label", state.locale === "en" ? "Quiz modes" : "クイズモード");
  dom.visualToggle.setAttribute("aria-label", state.locale === "en" ? "Visual style" : "表示スタイル");
  dom.statusLabelMode.textContent = copy.statusMode;
  dom.statusLabelRound.textContent = copy.statusRound;
  dom.statusLabelScore.textContent = copy.statusScore;
  dom.statusLabelBest.textContent = copy.statusBest;
  dom.shareHeading.textContent = copy.shareHeading;
  dom.shareX.textContent = copy.shareX;
  dom.shareCopy.textContent = copy.shareCopy;
  dom.backLink.textContent = copy.back;
  dom.restartButton.textContent = state.summary ? copy.restartDone : copy.restart;
  dom.nextButton.textContent = state.awaitingSummary ? copy.results : copy.next;

  for (const button of dom.visualToggle.querySelectorAll("[data-visual-mode]")) {
    button.textContent =
      button.dataset.visualMode === "pixel" ? copy.visualPixel : copy.visualArt;
  }

  if (state.loading && !state.currentQuestion) {
    dom.questionStage.innerHTML = `
      <section class="loading-card">
        <div class="loading-orb" aria-hidden="true"></div>
        <p class="eyebrow">${escapeHtml(copy.loadingEyebrow)}</p>
        <h2>${escapeHtml(copy.loadingTitle)}</h2>
        <p>${escapeHtml(copy.loadingText)}</p>
      </section>
    `;
    dom.feedbackPanel.innerHTML = `
      <p class="feedback-kicker">${escapeHtml(copy.ready)}</p>
      <h2 class="feedback-title">${escapeHtml(copy.loadingTitle)}</h2>
      <p class="feedback-text">${escapeHtml(copy.loadingText)}</p>
    `;
  }
}

document.body.dataset.mode = state.mode;
document.body.dataset.visual = state.visualMode;
document.documentElement.lang = state.locale;
applyStaticCopy();
renderModeButtons();
syncSoundButton();
syncVisualButtons();
bindEvents();
bootstrap().catch((error) => {
  console.error(error);
  renderLoadError(error);
});

async function bootstrap() {
  state.audio = new Audio();
  state.audio.preload = "none";

  const response = await fetch(DATA_URL);

  if (!response.ok) {
    throw new Error(
      state.locale === "en"
        ? `Failed to load quiz data: ${response.status}`
        : `データの読み込みに失敗しました: ${response.status}`,
    );
  }

  const payload = await response.json();

  state.data = payload.pokemon.map(enrichPokemon);
  state.index = buildIndex(state.data);
  state.loading = false;
  applyStaticCopy();

  startMode(state.mode);
}

function enrichPokemon(pokemon) {
  const sprite = pokemon.sprite || buildFallbackSpriteUrl(pokemon.id);
  const answerKeysJa = [...buildJapaneseAnswerKeys(pokemon.name)];
  const answerKeysEn = [...buildEnglishAnswerKeys(pokemon.nameEn, pokemon.slug)];
  const simpleKanaName = isSimpleKanaName(pokemon.name);
  const chainJa = {
    first: pokemon.shiritori?.first ?? "",
    last: pokemon.shiritori?.last ?? "",
    eligibleBefore: simpleKanaName && pokemon.shiritori?.last !== "ン",
    eligibleMiddle: simpleKanaName && pokemon.shiritori?.last !== "ン",
    eligibleAfter: simpleKanaName,
  };
  const chainEn = buildEnglishChain(pokemon.nameEn);

  return {
    ...pokemon,
    sprite,
    answerKeysJa,
    answerKeysEn,
    hiraganaName: toHiragana(pokemon.name),
    displayName: {
      ja: pokemon.name,
      en: pokemon.nameEn,
    },
    displayCategory: {
      ja: pokemon.category,
      en: pokemon.categoryEn,
    },
    displayFlavor: {
      ja: pokemon.flavorText,
      en: pokemon.flavorTextEn,
    },
    primaryTypeLocalized: {
      ja: pokemon.primaryType,
      en: pokemon.primaryTypeEn,
    },
    chainJa,
    chainEn,
  };
}

function buildIndex(pokemon) {
  const typeMap = new Map();
  const beforeByLast = { ja: new Map(), en: new Map() };
  const afterByFirst = { ja: new Map(), en: new Map() };
  const beforePool = { ja: [], en: [] };
  const middlePool = { ja: [], en: [] };
  const afterPool = { ja: [], en: [] };

  for (const entry of pokemon) {
    for (const type of entry.types) {
      if (!typeMap.has(type.key)) {
        typeMap.set(type.key, type);
      }
    }

    if (entry.chainJa.eligibleBefore) {
      beforePool.ja.push(entry);
      pushToIndex(beforeByLast.ja, entry.chainJa.last, entry);
    }

    if (entry.chainJa.eligibleMiddle) {
      middlePool.ja.push(entry);
    }

    if (entry.chainJa.eligibleAfter) {
      afterPool.ja.push(entry);
      pushToIndex(afterByFirst.ja, entry.chainJa.first, entry);
    }

    if (entry.chainEn.eligibleBefore) {
      beforePool.en.push(entry);
      pushToIndex(beforeByLast.en, entry.chainEn.last, entry);
    }

    if (entry.chainEn.eligibleMiddle) {
      middlePool.en.push(entry);
    }

    if (entry.chainEn.eligibleAfter) {
      afterPool.en.push(entry);
      pushToIndex(afterByFirst.en, entry.chainEn.first, entry);
    }
  }

  const allTypes = TYPE_ORDER.map((key) => typeMap.get(key)).filter(Boolean);
  return { allTypes, beforePool, middlePool, afterPool, beforeByLast, afterByFirst };
}

function pushToIndex(map, key, value) {
  if (!map.has(key)) {
    map.set(key, []);
  }

  map.get(key).push(value);
}

function bindEvents() {
  dom.languageToggle.addEventListener("click", toggleLocale);
  dom.soundToggle.addEventListener("click", toggleSound);
  dom.restartButton.addEventListener("click", () => {
    if (state.loading) {
      return;
    }

    startMode(state.mode);
  });

  dom.nextButton.addEventListener("click", () => {
    if (state.awaitingSummary) {
      finalizeSession();
      return;
    }

    if (!state.answered) {
      return;
    }

    state.session.round += 1;
    state.currentQuestion = loadQuestion(state.mode);
    resetInteractionState();
    render();
  });

  dom.visualToggle.addEventListener("click", (event) => {
    const button = event.target.closest("[data-visual-mode]");

    if (!button) {
      return;
    }

    const { visualMode } = button.dataset;

    if (!visualMode || visualMode === state.visualMode) {
      return;
    }

    setVisualMode(visualMode);
  });

  dom.shareX.addEventListener("click", shareToX);
  dom.shareCopy.addEventListener("click", copyShareLink);
}

function renderModeButtons() {
  dom.modeStrip.innerHTML = Object.entries(MODE_CONFIG)
    .map(([modeKey, config]) => {
      const isActive = state.mode === modeKey;

      return `
        <button
          class="mode-button${isActive ? " is-active" : ""}"
          type="button"
          data-mode="${modeKey}"
          aria-pressed="${String(isActive)}"
        >
          <strong>${escapeHtml(config.label[state.locale])}</strong>
          <span>${escapeHtml(config.description[state.locale])}</span>
        </button>
      `;
    })
    .join("");

  for (const button of dom.modeStrip.querySelectorAll("[data-mode]")) {
    button.addEventListener("click", () => {
      const { mode } = button.dataset;

      if (!mode || mode === state.mode || state.loading) {
        return;
      }

      startMode(mode);
    });
  }
}

function startMode(mode) {
  state.mode = mode;
  document.body.dataset.mode = mode;
  state.session = createSession();
  state.summary = null;
  state.awaitingSummary = false;
  state.currentQuestion = loadQuestion(mode);
  resetInteractionState();
  render();
}

function loadQuestion(mode) {
  const question = generateQuestion(mode);

  for (const id of question.usedIds) {
    if (!state.session.usedIds.includes(id)) {
      state.session.usedIds.push(id);
    }
  }

  return question;
}

function generateQuestion(mode) {
  switch (mode) {
    case "silhouette":
      return buildSilhouetteQuestion();
    case "type":
      return buildTypeQuestion();
    case "weight":
      return buildCompareQuestion("weightKg");
    case "height":
      return buildCompareQuestion("heightM");
    case "shiritori":
      return buildShiritoriQuestion();
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}

function buildSilhouetteQuestion() {
  const pokemon = pickFreshOne(state.data);
  const isEnglish = state.locale === "en";

  return {
    mode: "silhouette",
    inputKind: "text",
    prompt: isEnglish ? "Who's that Pokemon?" : "このシルエットのポケモンは？",
    helper: isEnglish
      ? "Type the official English Pokemon name."
      : "ひらがな・カタカナどちらでもOK。記号つきの名前も対応します。",
    inputPlaceholder: isEnglish ? "Type the Pokemon's name" : "ポケモンの名前を入力",
    pokemon,
    usedIds: [pokemon.id],
    acceptedAnswerKeys: isEnglish ? pokemon.answerKeysEn : pokemon.answerKeysJa,
    correctPokemon: pokemon,
    revealTitle: isEnglish
      ? `${getLocalizedName(pokemon)} is correct`
      : `${getLocalizedName(pokemon)}が正解です`,
    revealText: isEnglish
      ? `${getLocalizedCategory(pokemon)}. ${pokemon.types.length > 1 ? "Its types are" : "Its type is"} ${joinTypeLabels(pokemon.types)}.`
      : `${getLocalizedCategory(pokemon)}。タイプは ${joinTypeLabels(pokemon.types)} です。`,
    factText: getLocalizedFlavor(pokemon),
    typePills: pokemon.types.map((type) => getLocalizedTypeLabel(type)),
    statBadges: [`No.${pokemon.dex}`, `${pokemon.heightM}m`, `${pokemon.weightKg}kg`],
  };
}

function buildTypeQuestion() {
  const pokemon = pickFreshOne(state.data);
  const isEnglish = state.locale === "en";

  return {
    mode: "type",
    inputKind: "type",
    prompt: isEnglish
      ? "Pick this Pokemon's type"
      : "このポケモンのタイプを選んでください",
    helper: isEnglish
      ? "Choose up to two types from all 18 official Pokemon types."
      : "全18タイプから 1〜2 個まで選べます。単タイプなら 1 つだけで正解です。",
    pokemon,
    usedIds: [pokemon.id],
    correctTypeKeys: pokemon.types.map((type) => type.key),
    correctPokemon: pokemon,
    revealTitle: isEnglish
      ? `${getLocalizedName(pokemon)} is ${joinTypeLabels(pokemon.types)}`
      : `${getLocalizedName(pokemon)}のタイプは ${joinTypeLabels(pokemon.types)}`,
    revealText: isEnglish
      ? `${getLocalizedCategory(pokemon)}. You need every correct type to clear the question.`
      : `${getLocalizedCategory(pokemon)}。持っているタイプをすべて当てると正解です。`,
    factText: getLocalizedFlavor(pokemon),
    typePills: pokemon.types.map((type) => getLocalizedTypeLabel(type)),
    statBadges: [`No.${pokemon.dex}`, `${pokemon.heightM}m`, `${pokemon.weightKg}kg`],
  };
}

function buildCompareQuestion(metric) {
  const isEnglish = state.locale === "en";
  const prompt = metric === "weightKg"
    ? isEnglish ? "Who's heavier?" : "どっちが重い？"
    : isEnglish ? "Who's taller?" : "どっちが背が高い？";
  const helper =
    metric === "weightKg"
      ? isEnglish
        ? "Compare the two Pokemon and pick the heavier one."
        : "左右のポケモンを見比べて、より重い方を選びましょう。"
      : isEnglish
        ? "Compare the two Pokemon and pick the taller one."
        : "左右のポケモンを見比べて、より背が高い方を選びましょう。";
  const metricLabel = metric === "weightKg"
    ? isEnglish ? "Weight" : "重さ"
    : isEnglish ? "Height" : "高さ";

  let left = null;
  let right = null;
  let settled = false;

  for (let attempt = 0; attempt < 250; attempt += 1) {
    [left, right] = pickFreshMany(state.data, 2);

    if (left.id === right.id) {
      continue;
    }

    const larger = Math.max(left[metric], right[metric]);
    const smaller = Math.min(left[metric], right[metric]);
    const gap = larger - smaller;
    const ratio = larger / smaller;
    const valid =
      metric === "weightKg" ? gap >= 8 && ratio >= 1.15 : gap >= 0.3 && ratio >= 1.12;

    if (valid) {
      settled = true;
      break;
    }
  }

  if (!settled) {
    [left, right] = pickFreshMany(state.data, 2);
  }

  const correctAnswerId = left[metric] > right[metric] ? "left" : "right";
  const winner = correctAnswerId === "left" ? left : right;

  return {
    mode: metric === "weightKg" ? "weight" : "height",
    inputKind: "compare",
    prompt,
    helper,
    metric,
    metricLabel,
    left,
    right,
    usedIds: [left.id, right.id],
    correctAnswerId,
    correctPokemon: winner,
    revealTitle: isEnglish
      ? `${getLocalizedName(winner)} is ${metric === "weightKg" ? "heavier" : "taller"}`
      : `${getLocalizedName(winner)}の方が${metric === "weightKg" ? "重い" : "高い"}です`,
    revealText: isEnglish
      ? `${getLocalizedName(left)} is ${formatMetric(left[metric], metric)} and ${getLocalizedName(right)} is ${formatMetric(right[metric], metric)}.`
      : `${getLocalizedName(left)}は ${formatMetric(left[metric], metric)}、${getLocalizedName(right)}は ${formatMetric(right[metric], metric)}。`,
    factText: isEnglish
      ? `${winner.types.length > 1 ? "Its types are" : "Its type is"} ${joinTypeLabels(winner.types)}.`
      : `${getLocalizedName(winner)}のタイプは ${joinTypeLabels(winner.types)} です。`,
    typePills: winner.types.map((type) => getLocalizedTypeLabel(type)),
    statBadges: [
      `${getLocalizedName(left)} ${formatMetric(left[metric], metric)}`,
      `${getLocalizedName(right)} ${formatMetric(right[metric], metric)}`,
    ],
  };
}

function buildShiritoriQuestion() {
  const locale = state.locale;
  const chainKey = locale === "en" ? "chainEn" : "chainJa";
  const usedIds = new Set(state.session.usedIds);

  for (let attempt = 0; attempt < 500; attempt += 1) {
    const correct = pickFreshOne(state.index.middlePool[locale]);
    const beforeCandidates = filterFreshCandidates(
      state.index.beforeByLast[locale].get(correct[chainKey].first) ?? [],
      new Set([correct.id]),
      usedIds,
    );
    const before = sampleOne(beforeCandidates);

    if (!before) {
      continue;
    }

    const afterCandidates = filterFreshCandidates(
      state.index.afterByFirst[locale].get(correct[chainKey].last) ?? [],
      new Set([correct.id, before.id]),
      usedIds,
    );
    const after = sampleOne(afterCandidates);

    if (!after) {
      continue;
    }

    return {
      mode: "shiritori",
      inputKind: "text",
      prompt:
        locale === "en"
          ? "Which Pokemon fits in the middle?"
          : "しりとりの真ん中に入るポケモンは？",
      helper:
        locale === "en"
          ? "Type the Pokemon whose English name starts with the previous ending and ends with the next starting letter."
          : "前の終わりの音で始まり、次の始まりの音で終わるポケモン名を入力してください。",
      inputPlaceholder:
        locale === "en" ? "Type the middle Pokemon name" : "真ん中のポケモン名を入力",
      before,
      after,
      usedIds: [before.id, correct.id, after.id],
      acceptedAnswerKeys: locale === "en" ? correct.answerKeysEn : correct.answerKeysJa,
      correctPokemon: correct,
      revealTitle: `${getLocalizedName(before)} → ${getLocalizedName(correct)} → ${getLocalizedName(after)}`,
      revealText:
        locale === "en"
          ? `The answer is ${getLocalizedName(correct)}: it starts with "${before[chainKey].last}" and ends with "${after[chainKey].first}".`
          : `「${before[chainKey].last}」で始まり「${after[chainKey].first}」で終わるのは ${getLocalizedName(correct)} です。`,
      factText: getLocalizedFlavor(correct),
      typePills: correct.types.map((type) => getLocalizedTypeLabel(type)),
      statBadges:
        locale === "en"
          ? [`Starts ${correct[chainKey].first}`, `Ends ${correct[chainKey].last}`]
          : [`先頭 ${correct[chainKey].first}`, `末尾 ${correct[chainKey].last}`],
    };
  }

  throw new Error(
    state.locale === "en"
      ? "Couldn't build a valid chain question."
      : "しりとりクイズの問題を生成できませんでした。",
  );
}

function filterFreshCandidates(pool, excludeIds, usedIds) {
  const filtered = pool.filter(
    (entry) => !excludeIds.has(entry.id) && !usedIds.has(entry.id),
  );

  if (filtered.length) {
    return filtered;
  }

  return pool.filter((entry) => !excludeIds.has(entry.id));
}

function pickFreshOne(pool) {
  const usedIds = new Set(state.session.usedIds);
  const fresh = pool.filter((entry) => !usedIds.has(entry.id));
  return sampleOne(fresh.length ? fresh : pool);
}

function pickFreshMany(pool, count) {
  const usedIds = new Set(state.session.usedIds);
  const fresh = pool.filter((entry) => !usedIds.has(entry.id));
  const source = fresh.length >= count ? fresh : pool;
  return sampleMany(source, count);
}

function resetInteractionState() {
  state.textDraft = "";
  state.selectedTypes = [];
  state.selectedCompare = null;
  state.lastSubmission = null;
  state.answered = false;
}

function render() {
  renderStatus();
  renderModeButtons();
  syncSoundButton();
  syncVisualButtons();
  applyStaticCopy();
  renderQuestionStage();
  renderInteractionPanel();
  renderFeedback();
  renderControls();
}

function renderStatus() {
  const record = state.records[state.mode] ?? defaultRecord();
  const copy = copyForLocale();

  dom.statusMode.textContent = modeText(state.mode, "shortLabel");
  dom.statusRound.textContent = state.summary
    ? `${state.session.total} / ${state.session.total}`
    : `${state.session.round} / ${state.session.total}`;
  dom.statusScore.textContent = `${state.session.correct}`;
  dom.statusBest.textContent = `${record.best}`;
  dom.statusLabelMode.textContent = copy.statusMode;
  dom.statusLabelRound.textContent = copy.statusRound;
  dom.statusLabelScore.textContent = copy.statusScore;
  dom.statusLabelBest.textContent = copy.statusBest;
}

function renderQuestionStage() {
  if (state.summary) {
    const copy = copyForLocale();
    dom.questionStage.innerHTML = `
      <section class="summary-card">
        <p class="eyebrow">${escapeHtml(modeText(state.mode, "label"))}</p>
        <div class="summary-score">
          <div>
            <small>${escapeHtml(copy.summaryScore)}</small>
            ${state.summary.score}
          </div>
        </div>
        <h2>${escapeHtml(state.summary.title)}</h2>
        <p>${escapeHtml(state.summary.description)}</p>
        <div class="summary-grid">
          <article class="status-pill">
            <span>${escapeHtml(copy.summaryBest)}</span>
            <strong>${state.summary.best}</strong>
          </article>
          <article class="status-pill">
            <span>${escapeHtml(copy.summaryStreak)}</span>
            <strong>${state.summary.bestStreak}</strong>
          </article>
          <article class="status-pill">
            <span>${escapeHtml(copy.summaryPlays)}</span>
            <strong>${state.summary.plays}</strong>
          </article>
          <article class="status-pill">
            <span>${escapeHtml(copy.summaryVisual)}</span>
            <strong>${state.visualMode === "pixel" ? copy.visualModePixel : copy.visualModeArt}</strong>
          </article>
        </div>
      </section>
    `;
    return;
  }

  const question = state.currentQuestion;

  switch (question.mode) {
    case "silhouette":
      dom.questionStage.innerHTML = `
        <section class="question-shell">
          <div class="question-head">
            <p class="eyebrow">${escapeHtml(getRoundLabel())}</p>
            <h2 class="question-prompt">${escapeHtml(question.prompt)}</h2>
            <p class="question-helper">${escapeHtml(question.helper)}</p>
          </div>
          <div class="visual-frame ${state.answered ? "is-revealed" : "is-silhouette"}">
            <img src="${escapeAttribute(getPokemonVisual(question.pokemon))}" alt="" loading="eager" decoding="async" />
          </div>
          <div class="badge-row">
            <span class="info-badge">No.${question.pokemon.dex}</span>
            <span class="info-badge">${escapeHtml(getLocalizedCategory(question.pokemon))}</span>
          </div>
        </section>
      `;
      break;
    case "type":
      dom.questionStage.innerHTML = `
        <section class="question-shell">
          <div class="question-head">
            <p class="eyebrow">${escapeHtml(getRoundLabel())}</p>
            <h2 class="question-prompt">${escapeHtml(question.prompt)}</h2>
            <p class="question-helper">${escapeHtml(question.helper)}</p>
          </div>
          <div class="visual-frame ${state.answered ? "is-revealed" : ""}">
            <img src="${escapeAttribute(getPokemonVisual(question.pokemon))}" alt="" loading="eager" decoding="async" />
          </div>
          <div class="badge-row">
            <span class="info-badge">No.${question.pokemon.dex}</span>
            <span class="info-badge">${escapeHtml(state.locale === "en" ? "Choose from all 18 types" : "全18タイプから選択")}</span>
          </div>
        </section>
      `;
      break;
    case "weight":
    case "height":
      dom.questionStage.innerHTML = `
        <section class="question-shell">
          <div class="question-head">
            <p class="eyebrow">${escapeHtml(getRoundLabel())}</p>
            <h2 class="question-prompt">${escapeHtml(question.prompt)}</h2>
            <p class="question-helper">${escapeHtml(question.helper)}</p>
          </div>
          <div class="compare-board">
            <div class="compare-meter">
              <strong>${escapeHtml(state.locale === "en" ? `${question.metricLabel} challenge` : `${question.metricLabel}で勝負`)}</strong>
              <span>${escapeHtml(state.locale === "en" ? "Tap a card to answer." : "カードをタップして答えます。")}</span>
            </div>
          </div>
        </section>
      `;
      break;
    case "shiritori":
      dom.questionStage.innerHTML = `
        <section class="question-shell">
          <div class="question-head">
            <p class="eyebrow">${escapeHtml(getRoundLabel())}</p>
            <h2 class="question-prompt">${escapeHtml(question.prompt)}</h2>
            <p class="question-helper">${escapeHtml(question.helper)}</p>
          </div>
          <div class="chain-board">
            <div class="chain-row">
              <span class="chain-name">${escapeHtml(getLocalizedName(question.before))}</span>
              <span class="chain-gap">？？？</span>
              <span class="chain-name">${escapeHtml(getLocalizedName(question.after))}</span>
            </div>
            <div class="chain-row">
              <span class="chain-chip">${escapeHtml(state.locale === "en" ? `Previous end: ${question.before[state.locale === "en" ? "chainEn" : "chainJa"].last}` : `前の終わり: ${question.before.chainJa.last}`)}</span>
              <span class="chain-chip">${escapeHtml(state.locale === "en" ? `Next start: ${question.after[state.locale === "en" ? "chainEn" : "chainJa"].first}` : `次の始まり: ${question.after.chainJa.first}`)}</span>
            </div>
          </div>
        </section>
      `;
      break;
    default:
      dom.questionStage.innerHTML = "";
  }
}

function renderInteractionPanel() {
  if (state.summary) {
    dom.interactionPanel.innerHTML = "";
    return;
  }

  switch (state.currentQuestion.inputKind) {
    case "text":
      renderTextInteraction(state.currentQuestion);
      break;
    case "type":
      renderTypeInteraction(state.currentQuestion);
      break;
    case "compare":
      renderCompareInteraction(state.currentQuestion);
      break;
    default:
      dom.interactionPanel.innerHTML = "";
  }
}

function renderTextInteraction(question) {
  const copy = copyForLocale();
  dom.interactionPanel.innerHTML = `
    <form class="text-form" id="text-form">
      <div class="text-submit-row">
        <input
          id="answer-input"
          class="quiz-input"
          type="text"
          autocomplete="off"
          spellcheck="false"
          inputmode="text"
          placeholder="${escapeAttribute(question.inputPlaceholder)}"
          value="${escapeAttribute(state.textDraft)}"
          ${state.answered ? "disabled" : ""}
        />
        <button class="submit-button" type="submit" ${state.answered ? "disabled" : ""}>
          ${escapeHtml(copy.submit)}
        </button>
      </div>
      <p class="input-note">${escapeHtml(question.helper)}</p>
    </form>
  `;

  const form = dom.interactionPanel.querySelector("#text-form");
  const input = dom.interactionPanel.querySelector("#answer-input");

  input?.addEventListener("input", (event) => {
    state.textDraft = event.target.value;
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (state.answered) {
      return;
    }

    submitTextAnswer(state.textDraft);
  });
}

function renderTypeInteraction(question) {
  const copy = copyForLocale();
  const selectedCount = state.selectedTypes.length;
  const typeButtons = state.index.allTypes
    .map((type) => {
      const isSelected = state.selectedTypes.includes(type.key);
      const isCorrect = question.correctTypeKeys.includes(type.key);
      let stateClass = isSelected ? " is-selected" : "";

      if (state.answered && isCorrect) {
        stateClass += " is-correct";
      } else if (state.answered && isSelected && !isCorrect) {
        stateClass += " is-wrong";
      }

      return `
        <button
          class="type-button${stateClass}"
          type="button"
          data-type-key="${type.key}"
          data-type="${type.key}"
          ${state.answered ? "disabled" : ""}
        >
          ${escapeHtml(getLocalizedTypeLabel(type))}
        </button>
      `;
    })
    .join("");

  dom.interactionPanel.innerHTML = `
    <section class="type-panel">
      <div class="picker-summary">
        <strong>${escapeHtml(state.locale === "en" ? "Pick up to two types" : "タイプを 2 つまで選択")}</strong>
        <p class="picker-count">${escapeHtml(copy.selectionCount)}: ${selectedCount} / 2</p>
      </div>
      <div class="type-picker-grid">${typeButtons}</div>
      <div class="type-picker-footer">
        <p class="input-note">${escapeHtml(copy.singleTypeHint)}</p>
        <button
          class="submit-button"
          id="type-submit"
          type="button"
          ${state.answered || selectedCount === 0 ? "disabled" : ""}
        >
          ${escapeHtml(copy.judge)}
        </button>
      </div>
    </section>
  `;

  for (const button of dom.interactionPanel.querySelectorAll("[data-type-key]")) {
    button.addEventListener("click", () => {
      toggleTypeSelection(button.dataset.typeKey);
    });
  }

  dom.interactionPanel.querySelector("#type-submit")?.addEventListener("click", () => {
    submitTypeAnswer();
  });
}

function renderCompareInteraction(question) {
  const locale = state.locale;
  const choices = [
    { id: "left", pokemon: question.left, detail: getLocalizedPrimaryType(question.left) },
    { id: "right", pokemon: question.right, detail: getLocalizedPrimaryType(question.right) },
  ];

  dom.interactionPanel.innerHTML = `
    <div class="compare-grid">
      ${choices
        .map((choice) => {
          const isCorrect = choice.id === question.correctAnswerId;
          const isSelected = state.selectedCompare === choice.id;
          let stateClass = "";

          if (state.answered && isCorrect) {
            stateClass = " is-correct";
          } else if (state.answered && isSelected && !isCorrect) {
            stateClass = " is-wrong";
          }

          return `
            <button
              class="compare-choice${stateClass}"
              type="button"
              data-compare-answer="${choice.id}"
              ${state.answered ? "disabled" : ""}
            >
              <span class="compare-card-visual">
                <img src="${escapeAttribute(getPokemonVisual(choice.pokemon))}" alt="" loading="lazy" decoding="async" />
              </span>
              <strong>${escapeHtml(getLocalizedName(choice.pokemon))}</strong>
              <span>${escapeHtml(choice.detail)}</span>
            </button>
          `;
        })
        .join("")}
    </div>
  `;

  for (const button of dom.interactionPanel.querySelectorAll("[data-compare-answer]")) {
    button.addEventListener("click", () => {
      submitCompareAnswer(button.dataset.compareAnswer);
    });
  }
}

function toggleTypeSelection(typeKey) {
  if (!typeKey || state.answered) {
    return;
  }

  if (state.selectedTypes.includes(typeKey)) {
    state.selectedTypes = state.selectedTypes.filter((entry) => entry !== typeKey);
    renderInteractionPanel();
    return;
  }

  if (state.selectedTypes.length >= 2) {
    return;
  }

  state.selectedTypes = [...state.selectedTypes, typeKey];
  renderInteractionPanel();
}

function submitTextAnswer(value) {
  const normalized =
    state.locale === "en" ? normalizeEnglishInput(value) : normalizeJapaneseInput(value);

  if (!normalized) {
    return;
  }

  const isCorrect = state.currentQuestion.acceptedAnswerKeys.includes(normalized);
  lockAnswer(isCorrect, { kind: "text", value });
}

function submitTypeAnswer() {
  if (!state.selectedTypes.length) {
    return;
  }

  const selected = [...state.selectedTypes].sort();
  const correct = [...state.currentQuestion.correctTypeKeys].sort();
  const isCorrect =
    selected.length === correct.length &&
    selected.every((typeKey, index) => typeKey === correct[index]);

  lockAnswer(isCorrect, { kind: "type", selectedTypes: selected });
}

function submitCompareAnswer(answerId) {
  if (!answerId) {
    return;
  }

  state.selectedCompare = answerId;
  const isCorrect = answerId === state.currentQuestion.correctAnswerId;
  lockAnswer(isCorrect, { kind: "compare", selectedId: answerId });
}

function lockAnswer(isCorrect, submission) {
  if (state.answered || state.summary) {
    return;
  }

  state.answered = true;
  state.lastSubmission = submission;

  if (isCorrect) {
    state.session.correct += 1;
    state.session.streak += 1;
    state.session.bestStreak = Math.max(state.session.bestStreak, state.session.streak);
  } else {
    state.session.streak = 0;
  }

  state.awaitingSummary = state.session.round === state.session.total;
  playCry(state.currentQuestion.correctPokemon?.cry);
  render();
}

function renderFeedback() {
  const copy = copyForLocale();

  if (state.summary) {
    dom.feedbackPanel.innerHTML = `
      <p class="feedback-kicker">${escapeHtml(copy.sessionComplete)}</p>
      <h2 class="feedback-title">${escapeHtml(state.summary.title)}</h2>
      <p class="feedback-text">${escapeHtml(state.summary.description)}</p>
    `;
    return;
  }

  const question = state.currentQuestion;

  if (!state.answered) {
    dom.feedbackPanel.innerHTML = `
      <p class="feedback-kicker">${escapeHtml(copy.ready)}</p>
      <h2 class="feedback-title">${escapeHtml(modeText(state.mode, "deckLabel"))}</h2>
      <p class="feedback-text">${escapeHtml(question.helper)}</p>
    `;
    return;
  }

  const isCorrect = getIsCurrentAnswerCorrect();
  const submissionMarkup = buildSubmissionMarkup();
  const typePills = question.typePills
    .map((pill) => `<span class="type-pill">${escapeHtml(pill)}</span>`)
    .join("");
  const statBadges = question.statBadges
    .map((badge) => `<span class="stat-badge">${escapeHtml(badge)}</span>`)
    .join("");

  dom.feedbackPanel.innerHTML = `
    <p class="feedback-kicker">${isCorrect ? escapeHtml(copy.correct) : escapeHtml(copy.notQuite)}</p>
    <h2 class="feedback-title">${escapeHtml(question.revealTitle)}</h2>
    <p class="feedback-text">${escapeHtml(question.revealText)}</p>
    ${submissionMarkup}
    <div class="type-row">${typePills}</div>
    <div class="stats-row">${statBadges}</div>
    ${
      question.factText
        ? `
          <div class="fact-card">
            <strong>${escapeHtml(copy.dexMemo)}</strong>
            <p class="fact-text">${escapeHtml(question.factText)}</p>
          </div>
        `
        : ""
    }
  `;
}

function buildSubmissionMarkup() {
  if (!state.lastSubmission) {
    return "";
  }

  const copy = copyForLocale();

  switch (state.lastSubmission.kind) {
    case "text": {
      const value = state.lastSubmission.value?.trim() || copy.noInput;
      return `
        <div class="fact-card">
          <strong>${escapeHtml(copy.answerInput)}</strong>
          <p class="fact-text">${escapeHtml(value)}</p>
        </div>
      `;
    }
    case "type": {
      const labels = state.lastSubmission.selectedTypes
        .map((typeKey) => {
          const type = state.index.allTypes.find((entry) => entry.key === typeKey);
          return type ? getLocalizedTypeLabel(type) : typeKey;
        })
        .join(" / ");

      return `
        <div class="fact-card">
          <strong>${escapeHtml(copy.answerChoice)}</strong>
          <p class="fact-text">${escapeHtml(labels || copy.noInput)}</p>
        </div>
      `;
    }
    case "compare": {
      const selectedPokemon =
        state.lastSubmission.selectedId === "left"
          ? state.currentQuestion.left
          : state.currentQuestion.right;

      return `
        <div class="fact-card">
          <strong>${escapeHtml(copy.answerChoice)}</strong>
          <p class="fact-text">${escapeHtml(getLocalizedName(selectedPokemon))}</p>
        </div>
      `;
    }
    default:
      return "";
  }
}

function getIsCurrentAnswerCorrect() {
  if (!state.lastSubmission) {
    return false;
  }

  switch (state.lastSubmission.kind) {
    case "text":
      return state.currentQuestion.acceptedAnswerKeys.includes(
        state.locale === "en"
          ? normalizeEnglishInput(state.lastSubmission.value)
          : normalizeJapaneseInput(state.lastSubmission.value),
      );
    case "type": {
      const selected = [...state.lastSubmission.selectedTypes].sort();
      const correct = [...state.currentQuestion.correctTypeKeys].sort();
      return (
        selected.length === correct.length &&
        selected.every((typeKey, index) => typeKey === correct[index])
      );
    }
    case "compare":
      return state.lastSubmission.selectedId === state.currentQuestion.correctAnswerId;
    default:
      return false;
  }
}

function renderControls() {
  const copy = copyForLocale();
  dom.restartButton.textContent = state.summary ? copy.restartDone : copy.restart;
  dom.nextButton.hidden = state.summary || !state.answered;
  dom.nextButton.textContent = state.awaitingSummary ? copy.results : copy.next;
}

function finalizeSession() {
  const previousRecord = state.records[state.mode] ?? defaultRecord();
  const updatedRecord = {
    best: Math.max(previousRecord.best, state.session.correct),
    plays: previousRecord.plays + 1,
  };

  state.records[state.mode] = updatedRecord;
  saveRecords(state.records);

  const isNewBest = state.session.correct > previousRecord.best;
  const copy = copyForLocale();
  state.summary = {
    score: `${state.session.correct}/${state.session.total}`,
    title: isNewBest ? copy.newBestTitle : getSummaryTitle(),
    description: getSummaryDescription(isNewBest),
    best: updatedRecord.best,
    plays: updatedRecord.plays,
    bestStreak: state.session.bestStreak,
  };
  state.awaitingSummary = false;
  render();
}

function getSummaryTitle() {
  const isEnglish = state.locale === "en";
  if (state.session.correct === state.session.total) {
    return isEnglish ? "Perfect score!" : "全問正解です";
  }

  if (state.session.correct >= Math.ceil(state.session.total * 0.67)) {
    return isEnglish ? "Great run!" : "かなり好調でした";
  }

  if (state.session.correct >= Math.ceil(state.session.total * 0.5)) {
    return isEnglish ? "Nice pace!" : "いいペースです";
  }

  return isEnglish ? "One more round will do it" : "もう一回で伸びます";
}

function getSummaryDescription(isNewBest) {
  const label = modeText(state.mode, "label");

  if (isNewBest) {
    return state.locale === "en"
      ? `You set a new personal best in ${label}. Try switching visual modes and go again.`
      : `${label}で新しい自己ベストを記録しました。表示モードを変えてもう一度遊ぶのもおすすめです。`;
  }

  return state.locale === "en"
    ? `You answered ${state.session.correct} questions correctly in ${label}. Try another mode from the selector above.`
    : `${label}を ${state.session.correct} 問正解しました。上のモード切り替えから別ジャンルにも挑戦できます。`;
}

function getRoundLabel() {
  return copyForLocale().roundLabel.replace("{round}", String(state.session.round));
}

function toggleLocale() {
  state.locale = state.locale === "ja" ? "en" : "ja";
  localStorage.setItem(STORAGE_KEYS.locale, JSON.stringify(state.locale));
  applyStaticCopy();
  startMode(state.mode);
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  localStorage.setItem(STORAGE_KEYS.sound, JSON.stringify(state.soundEnabled));
  syncSoundButton();
}

function syncSoundButton() {
  const copy = copyForLocale();
  dom.soundToggle.textContent = state.soundEnabled ? copy.soundOn : copy.soundOff;
  dom.soundToggle.setAttribute("aria-pressed", String(state.soundEnabled));
}

function setVisualMode(mode) {
  state.visualMode = mode;
  document.body.dataset.visual = mode;
  localStorage.setItem(STORAGE_KEYS.visual, JSON.stringify(mode));
  syncVisualButtons();
  render();
}

function syncVisualButtons() {
  for (const button of dom.visualToggle.querySelectorAll("[data-visual-mode]")) {
    const active = button.dataset.visualMode === state.visualMode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  }
}

function getPokemonVisual(pokemon) {
  return state.visualMode === "pixel" ? pokemon.sprite || pokemon.image : pokemon.image || pokemon.sprite;
}

function buildFallbackSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

async function shareToX() {
  const payload = buildSharePayload();
  const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(payload.text)}`;

  window.open(intentUrl, "_blank", "noopener,noreferrer");
}

async function copyShareLink() {
  await copyTextToClipboard(APP_URL);
}

function buildSharePayload() {
  const url = APP_URL;
  const copy = copyForLocale();
  const text = `${copy.shareText}\n${url}`;

  return {
    title: copy.title,
    text,
    url,
  };
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function playCry(url) {
  if (!state.soundEnabled || !state.audio || !url) {
    return;
  }

  try {
    state.audio.pause();
    state.audio.src = url;
    state.audio.currentTime = 0;
    state.audio.play().catch(() => {});
  } catch (error) {
    console.warn("Failed to play cry", error);
  }
}

function renderLoadError(error) {
  const copy = copyForLocale();
  state.loading = false;
  dom.questionStage.innerHTML = `
    <section class="summary-card">
      <p class="eyebrow">${escapeHtml(copy.loadErrorEyebrow)}</p>
      <h2>${escapeHtml(copy.loadErrorTitle)}</h2>
      <p>${escapeHtml(error.message)}</p>
    </section>
  `;
  dom.interactionPanel.innerHTML = "";
  dom.feedbackPanel.innerHTML = `
    <p class="feedback-kicker">${escapeHtml(copy.retry)}</p>
    <h2 class="feedback-title">${escapeHtml(copy.loadErrorTitle)}</h2>
    <p class="feedback-text">${escapeHtml(copy.reloadHint)}</p>
  `;
  dom.nextButton.hidden = true;
}

function normalizeJapaneseInput(value) {
  return toKatakana(
    value
      .normalize("NFKC")
      .trim()
      .replace(/\s+/g, "")
      .replace(/[・･]/g, "")
      .replaceAll("♀", "メス")
      .replaceAll("♂", "オス"),
  );
}

function normalizeEnglishInput(value) {
  return value
    .normalize("NFKC")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replaceAll("♀", " female ")
    .replaceAll("♂", " male ")
    .replace(/[^a-z0-9]+/g, "");
}

function buildJapaneseAnswerKeys(name) {
  const variants = new Set([name, toHiragana(name), toKatakana(name)]);
  const expanded = new Set();

  for (const variant of variants) {
    expanded.add(variant);
    expanded.add(variant.replaceAll("♀", "メス"));
    expanded.add(variant.replaceAll("♂", "オス"));
    expanded.add(variant.replaceAll("２", "2"));
    expanded.add(variant.replaceAll("2", "２"));
    expanded.add(variant.replace(/[・･]/g, ""));
  }

  return new Set([...expanded].map(normalizeJapaneseInput));
}

function buildEnglishAnswerKeys(nameEn, slug) {
  const variants = new Set([
    nameEn,
    slug,
    nameEn.replaceAll("♀", " Female"),
    nameEn.replaceAll("♂", " Male"),
    nameEn.replaceAll("♀", " F"),
    nameEn.replaceAll("♂", " M"),
  ]);

  return new Set([...variants].map(normalizeEnglishInput));
}

function toKatakana(value) {
  return [...value]
    .map((char) => {
      const codePoint = char.codePointAt(0);
      if (codePoint >= 0x3041 && codePoint <= 0x3096) {
        return String.fromCodePoint(codePoint + 0x60);
      }
      return char;
    })
    .join("");
}

function toHiragana(value) {
  return [...value]
    .map((char) => {
      const codePoint = char.codePointAt(0);
      if (codePoint >= 0x30a1 && codePoint <= 0x30f6) {
        return String.fromCodePoint(codePoint - 0x60);
      }
      return char;
    })
    .join("");
}

function isSimpleKanaName(name) {
  return /^[ァ-ヶー]+$/.test(name.normalize("NFKC").replace(/[・･\s]/g, ""));
}

function buildJapaneseChain(name) {
  const simpleKanaName = isSimpleKanaName(name);
  const chars = [...name.normalize("NFKC").replace(/[・･\s]/g, "")];
  const first = chars[0] ?? "";
  const last = chars.at(-1) ?? "";
  const eligible = simpleKanaName && last !== "ン";

  return { first, last, eligibleBefore: eligible, eligibleMiddle: eligible, eligibleAfter: simpleKanaName };
}

function buildEnglishChain(nameEn) {
  const normalized = normalizeEnglishInput(nameEn);
  const alphaOnly = /^[a-z]+$/.test(normalized);

  return {
    first: normalized[0] ?? "",
    last: normalized.at(-1) ?? "",
    eligibleBefore: alphaOnly,
    eligibleMiddle: alphaOnly,
    eligibleAfter: alphaOnly,
  };
}

function joinTypeLabels(types) {
  return types.map((type) => getLocalizedTypeLabel(type)).join(" / ");
}

function formatMetric(value, metric) {
  return metric === "weightKg" ? `${value}kg` : `${value}m`;
}

function sampleMany(items, count) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy.slice(0, count);
}

function sampleOne(items) {
  if (!items.length) {
    return null;
  }

  return items[Math.floor(Math.random() * items.length)];
}

function defaultRecord() {
  return { best: 0, plays: 0 };
}

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.records);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch (error) {
    console.warn("Failed to parse records", error);
    return {};
  }
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records));
}

function loadSoundPreference() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.sound);

    if (raw === null) {
      return true;
    }

    return Boolean(JSON.parse(raw));
  } catch (error) {
    console.warn("Failed to parse sound preference", error);
    return true;
  }
}

function loadVisualPreference() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.visual);

    if (!raw) {
      return "art";
    }

    const parsed = JSON.parse(raw);
    return parsed === "pixel" ? "pixel" : "art";
  } catch (error) {
    console.warn("Failed to parse visual preference", error);
    return "art";
  }
}

function loadLocalePreference() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.locale);

    if (!raw) {
      return "ja";
    }

    const parsed = JSON.parse(raw);
    return parsed === "en" ? "en" : "ja";
  } catch (error) {
    console.warn("Failed to parse locale preference", error);
    return "ja";
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
