const QUIZ_LENGTH = 6;
const DATA_URL = "./data/pokemon.json";
const STORAGE_KEYS = {
  records: "pokemon-quiz-lab-records-v1",
  sound: "pokemon-quiz-lab-sound-v1",
};

const MODE_CONFIG = {
  silhouette: {
    label: "シルエット",
    shortLabel: "シルエット",
    deckLabel: "影だけで当てる",
    description: "黒いシルエットと4択だけを頼りに、ポケモンの名前を当てます。",
  },
  type: {
    label: "タイプクイズ",
    shortLabel: "タイプ",
    deckLabel: "タイプを見抜く",
    description: "表示されたポケモンが持っているタイプを、4択から選びます。",
  },
  compare: {
    label: "どっちが重い・高い？",
    shortLabel: "比較",
    deckLabel: "重さと高さの勝負",
    description: "2匹を見比べて、どちらが重いか、または背が高いかを選びます。",
  },
  shiritori: {
    label: "しりとり真ん中あて",
    shortLabel: "しりとり",
    deckLabel: "しりとりの穴埋め",
    description: "前後の名前を見て、真ん中に入るポケモン名を当てる言葉遊びクイズです。",
  },
};

const dom = {
  heroCountChip: document.querySelector("#hero-count-chip"),
  soundToggle: document.querySelector("#sound-toggle"),
  modeStrip: document.querySelector("#mode-strip"),
  questionStage: document.querySelector("#question-stage"),
  answerGrid: document.querySelector("#answer-grid"),
  feedbackPanel: document.querySelector("#feedback-panel"),
  restartButton: document.querySelector("#restart-button"),
  nextButton: document.querySelector("#next-button"),
  modeGuide: document.querySelector("#mode-guide"),
  statusMode: document.querySelector("#status-mode"),
  statusRound: document.querySelector("#status-round"),
  statusScore: document.querySelector("#status-score"),
  statusBest: document.querySelector("#status-best"),
};

const state = {
  data: [],
  index: null,
  mode: "silhouette",
  currentQuestion: null,
  selectedAnswer: null,
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
  };
}

state.session = createSession();

document.body.dataset.mode = state.mode;
renderModeButtons();
renderModeGuide();
syncSoundButton();
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

  state.data = payload.pokemon;
  state.index = buildIndex(state.data);
  state.loading = false;

  dom.heroCountChip.textContent = `${state.data.length}匹収録`;

  startMode(state.mode);
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
    state.currentQuestion = generateQuestion(state.mode);
    state.selectedAnswer = null;
    state.answered = false;
    render();
  });
}

function buildIndex(pokemon) {
  const allTypes = [];
  const seenTypes = new Set();
  const shiritoriPool = [];
  const byFirst = new Map();
  const byLast = new Map();

  for (const entry of pokemon) {
    for (const type of entry.types) {
      if (!seenTypes.has(type.key)) {
        seenTypes.add(type.key);
        allTypes.push(type);
      }
    }

    if (entry.shiritori?.eligible) {
      shiritoriPool.push(entry);
      pushToIndex(byFirst, entry.shiritori.first, entry);
      pushToIndex(byLast, entry.shiritori.last, entry);
    }
  }

  return { allTypes, shiritoriPool, byFirst, byLast };
}

function pushToIndex(map, key, value) {
  if (!map.has(key)) {
    map.set(key, []);
  }

  map.get(key).push(value);
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

      state.mode = mode;
      document.body.dataset.mode = mode;
      renderModeButtons();
      renderModeGuide();
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
  state.currentQuestion = generateQuestion(mode);
  state.selectedAnswer = null;
  state.answered = false;
  state.awaitingSummary = false;
  state.summary = null;
  render();
}

