/**
 * 2014 DMG "Monster Statistics by Challenge Rating" (DMG p.274) — the
 * source-of-truth table the compendium audit and the anomaly statblock
 * reconstruction both key off so monster math stays internally 5e-correct.
 *
 * Rift Ascendant uses this 5e skeleton: ranks (D/C/B/A/S) map to CR bands
 * calibrated so a single rank-appropriate anomaly never overwhelms a party
 * of 4 at the rank's intended level (see `RANK_CR_BANDS` + the encounter
 * budget in `encounterMath.ts`). Identity, flavor, and the rank ladder are
 * the theme — the numbers here exist to keep the game playable.
 *
 * XP per CR is intentionally NOT duplicated here — use `getCRXP` from
 * `experience.ts`, the existing single source of truth for the CR→XP column.
 */
import { getCRXP } from "@/lib/experience";

interface MonsterCrStats {
	/** Canonical CR label, e.g. "1/4", "5". */
	cr: string;
	/** Numeric CR for ordering/derivation (1/8 = 0.125, etc.). */
	crValue: number;
	proficiency_bonus: number;
	/** Suggested armor class for the CR (a floor, not a hard cap). */
	armor_class: number;
	hp_min: number;
	hp_max: number;
	attack_bonus: number;
	/** Primary save DC for the CR (8 + PB + a +3-ish key mod baseline). */
	save_dc: number;
	/** Damage-per-round band (sum across the monster's turn). */
	damage_min: number;
	damage_max: number;
}

