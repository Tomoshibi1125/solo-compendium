/**
 * Full Rift Generator — produces a complete Warden-ready adventure packet.
 *
 * This module is deterministic and works offline without any AI calls.
 * AI enhancement is applied *after* generation by the UI layer.
 */

import {
	GATE_HAZARDS,
	GATE_REWARDS,
	RIFT_BIOMES,
	RIFT_BOSS_TYPES,
	RIFT_COMPLICATIONS,
	RIFT_THEMES,
	TREASURE_TIERS,
	WARDEN_RANKS,
	type WardenEventTableEntry,
	WORLD_EVENTS,
	EVENT_COMPLICATIONS,
} from "@/data/wardenGeneratorContent";
import { getCRXP } from "@/lib/experience";
import { generateTreasure, type TreasureResult } from "@/lib/treasureGenerator";
import { formatRegentVernacular } from "@/lib/vernacular";
import {
	loadWardenGenerationContext,
	rankToTreasureRarities,
	type WardenLinkedEntry,
} from "@/lib/wardenGenerationContext";

// ──────────────────────────────────────────────
//  Types
// ──────────────────────────────────────────────

/** Rank-to-level mapping for XP and CR budgets */
const RANK_LEVEL_RANGE: Record<string, { min: number; max: number }> = {
	E: { min: 1, max: 3 },
	D: { min: 2, max: 6 },
	C: { min: 5, max: 10 },
	B: { min: 9, max: 14 },
	A: { min: 13, max: 18 },
	S: { min: 17, max: 20 },
};

/** CR strings appropriate per rank */
const RANK_CR_BUDGET: Record<string, { minion: string; elite: string; boss: string }> = {
	E: { minion: "1/4", elite: "1", boss: "2" },
	D: { minion: "1/2", elite: "2", boss: "4" },
	C: { minion: "1", elite: "4", boss: "7" },
	B: { minion: "3", elite: "7", boss: "11" },
	A: { minion: "5", elite: "11", boss: "16" },
	S: { minion: "8", elite: "16", boss: "22" },
};

/** Room count scaling by rank */
const RANK_ROOM_COUNT: Record<string, number> = {
	E: 5,
	D: 6,
	C: 8,
	B: 9,
	A: 10,
	S: 12,
};

/** Encounter count scaling by rank */
const RANK_ENCOUNTER_COUNT: Record<string, number> = {
	E: 2,
	D: 3,
	C: 4,
	B: 5,
	A: 6,
	S: 7,
};

/** Hazard count scaling by rank */
const RANK_HAZARD_COUNT: Record<string, number> = {
	E: 1,
	D: 2,
	C: 3,
	B: 3,
	A: 4,
	S: 5,
};

export interface RiftEncounter {
	id: string;
	roomId: string;
	name: string;
	cr: string;
	role: "minion" | "elite" | "boss";
	count: number;
	xpEach: number;
	xpTotal: number;
	linkedEntry: WardenLinkedEntry | null;
	tactics: string;
}

export interface RiftHazard {
	id: string;
	roomId: string;
	name: string;
	dc: number;
	damage: string;
	trigger: string;
	effect: string;
	linkedEntry: WardenLinkedEntry | null;
}

export interface RiftRoomKey {
	roomId: string;
	label: string;
	type: string;
	readAloud: string;
	description: string;
	encounter: RiftEncounter | null;
	hazard: RiftHazard | null;
	loot: string[];
	lore: string | null;
	linkedEntries: WardenLinkedEntry[];
}

export interface RiftObjective {
	primary: string;
	secondary: string[];
	failureCondition: string;
}

export interface RiftRewards {
	totalXP: number;
	treasure: TreasureResult | null;
	bonusRewards: string[];
}

export interface GeneratedRiftPacket {
	id: string;
	generatedAt: number;
	seed: number;

	// Core identity
	rank: string;
	theme: string;
	biome: string;
	boss: string;
	complications: string[];

	// Narrative
	description: string;
	overview: string;
	readAloudEntry: string;

