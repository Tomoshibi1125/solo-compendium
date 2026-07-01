import { jobCanLearnPowers } from "@/lib/jobAbilityAccess";

export type AbilityProgressionKind = "spell" | "power";
export type SpellProgression = "none" | "full" | "half" | "pact";
export type AbilityProgressionJobReference =
	| { name?: string | null }
	| string
	| null
	| undefined;

export function normalizeAbilityProgressionJobName(
	jobName: string | null | undefined,
): string {
	return (jobName || "").trim().toLowerCase();
}

export function getSpellProgressionForAbilityJob(
	job: AbilityProgressionJobReference,
): SpellProgression {
	const jobName = typeof job === "string" ? job : job?.name;
	const normalized = normalizeAbilityProgressionJobName(jobName);

	const fullCasters = ["mage", "herald", "esper", "summoner", "idol"];
	if (fullCasters.includes(normalized)) return "full";

	// Revenant is a half-caster (drain-tank rework): this half progression caps
	// SPELL tiers at 5th level. It does NOT govern martial power tiers — powers
	// are martial abilities and use the martial curve (see
	// getMaxAbilityLevelForJobAtLevel below), so they are learnable from level 1.
	const halfCasters = ["holy knight", "stalker", "technomancer", "revenant"];
	if (halfCasters.includes(normalized)) return "half";

	if (normalized === "contractor") return "pact";

	return "none";
}

function getMaxLevelForProgression(
	progression: SpellProgression,
	level: number,
): number {
	const clamped = Math.min(Math.max(level, 1), 20);

	if (progression === "none") return 0;

	if (progression === "pact") {
		if (clamped >= 9) return 5;
		if (clamped >= 7) return 4;
		if (clamped >= 5) return 3;
		if (clamped >= 3) return 2;
		return 1;
	}

	if (progression === "half") {
		if (clamped >= 17) return 5;
		if (clamped >= 13) return 4;
		if (clamped >= 9) return 3;
		if (clamped >= 5) return 2;
		if (clamped >= 2) return 1;
		return 0;
	}

	if (clamped >= 17) return 9;
	if (clamped >= 15) return 8;
	if (clamped >= 13) return 7;
	if (clamped >= 11) return 6;
	if (clamped >= 9) return 5;
	if (clamped >= 7) return 4;
	if (clamped >= 5) return 3;
	if (clamped >= 3) return 2;
	return 1;
}

export function getMaxAbilityLevelForJobAtLevel(
	job: AbilityProgressionJobReference,
	level: number,
	kind: AbilityProgressionKind,
): number {
	const jobName = typeof job === "string" ? job : job?.name;
	const progression = getSpellProgressionForAbilityJob(job);

	if (kind === "power") {
		if (!jobCanLearnPowers(jobName)) return 0;
		// Powers are MARTIAL abilities: every power-capable job — pure martial or
		// hybrid half-caster — accesses power tiers on the martial curve, so tier-1
		// powers are learnable from level 1. Only SPELL tiers follow the job's
		// (half/pact/full) spellcasting progression; a half-caster's spellcasting
		// still comes online at level 2 via its Ledger/Covenant feature.
		return getMaxLevelForProgression("full", level);
	}

	return getMaxLevelForProgression(progression, level);
}
