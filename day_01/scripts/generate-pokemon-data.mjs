import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_LIMIT = 251;
const CONCURRENCY = 12;
const ROOT_DIR = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(ROOT_DIR, "..", "data", "pokemon.json");

const TYPE_LABELS = {
  normal: "ノーマル",
  fighting: "かくとう",
  flying: "ひこう",
  poison: "どく",
  ground: "じめん",
  rock: "いわ",
  bug: "むし",
  ghost: "ゴースト",
  steel: "はがね",
  fire: "ほのお",
  water: "みず",
  grass: "くさ",
  electric: "でんき",
  psychic: "エスパー",
  ice: "こおり",
  dragon: "ドラゴン",
  dark: "あく",
  fairy: "フェアリー",
};

const SMALL_KANA_MAP = {
  ァ: "ア",
  ィ: "イ",
  ゥ: "ウ",
  ェ: "エ",
  ォ: "オ",
  ャ: "ヤ",
  ュ: "ユ",
  ョ: "ヨ",
  ッ: "ツ",
  ヮ: "ワ",
  ヵ: "カ",
  ヶ: "ケ",
};

function pickJapaneseEntry(entries, valueKey) {
  return (
    entries.find((entry) => entry.language.name === "ja")?.[valueKey] ??
    entries.find((entry) => entry.language.name === "ja-Hrkt")?.[valueKey] ??
    entries.find((entry) => entry.language.name === "ja-hrkt")?.[valueKey] ??
    null
  );
}

function cleanFlavorText(text) {
  return text.replace(/[\n\f\r]+/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeKanaChar(char) {
  return SMALL_KANA_MAP[char] ?? char;
}

function toShiritoriSequence(name) {
  return [...name.replace(/[・\s]/g, "")].map(normalizeKanaChar);
}

function getFirstSound(name) {
  const sequence = toShiritoriSequence(name);
  return sequence[0] ?? "";
}

function getLastSound(name) {
  const sequence = toShiritoriSequence(name);

  if (!sequence.length) {
    return "";
  }

  let cursor = sequence.length - 1;

  while (cursor > 0 && sequence[cursor] === "ー") {
    cursor -= 1;
  }

  return sequence[cursor] ?? "";
}

function isShiritoriEligible(name) {
  return /^[ァ-ヶー]+$/.test(name) && getLastSound(name) !== "ン";
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.json();
}

async function mapWithConcurrency(items, mapper, concurrency) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );

  return results;
}

async function fetchPokemonRecord(id) {
  const [pokemon, species] = await Promise.all([
    fetchJson(`https://pokeapi.co/api/v2/pokemon/${id}`),
    fetchJson(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
  ]);

  const japaneseName = pickJapaneseEntry(species.names, "name");

  if (!japaneseName) {
    throw new Error(`Japanese name is missing for pokemon id ${id}`);
  }

  const category = pickJapaneseEntry(species.genera, "genus") ?? "";
  const flavorText =
    cleanFlavorText(pickJapaneseEntry(species.flavor_text_entries, "flavor_text") ?? "");
  const types = pokemon.types.map(({ type }) => ({
    key: type.name,
    label: TYPE_LABELS[type.name] ?? type.name,
  }));

  return {
    id: pokemon.id,
    dex: String(pokemon.id).padStart(3, "0"),
    slug: pokemon.name,
    name: japaneseName,
    category,
    flavorText,
    image:
      pokemon.sprites.other?.home?.front_default ??
      pokemon.sprites.other?.["official-artwork"]?.front_default ??
      pokemon.sprites.front_default ??
      "",
    sprite:
      pokemon.sprites.front_default ??
      pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.front_default ??
      "",
    cry: pokemon.cries?.latest ?? pokemon.cries?.legacy ?? "",
    heightM: Number((pokemon.height / 10).toFixed(1)),
    weightKg: Number((pokemon.weight / 10).toFixed(1)),
    types,
    primaryType: types[0]?.label ?? "",
    shiritori: {
      first: getFirstSound(japaneseName),
      last: getLastSound(japaneseName),
      eligible: isShiritoriEligible(japaneseName),
    },
  };
}

async function main() {
  const rawLimit = process.argv[2];
  const limit = Number(rawLimit ?? DEFAULT_LIMIT);

  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error("Limit must be a positive integer.");
  }

  const ids = Array.from({ length: limit }, (_, index) => index + 1);
  const pokemon = await mapWithConcurrency(ids, fetchPokemonRecord, CONCURRENCY);

  await mkdir(join(ROOT_DIR, "..", "data"), { recursive: true });
  await writeFile(
    OUTPUT_PATH,
    `${JSON.stringify(
      {
        source: "PokeAPI",
        generatedAt: new Date().toISOString(),
        limit,
        pokemon,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`Saved ${pokemon.length} pokemon records to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
