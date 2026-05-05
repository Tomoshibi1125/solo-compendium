import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
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
import { JobStep } from "@/components/character-engine/JobStep";
import { PathStep } from "@/components/character-engine/PathStep";
import { PersonaStep } from "@/components/character-engine/PersonaStep";
import { ReviewStep } from "@/components/character-engine/ReviewStep";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getFightingStylesForJob } from "@/data/compendium/fightingStyles";
import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";
import { useToast } from "@/hooks/use-toast";
import { useCreateCharacter } from "@/hooks/useCharacters";
import {
	type CharacterTemplate,
	useCharacterTemplates,
} from "@/hooks/useCharacterTemplates";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { usePublishedHomebrew } from "@/hooks/useHomebrewContent";
import { useInitializeSpellSlots } from "@/hooks/useSpellSlots";
import { useStaticJobs } from "@/hooks/useStaticJobs";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { isSafeNextPath } from "@/lib/campaignInviteUtils";
import {
	type CanonicalCastableEntry,
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
} from "@/lib/canonicalCompendium";
import {
	assertCanonicalPowerLearnable,
	assertCanonicalSpellLearnable,
	assertCanonicalTechniqueLearnable,
	type CharacterAbilityAccessContext,
} from "@/lib/characterAbilityAccess";
import { calculateHPMax } from "@/lib/characterCalculations";
import {
	addJobAwakeningBenefitsForLevel,
	addLevel1Features,
	addStartingEquipment,
	applyJobAwakeningTraitsToCharacter,
	getJobASI,
	insertCharacterFeature,
} from "@/lib/characterCreation";
import {
	calculateTotalChoices,
	type LedgerChoice,
} from "@/lib/choiceCalculations";
import {
	addLocalPower,
	addLocalSpell,
	addLocalTechnique,
	isLocalCharacterId,
	setLocalAbilities,
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
import {
	dedupeProficiencies,
	formatDuplicatesSummary,
} from "@/lib/proficiencyDedup";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
import type {
	Background,
	Job,
	Path,
	StaticBackground,
	StaticJob,
} from "@/types/character";
import type { AbilityScore } from "@/types/core-rules";

type DbAbilityScore = Database["public"]["Enums"]["ability_score"];

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
	spellbook?: { atCreation: number; perLevel: number; label: string };
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
	const initializeSpellSlots = useInitializeSpellSlots();

	const { data: templates } = useCharacterTemplates();
	const { data: staticJobCatalog = [] } = useStaticJobs();
	const { data: publishedHomebrew = [] } = usePublishedHomebrew(
		["job", "path", "spell"],
		homebrewCampaignId,
	);
	const ascendantTools = useAscendantTools();

	const [currentStep, setCurrentStep] = useState<Step>("concept");
	const [loading, setLoading] = useState(false);

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
				saving_throw_proficiencies: (job.saving_throw_proficiencies ||
					job.savingThrows ||
					[]) as AbilityScore[],
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
		return getJobASI(dbJob.name, 1) as Record<AbilityScore, number>;
	}, [allJobs, selectedJob]);

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
		if (!staticJobData?.awakeningFeatures) return [];
		return staticJobData.awakeningFeatures.filter((f) => f.level === 1);
	}, [staticJobData]);

	const jobTraitsAtCreation = useMemo(() => {
		if (!staticJobData?.jobTraits) return [];
		return staticJobData.jobTraits;
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
							(jobData as { awakening_features?: [] } | undefined)
								?.awakening_features ??
							[],
						job_traits:
							staticJobData?.jobTraits ??
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
			[],
			1,
		);
	}, [
		jobData,
		staticJobData,
		staticJobLedgerData,
		selectedPath,
		pathsAvailableAtCreation,
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

	const { data: availablePowers = [] } = useQuery<CanonicalCastableEntry[]>({
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
			});
		},
		enabled: !!jobData?.name && requiredPowerChoices > 0,
	});

	const { data: availableTechniques = [] } = useQuery<StaticCompendiumEntry[]>({
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
				maxLevel: 1,
			});
		},
		enabled: !!jobData?.name && requiredTechniqueChoices > 0,
	});

	const { data: availableCantrips = [] } = useQuery<CanonicalCastableEntry[]>({
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

	const { data: availableSpells = [] } = useQuery<CanonicalCastableEntry[]>({
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
				maxPowerLevel: 1,
			});
			const matchingHomebrew = homebrewSpells.filter(
				(spell) =>
					spell.power_level > 0 &&
					spell.power_level <= 1 &&
					runtimeSpellMatchesCharacter(spell, jobData.name, selectedPathName),
			);
			return [
				...spells.filter((spell) => spell.power_level > 0),
				...(matchingHomebrew as unknown as CanonicalCastableEntry[]),
			];
		},
		enabled: !!jobData?.name && requiredSpellChoices > 0,
	});

	const { data: availableSpellbookSpells = [] } = useQuery<
		CanonicalCastableEntry[]
	>({
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
				maxPowerLevel: 1,
			});
			const matchingHomebrew = homebrewSpells.filter(
				(spell) =>
					spell.power_level > 0 &&
					spell.power_level <= 1 &&
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
		if (!name.trim()) {
			toast({ title: "Name required", variant: "destructive" });
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
		try {
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
			const bgData = (
				getStaticBackgroundsAll() as unknown as StaticBackground[]
			).find((b: StaticBackground) => b.name === dbBg.name);

			if (!job || !bgData) throw new Error("Enhanced data missing");

			const level = 1;
			const vitModifier = Math.floor((effectiveAbilities.VIT - 10) / 2);
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
				proficiency_bonus: 2,
				armor_class: 10 + Math.floor((effectiveAbilities.AGI - 10) / 2),
				hp_current: hpMax,
				hp_max: hpMax,
				hit_dice_current: 1,
				hit_dice_max: 1,
				hit_dice_size: hitDieSize,
				skill_proficiencies: skillsResult.unique,
				skill_expertise: skillExpertiseResult.unique,
				tool_proficiencies: toolsResult.unique,
				saving_throw_proficiencies: (job.saving_throw_proficiencies ||
					job.savingThrows ||
					[]) as AbilityScore[],
				weapon_proficiencies: weaponsResult.unique,
				armor_proficiencies: armorsResult.unique,
				speed: jobSpeed,
			});
			const creationAbilityContext: CharacterAbilityAccessContext = {
				campaignId: homebrewCampaignId,
				accessContext: { campaignId: homebrewCampaignId },
				jobName: dbJob.name,
				pathName: selectedPathName,
				regentNames: [],
			};

			const finalAbilities = { ...abilities };
			for (const [k, v] of Object.entries(jobASI)) {
				if (k in finalAbilities) finalAbilities[k as AbilityScore] += v;
			}

			if (isLocalCharacterId(character.id)) {
				setLocalAbilities(
					character.id,
					finalAbilities as Record<DbAbilityScore, number>,
				);
			} else {
				const updates = Object.entries(finalAbilities).map(
					([ability, score]) => ({
						character_id: character.id,
						ability: ability as AbilityScore,
						score: score,
					}),
				);
				await supabase
					.from("character_abilities")
					.upsert(updates, { onConflict: "character_id,ability" });
			}

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
			);
			const selectedPowerEntries = availablePowers.filter((power) =>
				selectedPowerIds.includes(power.id),
			);
			for (const power of selectedPowerEntries) {
				assertCanonicalPowerLearnable(power, creationAbilityContext);
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

			const selectedTechniqueEntries = availableTechniques.filter((technique) =>
				selectedTechniqueIds.includes(technique.id),
			);
			for (const technique of selectedTechniqueEntries) {
				assertCanonicalTechniqueLearnable(technique, creationAbilityContext);
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
						throw new Error(
							"This homebrew spell is not available to this character's job or path.",
						);
					}
				} else {
					assertCanonicalSpellLearnable(spell.entry, creationAbilityContext);
				}
				const payload = {
					spell_id: isHomebrewSpell ? null : spell.entry.id,
					name: spell.entry.name,
					spell_level: spell.entry.power_level,
					source: isHomebrewSpell ? `${spell.source} (Homebrew)` : spell.source,
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

			for (const terrain of selectedFavoredTerrains) {
				await insertCharacterFeature(character.id, {
					name: `Favored Terrain: ${terrain}`,
					source: "Creation Favored Terrain",
					level_acquired: 1,
					description: `Starting gate biome imprint: ${terrain}.`,
					is_active: true,
				});
			}
			await addJobAwakeningBenefitsForLevel(character.id, job, 1);
			// Rift Ascendant: Jobs serve as both race and class, so their innate senses,
			// resistances, and immunities must flow onto the character row at creation.
			await applyJobAwakeningTraitsToCharacter(
				character.id,
				job,
				selectedLanguages,
			);

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
				console.error("Failed to seed spell slots at creation:", slotError);
			}

			ascendantTools
				.trackCustomFeatureUsage(
					character.id,
					"Initialization",
					"Unit Awakening Complete",
					"SA",
					{ skipBroadcast: true },
				)
				.catch(console.error);

			toast({ title: "Unit Awakened!", description: `${name} initialized.` });
			navigate(safeNext ?? `/characters/${character.id}`);
		} catch (error) {
			console.error("Initialization failed:", error);
			toast({ title: "Initialization Failed", variant: "destructive" });
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
				return (
					selectedPowerIds.length === requiredPowerChoices &&
					selectedTechniqueIds.length === requiredTechniqueChoices &&
					selectedCantripIds.length === requiredCantripChoices &&
					selectedSpellIds.length === requiredSpellChoices &&
					selectedSpellbookIds.length === requiredSpellbookInscriptions &&
					selectedFightingStyleIds.length === requiredFightingStyleChoices &&
					selectedSpecialistTraining.length ===
						requiredSpecialistTrainingChoices &&
					selectedFavoredTerrains.length === requiredFavoredTerrainChoices
				);
			default:
				return true;
		}
	};

	const wizardSteps: WizardStep[] = steps.map((s) => ({
		id: s.id,
		name: s.name,
	}));

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

	return (
		<Layout>
			<div className="container py-8 max-w-4xl animate-in fade-in duration-700">
				<div className="flex items-center gap-4 mb-8">
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
				</div>

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

								{requiredCantripChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[10px] uppercase tracking-widest text-primary/70">
											Cantrip Alignments ({selectedCantripIds.length}/
											{requiredCantripChoices})
										</Label>
										{availableCantrips.length === 0 ? (
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
														<button
															key={cantrip.id}
															type="button"
															data-testid="creation-cantrip-imprint-option"
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
															className={`text-left p-4 rounded-lg border transition-colors ${
																isSelected
																	? "border-primary bg-primary/10"
																	: "border-primary/10 bg-background/40 hover:bg-primary/5 disabled:opacity-50"
															}`}
														>
															<div className="flex items-center gap-2 flex-wrap">
																<span className="font-heading font-semibold">
																	{cantrip.name}
																</span>
																<Badge variant="secondary" className="text-xs">
																	Cantrip
																</Badge>
															</div>
															{cantrip.description && (
																<p className="text-xs text-muted-foreground mt-2 line-clamp-2">
																	{cantrip.description}
																</p>
															)}
														</button>
													);
												})}
											</div>
										)}
									</div>
								)}

								{requiredSpellChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[10px] uppercase tracking-widest text-primary/70">
											Power Inscriptions ({selectedSpellIds.length}/
											{requiredSpellChoices})
										</Label>
										{availableSpells.length === 0 ? (
											<div className="p-4 rounded-lg border border-primary/10 bg-background/40 text-sm text-muted-foreground">
												No lore-matched power inscriptions are available for
												this job.
											</div>
										) : (
											<div className="grid gap-3">
												{availableSpells.map((spell) => {
													const isSelected = selectedSpellIds.includes(
														spell.id,
													);
													return (
														<button
															key={spell.id}
															type="button"
															data-testid="creation-spell-imprint-option"
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
															className={`text-left p-4 rounded-lg border transition-colors ${
																isSelected
																	? "border-primary bg-primary/10"
																	: "border-primary/10 bg-background/40 hover:bg-primary/5 disabled:opacity-50"
															}`}
														>
															<div className="flex items-center gap-2 flex-wrap">
																<span className="font-heading font-semibold">
																	{spell.name}
																</span>
																<Badge variant="secondary" className="text-xs">
																	Level {spell.power_level}
																</Badge>
																{spell.power_type && (
																	<Badge variant="outline" className="text-xs">
																		{spell.power_type}
																	</Badge>
																)}
															</div>
															{spell.description && (
																<p className="text-xs text-muted-foreground mt-2 line-clamp-2">
																	{spell.description}
																</p>
															)}
														</button>
													);
												})}
											</div>
										)}
									</div>
								)}

								{requiredSpellbookInscriptions > 0 && (
									<div className="space-y-3">
										<Label className="text-[10px] uppercase tracking-widest text-primary/70">
											{staticJobLedgerData?.spellbook?.label ?? "Spellbook"}{" "}
											Inscriptions ({selectedSpellbookIds.length}/
											{requiredSpellbookInscriptions})
										</Label>
										{availableSpellbookSpells.length === 0 ? (
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
														<button
															key={spell.id}
															type="button"
															data-testid="creation-spellbook-imprint-option"
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
															className={`text-left p-4 rounded-lg border transition-colors ${
																isSelected
																	? "border-primary bg-primary/10"
																	: "border-primary/10 bg-background/40 hover:bg-primary/5 disabled:opacity-50"
															}`}
														>
															<div className="flex items-center gap-2 flex-wrap">
																<span className="font-heading font-semibold">
																	{spell.name}
																</span>
																<Badge variant="secondary" className="text-xs">
																	Level {spell.power_level}
																</Badge>
																{spell.power_type && (
																	<Badge variant="outline" className="text-xs">
																		{spell.power_type}
																	</Badge>
																)}
															</div>
															{spell.description && (
																<p className="text-xs text-muted-foreground mt-2 line-clamp-2">
																	{spell.description}
																</p>
															)}
														</button>
													);
												})}
											</div>
										)}
									</div>
								)}

								{requiredPowerChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[10px] uppercase tracking-widest text-primary/70">
											Power Imprints ({selectedPowerIds.length}/
											{requiredPowerChoices})
										</Label>
										{availablePowers.length === 0 ? (
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
														<button
															key={power.id}
															type="button"
															data-testid="creation-power-imprint-option"
															onClick={() => {
																if (isSelected) {
																	setSelectedPowerIds(
																		selectedPowerIds.filter(
																			(id) => id !== power.id,
																		),
																	);
																} else if (
																	selectedPowerIds.length < requiredPowerChoices
																) {
																	setSelectedPowerIds([
																		...selectedPowerIds,
																		power.id,
																	]);
																}
															}}
															disabled={
																!isSelected &&
																selectedPowerIds.length >= requiredPowerChoices
															}
															className={`text-left p-4 rounded-lg border transition-colors ${
																isSelected
																	? "border-primary bg-primary/10"
																	: "border-primary/10 bg-background/40 hover:bg-primary/5 disabled:opacity-50"
															}`}
														>
															<div className="flex items-center gap-2 flex-wrap">
																<span className="font-heading font-semibold">
																	{power.name}
																</span>
																<Badge variant="secondary" className="text-xs">
																	Level {power.power_level}
																</Badge>
																{power.power_type && (
																	<Badge variant="outline" className="text-xs">
																		{power.power_type}
																	</Badge>
																)}
															</div>
															{power.description && (
																<p className="text-xs text-muted-foreground mt-2 line-clamp-2">
																	{power.description}
																</p>
															)}
														</button>
													);
												})}
											</div>
										)}
									</div>
								)}

								{requiredTechniqueChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[10px] uppercase tracking-widest text-primary/70">
											Technique Protocols ({selectedTechniqueIds.length}/
											{requiredTechniqueChoices})
										</Label>
										{availableTechniques.length === 0 ? (
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
														<button
															key={technique.id}
															type="button"
															data-testid="creation-technique-imprint-option"
															onClick={() => {
																if (isSelected) {
																	setSelectedTechniqueIds(
																		selectedTechniqueIds.filter(
																			(id) => id !== technique.id,
																		),
																	);
																} else if (
																	selectedTechniqueIds.length <
																	requiredTechniqueChoices
																) {
																	setSelectedTechniqueIds([
																		...selectedTechniqueIds,
																		technique.id,
																	]);
																}
															}}
															disabled={
																!isSelected &&
																selectedTechniqueIds.length >=
																	requiredTechniqueChoices
															}
															className={`text-left p-4 rounded-lg border transition-colors ${
																isSelected
																	? "border-primary bg-primary/10"
																	: "border-primary/10 bg-background/40 hover:bg-primary/5 disabled:opacity-50"
															}`}
														>
															<div className="flex items-center gap-2 flex-wrap">
																<span className="font-heading font-semibold">
																	{technique.name}
																</span>
																{technique.level_requirement && (
																	<Badge
																		variant="secondary"
																		className="text-xs"
																	>
																		Level {technique.level_requirement}
																	</Badge>
																)}
																{technique.technique_type && (
																	<Badge variant="outline" className="text-xs">
																		{technique.technique_type}
																	</Badge>
																)}
															</div>
															{technique.description && (
																<p className="text-xs text-muted-foreground mt-2 line-clamp-2">
																	{technique.description}
																</p>
															)}
														</button>
													);
												})}
											</div>
										)}
									</div>
								)}

								{requiredFightingStyleChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[10px] uppercase tracking-widest text-primary/70">
											Fighting Styles ({selectedFightingStyleIds.length}/
											{requiredFightingStyleChoices})
										</Label>
										<div className="grid gap-3">
											{availableFightingStyles.map((style) => {
												const isSelected = selectedFightingStyleIds.includes(
													style.id,
												);
												return (
													<button
														key={style.id}
														type="button"
														data-testid="creation-fighting-style-option"
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
														className={`text-left p-4 rounded-lg border transition-colors ${
															isSelected
																? "border-primary bg-primary/10"
																: "border-primary/10 bg-background/40 hover:bg-primary/5 disabled:opacity-50"
														}`}
													>
														<div className="flex items-center gap-2 flex-wrap">
															<span className="font-heading font-semibold">
																{style.name}
															</span>
															<Badge variant="outline" className="text-xs">
																{style.source === "ra-native"
																	? "RA-native"
																	: "Baseline"}
															</Badge>
														</div>
														<p className="text-xs text-muted-foreground mt-2">
															{style.description}
														</p>
													</button>
												);
											})}
										</div>
									</div>
								)}

								{requiredSpecialistTrainingChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[10px] uppercase tracking-widest text-primary/70">
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
														<button
															key={`${option.kind}-${option.id}`}
															type="button"
															data-testid="creation-specialist-training-option"
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
															className={`text-left p-4 rounded-lg border transition-colors ${
																isSelected
																	? "border-primary bg-primary/10"
																	: "border-primary/10 bg-background/40 hover:bg-primary/5 disabled:opacity-50"
															}`}
														>
															<div className="flex items-center gap-2 flex-wrap">
																<span className="font-heading font-semibold">
																	{option.label}
																</span>
																<Badge variant="outline" className="text-xs">
																	{option.kind}
																</Badge>
															</div>
														</button>
													);
												})}
											</div>
										)}
									</div>
								)}

								{requiredFavoredTerrainChoices > 0 && (
									<div className="space-y-3">
										<Label className="text-[10px] uppercase tracking-widest text-primary/70">
											Favored Terrain ({selectedFavoredTerrains.length}/
											{requiredFavoredTerrainChoices})
										</Label>
										<div className="grid gap-3">
											{STALKER_FAVORED_TERRAINS.map((terrain) => {
												const isSelected =
													selectedFavoredTerrains.includes(terrain);
												return (
													<button
														key={terrain}
														type="button"
														data-testid="creation-favored-terrain-option"
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
														className={`text-left p-4 rounded-lg border transition-colors ${
															isSelected
																? "border-primary bg-primary/10"
																: "border-primary/10 bg-background/40 hover:bg-primary/5 disabled:opacity-50"
														}`}
													>
														<span className="font-heading font-semibold">
															{terrain}
														</span>
													</button>
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
								Math.floor((effectiveAbilities.VIT - 10) / 2),
							)}
							baseAC={10 + Math.floor((effectiveAbilities.AGI - 10) / 2)}
							loading={loading}
							onCreate={handleCreate}
							jobASI={jobASI}
							selectedLanguages={selectedLanguages}
							staticJobData={staticJobData || null}
							jobAwakeningAtCreation={jobAwakeningAtCreation}
							jobTraitsAtCreation={jobTraitsAtCreation}
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
