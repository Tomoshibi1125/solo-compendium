import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AttributesStep } from "@/components/character-engine/AttributesStep";
import { BackgroundStep } from "@/components/character-engine/BackgroundStep";
import {
	CharacterWizard,
	type WizardStep,
} from "@/components/character-engine/CharacterWizard";
import { EquipmentStep } from "@/components/character-engine/EquipmentStep";
// Component-based Character Engine imports
import { IdentityStep } from "@/components/character-engine/IdentityStep";
import { ImprintOptionCard } from "@/components/character-engine/ImprintOptionCard";
import { JobStep } from "@/components/character-engine/JobStep";
import { PathStep } from "@/components/character-engine/PathStep";
import { PersonaStep } from "@/components/character-engine/PersonaStep";
import { QuickAscendantWizard } from "@/components/character-engine/QuickAscendantWizard";
import { ReviewStep } from "@/components/character-engine/ReviewStep";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getFightingStylesForJob } from "@/data/compendium/fightingStyles";
import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";
import { useToast } from "@/hooks/use-toast";
import { useCharacters, useCreateCharacter } from "@/hooks/useCharacters";
import {
	type CharacterTemplate,
	useCharacterTemplates,
} from "@/hooks/useCharacterTemplates";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { usePublishedHomebrew } from "@/hooks/useHomebrewContent";
import { useInitializeSpellSlots } from "@/hooks/useSpellSlots";
import { useStaticJobs } from "@/hooks/useStaticJobs";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { toAbilityScoreCodes } from "@/lib/abilityScoreCodes";
import { isSafeNextPath } from "@/lib/campaignInviteUtils";
import {
	formatAttackLine,
	formatCompactActionLine,
	formatDamageLine,
} from "@/lib/canonicalActionDisplay";
import {
	type CanonicalCastableEntry,
	isCanonicalPowerLearnable,
	isCanonicalSpellLearnable,
	isCanonicalTechniqueLearnable,
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
} from "@/lib/canonicalCompendium";
import type { CharacterAbilityAccessContext } from "@/lib/characterAbilityAccess";
import {
	calculateCharacterStats,
	calculateHPMax,
	getAbilityModifier,
	getSpellcastingAbility,
} from "@/lib/characterCalculations";
import {
	addJobAwakeningBenefitsForLevel,
	addLevel1Features,
	addStartingEquipment,
	applyJobAwakeningTraitsToCharacter,
	getJobASI,
	insertCharacterFeature,
} from "@/lib/characterCreation";
import { MAX_CHARACTERS_PER_USER } from "@/lib/characterLimits";
import {
	type ChoiceSourceData,
	calculateTotalChoices,
	type LedgerChoice,
} from "@/lib/choiceCalculations";
import {
	getErrorInfo,
	getErrorMessage,
	logErrorWithContext,
} from "@/lib/errorHandling";
import {
	addLocalPower,
	addLocalSpell,
	addLocalTechnique,
	isLocalCharacterId,
} from "@/lib/guestStore";
import {
	filterPublishedHomebrewRecords,
	type HomebrewRuntimeFeature,
	type HomebrewRuntimeJob,
	type HomebrewRuntimePath,
	type HomebrewRuntimeSpell,
	mapHomebrewJobForRuntime,
	mapHomebrewPathForRuntime,
	mapHomebrewSpellForRuntime,
	runtimePathMatchesJob,
	runtimeSpellMatchesCharacter,
} from "@/lib/homebrewRuntime";
import { getStaticPathUnlockLevel } from "@/lib/levelGating";
import {
	getStaticBackgroundsAll,
	initializeProtocolData,
} from "@/lib/ProtocolDataManager";
import { getEffectiveMaxAbilityLevel } from "@/lib/pathAbilityAccess";
import { resolvePowerActionFormula } from "@/lib/powerActionFormulas";
import {
	dedupeProficiencies,
	formatDuplicatesSummary,
} from "@/lib/proficiencyDedup";
import { getAvailableFavorOptions } from "@/lib/riftFavor";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
import { resolveWeaponActionFormula } from "@/lib/weaponActionFormulas";
import type {
	Background,
	Job,
	Path,
	StaticBackground,
	StaticJob,
} from "@/types/character";
import { type AbilityScore, SKILLS } from "@/types/core-rules";

type StaticPathSource = {
	id: string;
	name: string;
	description: string;
	jobId?: string;
	jobName?: string;
	requirements?: {
		level?: number | null;
	};
	source?: string;
};

type Step =
	| "concept"
	| "abilities"
	| "job"
	| "path"
	| "background"
	| "persona"
	| "equipment"
	| "imprints"
	| "review";

const ABILITY_COSTS: Record<number, number> = {
	8: 0,
	9: 1,
	10: 2,
	11: 3,
	12: 4,
	13: 5,
	14: 7,
	15: 9,
};

const POINT_BUY_TOTAL = 27;

const STALKER_FAVORED_TERRAINS = [
	"Urban Ruins",
	"Crystalline Caverns",
	"Overgrown Gatewilds",
	"Void-Scarred Wastes",
	"Flooded Substructure",
	"Volcanic Riftfield",
	"Frozen Breach",
	"Gravitic Labyrinth",
];

const normalizeCompendiumKey = (value?: string | null) =>
	value
		?.trim()
		.toLowerCase()
		.replace(/[-\s]+/g, "") ?? "";

const asStringArray = (value: unknown): string[] =>
	Array.isArray(value)
		? value.filter((item): item is string => typeof item === "string")
		: [];

const ABILITY_SCORE_BY_NAME: Record<string, AbilityScore> = {
	agi: "AGI",
	agility: "AGI",
	int: "INT",
	intelligence: "INT",
	pre: "PRE",
	presence: "PRE",
	sense: "SENSE",
	str: "STR",
	strength: "STR",
	vit: "VIT",
	vitality: "VIT",
};

const ABILITY_ORDER: AbilityScore[] = [
	"STR",
	"AGI",
	"VIT",
	"INT",
	"SENSE",
	"PRE",
];

const normalizeAbilityScore = (value: string): AbilityScore | null =>
	ABILITY_SCORE_BY_NAME[value.trim().toLowerCase()] ?? null;

const normalizeSkillId = (value: string) => {
	const normalized = normalizeCompendiumKey(value);
	return (
		SKILLS.find(
			(skill) =>
				normalizeCompendiumKey(skill.id) === normalized ||
				normalizeCompendiumKey(skill.name) === normalized,
		)?.id ?? value
	);
};

const stringifyCreationValue = (value: unknown): string | null => {
	if (value === null || value === undefined) return null;
	if (typeof value === "string") return value.trim() || null;
	if (typeof value === "number") return `${value}`;
	if (typeof value === "boolean") return value ? "Yes" : "No";
	return null;
};

const collectCreationProperties = (entry: StaticCompendiumEntry): string[] => {
	if (Array.isArray(entry.simple_properties)) return entry.simple_properties;
	if (Array.isArray(entry.properties)) return entry.properties;
	if (entry.properties && typeof entry.properties === "object") {
		return Object.entries(entry.properties)
			.filter(([, value]) => value === true || value === "true")
			.map(([key]) => key);
	}
	return [];
};

const hasProperty = (entry: StaticCompendiumEntry, property: string) =>
	collectCreationProperties(entry).some(
		(value) =>
			normalizeCompendiumKey(value) === normalizeCompendiumKey(property),
	);

const isRangedEquipment = (entry: StaticCompendiumEntry) => {
	const weaponType = stringifyCreationValue(entry.weapon_type);
	const range = stringifyCreationValue(entry.range);
	return Boolean(
		weaponType?.toLowerCase().includes("ranged") ||
			range?.includes("/") ||
			hasProperty(entry, "ammunition") ||
			hasProperty(entry, "thrown"),
	);
};

const appendUnique = (current: string[], value: string) => {
	if (!value) return current;
	return current.includes(value) ? current : [...current, value];
};

const toggleLimitedSelection = (
	current: string[],
	value: string,
	limit: number,
) => {
	if (current.includes(value)) {
		return current.filter((entry) => entry !== value);
	}
	if (current.length >= limit) {
		return current;
	}
	return appendUnique(current, value);
};

const isRequiredChoiceBucketReady = (
	selected: number,
	required: number,
	available: number,
	loading: boolean,
) => {
	if (required <= 0) return true;
	return !loading && available >= required && selected === required;
};

const insertHomebrewRuntimeFeatures = async (
	characterId: string,
	features: HomebrewRuntimeFeature[],
	level: number,
	source: string,
) => {
	for (const feature of features.filter((entry) => entry.level === level)) {
		await insertCharacterFeature(characterId, {
			name: feature.name,
			source,
			level_acquired: level,
			description: feature.description,
			action_type: feature.action_type,
			uses_max: null,
			uses_current: null,
			recharge: feature.recharge,
			is_active: true,
			modifiers: feature.modifiers ? (feature.modifiers as Json) : null,
			homebrew_id: feature.homebrew_id,
		});
	}
};

const buildCreatorProfileNotes = (profile: {
	alignment: string;
	personalityTrait: string;
	ideal: string;
	bond: string;
	flaw: string;
}): string | null => {
	const rows = [
		["Protocol Alignment", profile.alignment],
		["Personality Signal", profile.personalityTrait],
		["Core Drive", profile.ideal],
		["Anchor / Bond", profile.bond],
		["Fault Line", profile.flaw],
	].filter(([, value]) => value.trim().length > 0);
	if (rows.length === 0) return null;
	return [
		"[Creator Profile]",
		...rows.map(([label, value]) => `${label}: ${value.trim()}`),
	].join("\n");
};

type StaticJobCreationLedger = StaticJob & {
	levelChoices?: LedgerChoice[];
	powersKnown?: number[];
	techniquesKnown?: number[];
	spellbook?: {
		atCreation: number;
		perLevel: number;
		label: string;
		startLevel?: number;
	};
};

