const WORD_BANK = [
  "あいす",
  "あおば",
  "あかり",
  "あくび",
  "あさひ",
  "あした",
  "あずき",
  "あたま",
  "あひる",
  "あんず",
  "いかり",
  "いちご",
  "いなほ",
  "いのち",
  "いもり",
  "いろは",
  "いろり",
  "いわし",
  "うきわ",
  "うさぎ",
  "うどん",
  "うわぎ",
  "うろこ",
  "えがお",
  "えのき",
  "えほん",
  "えびす",
  "おかし",
  "おかゆ",
  "おこめ",
  "おさけ",
  "おすし",
  "おでん",
  "おなか",
  "おなべ",
  "おはぎ",
  "おもち",
  "おやつ",
  "おんぷ",
  "かえる",
  "かおり",
  "かがく",
  "かがみ",
  "かざり",
  "かぞく",
  "かたち",
  "かなで",
  "かばん",
  "かもめ",
  "かるた",
  "かわら",
  "かんじ",
  "きおく",
  "きせつ",
  "きつね",
  "きのこ",
  "きもち",
  "きもの",
  "きらり",
  "きれい",
  "くうき",
  "くさり",
  "くじら",
  "くすり",
  "くつわ",
  "くらげ",
  "くるま",
  "くるみ",
  "くもり",
  "けいと",
  "けしき",
  "けだま",
  "けはい",
  "けむり",
  "けもの",
  "けやき",
  "こあら",
  "こいぬ",
  "こいし",
  "こぐま",
  "こころ",
  "こたつ",
  "こども",
  "ことば",
  "ことり",
  "こばん",
  "こはく",
  "こまち",
  "こよみ",
  "こんぶ",
  "さいふ",
  "さかな",
  "さくら",
  "さざえ",
  "さとう",
  "さなぎ",
  "さつま",
  "しあげ",
  "しいく",
  "しかく",
  "しぐれ",
  "しおり",
  "しずか",
  "しずく",
  "したぎ",
  "しつど",
  "しめじ",
  "しらべ",
  "しるし",
  "すいか",
  "すがお",
  "すずめ",
  "すずり",
  "すなば",
  "すまい",
  "すみれ",
  "すもう",
  "せいざ",
  "せかい",
  "せなか",
  "せりふ",
  "せんす",
  "せんろ",
  "そうじ",
  "そぼろ",
  "たいこ",
  "たいど",
  "たおる",
  "たから",
  "たぬき",
  "たまご",
  "たより",
  "たらこ",
  "たわし",
  "たんす",
  "だるま",
  "ちいき",
  "ちから",
  "ちしき",
  "ちのわ",
  "ちまき",
  "つうち",
  "つきみ",
  "つくえ",
  "つばき",
  "つばさ",
  "つばめ",
  "つみき",
  "つなみ",
  "ていど",
  "てがみ",
  "てまり",
  "てんき",
  "てんぐ",
  "とおり",
  "とけい",
  "とさか",
  "とちぎ",
  "とまと",
  "とびら",
  "とんぼ",
  "なすび",
  "なつめ",
  "なまえ",
  "なまこ",
  "なみだ",
  "なまず",
  "におい",
  "にしき",
  "にわか",
  "ねいろ",
  "ねごと",
  "ねずみ",
  "ねんど",
  "のどか",
  "のぞみ",
  "のりば",
  "はいく",
  "はかり",
  "はがき",
  "はさみ",
  "はしら",
  "はなび",
  "はやし",
  "はんこ",
  "ひかり",
  "ひこう",
  "ひざし",
  "ひつじ",
  "ひとみ",
  "ひなた",
  "ひみつ",
  "ひより",
  "ひらめ",
  "ひよこ",
  "ふうど",
  "ふしぎ",
  "ふたご",
  "ふとん",
  "ふもと",
  "ふくろ",
  "へいわ",
  "へちま",
  "へんじ",
  "ほうき",
  "ほたて",
  "ほたる",
  "ほのお",
  "ほんや",
  "ほこり",
  "まいご",
  "まくら",
  "まぐろ",
  "まじめ",
  "まつり",
  "まどか",
  "まほう",
  "まもの",
  "まゆげ",
  "まんが",
  "みかん",
  "みしん",
  "みずき",
  "みずぎ",
  "みつば",
  "みどり",
  "みなと",
  "みやこ",
  "みらい",
  "みんか",
  "むいか",
  "むかし",
  "むしば",
  "むすび",
  "めいし",
  "めがね",
  "めぐみ",
  "めだか",
  "めやす",
  "めろん",
  "もうふ",
  "もくば",
  "もぐら",
  "もなか",
  "もみじ",
  "もよう",
  "もどき",
  "やかん",
  "やさい",
  "やしろ",
  "やすみ",
  "やたい",
  "ゆかた",
  "ゆかり",
  "ゆうき",
  "ゆうひ",
  "ゆきみ",
  "ゆたか",
  "ようじ",
  "よこく",
  "よぞら",
  "よつば",
  "よろい",
  "らくだ",
  "りかい",
  "りぼん",
  "りゆう",
  "りんご",
  "れきし",
  "れもん",
  "れんげ",
  "れんず",
  "ろうか",
  "ろてん",
  "わかめ",
  "わさび",
  "わたげ",
  "わらい",
  "わらべ",
  "わるつ",
  "わすれ",
].filter((word, index, words) => word.length === 3 && words.indexOf(word) === index);

