/**
 * Prerequisite Validation (P1.8)
 *
 * Cross-cutting prerequisite check for content that can be added to a
 * character at level-up: feats, spells, powers, techniques, runes.
 *
 * Distinct from `levelGating.ts`, which handles structural progression
 * gates (job features at the right level, path unlock levels, max power
 * level by caster table). This module handles **content-side**
 * prerequisites — e.g. Heavy Armor Master needs proficiency with heavy
 * armor; Great Weapon Master needs STR 13; Sharpshooter needs no
 * prereq; a Mage-only spell needs job === Mage.
 *
 * UX is DDB-style "warn but allow" — `validatePrereq` returns the list
 * of missing requirements so the UI can show a red explanation, but
 * callers may still permit the add (e.g. for homebrew overrides).
 */

import type { AbilityScore } from "@/types/core-rules";

// ── Schema ──────────────────────────────────────────────────────────

/**
 * Structured prerequisite. All fields are optional; absent fields are
 * unconstrained. Multiple constraints AND together.
 */
interface PrerequisiteSpec {
	/** Minimum ability score requirements, e.g. `{ STR: 13, AGI: 13 }`. */
	minAbility?: Partial<Record<AbilityScore, number>>;
	/** Minimum character level. */
	minLevel?: number;
	/** Required job (case-insensitive). */
	requiredJob?: string;
	/** Required feature names (any one of). */
	requiredFeature?: string[];
	/** Required proficiency (skill name or armor/weapon category). */
	requiredProficiency?: string[];
	/** Free-form text prerequisite (for display only — never gating). */
	textOnly?: string;
}

/** Character snapshot needed for prerequisite checks. */
export interface PrereqCharacterContext {
	level: number;
	job?: string | { name: string } | null;
	abilities: Record<AbilityScore, number>;
	features?: Array<{ name: string }> | null;
	proficiencies?: string[] | null; // armor/weapon/skill names
}

interface PrereqValidation {
	ok: boolean;
	missing: string[];
}

// ── Validation ──────────────────────────────────────────────────────

function jobName(
	job: string | { name: string } | null | undefined,
): string | null {
	if (!job) return null;
	if (typeof job === "string") return job;
	return job.name ?? null;
}

const normalize = (s: string) => s.trim().toLowerCase();

/**
 * Check a character against a prerequisite spec.
 *
 * Returns `{ ok: true, missing: [] }` when the spec is met (or empty),
 * otherwise `{ ok: false, missing: [...] }` with one short message per
 * unmet requirement.
 */
export function validatePrereq(
	spec: PrerequisiteSpec | null | undefined,
	character: PrereqCharacterContext,
): PrereqValidation {
	const missing: string[] = [];
	if (!spec) return { ok: true, missing };

	// Ability score minimums
	if (spec.minAbility) {
		for (const [ability, min] of Object.entries(spec.minAbility) as Array<
			[AbilityScore, number]
		>) {
			const score = character.abilities[ability] ?? 10;
			if (score < min) {
				missing.push(`Requires ${ability} ${min}+ (have ${score}).`);
			}
		}
	}

	// Minimum level
	if (typeof spec.minLevel === "number" && character.level < spec.minLevel) {
		missing.push(
			`Requires character level ${spec.minLevel} (have ${character.level}).`,
		);
	}

	// Required job
	if (spec.requiredJob) {
		const charJob = jobName(character.job);
		if (!charJob || normalize(charJob) !== normalize(spec.requiredJob)) {
			missing.push(
				`Requires job: ${spec.requiredJob}${charJob ? ` (have ${charJob})` : ""}.`,
			);
		}
	}

	// Required feature (any one of the listed names)
	if (spec.requiredFeature && spec.requiredFeature.length > 0) {
		const have = new Set(
			(character.features ?? []).map((f) => normalize(f.name)),
		);
		const matched = spec.requiredFeature.some((req) =>
			have.has(normalize(req)),
		);
		if (!matched) {
			missing.push(`Requires feature: ${spec.requiredFeature.join(" or ")}.`);
		}
	}

	// Required proficiency (any one of the listed names)
	if (spec.requiredProficiency && spec.requiredProficiency.length > 0) {
		const have = new Set(
			(character.proficiencies ?? []).map((p) => normalize(p)),
		);
		const matched = spec.requiredProficiency.some((req) =>
			have.has(normalize(req)),
		);
		if (!matched) {
			missing.push(
				`Requires proficiency: ${spec.requiredProficiency.join(" or ")}.`,
			);
		}
	}

	return { ok: missing.length === 0, missing };
}