	// Structured content
	objective: RiftObjective;
	roomKeys: RiftRoomKey[];
	encounters: RiftEncounter[];
	hazards: RiftHazard[];
	rewards: RiftRewards;
	loreNotes: string[];
	wardenTips: string[];

	// Linked compendium content (for cross-referencing)
	linkedContent: {
		boss: WardenLinkedEntry | null;
		encounters: WardenLinkedEntry[];
		hazards: WardenLinkedEntry[];
		loot: WardenLinkedEntry[];
		lore: WardenLinkedEntry[];
	};

	// Map generation parameters (consumed by DungeonMapGenerator)
	mapParams: {
		width: number;
		height: number;
		roomCount: number;
		treasureRooms: number;
		trapRooms: number;
		puzzleRooms: number;
		secretRooms: number;
	};

	// AI enhancement slots (populated after generation by UI)
	aiEnhanced?: {
		overview?: string;
		rooms?: string;
		encounters?: string;
		hazards?: string;
	};
}

// ──────────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────────

function pick<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
	const pool = [...arr];
	const result: T[] = [];
	while (pool.length > 0 && result.length < n) {
		const idx = Math.floor(Math.random() * pool.length);
		result.push(pool.splice(idx, 1)[0]);
	}
	return result;
}

function generateId(): string {
	return `rift-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function rankDC(rank: string): number {
	const dcs: Record<string, number> = {
		E: 10,
		D: 12,
		C: 14,
		B: 16,
		A: 18,
		S: 20,
	};
	return dcs[rank] ?? 13;
}

function rankDamage(rank: string): string {
	const dmg: Record<string, string> = {
		E: "1d6",
		D: "2d6",
		C: "3d6",
		B: "4d8",
		A: "6d8",
		S: "8d10",
	};
	return dmg[rank] ?? "2d6";
}

// ──────────────────────────────────────────────
//  Room type assignment
// ──────────────────────────────────────────────

type RoomType = "entrance" | "boss" | "treasure" | "trap" | "puzzle" | "secret" | "room";

function assignRoomTypes(roomCount: number, rank: string): RoomType[] {
	const types: RoomType[] = new Array(roomCount).fill("room");
	types[0] = "entrance";
	types[roomCount - 1] = "boss";

	const treasureCount = rank === "S" || rank === "A" ? 2 : 1;
	const trapCount = Math.min(2, Math.floor((roomCount - 2) / 3));
	const puzzleCount = roomCount >= 8 ? 1 : 0;
	const secretCount = roomCount >= 7 ? 1 : 0;

	const specialQueue: RoomType[] = [
		...Array.from({ length: treasureCount }, () => "treasure" as const),
		...Array.from({ length: trapCount }, () => "trap" as const),
		...Array.from({ length: puzzleCount }, () => "puzzle" as const),
		...Array.from({ length: secretCount }, () => "secret" as const),
	];

	// Assign specials to middle rooms (skip entrance=0 and boss=last)
	const availableIndices = Array.from(
		{ length: roomCount - 2 },
		(_, i) => i + 1,
	).sort(() => Math.random() - 0.5);

	for (const special of specialQueue) {
		const idx = availableIndices.shift();
		if (idx !== undefined) {
			types[idx] = special;
		}
	}

	return types;
}

// ──────────────────────────────────────────────
//  Read-aloud and description generators
// ──────────────────────────────────────────────

function generateReadAloud(biome: string, theme: string, rank: string): string {
	const intensity: Record<string, string> = {
		E: "faint",
		D: "low",
		C: "pulsing",
		B: "intense",
		A: "overwhelming",
		S: "reality-shattering",
	};
	return `The air shimmers and tears apart, revealing the ${intensity[rank] ?? "pulsing"} maw of a Rift. Beyond the threshold lies ${biome}, warped by the influence of the ${theme}. Mana crackles along the edges of the breach, and the atmosphere beyond feels heavy, charged with the promise of danger and power. The Rift pulses steadily—it will not remain open forever.`;
}

function generateRoomReadAloud(
	roomType: RoomType,
	biome: string,
	theme: string,
): string {
	const descriptions: Record<string, string> = {
		entrance: `You step through the breach into a transitional space. The ${biome} landscape stretches before you, twisted by ${theme} energy. The way forward narrows into worked stone.`,
		boss: `This vast chamber thrums with concentrated power. The ${theme} energy coalesces here, and the air itself feels hostile. Something ancient and powerful awaits.`,
		treasure: `Glinting surfaces catch your eye. Among the ${biome} terrain, a cache of resources lies partially concealed—whether left as bait or simply forgotten remains unclear.`,
		trap: `Something feels wrong. The corridor ahead seems too still, the surfaces too deliberate. The ${theme} energy here has been weaponized.`,
		puzzle: `The path forward is blocked by an intricate mechanism. Symbols associated with the ${theme} are etched into its surface, clearly requiring careful interaction.`,
		secret: `A concealed passage reveals a hidden alcove. The ${biome} formations here look natural, but the space was clearly shaped with purpose.`,
		room: `Another chamber of the Rift unfolds before you, shaped by ${biome} terrain and suffused with ${theme} resonance.`,
	};
	return descriptions[roomType] ?? descriptions.room;
}

function generateRoomDescription(
	roomType: RoomType,
	index: number,
	rank: string,
	biome: string,
): string {
	const size = index === 0 ? "30 × 30 ft" : `${20 + index * 5} × ${20 + index * 5} ft`;
	const features: Record<string, string> = {
		entrance: `${size}. Entry point with clear sight lines. Rift energy emanates from the threshold behind the party. One exit leading deeper.`,
		boss: `${size}. Open arena with environmental features suitable for ${rank}-Rank combat. Elevated terrain or cover at edges. Boss positioning at center or far end.`,
		treasure: `${size}. Resource cache positioned against far wall. ${rank === "S" || rank === "A" ? "Warded with protective sigils." : "Minor traps may protect contents."}`,
		trap: `${size}. Concealed pressure plates or tripwires. Trigger zone covers primary path. DC ${rankDC(rank)} to detect, ${rankDamage(rank)} damage on trigger.`,
		puzzle: `${size}. Interactive mechanism dominates center. Requires DC ${rankDC(rank)} Investigation or Arcana check to solve. Failure triggers minor hazard.`,
		secret: `${size}. Concealed behind DC ${rankDC(rank) + 2} Perception check. Contains bonus loot or lore relevant to the ${biome} setting.`,
		room: `${size}. Standard Rift chamber. ${biome} terrain features provide half cover in 2-3 positions. One or two exits.`,
	};
	return features[roomType] ?? features.room;
}

// ──────────────────────────────────────────────
//  Encounter generator
// ──────────────────────────────────────────────

function buildEncounters(
	roomTypes: RoomType[],
	rank: string,
	boss: WardenLinkedEntry | null,
	encounterEntries: WardenLinkedEntry[],
): RiftEncounter[] {
	const budget = RANK_CR_BUDGET[rank] ?? RANK_CR_BUDGET.C;
	const encounters: RiftEncounter[] = [];
	let entryIdx = 0;

	for (let i = 0; i < roomTypes.length; i++) {
		const type = roomTypes[i];
		if (type === "boss") {
			const bossXP = getCRXP(budget.boss);
			encounters.push({
				id: `enc-${i}`,
				roomId: `room-${i}`,
				name: boss?.name ?? pick(RIFT_BOSS_TYPES),
				cr: budget.boss,
				role: "boss",
				count: 1,
				xpEach: bossXP,
				xpTotal: bossXP,
				linkedEntry: boss,
				tactics: `Uses lair actions on initiative count 20. Focuses ranged attackers first. Attempts to isolate weakest party member. Retreats at 25% HP to trigger final phase.`,
			});
		} else if (type === "room" || type === "entrance") {
			// Only some generic rooms get encounters
			const encounterCount = RANK_ENCOUNTER_COUNT[rank] ?? 3;
			const roomEncounterChance = type === "entrance" ? 0.3 : 0.6;
			if (encounters.filter((e) => e.role !== "boss").length < encounterCount && Math.random() < roomEncounterChance) {
				const role = Math.random() < 0.3 ? "elite" : "minion";
				const cr = role === "elite" ? budget.elite : budget.minion;
				const count = role === "elite" ? 1 : Math.floor(Math.random() * 2) + 2;
				const xpEach = getCRXP(cr);
				const linked = encounterEntries[entryIdx % Math.max(1, encounterEntries.length)] ?? null;
				entryIdx++;
				encounters.push({
					id: `enc-${i}`,
					roomId: `room-${i}`,
					name: linked?.name ?? `${rank}-Rank Anomaly`,
					cr,
					role,
					count,
					xpEach,
					xpTotal: xpEach * count,
					linkedEntry: linked,
					tactics: role === "elite"
						? `Fights defensively, using terrain for advantage. Calls for reinforcements if reduced below 50% HP.`
						: `Attacks in groups, attempting to flank. Retreats if more than half are defeated.`,
				});
			}
		}
	}

	return encounters;
}

// ──────────────────────────────────────────────
//  Hazard generator
// ──────────────────────────────────────────────

function buildHazards(
	roomTypes: RoomType[],
	rank: string,
	hazardEntries: WardenLinkedEntry[],
): RiftHazard[] {
	const hazards: RiftHazard[] = [];
	const maxHazards = RANK_HAZARD_COUNT[rank] ?? 2;
	let entryIdx = 0;

	for (let i = 0; i < roomTypes.length; i++) {
		if (hazards.length >= maxHazards) break;
		const type = roomTypes[i];
		if (type === "trap" || (type === "room" && Math.random() < 0.3)) {
			const linked = hazardEntries[entryIdx % Math.max(1, hazardEntries.length)] ?? null;
			entryIdx++;
			const hazardName = linked?.name ?? pick(GATE_HAZARDS);
			hazards.push({
				id: `haz-${i}`,
				roomId: `room-${i}`,
				name: hazardName,
				dc: rankDC(rank),
				damage: rankDamage(rank),
				trigger: type === "trap"
					? "Pressure plate or tripwire activated when a creature enters the trigger zone."
					: "Proximity trigger — activates when a creature moves within 10 ft.",
				effect: `${hazardName}. DC ${rankDC(rank)} Agility save or take ${rankDamage(rank)} damage. On success, half damage.`,
				linkedEntry: linked,
			});
		}
	}

	return hazards;
}

// ──────────────────────────────────────────────
//  Room key builder
// ──────────────────────────────────────────────

function buildRoomKeys(
	roomTypes: RoomType[],
	rank: string,
	biome: string,
	theme: string,
	encounters: RiftEncounter[],
	hazards: RiftHazard[],
	lootEntries: WardenLinkedEntry[],
	loreEntries: WardenLinkedEntry[],
): RiftRoomKey[] {
	const encounterByRoom = new Map(encounters.map((e) => [e.roomId, e]));
	const hazardByRoom = new Map(hazards.map((h) => [h.roomId, h]));
	let lootIdx = 0;
	let loreIdx = 0;

	return roomTypes.map((type, i) => {
		const roomId = `room-${i}`;
		const encounter = encounterByRoom.get(roomId) ?? null;
		const hazard = hazardByRoom.get(roomId) ?? null;

		const roomLoot: string[] = [];
		const linkedEntries: WardenLinkedEntry[] = [];
		if (type === "treasure" || type === "secret" || type === "boss") {
			const lootEntry = lootEntries[lootIdx % Math.max(1, lootEntries.length)];
			if (lootEntry) {
				roomLoot.push(lootEntry.name);
				linkedEntries.push(lootEntry);
			}
			lootIdx++;
		}

		let lore: string | null = null;
		if (type === "puzzle" || type === "secret" || type === "entrance") {
			const loreEntry = loreEntries[loreIdx % Math.max(1, loreEntries.length)];
			if (loreEntry) {
				lore = loreEntry.name;
				linkedEntries.push(loreEntry);
			}
			loreIdx++;
		}

		if (encounter?.linkedEntry) linkedEntries.push(encounter.linkedEntry);
		if (hazard?.linkedEntry) linkedEntries.push(hazard.linkedEntry);

		const label =
			type === "entrance" ? "Entrance" :
			type === "boss" ? "Boss Chamber" :
			type === "treasure" ? "Treasure Room" :
			type === "trap" ? "Trap Room" :
			type === "puzzle" ? "Puzzle Room" :
			type === "secret" ? "Secret Room" :
			`Room ${i + 1}`;

		return {
			roomId,
			label,
			type,
			readAloud: generateRoomReadAloud(type, biome, theme),
			description: generateRoomDescription(type, i, rank, biome),
			encounter,
			hazard,
			loot: roomLoot,
			lore,
			linkedEntries,
		};
	});
}

// ──────────────────────────────────────────────
//  Objective generator
// ──────────────────────────────────────────────

function generateObjective(rank: string, boss: string, theme: string): RiftObjective {
	const primaries = [
		`Defeat ${boss} and extract the Rift Core before the breach destabilizes.`,
		`Neutralize ${boss} and secure the ${theme} nexus point.`,
		`Clear all hostile anomalies and collapse the Rift from within.`,
	];
	const secondaries = [
		"Recover all treasure caches within the Rift.",
		"Discover the source of the Rift's formation.",
		"Rescue any trapped civilians or operatives.",
		"Map the complete Rift layout for Council records.",
		"Collect anomaly core samples for research.",
	];

	return {
		primary: pick(primaries),
		secondary: pickN(secondaries, rank === "S" || rank === "A" ? 3 : 2),
		failureCondition: `The Rift collapses if the party retreats past the entrance after combat begins, or if ${boss} completes its ritual (${RANK_LEVEL_RANGE[rank]?.max ?? 10} rounds after detection).`,
	};
}

// ──────────────────────────────────────────────
//  Warden tips
// ──────────────────────────────────────────────

function generateWardenTips(rank: string, encounters: RiftEncounter[], hazards: RiftHazard[]): string[] {
	const tips = [
		`This Rift is calibrated for ${rank}-Rank Ascendants (levels ${RANK_LEVEL_RANGE[rank]?.min ?? 1}–${RANK_LEVEL_RANGE[rank]?.max ?? 5}). Adjust encounter counts if the party is stronger or weaker.`,
		`Total encounter XP: ${encounters.reduce((sum, e) => sum + e.xpTotal, 0).toLocaleString()}. Distribute short rests between the ${encounters.length} encounters as appropriate.`,
	];

	if (hazards.length > 0) {
		tips.push(
			`${hazards.length} hazard(s) present. Consider allowing Perception checks (DC ${rankDC(rank) - 2}) when entering hazard rooms to give players a chance to notice.`,
		);
	}

	if (rank === "A" || rank === "S") {
		tips.push(
			"High-rank Rifts should feel oppressive. Use environmental effects (dim light, difficult terrain, ambient damage) to maintain tension between encounters.",
		);
	}

	tips.push(
		"If using the VTT, place tokens for each encounter and pre-draw hazard zones before the session. Use fog of war to reveal rooms as the party explores.",
	);

	return tips;
}

// ──────────────────────────────────────────────
//  Lore notes
// ──────────────────────────────────────────────

function generateLoreNotes(theme: string, biome: string, rank: string, loreEntries: WardenLinkedEntry[]): string[] {
	const notes: string[] = [
		`This Rift manifests within the ${theme}, an area classified as ${rank}-Rank by the Awakened Council. The terrain presents as ${biome}, though the actual topography is a construct of the Rift's mana signature.`,
	];

	if (loreEntries.length > 0) {
		notes.push(
			`Related lore entries: ${loreEntries.map((e) => e.name).join(", ")}. These can be discovered through Investigation checks or by interacting with environmental storytelling elements.`,
		);
	}

	const event = pick(WORLD_EVENTS);
	notes.push(`Possible world event tie-in: ${event.description} (${event.impact})`);

	return notes;
}