function generateQuestion(mode) {
  switch (mode) {
    case "silhouette":
      return buildSilhouetteQuestion();
    case "type":
      return buildTypeQuestion();
    case "compare":
      return buildCompareQuestion();
    case "shiritori":
      return buildShiritoriQuestion();
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}

function buildSilhouetteQuestion() {
  const correct = sampleOne(state.data);
  const options = shuffle([correct, ...sampleMany(excludeById(state.data, correct.id), 3)]);

  return {
    mode: "silhouette",
    prompt: "このシルエットのポケモンは？",
    helper: "黒いシルエットと雰囲気を頼りに、4択から正しい名前を選びましょう。",
    pokemon: correct,
    options: options.map((entry) => ({
      id: String(entry.id),
      label: entry.name,
      detail: `${entry.primaryType}タイプ`,
    })),
    correctAnswerId: String(correct.id),
    revealTitle: `${correct.name}が正解です`,
    revealText: `${correct.category}。タイプは ${joinTypeLabels(correct.types)} です。`,
    factText: correct.flavorText,
    typePills: correct.types.map((type) => type.label),
    statBadges: [`No.${correct.dex}`, `${correct.heightM}m`, `${correct.weightKg}kg`],
    cry: correct.cry,
  };
}

function buildTypeQuestion() {
  const pokemon = sampleOne(state.data);
  const correctType = sampleOne(pokemon.types);
  const wrongTypePool = state.index.allTypes.filter(
    (type) => !pokemon.types.some((entry) => entry.key === type.key),
  );
  const options = shuffle([correctType, ...sampleMany(wrongTypePool, 3)]);

  return {
    mode: "type",
    prompt: "このポケモンが持っているタイプは？",
    helper: "1つだけ正しいタイプが入っています。図鑑の知識で見抜いてください。",
    pokemon,
    options: options.map((type) => ({
      id: type.key,
      label: type.label,
      detail: "タイプ候補",
    })),
    correctAnswerId: correctType.key,
    revealTitle: `${pokemon.name}のタイプは ${joinTypeLabels(pokemon.types)}`,
    revealText: `${pokemon.category}。この問題の正解は「${correctType.label}」でした。`,
    factText: pokemon.flavorText,
    typePills: pokemon.types.map((type) => type.label),
    statBadges: [`No.${pokemon.dex}`, `${pokemon.heightM}m`, `${pokemon.weightKg}kg`],
    cry: pokemon.cry,
  };
}

function buildCompareQuestion() {
  let left = null;
  let right = null;
  let metric = "weightKg";
  let settled = false;

  for (let attempt = 0; attempt < 200; attempt += 1) {
    metric = Math.random() < 0.5 ? "weightKg" : "heightM";
    [left, right] = sampleMany(state.data, 2);

    const larger = Math.max(left[metric], right[metric]);
    const smaller = Math.min(left[metric], right[metric]);
    const gap = larger - smaller;
    const ratio = larger / smaller;

    if ((metric === "weightKg" && gap >= 8 && ratio >= 1.18) || (metric === "heightM" && gap >= 0.3 && ratio >= 1.16)) {
      settled = true;
      break;
    }
  }

  if (!settled) {
    [left, right] = sampleMany(state.data, 2);
    metric = left.weightKg === right.weightKg ? "heightM" : "weightKg";
  }

  const isWeight = metric === "weightKg";
  const correctAnswerId = left[metric] > right[metric] ? "left" : "right";
  const winner = correctAnswerId === "left" ? left : right;

  return {
    mode: "compare",
    prompt: isWeight ? "どっちが重い？" : "どっちが背が高い？",
    helper: isWeight
      ? "見た目と図鑑の印象から、より重いポケモンを選びましょう。"
      : "身長のイメージを頼りに、より背が高いポケモンを選びましょう。",
    metric,
    metricLabel: isWeight ? "重さ" : "高さ",
    left,
    right,
    options: [
      {
        id: "left",
        label: left.name,
        detail: left.primaryType,
        image: left.image,
      },
      {
        id: "right",
        label: right.name,
        detail: right.primaryType,
        image: right.image,
      },
    ],
    correctAnswerId,
    revealTitle: `${winner.name}の方が${isWeight ? "重い" : "高い"}です`,
    revealText: `${left.name}は ${formatMetric(left[metric], metric)}、${right.name}は ${formatMetric(right[metric], metric)}。`,
    factText: `${winner.name}のタイプは ${joinTypeLabels(winner.types)} です。`,
    typePills: winner.types.map((type) => type.label),
    statBadges: [
      `${left.name} ${formatMetric(left[metric], metric)}`,
      `${right.name} ${formatMetric(right[metric], metric)}`,
    ],
    cry: winner.cry,
  };
}

function buildShiritoriQuestion() {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const correct = sampleOne(state.index.shiritoriPool);
    const beforeCandidates = (state.index.byLast.get(correct.shiritori.first) ?? []).filter(
      (entry) => entry.id !== correct.id,
    );
    const afterCandidates = (state.index.byFirst.get(correct.shiritori.last) ?? []).filter(
      (entry) => entry.id !== correct.id,
    );

    if (!beforeCandidates.length || !afterCandidates.length) {
      continue;
    }

    const before = sampleOne(beforeCandidates);
    const afterPool = afterCandidates.filter((entry) => entry.id !== before.id);

    if (!afterPool.length) {
      continue;
    }

    const after = sampleOne(afterPool);
    const wrongPool = state.index.shiritoriPool.filter(
      (entry) =>
        entry.id !== correct.id &&
        !(entry.shiritori.first === correct.shiritori.first && entry.shiritori.last === correct.shiritori.last),
    );

    if (wrongPool.length < 3) {
      continue;
    }

    const options = shuffle([correct, ...sampleMany(wrongPool, 3)]);

    return {
      mode: "shiritori",
      prompt: "しりとりの真ん中に入るポケモンは？",
      helper: "前の名前の最後の音から始まり、次の名前の最初の音で終わる名前を選びます。",
      before,
      after,
      options: options.map((entry) => ({
        id: String(entry.id),
        label: entry.name,
        detail: `${entry.shiritori.first} ... ${entry.shiritori.last}`,
      })),
      correctAnswerId: String(correct.id),
      revealTitle: `${before.name} → ${correct.name} → ${after.name}`,
      revealText: `「${before.shiritori.last}」で始まり「${after.shiritori.first}」で終わるのは ${correct.name} です。`,
      factText: correct.flavorText,
      typePills: correct.types.map((type) => type.label),
      statBadges: [`先頭 ${correct.shiritori.first}`, `末尾 ${correct.shiritori.last}`],
      cry: correct.cry,
    };
  }

  throw new Error("しりとりクイズの問題を生成できませんでした。");
}