// DMG p.274. One row per CR 0–30. HP/damage are the published bands.
const TABLE: Omit<MonsterCrStats, "crValue">[] = [
	{
		cr: "0",
		proficiency_bonus: 2,
		armor_class: 13,
		hp_min: 1,
		hp_max: 6,
		attack_bonus: 3,
		save_dc: 13,
		damage_min: 0,
		damage_max: 1,
	},
	{
		cr: "1/8",
		proficiency_bonus: 2,
		armor_class: 13,
		hp_min: 7,
		hp_max: 35,
		attack_bonus: 3,
		save_dc: 13,
		damage_min: 2,
		damage_max: 3,
	},
	{
		cr: "1/4",
		proficiency_bonus: 2,
		armor_class: 13,
		hp_min: 36,
		hp_max: 49,
		attack_bonus: 3,
		save_dc: 13,
		damage_min: 4,
		damage_max: 5,
	},
	{
		cr: "1/2",
		proficiency_bonus: 2,
		armor_class: 13,
		hp_min: 50,
		hp_max: 70,
		attack_bonus: 3,
		save_dc: 13,
		damage_min: 6,
		damage_max: 8,
	},
	{
		cr: "1",
		proficiency_bonus: 2,
		armor_class: 13,
		hp_min: 71,
		hp_max: 85,
		attack_bonus: 3,
		save_dc: 13,
		damage_min: 9,
		damage_max: 14,
	},
	{
		cr: "2",
		proficiency_bonus: 2,
		armor_class: 13,
		hp_min: 86,
		hp_max: 100,
		attack_bonus: 3,
		save_dc: 13,
		damage_min: 15,
		damage_max: 20,
	},
	{
		cr: "3",
		proficiency_bonus: 2,
		armor_class: 13,
		hp_min: 101,
		hp_max: 115,
		attack_bonus: 4,
		save_dc: 13,
		damage_min: 21,
		damage_max: 26,
	},
	{
		cr: "4",
		proficiency_bonus: 2,
		armor_class: 14,
		hp_min: 116,
		hp_max: 130,
		attack_bonus: 5,
		save_dc: 14,
		damage_min: 27,
		damage_max: 32,
	},
	{
		cr: "5",
		proficiency_bonus: 3,
		armor_class: 15,
		hp_min: 131,
		hp_max: 145,
		attack_bonus: 6,
		save_dc: 15,
		damage_min: 33,
		damage_max: 38,
	},
	{
		cr: "6",
		proficiency_bonus: 3,
		armor_class: 15,
		hp_min: 146,
		hp_max: 160,
		attack_bonus: 6,
		save_dc: 15,
		damage_min: 39,
		damage_max: 44,
	},
	{
		cr: "7",
		proficiency_bonus: 3,
		armor_class: 15,
		hp_min: 161,
		hp_max: 175,
		attack_bonus: 6,
		save_dc: 15,
		damage_min: 45,
		damage_max: 50,
	},
	{
		cr: "8",
		proficiency_bonus: 3,
		armor_class: 16,
		hp_min: 176,
		hp_max: 190,
		attack_bonus: 7,
		save_dc: 16,
		damage_min: 51,
		damage_max: 56,
	},
	{
		cr: "9",
		proficiency_bonus: 4,
		armor_class: 16,
		hp_min: 191,
		hp_max: 205,
		attack_bonus: 7,
		save_dc: 16,
		damage_min: 57,
		damage_max: 62,
	},
	{
		cr: "10",
		proficiency_bonus: 4,
		armor_class: 17,
		hp_min: 206,
		hp_max: 220,
		attack_bonus: 7,
		save_dc: 16,
		damage_min: 63,
		damage_max: 68,
	},
	{
		cr: "11",
		proficiency_bonus: 4,
		armor_class: 17,
		hp_min: 221,
		hp_max: 235,
		attack_bonus: 8,
		save_dc: 17,
		damage_min: 69,
		damage_max: 74,
	},
	{
		cr: "12",
		proficiency_bonus: 4,
		armor_class: 17,
		hp_min: 236,
		hp_max: 250,
		attack_bonus: 8,
		save_dc: 17,
		damage_min: 75,
		damage_max: 80,
	},
	{
		cr: "13",
		proficiency_bonus: 5,
		armor_class: 18,
		hp_min: 251,
		hp_max: 265,
		attack_bonus: 8,
		save_dc: 18,
		damage_min: 81,
		damage_max: 86,
	},
	{
		cr: "14",
		proficiency_bonus: 5,
		armor_class: 18,
		hp_min: 266,
		hp_max: 280,
		attack_bonus: 8,
		save_dc: 18,
		damage_min: 87,
		damage_max: 92,
	},
	{
		cr: "15",
		proficiency_bonus: 5,
		armor_class: 18,
		hp_min: 281,
		hp_max: 295,
		attack_bonus: 8,
		save_dc: 18,
		damage_min: 93,
		damage_max: 98,
	},
	{
		cr: "16",
		proficiency_bonus: 5,
		armor_class: 18,
		hp_min: 296,
		hp_max: 310,
		attack_bonus: 9,
		save_dc: 18,
		damage_min: 99,
		damage_max: 104,
	},
	{
		cr: "17",
		proficiency_bonus: 6,
		armor_class: 19,
		hp_min: 311,
		hp_max: 325,
		attack_bonus: 10,
		save_dc: 19,
		damage_min: 105,
		damage_max: 110,
	},
	{
		cr: "18",
		proficiency_bonus: 6,
		armor_class: 19,
		hp_min: 326,
		hp_max: 340,
		attack_bonus: 10,
		save_dc: 19,
		damage_min: 111,
		damage_max: 116,
	},
	{
		cr: "19",
		proficiency_bonus: 6,
		armor_class: 19,
		hp_min: 341,
		hp_max: 355,
		attack_bonus: 10,
		save_dc: 19,
		damage_min: 117,
		damage_max: 122,
	},
	{
		cr: "20",
		proficiency_bonus: 6,
		armor_class: 19,
		hp_min: 356,
		hp_max: 400,
		attack_bonus: 10,
		save_dc: 19,
		damage_min: 123,
		damage_max: 140,
	},
	{
		cr: "21",
		proficiency_bonus: 7,
		armor_class: 19,
		hp_min: 401,
		hp_max: 445,
		attack_bonus: 11,
		save_dc: 20,
		damage_min: 141,
		damage_max: 158,
	},
	{
		cr: "22",
		proficiency_bonus: 7,
		armor_class: 19,
		hp_min: 446,
		hp_max: 490,
		attack_bonus: 11,
		save_dc: 20,
		damage_min: 159,
		damage_max: 176,
	},
	{
		cr: "23",
		proficiency_bonus: 7,
		armor_class: 19,
		hp_min: 491,
		hp_max: 535,
		attack_bonus: 11,
		save_dc: 20,
		damage_min: 177,
		damage_max: 194,
	},
	{
		cr: "24",
		proficiency_bonus: 7,
		armor_class: 19,
		hp_min: 536,
		hp_max: 580,
		attack_bonus: 12,
		save_dc: 21,
		damage_min: 195,
		damage_max: 212,
	},
	{
		cr: "25",
		proficiency_bonus: 8,
		armor_class: 19,
		hp_min: 581,
		hp_max: 625,
		attack_bonus: 12,
		save_dc: 21,
		damage_min: 213,
		damage_max: 230,
	},
	{
		cr: "26",
		proficiency_bonus: 8,
		armor_class: 19,
		hp_min: 626,
		hp_max: 670,
		attack_bonus: 12,
		save_dc: 21,
		damage_min: 231,
		damage_max: 248,
	},
	{
		cr: "27",
		proficiency_bonus: 8,
		armor_class: 19,
		hp_min: 671,
		hp_max: 715,
		attack_bonus: 13,
		save_dc: 22,
		damage_min: 249,
		damage_max: 266,
	},
	{
		cr: "28",
		proficiency_bonus: 8,
		armor_class: 19,
		hp_min: 716,
		hp_max: 760,
		attack_bonus: 13,
		save_dc: 22,
		damage_min: 267,
		damage_max: 284,
	},
	{
		cr: "29",
		proficiency_bonus: 9,
		armor_class: 19,
		hp_min: 761,
		hp_max: 805,
		attack_bonus: 13,
		save_dc: 22,
		damage_min: 285,
		damage_max: 302,
	},
	{
		cr: "30",
		proficiency_bonus: 9,
		armor_class: 19,
		hp_min: 806,
		hp_max: 850,
		attack_bonus: 14,
		save_dc: 23,
		damage_min: 303,
		damage_max: 320,
	},
];