// ──────────────────────────────────────────────
//  Map parameter calculation
// ──────────────────────────────────────────────

function calculateMapParams(rank: string, roomCount: number, roomTypes: RoomType[]) {
	const gridSize = Math.max(20, 15 + roomCount * 2);
	return {
		width: gridSize,
		height: gridSize,
		roomCount,
		treasureRooms: roomTypes.filter((t) => t === "treasure").length,
		trapRooms: roomTypes.filter((t) => t === "trap").length,
		puzzleRooms: roomTypes.filter((t) => t === "puzzle").length,
		secretRooms: roomTypes.filter((t) => t === "secret").length,
	};
}

// ──────────────────────────────────────────────
//  Main generation function
// ──────────────────────────────────────────────

export async function generateFullRift(
	selectedRank?: string,
): Promise<GeneratedRiftPacket> {
	const seed = Date.now();
	const rank = selectedRank || pick(WARDEN_RANKS);
	const theme = formatRegentVernacular(pick(RIFT_THEMES));
	const biome = pick(RIFT_BIOMES);
	const bossType = formatRegentVernacular(pick(RIFT_BOSS_TYPES));
	const numComplications = Math.floor(Math.random() * 3) + 1;
	const complications = [
		...new Set(
			Array.from({ length: numComplications }, () => pick(RIFT_COMPLICATIONS)),
		),
	].map(formatRegentVernacular);

	// Load compendium context
	const generationContext = await loadWardenGenerationContext({
		types: [
			"anomalies",
			"conditions",
			"equipment",
			"items",
			"relics",
			"runes",
			"sigils",
			"artifacts",
			"locations",
			"regents",
			"rollable-tables",
		],
	});

	// Pick linked content
	const boss =
		generationContext.pickOne("anomalies", { rank, bossOnly: true }) ||
		generationContext.pickOne("anomalies", { rank });
	const encounterEntries = generationContext.pickMany("anomalies", 6, {
		rank,
		theme,
		biome,
	});
	const hazardEntries = generationContext.pickMany("conditions", 4, {
		theme,
		biome,
	});
	const treasureRarities = rankToTreasureRarities(rank);
	const lootEntries = [
		...generationContext.pickMany("equipment", 2, { rank, rarities: treasureRarities }),
		...generationContext.pickMany("items", 2, { rarities: treasureRarities }),
		...generationContext.pickMany("relics", 1, { rank, rarities: treasureRarities }),
		...generationContext.pickMany("runes", 1, { rank }),
		...generationContext.pickMany("sigils", 1, { rank }),
		...generationContext.pickMany("artifacts", 1, { rank, rarities: treasureRarities }),
	].slice(0, 8);
	const loreEntries = [
		...generationContext.pickMany("locations", 2, { theme, biome }),
		...generationContext.pickMany("regents", 1, { theme }),
		...generationContext.pickMany("rollable-tables", 1, { theme }),
	];

	// Build structured content
	const roomCount = RANK_ROOM_COUNT[rank] ?? 7;
	const roomTypes = assignRoomTypes(roomCount, rank);

	const bossName = boss?.name ?? bossType;
	const encounters = buildEncounters(roomTypes, rank, boss, encounterEntries);
	const hazards = buildHazards(roomTypes, rank, hazardEntries);
	const roomKeys = buildRoomKeys(
		roomTypes,
		rank,
		biome,
		theme,
		encounters,
		hazards,
		lootEntries,
		loreEntries,
	);

	const totalXP = encounters.reduce((sum, e) => sum + e.xpTotal, 0);

	// Generate treasure
	let treasure: TreasureResult | null = null;
	try {
		treasure = await generateTreasure(rank);
	} catch {
		// Treasure generation may fail if compendium entries are sparse — degrade gracefully
	}

	const bonusRewards = pickN(GATE_REWARDS, 2).map(String);
	const objective = generateObjective(rank, bossName, theme);

	const description = formatRegentVernacular(
		`A ${rank}-Rank Rift manifesting as ${biome} within the ${theme}. The Rift's core is protected by ${bossName}. ${complications.length > 0 ? `Complications: ${complications.join(", ")}.` : ""}`,
	);

	const overview = [
		description,
		`This Rift contains ${roomCount} keyed areas, ${encounters.length} encounter(s), and ${hazards.length} hazard(s).`,
		`Primary objective: ${objective.primary}`,
		`Total encounter XP: ${totalXP.toLocaleString()}.`,
		encounters.length > 0
			? `Notable combatants: ${encounters.map((e) => `${e.name} (CR ${e.cr})`).join(", ")}.`
			: "",
		lootEntries.length > 0
			? `Indexed rewards: ${lootEntries.map((e) => e.name).join(", ")}.`
			: "",
	]
		.filter(Boolean)
		.join(" ");

	const readAloudEntry = generateReadAloud(biome, theme, rank);
	const loreNotes = generateLoreNotes(theme, biome, rank, loreEntries);
	const wardenTips = generateWardenTips(rank, encounters, hazards);
	const mapParams = calculateMapParams(rank, roomCount, roomTypes);

	return {
		id: generateId(),
		generatedAt: Date.now(),
		seed,
		rank,
		theme,
		biome,
		boss: bossName,
		complications,
		description,
		overview,
		readAloudEntry,
		objective,
		roomKeys,
		encounters,
		hazards,
		rewards: {
			totalXP,
			treasure,
			bonusRewards,
		},
		loreNotes,
		wardenTips,
		linkedContent: {
			boss,
			encounters: encounterEntries,
			hazards: hazardEntries,
			loot: lootEntries,
			lore: loreEntries,
		},
		mapParams,
	};
}

