/**
 * Token-Character Deep Linking
 * Syncs VTT tokens with character sheet data so HP, AC, conditions,
 * and status markers update automatically in both directions.
 *
 * Design:
 * - Each token has an optional `linkedCharacterId`
 * - When linked, token bars auto-sync from character stats
 * - Changes to token bars can optionally write back to character
 * - Condition badges on the character sheet appear as token status markers
 * - Warden can configure which bars link to which stats
 *
 * All functions are pure — callers provide state, functions return results.
 */

import type { CalculatedStats } from "../5eCharacterCalculations";

// ── Types ─────────────────────────────────────────────────────────────

export interface TokenLink {
	/** The VTT token ID */
	tokenId: string;
	/** The linked character's database ID */
	characterId: string;
	/** Bar configuration: which stat maps to which bar */
	barConfig: TokenBarConfig[];
	/** Whether changes to token bars write back to the character */
	bidirectional: boolean;
	/** Auto-apply condition markers from character conditions */
	syncConditions: boolean;
	/** Last sync timestamp */
	lastSyncAt: number;
}

export interface TokenBarConfig {
	/** Which bar on the token (1, 2, or 3) */
	barIndex: 1 | 2 | 3;
	/** Which character stat this bar tracks */
	linkedStat: LinkedStat;
	/** Whether this bar is visible to players */
	visibleToPlayers: boolean;
	/** Color of the bar */
	color: string;
}

export type LinkedStat =
	| "hp" // hitPoints.current / hitPoints.max
	| "temp_hp" // hitPoints.temp
	| "ac" // armorClass
	| "speed" // speed
	| "spell_slots" // total remaining / total max
	| "rift_favor" // riftFavor.current / riftFavor.max
	| "exhaustion" // exhaustionLevel / 6
	| "custom"; // user-defined

export interface TokenBarState {
	barIndex: 1 | 2 | 3;
	current: number;
	max: number;
	label: string;
	color: string;
	visibleToPlayers: boolean;
}

export interface TokenSyncResult {
	bars: TokenBarState[];
	markers: string[];
	nameplate: string;
	aura?: { radius: number; color: string };
}

// ── Character Data (subset needed for sync) ───────────────────────────

export interface CharacterSyncData {
	name: string;
	level: number;
	hitPoints: { current: number; max: number; temp: number };
	armorClass: number;
	speed: number;
	conditions: string[];
	exhaustionLevel: number;
	riftFavor: { current: number; max: number };
	spellSlots?: Record<number, { current: number; max: number }>;
	calculatedStats?: CalculatedStats;
}

// ── Default Config ────────────────────────────────────────────────────

/** Standard 3-bar token layout */
export function getDefaultBarConfig(): TokenBarConfig[] {
	return [
		{
			barIndex: 1,
			linkedStat: "hp",
			visibleToPlayers: true,
			color: "#ef4444", // red
		},
		{
			barIndex: 2,
			linkedStat: "ac",
			visibleToPlayers: true,
			color: "#3b82f6", // blue
		},
		{
			barIndex: 3,
			linkedStat: "rift_favor",
			visibleToPlayers: false,
			color: "#eab308", // yellow
		},
	];
}

/** Create a new token-character link */
export function createTokenLink(
	tokenId: string,
	characterId: string,
	config?: Partial<TokenLink>,
): TokenLink {
	return {
		tokenId,
		characterId,
		barConfig: getDefaultBarConfig(),
		bidirectional: true,
		syncConditions: true,
		lastSyncAt: Date.now(),
		...config,
	};
}

// ── Sync: Character → Token ───────────────────────────────────────────

/**
 * Generate the token display state from character data.
 * This is the primary sync direction: character sheet → VTT token.
 */
export function syncCharacterToToken(
	character: CharacterSyncData,
	link: TokenLink,
): TokenSyncResult {
	const bars: TokenBarState[] = [];

	for (const barCfg of link.barConfig) {
		const bar = resolveBar(barCfg, character);
		bars.push(bar);
	}

	// Condition markers
	const markers: string[] = [];
	if (link.syncConditions) {
		for (const condition of character.conditions) {
			const markerId = conditionToMarkerId(condition);
			if (markerId) markers.push(markerId);
		}

		// Exhaustion marker
		if (character.exhaustionLevel > 0) {
			markers.push(`marker-exhaustion-${character.exhaustionLevel}`);
		}
	}

	return {
		bars,
		markers,
		nameplate: character.name,
	};
}