const REEL_COUNT = 3;
const DEFAULT_REEL_CELL_HEIGHT = 82;
const REEL_VISIBLE_BUFFER = 5;
const REEL_LENGTH = 15;
const ROUND_WORD_COUNT = 18;
const BASE_SPIN_SPEED = 10.5;
const LOOKUP_CACHE = new Map();

const wordCells = Array.from(document.querySelectorAll("[data-word-cell]"));
const hitCountEl = document.getElementById("hitCount");
const roundCountEl = document.getElementById("roundCount");
const rateCountEl = document.getElementById("rateCount");
const spinButton = document.getElementById("spinButton");
const stopAllButton = document.getElementById("stopAllButton");
const rerollButton = document.getElementById("rerollButton");
const roundHintEl = document.getElementById("roundHint");
const statusBadgeEl = document.getElementById("statusBadge");
const resultTitleEl = document.getElementById("resultTitle");
const resultLeadEl = document.getElementById("resultLead");
const sourceListEl = document.getElementById("sourceList");

const state = {
  hits: 0,
  rounds: 0,
  reels: [],
  spinning: false,
  roundWords: [],
  lookupToken: 0,
  lastTimestamp: 0,
  reelCellHeight: DEFAULT_REEL_CELL_HEIGHT,
};

function unique(items) {
  return [...new Set(items)];
}

function shuffle(items) {
  const clone = [...items];

  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }

  return clone;
}

function mod(value, length) {
  return ((value % length) + length) % length;
}

function clipText(text, limit = 120) {
  if (text.length <= limit) {
    return text;
  }

  return `${text.slice(0, limit).trim()}…`;
}

function compactWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

function toKatakana(text) {
  return [...text]
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 0x3041 && code <= 0x3096) {
        return String.fromCharCode(code + 0x60);
      }

      return char;
    })
    .join("");
}

function normalizeWord(text) {
  return compactWhitespace(
    [...text]
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code >= 0x30a1 && code <= 0x30f6) {
          return String.fromCharCode(code - 0x60);
        }

        return char;
      })
      .join("")
      .normalize("NFKC")
  );
}

function createReel(index) {
  const trackEl = document.getElementById(`reelTrack${index}`);
  const buttonEl = document.getElementById(`reelButton${index}`);
  const stopButtonEl = document.querySelector(`[data-stop="${index}"]`);
  const focusEl = buttonEl.querySelector(".reel-focus");
  const cells = [];

  for (let i = 0; i < REEL_VISIBLE_BUFFER; i += 1) {
    const cellEl = document.createElement("div");
    cellEl.className = "symbol-tile";
    trackEl.append(cellEl);
    cells.push(cellEl);
  }

  return {
    trackEl,
    buttonEl,
    stopButtonEl,
    focusEl,
    cells,
    symbols: ["?", "?", "?"],
    phase: "idle",
    position: 0,
    speed: 0,
    stopDuration: 0,
    stopElapsed: 0,
    startSpeed: 0,
    startPosition: 0,
    targetPosition: 0,
  };
}