// ──────────────────────────────────────────────
//  Serialization helpers for the legacy GeneratedRift interface
// ──────────────────────────────────────────────

/** Convert a full packet to the legacy GeneratedRift shape used by the DungeonMapGenerator */
export function packetToLegacyRift(packet: GeneratedRiftPacket) {
	return {
		rank: packet.rank,
		theme: packet.theme,
		biome: packet.biome,
		boss: packet.boss,
		complications: packet.complications,
		hazards: packet.hazards.map((h) => h.name),
		rewards: packet.linkedContent.loot.map((e) => e.name),
		linkedContent: packet.linkedContent,
		description: packet.description,
	};
}

/** Serialize a full packet to a Warden-ready text dossier */
export function packetToTextDossier(packet: GeneratedRiftPacket): string {
	const lines: string[] = [];

	lines.push(`═══ ${packet.rank}-RANK RIFT DOSSIER ═══`);
	lines.push("");
	lines.push(`Theme: ${packet.theme}`);
	lines.push(`Biome: ${packet.biome}`);
	lines.push(`Boss: ${packet.boss}`);
	lines.push(`Complications: ${packet.complications.join(", ") || "None"}`);
	lines.push("");

	lines.push("── OVERVIEW ──");
	lines.push(packet.overview);
	lines.push("");

	lines.push("── READ-ALOUD ENTRY ──");
	lines.push(`"${packet.readAloudEntry}"`);
	lines.push("");

	lines.push("── OBJECTIVE ──");
	lines.push(`Primary: ${packet.objective.primary}`);
	for (const sec of packet.objective.secondary) {
		lines.push(`  • ${sec}`);
	}
	lines.push(`Failure: ${packet.objective.failureCondition}`);
	lines.push("");

	lines.push("── KEYED AREAS ──");
	for (const room of packet.roomKeys) {
		lines.push(`[${room.label}] (${room.type})`);
		lines.push(`  Read-Aloud: "${room.readAloud}"`);
		lines.push(`  ${room.description}`);
		if (room.encounter) {
			lines.push(`  Encounter: ${room.encounter.name} (CR ${room.encounter.cr}, ×${room.encounter.count}) — ${room.encounter.tactics}`);
		}
		if (room.hazard) {
			lines.push(`  Hazard: ${room.hazard.name} — ${room.hazard.effect}`);
		}
		if (room.loot.length > 0) {
			lines.push(`  Loot: ${room.loot.join(", ")}`);
		}
		if (room.lore) {
			lines.push(`  Lore: ${room.lore}`);
		}
		lines.push("");
	}

	lines.push("── ENCOUNTERS ──");
	for (const enc of packet.encounters) {
		lines.push(`• ${enc.name} (CR ${enc.cr}, ${enc.role}, ×${enc.count}) — ${enc.xpTotal} XP`);
		lines.push(`  Tactics: ${enc.tactics}`);
	}
	lines.push(`Total Encounter XP: ${packet.rewards.totalXP.toLocaleString()}`);
	lines.push("");

	lines.push("── HAZARDS ──");
	if (packet.hazards.length === 0) {
		lines.push("None");
	} else {
		for (const haz of packet.hazards) {
			lines.push(`• ${haz.name} — DC ${haz.dc}, ${haz.damage} damage`);
			lines.push(`  Trigger: ${haz.trigger}`);
			lines.push(`  Effect: ${haz.effect}`);
		}
	}
	lines.push("");

	lines.push("── REWARDS ──");
	lines.push(`XP: ${packet.rewards.totalXP.toLocaleString()}`);
	if (packet.rewards.treasure) {
		const t = packet.rewards.treasure;
		const currency = [
			t.hundreds > 0 ? `$${t.hundreds * 100}` : "",
			t.tens > 0 ? `$${t.tens * 10}` : "",
		].filter(Boolean).join(" + ");
		if (currency) lines.push(`Currency: ${currency}`);
		if (t.items.length > 0) lines.push(`Items: ${t.items.join(", ")}`);
		if (t.relics.length > 0) lines.push(`Relics: ${t.relics.join(", ")}`);
		if (t.materials.length > 0) lines.push(`Materials: ${t.materials.join(", ")}`);
	}
	if (packet.rewards.bonusRewards.length > 0) {
		lines.push(`Bonus: ${packet.rewards.bonusRewards.join(", ")}`);
	}
	lines.push("");

	lines.push("── LORE NOTES ──");
	for (const note of packet.loreNotes) {
		lines.push(`• ${note}`);
	}
	lines.push("");

	lines.push("── WARDEN TIPS ──");
	for (const tip of packet.wardenTips) {
		lines.push(`• ${tip}`);
	}

	return lines.join("\n");
}

