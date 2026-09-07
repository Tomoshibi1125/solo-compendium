/**
 * Regent Gestalt Overlay
 *
 * Canon (Rift Ascendant): a Regent is NOT a subclass. It is a **full class
 * overlay** with its own complete progression. Once unlocked, the character
 * gestalts — the base Job AND the Regent advance simultaneously at the
 * character's level (regent level == character level, applied retroactively
 * on unlock). An Ascendant who awakens a Regent's authority carries it as a
 * second full progression, advancing it in lockstep with their base Job.
 *
 * Gestalt rules (locked — see docs/system-ascendant-mechanics.md):
 *   - HP per level: ADDITIVE — avg(Job die) + avg(Regent die) + VIT mod
 *     (VIT applied once per level, not per die). The deliberate power spike.
 *   - Proficiencies & saving throws: UNION of Job + Regent (de-duped).
 *   - Class features: every Regent class_feature with level <= char level.
 *   - Spellcasting: gestalt two-class merge (Job caster contribution +
 *     Regent caster contribution) → combined slot table (PHB p.164 method).
 *     There is no generalized multiclassing in this system — only this
 *     Job+Regent gestalt overlay.
 *
 * Data source: the canonical rich `regents.ts` (`Regent[]`), resolved by the
 * regent id persisted in `character_regent_unlocks.regent_id`. The thin
 * `nineRegents.ts` set is for Gemini-fusion theming only and is NOT used here.
 *
 * This module is pure and unit-testable — callers provide regent ids / data.
 */

import { regents as CANONICAL_REGENTS } from "@/data/compendium/regents";
import {
	ABILITY_DISPLAY_NAMES,
	type AbilityScore,
	SKILLS,
} from "@/lib/5eRulesEngine";
import { resolveCanonicalRegentId } from "@/lib/regentIdentity";
import {
	getRegentLeveledFeatures,
	type RegentLeveledFeature,
} from "@/lib/regentProgression";
import type { Regent } from "@/lib/regentTypes";

// ── Reverse lookup maps (display name → canonical key) ──────────────────

/** "Strength" → "STR", "Sense" → "SENSE", etc. Also accepts codes directly. */
const ABILITY_NAME_TO_CODE: Record<string, AbilityScore> = (() => {
	const map: Record<string, AbilityScore> = {};
	for (const [code, name] of Object.entries(ABILITY_DISPLAY_NAMES)) {
		map[name.toLowerCase()] = code as AbilityScore;
		map[code.toLowerCase()] = code as AbilityScore;
	}
	return map;
})();

/** RA-themed skill display name → skill id, e.g. "Mana Flow" → "arcana". */
const SKILL_NAME_TO_ID: Record<string, string> = (() => {
	const map: Record<string, string> = {};
	for (const skill of SKILLS) {
		map[skill.name.toLowerCase()] = skill.id;
		map[skill.id.toLowerCase()] = skill.id;
	}
	return map;
})();

export function normalizeSaveToCode(
	value: string | null | undefined,
): AbilityScore | null {
	if (!value) return null;
	return ABILITY_NAME_TO_CODE[value.trim().toLowerCase()] ?? null;
}

export function normalizeSkillToId(
	value: string | null | undefined,
): string | null {
	if (!value) return null;
	const key = value.trim().toLowerCase();
	return SKILL_NAME_TO_ID[key] ?? null;
}

// ── Resolution ──────────────────────────────────────────────────────────

/** Return each supported Regent identity once, preserving first-seen order. */
function uniqueCanonicalRegents(regents: readonly Regent[]): Regent[] {
	const seen = new Set<string>();
	const unique: Regent[] = [];
	for (const regent of regents) {
		const canonicalId = resolveCanonicalRegentId(regent.id);
		if (!canonicalId || seen.has(canonicalId)) continue;
		seen.add(canonicalId);
		unique.push(
			regent.id === canonicalId ? regent : { ...regent, id: canonicalId },
		);
	}
	return unique;
}

/**
 * Resolve persisted Regent IDs through the locked canonical identity boundary.
 * Explicit legacy IDs normalize to their canonical identity; unsupported IDs
 * are skipped and each canonical Regent is returned at most once.
 */
export function resolveRegents(
	regentIds: readonly string[] | null | undefined,
	dataset: readonly Regent[] = CANONICAL_REGENTS,
): Regent[] {
	if (!regentIds || regentIds.length === 0) return [];

	const byId = new Map<string, Regent>();
	for (const regent of dataset) {
		const canonicalId = resolveCanonicalRegentId(regent.id);
		if (!canonicalId) continue;
		const existing = byId.get(canonicalId);
		// If a compatibility dataset contains both an alias and its canonical row,
		// the canonical row is authoritative regardless of input order.
		if (!existing || regent.id.trim() === canonicalId) {
			byId.set(canonicalId, regent);
		}
	}

	const resolved: Regent[] = [];
	const seen = new Set<string>();
	for (const rawId of regentIds) {
		const canonicalId = resolveCanonicalRegentId(rawId);
		if (!canonicalId || seen.has(canonicalId)) continue;
		const regent = byId.get(canonicalId);
		if (!regent) continue;
		seen.add(canonicalId);
		resolved.push(
			regent.id === canonicalId ? regent : { ...regent, id: canonicalId },
		);
	}
	return resolved;
}