function updateReelMetrics() {
  const rootStyles = getComputedStyle(document.documentElement);
  const reelCellHeight = Number.parseFloat(
    rootStyles.getPropertyValue("--reel-cell")
  );

  state.reelCellHeight = Number.isFinite(reelCellHeight)
    ? reelCellHeight
    : DEFAULT_REEL_CELL_HEIGHT;

  state.reels.forEach(renderReel);
}

function updateStats() {
  hitCountEl.textContent = String(state.hits);
  roundCountEl.textContent = String(state.rounds);

  const rate = state.rounds > 0 ? Math.round((state.hits / state.rounds) * 100) : 0;
  rateCountEl.textContent = `${rate}%`;
}

function getCenterSymbol(reel) {
  if (!reel.symbols.length) {
    return "?";
  }

  const focusedCell = getFocusedCell(reel);
  if (focusedCell?.textContent?.trim()) {
    return focusedCell.textContent.trim();
  }

  const index = mod(Math.round(reel.position), reel.symbols.length);
  return reel.symbols[index];
}

function getResolvedSymbol(reel) {
  if (!reel.symbols.length) {
    return "?";
  }

  if (
    (reel.phase === "stopping" || reel.phase === "stopped") &&
    Number.isFinite(reel.targetPosition)
  ) {
    const index = mod(Math.round(reel.targetPosition), reel.symbols.length);
    return reel.symbols[index];
  }

  return getCenterSymbol(reel);
}

function getCurrentWord() {
  return state.reels.map(getCenterSymbol).join("");
}

function updateWordDisplay(word) {
  [...word.padEnd(REEL_COUNT, "?")].forEach((char, index) => {
    wordCells[index].textContent = char;
  });
}

function buildReelSymbols(selectedWords, positionIndex) {
  const baseSymbols = unique(selectedWords.map((word) => [...word][positionIndex]));
  const fallbackPool = unique(
    WORD_BANK.map((word) => [...word][positionIndex]).filter(Boolean)
  ).filter((symbol) => !baseSymbols.includes(symbol));

  const extras = shuffle(fallbackPool).slice(
    0,
    Math.max(0, REEL_LENGTH - baseSymbols.length)
  );

  const symbols = shuffle([...baseSymbols, ...extras]).slice(0, REEL_LENGTH);

  while (symbols.length < REEL_LENGTH) {
    symbols.push(fallbackPool[Math.floor(Math.random() * fallbackPool.length)]);
  }

  return shuffle(symbols);
}

function prepareRound() {
  state.roundWords = shuffle(WORD_BANK).slice(0, ROUND_WORD_COUNT);

  state.reels.forEach((reel, index) => {
    reel.symbols = buildReelSymbols(state.roundWords, index);
    reel.position = Math.random() * reel.symbols.length;
    reel.phase = "idle";
    reel.speed = 0;
    reel.stopDuration = 0;
    reel.stopElapsed = 0;
    reel.startSpeed = 0;
    reel.startPosition = reel.position;
    reel.targetPosition = reel.position;
    renderReel(reel);
  });

  updateWordDisplay(getCurrentWord());
  roundHintEl.textContent =
    "新しい文字盤を用意しました。スピンすると毎回ランダムに文字が入れ替わります。";
  updateControls();
}

function renderReel(reel) {
  const baseIndex = Math.floor(reel.position);
  const offset = reel.position - baseIndex;

  reel.cells.forEach((cell, index) => {
    const symbolIndex = mod(baseIndex + index - 2, reel.symbols.length);
    cell.textContent = reel.symbols[symbolIndex];
    cell.classList.remove("is-center");
  });

  reel.trackEl.style.transform = `translateY(${
    -state.reelCellHeight - offset * state.reelCellHeight
  }px)`;

  syncFocusedCell(reel);
}

