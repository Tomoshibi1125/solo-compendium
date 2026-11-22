/**
 * Companion progression rules (RA-10, docs/canon/rift-ascendant-canon-locks.md).
 *
 * Pure numbers and text scaling with no catalog imports. The catalog-aware
 * resolver that decides which creature scales lives in `companionScaling.ts`.
 */
import { DAMAGE_TYPES } from "@/lib/damageApplication";
import type { CompendiumMountNaturalAttack } from "@/types/compendium";

export type CompanionScalingKind = "stat-block" | "size";
export type CompanionHitDie = 4 | 6 | 8 | 10 | 12 | 20;

const HIT_DIE_SIZES: readonly number[] = [4, 6, 8, 10, 12, 20];
const RANK_TIERS: Readonly<Record<string, number>> = {
	E: 0,
	D: 1,
	C: 2,
	B: 3,
	A: 4,
	S: 5,
};
const MISSING_RANK_TIER = 1;
const SIZE_HIT_DICE: Readonly<Record<string, CompanionHitDie>> = {
	tiny: 4,
	small: 6,
	medium: 8,
	large: 10,
	huge: 12,
	gargantuan: 20,
};
/** A creature whose size is unknown rolls the Medium die. */
export const UNKNOWN_SIZE_HIT_DIE: CompanionHitDie = 8;
const KNOWN_DAMAGE_TYPES: ReadonlySet<string> = new Set(DAMAGE_TYPES);

// ── Progression ─────────────────────────────────────────────────────────

export function clampCompanionLevel(level: number | null | undefined): number {
	const numeric =
		typeof level === "number" && Number.isFinite(level) ? Math.trunc(level) : 1;
	return Math.min(20, Math.max(1, numeric));
}

/** PB = 2 + floor((L − 1) / 4). */
export function companionProficiencyBonus(level: number): number {
	return 2 + Math.floor((clampCompanionLevel(level) - 1) / 4);
}

/** Cantrip pace: 1 die at levels 1–4, 2 at 5–10, 3 at 11–16, 4 at 17–20. */
export function companionDamageDiceCount(level: number): number {
	const clamped = clampCompanionLevel(level);
	if (clamped >= 17) return 4;
	if (clamped >= 11) return 3;
	if (clamped >= 5) return 2;
	return 1;
}

/** E 0, D 1, C 2, B 3, A 4, S 5; a missing or unknown rank counts as D. */
export function companionRankTier(rank: string | null | undefined): number {
	const key = typeof rank === "string" ? rank.trim().toUpperCase() : "";
	return RANK_TIERS[key] ?? MISSING_RANK_TIER;
}

const toHitDie = (value: number): CompanionHitDie | null =>
	HIT_DIE_SIZES.includes(value) ? (value as CompanionHitDie) : null;

/** The Hit Die of an authored stat block: `12 (1d10 + 6)` → 10. */
export function parseStatBlockHitDie(hitDice: unknown): CompanionHitDie | null {
	if (typeof hitDice !== "string") return null;
	const match = /\d*\s*d\s*(\d+)/i.exec(hitDice);
	return match ? toHitDie(Number(match[1])) : null;
}

/** Tiny d4, Small d6, Medium d8, Large d10, Huge d12, Gargantuan d20. */
export function sizeHitDie(size: unknown): CompanionHitDie | null {
	return typeof size === "string"
		? (SIZE_HIT_DICE[size.trim().toLowerCase()] ?? null)
		: null;
}

// ── Scaled numbers ──────────────────────────────────────────────────────

export interface ScaledCompanionCombatStats {
	kind: CompanionScalingKind;
	level: number;
	rankTier: number;
	proficiencyBonus: number;
	hitDie: CompanionHitDie;
	/** L Hit Dice, e.g. `5d10`. */
	hitDice: string;
	/** Every Hit Die at its maximum; no VIT is added. */
	hpMax: number;
	baseAc: number;
	attackBonus: number;
	saveDc: number;
	/** Dice rolled per damage roll at this level. */
	damageDiceCount: number;
}

export function scaleCompanionAtLevel(
	levelInput: number | null | undefined,
	input: {
		rank?: string | null;
		hitDie: CompanionHitDie;
		kind?: CompanionScalingKind;
	},
): ScaledCompanionCombatStats {
	const level = clampCompanionLevel(levelInput);
	const rankTier = companionRankTier(input.rank);
	const proficiencyBonus = companionProficiencyBonus(level);
	return {
		kind: input.kind ?? "stat-block",
		level,
		rankTier,
		proficiencyBonus,
		hitDie: input.hitDie,
		hitDice: `${level}d${input.hitDie}`,
		hpMax: level * input.hitDie,
		baseAc: 10 + rankTier + Math.floor((level - 1) / 4),
		attackBonus: 2 + rankTier + proficiencyBonus,
		saveDc: 8 + rankTier + proficiencyBonus,
		damageDiceCount: companionDamageDiceCount(level),
	};
}

