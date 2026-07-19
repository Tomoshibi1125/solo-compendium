import type { Database } from "@/integrations/supabase/types";

type Anomaly = Database["public"]["Tables"]["compendium_Anomalies"]["Row"];

export const DIFFICULTY_THRESHOLDS = {
	easy: {
		1: 25,
		2: 50,
		3: 75,
		4: 100,
		5: 125,
		6: 150,
		7: 175,
		8: 200,
		9: 225,
		10: 250,
		11: 275,
		12: 300,
		13: 325,
		14: 350,
		15: 400,
		16: 450,
		17: 500,
		18: 550,
		19: 600,
		20: 650,
	},
	medium: {
		1: 50,
		2: 100,
		3: 150,
		4: 200,
		5: 250,
		6: 300,
		7: 350,
		8: 400,
		9: 450,
		10: 500,
		11: 600,
		12: 700,
		13: 800,
		14: 900,
		15: 1000,
		16: 1100,
		17: 1200,
		18: 1300,
		19: 1400,
		20: 1500,
	},
	hard: {
		1: 75,
		2: 150,
		3: 225,
		4: 300,
		5: 375,
		6: 450,
		7: 525,
		8: 600,
		9: 675,
		10: 750,
		11: 900,
		12: 1000,
		13: 1100,
		14: 1250,
		15: 1400,
		16: 1600,
		17: 1800,
		18: 2000,
		19: 2200,
		20: 2400,
	},
	deadly: {
		1: 100,
		2: 200,
		3: 300,
		4: 450,
		5: 550,
		6: 600,
		7: 750,
		8: 900,
		9: 1100,
		10: 1200,
		11: 1600,
		12: 1900,
		13: 2200,
		14: 2600,
		15: 3000,
		16: 3500,
		17: 4000,
		18: 4500,
		19: 5000,
		20: 5500,
	},
} as const;

export type EncounterDifficulty = "easy" | "medium" | "hard" | "deadly";

/**
 * The XP a single monster may be worth before a solo fight against a party of
 * `partySize` characters at `level` exceeds the given difficulty. A single
 * monster carries the ×1 encounter multiplier, so the budget is simply the
 * per-character threshold × party size.
 */
export function singleMonsterXpBudget(
	level: number,
	difficulty: EncounterDifficulty,
	partySize = 4,
): number {
	const perCharacter =
		DIFFICULTY_THRESHOLDS[difficulty][
			level as keyof (typeof DIFFICULTY_THRESHOLDS)[typeof difficulty]
		] ?? 0;
	return perCharacter * partySize;
}

export function calculateXP(Anomaly: Anomaly, quantity: number): number {
	const xp = Anomaly.xp || 0;
	return xp * quantity;
}

/** DMG encounter-multiplier bands, indexed by number of monsters. */
const MULTIPLIER_BANDS = [1, 1.5, 2, 2.5, 3, 4] as const;

function bandForMonsterCount(monsterCount: number): number {
	if (monsterCount <= 1) return 0;
	if (monsterCount === 2) return 1;
	if (monsterCount <= 6) return 2;
	if (monsterCount <= 10) return 3;
	if (monsterCount <= 14) return 4;
	return 5;
}

/**
 * The DMG encounter multiplier: it scales with the number of MONSTERS, not
 * the size of the party. Party size only shifts the band — a party of one or
 * two treats the encounter as one step more dangerous, a party of six or more
 * as one step less.
 */
export function encounterMultiplier(
	monsterCount: number,
	partySize = 4,
): number {
	let band = bandForMonsterCount(monsterCount);
	if (partySize <= 2) band += 1;
	else if (partySize >= 6) band -= 1;
	const clamped = Math.min(MULTIPLIER_BANDS.length - 1, Math.max(0, band));
	return MULTIPLIER_BANDS[clamped];
}

/**
 * Classify an encounter against the party's XP thresholds (DMG).
 *
 * Adjusted XP = raw XP × the monster-count multiplier; it is compared with
 * the PARTY threshold (per-character value × party size). The previous
 * implementation derived the multiplier from party size and compared against
 * a single character's threshold, which reported a solo 200 XP anomaly as
 * "deadly" for four level-1 characters when RAW calls it medium.
 */
export function calculateDifficulty(
	totalXP: number,
	hunterLevel: number,
	hunterCount: number,
	monsterCount = 1,
): EncounterDifficulty {
	const partySize = Math.max(1, hunterCount);
	const adjustedXP = totalXP * encounterMultiplier(monsterCount, partySize);

	const partyThreshold = (difficulty: EncounterDifficulty): number =>
		singleMonsterXpBudget(hunterLevel, difficulty, partySize);

	if (adjustedXP >= partyThreshold("deadly")) return "deadly";
	if (adjustedXP >= partyThreshold("hard")) return "hard";
	if (adjustedXP >= partyThreshold("medium")) return "medium";
	return "easy";
}