function getFocusedCell(reel) {
  if (!reel.focusEl || !reel.cells.length) {
    return null;
  }

  const focusRect = reel.focusEl.getBoundingClientRect();
  const focusCenter = focusRect.top + focusRect.height / 2;

  let bestCell = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  reel.cells.forEach((cell) => {
    const cellRect = cell.getBoundingClientRect();
    const cellCenter = cellRect.top + cellRect.height / 2;
    const distance = Math.abs(cellCenter - focusCenter);

    if (distance < bestDistance) {
      bestCell = cell;
      bestDistance = distance;
    }
  });

  return bestCell;
}

function syncFocusedCell(reel) {
  const focusedCell = getFocusedCell(reel);

  reel.cells.forEach((cell) => {
    cell.classList.toggle("is-center", cell === focusedCell);
  });
}

function getWordsMatchingPrefix(prefix) {
  const matchPrefix = (word) =>
    prefix.every((char, index) => [...word][index] === char);

  const roundMatches = state.roundWords.filter(matchPrefix);
  if (roundMatches.length) {
    return roundMatches;
  }

  return WORD_BANK.filter(matchPrefix);
}

function getPreferredSymbol(index) {
  if (index === 0) {
    return null;
  }

  const prefix = state.reels
    .slice(0, index)
    .map((reel) => (reel.phase === "spinning" ? null : getResolvedSymbol(reel)));

  if (prefix.some((char) => !char)) {
    return null;
  }

  const matches = getWordsMatchingPrefix(prefix);
  if (!matches.length) {
    return null;
  }

  const chosenWord = matches[Math.floor(Math.random() * matches.length)];
  return [...chosenWord][index];
}

function chooseTargetPosition(reel, preferredSymbol) {
  const minimumAhead = 2 + Math.floor(Math.random() * 2);
  const minimumPosition = reel.position + minimumAhead;

  if (preferredSymbol) {
    const candidatePositions = reel.symbols
      .map((symbol, index) => (symbol === preferredSymbol ? index : -1))
      .filter((index) => index >= 0)
      .flatMap((index) => {
        const cycle = Math.floor(reel.position / reel.symbols.length);
        return [cycle, cycle + 1, cycle + 2].map(
          (loop) => index + loop * reel.symbols.length
        );
      })
      .filter((position) => position >= minimumPosition)
      .sort((left, right) => left - right);

    if (candidatePositions.length) {
      return candidatePositions[0];
    }
  }

  return Math.ceil(minimumPosition + Math.random() * 4);
}

function updateControls() {
  const canStopAny = state.reels.some((reel) => reel.phase === "spinning");
  const allStopped = state.reels.every(
    (reel) => reel.phase === "idle" || reel.phase === "stopped"
  );

  spinButton.disabled = state.spinning;
  stopAllButton.disabled = !canStopAny;
  rerollButton.disabled = state.spinning;

  state.reels.forEach((reel) => {
    const canStopThis = reel.phase === "spinning";
    reel.stopButtonEl.disabled = !canStopThis;
    reel.buttonEl.disabled = !canStopThis;
  });

  if (!state.spinning && state.rounds === 0) {
    spinButton.textContent = "スピン";
  } else if (!state.spinning && allStopped) {
    spinButton.textContent = "もう一度スピン";
  } else if (state.spinning) {
    spinButton.textContent = "回転中";
  }
}

function setStatus(tone, label, title, lead) {
  statusBadgeEl.className = `status-badge ${tone}`;
  statusBadgeEl.textContent = label;
  resultTitleEl.textContent = title;
  resultLeadEl.textContent = lead;
}

function renderEmptyState(message) {
  sourceListEl.innerHTML = "";
  const emptyEl = document.createElement("div");
  emptyEl.className = "empty-state";
  emptyEl.textContent = message;
  sourceListEl.append(emptyEl);
}