function render() {
  renderStatus();
  renderModeButtons();
  renderModeGuide();
  renderQuestionStage();
  renderAnswerGrid();
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
            <span>今回のモード</span>
            <strong>${escapeHtml(MODE_CONFIG[state.mode].shortLabel)}</strong>
          </article>
        </div>
      </section>
    `;
    return;
  }

  const question = state.currentQuestion;
  let markup = "";

  switch (state.mode) {
    case "silhouette":
      markup = `
        <section class="question-shell">
          <div class="question-head">
            <p class="eyebrow">Round ${state.session.round}</p>
            <h2 class="question-prompt">${escapeHtml(question.prompt)}</h2>
            <p class="question-helper">${escapeHtml(question.helper)}</p>
          </div>
          <div class="visual-frame ${state.answered ? "is-revealed" : "is-silhouette"}">
            <img src="${escapeAttribute(question.pokemon.image)}" alt="" loading="eager" decoding="async" />
          </div>
          <div class="helper-row">
            <span class="helper-badge">No.${question.pokemon.dex}</span>
            <span class="helper-badge">${escapeHtml(question.pokemon.category)}</span>
          </div>
        </section>
      `;
      break;
    case "type":
      markup = `
        <section class="question-shell">
          <div class="question-head">
            <p class="eyebrow">Round ${state.session.round}</p>
            <h2 class="question-prompt">${escapeHtml(question.prompt)}</h2>
            <p class="question-helper">${escapeHtml(question.helper)}</p>
          </div>
          <div class="visual-frame ${state.answered ? "is-revealed" : ""}">
            <img src="${escapeAttribute(question.pokemon.image)}" alt="" loading="eager" decoding="async" />
          </div>
          <div class="helper-row">
            <span class="helper-badge">No.${question.pokemon.dex}</span>
            <span class="helper-badge">タイプを1つ選ぶ</span>
          </div>
        </section>
      `;
      break;
    case "compare":
      markup = `
        <section class="question-shell">
          <div class="question-head">
            <p class="eyebrow">Round ${state.session.round}</p>
            <h2 class="question-prompt">${escapeHtml(question.prompt)}</h2>
            <p class="question-helper">${escapeHtml(question.helper)}</p>
          </div>
          <div class="compare-board">
            <div class="compare-meter">
              <strong>${escapeHtml(question.metricLabel)}で勝負</strong>
              <span>左右のカードから答えを選んでください。</span>
            </div>
          </div>
        </section>
      `;
      break;
    case "shiritori":
      markup = `
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
      markup = "";
  }

  dom.questionStage.innerHTML = markup;
}

