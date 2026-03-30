const QUIZ_LENGTH = 6;
const DATA_URL = "./data/pokemon.json";
const STORAGE_KEYS = {
  records: "pokemon-quiz-lab-records-v2",
  sound: "pokemon-quiz-lab-sound-v1",
  visual: "pokemon-quiz-lab-visual-v1",
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
    label: "シルエット",
    shortLabel: "シルエット",
    deckLabel: "入力で当てるシルエット",
    description: "名前をキーボード入力で当てます。ひらがな・カタカナのどちらでもOKです。",
  },
  type: {
    label: "タイプクイズ",
    shortLabel: "タイプ",
    deckLabel: "タイプを2つまで選ぶ",
    description: "全18タイプから選択します。単タイプでも2つ選べる状態で挑戦できます。",
  },
  weight: {
    label: "どっちが重い？",
    shortLabel: "重さ",
    deckLabel: "重さを見比べる",
    description: "2匹を見比べて、より重いポケモンを選びます。",
  },
  height: {
    label: "どっちが高い？",
    shortLabel: "高さ",
    deckLabel: "高さを見比べる",
    description: "2匹を見比べて、より背が高いポケモンを選びます。",
  },
  shiritori: {
    label: "しりとり真ん中あて",
    shortLabel: "しりとり",
    deckLabel: "真ん中を入力する",
    description: "前後のポケモン名から、真ん中に入る名前をキーボード入力で当てます。",
  },
};

const dom = {
  heroCountChip: document.querySelector("#hero-count-chip"),
  soundToggle: document.querySelector("#sound-toggle"),
  visualToggle: document.querySelector("#visual-toggle"),
  modeStrip: document.querySelector("#mode-strip"),
  questionStage: document.querySelector("#question-stage"),
  interactionPanel: document.querySelector("#interaction-panel"),
  feedbackPanel: document.querySelector("#feedback-panel"),
  restartButton: document.querySelector("#restart-button"),
  nextButton: document.querySelector("#next-button"),
  modeGuide: document.querySelector("#mode-guide"),
  statusMode: document.querySelector("#status-mode"),
  statusRound: document.querySelector("#status-round"),
  statusScore: document.querySelector("#status-score"),
  statusBest: document.querySelector("#status-best"),
  shareX: document.querySelector("#share-x"),
  shareInstagram: document.querySelector("#share-instagram"),
  shareCopy: document.querySelector("#share-copy"),
  shareNote: document.querySelector("#share-note"),
};

const state = {
  data: [],
  index: null,
  mode: "silhouette",
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
  shareNote:
    "Instagram はモバイルの共有シート経由で共有できます。直接投稿できない環境ではコピーが使えます。",
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

document.body.dataset.mode = state.mode;
document.body.dataset.visual = state.visualMode;
renderModeButtons();
renderModeGuide();
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
    throw new Error(`データの読み込みに失敗しました: ${response.status}`);
  }

  const payload = await response.json();

  state.data = payload.pokemon.map(enrichPokemon);
  state.index = buildIndex(state.data);
  state.loading = false;

  dom.heroCountChip.textContent = `${state.data.length}匹収録`;

  startMode(state.mode);
}

function enrichPokemon(pokemon) {
  const sprite = pokemon.sprite || buildFallbackSpriteUrl(pokemon.id);
  const answerKeys = [...buildAnswerKeys(pokemon.name)];
  const simpleKanaName = isSimpleKanaName(pokemon.name);

  return {
    ...pokemon,
    sprite,
    answerKeys,
    hiraganaName: toHiragana(pokemon.name),
    simpleKanaName,
    canBeShiritoriBefore: simpleKanaName && pokemon.shiritori?.last !== "ン",
    canBeShiritoriMiddle: simpleKanaName && pokemon.shiritori?.last !== "ン",
    canBeShiritoriAfter: simpleKanaName,
  };
}