function renderSources(sources) {
  sourceListEl.innerHTML = "";

  if (!sources.length) {
    renderEmptyState("今回は参照できる解説が見つかりませんでした。");
    return;
  }

  sources.forEach((source) => {
    const cardEl = document.createElement("article");
    cardEl.className = "source-card";

    const headEl = document.createElement("div");
    headEl.className = "source-head";

    const textWrapEl = document.createElement("div");
    const nameEl = document.createElement("span");
    nameEl.className = "source-name";
    nameEl.textContent = source.source;

    const titleEl = document.createElement("h3");
    titleEl.className = "source-title";
    titleEl.textContent = source.title;

    const copyEl = document.createElement("p");
    copyEl.className = "source-copy";
    copyEl.textContent = source.excerpt;

    const linkEl = document.createElement("a");
    linkEl.className = "source-link";
    linkEl.href = source.url;
    linkEl.target = "_blank";
    linkEl.rel = "noreferrer";
    linkEl.textContent = "見る";

    textWrapEl.append(nameEl, titleEl);
    headEl.append(textWrapEl, linkEl);
    cardEl.append(headEl, copyEl);
    sourceListEl.append(cardEl);
  });
}

function startSpin() {
  state.lookupToken += 1;
  state.rounds += 1;
  state.spinning = true;
  prepareRound();

  state.reels.forEach((reel, index) => {
    reel.phase = "spinning";
    reel.speed = BASE_SPIN_SPEED + index * 1.2 + Math.random() * 1.8;
  });

  updateStats();
  updateControls();
  setStatus(
    "loading",
    "回転中",
    "リールを止めよう",
    "左・中央・右の順でも、好きな順でもOKです。止めるたびに中央の文字が決まります。"
  );
  renderEmptyState("判定は3つのリールが止まったあとに表示されます。");

  if (navigator.vibrate) {
    navigator.vibrate(12);
  }
}

function scheduleStop(index) {
  const reel = state.reels[index];

  if (reel.phase !== "spinning") {
    return;
  }

  const preferredSymbol = getPreferredSymbol(index);
  reel.phase = "stopping";
  reel.stopElapsed = 0;
  reel.stopDuration = 0.42 + Math.random() * 0.18;
  reel.startSpeed = reel.speed;
  reel.startPosition = reel.position;
  reel.targetPosition = chooseTargetPosition(reel, preferredSymbol);
  reel.stopButtonEl.disabled = true;
  reel.buttonEl.disabled = true;

  if (navigator.vibrate) {
    navigator.vibrate([10, 18, 10]);
  }
}

function stopReel(index) {
  if (!state.spinning) {
    return;
  }

  scheduleStop(index);
  updateControls();
}

function stopAllReels() {
  if (!state.spinning) {
    return;
  }

  state.reels.forEach((_, index) => scheduleStop(index));
  updateControls();
}

function finishRound() {
  const word = getCurrentWord();
  const token = state.lookupToken;

  updateWordDisplay(word);
  updateControls();
  setStatus(
    "loading",
    "判定中",
    `${word} を確認しています`,
    "Wikipedia と Wiktionary を使って、実在する言葉かどうかを照会しています。"
  );
  renderEmptyState("データを読み込み中です。");

  lookupWord(word)
    .then((result) => {
      if (token !== state.lookupToken) {
        return;
      }

      if (result.isReal) {
        state.hits += 1;
        setStatus(
          "success",
          "ヒット",
          `「${word}」は実在する言葉です`,
          result.lead
        );
      } else if (result.partialError) {
        setStatus(
          "warning",
          "一部未確認",
          `「${word}」は今回の照会では未確認です`,
          result.lead
        );
      } else {
        setStatus(
          "warning",
          "未確認",
          `「${word}」は今回のデータでは見つかりませんでした`,
          result.lead
        );
      }

      updateStats();
      renderSources(result.sources);
      roundHintEl.textContent =
        "次のスピンでは文字盤がまたランダムにリセットされます。";
    })
    .catch(() => {
      if (token !== state.lookupToken) {
        return;
      }

      setStatus(
        "error",
        "通信エラー",
        `「${word}」の確認に失敗しました`,
        "外部データの取得に失敗しました。時間を置いてもう一度スピンしてください。"
      );
      renderEmptyState("通信エラーのため、今回は解説を表示できませんでした。");
    });
}

