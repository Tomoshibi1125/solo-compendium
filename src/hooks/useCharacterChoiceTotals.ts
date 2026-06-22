import { useQuery } from "@tanstack/react-query";
import type { Job } from "@/data/compendium/jobs";
import { useCharacter } from "@/hooks/useCharacters";
import {
	type ChoiceSourceData,
	calculateTotalChoices,
} from "@/lib/choiceCalculations";

interface PathLike {
	name: string;
	features?: ChoiceSourceData["features"];
}

/**
 * Shared hook that returns the cumulative D&D-Beyond-style choice totals for
 * a character at their current level. Used by Add* dialogs to display
 * "X known of Y allowed" badges so the user can see remaining capacity.
 *
 * Mirrors the conversion that LevelUpWizardModal does locally — keep them in
 * sync (job's camelCase fields → ChoiceSourceData's snake_case fields).
 */

function toJobChoiceSource(job: Job | undefined): ChoiceSourceData | null {
	if (!job) return null;
	return {
		name: job.name,
		skill_choice_count: 0,
		awakening_features: job.awakeningFeatures ?? [],
		job_traits: job.jobTraits ?? [],
		level_choices: job.levelChoices,
		cantrips_known: job.spellcasting?.cantripsKnown,
		spells_known: job.spellcasting?.spellsKnown,
		powers_known: job.powersKnown,
		techniques_known: job.techniquesKnown,
		spellbook: job.spellbook,
	};
}

function toPathChoiceSource(
	path: PathLike | undefined,
): ChoiceSourceData | null {
	if (!path) return null;
	return {
		name: path.name,
		features: path.features ?? [],
	};
}

export interface CharacterChoiceTotals {
	cantrips: number;
	spells: number;
	powers: number;
	techniques: number;
	feats: number;
	skills: number;
	languages: number;
	tools: number;
	expertise: number;
	spellbookInscriptions: number;
}

const EMPTY_TOTALS: CharacterChoiceTotals = {
	cantrips: 0,
	spells: 0,
	powers: 0,
	techniques: 0,
	feats: 0,
	skills: 0,
	languages: 0,
	tools: 0,
	expertise: 0,
	spellbookInscriptions: 0,
};

export function useCharacterChoiceTotals(characterId: string | undefined): {
	data: CharacterChoiceTotals;
	isLoading: boolean;
} {
	const { data: character, isLoading: characterLoading } = useCharacter(
		characterId ?? "",
	);

	const { data: jobs, isLoading: jobsLoading } = useQuery({
		queryKey: ["static-jobs-for-totals"],
		queryFn: async () => {
			const module = await import("@/data/compendium/jobs");
			return module.jobs;
		},
		staleTime: Number.POSITIVE_INFINITY,
		enabled: !!character,
	});

	const { data: paths, isLoading: pathsLoading } = useQuery({
		queryKey: ["static-paths-for-totals"],
		queryFn: async () => {
			const module = await import("@/data/compendium/paths");
			return module.paths;
		},
		staleTime: Number.POSITIVE_INFINITY,
		enabled: !!character?.path,
	});

	if (!character) {
		return { data: EMPTY_TOTALS, isLoading: characterLoading };
	}

	const normalize = (value: string | null | undefined): string =>
		(value ?? "").trim().toLowerCase();
	const job = jobs?.find((j) => normalize(j.name) === normalize(character.job));
	const path = paths?.find(
		(p) => normalize(p.name) === normalize(character.path),
	);

	const jobSource = toJobChoiceSource(job);
	const pathSource = toPathChoiceSource(path);
	const totals = calculateTotalChoices(
		jobSource,
		pathSource,
		[],
		character.level ?? 1,
	);

	return {
		data: {
			cantrips: totals.cantrips,
			spells: totals.spells,
			powers: totals.powers,
			techniques: totals.techniques,
			feats: totals.feats,
			skills: totals.skills,
			languages: totals.languages,
			tools: totals.tools,
			expertise: totals.expertise,
			spellbookInscriptions: totals.spellbookInscriptions,
		},
		isLoading: characterLoading || jobsLoading || pathsLoading,
	};
}