function buildIndex(pokemon) {
  const typeMap = new Map();
  const beforeByLast = new Map();
  const afterByFirst = new Map();
  const beforePool = [];
  const middlePool = [];
  const afterPool = [];

  for (const entry of pokemon) {
    for (const type of entry.types) {
      if (!typeMap.has(type.key)) {
        typeMap.set(type.key, type);
      }
    }

    if (entry.canBeShiritoriBefore) {
      beforePool.push(entry);
      pushToIndex(beforeByLast, entry.shiritori.last, entry);
    }

    if (entry.canBeShiritoriMiddle) {
      middlePool.push(entry);
    }

    if (entry.canBeShiritoriAfter) {
      afterPool.push(entry);
      pushToIndex(afterByFirst, entry.shiritori.first, entry);
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
  dom.shareInstagram.addEventListener("click", shareToInstagram);
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
          <strong>${escapeHtml(config.label)}</strong>
          <span>${escapeHtml(config.description)}</span>
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

function renderModeGuide() {
  dom.modeGuide.innerHTML = Object.entries(MODE_CONFIG)
    .map(([modeKey, config]) => {
      const record = state.records[modeKey] ?? defaultRecord();
      const isActive = state.mode === modeKey;

      return `
        <article class="guide-card${isActive ? " is-active" : ""}">
          <p class="eyebrow">${escapeHtml(config.deckLabel)}</p>
          <h3>${escapeHtml(config.label)}</h3>
          <p>${escapeHtml(config.description)}</p>
          <div class="guide-meta">
            <span class="helper-badge">ベスト ${record.best} / ${QUIZ_LENGTH}</span>
            <span class="helper-badge">プレイ ${record.plays} 回</span>
          </div>
        </article>
      `;
    })
    .join("");
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

  return {
    mode: "silhouette",
    inputKind: "text",
    prompt: "このシルエットのポケモンは？",
    helper: "ひらがな・カタカナどちらでもOK。記号つきの名前も対応します。",
    inputPlaceholder: "ポケモンの名前を入力",
    pokemon,
    usedIds: [pokemon.id],
    acceptedAnswerKeys: pokemon.answerKeys,
    correctPokemon: pokemon,
    revealTitle: `${pokemon.name}が正解です`,
    revealText: `${pokemon.category}。タイプは ${joinTypeLabels(pokemon.types)} です。`,
    factText: pokemon.flavorText,
    typePills: pokemon.types.map((type) => type.label),
    statBadges: [`No.${pokemon.dex}`, `${pokemon.heightM}m`, `${pokemon.weightKg}kg`],
  };
}

function buildTypeQuestion() {
  const pokemon = pickFreshOne(state.data);

  return {
    mode: "type",
    inputKind: "type",
    prompt: "このポケモンのタイプを選んでください",
    helper: "全18タイプから 1〜2 個まで選べます。単タイプなら 1 つだけで正解です。",
    pokemon,
    usedIds: [pokemon.id],
    correctTypeKeys: pokemon.types.map((type) => type.key),
    correctPokemon: pokemon,
    revealTitle: `${pokemon.name}のタイプは ${joinTypeLabels(pokemon.types)}`,
    revealText: `${pokemon.category}。持っているタイプをすべて当てると正解です。`,
    factText: pokemon.flavorText,
    typePills: pokemon.types.map((type) => type.label),
    statBadges: [`No.${pokemon.dex}`, `${pokemon.heightM}m`, `${pokemon.weightKg}kg`],
  };
}

function buildCompareQuestion(metric) {
  const prompt = metric === "weightKg" ? "どっちが重い？" : "どっちが背が高い？";
  const helper =
    metric === "weightKg"
      ? "左右のポケモンを見比べて、より重い方を選びましょう。"
      : "左右のポケモンを見比べて、より背が高い方を選びましょう。";
  const metricLabel = metric === "weightKg" ? "重さ" : "高さ";

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
    revealTitle: `${winner.name}の方が${metric === "weightKg" ? "重い" : "高い"}です`,
    revealText: `${left.name}は ${formatMetric(left[metric], metric)}、${right.name}は ${formatMetric(right[metric], metric)}。`,
    factText: `${winner.name}のタイプは ${joinTypeLabels(winner.types)} です。`,
    typePills: winner.types.map((type) => type.label),
    statBadges: [
      `${left.name} ${formatMetric(left[metric], metric)}`,
      `${right.name} ${formatMetric(right[metric], metric)}`,
    ],
  };
}

function buildShiritoriQuestion() {
  const usedIds = new Set(state.session.usedIds);

  for (let attempt = 0; attempt < 500; attempt += 1) {
    const correct = pickFreshOne(state.index.middlePool);
    const beforeCandidates = filterFreshCandidates(
      state.index.beforeByLast.get(correct.shiritori.first) ?? [],
      new Set([correct.id]),
      usedIds,
    );
    const before = sampleOne(beforeCandidates);

    if (!before) {
      continue;
    }

    const afterCandidates = filterFreshCandidates(
      state.index.afterByFirst.get(correct.shiritori.last) ?? [],
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
      prompt: "しりとりの真ん中に入るポケモンは？",
      helper: "前の終わりの音で始まり、次の始まりの音で終わるポケモン名を入力してください。",
      inputPlaceholder: "真ん中のポケモン名を入力",
      before,
      after,
      usedIds: [before.id, correct.id, after.id],
      acceptedAnswerKeys: correct.answerKeys,
      correctPokemon: correct,
      revealTitle: `${before.name} → ${correct.name} → ${after.name}`,
      revealText: `「${before.shiritori.last}」で始まり「${after.shiritori.first}」で終わるのは ${correct.name} です。`,
      factText: correct.flavorText,
      typePills: correct.types.map((type) => type.label),
      statBadges: [`先頭 ${correct.shiritori.first}`, `末尾 ${correct.shiritori.last}`],
    };
  }

  throw new Error("しりとりクイズの問題を生成できませんでした。");
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
  renderModeGuide();
  syncSoundButton();
  syncVisualButtons();
  renderShareNote();
  renderQuestionStage();
  renderInteractionPanel();
  renderFeedback();
  renderControls();
}

function renderStatus() {
  const record = state.records[state.mode] ?? defaultRecord();
  const config = MODE_CONFIG[state.mode];

  dom.statusMode.textContent = config.shortLabel;
  dom.statusRound.textContent = state.summary
    ? `${state.session.total} / ${state.session.total}`
    : `${state.session.round} / ${state.session.total}`;
  dom.statusScore.textContent = `${state.session.correct}`;
  dom.statusBest.textContent = `${record.best}`;
}

function renderQuestionStage() {
  if (state.summary) {
    dom.questionStage.innerHTML = `
      <section class="summary-card">
        <p class="eyebrow">${escapeHtml(MODE_CONFIG[state.mode].label)}</p>
        <div class="summary-score">
          <div>
            <small>Score</small>
            ${state.summary.score}
          </div>
        </div>
        <h2>${escapeHtml(state.summary.title)}</h2>
        <p>${escapeHtml(state.summary.description)}</p>
        <div class="summary-grid">
          <article class="status-pill">
            <span>ベストスコア</span>
            <strong>${state.summary.best}</strong>
          </article>
          <article class="status-pill">
            <span>ベスト連続</span>
            <strong>${state.summary.bestStreak}</strong>
          </article>
          <article class="status-pill">
            <span>プレイ回数</span>
            <strong>${state.summary.plays}</strong>
          </article>
          <article class="status-pill">
            <span>表示モード</span>
            <strong>${state.visualMode === "pixel" ? "ドット" : "イラスト"}</strong>
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
            <p class="eyebrow">Round ${state.session.round}</p>
            <h2 class="question-prompt">${escapeHtml(question.prompt)}</h2>
            <p class="question-helper">${escapeHtml(question.helper)}</p>
          </div>
          <div class="visual-frame ${state.answered ? "is-revealed" : "is-silhouette"}">
            <img src="${escapeAttribute(getPokemonVisual(question.pokemon))}" alt="" loading="eager" decoding="async" />
          </div>
          <div class="badge-row">
            <span class="info-badge">No.${question.pokemon.dex}</span>
            <span class="info-badge">${escapeHtml(question.pokemon.category)}</span>
          </div>
        </section>
      `;
      break;
    case "type":
      dom.questionStage.innerHTML = `
        <section class="question-shell">
          <div class="question-head">
            <p class="eyebrow">Round ${state.session.round}</p>
            <h2 class="question-prompt">${escapeHtml(question.prompt)}</h2>
            <p class="question-helper">${escapeHtml(question.helper)}</p>
          </div>
          <div class="visual-frame ${state.answered ? "is-revealed" : ""}">
            <img src="${escapeAttribute(getPokemonVisual(question.pokemon))}" alt="" loading="eager" decoding="async" />
          </div>
          <div class="badge-row">
            <span class="info-badge">No.${question.pokemon.dex}</span>
            <span class="info-badge">全18タイプから選択</span>
          </div>
        </section>
      `;
      break;
    case "weight":
    case "height":
      dom.questionStage.innerHTML = `
        <section class="question-shell">
          <div class="question-head">
            <p class="eyebrow">Round ${state.session.round}</p>
            <h2 class="question-prompt">${escapeHtml(question.prompt)}</h2>
            <p class="question-helper">${escapeHtml(question.helper)}</p>
          </div>
          <div class="compare-board">
            <div class="compare-meter">
              <strong>${escapeHtml(question.metricLabel)}で勝負</strong>
              <span>カードをタップして答えます。</span>
            </div>
          </div>
        </section>
      `;
      break;
    case "shiritori":
      dom.questionStage.innerHTML = `
        <section class="question-shell">
          <div class="question-head">
            <p class="eyebrow">Round ${state.session.round}</p>
            <h2 class="question-prompt">${escapeHtml(question.prompt)}</h2>
            <p class="question-helper">${escapeHtml(question.helper)}</p>
          </div>
          <div class="chain-board">
            <div class="chain-row">
              <span class="chain-name">${escapeHtml(question.before.name)}</span>
              <span class="chain-gap">？？？</span>
              <span class="chain-name">${escapeHtml(question.after.name)}</span>
            </div>
            <div class="chain-row">
              <span class="chain-chip">前の終わり: ${escapeHtml(question.before.shiritori.last)}</span>
              <span class="chain-chip">次の始まり: ${escapeHtml(question.after.shiritori.first)}</span>
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
          こたえる
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
          ${escapeHtml(type.label)}
        </button>
      `;
    })
    .join("");

  dom.interactionPanel.innerHTML = `
    <section class="type-panel">
      <div class="picker-summary">
        <strong>タイプを 2 つまで選択</strong>
        <p class="picker-count">選択中: ${selectedCount} / 2</p>
      </div>
      <div class="type-picker-grid">${typeButtons}</div>
      <div class="type-picker-footer">
        <p class="input-note">単タイプのポケモンは 1 つだけ選べば正解です。</p>
        <button
          class="submit-button"
          id="type-submit"
          type="button"
          ${state.answered || selectedCount === 0 ? "disabled" : ""}
        >
          判定する
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
  const choices = [
    { id: "left", pokemon: question.left, detail: question.left.primaryType },
    { id: "right", pokemon: question.right, detail: question.right.primaryType },
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
              <strong>${escapeHtml(choice.pokemon.name)}</strong>
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
  const normalized = normalizePokemonInput(value);

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
  if (state.summary) {
    dom.feedbackPanel.innerHTML = `
      <p class="feedback-kicker">Session Complete</p>
      <h2 class="feedback-title">${escapeHtml(state.summary.title)}</h2>
      <p class="feedback-text">${escapeHtml(state.summary.description)}</p>
      <div class="fact-card">
        <strong>シェアのヒント</strong>
        <p class="fact-text">X へはそのまま共有できます。Instagram はモバイルの共有シートかコピーした文面を使うのがおすすめです。</p>
      </div>
    `;
    return;
  }

  const question = state.currentQuestion;

  if (!state.answered) {
    dom.feedbackPanel.innerHTML = `
      <p class="feedback-kicker">Ready</p>
      <h2 class="feedback-title">${escapeHtml(MODE_CONFIG[state.mode].deckLabel)}</h2>
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
    <p class="feedback-kicker">${isCorrect ? "Correct" : "Not Quite"}</p>
    <h2 class="feedback-title">${escapeHtml(question.revealTitle)}</h2>
    <p class="feedback-text">${escapeHtml(question.revealText)}</p>
    ${submissionMarkup}
    <div class="type-row">${typePills}</div>
    <div class="stats-row">${statBadges}</div>
    ${
      question.factText
        ? `
          <div class="fact-card">
            <strong>ずかんメモ</strong>
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

  switch (state.lastSubmission.kind) {
    case "text": {
      const value = state.lastSubmission.value?.trim() || "未入力";
      return `
        <div class="fact-card">
          <strong>あなたの入力</strong>
          <p class="fact-text">${escapeHtml(value)}</p>
        </div>
      `;
    }
    case "type": {
      const labels = state.lastSubmission.selectedTypes
        .map((typeKey) => state.index.allTypes.find((type) => type.key === typeKey)?.label ?? typeKey)
        .join(" / ");

      return `
        <div class="fact-card">
          <strong>あなたの選択</strong>
          <p class="fact-text">${escapeHtml(labels || "未選択")}</p>
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
          <strong>あなたの選択</strong>
          <p class="fact-text">${escapeHtml(selectedPokemon.name)}</p>
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
        normalizePokemonInput(state.lastSubmission.value),
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
  dom.restartButton.textContent = state.summary ? "このモードでもう一度" : "このモードをやり直す";
  dom.nextButton.hidden = state.summary || !state.answered;
  dom.nextButton.textContent = state.awaitingSummary ? "結果を見る" : "次の問題へ";
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
  state.summary = {
    score: `${state.session.correct}/${state.session.total}`,
    title: isNewBest ? "ベストスコア更新です" : getSummaryTitle(),
    description: getSummaryDescription(isNewBest),
    best: updatedRecord.best,
    plays: updatedRecord.plays,
    bestStreak: state.session.bestStreak,
  };
  state.awaitingSummary = false;
  render();
}

function getSummaryTitle() {
  if (state.session.correct === state.session.total) {
    return "全問正解です";
  }

  if (state.session.correct >= Math.ceil(state.session.total * 0.67)) {
    return "かなり好調でした";
  }

  if (state.session.correct >= Math.ceil(state.session.total * 0.5)) {
    return "いいペースです";
  }

  return "もう一回で伸びます";
}

function getSummaryDescription(isNewBest) {
  if (isNewBest) {
    return `${MODE_CONFIG[state.mode].label}で新しい自己ベストを記録しました。表示モードを変えてもう一度遊ぶのもおすすめです。`;
  }

  return `${MODE_CONFIG[state.mode].label}を ${state.session.correct} 問正解しました。上のモード切り替えから別ジャンルにも挑戦できます。`;
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  localStorage.setItem(STORAGE_KEYS.sound, JSON.stringify(state.soundEnabled));
  syncSoundButton();
}

function syncSoundButton() {
  dom.soundToggle.textContent = state.soundEnabled ? "サウンド ON" : "サウンド OFF";
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
  const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    payload.text,
  )}&url=${encodeURIComponent(payload.url)}`;

  window.open(intentUrl, "_blank", "noopener,noreferrer");
  setShareNote("X の共有画面を開きました。");
}

async function shareToInstagram() {
  const payload = buildSharePayload();

  if (navigator.share) {
    try {
      await navigator.share(payload);
      setShareNote("共有シートを開きました。Instagram が出る端末ではそのまま共有できます。");
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }
    }
  }

  await copyTextToClipboard(`${payload.text}\n${payload.url}`);
  setShareNote("Instagram へ直接投稿できない環境なので、共有文をコピーしました。貼り付けて使えます。");
}

async function copyShareLink() {
  const payload = buildSharePayload();
  await copyTextToClipboard(`${payload.text}\n${payload.url}`);
  setShareNote("共有文と URL をコピーしました。");
}

function buildSharePayload() {
  const url = window.location.href;
  const scoreText = state.summary
    ? `${MODE_CONFIG[state.mode].label}で ${state.summary.score} 正解`
    : `${MODE_CONFIG[state.mode].label}に挑戦中。現在 ${state.session.correct} 問正解`;
  const visualText = state.visualMode === "pixel" ? "ドット絵表示" : "イラスト表示";
  const text = `ポケモンクイズラボで ${scoreText}。${visualText}でも遊べる PokeAPI クイズです。 #ポケモンクイズラボ #PokeAPI`;

  return {
    title: "ポケモンクイズラボ",
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

function setShareNote(text) {
  state.shareNote = text;
  renderShareNote();
}

function renderShareNote() {
  dom.shareNote.textContent = state.shareNote;
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
  state.loading = false;
  dom.questionStage.innerHTML = `
    <section class="summary-card">
      <p class="eyebrow">Load Error</p>
      <h2>クイズデータを読み込めませんでした</h2>
      <p>${escapeHtml(error.message)}</p>
    </section>
  `;
  dom.interactionPanel.innerHTML = "";
  dom.feedbackPanel.innerHTML = `
    <p class="feedback-kicker">Retry</p>
    <h2 class="feedback-title">ページを再読み込みしてください</h2>
    <p class="feedback-text">通信が安定した状態で再度開くと、クイズを開始できます。</p>
  `;
  dom.nextButton.hidden = true;
}

function normalizePokemonInput(value) {
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

function buildAnswerKeys(name) {
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

  return new Set([...expanded].map(normalizePokemonInput));
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

function joinTypeLabels(types) {
  return types.map((type) => type.label).join(" / ");
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