function easeOutCubic(value) {
  return 1 - (1 - value) ** 3;
}

function animateFrame(timestamp) {
  if (!state.lastTimestamp) {
    state.lastTimestamp = timestamp;
  }

  const delta = Math.min((timestamp - state.lastTimestamp) / 1000, 0.05);
  state.lastTimestamp = timestamp;

  let activeReels = 0;

  state.reels.forEach((reel) => {
    if (reel.phase === "spinning") {
      reel.position += reel.speed * delta;
      activeReels += 1;
    } else if (reel.phase === "stopping") {
      reel.stopElapsed += delta;

      const progress = Math.min(reel.stopElapsed / reel.stopDuration, 1);
      const eased = easeOutCubic(progress);
      reel.position =
        reel.startPosition +
        (reel.targetPosition - reel.startPosition) * eased;
      activeReels += 1;

      if (progress >= 1) {
        reel.phase = "stopped";
        reel.speed = 0;
        reel.position = reel.targetPosition;
      }
    }

    renderReel(reel);
  });

  updateWordDisplay(getCurrentWord());

  if (state.spinning && activeReels === 0) {
    state.spinning = false;
    finishRound();
  }

  requestAnimationFrame(animateFrame);
}

function cleanWikipediaExtract(text) {
  return clipText(compactWhitespace(text.replace(/\([^)]*曖昧さ回避[^)]*\)/g, "")), 128);
}

async function fetchWikipediaEntry(word) {
  const candidates = unique([word, toKatakana(word), normalizeWord(word)]);

  for (const candidate of candidates) {
    const url = new URL("https://ja.wikipedia.org/w/api.php");
    url.searchParams.set("action", "query");
    url.searchParams.set("prop", "extracts");
    url.searchParams.set("exintro", "1");
    url.searchParams.set("explaintext", "1");
    url.searchParams.set("redirects", "1");
    url.searchParams.set("titles", candidate);
    url.searchParams.set("format", "json");
    url.searchParams.set("origin", "*");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Wikipedia request failed");
    }

    const data = await response.json();
    const page = Object.values(data.query.pages)[0];

    if (page && !Object.hasOwn(page, "missing") && page.extract?.trim()) {
      return {
        source: "Wikipedia",
        title: page.title,
        excerpt: cleanWikipediaExtract(page.extract),
        url: `https://ja.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
      };
    }
  }

  return null;
}

function extractWiktionaryDefinition(html, fallbackWord) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc
    .querySelectorAll(
      "script, style, table, figure, audio, sup, .mw-editsection, .noprint, .NavFrame, .thumb"
    )
    .forEach((node) => node.remove());

  const candidates = Array.from(doc.querySelectorAll("ol > li"))
    .map((node) => compactWhitespace(node.textContent))
    .filter((text) => text.length > 0 && !text.includes("翻訳") && !text.includes("類義語"));

  const definition = candidates.find((text) => text.length > 12) || candidates[0] || "";
  const headword = compactWhitespace(
    doc.querySelector("strong.headword")?.textContent || fallbackWord
  );

  if (definition) {
    return clipText(
      definition.startsWith(headword) ? definition : `${headword}: ${definition}`,
      138
    );
  }

  const paragraph = Array.from(doc.querySelectorAll("p"))
    .map((node) => compactWhitespace(node.textContent))
    .find((text) => text.length > 0);

  return paragraph ? clipText(paragraph, 138) : "";
}

async function fetchWiktionaryEntry(word) {
  const candidates = unique([word, normalizeWord(word), toKatakana(word)]);

  for (const candidate of candidates) {
    const queryUrl = new URL("https://ja.wiktionary.org/w/api.php");
    queryUrl.searchParams.set("action", "query");
    queryUrl.searchParams.set("titles", candidate);
    queryUrl.searchParams.set("format", "json");
    queryUrl.searchParams.set("origin", "*");

    const queryResponse = await fetch(queryUrl);
    if (!queryResponse.ok) {
      throw new Error("Wiktionary request failed");
    }

    const queryData = await queryResponse.json();
    const page = Object.values(queryData.query.pages)[0];

    if (!page || Object.hasOwn(page, "missing")) {
      continue;
    }

    const parseUrl = new URL("https://ja.wiktionary.org/w/api.php");
    parseUrl.searchParams.set("action", "parse");
    parseUrl.searchParams.set("page", page.title);
    parseUrl.searchParams.set("prop", "text");
    parseUrl.searchParams.set("format", "json");
    parseUrl.searchParams.set("origin", "*");

    const parseResponse = await fetch(parseUrl);
    if (!parseResponse.ok) {
      throw new Error("Wiktionary parse failed");
    }

    const parseData = await parseResponse.json();
    const excerpt = extractWiktionaryDefinition(parseData.parse.text["*"], page.title);

    return {
      source: "Wiktionary",
      title: page.title,
      excerpt: excerpt || `${page.title} の辞書項目が見つかりました。`,
      url: `https://ja.wiktionary.org/wiki/${encodeURIComponent(page.title)}`,
    };
  }

  return null;
}