function renderAnswerGrid() {
  if (state.summary) {
    dom.answerGrid.innerHTML = "";
    dom.answerGrid.className = "answer-grid";
    return;
  }

  const question = state.currentQuestion;
  dom.answerGrid.className = `answer-grid${question.mode === "compare" ? " is-compare" : ""}`;
  dom.answerGrid.innerHTML = question.options
    .map((option) => {
      const correct = option.id === question.correctAnswerId;
      const selected = option.id === state.selectedAnswer;
      let statusClass = "";

      if (state.answered && correct) {
        statusClass = " is-correct";
      } else if (state.answered && selected && !correct) {
        statusClass = " is-wrong";
      }

      return `
        <button
          class="answer-button${question.mode === "compare" ? " is-compare" : ""}${statusClass}"
          type="button"
          data-answer-id="${escapeAttribute(option.id)}"
          ${state.answered ? "disabled" : ""}
        >
          ${
            question.mode === "compare"
              ? `
                <span class="answer-card-visual">
                  <img src="${escapeAttribute(option.image)}" alt="" loading="lazy" decoding="async" />
                </span>
              `
              : ""
          }
          <strong>${escapeHtml(option.label)}</strong>
          <span>${escapeHtml(option.detail)}</span>
        </button>
      `;
    })
    .join("");

  for (const button of dom.answerGrid.querySelectorAll("[data-answer-id]")) {
    button.addEventListener("click", () => handleAnswer(button.dataset.answerId));
  }
}

function renderFeedback() {
  if (state.summary) {
    dom.feedbackPanel.innerHTML = `
      <p class="feedback-kicker">Session Complete</p>
      <h2 class="feedback-title">${escapeHtml(state.summary.title)}</h2>
      <p class="feedback-text">${escapeHtml(state.summary.description)}</p>
      <div class="fact-card">
        <strong>次の遊び方</strong>
        <p class="fact-text">同じモードをもう一度試すか、上のモード切り替えで別のクイズに挑戦できます。</p>
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

  const isCorrect = state.selectedAnswer === question.correctAnswerId;
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

function renderControls() {
  dom.restartButton.textContent = state.summary ? "このモードでもう一度" : "このモードをやり直す";
  dom.nextButton.hidden = state.summary || !state.answered;
  dom.nextButton.textContent = state.awaitingSummary ? "結果を見る" : "次の問題へ";
}

function handleAnswer(answerId) {
  if (state.loading || state.answered || state.summary) {
    return;
  }

  state.selectedAnswer = answerId;
  state.answered = true;

  if (answerId === state.currentQuestion.correctAnswerId) {
    state.session.correct += 1;
    state.session.streak += 1;
    state.session.bestStreak = Math.max(state.session.bestStreak, state.session.streak);
  } else {
    state.session.streak = 0;
  }

  state.awaitingSummary = state.session.round === state.session.total;
  playCry(state.currentQuestion.cry);
  render();
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
    return `${MODE_CONFIG[state.mode].label}で新しい自己ベストを記録しました。勢いのまま別モードにも挑戦できます。`;
  }

  return `${MODE_CONFIG[state.mode].label}を ${state.session.correct} 問正解しました。別モードに切り替えると、まったく違う感覚で遊べます。`;
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
  dom.answerGrid.innerHTML = "";
  dom.feedbackPanel.innerHTML = `
    <p class="feedback-kicker">Retry</p>
    <h2 class="feedback-title">ページを再読み込みしてください</h2>
    <p class="feedback-text">通信が安定した状態で再度開くと、クイズを開始できます。</p>
  `;
  dom.nextButton.hidden = true;
}

function excludeById(pokemon, id) {
  return pokemon.filter((entry) => entry.id !== id);
}

function joinTypeLabels(types) {
  return types.map((type) => type.label).join(" / ");
}

function formatMetric(value, metric) {
  return metric === "weightKg" ? `${value}kg` : `${value}m`;
}

function sampleMany(items, count) {
  const copy = [...items];
  shuffle(copy);
  return copy.slice(0, count);
}

function sampleOne(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
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