// ── Hit dice (additive gestalt HP) ────────────────────────────────────────

/** Parse a hit-die string like "1d12" or "d10" → 12 / 10. Returns 0 if absent. */
export function parseHitDieSize(hitDice: string | null | undefined): number {
	if (!hitDice) return 0;
	const m = hitDice.match(/d(\d+)/i);
	return m ? Number.parseInt(m[1], 10) : 0;
}

/**
 * Combined additive hit-die size contributed by all unlocked regents.
 * For the standard single-regent case this is just that regent's die.
 * Multiple regents (rare) stack additively, matching the power-spike rule.
 */
export function getRegentHitDieContribution(
	regents: readonly Regent[],
): number {
	return uniqueCanonicalRegents(regents).reduce(
		(sum, regent) => sum + parseHitDieSize(regent.hit_dice),
		0,
	);
}

/**
 * Additive HP the Regent overlay contributes ON TOP of the base Job HP, across
 * all character levels (the deliberate gestalt power spike). Applied reactively to
 * the displayed HP max so it is retroactive the instant a Regent is unlocked —
 * no stored-HP migration, no double counting (base `hp_max` stays Job-only).
 *
 * Per the locked rule, VIT is applied once per level by the BASE HP already, so
 * the Regent contributes only its die portions: full die at level 1, then
 * average (`floor(die/2)+1`) per subsequent level. Returns 0 when no regent
 * die is present.
 */
export function getRegentHpContribution(
	regentHitDieContribution: number,
	level: number,
): number {
	const die = regentHitDieContribution > 0 ? regentHitDieContribution : 0;
	if (die === 0 || level < 1) return 0;
	const firstLevel = die;
	const perSubsequent = Math.floor(die / 2) + 1;
	return firstLevel + Math.max(0, level - 1) * perSubsequent;
}

/**
 * Convenience: additive gestalt HP contribution for a set of persisted regent
 * ids at a given character level. For external readers (party dashboard,
 * character panel) that have regent ids but not the full engine output.
 * Pairs with `getEffectiveHpMax(character, <this>)`.
 */
export function getRegentHpContributionForIds(
	regentIds: readonly string[] | null | undefined,
	level: number,
	dataset?: readonly Regent[],
): number {
	const regents = resolveRegents(regentIds, dataset);
	return getRegentHpContribution(getRegentHitDieContribution(regents), level);
}

// ── Proficiency / saving-throw union ───────────────────────────────────────

export interface GestaltProficiencies {
	savingThrows: AbilityScore[];
	skills: string[];
	armor: string[];
	weapons: string[];
	tools: string[];
}

/**
 * Union of all regents' proficiencies, normalized to canonical keys and
 * de-duped. Callers merge these with the Job's own proficiencies.
 */
export function getGestaltProficiencies(
	regents: readonly Regent[],
): GestaltProficiencies {
	const saves = new Set<AbilityScore>();
	const skills = new Set<string>();
	const armor = new Set<string>();
	const weapons = new Set<string>();
	const tools = new Set<string>();

	for (const r of regents) {
		for (const s of r.saving_throws ?? []) {
			const code = normalizeSaveToCode(s);
			if (code) saves.add(code);
		}
		for (const sk of r.skill_proficiencies ?? []) {
			const id = normalizeSkillToId(sk);
			if (id) skills.add(id);
		}
		for (const a of r.armor_proficiencies ?? []) armor.add(a);
		for (const w of r.weapon_proficiencies ?? []) weapons.add(w);
		for (const t of r.tool_proficiencies ?? []) tools.add(t);
	}

	return {
		savingThrows: [...saves],
		skills: [...skills],
		armor: [...armor],
		weapons: [...weapons],
		tools: [...tools],
	};
}

// ── Leveled class features ─────────────────────────────────────────────────

export interface GestaltFeature extends RegentLeveledFeature {
	regentId: string;
	regentName: string;
}

/**
 * All canonical Task 7 ledger rows granted by the Regents at
 * `characterLevel`. Stable feature ID + authoritative level is the identity;
 * repeated names at different levels remain distinct. Full ledger metadata is
 * preserved and same-level source order remains stable.
 */
export function getGestaltClassFeatures(
	regents: readonly Regent[],
	characterLevel: number,
): GestaltFeature[] {
	const out: GestaltFeature[] = [];
	const seen = new Set<string>();

	for (const regent of uniqueCanonicalRegents(regents)) {
		for (const feature of getRegentLeveledFeatures(regent)) {
			if (feature.level > characterLevel) continue;
			const key = `${feature.id}::${feature.level}`;
			if (seen.has(key)) continue;
			seen.add(key);
			out.push({
				...feature,
				regentId: regent.id,
				regentName: regent.name,
			});
		}
	}
	out.sort((left, right) => left.level - right.level);
	return out;
}

// ── Gestalt spellcasting merge (Job + Regent, PHB p.164 method) ─────────────