async function lookupWord(word) {
  const cacheKey = normalizeWord(word);

  if (!LOOKUP_CACHE.has(cacheKey)) {
    const promise = Promise.allSettled([
      fetchWikipediaEntry(word),
      fetchWiktionaryEntry(word),
    ]).then((results) => {
      const sources = [];
      let errorCount = 0;

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          if (result.value) {
            sources.push(result.value);
          }
        } else {
          errorCount += 1;
        }
      });

      const isReal = sources.length > 0;
      let lead = "";

      if (isReal && sources.length > 1) {
        lead = "百科事典と辞書の両方に一致が見つかりました。意味と背景をあわせて確認できます。";
      } else if (isReal && sources[0].source === "Wiktionary") {
        lead = "辞書データに一致する項目が見つかりました。一般的な語として確認できます。";
      } else if (isReal) {
        lead = "Wikipedia に一致する項目が見つかりました。実在する言葉として扱えそうです。";
      } else if (errorCount > 0) {
        lead =
          "一部のデータ取得に失敗したため、今回は完全には判定できませんでした。別のラウンドで再確認してみてください。";
      } else {
        lead =
          "Wikipedia と Wiktionary を確認しましたが、今回の3文字と一致する項目は見つかりませんでした。造語の可能性があります。";
      }

      return {
        isReal,
        partialError: !isReal && errorCount > 0,
        sources,
        lead,
      };
    });

    LOOKUP_CACHE.set(cacheKey, promise);
  }

  const result = await LOOKUP_CACHE.get(cacheKey);

  if (!result.isReal && result.partialError) {
    LOOKUP_CACHE.delete(cacheKey);
  }

  return result;
}

function bindEvents() {
  spinButton.addEventListener("click", startSpin);
  stopAllButton.addEventListener("click", stopAllReels);
  rerollButton.addEventListener("click", prepareRound);

  state.reels.forEach((reel, index) => {
    reel.stopButtonEl.addEventListener("click", () => stopReel(index));
    reel.buttonEl.addEventListener("click", () => stopReel(index));
  });
}

function init() {
  state.reels = Array.from({ length: REEL_COUNT }, (_, index) => createReel(index));
  updateReelMetrics();
  prepareRound();
  updateStats();
  setStatus(
    "idle",
    "待機中",
    "3文字そろえてことばを作ろう",
    "スピンすると文字盤がランダム更新されます。3つのリールを止めて、できた言葉を判定してみましょう。"
  );
  renderEmptyState("ここに Wikipedia と Wiktionary の解説が表示されます。");
  bindEvents();
  window.addEventListener("resize", updateReelMetrics);
  requestAnimationFrame(animateFrame);
}

init();