/** Resolve a single bar's values from character data */
function resolveBar(
	config: TokenBarConfig,
	character: CharacterSyncData,
): TokenBarState {
	const base: Omit<TokenBarState, "current" | "max" | "label"> = {
		barIndex: config.barIndex,
		color: config.color,
		visibleToPlayers: config.visibleToPlayers,
	};

	switch (config.linkedStat) {
		case "hp":
			return {
				...base,
				current: character.hitPoints.current,
				max: character.hitPoints.max,
				label: "HP",
			};
		case "temp_hp":
			return {
				...base,
				current: character.hitPoints.temp,
				max: character.hitPoints.temp, // temp HP has no "max"
				label: "Temp HP",
			};
		case "ac":
			return {
				...base,
				current: character.armorClass,
				max: character.armorClass,
				label: "AC",
			};
		case "speed":
			return {
				...base,
				current: character.speed,
				max: character.speed,
				label: "Speed",
			};
		case "rift_favor":
			return {
				...base,
				current: character.riftFavor.current,
				max: character.riftFavor.max,
				label: "Rift Favor",
			};
		case "exhaustion":
			return {
				...base,
				current: character.exhaustionLevel,
				max: 6,
				label: "Exhaustion",
			};
		case "spell_slots": {
			let totalCurrent = 0;
			let totalMax = 0;
			if (character.spellSlots) {
				for (const slot of Object.values(character.spellSlots)) {
					totalCurrent += slot.current;
					totalMax += slot.max;
				}
			}
			return {
				...base,
				current: totalCurrent,
				max: totalMax,
				label: "Spell Slots",
			};
		}
		default:
			return { ...base, current: 0, max: 0, label: "Custom" };
	}
}

// ── Sync: Token → Character (Bidirectional) ───────────────────────────

export interface TokenBarChange {
	barIndex: 1 | 2 | 3;
	newValue: number;
}

/**
 * Apply a token bar change back to character data.
 * Only applies if the link is bidirectional.
 *
 * Returns updated character sync data (partial — only changed fields).
 */
export function applyTokenBarChange(
	change: TokenBarChange,
	link: TokenLink,
	character: CharacterSyncData,
): Partial<CharacterSyncData> | null {
	if (!link.bidirectional) return null;

	const barConfig = link.barConfig.find((b) => b.barIndex === change.barIndex);
	if (!barConfig) return null;

	switch (barConfig.linkedStat) {
		case "hp":
			return {
				hitPoints: {
					...character.hitPoints,
					current: Math.max(
						0,
						Math.min(change.newValue, character.hitPoints.max),
					),
				},
			};
		case "temp_hp":
			return {
				hitPoints: {
					...character.hitPoints,
					temp: Math.max(0, change.newValue),
				},
			};
		case "rift_favor":
			return {
				riftFavor: {
					...character.riftFavor,
					current: Math.max(
						0,
						Math.min(change.newValue, character.riftFavor.max),
					),
				},
			};
		default:
			return null; // AC, speed, etc. are calculated — can't write back
	}
}

// ── Condition ↔ Marker Mapping ────────────────────────────────────────

const CONDITION_MARKER_MAP: Record<string, string> = {
	blinded: "marker-blinded",
	charmed: "marker-charmed",
	deafened: "marker-deafened",
	frightened: "marker-frightened",
	grappled: "marker-grappled",
	incapacitated: "marker-incapacitated",
	invisible: "marker-invisible",
	paralyzed: "marker-paralyzed",
	petrified: "marker-petrified",
	poisoned: "marker-poisoned",
	prone: "marker-prone",
	restrained: "marker-restrained",
	stunned: "marker-stunned",
	unconscious: "marker-unconscious",
	concentration: "marker-concentration",
};

function conditionToMarkerId(condition: string): string | null {
	return CONDITION_MARKER_MAP[condition.toLowerCase()] ?? null;
}

/** Reverse lookup: marker → condition */
export function markerToCondition(markerId: string): string | null {
	for (const [condition, marker] of Object.entries(CONDITION_MARKER_MAP)) {
		if (marker === markerId) return condition;
	}
	return null;
}
