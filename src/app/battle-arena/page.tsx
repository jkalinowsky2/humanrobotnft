import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import BattleArenaClient, { type ArenaFighter, type CardType } from "./BattleArenaClient";

type BattleStatsFile = {
  card_type?: string;
  traits_used?: Record<string, string>;
  stats?: {
    attack?: number;
    defense?: number;
    magic?: number;
    speed?: number;
    special?: number;
  };
};

const fighterOverrides: Record<number, Partial<ArenaFighter>> = {
  0: {
    name: "Dark King",
    className: "Genesis Frame",
    status: "Preview",
    specialMove: "Foil Cascade",
    trait: "Prime Shell",
  },
  1: {
    name: "Soulwatcher",
    className: "Frontline Breaker",
    status: "Minted",
    specialMove: "EMP Halo",
    trait: "Arc Core",
  },
};

const mintedRoster = [
  "Moonbirds // allied unit access",
  "Mythics // adaptive battlefield logic",
  "Oddities // anomaly support",
  "NightGlyders // airstrike class",
  "Trenchers // subterranean defense",
  "Gobs // chaos amplification",
];

function normalizeCardType(cardType?: string): CardType {
  if (cardType === "Foil" || cardType === "Holographic" || cardType === "Edition") {
    return cardType;
  }

  if (cardType === "Holo") {
    return "Holographic";
  }

  return "Base";
}

function formatTokenName(tokenId: number): string {
  return `Unit ${String(tokenId).padStart(3, "0")}`;
}

function buildDefaultFighter(tokenId: number, cardType: CardType, stats?: BattleStatsFile["stats"], trait = "Unknown"): ArenaFighter {
  return {
    tokenId,
    id: `HR-${String(tokenId).padStart(3, "0")}`,
    name: formatTokenName(tokenId),
    className: "Pending Mint",
    status: "Minted",
    cardType,
    attack: stats?.attack ?? 0,
    defense: stats?.defense ?? 0,
    magic: stats?.magic ?? 0,
    speed: stats?.speed ?? 0,
    special: stats?.special ?? 0,
    specialMove: "No special loaded",
    trait,
    art: "/cards/0_card.png",
  };
}

async function loadArenaFighters(): Promise<ArenaFighter[]> {
  const battlestatsDir = path.join(process.cwd(), "src/app/battle-arena/battlestats");
  const cardsDir = path.join(process.cwd(), "public/cards");

  const [statFiles, cardFiles] = await Promise.all([
    readdir(battlestatsDir),
    readdir(cardsDir),
  ]);

  const availableCards = new Set(cardFiles);

  const fighters = await Promise.all(
    statFiles
      .filter((file) => /^\d+_battlestats\.json$/.test(file))
      .map(async (file) => {
        const tokenId = Number.parseInt(file, 10);
        const jsonPath = path.join(battlestatsDir, file);
        const raw = await readFile(jsonPath, "utf8");
        const parsed = JSON.parse(raw) as BattleStatsFile;
        const cardType = normalizeCardType(parsed.card_type);
        const derivedTrait = parsed.traits_used?.weapon ?? parsed.traits_used?.background ?? "Unknown";
        const base = buildDefaultFighter(tokenId, cardType, parsed.stats, derivedTrait);
        const override = fighterOverrides[tokenId] ?? {};
        const artFilename = `${tokenId}_card.png`;

        return {
          ...base,
          ...override,
          art: availableCards.has(artFilename) ? `/cards/${artFilename}` : base.art,
        } satisfies ArenaFighter;
      })
  );

  return fighters.sort((a, b) => a.tokenId - b.tokenId);
}

export default async function BattleArenaPage() {
  const arenaFighters = await loadArenaFighters();

  return <BattleArenaClient arenaFighters={arenaFighters} mintedRoster={mintedRoster} />;
}