/**
 * Parse a free-form prerequisite string into a structured PrerequisiteSpec.
 *
 * Handles the most common DDB/SRD patterns:
 *  - "Strength 13 or higher"
 *  - "Dexterity 13 or higher; proficiency with heavy armor"
 *  - "Level 5"
 *  - "Spellcasting feature"
 *
 * Unknown segments are preserved in `textOnly` for display.
 *
 * Returns `null` when no patterns matched (caller can fall back to
 * raw-text display).
 */
export function parsePrerequisiteText(
	text: string | null | undefined,
): PrerequisiteSpec | null {
	if (!text || !text.trim()) return null;
	const spec: PrerequisiteSpec = {};
	const ABILITY_NAMES: Array<[RegExp, AbilityScore]> = [
		[/strength|\bSTR\b/i, "STR"],
		[/dexterity|agility|\b(?:AGI|DEX)\b/i, "AGI"],
		[/constitution|vitality|\b(?:VIT|CON)\b/i, "VIT"],
		[/intelligence|\bINT\b/i, "INT"],
		[/wisdom|sense|\b(?:SENSE|WIS)\b/i, "SENSE"],
		[/charisma|presence|\b(?:PRE|CHA)\b/i, "PRE"],
	];

	const segments = text.split(/[,;]| and /i).map((s) => s.trim());
	const unmatched: string[] = [];

	for (const seg of segments) {
		if (!seg) continue;
		let matched = false;

		// "Ability NN or higher" / "NN Ability"
		for (const [pat, ability] of ABILITY_NAMES) {
			const m =
				seg.match(new RegExp(`(?:${pat.source}).*?(\\d+)`, "i")) ??
				seg.match(new RegExp(`(\\d+).*?(?:${pat.source})`, "i"));
			if (m) {
				const min = Number.parseInt(m[1], 10);
				if (Number.isFinite(min)) {
					spec.minAbility = spec.minAbility ?? {};
					spec.minAbility[ability] = Math.max(
						spec.minAbility[ability] ?? 0,
						min,
					);
					matched = true;
					break;
				}
			}
		}
		if (matched) continue;

		// "Level NN"
		const levelMatch = seg.match(/level\s+(\d+)/i);
		if (levelMatch) {
			spec.minLevel = Math.max(
				spec.minLevel ?? 0,
				Number.parseInt(levelMatch[1], 10),
			);
			continue;
		}

		// "Proficiency with X"
		const profMatch = seg.match(/proficien(?:cy|t)\s+with\s+(.+)$/i);
		if (profMatch) {
			spec.requiredProficiency = spec.requiredProficiency ?? [];
			spec.requiredProficiency.push(profMatch[1].trim());
			continue;
		}

		// "Spellcasting feature" or "Pact Magic feature"
		const featureMatch = seg.match(/(.+?)\s+feature/i);
		if (featureMatch) {
			spec.requiredFeature = spec.requiredFeature ?? [];
			spec.requiredFeature.push(featureMatch[1].trim());
			continue;
		}

		unmatched.push(seg);
	}

	if (unmatched.length > 0) {
		spec.textOnly = unmatched.join("; ");
	}

	return Object.keys(spec).length > 0 ? spec : null;
}