const crToValue = (cr: string): number => {
	if (cr === "1/8") return 0.125;
	if (cr === "1/4") return 0.25;
	if (cr === "1/2") return 0.5;
	return Number(cr);
};

/**
 * Convert a numeric CR to its canonical 5e label (0.125 → "1/8", 0.25 → "1/4",
 * 0.5 → "1/2", else the integer string). The single source of truth for this
 * conversion — UI display and the provider both use it so fractional CRs never
 * surface as raw decimals and always key the CR→XP map correctly.
 */
export function numericCrToLabel(n: number): string {
	if (n === 0.125) return "1/8";
	if (n === 0.25) return "1/4";
	if (n === 0.5) return "1/2";
	return String(n);
}

export const MONSTER_CR_TABLE: MonsterCrStats[] = TABLE.map((row) => ({
	...row,
	crValue: crToValue(row.cr),
}));

const BY_CR = new Map<string, MonsterCrStats>(
	MONSTER_CR_TABLE.map((row) => [row.cr, row]),
);

export function getMonsterCrStats(cr: string): MonsterCrStats | undefined {
	return BY_CR.get(cr);
}

/** XP for a CR — delegates to the canonical CR→XP map in experience.ts. */
export function getMonsterCrXp(cr: string): number {
	return getCRXP(cr);
}

/**
 * Rank → CR band, calibrated so a single rank-appropriate anomaly stays at or
 * below a Hard solo fight for a party of 4 at the rank's *entry* level. The
 * bands rise monotonically D < C < B < A < S. `target_level` is the rank's
 * entry character level (used by the encounter-balance validator).
 */
interface RankCrBand {
	rank: "D" | "C" | "B" | "A" | "S";
	target_level_min: number;
	target_level_max: number;
	cr_min: string;
	cr_max: string;
	cr_min_value: number;
	cr_max_value: number;
}

// Bands calibrated against the party-of-4 encounter budget: each non-S rank's
// top CR sits at or just under the DEADLY threshold for a party of 4 at the
// rank's ENTRY level, so a lone rank-appropriate monster is "dangerous but
// survivable" (never a numbers-driven TPK). Contiguous + monotonic D<C<B<A<S.
// S-rank is the boss tier (exempt from the cap; legendary/lair expected).
export const RANK_CR_BANDS: Record<RankCrBand["rank"], RankCrBand> = {
	D: {
		rank: "D",
		target_level_min: 1,
		target_level_max: 4,
		cr_min: "1/8",
		cr_max: "1",
		cr_min_value: 0.125,
		cr_max_value: 1,
	},
	C: {
		rank: "C",
		target_level_min: 5,
		target_level_max: 8,
		cr_min: "2",
		cr_max: "5",
		cr_min_value: 2,
		cr_max_value: 5,
	},
	B: {
		rank: "B",
		target_level_min: 9,
		target_level_max: 12,
		cr_min: "6",
		cr_max: "8",
		cr_min_value: 6,
		cr_max_value: 8,
	},
	A: {
		rank: "A",
		target_level_min: 13,
		target_level_max: 16,
		cr_min: "9",
		cr_max: "12",
		cr_min_value: 9,
		cr_max_value: 12,
	},
	S: {
		rank: "S",
		target_level_min: 17,
		target_level_max: 20,
		cr_min: "13",
		cr_max: "21",
		cr_min_value: 13,
		cr_max_value: 21,
	},
};

const ORDERED_CRS = MONSTER_CR_TABLE.map((r) => r.cr);

/**
 * Spread a rank's members across its CR band deterministically so there is CR
 * variety within a rank instead of one fixed CR. `position` is a 0..1 value
 * (e.g. the entry's index within its rank ÷ rank size).
 */
export function crForRankPosition(
	rank: RankCrBand["rank"],
	position: number,
): string {
	const band = RANK_CR_BANDS[rank];
	const lo = ORDERED_CRS.indexOf(band.cr_min);
	const hi = ORDERED_CRS.indexOf(band.cr_max);
	const clamped = Math.min(1, Math.max(0, position));
	const idx = lo + Math.round(clamped * (hi - lo));
	return ORDERED_CRS[idx] ?? band.cr_min;
}