const CharacterNew = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const requestedNext = searchParams.get("next");
	const safeNext = isSafeNextPath(requestedNext) ? requestedNext : null;
	const queryCampaignId =
		searchParams.get("campaignId") ?? searchParams.get("campaign_id");
	const nextCampaignId =
		safeNext?.match(/^\/campaigns\/([^/?#]+)/)?.[1] ?? null;
	const homebrewCampaignId = queryCampaignId ?? nextCampaignId;
	const { toast } = useToast();
	const createCharacterMutation = useCreateCharacter();
	const { data: existingCharacters = [] } = useCharacters();
	const initializeSpellSlots = useInitializeSpellSlots();

	const { data: templates } = useCharacterTemplates();
	const { data: staticJobCatalog = [] } = useStaticJobs();
	const { data: canonicalEquipmentEntries = [] } = useQuery({
		queryKey: ["creation-review-canonical-equipment", homebrewCampaignId],
		queryFn: async () => {
			const { listCanonicalEntries } = await import(
				"@/lib/canonicalCompendium"
			);
			const [equipment, items, relics] = await Promise.all([
				listCanonicalEntries("equipment", undefined, {
					campaignId: homebrewCampaignId,
				}),
				listCanonicalEntries("items", undefined, {
					campaignId: homebrewCampaignId,
				}),
				listCanonicalEntries("relics", undefined, {
					campaignId: homebrewCampaignId,
				}),
			]);
			return [...equipment, ...items, ...relics];
		},
		staleTime: 5 * 60 * 1000,
	});
	const { data: publishedHomebrew = [] } = usePublishedHomebrew(
		["job", "path", "spell"],
		homebrewCampaignId,
	);
	const ascendantTools = useAscendantTools();

	const [currentStep, setCurrentStep] = useState<Step>("concept");
	const [loading, setLoading] = useState(false);
	const [quickAscendantOpen, setQuickAscendantOpen] = useState(false);

	// Character data state
	const [name, setName] = useState("");
	const [appearance, setAppearance] = useState("");
	const [backstory, setBackstory] = useState("");
	const [abilityMethod, setAbilityMethod] = useState<
		"standard" | "point-buy" | "manual"
	>("standard");
	const [rolledStats, setRolledStats] = useState<
		{ id: string; value: number }[]
	>([]);
	const [abilities, setAbilities] = useState<Record<AbilityScore, number>>({
		STR: 10,
		AGI: 10,
		VIT: 10,
		INT: 10,
		SENSE: 10,
		PRE: 10,
	});
	const [selectedJob, setSelectedJob] = useState<string>("");
	const [selectedPath, setSelectedPath] = useState<string>("");
	const [selectedBackground, setSelectedBackground] = useState<string>("");
	const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
	const [equipmentChoices, setEquipmentChoices] = useState<
		Record<number, string>
	>({});
	const [selectedPowerIds, setSelectedPowerIds] = useState<string[]>([]);
	const [selectedTechniqueIds, setSelectedTechniqueIds] = useState<string[]>(
		[],
	);
	const [selectedSpellIds, setSelectedSpellIds] = useState<string[]>([]);
	const [selectedSpellbookIds, setSelectedSpellbookIds] = useState<string[]>(
		[],
	);
	const [selectedCantripIds, setSelectedCantripIds] = useState<string[]>([]);
	const [selectedFightingStyleIds, setSelectedFightingStyleIds] = useState<
		string[]
	>([]);
	const [selectedSpecialistTraining, setSelectedSpecialistTraining] = useState<
		string[]
	>([]);
	const [selectedFavoredTerrains, setSelectedFavoredTerrains] = useState<
		string[]
	>([]);
	const [alignment, setAlignment] = useState("");
	const [personalityTrait, setPersonalityTrait] = useState("");
	const [ideal, setIdeal] = useState("");
	const [bond, setBond] = useState("");
	const [flaw, setFlaw] = useState("");

	const getPointBuyCost = (score: number) => ABILITY_COSTS[score] ?? 0;

	const pointBuySpent =
		abilityMethod === "point-buy"
			? Object.values(abilities).reduce(
					(sum, score) => sum + getPointBuyCost(score),
					0,
				)
			: 0;
	const pointBuyRemaining = POINT_BUY_TOTAL - pointBuySpent;

	const handleJobChange = (jobId: string) => {
		setSelectedJob(jobId);
		setSelectedPath("");
		setSelectedSkills([]);
		setSelectedLanguages([]);
		setEquipmentChoices({});
		setSelectedPowerIds([]);
		setSelectedTechniqueIds([]);
		setSelectedSpellIds([]);
		setSelectedSpellbookIds([]);
		setSelectedCantripIds([]);
		setSelectedFightingStyleIds([]);
		setSelectedSpecialistTraining([]);
		setSelectedFavoredTerrains([]);
	};

	const { data: jobs = [] } = useQuery({
		queryKey: ["jobs", staticJobCatalog.length],
		queryFn: async () => {
			const staticJobSource =
				staticJobCatalog.length > 0
					? staticJobCatalog
					: ((await import("@/data/compendium/jobs"))
							.jobs as unknown as StaticJob[]);

			return staticJobSource.map((job) => ({
				...job,
				id: job.id,
				name: job.name,
				display_name: job.name,
				description: job.description,
				hit_die: Number.parseInt(job.hitDie?.replace("1d", "") || "8", 10),
				primary_abilities: (job.primary_abilities ||
					(job.primaryAbility ? [job.primaryAbility] : [])) as AbilityScore[],
				saving_throw_proficiencies: toAbilityScoreCodes(
					job.saving_throw_proficiencies,
					job.saving_throws,
					job.savingThrows,
				),
				armor_proficiencies: (job.armor_proficiencies ||
					job.armorProficiencies ||
					[]) as string[],
				weapon_proficiencies: (job.weapon_proficiencies ||
					job.weaponProficiencies ||
					[]) as string[],
				tool_proficiencies: (job.tool_proficiencies ||
					job.toolProficiencies ||
					[]) as string[],
				skill_choices: (job.skillChoices || []) as string[],
				skill_choice_count: 2,
				source_book: job.source || "Rift Ascendant Canon",
				class_features: (job.classFeatures || null) as Json,
				spellcasting: (job.spellcasting || null) as Json,
				starting_equipment: (job.startingEquipment || null) as Json,
				hit_points_at_first_level: job.hitPointsAtFirstLevel || null,
				hit_points_at_higher_levels: job.hitPointsAtHigherLevels || null,
				regent_prerequisites: null,
				aliases: [],
				flavor_text: null,
				generated_reason: null,
				image_url: job.image || null,
				tags: [],
				license_note: null,
				secondary_abilities: [],
				source_kind: "canon",
				source_name: job.source || "Rift Ascendant Canon",
				theme_tags: [],
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})) as unknown as Job[];
		},
	});

	const homebrewJobs = useMemo<HomebrewRuntimeJob[]>(
		() =>
			filterPublishedHomebrewRecords(publishedHomebrew, "job").map(
				mapHomebrewJobForRuntime,
			),
		[publishedHomebrew],
	);
	const homebrewPaths = useMemo<HomebrewRuntimePath[]>(
		() =>
			filterPublishedHomebrewRecords(publishedHomebrew, "path").map(
				mapHomebrewPathForRuntime,
			),
		[publishedHomebrew],
	);
	const homebrewSpells = useMemo<HomebrewRuntimeSpell[]>(
		() =>
			filterPublishedHomebrewRecords(publishedHomebrew, "spell").map(
				mapHomebrewSpellForRuntime,
			),
		[publishedHomebrew],
	);
	const allJobs: (Job & { _homebrew?: boolean })[] = useMemo(
		() => [
			...jobs,
			...(homebrewJobs as unknown as (Job & { _homebrew?: boolean })[]),
		],
		[jobs, homebrewJobs],
	);
	const selectedHomebrewJob = useMemo(
		() => homebrewJobs.find((job) => job.id === selectedJob),
		[homebrewJobs, selectedJob],
	);

	const jobASI = useMemo(() => {
		if (!selectedJob) return {} as Record<AbilityScore, number>;
		const dbJob = allJobs.find((j) => j.id === selectedJob);
		if (!dbJob) return {} as Record<AbilityScore, number>;
		const sourceJob =
			staticJobCatalog.find((j) => j.name === dbJob.name) ??
			selectedHomebrewJob ??
			dbJob;
		return getJobASI(dbJob.name, 1, sourceJob) as Record<AbilityScore, number>;
	}, [allJobs, selectedHomebrewJob, selectedJob, staticJobCatalog]);

	const effectiveAbilities = useMemo(() => {
		const next = { ...abilities };
		for (const [abilityKey, bonus] of Object.entries(jobASI)) {
			const key = abilityKey as AbilityScore;
			if (key in next) next[key] += bonus;
		}
		return next;
	}, [abilities, jobASI]);

	const staticJobData = useMemo<StaticJob | undefined>(() => {
		if (selectedHomebrewJob) return selectedHomebrewJob as unknown as StaticJob;
		if (!selectedJob) return undefined;
		const jobName = allJobs.find((j) => j.id === selectedJob)?.name;
		if (!jobName) return undefined;
		return staticJobCatalog.find((j) => j.name === jobName);
	}, [selectedHomebrewJob, selectedJob, allJobs, staticJobCatalog]);

	const staticJobLedgerData = staticJobData as
		| StaticJobCreationLedger
		| undefined;

	const jobAwakeningAtCreation = useMemo(() => {
		const features =
			staticJobData?.awakeningFeatures ??
			(staticJobData as unknown as Record<string, unknown>)?.awakening_features;
		if (!Array.isArray(features)) return [];
		return features.filter((f: Record<string, unknown>) => f.level === 1);
	}, [staticJobData]);

	const jobTraitsAtCreation = useMemo(() => {
		const traits =
			staticJobData?.jobTraits ??
			(staticJobData as unknown as Record<string, unknown>)?.job_traits;
		if (!Array.isArray(traits)) return [];
		return traits as { name: string; description?: string }[];
	}, [staticJobData]);

	const { data: paths = [] } = useQuery({
		queryKey: [
			"paths",
			selectedJob,
			homebrewPaths.map((path) => path.id).join(","),
		],
		queryFn: async () => {
			if (!selectedJob) return [];

			const jobName = allJobs.find((job) => job.id === selectedJob)?.name ?? "";
			const selectedJobKey = normalizeCompendiumKey(jobName);
			const staticPathSource = ((await import("@/data/compendium/paths"))
				.paths ?? []) as unknown as StaticPathSource[];

			const staticMapped = staticPathSource
				.filter((path) => {
					const pathKeys = [path.jobId, path.jobName]
						.map((value) => normalizeCompendiumKey(value))
						.filter(Boolean);
					return pathKeys.includes(selectedJobKey);
				})
				.map((path) => ({
					...(path as unknown as Path),
					display_name: path.name,
					job_id: path.jobId ?? selectedJob,
					path_level: getStaticPathUnlockLevel(path),
					source_book: path.source ?? "Rift Ascendant Canon",
				})) as unknown as Path[];
			const homebrewMapped = homebrewPaths
				.filter((path) => runtimePathMatchesJob(path, selectedJob, jobName))
				.map((path) => ({
					...(path as unknown as Path),
					display_name: path.display_name || path.name,
					job_id: path.job_id ?? path.jobId ?? selectedJob,
					path_level: path.path_level,
					source_book: path.source_book,
				})) as unknown as Path[];
			const mapped = [...staticMapped, ...homebrewMapped];

			// Respect sourcebook entitlements (returns all rows when the user has
			// no accessible set configured — i.e. they see canon content).
			return filterRowsBySourcebookAccess(
				mapped,
				(row) => (row as { source_book?: string | null }).source_book,
			);
		},
		enabled: !!selectedJob,
	});

	const pathsAvailableAtCreation = useMemo(() => {
		return paths.filter(
			(path) =>
				((path as { path_level?: number | null }).path_level ??
					getStaticPathUnlockLevel(
						path as unknown as {
							level?: number | null;
							requirements?: { level?: number | null } | null;
						},
					)) === 1,
		);
	}, [paths]);

	const isPathRequiredAtCreation = pathsAvailableAtCreation.length > 0;

	const { data: backgrounds = [] } = useQuery({
		queryKey: ["backgrounds"],
		queryFn: async () => {
			// Backgrounds come from the async compendium registry. If the
			// initial pre-load (main.tsx) is still in flight when this query
			// runs, awaiting initialization here guarantees we never return
			// an empty list and strand the wizard on the Background step.
			await initializeProtocolData();
			const mapped = getStaticBackgroundsAll().map((b) => ({
				...b,
				display_name: b.name,
				source_book:
					(b as unknown as { source?: string }).source ??
					"Rift Ascendant Canon",
			})) as unknown as Background[];
			return filterRowsBySourcebookAccess(
				mapped,
				(row) => (row as { source_book?: string | null }).source_book,
			);
		},
	});

	const allBackgrounds: Background[] = [...backgrounds];

	const jobData = allJobs.find((j) => j.id === selectedJob);
	const selectedBackgroundData = allBackgrounds.find(
		(background) => background.id === selectedBackground,
	);

	const totalChoices = useMemo(() => {
		const selectedPathRow =
			selectedPath && selectedPath !== "none"
				? pathsAvailableAtCreation.find((p: Path) => p.id === selectedPath)
				: null;
		const combinedJobData =
			jobData || staticJobData
				? {
						...jobData,
						...staticJobData,
						awakening_features:
							staticJobData?.awakeningFeatures ??
							(staticJobData as unknown as Record<string, unknown>)
								?.awakening_features ??
							(jobData as { awakening_features?: [] } | undefined)
								?.awakening_features ??
							[],
						job_traits:
							staticJobData?.jobTraits ??
							(staticJobData as unknown as Record<string, unknown>)
								?.job_traits ??
							(jobData as { job_traits?: [] } | undefined)?.job_traits ??
							[],
						level_choices: staticJobLedgerData?.levelChoices,
						cantrips_known: staticJobData?.spellcasting?.cantripsKnown,
						spells_known: staticJobData?.spellcasting?.spellsKnown,
						powers_known: staticJobLedgerData?.powersKnown,
						techniques_known: staticJobLedgerData?.techniquesKnown,
						spellbook: staticJobLedgerData?.spellbook,
					}
				: null;
		return calculateTotalChoices(
			combinedJobData as Parameters<typeof calculateTotalChoices>[0],
			selectedPathRow,
			selectedBackgroundData
				? [selectedBackgroundData as unknown as ChoiceSourceData]
				: [],
			1,
		);
	}, [
		jobData,
		staticJobData,
		staticJobLedgerData,
		selectedPath,
		pathsAvailableAtCreation,
		selectedBackgroundData,
	]);

	const selectedPathName = useMemo(() => {
		if (!selectedPath || selectedPath === "none") return null;
		return paths.find((path) => path.id === selectedPath)?.name ?? null;
	}, [paths, selectedPath]);

	const requiredPowerChoices = Math.max(0, totalChoices.powers);
	const requiredTechniqueChoices = Math.max(0, totalChoices.techniques);
	const requiredCantripChoices = Math.max(0, totalChoices.cantrips);
	const requiredSpellChoices = Math.max(0, totalChoices.spells);
	const requiredSpellbookInscriptions = Math.max(
		0,
		totalChoices.spellbookInscriptions,
	);
	const requiredFightingStyleChoices = Math.max(0, totalChoices.fightingStyles);
	const requiredSpecialistTrainingChoices = Math.max(0, totalChoices.expertise);
	const requiredFavoredTerrainChoices = Math.max(
		0,
		totalChoices.favoredTerrains,
	);
	const showImprintStep =
		requiredPowerChoices > 0 ||
		requiredTechniqueChoices > 0 ||
		requiredCantripChoices > 0 ||
		requiredSpellChoices > 0 ||
		requiredSpellbookInscriptions > 0 ||
		requiredFightingStyleChoices > 0 ||
		requiredSpecialistTrainingChoices > 0 ||
		requiredFavoredTerrainChoices > 0;

	const creationLedgerChoices = useMemo(
		() =>
			(staticJobLedgerData?.levelChoices ?? []).filter(
				(choice) => choice.level === 1,
			),
		[staticJobLedgerData?.levelChoices],
	);

	const fightingStyleLedger = creationLedgerChoices.find(
		(choice) => choice.type === "fighting-style",
	);

	const availableFightingStyles = useMemo(() => {
		const armorProficiencies =
			staticJobData?.armorProficiencies ?? staticJobData?.armor_proficiencies;
		const gated = getFightingStylesForJob(armorProficiencies);
		const allowedIds = new Set(fightingStyleLedger?.options ?? []);
		return allowedIds.size > 0
			? gated.filter((style) => allowedIds.has(style.id))
			: gated;
	}, [
		fightingStyleLedger?.options,
		staticJobData?.armorProficiencies,
		staticJobData?.armor_proficiencies,
	]);

	const specialistTrainingOptions = useMemo(() => {
		if (requiredSpecialistTrainingChoices <= 0) return [];
		const skillOptions = selectedSkills.map((skill) => ({
			id: skill,
			label: skill,
			kind: "skill",
		}));
		const toolOptions = [
			...(staticJobData?.toolProficiencies ??
				staticJobData?.tool_proficiencies ??
				[]),
		].map((tool) => ({ id: tool, label: tool, kind: "tool" }));
		return [...skillOptions, ...toolOptions];
	}, [
		requiredSpecialistTrainingChoices,
		selectedSkills,
		staticJobData?.toolProficiencies,
		staticJobData?.tool_proficiencies,
	]);

	const personalityOptions = asStringArray(
		(selectedBackgroundData as { personality_traits?: unknown } | undefined)
			?.personality_traits,
	);
	const idealOptions = asStringArray(
		(selectedBackgroundData as { ideals?: unknown } | undefined)?.ideals,
	);
	const bondOptions = asStringArray(
		(selectedBackgroundData as { bonds?: unknown } | undefined)?.bonds,
	);
	const flawOptions = asStringArray(
		(selectedBackgroundData as { flaws?: unknown } | undefined)?.flaws,
	);
	const creationSpellLevelCap = jobData?.name
		? getEffectiveMaxAbilityLevel({
				jobName: jobData.name,
				pathName: selectedPathName,
				characterLevel: 1,
				kind: "spell",
			})
		: 0;

	const { data: availablePowers = [], isLoading: powersLoading } = useQuery<
		CanonicalCastableEntry[]
	>({
		queryKey: [
			"creation-powers",
			selectedJob,
			selectedPathName,
			requiredPowerChoices,
			homebrewCampaignId,
		],
		queryFn: async () => {
			if (!jobData?.name || requiredPowerChoices <= 0) return [];
			return listLearnablePowers({
				accessContext: { campaignId: homebrewCampaignId },
				jobName: jobData.name,
				pathName: selectedPathName,
				characterLevel: 1,
			});
		},
		enabled: !!jobData?.name && requiredPowerChoices > 0,
	});

	const { data: availableTechniques = [], isLoading: techniquesLoading } =
		useQuery<StaticCompendiumEntry[]>({
			queryKey: [
				"creation-techniques",
				selectedJob,
				selectedPathName,
				requiredTechniqueChoices,
				homebrewCampaignId,
			],
			queryFn: async () => {
				if (!jobData?.name || requiredTechniqueChoices <= 0) return [];
				return listLearnableTechniques({
					accessContext: { campaignId: homebrewCampaignId },
					jobName: jobData.name,
					pathName: selectedPathName,
					characterLevel: 1,
					maxLevel: 1,
				});
			},
			enabled: !!jobData?.name && requiredTechniqueChoices > 0,
		});

	const { data: availableCantrips = [], isLoading: cantripsLoading } = useQuery<
		CanonicalCastableEntry[]
	>({
		queryKey: [
			"creation-cantrips",
			selectedJob,
			selectedPathName,
			requiredCantripChoices,
			homebrewCampaignId,
			homebrewSpells.map((spell) => spell.id).join(","),
		],
		queryFn: async () => {
			if (!jobData?.name || requiredCantripChoices <= 0) return [];
			const spells = await listLearnableSpells({
				accessContext: { campaignId: homebrewCampaignId },
				jobName: jobData.name,
				pathName: selectedPathName,
				characterLevel: 1,
				maxPowerLevel: 0,
			});
			const matchingHomebrew = homebrewSpells.filter(
				(spell) =>
					spell.power_level === 0 &&
					runtimeSpellMatchesCharacter(spell, jobData.name, selectedPathName),
			);
			return [
				...spells.filter((spell) => spell.power_level === 0),
				...(matchingHomebrew as unknown as CanonicalCastableEntry[]),
			];
		},
		enabled: !!jobData?.name && requiredCantripChoices > 0,
	});

	const { data: availableSpells = [], isLoading: spellsLoading } = useQuery<
		CanonicalCastableEntry[]
	>({
		queryKey: [
			"creation-spells",
			selectedJob,
			selectedPathName,
			requiredSpellChoices,
			homebrewCampaignId,
			homebrewSpells.map((spell) => spell.id).join(","),
		],
		queryFn: async () => {
			if (!jobData?.name || requiredSpellChoices <= 0) return [];
			const spells = await listLearnableSpells({
				accessContext: { campaignId: homebrewCampaignId },
				jobName: jobData.name,
				pathName: selectedPathName,
				characterLevel: 1,
			});
			const matchingHomebrew = homebrewSpells.filter(
				(spell) =>
					spell.power_level > 0 &&
					spell.power_level <= creationSpellLevelCap &&
					runtimeSpellMatchesCharacter(spell, jobData.name, selectedPathName),
			);
			return [
				...spells.filter((spell) => spell.power_level > 0),
				...(matchingHomebrew as unknown as CanonicalCastableEntry[]),
			];
		},
		enabled: !!jobData?.name && requiredSpellChoices > 0,
	});

	const { data: availableSpellbookSpells = [], isLoading: spellbookLoading } =
		useQuery<CanonicalCastableEntry[]>({
			queryKey: [
				"creation-spellbook",
				selectedJob,
				selectedPathName,
				requiredSpellbookInscriptions,
				homebrewCampaignId,
				homebrewSpells.map((spell) => spell.id).join(","),
			],
			queryFn: async () => {
				if (!jobData?.name || requiredSpellbookInscriptions <= 0) return [];
				const spells = await listLearnableSpells({
					accessContext: { campaignId: homebrewCampaignId },
					jobName: jobData.name,
					pathName: selectedPathName,
					characterLevel: 1,
				});
				const matchingHomebrew = homebrewSpells.filter(
					(spell) =>
						spell.power_level > 0 &&
						spell.power_level <= creationSpellLevelCap &&
						runtimeSpellMatchesCharacter(spell, jobData.name, selectedPathName),
				);
				return [
					...spells.filter((spell) => spell.power_level > 0),
					...(matchingHomebrew as unknown as CanonicalCastableEntry[]),
				];
			},
			enabled: !!jobData?.name && requiredSpellbookInscriptions > 0,
		});

	useEffect(() => {
		setSelectedPowerIds((current) => {
			const next = current.filter((id) =>
				availablePowers.some((power) => power.id === id),
			);
			return next.length === current.length ? current : next;
		});
	}, [availablePowers]);

	useEffect(() => {
		setSelectedTechniqueIds((current) => {
			const next = current.filter((id) =>
				availableTechniques.some((technique) => technique.id === id),
			);
			return next.length === current.length ? current : next;
		});
	}, [availableTechniques]);

	useEffect(() => {
		setSelectedCantripIds((current) => {
			const next = current.filter((id) =>
				availableCantrips.some((cantrip) => cantrip.id === id),
			);
			return next.length === current.length ? current : next;
		});
	}, [availableCantrips]);

	useEffect(() => {
		setSelectedSpellIds((current) => {
			const next = current.filter((id) =>
				availableSpells.some((spell) => spell.id === id),
			);
			return next.length === current.length ? current : next;
		});
	}, [availableSpells]);

	useEffect(() => {
		setSelectedSpellbookIds((current) => {
			const next = current.filter((id) =>
				availableSpellbookSpells.some((spell) => spell.id === id),
			);
			return next.length === current.length ? current : next;
		});
	}, [availableSpellbookSpells]);

	useEffect(() => {
		setSelectedFightingStyleIds((current) => {
			const next = current.filter((id) =>
				availableFightingStyles.some((style) => style.id === id),
			);
			return next.length === current.length ? current : next;
		});
	}, [availableFightingStyles]);

	useEffect(() => {
		const optionIds = new Set(
			specialistTrainingOptions.map((option) => option.id),
		);
		setSelectedSpecialistTraining((current) => {
			const next = current.filter((id) => optionIds.has(id));
			return next.length === current.length ? current : next;
		});
	}, [specialistTrainingOptions]);

	const handleApplyTemplate = (
		template: CharacterTemplate & {
			abilities: Record<AbilityScore, number>;
			skills: string[];
			job: string;
			background: string;
			equipment: Record<number, string>;
		},
	) => {
		const job = allJobs.find((j) => j.name === template.job);
		const bg = allBackgrounds.find((b) => b.name === template.background);
		if (job) {
			setSelectedJob(job.id);
			setSelectedPath("");
		}
		if (bg) {
			setSelectedBackground(bg.id);
		}
		setAbilities(template.abilities);
		setAbilityMethod("manual");
		setSelectedSkills(template.skills);
		setEquipmentChoices(template.equipment as Record<number, string>);
		toast({
			title: "Template Applied",
			description: `Applied ${template.name}.`,
		});
	};

	const steps: { id: Step; name: string }[] = [
		{ id: "concept", name: "Concept" },
		{ id: "job", name: "Job" },
		...(isPathRequiredAtCreation
			? ([{ id: "path", name: "Path" }] as const)
			: []),
		...(showImprintStep
			? ([{ id: "imprints", name: "Imprints" }] as const)
			: []),
		{ id: "abilities", name: "Abilities" },
		{ id: "background", name: "Background" },
		{ id: "persona", name: "Persona" },
		{ id: "equipment", name: "Equipment" },
		{ id: "review", name: "Review" },
	];

	const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

	const handleStandardArray = () => {
		const scores = [15, 14, 13, 12, 10, 8];
		setAbilities({
			STR: scores[0],
			AGI: scores[1],
			VIT: scores[2],
			INT: scores[3],
			SENSE: scores[4],
			PRE: scores[5],
		});
	};

	const handleRollStats = () => {
		const roll4d6 = () => {
			const rolls = Array.from(
				{ length: 4 },
				() => Math.floor(Math.random() * 6) + 1,
			);
			rolls.sort((a, b) => b - a);
			return rolls[0] + rolls[1] + rolls[2];
		};
		const newStats = Array.from({ length: 6 }, (_, i) => ({
			id: `roll-${Date.now()}-${i}`,
			value: roll4d6(),
		})).sort((a, b) => b.value - a.value);
		setRolledStats(newStats);
		const sortedValues = [...newStats]
			.map((s) => s.value)
			.sort((a, b) => b - a);
		setAbilities({
			STR: sortedValues[0],
			AGI: sortedValues[1],
			VIT: sortedValues[2],
			INT: sortedValues[3],
			SENSE: sortedValues[4],
			PRE: sortedValues[5],
		});
	};

	const handleNext = () => {
		if (currentStepIndex < steps.length - 1) {
			setCurrentStep(steps[currentStepIndex + 1].id);
		}
	};

	const handleBack = () => {
		if (currentStepIndex > 0) {
			setCurrentStep(steps[currentStepIndex - 1].id);
		}
	};

	const handleCreate = async () => {
		if (loading) return;
		if (!name.trim()) {
			toast({ title: "Name required", variant: "destructive" });
			return;
		}
		if (existingCharacters.length >= MAX_CHARACTERS_PER_USER) {
			toast({
				title: "Character limit reached",
				description: `You can have at most ${MAX_CHARACTERS_PER_USER} characters. Delete one to create another.`,
				variant: "destructive",
			});
			return;
		}
		if (
			existingCharacters.some(
				(c) => c.name?.trim().toLowerCase() === name.trim().toLowerCase(),
			)
		) {
			toast({
				title: "Duplicate name",
				description: `You already have a character named "${name.trim()}". Each character must have a unique name.`,
				variant: "destructive",
			});
			return;
		}
		if (!selectedJob || !selectedBackground) {
			toast({ title: "Job and Background required", variant: "destructive" });
			return;
		}
		if (selectedPowerIds.length < requiredPowerChoices) {
			toast({
				title: "Power imprint required",
				description: `Select ${requiredPowerChoices} power${requiredPowerChoices === 1 ? "" : "s"} before awakening.`,
				variant: "destructive",
			});
			return;
		}
		if (selectedTechniqueIds.length < requiredTechniqueChoices) {
			toast({
				title: "Technique protocol required",
				description: `Select ${requiredTechniqueChoices} technique${requiredTechniqueChoices === 1 ? "" : "s"} before awakening.`,
				variant: "destructive",
			});
			return;
		}
		if (selectedCantripIds.length < requiredCantripChoices) {
			toast({
				title: "Cantrip alignment required",
				description: `Select ${requiredCantripChoices} cantrip${requiredCantripChoices === 1 ? "" : "s"} before awakening.`,
				variant: "destructive",
			});
			return;
		}
		if (selectedSpellIds.length < requiredSpellChoices) {
			toast({
				title: "Power inscription required",
				description: `Select ${requiredSpellChoices} power inscription${requiredSpellChoices === 1 ? "" : "s"} before awakening.`,
				variant: "destructive",
			});
			return;
		}
		if (selectedSpellbookIds.length < requiredSpellbookInscriptions) {
			toast({
				title: "Spellbook inscription required",
				description: `Select ${requiredSpellbookInscriptions} spellbook inscription${requiredSpellbookInscriptions === 1 ? "" : "s"} before awakening.`,
				variant: "destructive",
			});
			return;
		}
		if (selectedFightingStyleIds.length < requiredFightingStyleChoices) {
			toast({
				title: "Fighting Style required",
				description: `Select ${requiredFightingStyleChoices} Fighting Style${requiredFightingStyleChoices === 1 ? "" : "s"} before awakening.`,
				variant: "destructive",
			});
			return;
		}
		if (selectedSpecialistTraining.length < requiredSpecialistTrainingChoices) {
			toast({
				title: "Specialist Training required",
				description: `Select ${requiredSpecialistTrainingChoices} training focus${requiredSpecialistTrainingChoices === 1 ? "" : "es"} before awakening.`,
				variant: "destructive",
			});
			return;
		}
		if (selectedFavoredTerrains.length < requiredFavoredTerrainChoices) {
			toast({
				title: "Favored Terrain required",
				description: `Select ${requiredFavoredTerrainChoices} gate terrain${requiredFavoredTerrainChoices === 1 ? "" : "s"} before awakening.`,
				variant: "destructive",
			});
			return;
		}

		setLoading(true);
		let createdCharacterId: string | null = null;
		try {
			// Ensure static compendium data is loaded before creation.
			await initializeProtocolData();

			const dbJob = allJobs.find((j) => j.id === selectedJob);
			const dbBg = backgrounds.find((b) => b.id === selectedBackground);
			if (!dbJob || !dbBg) throw new Error("Job or Background missing");

			// Ensure we use the enriched static data for mapping
			const staticJobSource =
				staticJobCatalog.length > 0
					? staticJobCatalog
					: ((await import("@/data/compendium/jobs"))
							.jobs as unknown as StaticJob[]);
			const job =
				selectedHomebrewJob ??
				staticJobSource.find((j: StaticJob) => j.name === dbJob.name);
			let bgData = (
				getStaticBackgroundsAll() as unknown as StaticBackground[]
			).find((b: StaticBackground) => b.name === dbBg.name);
			if (!bgData) {
				const { allBackgrounds } = await import(
					"@/data/compendium/backgrounds-index"
				);
				bgData = (allBackgrounds as unknown as StaticBackground[]).find(
					(b: StaticBackground) => b.name === dbBg.name,
				);
			}

			if (!job || !bgData) throw new Error("Enhanced data missing");

			const level = 1;
			const vitModifier = getAbilityModifier(effectiveAbilities.VIT);
			const hitDieSize =
				typeof dbJob.hit_die === "number" && Number.isFinite(dbJob.hit_die)
					? dbJob.hit_die
					: 8;
			const jobImage =
				typeof job.image === "string" && job.image.trim().length > 0
					? job.image
					: null;
			const jobSpeed =
				typeof job.speed === "number" && Number.isFinite(job.speed)
					? job.speed
					: 30;
			const hpMax = calculateHPMax(level, hitDieSize, vitModifier);
			// Racial ASI authority: for canon (static) jobs we persist the BASE
			// ability scores and let the idempotent applyJobAwakeningTraitsToCharacter
			// apply the racial ASI exactly once — it updates the characters row AND
			// character_abilities and writes a marker feature, and is safe to re-run
			// (see racialAsiRegression). Homebrew runtime jobs don't expose ASI fields
			// to that helper (getRawJobASI finds none, so it applies/markers nothing),
			// so we bake any name-resolved ASI into the stored row here instead.
			const creationAbilities = selectedHomebrewJob
				? { ...effectiveAbilities }
				: { ...abilities };

			// D&D Beyond Quickbuilder parity (#11): detect duplicate proficiency
			// grants between Job and Background and de-dupe before persisting.
			// Surface a toast so the user knows their picks overlapped.
			const skillsResult = dedupeProficiencies([
				...selectedSkills,
				...(bgData.skill_proficiencies || []),
			]);
			const toolsResult = dedupeProficiencies([
				...(job.tool_proficiencies || job.toolProficiencies || []),
				...(bgData.tool_proficiencies || bgData.toolProficiencies || []),
			]);
			const skillExpertiseResult = dedupeProficiencies(
				selectedSpecialistTraining.filter((selection) =>
					skillsResult.unique.includes(selection),
				),
			);
			const weaponsResult = dedupeProficiencies([
				...(job.weaponProficiencies || job.weapon_proficiencies || []),
				...(bgData.weaponProficiencies || bgData.weapon_proficiencies || []),
			]);
			const armorsResult = dedupeProficiencies([
				...(job.armorProficiencies || job.armor_proficiencies || []),
				...(bgData.armorProficiencies || bgData.armor_proficiencies || []),
			]);

			const allDuplicates = [
				...skillsResult.duplicates,
				...toolsResult.duplicates,
				...weaponsResult.duplicates,
				...armorsResult.duplicates,
			];
			const dupSummary = formatDuplicatesSummary(allDuplicates);
			if (dupSummary) {
				toast({
					title: "Duplicate proficiencies detected",
					description: `Job + Background both grant: ${dupSummary}. Stored once each.`,
				});
			}

			const creatorProfileNotes = buildCreatorProfileNotes({
				alignment,
				personalityTrait,
				ideal,
				bond,
				flaw,
			});

			const character = await createCharacterMutation.mutateAsync({
				name: name.trim(),
				level: 1,
				job: dbJob.name,
				base_class: dbJob.name,
				portrait_url: jobImage || dbJob.image_url || null,
				path: paths.find((p) => p.id === selectedPath)?.name || null,
				background: dbBg.name,
				appearance: appearance.trim() || null,
				backstory: backstory.trim() || null,
				notes: creatorProfileNotes,
				str: creationAbilities.STR,
				agi: creationAbilities.AGI,
				vit: creationAbilities.VIT,
				int: creationAbilities.INT,
				sense: creationAbilities.SENSE,
				pre: creationAbilities.PRE,
				proficiency_bonus: 2,
				armor_class: 10 + getAbilityModifier(effectiveAbilities.AGI),
				hp_current: hpMax,
				hp_max: hpMax,
				hit_dice_current: 1,
				hit_dice_max: 1,
				hit_dice_size: hitDieSize,
				skill_proficiencies: skillsResult.unique,
				skill_expertise: skillExpertiseResult.unique,
				tool_proficiencies: toolsResult.unique,
				saving_throw_proficiencies: toAbilityScoreCodes(
					job.saving_throw_proficiencies,
					job.saving_throws,
					job.savingThrows,
				),
				weapon_proficiencies: weaponsResult.unique,
				armor_proficiencies: armorsResult.unique,
				speed: jobSpeed,
			});
			createdCharacterId = character.id;
			const creationAbilityContext: CharacterAbilityAccessContext = {
				campaignId: homebrewCampaignId,
				accessContext: { campaignId: homebrewCampaignId },
				jobName: dbJob.name,
				pathName: selectedPathName,
				regentNames: [],
				characterLevel: 1,
				maxSpellLevel: getEffectiveMaxAbilityLevel({
					jobName: dbJob.name,
					pathName: selectedPathName,
					characterLevel: 1,
					kind: "spell",
				}),
				maxPowerLevel: getEffectiveMaxAbilityLevel({
					jobName: dbJob.name,
					pathName: selectedPathName,
					characterLevel: 1,
					kind: "power",
				}),
				maxTechniqueLevel: 1,
			};

			// Ability scores are already persisted by the create mutation
			// (useCreateCharacter / createLocalCharacter seed character_abilities and
			// the guest abilities map from the row). Racial ASI + the marker feature
			// are applied for canon jobs by applyJobAwakeningTraitsToCharacter below
			// (idempotent, single authority). Homebrew jobs bake ASI into the row above.

			try {
				if (selectedHomebrewJob) {
					await insertHomebrewRuntimeFeatures(
						character.id,
						selectedHomebrewJob.classFeatures,
						1,
						`Homebrew Job: ${selectedHomebrewJob.name}`,
					);
					await insertHomebrewRuntimeFeatures(
						character.id,
						selectedHomebrewJob.awakeningFeatures,
						1,
						`Homebrew Awakening: ${selectedHomebrewJob.name}`,
					);
					await insertHomebrewRuntimeFeatures(
						character.id,
						selectedHomebrewJob.jobTraits,
						1,
						`Homebrew Trait: ${selectedHomebrewJob.name}`,
					);
				} else {
					await addLevel1Features(character.id, job, bgData);
				}
				const selectedHomebrewPath = homebrewPaths.find(
					(path) => path.id === selectedPath,
				);
				if (selectedHomebrewPath) {
					await insertHomebrewRuntimeFeatures(
						character.id,
						selectedHomebrewPath.features,
						1,
						`Homebrew Path: ${selectedHomebrewPath.name}`,
					);
				}
				await addStartingEquipment(
					character.id,
					job,
					bgData,
					selectedSkills,
					equipmentChoices,
					null,
				);
			} catch (automationErr) {
				logErrorWithContext(
					automationErr,
					"CharacterNew: level-1 features/equipment",
				);
			}
			try {
				const selectedPowerEntries = availablePowers.filter((power) =>
					selectedPowerIds.includes(power.id),
				);
				for (const power of selectedPowerEntries) {
					if (!isCanonicalPowerLearnable(power, creationAbilityContext)) {
						console.warn(
							`Creation: skipping power "${power.name}" — not learnable for this job/path`,
						);
						continue;
					}
					const payload = {
						power_id: power.id,
						name: power.name,
						power_level: power.power_level,
						source: "Creation Power Imprint",
						casting_time: power.casting_time || null,
						range: power.range || null,
						duration: power.duration || null,
						concentration: power.concentration || false,
						description: power.description || null,
						higher_levels: power.higher_levels || null,
						is_prepared: false,
						is_known: true,
					};
					if (isLocalCharacterId(character.id)) {
						addLocalPower(character.id, payload);
					} else {
						await supabase.from("character_powers").insert({
							character_id: character.id,
							...payload,
						});
					}
				}

				const selectedTechniqueEntries = availableTechniques.filter(
					(technique) => selectedTechniqueIds.includes(technique.id),
				);
				for (const technique of selectedTechniqueEntries) {
					if (
						!isCanonicalTechniqueLearnable(technique, creationAbilityContext)
					) {
						console.warn(
							`Creation: skipping technique "${technique.id}" — not learnable for this job/path`,
						);
						continue;
					}
					if (isLocalCharacterId(character.id)) {
						addLocalTechnique(character.id, {
							technique_id: technique.id,
							source: "Creation Technique Protocol",
						});
					} else {
						await supabase.from("character_techniques").insert({
							character_id: character.id,
							technique_id: technique.id,
							source: "Creation Technique Protocol",
						});
					}
				}

				const selectedCantripEntries = availableCantrips.filter((cantrip) =>
					selectedCantripIds.includes(cantrip.id),
				);
				const selectedSpellEntries = availableSpells.filter((spell) =>
					selectedSpellIds.includes(spell.id),
				);
				const selectedSpellbookEntries = availableSpellbookSpells.filter(
					(spell) => selectedSpellbookIds.includes(spell.id),
				);
				for (const spell of [
					...selectedCantripEntries.map((entry) => ({
						entry,
						source: "Creation Cantrip Alignment",
						countsAgainstLimit: true,
					})),
					...selectedSpellEntries.map((entry) => ({
						entry,
						source: "Creation Power Inscription",
						countsAgainstLimit: true,
					})),
					...selectedSpellbookEntries.map((entry) => ({
						entry,
						source: "Creation Spellbook Inscription",
						countsAgainstLimit: false,
					})),
				]) {
					const isHomebrewSpell = (spell.entry as { _homebrew?: boolean })
						._homebrew;
					if (isHomebrewSpell) {
						if (
							!runtimeSpellMatchesCharacter(
								spell.entry as unknown as HomebrewRuntimeSpell,
								dbJob.name,
								selectedPathName,
							)
						) {
							console.warn(
								`Creation: skipping homebrew spell "${spell.entry.name}" — not available for this job/path`,
							);
							continue;
						}
					} else {
						if (
							!isCanonicalSpellLearnable(spell.entry, creationAbilityContext)
						) {
							console.warn(
								`Creation: skipping spell "${spell.entry.name}" — not learnable for this job/path`,
							);
							continue;
						}
					}
					const payload = {
						spell_id: isHomebrewSpell ? null : spell.entry.id,
						name: spell.entry.name,
						spell_level: spell.entry.power_level,
						source: isHomebrewSpell
							? `${spell.source} (Homebrew)`
							: spell.source,
						casting_time: spell.entry.casting_time || null,
						range: spell.entry.range || null,
						duration: spell.entry.duration || null,
						concentration: spell.entry.concentration || false,
						ritual: spell.entry.ritual || false,
						description: spell.entry.description || null,
						higher_levels: spell.entry.higher_levels || null,
						is_prepared: false,
						is_known: true,
						counts_against_limit: spell.countsAgainstLimit,
					};
					if (isLocalCharacterId(character.id)) {
						addLocalSpell(character.id, payload);
					} else {
						await supabase.from("character_spells").insert({
							character_id: character.id,
							...payload,
						});
					}
				}
			} catch (imprintErr) {
				logErrorWithContext(imprintErr, "CharacterNew: imprint inscription");
			}

			const selectedFightingStyles = availableFightingStyles.filter((style) =>
				selectedFightingStyleIds.includes(style.id),
			);
			for (const style of selectedFightingStyles) {
				await insertCharacterFeature(character.id, {
					name: `Fighting Style: ${style.name}`,
					source: "Creation Fighting Style",
					level_acquired: 1,
					description: style.description,
					is_active: true,
					modifiers: style.modifiers ? (style.modifiers as Json) : null,
				});
			}

			for (const selection of selectedSpecialistTraining) {
				await insertCharacterFeature(character.id, {
					name: `Specialist Training: ${selection}`,
					source: "Creation Specialist Training",
					level_acquired: 1,
					description: `Doubled proficiency for ${selection}.`,
					is_active: true,
				});
			}

			try {
				// Apply racial ASI + innate senses/resistances/saves FIRST so a canon
				// character's core stats land even if a later (idempotent) awakening step
				// throws. For canon jobs this is the single racial-ASI authority — it
				// updates the row + character_abilities and writes the marker, and is safe
				// to re-run. Rift Ascendant jobs are race+class fused, so these innate
				// traits must flow onto the character row at creation.
				await applyJobAwakeningTraitsToCharacter(
					character.id,
					job,
					selectedLanguages,
				);
				await addJobAwakeningBenefitsForLevel(
					character.id,
					job,
					1,
					new Set<string>(),
				);
				for (const terrain of selectedFavoredTerrains) {
					await insertCharacterFeature(character.id, {
						name: `Favored Terrain: ${terrain}`,
						source: "Creation Favored Terrain",
						level_acquired: 1,
						description: `Starting gate biome imprint: ${terrain}.`,
						is_active: true,
					});
				}
			} catch (awakeningErr) {
				logErrorWithContext(awakeningErr, "CharacterNew: awakening benefits");
			}

			// D&D Beyond parity (#11): eagerly seed spell slot rows at creation
			// so the spells panel doesn't need to lazy-create them on first
			// render. Best-effort — failure here doesn't block character setup.
			try {
				await initializeSpellSlots.mutateAsync({
					characterId: character.id,
					job: dbJob.name,
					level: 1,
				});
			} catch (slotError) {
				logErrorWithContext(slotError, "CharacterNew: spell slot seeding");
			}

			ascendantTools
				.trackCustomFeatureUsage(
					character.id,
					"Initialization",
					"Unit Awakening Complete",
					"SA",
					{ skipBroadcast: true },
				)
				.catch((trackErr) =>
					logErrorWithContext(trackErr, "CharacterNew: track awakening usage"),
				);

			toast({ title: "Unit Awakened!", description: `${name} initialized.` });
			navigate(safeNext ?? `/characters/${character.id}`);
		} catch (error) {
			logErrorWithContext(error, "CharacterNew: initialization failed");
			const errorInfo = getErrorInfo(error);
			const describeError = (fallback: string) => {
				const base = getErrorMessage(error) || fallback;
				return errorInfo.code ? `${base} (code ${errorInfo.code})` : base;
			};
			if (createdCharacterId) {
				toast({
					title: "Unit Awakened with setup warnings",
					description: describeError(
						"Some initialization details can be repaired from the character sheet.",
					),
				});
				navigate(safeNext ?? `/characters/${createdCharacterId}`);
				return;
			}
			toast({
				title: "Initialization Failed",
				description: describeError(
					"An unknown error occurred during awakening.",
				),
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const canProceed = () => {
		switch (currentStep) {
			case "concept":
				return name.trim().length > 0;
			case "job":
				return (
					selectedJob.length > 0 &&
					selectedSkills.length === totalChoices.skills
				);
			case "abilities":
				return pointBuyRemaining >= 0;
			case "path":
				return !isPathRequiredAtCreation || selectedPath.length > 0;
			case "background":
				return selectedBackground.length > 0;
			case "imprints":
				return imprintsComplete;
			default:
				return true;
		}
	};

	const wizardSteps: WizardStep[] = steps.map((s) => ({
		id: s.id,
		name: s.name,
	}));

	type ImprintProgressItem = {
		label: string;
		selected: number;
		required: number;
		available: number;
		loading: boolean;
		ready: boolean;
	};

	const imprintProgressItems = useMemo<ImprintProgressItem[]>(
		() =>
			[
				{
					label: "Cantrips",
					selected: selectedCantripIds.length,
					required: requiredCantripChoices,
					available: availableCantrips.length,
					loading: cantripsLoading,
				},
				{
					label: "Spells",
					selected: selectedSpellIds.length,
					required: requiredSpellChoices,
					available: availableSpells.length,
					loading: spellsLoading,
				},
				{
					label: `${staticJobLedgerData?.spellbook?.label ?? "Spellbook"} Inscriptions`,
					selected: selectedSpellbookIds.length,
					required: requiredSpellbookInscriptions,
					available: availableSpellbookSpells.length,
					loading: spellbookLoading,
				},
				{
					label: "Powers",
					selected: selectedPowerIds.length,
					required: requiredPowerChoices,
					available: availablePowers.length,
					loading: powersLoading,
				},
				{
					label: "Techniques",
					selected: selectedTechniqueIds.length,
					required: requiredTechniqueChoices,
					available: availableTechniques.length,
					loading: techniquesLoading,
				},
				{
					label: "Fighting Styles",
					selected: selectedFightingStyleIds.length,
					required: requiredFightingStyleChoices,
					available: availableFightingStyles.length,
					loading: false,
				},
				{
					label: "Specialist Training",
					selected: selectedSpecialistTraining.length,
					required: requiredSpecialistTrainingChoices,
					available: specialistTrainingOptions.length,
					loading: false,
				},
				{
					label: "Favored Terrain",
					selected: selectedFavoredTerrains.length,
					required: requiredFavoredTerrainChoices,
					available: STALKER_FAVORED_TERRAINS.length,
					loading: false,
				},
			]
				.filter((item) => item.required > 0)
				.map((item) => ({
					...item,
					ready: isRequiredChoiceBucketReady(
						item.selected,
						item.required,
						item.available,
						item.loading,
					),
				})),
		[
			availableCantrips.length,
			availableFightingStyles.length,
			availablePowers.length,
			availableSpellbookSpells.length,
			availableSpells.length,
			availableTechniques.length,
			cantripsLoading,
			powersLoading,
			requiredCantripChoices,
			requiredFavoredTerrainChoices,
			requiredFightingStyleChoices,
			requiredPowerChoices,
			requiredSpecialistTrainingChoices,
			requiredSpellChoices,
			requiredSpellbookInscriptions,
			requiredTechniqueChoices,
			selectedCantripIds.length,
			selectedFavoredTerrains.length,
			selectedFightingStyleIds.length,
			selectedPowerIds.length,
			selectedSpecialistTraining.length,
			selectedSpellIds.length,
			selectedSpellbookIds.length,
			selectedTechniqueIds.length,
			specialistTrainingOptions.length,
			spellbookLoading,
			spellsLoading,
			staticJobLedgerData?.spellbook?.label,
			techniquesLoading,
		],
	);
	const imprintsComplete = imprintProgressItems.every((item) => item.ready);
	const imprintsLoading = imprintProgressItems.some((item) => item.loading);

	const reviewImprintSelections = useMemo(() => {
		const powerNames = availablePowers
			.filter((power) => selectedPowerIds.includes(power.id))
			.map((power) => `Power: ${power.name}`);
		const techniqueNames = availableTechniques
			.filter((technique) => selectedTechniqueIds.includes(technique.id))
			.map((technique) => `Technique: ${technique.name}`);
		const cantripNames = availableCantrips
			.filter((cantrip) => selectedCantripIds.includes(cantrip.id))
			.map((cantrip) => `Cantrip: ${cantrip.name}`);
		const spellNames = availableSpells
			.filter((spell) => selectedSpellIds.includes(spell.id))
			.map((spell) => `Power Inscription: ${spell.name}`);
		const spellbookNames = availableSpellbookSpells
			.filter((spell) => selectedSpellbookIds.includes(spell.id))
			.map(
				(spell) =>
					`${staticJobLedgerData?.spellbook?.label ?? "Spellbook"}: ${spell.name}`,
			);
		const styleNames = availableFightingStyles
			.filter((style) => selectedFightingStyleIds.includes(style.id))
			.map((style) => `Fighting Style: ${style.name}`);
		const trainingNames = selectedSpecialistTraining.map(
			(selection) => `Specialist Training: ${selection}`,
		);
		const terrainNames = selectedFavoredTerrains.map(
			(terrain) => `Favored Terrain: ${terrain}`,
		);
		return [
			...cantripNames,
			...spellNames,
			...spellbookNames,
			...powerNames,
			...techniqueNames,
			...styleNames,
			...trainingNames,
			...terrainNames,
		];
	}, [
		availableCantrips,
		availableFightingStyles,
		availablePowers,
		availableSpellbookSpells,
		availableSpells,
		availableTechniques,
		selectedCantripIds,
		selectedFavoredTerrains,
		selectedFightingStyleIds,
		selectedPowerIds,
		selectedSpecialistTraining,
		selectedSpellbookIds,
		selectedSpellIds,
		selectedTechniqueIds,
		staticJobLedgerData?.spellbook?.label,
	]);

	const creationPowerFormula = useMemo(
		() =>
			resolvePowerActionFormula({
				job: jobData?.name ?? staticJobData?.name,
				abilities: effectiveAbilities,
				proficiencyBonus: 2,
			}),
		[effectiveAbilities, jobData?.name, staticJobData?.name],
	);

	const getImprintMetadata = (entry: CanonicalCastableEntry) =>
		[
			entry.source_book ? `Source: ${entry.source_book}` : null,
			entry.activation_time ? `Time: ${entry.activation_time}` : null,
			entry.range ? `Range: ${entry.range}` : null,
			entry.duration ? `Duration: ${entry.duration}` : null,
		].filter((value): value is string => Boolean(value));

	const getImprintActionPreview = (entry: CanonicalCastableEntry) =>
		formatCompactActionLine({
			attack: entry.has_attack_roll
				? {
						ability: creationPowerFormula.ability,
						abilityModifier: creationPowerFormula.abilityModifier,
						attackBonus: creationPowerFormula.attackBonus,
						attackRoll: creationPowerFormula.attackRoll,
					}
				: undefined,
			save: entry.has_save
				? {
						saveDC: creationPowerFormula.saveDC,
						saveAbility: entry.save_ability,
					}
				: undefined,
			damage: entry.damage_roll
				? {
						damageRoll: entry.damage_roll,
						damageType: entry.damage_type,
					}
				: undefined,
		});

	const getTechniqueMetadata = (entry: StaticCompendiumEntry) =>
		[
			entry.source_book ? `Source: ${entry.source_book}` : null,
			stringifyCreationValue(
				(entry as { activation_action?: unknown }).activation_action ??
					(entry as { activation?: unknown }).activation,
			)
				? `Time: ${stringifyCreationValue(
						(entry as { activation_action?: unknown }).activation_action ??
							(entry as { activation?: unknown }).activation,
					)}`
				: null,
			stringifyCreationValue(entry.range)
				? `Range: ${stringifyCreationValue(entry.range)}`
				: null,
			stringifyCreationValue(entry.duration)
				? `Duration: ${stringifyCreationValue(entry.duration)}`
				: null,
		].filter((value): value is string => Boolean(value));

	const getTechniqueActionPreview = (entry: StaticCompendiumEntry) => {
		const mechanics =
			entry.mechanics && typeof entry.mechanics === "object"
				? (entry.mechanics as Record<string, unknown>)
				: null;
		const attack =
			mechanics?.attack && typeof mechanics.attack === "object"
				? (mechanics.attack as Record<string, unknown>)
				: null;
		const savingThrow =
			mechanics?.saving_throw && typeof mechanics.saving_throw === "object"
				? (mechanics.saving_throw as Record<string, unknown>)
				: null;
		const damageRoll = stringifyCreationValue(
			entry.damage ?? attack?.damage ?? mechanics?.damage_profile,
		);
		const damageType = stringifyCreationValue(
			entry.damage_type ?? attack?.damage_type,
		);
		const saveAbility = stringifyCreationValue(
			entry.saving_throw_ability ?? savingThrow?.ability,
		);

		return formatCompactActionLine({
			attack:
				entry.has_attack_roll || attack
					? {
							ability: creationPowerFormula.ability,
							abilityModifier: creationPowerFormula.abilityModifier,
							attackBonus: creationPowerFormula.attackBonus,
							attackRoll: creationPowerFormula.attackRoll,
						}
					: undefined,
			save: saveAbility
				? {
						saveDC: creationPowerFormula.saveDC,
						saveAbility,
					}
				: undefined,
			damage: damageRoll
				? {
						damageRoll,
						damageType,
					}
				: undefined,
		});
	};

	const canonicalEquipmentByName = useMemo(() => {
		const map = new Map<string, StaticCompendiumEntry>();
		for (const entry of canonicalEquipmentEntries) {
			const key = normalizeCompendiumKey(entry.name);
			if (key && !map.has(key)) map.set(key, entry);
		}
		return map;
	}, [canonicalEquipmentEntries]);

	const reviewLoadout = useMemo(() => {
		const eq =
			staticJobData?.startingEquipment ??
			(staticJobData as unknown as Record<string, unknown>)?.starting_equipment;
		if (!Array.isArray(eq)) return [];
		return eq.map((group: unknown, index: number) => {
			const groupArray = Array.isArray(group) ? group : [];
			const name = equipmentChoices[index] ?? groupArray[0];
			const normalizedName = normalizeCompendiumKey(name);
			const entry =
				canonicalEquipmentByName.get(normalizedName) ??
				canonicalEquipmentEntries.find((candidate) => {
					const candidateKey = normalizeCompendiumKey(candidate.name);
					return (
						candidateKey.length >= 4 &&
						(normalizedName.includes(candidateKey) ||
							candidateKey.includes(normalizedName))
					);
				}) ??
				null;
			if (!entry) return { name };

			const damageDice = stringifyCreationValue(entry.damage);
			const damageType = stringifyCreationValue(entry.damage_type);
			const armorClass = stringifyCreationValue(entry.armor_class);
			const range = stringifyCreationValue(entry.range);
			const properties = collectCreationProperties(entry);
			const itemType = stringifyCreationValue(
				entry.weapon_type ??
					entry.armor_type ??
					entry.item_type ??
					entry.equipment_type,
			);
			const weaponFormula = damageDice
				? resolveWeaponActionFormula({
						abilities: effectiveAbilities,
						proficiencyBonus: 2,
						proficient: true,
						isRanged: isRangedEquipment(entry),
						isFinesse: hasProperty(entry, "finesse"),
						damageDice,
					})
				: null;

			return {
				name,
				type: itemType,
				attackLine: weaponFormula
					? formatAttackLine({
							ability: weaponFormula.ability,
							abilityModifier: weaponFormula.abilityModifier,
							attackBonus: weaponFormula.attackBonus,
							attackRoll: weaponFormula.attackRoll,
						})
					: undefined,
				damageLine: weaponFormula
					? formatDamageLine({
							damageRoll: weaponFormula.damageRoll,
							damageType,
						})
					: damageDice
						? formatDamageLine({ damageRoll: damageDice, damageType })
						: undefined,
				armorLine: armorClass
					? `AC ${armorClass}${entry.stealth_disadvantage ? " · Stealth Disadvantage" : ""}`
					: undefined,
				range,
				properties,
			};
		});
	}, [
		canonicalEquipmentByName,
		canonicalEquipmentEntries,
		effectiveAbilities,
		equipmentChoices,
		staticJobData?.startingEquipment,
		(staticJobData as unknown as Record<string, unknown>)?.starting_equipment,
	]);

	const reviewResolvedStats = useMemo(() => {
		const jobName = jobData?.name ?? staticJobData?.name ?? null;
		const hitDieSize =
			typeof jobData?.hit_die === "number" && Number.isFinite(jobData.hit_die)
				? jobData.hit_die
				: Number.parseInt(
						(
							(staticJobData as unknown as Record<string, unknown>)?.hitDie ??
							(staticJobData as unknown as Record<string, unknown>)?.hit_die ??
							(staticJobData as unknown as Record<string, unknown>)?.hit_dice
						)
							?.toString()
							.replace("1d", "") ?? "8",
						10,
					);
		const speed =
			typeof staticJobData?.speed === "number" &&
			Number.isFinite(staticJobData.speed)
				? staticJobData.speed
				: 30;
		const savingThrowProficiencies = [
			...(staticJobData?.saving_throws ?? []),
			...(staticJobData?.savingThrows ?? []),
			...(staticJobData?.saving_throw_proficiencies ?? []),
			...(jobData?.saving_throw_proficiencies ?? []),
		]
			.map((ability) => normalizeAbilityScore(String(ability)))
			.filter((ability): ability is AbilityScore => ability !== null);
		const selectedBackgroundSkills = asStringArray(
			(selectedBackgroundData as { skill_proficiencies?: unknown } | undefined)
				?.skill_proficiencies,
		);
		const skillProficiencies = Array.from(
			new Set(
				[...selectedSkills, ...selectedBackgroundSkills].map(normalizeSkillId),
			),
		);
		const skillExpertise = Array.from(
			new Set(selectedSpecialistTraining.map(normalizeSkillId)),
		);
		const baseArmorClass = 10 + getAbilityModifier(effectiveAbilities.AGI);
		const stats = calculateCharacterStats({
			level: 1,
			abilities: effectiveAbilities,
			savingThrowProficiencies,
			skillProficiencies,
			skillExpertise,
			armorClass: baseArmorClass,
			speed,
			job: jobName,
		});
		const spellcastingAbility = getSpellcastingAbility(jobName);

		return {
			...stats,
			hitDieSize: Number.isFinite(hitDieSize) ? hitDieSize : 8,
			spellcastingAbility,
			savingThrowProficiencies,
			savingThrows: ABILITY_ORDER.map((ability) => ({
				ability,
				value: stats.savingThrows[ability],
				proficient: savingThrowProficiencies.includes(ability),
			})),
			trainedSkills: skillProficiencies.map((skillId) => {
				const skill = SKILLS.find((entry) => entry.id === skillId);
				return {
					id: skillId,
					name: skill?.name ?? skillId,
					ability: skill?.defaultAbility ?? "STR",
					value: stats.skills[skillId] ?? 0,
					expertise: skillExpertise.includes(skillId),
				};
			}),
		};
	}, [
		effectiveAbilities,
		jobData?.hit_die,
		jobData?.name,
		jobData?.saving_throw_proficiencies,
		selectedBackgroundData,
		selectedSkills,
		selectedSpecialistTraining,
		staticJobData?.hitDie,
		staticJobData?.name,
		staticJobData?.savingThrows,
		staticJobData?.saving_throw_proficiencies,
		staticJobData?.saving_throws,
		staticJobData?.speed,
		(staticJobData as unknown as Record<string, unknown>)?.hit_dice,
		(staticJobData as unknown as Record<string, unknown>)?.hit_die,
	]);

	return (
		<Layout>
			<div className="container py-8 max-w-4xl animate-in fade-in duration-700">
				<div className="flex items-center gap-4 mb-8 flex-wrap">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate("/")}
						className="group"
					>
						<ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
						Abat Database Link
					</Button>
					<h1 className="text-3xl font-heading font-bold tracking-tighter">
						Protocol:{" "}
						<span className="text-primary italic">Initialization</span>
					</h1>
					<div className="ml-auto">
						<Button
							onClick={() => setQuickAscendantOpen(true)}
							variant="outline"
							className="gap-2"
							data-testid="quick-ascendant-launcher"
							title="Spin up a level-1 Ascendant in ~10 clicks (RA Quickbuilder)"
						>
							<Zap className="w-4 h-4" />
							Quick Ascendant
						</Button>
					</div>
				</div>
				<QuickAscendantWizard
					open={quickAscendantOpen}
					onOpenChange={setQuickAscendantOpen}
				/>

				<CharacterWizard
					steps={wizardSteps}
					currentStepIndex={currentStepIndex}
					onNext={handleNext}
					onBack={handleBack}
					canNext={canProceed()}
					showFinish={currentStep === "review"}
					onFinish={handleCreate}
					isSubmitting={loading}
				>
					{currentStep === "concept" && (
						<IdentityStep
							name={name}
							setName={setName}
							appearance={appearance}
							setAppearance={setAppearance}
							backstory={backstory}
							setBackstory={setBackstory}
							templates={templates || []}
							onApplyTemplate={handleApplyTemplate}
							selectedJobName={allJobs.find((j) => j.id === selectedJob)?.name}
							selectedBackgroundName={
								allBackgrounds.find((b) => b.id === selectedBackground)?.name
							}
						/>
					)}

					{currentStep === "job" && (
						<JobStep
							selectedJob={selectedJob}
							onJobChange={handleJobChange}
							allJobs={allJobs}
							jobData={jobData}
							staticJobData={staticJobData}
							jobASI={jobASI}
							selectedSkills={selectedSkills}
							onSkillsChange={setSelectedSkills}
							selectedLanguages={selectedLanguages}
							onLanguagesChange={setSelectedLanguages}
							totalSkillsAllowed={totalChoices.skills}
						/>
					)}

					{currentStep === "abilities" && (
						<AttributesStep
							abilityMethod={abilityMethod}
							setAbilityMethod={setAbilityMethod}
							abilities={abilities}
							setAbilities={setAbilities}
							effectiveAbilities={effectiveAbilities}
							rolledStats={rolledStats}
							setRolledStats={setRolledStats}
							handleStandardArray={handleStandardArray}
							handleRollStats={handleRollStats}
							pointBuyRemaining={pointBuyRemaining}
							pointBuyTotal={POINT_BUY_TOTAL}
							getPointBuyCost={getPointBuyCost}
						/>
					)}

					{currentStep === "path" && (
						<PathStep
							selectedPath={selectedPath}
							onPathChange={setSelectedPath}
							paths={pathsAvailableAtCreation}
						/>
					)}

					{currentStep === "background" && (
						<BackgroundStep
							selectedBackground={selectedBackground}
							onBackgroundChange={setSelectedBackground}
							allBackgrounds={allBackgrounds}
							jobGrantedSkills={selectedSkills}
							jobGrantedTools={
								(staticJobData as { tool_proficiencies?: string[] } | null)
									?.tool_proficiencies ?? []
							}
							jobName={allJobs.find((j) => j.id === selectedJob)?.name}
						/>
					)}

					{currentStep === "persona" && (
						<PersonaStep
							alignment={alignment}
							onAlignmentChange={setAlignment}
							personalityTrait={personalityTrait}
							onPersonalityTraitChange={setPersonalityTrait}
							ideal={ideal}
							onIdealChange={setIdeal}
							bond={bond}
							onBondChange={setBond}
							flaw={flaw}
							onFlawChange={setFlaw}
							personalityOptions={personalityOptions}
							idealOptions={idealOptions}
							bondOptions={bondOptions}
							flawOptions={flawOptions}
						/>
					)}

					{currentStep === "equipment" && staticJobData && (
						<EquipmentStep
							staticJobData={staticJobData}
							equipmentChoices={equipmentChoices}
							setEquipmentChoices={setEquipmentChoices}
							backgroundEquipment={
								(
									selectedBackgroundData as
										| { starting_equipment?: string[]; equipment?: string[] }
										| undefined
								)?.starting_equipment ??
								(selectedBackgroundData as { equipment?: string[] } | undefined)
									?.equipment ??
								null
							}
						/>
					)}

					{currentStep === "imprints" && (
						<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="p-6 rounded-lg bg-black/40 border border-primary/10 space-y-6">
								<div>
									<h2 className="font-heading text-2xl font-bold tracking-tight">
										Awakening Imprints
									</h2>
									<p className="text-sm text-muted-foreground mt-2">
										Bind only the powers, techniques, casting choices, and
										combat protocols granted by your job at creation.
									</p>
								</div>

								{imprintProgressItems.length > 0 && (
									<div className="p-4 rounded-lg border border-primary/10 bg-background/40 space-y-3">
										<div className="flex items-center justify-between gap-3">
											<span className="text-xs font-heading uppercase tracking-widest text-primary/70">
												Selection Status
											</span>
											<Badge
												variant={imprintsComplete ? "secondary" : "outline"}
												className="text-xs"
											>
												{imprintsComplete
													? "Ready"
													: imprintsLoading
														? "Loading Choices"
														: "Choices Required"}
											</Badge>
										</div>
										<div className="flex flex-wrap gap-2">
											{imprintProgressItems.map((item) => {
												const status = item.loading
													? "loading"
													: item.available < item.required
														? "unavailable"
														: `${item.selected}/${item.required}`;
												return (
													<Badge
														key={item.label}
														variant={item.ready ? "secondary" : "outline"}
														className="justify-between gap-2 px-2 py-1 text-xs"
													>
														<span>{item.label}</span>
														<span>{status}</span>
													</Badge>
												);
											})}
										</div>
									</div>
								)}

								{requiredCantripChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[11px] uppercase tracking-widest text-primary/70">
											Cantrips ({selectedCantripIds.length}/
											{requiredCantripChoices})
										</Label>
										{cantripsLoading ? (
											<div className="p-4 rounded-lg border border-primary/10 bg-background/40 text-sm text-muted-foreground">
												Loading cantrip choices...
											</div>
										) : availableCantrips.length === 0 ? (
											<div className="p-4 rounded-lg border border-primary/10 bg-background/40 text-sm text-muted-foreground">
												No lore-matched cantrips are available for this job.
											</div>
										) : (
											<div className="grid gap-3">
												{availableCantrips.map((cantrip) => {
													const isSelected = selectedCantripIds.includes(
														cantrip.id,
													);
													return (
														<ImprintOptionCard
															key={cantrip.id}
															title={cantrip.name}
															description={cantrip.description}
															badges={[{ label: "Cantrip" }]}
															metadata={getImprintMetadata(cantrip)}
															actionPreview={getImprintActionPreview(cantrip)}
															selected={isSelected}
															testId="creation-cantrip-imprint-option"
															onClick={() =>
																setSelectedCantripIds((current) =>
																	toggleLimitedSelection(
																		current,
																		cantrip.id,
																		requiredCantripChoices,
																	),
																)
															}
															disabled={
																!isSelected &&
																selectedCantripIds.length >=
																	requiredCantripChoices
															}
														/>
													);
												})}
											</div>
										)}
									</div>
								)}

								{requiredSpellChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[11px] uppercase tracking-widest text-primary/70">
											Spells ({selectedSpellIds.length}/{requiredSpellChoices})
										</Label>
										{spellsLoading ? (
											<div className="p-4 rounded-lg border border-primary/10 bg-background/40 text-sm text-muted-foreground">
												Loading spell choices...
											</div>
										) : availableSpells.length === 0 ? (
											<div className="p-4 rounded-lg border border-primary/10 bg-background/40 text-sm text-muted-foreground">
												No lore-matched spells are available for this job.
											</div>
										) : (
											<div className="grid gap-3">
												{availableSpells.map((spell) => {
													const isSelected = selectedSpellIds.includes(
														spell.id,
													);
													return (
														<ImprintOptionCard
															key={spell.id}
															title={spell.name}
															description={spell.description}
															badges={[
																{ label: `Level ${spell.power_level}` },
																...(spell.power_type
																	? [
																			{
																				label: spell.power_type,
																				variant: "outline" as const,
																			},
																		]
																	: []),
															]}
															metadata={getImprintMetadata(spell)}
															actionPreview={getImprintActionPreview(spell)}
															selected={isSelected}
															testId="creation-spell-imprint-option"
															onClick={() =>
																setSelectedSpellIds((current) =>
																	toggleLimitedSelection(
																		current,
																		spell.id,
																		requiredSpellChoices,
																	),
																)
															}
															disabled={
																!isSelected &&
																selectedSpellIds.length >= requiredSpellChoices
															}
														/>
													);
												})}
											</div>
										)}
									</div>
								)}

								{requiredSpellbookInscriptions > 0 && (
									<div className="space-y-3">
										<Label className="text-[11px] uppercase tracking-widest text-primary/70">
											{staticJobLedgerData?.spellbook?.label ?? "Spellbook"}{" "}
											Inscriptions ({selectedSpellbookIds.length}/
											{requiredSpellbookInscriptions})
										</Label>
										{spellbookLoading ? (
											<div className="p-4 rounded-lg border border-primary/10 bg-background/40 text-sm text-muted-foreground">
												Loading spellbook inscriptions...
											</div>
										) : availableSpellbookSpells.length === 0 ? (
											<div className="p-4 rounded-lg border border-primary/10 bg-background/40 text-sm text-muted-foreground">
												No lore-matched spellbook inscriptions are available for
												this job.
											</div>
										) : (
											<div className="grid gap-3">
												{availableSpellbookSpells.map((spell) => {
													const isSelected = selectedSpellbookIds.includes(
														spell.id,
													);
													return (
														<ImprintOptionCard
															key={spell.id}
															title={spell.name}
															description={spell.description}
															badges={[
																{ label: `Level ${spell.power_level}` },
																...(spell.power_type
																	? [
																			{
																				label: spell.power_type,
																				variant: "outline" as const,
																			},
																		]
																	: []),
															]}
															metadata={getImprintMetadata(spell)}
															actionPreview={getImprintActionPreview(spell)}
															selected={isSelected}
															testId="creation-spellbook-imprint-option"
															onClick={() =>
																setSelectedSpellbookIds((current) =>
																	toggleLimitedSelection(
																		current,
																		spell.id,
																		requiredSpellbookInscriptions,
																	),
																)
															}
															disabled={
																!isSelected &&
																selectedSpellbookIds.length >=
																	requiredSpellbookInscriptions
															}
														/>
													);
												})}
											</div>
										)}
									</div>
								)}

								{requiredPowerChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[11px] uppercase tracking-widest text-primary/70">
											Powers ({selectedPowerIds.length}/{requiredPowerChoices})
										</Label>
										{powersLoading ? (
											<div className="p-4 rounded-lg border border-primary/10 bg-background/40 text-sm text-muted-foreground">
												Loading power choices...
											</div>
										) : availablePowers.length === 0 ? (
											<div className="p-4 rounded-lg border border-primary/10 bg-background/40 text-sm text-muted-foreground">
												No lore-matched powers are available for this job.
											</div>
										) : (
											<div className="grid gap-3">
												{availablePowers.map((power) => {
													const isSelected = selectedPowerIds.includes(
														power.id,
													);
													return (
														<ImprintOptionCard
															key={power.id}
															title={power.name}
															description={power.description}
															badges={[
																{ label: `Level ${power.power_level}` },
																...(power.power_type
																	? [
																			{
																				label: power.power_type,
																				variant: "outline" as const,
																			},
																		]
																	: []),
															]}
															metadata={getImprintMetadata(power)}
															actionPreview={getImprintActionPreview(power)}
															selected={isSelected}
															testId="creation-power-imprint-option"
															onClick={() =>
																setSelectedPowerIds((current) =>
																	toggleLimitedSelection(
																		current,
																		power.id,
																		requiredPowerChoices,
																	),
																)
															}
															disabled={
																!isSelected &&
																selectedPowerIds.length >= requiredPowerChoices
															}
														/>
													);
												})}
											</div>
										)}
									</div>
								)}

								{requiredTechniqueChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[11px] uppercase tracking-widest text-primary/70">
											Techniques ({selectedTechniqueIds.length}/
											{requiredTechniqueChoices})
										</Label>
										{techniquesLoading ? (
											<div className="p-4 rounded-lg border border-primary/10 bg-background/40 text-sm text-muted-foreground">
												Loading technique choices...
											</div>
										) : availableTechniques.length === 0 ? (
											<div className="p-4 rounded-lg border border-primary/10 bg-background/40 text-sm text-muted-foreground">
												No lore-matched techniques are available for this job.
											</div>
										) : (
											<div className="grid gap-3">
												{availableTechniques.map((technique) => {
													const isSelected = selectedTechniqueIds.includes(
														technique.id,
													);
													return (
														<ImprintOptionCard
															key={technique.id}
															title={technique.name}
															description={technique.description}
															badges={[
																...(technique.level_requirement
																	? [
																			{
																				label: `Level ${technique.level_requirement}`,
																			},
																		]
																	: []),
																...(technique.technique_type
																	? [
																			{
																				label: technique.technique_type,
																				variant: "outline" as const,
																			},
																		]
																	: []),
															]}
															metadata={getTechniqueMetadata(technique)}
															actionPreview={getTechniqueActionPreview(
																technique,
															)}
															selected={isSelected}
															testId="creation-technique-imprint-option"
															onClick={() =>
																setSelectedTechniqueIds((current) =>
																	toggleLimitedSelection(
																		current,
																		technique.id,
																		requiredTechniqueChoices,
																	),
																)
															}
															disabled={
																!isSelected &&
																selectedTechniqueIds.length >=
																	requiredTechniqueChoices
															}
														/>
													);
												})}
											</div>
										)}
									</div>
								)}

								{requiredFightingStyleChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[11px] uppercase tracking-widest text-primary/70">
											Fighting Styles ({selectedFightingStyleIds.length}/
											{requiredFightingStyleChoices})
										</Label>
										<div className="grid gap-3">
											{availableFightingStyles.map((style) => {
												const isSelected = selectedFightingStyleIds.includes(
													style.id,
												);
												return (
													<ImprintOptionCard
														key={style.id}
														title={style.name}
														description={style.description}
														badges={[
															{
																label:
																	style.source === "ra-native"
																		? "RA-native"
																		: "Baseline",
																variant: "outline" as const,
															},
														]}
														selected={isSelected}
														testId="creation-fighting-style-option"
														onClick={() =>
															setSelectedFightingStyleIds((current) =>
																toggleLimitedSelection(
																	current,
																	style.id,
																	requiredFightingStyleChoices,
																),
															)
														}
														disabled={
															!isSelected &&
															selectedFightingStyleIds.length >=
																requiredFightingStyleChoices
														}
													/>
												);
											})}
										</div>
									</div>
								)}

								{requiredSpecialistTrainingChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[11px] uppercase tracking-widest text-primary/70">
											Specialist Training ({selectedSpecialistTraining.length}/
											{requiredSpecialistTrainingChoices})
										</Label>
										{specialistTrainingOptions.length === 0 ? (
											<div className="p-4 rounded-lg border border-primary/10 bg-background/40 text-sm text-muted-foreground">
												Select job skills first to unlock Specialist Training
												options.
											</div>
										) : (
											<div className="grid gap-3">
												{specialistTrainingOptions.map((option) => {
													const isSelected =
														selectedSpecialistTraining.includes(option.id);
													return (
														<ImprintOptionCard
															key={`${option.kind}-${option.id}`}
															title={option.label}
															badges={[
																{
																	label: option.kind,
																	variant: "outline" as const,
																},
															]}
															selected={isSelected}
															testId="creation-specialist-training-option"
															onClick={() =>
																setSelectedSpecialistTraining((current) =>
																	toggleLimitedSelection(
																		current,
																		option.id,
																		requiredSpecialistTrainingChoices,
																	),
																)
															}
															disabled={
																!isSelected &&
																selectedSpecialistTraining.length >=
																	requiredSpecialistTrainingChoices
															}
														/>
													);
												})}
											</div>
										)}
									</div>
								)}

								{requiredFavoredTerrainChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[11px] uppercase tracking-widest text-primary/70">
											Favored Terrain ({selectedFavoredTerrains.length}/
											{requiredFavoredTerrainChoices})
										</Label>
										<div className="grid gap-3">
											{STALKER_FAVORED_TERRAINS.map((terrain) => {
												const isSelected =
													selectedFavoredTerrains.includes(terrain);
												return (
													<ImprintOptionCard
														key={terrain}
														title={terrain}
														selected={isSelected}
														testId="creation-favored-terrain-option"
														onClick={() =>
															setSelectedFavoredTerrains((current) =>
																toggleLimitedSelection(
																	current,
																	terrain,
																	requiredFavoredTerrainChoices,
																),
															)
														}
														disabled={
															!isSelected &&
															selectedFavoredTerrains.length >=
																requiredFavoredTerrainChoices
														}
													/>
												);
											})}
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{currentStep === "review" && (
						<ReviewStep
							name={name}
							jobData={jobData}
							selectedPathName={
								paths.find((p) => p.id === selectedPath)?.display_name ||
								paths.find((p) => p.id === selectedPath)?.name ||
								"None"
							}
							selectedBackgroundName={
								allBackgrounds.find((b) => b.id === selectedBackground)
									?.display_name ||
								allBackgrounds.find((b) => b.id === selectedBackground)?.name ||
								"None"
							}
							effectiveAbilities={effectiveAbilities}
							hpMax={calculateHPMax(
								1,
								jobData?.hit_die || 8,
								getAbilityModifier(effectiveAbilities.VIT),
							)}
							baseAC={10 + getAbilityModifier(effectiveAbilities.AGI)}
							loading={loading}
							onCreate={handleCreate}
							jobASI={jobASI}
							selectedLanguages={selectedLanguages}
							staticJobData={staticJobData || null}
							jobAwakeningAtCreation={jobAwakeningAtCreation}
							jobTraitsAtCreation={jobTraitsAtCreation}
							resolvedStats={reviewResolvedStats}
							riftFavorOptions={getAvailableFavorOptions(1)}
							startingLoadout={reviewLoadout}
							alignment={alignment}
							personalityTrait={personalityTrait}
							ideal={ideal}
							bond={bond}
							flaw={flaw}
							imprintSelections={reviewImprintSelections}
						/>
					)}
				</CharacterWizard>
			</div>
		</Layout>
	);
};

export default CharacterNew;