/**
 * Standard 5e multiclass spellcaster slot table, indexed by **combined caster
 * level** (1–20). Used for the Job+Regent gestalt merge only — this system has
 * no generalized multiclassing. Index 0 = level 1.
 */
const MULTICLASS_SLOT_TABLE: number[][] = [
	[2, 0, 0, 0, 0, 0, 0, 0, 0], // 1
	[3, 0, 0, 0, 0, 0, 0, 0, 0], // 2
	[4, 2, 0, 0, 0, 0, 0, 0, 0], // 3
	[4, 3, 0, 0, 0, 0, 0, 0, 0], // 4
	[4, 3, 2, 0, 0, 0, 0, 0, 0], // 5
	[4, 3, 3, 0, 0, 0, 0, 0, 0], // 6
	[4, 3, 3, 1, 0, 0, 0, 0, 0], // 7
	[4, 3, 3, 2, 0, 0, 0, 0, 0], // 8
	[4, 3, 3, 3, 1, 0, 0, 0, 0], // 9
	[4, 3, 3, 3, 2, 0, 0, 0, 0], // 10
	[4, 3, 3, 3, 2, 1, 0, 0, 0], // 11
	[4, 3, 3, 3, 2, 1, 0, 0, 0], // 12
	[4, 3, 3, 3, 2, 1, 1, 0, 0], // 13
	[4, 3, 3, 3, 2, 1, 1, 0, 0], // 14
	[4, 3, 3, 3, 2, 1, 1, 1, 0], // 15
	[4, 3, 3, 3, 2, 1, 1, 1, 0], // 16
	[4, 3, 3, 3, 2, 1, 1, 1, 1], // 17
	[4, 3, 3, 3, 3, 1, 1, 1, 1], // 18
	[4, 3, 3, 3, 3, 2, 1, 1, 1], // 19
	[4, 3, 3, 3, 3, 2, 2, 1, 1], // 20
];

export type CasterFraction = "full" | "half" | "third" | "none";

/**
 * Caster-level contribution of one class at a given level (PHB p.164):
 * full → level, half → floor(level/2), third → floor(level/3), none → 0.
 */
export function casterLevelContribution(
	fraction: CasterFraction,
	level: number,
): number {
	switch (fraction) {
		case "full":
			return level;
		case "half":
			return Math.floor(level / 2);
		case "third":
			return Math.floor(level / 3);
		default:
			return 0;
	}
}

/**
 * Does a regent cast, and at what fraction? A regent with a `spellcasting`
 * block is a full-class caster overlay, so it contributes at full caster
 * level (it advances with the character). Regents without `spellcasting`
 * contribute nothing.
 */
export function getRegentCasterFraction(regent: Regent): CasterFraction {
	return regent.spellcasting ? "full" : "none";
}

/**
 * Merge a Job's caster contribution with all unlocked regents' contributions
 * into a single combined spell-slot table (slots by level 1–9). When neither
 * side casts, returns all-zero slots. `jobCasterLevel` is the Job's already-
 * scaled contribution (e.g. half-casters pass floor(level/2)); pass the raw
 * job fraction instead via `jobFraction` if you want this fn to scale it.
 */
export function getGestaltSpellSlots(
	jobFraction: CasterFraction,
	regents: readonly Regent[],
	characterLevel: number,
): Record<number, number> {
	const empty: Record<number, number> = {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0,
	};

	let combined = casterLevelContribution(jobFraction, characterLevel);
	for (const regent of uniqueCanonicalRegents(regents)) {
		combined += casterLevelContribution(
			getRegentCasterFraction(regent),
			characterLevel,
		);
	}
	if (combined <= 0 || characterLevel < 1) return empty;

	// Gestalt is best-of, not stacked: both progressions advance on the SAME
	// character levels, and the cited PHB p.164 method never yields a combined
	// caster level above character level. Without this clamp a caster job +
	// caster regent (level + level) would reach 9th-level slots by level 10.
	const effective = Math.min(combined, characterLevel, 20);
	const row = MULTICLASS_SLOT_TABLE[effective - 1];
	const slots: Record<number, number> = { ...empty };
	for (let i = 0; i < 9; i++) slots[i + 1] = row[i];
	return slots;
}

// ── Convenience: full gestalt summary for a character ──────────────────────

export interface GestaltSummary {
	active: boolean;
	regents: Regent[];
	regentHitDieContribution: number;
	proficiencies: GestaltProficiencies;
	features: GestaltFeature[];
}

/**
 * One-call resolution of the full gestalt overlay for a character, given the
 * persisted regent ids and the character level.
 */
export function computeGestaltSummary(
	regentIds: readonly string[] | null | undefined,
	characterLevel: number,
	dataset?: readonly Regent[],
): GestaltSummary {
	const resolved = resolveRegents(regentIds, dataset);
	return {
		active: resolved.length > 0,
		regents: resolved,
		regentHitDieContribution: getRegentHitDieContribution(resolved),
		proficiencies: getGestaltProficiencies(resolved),
		features: getGestaltClassFeatures(resolved, characterLevel),
	};
}