/** Build AI seed data from a packet for per-section enhancement */
export function buildAISeed(
	packet: GeneratedRiftPacket,
	section?: "overview" | "rooms" | "encounters" | "hazards",
): string {
	const base = `Rift Rank: ${packet.rank}\nTheme: ${packet.theme}\nBiome: ${packet.biome}\nBoss: ${packet.boss}\nComplications: ${packet.complications.join("; ")}`;

	if (!section) {
		return `${base}\n\nFull Packet:\n${packetToTextDossier(packet)}`;
	}

	switch (section) {
		case "overview":
			return `${base}\n\nCurrent Overview:\n${packet.overview}\n\nRead-Aloud:\n${packet.readAloudEntry}\n\nEnrich the overview and read-aloud text with vivid sensory details, atmospheric description, and Rift Ascendant lore. Keep mechanical information intact. Return plain text only.`;
		case "rooms":
			return `${base}\n\nRoom Keys:\n${packet.roomKeys.map((r) => `[${r.label}] ${r.readAloud}\n${r.description}`).join("\n\n")}\n\nEnrich each room's read-aloud text and description with vivid environmental details and tactical notes. Maintain the room labels and types. Return plain text only.`;
		case "encounters":
			return `${base}\n\nEncounters:\n${packet.encounters.map((e) => `${e.name} (CR ${e.cr}, ${e.role}) — Tactics: ${e.tactics}`).join("\n")}\n\nExpand tactics for each encounter with specific ability usage, positioning, and Warden tips. Return plain text only.`;
		case "hazards":
			return `${base}\n\nHazards:\n${packet.hazards.map((h) => `${h.name} — DC ${h.dc}, ${h.damage}, Trigger: ${h.trigger}`).join("\n")}\n\nEnrich each hazard with sensory descriptions, escalation narratives, and tactical suggestions for the Warden. Return plain text only.`;
		default:
			return base;
	}
}