const signed = (value: number) => (value >= 0 ? `+${value}` : `${value}`);

/** One-line summary of the RA-10 numbers at the owner's current level. */
export function companionScalingSummary(
	scaling: ScaledCompanionCombatStats,
): string {
	const dice = scaling.damageDiceCount === 1 ? "die" : "dice";
	return `Level ${scaling.level}: ${scaling.hitDice} Hit Dice at maximum, PB ${signed(scaling.proficiencyBonus)}, attack ${signed(scaling.attackBonus)}, save DC ${scaling.saveDc}, ${scaling.damageDiceCount} damage ${dice} per roll.`;
}

/** A mount's natural attack die: its authored die, else the mount's size die. */
export function naturalAttackDie(
	attack: Pick<CompendiumMountNaturalAttack, "die">,
	size: unknown,
): CompanionHitDie {
	return attack.die ?? sizeHitDie(size) ?? UNKNOWN_SIZE_HIT_DIE;
}

/** `XdY + B`, or `XdY` when there is no flat bonus. */
export function companionDamageExpression(
	count: number,
	die: number,
	bonus: number,
): string {
	return bonus > 0 ? `${count}d${die} + ${bonus}` : `${count}d${die}`;
}

// ── Authored text ───────────────────────────────────────────────────────

/** `attack` adds PB to the first damage roll; `dice` scales dice only. */
export type CompanionTextMode = "attack" | "dice";

/**
 * A damage roll: dice followed by an optional damage-type word and "damage".
 * Groups: 1 printed average, 2–3 parenthesized dice, 4–5 bare dice, 6 type.
 * The authored flat bonus is matched so it can be dropped.
 */
const DAMAGE_ROLL =
	/(?:(?:(\d+)\s*)?\(\s*(\d+)d(\d+)(?:\s*[+\-−]\s*\d+)?\s*\)|\b(\d+)d(\d+)(?:\s*[+\-−]\s*\d+)?)(?=\s+(?:([a-z]+)\s+)?damage\b)/gi;
const DC_VALUE = /\bDC\s*\d+/g;
const TO_HIT = /[+\-−]\s*\d+\s+to hit\b/gi;
/** Extra dice ride on another attack, so they never take the flat bonus. */
const EXTRA_BEFORE = /\bextra\s+$/i;

export interface ScaledCompanionText {
	text: string;
	/** The first rewritten damage roll, e.g. `2d6 + 3`. */
	firstDamage: string | null;
	firstDamageType: string | null;
}

/**
 * Rewrite authored text to scaled DCs, to-hit bonuses, and damage dice. Each
 * damage roll keeps its die size and takes the level's dice count. In attack
 * mode the first damage roll adds PB in place of the authored flat bonus.
 * Dice that are not followed by damage (durations, recharge) are unchanged.
 */
export function rewriteCompanionText(
	text: string,
	scaled: ScaledCompanionCombatStats,
	mode: CompanionTextMode,
): ScaledCompanionText {
	let bonusPending = mode === "attack";
	let firstDamage: string | null = null;
	let firstDamageType: string | null = null;
	const withDamage = text.replace(
		DAMAGE_ROLL,
		(
			_match: string,
			average: string | undefined,
			_parenCount: string | undefined,
			parenDie: string | undefined,
			_bareCount: string | undefined,
			bareDie: string | undefined,
			typeWord: string | undefined,
			offset: number,
			whole: string,
		) => {
			const die = Number(parenDie ?? bareDie);
			const extra = EXTRA_BEFORE.test(whole.slice(0, offset));
			const bonus = bonusPending && !extra ? scaled.proficiencyBonus : 0;
			if (bonus > 0) bonusPending = false;
			const expression = companionDamageExpression(
				scaled.damageDiceCount,
				die,
				bonus,
			);
			firstDamage ??= expression;
			const type = typeWord?.toLowerCase();
			firstDamageType ??= type && KNOWN_DAMAGE_TYPES.has(type) ? type : null;
			if (parenDie === undefined) return expression;
			if (average === undefined) return `(${expression})`;
			const printedAverage =
				Math.floor((scaled.damageDiceCount * (die + 1)) / 2) + bonus;
			return `${printedAverage} (${expression})`;
		},
	);
	return {
		text: withDamage
			.replace(DC_VALUE, `DC ${scaled.saveDc}`)
			.replace(TO_HIT, `+${scaled.attackBonus} to hit`),
		firstDamage,
		firstDamageType,
	};
}

export function scaleCompanionText(
	text: string,
	scaled: ScaledCompanionCombatStats,
	mode: CompanionTextMode,
): string {
	return rewriteCompanionText(text, scaled, mode).text;
}
