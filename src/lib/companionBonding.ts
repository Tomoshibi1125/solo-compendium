import { normalizeSkillName } from "@/lib/skills";
import { getProficiencyBonus } from "@/types/core-rules";

export const BONDING_RANKS = ["D", "C", "B", "A", "S"] as const;
export type BondingRank = (typeof BONDING_RANKS)[number];
export type BondingRollMode = "normal" | "advantage" | "disadvantage";

export const BONDING_DC_BY_RANK: Record<BondingRank, number> = {
	D: 12,
	C: 14,
	B: 16,
	A: 18,
	S: 20,
};

/** Canonical skill id already used by the RA skill registry. */
export const BEAST_TAMING_PROFICIENCY_ID = "animal-handling" as const;
export const BEAST_TAMING_PROFICIENCY_NAME = "Beast Taming" as const;
export const BONDING_SPECIALIZATION_BONUS = 2 as const;

export interface BondingCharacterContext {
	level: number;
	pre: number;
	job?: string | null;
	jobId?: string | null;
	path?: string | null;
	pathId?: string | null;
	skillProficiencies?: readonly string[] | null;
	skillExpertise?: readonly string[] | null;
}

export interface BondingSpecializationSource {
	sourceKind: "job" | "path";
	sourceId: string;
	label: string;
	bonus: typeof BONDING_SPECIALIZATION_BONUS;
}

export interface BondingRollSelection {
	valid: boolean;
	selectedRoll: number | null;
	reason?: string;
}

export interface BondingResolutionInput {
	rank: unknown;
	pre: number;
	level: number;
	rollMode: BondingRollMode;
	rollPrimary: number;
	rollSecondary?: number | null;
	proficiencyApplies: boolean;
	specializationBonus: 0 | typeof BONDING_SPECIALIZATION_BONUS;
}

export interface BondingResolution {
	valid: boolean;
	rank: BondingRank | null;
	dc: number | null;
	selectedRoll: number | null;
	abilityModifier: number;
	proficiencyBonus: number;
	specializationBonus: number;
	total: number | null;
	success: boolean | null;
	reason?: string;
}

const BONDING_JOB_IDS = new Set(["summoner", "contractor", "esper"]);

const BONDING_PATH_IDS = new Map<string, string>([
	["stalker--pack-leader", "stalker"],
	["stalker--hive-synchronist", "stalker"],
	["technomancer--synchronist-binary-design", "technomancer"],
]);

export function bondingDcForRank(rank: unknown): number | null {
	if (typeof rank !== "string") return null;
	const normalized = rank.trim().toUpperCase();
	return BONDING_RANKS.includes(normalized as BondingRank)
		? BONDING_DC_BY_RANK[normalized as BondingRank]
		: null;
}

export function normalizeBondingRank(rank: unknown): BondingRank | null {
	if (typeof rank !== "string") return null;
	const normalized = rank.trim().toUpperCase();
	return BONDING_RANKS.includes(normalized as BondingRank)
		? (normalized as BondingRank)
		: null;
}

export function hasBeastTamingProficiency(
	character: Pick<
		BondingCharacterContext,
		"skillProficiencies" | "skillExpertise"
	>,
): boolean {
	const accepted = new Set([
		normalizeSkillName(BEAST_TAMING_PROFICIENCY_ID),
		normalizeSkillName(BEAST_TAMING_PROFICIENCY_NAME),
		normalizeSkillName("Animal Handling"),
	]);
	const values = [
		...(character.skillProficiencies ?? []),
		...(character.skillExpertise ?? []),
	];
	return values.some((value) => accepted.has(normalizeSkillName(value)));
}

/**
 * Resolve the one source-backed +2 bonding specialization.
 *
 * C2 treats the canonical Job/Path ids as authority. Display labels remain
 * presentation only, so a stale or edited label cannot grant the bonus. If a
 * character qualifies through both an authored Path and Job, the Path source
 * wins and the numeric bonus is still applied exactly once.
 */
export function resolveBondingSpecializationSource(
	character: Pick<BondingCharacterContext, "job" | "jobId" | "path" | "pathId">,
): BondingSpecializationSource | null {
	const jobId = character.jobId?.trim() ?? "";
	const pathId = character.pathId?.trim() ?? "";
	const requiredJobId = BONDING_PATH_IDS.get(pathId);
	if (requiredJobId && jobId === requiredJobId) {
		return {
			sourceKind: "path",
			sourceId: pathId,
			label: character.path?.trim() || pathId,
			bonus: BONDING_SPECIALIZATION_BONUS,
		};
	}

	if (BONDING_JOB_IDS.has(jobId)) {
		return {
			sourceKind: "job",
			sourceId: jobId,
			label: character.job?.trim() || jobId,
			bonus: BONDING_SPECIALIZATION_BONUS,
		};
	}

	return null;
}

export function selectBondingRoll(
	mode: BondingRollMode,
	rollPrimary: number,
	rollSecondary?: number | null,
): BondingRollSelection {
	const validD20 = (value: number | null | undefined) =>
		typeof value === "number" &&
		Number.isInteger(value) &&
		value >= 1 &&
		value <= 20;

	if (!validD20(rollPrimary)) {
		return { valid: false, selectedRoll: null, reason: "ROLL_OUT_OF_RANGE" };
	}
	if (mode === "normal") {
		return { valid: true, selectedRoll: rollPrimary };
	}
	if (!validD20(rollSecondary)) {
		return {
			valid: false,
			selectedRoll: null,
			reason: "SECOND_ROLL_REQUIRED",
		};
	}
	return {
		valid: true,
		selectedRoll:
			mode === "advantage"
				? Math.max(rollPrimary, rollSecondary as number)
				: Math.min(rollPrimary, rollSecondary as number),
	};
}

export function resolveBondingAttempt(
	input: BondingResolutionInput,
): BondingResolution {
	const rank = normalizeBondingRank(input.rank);
	const dc = bondingDcForRank(input.rank);
	const abilityModifier = Number.isFinite(input.pre)
		? Math.floor((input.pre - 10) / 2)
		: 0;
	const proficiencyBonus = input.proficiencyApplies
		? getProficiencyBonus(Math.max(1, Math.trunc(input.level || 1)))
		: 0;
	const specializationBonus =
		input.specializationBonus === BONDING_SPECIALIZATION_BONUS
			? BONDING_SPECIALIZATION_BONUS
			: 0;

	if (!rank || dc == null) {
		return {
			valid: false,
			rank: null,
			dc: null,
			selectedRoll: null,
			abilityModifier,
			proficiencyBonus,
			specializationBonus,
			total: null,
			success: null,
			reason: "UNSUPPORTED_TARGET_RANK",
		};
	}

	const roll = selectBondingRoll(
		input.rollMode,
		input.rollPrimary,
		input.rollSecondary,
	);
	if (!roll.valid || roll.selectedRoll == null) {
		return {
			valid: false,
			rank,
			dc,
			selectedRoll: null,
			abilityModifier,
			proficiencyBonus,
			specializationBonus,
			total: null,
			success: null,
			reason: roll.reason,
		};
	}

	const total =
		roll.selectedRoll +
		abilityModifier +
		proficiencyBonus +
		specializationBonus;
	return {
		valid: true,
		rank,
		dc,
		selectedRoll: roll.selectedRoll,
		abilityModifier,
		proficiencyBonus,
		specializationBonus,
		total,
		success: total >= dc,
	};
}
