import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	AlertTriangle,
	Crown,
	Heart,
	Loader2,
	Shield,
	Sparkles,
	Star,
	Swords,
	TrendingDown,
	TrendingUp,
	Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getFightingStylesForJob } from "@/data/compendium/fightingStyles";
import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";
import { useToast } from "@/hooks/use-toast";
import { useCampaignByCharacterId } from "@/hooks/useCampaigns";
import { useCharacter, useUpdateCharacter } from "@/hooks/useCharacters";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { usePublishedHomebrew } from "@/hooks/useHomebrewContent";
import { useRegentUnlocks } from "@/hooks/useRegentUnlocks";
import { useInitializeSpellSlots } from "@/hooks/useSpellSlots";
import { useStaticJobs } from "@/hooks/useStaticJobs";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getAbilityModifier } from "@/lib/5eRulesEngine";
import { getLevelingMode } from "@/lib/campaignSettings";
import {
	type CanonicalCastableEntry,
	listCanonicalEntries,
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
	resolveCanonicalReference,
} from "@/lib/canonicalCompendium";
import {
	assertCanonicalPowerLearnable,
	assertCanonicalSpellLearnable,
	assertCanonicalTechniqueLearnable,
	type CharacterAbilityAccessContext,
} from "@/lib/characterAbilityAccess";
import {
	addJobAwakeningBenefitsForLevel,
	applyJobAwakeningTraitsToCharacter,
	autoUpdateFeatureUses,
	getAbilityUseFields,
	insertCharacterFeature,
	reconcileAbilityUses,
} from "@/lib/characterCreation";
import { calculateFeatureUses } from "@/lib/characterEngine";
import {
	type ChoiceSourceData,
	calculateTotalChoices,
	getLevelUpChoiceDeltas,
	getLevelUpLedgerEntries,
	type LedgerChoice,
} from "@/lib/choiceCalculations";
import {
	buildCorePayload,
	type CharacterLevelUpEvent,
	DomainEventBus,
} from "@/lib/domainEvents";
import { parseFeatureMetadata } from "@/lib/featureDescriptionParser";
import { resolveFeatureRecharge } from "@/lib/featureUses";
import {
	addLocalPower,
	addLocalSpell,
	addLocalTechnique,
	isLocalCharacterId,
	listLocalPowers,
	listLocalSpells,
	listLocalTechniques,
	removeLocalPower,
	removeLocalSpell,
	removeLocalTechnique,
} from "@/lib/guestStore";
import {
	filterPublishedHomebrewRecords,
	type HomebrewRuntimeJob,
	type HomebrewRuntimePath,
	type HomebrewRuntimeSpell,
	mapHomebrewJobForRuntime,
	mapHomebrewPathForRuntime,
	mapHomebrewSpellForRuntime,
	runtimePathMatchesJob,
	runtimeSpellMatchesCharacter,
} from "@/lib/homebrewRuntime";
import { removeProgressionGrantsAboveLevel } from "@/lib/levelDownCleanup";
import { getStaticPathUnlockLevel, isASILevel } from "@/lib/levelGating";
import {
	calculateAverageHPGain,
	calculateMaxHPGain,
	calculateMinHPGain,
	calculateProficiencyBonusForLevel,
	calculateRiftFavorDie,
	calculateRiftFavorMax,
} from "@/lib/levelUpCalculations";
import { getSwappableKinds, type SwapKind } from "@/lib/levelUpSwap";
import { logger } from "@/lib/logger";
import { getStaticPaths, getStaticRegents } from "@/lib/ProtocolDataManager";
import { getEffectiveMaxAbilityLevel } from "@/lib/pathAbilityAccess";
import { getPathEligibility } from "@/lib/pathEligibility";
import {
	buildCharacterLevelDownPreflightV1,
	buildCharacterLevelUpWorkflowPlanV1,
	type CharacterLevelUpWorkflowInputV1,
	type CharacterWorkflowChoiceInputV1,
	type CharacterWorkflowFeatureInputV1,
	type CharacterWorkflowIdentityV1,
	createCharacterWorkflowHandoffV1,
	createCharacterWorkflowSourceAddressV1,
	summarizeCharacterWorkflowBlockersV1,
} from "@/lib/planning/adapters/characterWorkflowAdapter";
import { rankToGateToken } from "@/lib/rankColors";
import {
	getRegentFeaturesAtLevel,
	regentToChoiceSource,
} from "@/lib/regentProgression";
import type { Regent } from "@/lib/regentTypes";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { StaticJob } from "@/types/character";
import type { CompendiumFeat, JobFeature } from "@/types/compendium";

// Rift Ascendant XP Thresholds (cumulative XP needed to reach each level)
const XP_THRESHOLDS = [
	0, 0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
	120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
];

type StaticPathFeatureSource = {
	name: string;
	description: string;
	level: number;
	actionType?: string | null;
	uses?: {
		formula: string;
		recharge: "short-rest" | "long-rest";
	} | null;
	resource?: string | null;
	tracking?: "uses" | "resource" | "manual" | null;
};

type StaticPathSource = {
	id: string;
	name: string;
	description: string;
	job_id?: string;
	jobId?: string;
	jobName?: string;
	display_name?: string | null;
	level?: number | null;
	path_level?: number | null;
	source?: string;
	source_book?: string | null;
	prerequisites?: string | null;
	features?: StaticPathFeatureSource[];
	requirements?: {
		level?: number | null;
		skills?: string[] | null;
	};
};

type LevelUpPathOption = {
	id: string;
	name: string;
	description?: string | null;
	display_name?: string | null;
	path_level: number;
	source_book?: string | null;
	features?: StaticPathFeatureSource[];
	requirements?: StaticPathSource["requirements"];
	eligibility?: ReturnType<typeof getPathEligibility>;
};

type LevelUpFeatureRow = {
	id: string;
	name: string;
	description?: string | null;
	level: number;
	is_path_feature: boolean;
	action_type?: string | null;
	uses_formula?: string | null;
	prerequisites?: string | null;
	recharge?: string | null;
	source_name?: string | null;
	homebrew_id?: string | null;
	workflow_source_kind: "source-address" | "homebrew";
	workflow_source_path: string;
	workflow_owner_id: string;
	modifiers?: Database["public"]["Tables"]["character_features"]["Insert"]["modifiers"];
};

type StaticJobWithLedger = StaticJob & {
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

type LedgerOptionPanel = {
	key: string;
	ledgerIndex: number;
	label: string;
	count: number;
	type: LedgerChoice["type"];
	options: Array<{ id: string; label: string; description?: string }>;
};

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

const canonicalWorkflowIdentity = (
	id: string | null | undefined,
	label: string,
	collection: string,
	sourceBook?: string | null,
): CharacterWorkflowIdentityV1 => ({
	id: id?.trim() || null,
	label,
	sourceKind: "canonical",
	collection,
	canonicalType: collection,
	sourceBook: sourceBook ?? null,
	persistence: "id",
});

const homebrewWorkflowIdentity = (
	id: string | null | undefined,
	label: string,
	collection: string,
	sourcePath: string,
	persistence: CharacterWorkflowIdentityV1["persistence"] = "id",
): CharacterWorkflowIdentityV1 => ({
	id: id?.trim() || null,
	label,
	sourceKind: "homebrew",
	collection,
	sourcePath,
	persistence,
});

const formatOptionLabel = (value: string) =>
	value
		.split("-")
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");

const toggleLimitedSelection = (
	current: string[],
	value: string,
	limit: number,
): string[] => {
	if (current.includes(value)) return current.filter((item) => item !== value);
	if (current.length >= limit) return current;
	return [...current, value];
};

function toChoiceSourceData(
	job: StaticJobWithLedger | null | undefined,
	name?: string | null,
): ChoiceSourceData | null {
	if (!job) return null;
	return {
		name: name ?? job.name,
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

function toPathChoiceSourceData(
	path: Pick<ChoiceSourceData, "features" | "name"> | null | undefined,
	name?: string | null,
): ChoiceSourceData | null {
	if (!path) return null;
	return {
		name: name ?? path.name,
		features: path.features ?? [],
	};
}

function getExperienceForNextLevel(currentLevel: number): number {
	return XP_THRESHOLDS[Math.min(currentLevel + 1, 20)] ?? Infinity;
}

interface LevelUpWizardModalProps {
	isOpen: boolean;
	onClose: () => void;
	characterId: string;
}

export const LevelUpWizardModal = ({
	isOpen,
	onClose,
	characterId,
}: LevelUpWizardModalProps) => {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const { data: character, isLoading } = useCharacter(characterId || "");
	const { data: characterCampaign } = useCampaignByCharacterId(
		characterId || "",
	);
	const campaignId = characterCampaign?.id ?? null;
	const levelingMode = getLevelingMode(characterCampaign?.settings);
	const isMilestone = levelingMode === "milestone";
	const ascendantTools = useAscendantTools();
	const updateCharacter = useUpdateCharacter();
	const initializeSpellSlots = useInitializeSpellSlots();
	const [newLevel, setNewLevel] = useState(1);
	const [hpIncrease, setHpIncrease] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [isRolling, setIsRolling] = useState(false);
	const [selectedPath, setSelectedPath] = useState<string>("");
	const [asiChoices, setAsiChoices] = useState<Record<string, number>>({});
	const [selectedFeats, setSelectedFeats] = useState<string[]>([]);
	const [selectedPowerIds, setSelectedPowerIds] = useState<string[]>([]);
	const [selectedTechniqueIds, setSelectedTechniqueIds] = useState<string[]>(
		[],
	);
	const [selectedCantripIds, setSelectedCantripIds] = useState<string[]>([]);
	const [selectedSpellIds, setSelectedSpellIds] = useState<string[]>([]);
	const [selectedSpellbookIds, setSelectedSpellbookIds] = useState<string[]>(
		[],
	);
	const [selectedFightingStyleIds, setSelectedFightingStyleIds] = useState<
		string[]
	>([]);
	const [selectedLedgerOptions, setSelectedLedgerOptions] = useState<
		Record<string, string[]>
	>({});
	// DDB parity: optional retrain — known-repertoire jobs may swap ONE known
	// spell/power/technique for another legal pick when they gain a level.
	const [swapKind, setSwapKind] = useState<"none" | SwapKind>("none");
	const [swapOutId, setSwapOutId] = useState<string>("");
	const [swapInId, setSwapInId] = useState<string>("");
	const { data: staticJobs, isLoading: jobsLoading } = useStaticJobs();
	const { data: publishedHomebrew = [] } = usePublishedHomebrew(
		["job", "path", "spell"],
		campaignId,
	);
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

	const staticJobObj = useMemo(
		() =>
			(staticJobs || []).find((job) =>
				character?.job_id
					? job.id === character.job_id
					: normalizeCompendiumKey(job.name) ===
						normalizeCompendiumKey(character?.job),
			) as StaticJobWithLedger | undefined,
		[staticJobs, character?.job, character?.job_id],
	);
	const homebrewJobObj = useMemo(
		() =>
			homebrewJobs.find((job) =>
				character?.job_id
					? job.id === character.job_id
					: normalizeCompendiumKey(job.name) ===
						normalizeCompendiumKey(character?.job),
			),
		[homebrewJobs, character?.job, character?.job_id],
	);
	const jobObj =
		staticJobObj ??
		(homebrewJobObj as unknown as StaticJobWithLedger | undefined);

	const jobChoiceSource = useMemo(
		() => toChoiceSourceData(jobObj, character?.job),
		[jobObj, character?.job],
	);

	const levelUpLedgerEntries = useMemo(() => {
		if (!character || !jobChoiceSource) return [];
		return getLevelUpLedgerEntries(jobChoiceSource, character.level, newLevel);
	}, [character, jobChoiceSource, newLevel]);

	// Level progression logic
	const currentExperience = character?.experience ?? 0;
	const experienceNeeded =
		character && !isMilestone ? getExperienceForNextLevel(character.level) : 0;
	const canLevelUp =
		!!character && (isMilestone || currentExperience >= experienceNeeded);

	// Path selection: resolve existing canonical references ID-first, then fetch
	// choices only when the character truly has no path reference.
	const { data: resolvedCanonicalPath = null } =
		useQuery<StaticPathSource | null>({
			queryKey: [
				"level-up-canonical-path",
				character?.path_id,
				character?.path,
			],
			queryFn: async () => {
				const resolution = await resolveCanonicalReference("paths", {
					id: character?.path_id,
					name: character?.path,
				});
				return resolution.entry as unknown as StaticPathSource | null;
			},
			enabled: !!(character?.path_id || character?.path),
			staleTime: Number.POSITIVE_INFINITY,
		});
	const needsPathSelection =
		!!character && !character.path && !character.path_id;
	const { data: availablePaths = [] } = useQuery<LevelUpPathOption[]>({
		queryKey: [
			"level-up-paths",
			character?.job,
			newLevel,
			(character?.skill_proficiencies ?? []).join(","),
			campaignId,
			homebrewPaths.map((path) => path.id).join(","),
		],
		queryFn: async () => {
			if (!character?.job) return [];
			const characterJobName = character.job;

			const protocolStaticPaths =
				getStaticPaths() as unknown as StaticPathSource[];
			const staticPathCatalog =
				protocolStaticPaths.length > 0
					? protocolStaticPaths
					: ((await import("@/data/compendium/paths"))
							.paths as unknown as StaticPathSource[]);
			const jobNameKey = normalizeCompendiumKey(characterJobName);
			const staticCandidates: LevelUpPathOption[] = staticPathCatalog
				.filter((path) => {
					const matchesJob = [path.job_id, path.jobId, path.jobName]
						.map((value) => normalizeCompendiumKey(value))
						.filter(Boolean)
						.includes(jobNameKey);
					const unlockLevel = path.path_level ?? getStaticPathUnlockLevel(path);
					return matchesJob && unlockLevel <= newLevel;
				})
				.map((path) => {
					const eligibility = getPathEligibility(path, {
						jobName: characterJobName,
						level: newLevel,
						skillProficiencies: character.skill_proficiencies ?? [],
					});
					return {
						id: path.id,
						name: path.name,
						description: path.description,
						display_name: path.display_name || path.name,
						path_level: path.path_level ?? getStaticPathUnlockLevel(path),
						source_book:
							path.source_book ?? path.source ?? "Rift Ascendant Canon",
						features: path.features ?? [],
						requirements: path.requirements,
						eligibility,
					};
				});
			const homebrewCandidates: LevelUpPathOption[] = homebrewPaths
				.filter((path) =>
					runtimePathMatchesJob(path, undefined, characterJobName),
				)
				.filter((path) => path.path_level <= newLevel)
				.map((path) => ({
					id: path.id,
					name: path.name,
					description: path.description,
					display_name: path.display_name || path.name,
					path_level: path.path_level,
					source_book: path.source_book,
					features: path.features ?? [],
				}));

			// Respect sourcebook entitlements: hide paths from sourcebooks the
			// player (or active campaign) is not entitled to.
			return filterRowsBySourcebookAccess(
				[...staticCandidates, ...homebrewCandidates],
				(row) => row.source_book,
				{ campaignId },
			);
		},
		enabled: needsPathSelection && !!newLevel,
	});
	const selectedPathRow = useMemo(
		() =>
			availablePaths.find(
				(path) =>
					path.id === selectedPath && path.eligibility?.eligible !== false,
			) ?? null,
		[availablePaths, selectedPath],
	);
	const effectivePathName =
		resolvedCanonicalPath?.name ??
		character?.path ??
		selectedPathRow?.name ??
		null;
	const characterRegentNames = useMemo(() => {
		const overlays = Array.isArray(character?.regent_overlays)
			? character.regent_overlays.filter(
					(value): value is string => typeof value === "string",
				)
			: [];
		if (overlays.length === 0) return [];
		const overlayKeys = new Set(overlays.map(normalizeCompendiumKey));
		const regents = getStaticRegents() as Array<{
			id?: string | null;
			name?: string | null;
			display_name?: string | null;
		}>;
		const names = new Set<string>();
		for (const regent of regents) {
			const candidates = [regent.id, regent.name, regent.display_name]
				.map(normalizeCompendiumKey)
				.filter(Boolean);
			if (candidates.some((candidate) => overlayKeys.has(candidate))) {
				if (regent.name) names.add(regent.name);
			}
		}
		for (const overlay of overlays) names.add(overlay);
		return Array.from(names);
	}, [character?.regent_overlays]);

	const pathChoiceSource = useMemo(() => {
		if (!character?.job || !effectivePathName) return null;
		if (selectedPathRow) {
			return toPathChoiceSourceData(selectedPathRow, effectivePathName);
		}
		if (resolvedCanonicalPath) {
			return toPathChoiceSourceData(
				resolvedCanonicalPath as Pick<ChoiceSourceData, "features" | "name">,
				effectivePathName,
			);
		}
		const jobNameKey = normalizeCompendiumKey(character.job);
		const pathNameKey = normalizeCompendiumKey(effectivePathName);
		const staticPath = (getStaticPaths() as unknown as StaticPathSource[]).find(
			(path) => {
				const matchesJob = [path.job_id, path.jobId, path.jobName]
					.map((value) => normalizeCompendiumKey(value))
					.filter(Boolean)
					.includes(jobNameKey);
				return matchesJob && normalizeCompendiumKey(path.name) === pathNameKey;
			},
		);
		const homebrewPath = homebrewPaths.find((path) => {
			const matchesJob = runtimePathMatchesJob(path, undefined, character.job);
			return matchesJob && normalizeCompendiumKey(path.name) === pathNameKey;
		});
		return toPathChoiceSourceData(
			staticPath ?? homebrewPath,
			effectivePathName,
		);
	}, [
		character?.job,
		effectivePathName,
		homebrewPaths,
		resolvedCanonicalPath,
		selectedPathRow,
	]);

	// Active regent overlays as choice sources so their full independent
	// progression (casters: cantrips/spells known; martials: powers/techniques
	// known) is counted alongside the base job at level-up. Regents are never fed
	// into character creation — this wiring lives only in the level-up wizard.
	const regentChoiceSources = useMemo<ChoiceSourceData[]>(() => {
		if (characterRegentNames.length === 0) return [];
		const staticRegents = getStaticRegents() as unknown as Regent[];
		const byKey = new Map(
			staticRegents.map((r) => [normalizeCompendiumKey(r.name), r]),
		);
		return characterRegentNames
			.map((name) => byKey.get(normalizeCompendiumKey(name)))
			.filter((r): r is Regent => Boolean(r))
			.map((r) => regentToChoiceSource(r));
	}, [characterRegentNames]);

	const availableChoices = useMemo(
		() =>
			calculateTotalChoices(
				jobChoiceSource,
				pathChoiceSource,
				regentChoiceSources,
				newLevel,
			),
		[jobChoiceSource, pathChoiceSource, regentChoiceSources, newLevel],
	);

	const choiceDeltas = useMemo(() => {
		if (!character || !jobChoiceSource) return {};
		return getLevelUpChoiceDeltas(
			jobChoiceSource,
			pathChoiceSource,
			regentChoiceSources,
			character.level,
			newLevel,
			character.path || character.path_id ? pathChoiceSource : null,
		);
	}, [
		character,
		jobChoiceSource,
		pathChoiceSource,
		regentChoiceSources,
		newLevel,
	]);

	const requiredPowerChoices = choiceDeltas.powers ?? 0;
	const requiredTechniqueChoices = choiceDeltas.techniques ?? 0;
	const requiredCantripChoices = choiceDeltas.cantrips ?? 0;
	const requiredSpellChoices = choiceDeltas.spells ?? 0;
	const requiredSpellbookInscriptions = choiceDeltas.spellbookInscriptions ?? 0;
	const requiredFightingStyleChoices = choiceDeltas.fightingStyles ?? 0;

	// Fetch available feats for selection at ASI levels
	const { data: availableFeats = [] } = useQuery({
		queryKey: ["level-up-feats", character?.job, newLevel, campaignId],
		queryFn: async () => {
			if (!character || !isASILevel(newLevel, character.job)) return [];

			const entries = await listCanonicalEntries("feats", undefined, {
				campaignId,
			});
			const sorted = entries
				.slice()
				.sort((a, b) => a.name.localeCompare(b.name));

			// Filter feats by prerequisites (level-based)
			return sorted.filter((feat) => {
				const prereqs =
					feat.prerequisites &&
					typeof feat.prerequisites === "object" &&
					!Array.isArray(feat.prerequisites)
						? feat.prerequisites
						: null;
				if (!prereqs) return true;
				const p = prereqs as Record<string, unknown>;
				if (typeof p.level !== "number") return true;
				return (p.level as number) <= newLevel;
			}) as unknown as CompendiumFeat[];
		},
		enabled: !!character && isASILevel(newLevel, character?.job),
	});

	const showPathSelection = needsPathSelection && availablePaths.length > 0;
	const showASISection =
		!!character && isASILevel(newLevel, jobObj || character.job);
	const showFeatSelection = showASISection && availableChoices.feats > 0;
	const maxSpellLevel = character?.job
		? getEffectiveMaxAbilityLevel({
				jobName: character.job,
				pathName: effectivePathName,
				characterLevel: newLevel,
				kind: "spell",
				regentNames: characterRegentNames,
			})
		: 0;
	const maxPowerLevel = character?.job
		? getEffectiveMaxAbilityLevel({
				jobName: character.job,
				pathName: effectivePathName,
				characterLevel: newLevel,
				kind: "power",
				regentNames: characterRegentNames,
			})
		: 0;

	const { data: availablePowers = [] } = useQuery<CanonicalCastableEntry[]>({
		queryKey: [
			"level-up-powers",
			character?.job,
			effectivePathName,
			newLevel,
			requiredPowerChoices,
			maxPowerLevel,
			campaignId,
			characterRegentNames.join(","),
		],
		queryFn: async () => {
			if (!character?.job || requiredPowerChoices <= 0) return [];
			return listLearnablePowers({
				accessContext: { campaignId },
				jobName: character.job,
				pathName: effectivePathName,
				characterLevel: newLevel,
				regentNames: characterRegentNames,
			});
		},
		enabled: !!character?.job && requiredPowerChoices > 0,
	});

	const { data: availableTechniques = [] } = useQuery<StaticCompendiumEntry[]>({
		queryKey: [
			"level-up-techniques",
			character?.job,
			effectivePathName,
			newLevel,
			requiredTechniqueChoices,
			campaignId,
			characterRegentNames.join(","),
		],
		queryFn: async () => {
			if (!character?.job || requiredTechniqueChoices <= 0) return [];
			return listLearnableTechniques({
				accessContext: { campaignId },
				jobName: character.job,
				pathName: effectivePathName,
				characterLevel: newLevel,
				regentNames: characterRegentNames,
				maxLevel: newLevel,
			});
		},
		enabled: !!character?.job && requiredTechniqueChoices > 0,
	});

	const { data: availableCantrips = [] } = useQuery<CanonicalCastableEntry[]>({
		queryKey: [
			"level-up-cantrips",
			character?.job,
			effectivePathName,
			newLevel,
			requiredCantripChoices,
			campaignId,
			characterRegentNames.join(","),
			homebrewSpells.map((spell) => spell.id).join(","),
		],
		queryFn: async () => {
			if (!character?.job || requiredCantripChoices <= 0) return [];
			const spells = await listLearnableSpells({
				accessContext: { campaignId },
				jobName: character.job,
				pathName: effectivePathName,
				characterLevel: newLevel,
				regentNames: characterRegentNames,
				maxPowerLevel: 0,
			});
			const matchingHomebrew = homebrewSpells.filter(
				(spell) =>
					spell.power_level === 0 &&
					runtimeSpellMatchesCharacter(spell, character.job, effectivePathName),
			);
			return [
				...spells.filter((spell) => spell.power_level === 0),
				...(matchingHomebrew as unknown as CanonicalCastableEntry[]),
			];
		},
		enabled: !!character?.job && requiredCantripChoices > 0,
	});

	const { data: availableSpells = [] } = useQuery<CanonicalCastableEntry[]>({
		queryKey: [
			"level-up-spells",
			character?.job,
			effectivePathName,
			newLevel,
			requiredSpellChoices,
			maxSpellLevel,
			campaignId,
			characterRegentNames.join(","),
			homebrewSpells.map((spell) => spell.id).join(","),
		],
		queryFn: async () => {
			if (!character?.job || requiredSpellChoices <= 0) return [];
			const spells = await listLearnableSpells({
				accessContext: { campaignId },
				jobName: character.job,
				pathName: effectivePathName,
				characterLevel: newLevel,
				regentNames: characterRegentNames,
			});
			const matchingHomebrew = homebrewSpells.filter(
				(spell) =>
					spell.power_level > 0 &&
					spell.power_level <= maxSpellLevel &&
					runtimeSpellMatchesCharacter(spell, character.job, effectivePathName),
			);
			return [
				...spells.filter((spell) => spell.power_level > 0),
				...(matchingHomebrew as unknown as CanonicalCastableEntry[]),
			];
		},
		enabled: !!character?.job && requiredSpellChoices > 0,
	});

	const { data: availableSpellbookSpells = [] } = useQuery<
		CanonicalCastableEntry[]
	>({
		queryKey: [
			"level-up-spellbook",
			character?.job,
			effectivePathName,
			newLevel,
			requiredSpellbookInscriptions,
			maxSpellLevel,
			campaignId,
			characterRegentNames.join(","),
			homebrewSpells.map((spell) => spell.id).join(","),
		],
		queryFn: async () => {
			if (!character?.job || requiredSpellbookInscriptions <= 0) return [];
			const spells = await listLearnableSpells({
				accessContext: { campaignId },
				jobName: character.job,
				pathName: effectivePathName,
				characterLevel: newLevel,
				regentNames: characterRegentNames,
			});
			const matchingHomebrew = homebrewSpells.filter(
				(spell) =>
					spell.power_level > 0 &&
					spell.power_level <= maxSpellLevel &&
					runtimeSpellMatchesCharacter(spell, character.job, effectivePathName),
			);
			return [
				...spells.filter((spell) => spell.power_level > 0),
				...(matchingHomebrew as unknown as CanonicalCastableEntry[]),
			];
		},
		enabled: !!character?.job && requiredSpellbookInscriptions > 0,
	});

	// Retrain (swap) support — which ability kinds this job may swap, the
	// character's current known rows for the picked kind, and the legal
	// replacements (same learnability gating as new picks).
	const swapKindOptions = useMemo(
		() => getSwappableKinds(character?.job, newLevel),
		[character?.job, newLevel],
	);

	const { data: swapOutOptions = [] } = useQuery<
		Array<{ id: string; name: string; refId: string | null }>
	>({
		queryKey: ["level-up-swap-known", characterId, swapKind],
		queryFn: async () => {
			if (!character || swapKind === "none") return [];
			if (swapKind === "technique") {
				const canonical = await listCanonicalEntries("techniques", undefined, {
					campaignId,
				});
				const nameById = new Map(canonical.map((t) => [t.id, t.name]));
				if (isLocalCharacterId(character.id)) {
					return listLocalTechniques(character.id).map((row) => ({
						id: row.id,
						name: nameById.get(row.technique_id) ?? row.technique_id,
						refId: row.technique_id ?? null,
					}));
				}
				const { data } = await supabase
					.from("character_techniques")
					.select("id, technique_id")
					.eq("character_id", character.id);
				return (data ?? []).map((row) => ({
					id: row.id,
					name: nameById.get(row.technique_id) ?? row.technique_id,
					refId: row.technique_id,
				}));
			}
			if (swapKind === "power") {
				if (isLocalCharacterId(character.id)) {
					return listLocalPowers(character.id)
						.filter((row) => (row.power_level ?? 0) > 0)
						.map((row) => ({
							id: row.id,
							name: row.name,
							refId: row.power_id ?? null,
						}));
				}
				const { data } = await supabase
					.from("character_powers")
					.select("id, name, power_id, power_level")
					.eq("character_id", character.id);
				return (data ?? [])
					.filter((row) => (row.power_level ?? 0) > 0)
					.map((row) => ({ id: row.id, name: row.name, refId: row.power_id }));
			}
			// Spells — cantrips are never swapped (5e rule).
			if (isLocalCharacterId(character.id)) {
				return listLocalSpells(character.id)
					.filter((row) => (row.spell_level ?? 0) > 0)
					.map((row) => ({
						id: row.id,
						name: row.name,
						refId: row.spell_id ?? null,
					}));
			}
			const { data } = await supabase
				.from("character_spells")
				.select("id, name, spell_id, spell_level")
				.eq("character_id", character.id);
			return (data ?? [])
				.filter((row) => (row.spell_level ?? 0) > 0)
				.map((row) => ({ id: row.id, name: row.name, refId: row.spell_id }));
		},
		enabled: !!character && swapKind !== "none",
	});

	const knownSwapRefIds = useMemo(
		() =>
			new Set(
				swapOutOptions
					.map((row) => row.refId)
					.filter((id): id is string => !!id),
			),
		[swapOutOptions],
	);

	const { data: swapInOptions = [] } = useQuery<
		Array<CanonicalCastableEntry | StaticCompendiumEntry>
	>({
		queryKey: [
			"level-up-swap-candidates",
			character?.job,
			effectivePathName,
			swapKind,
			newLevel,
			campaignId,
			characterRegentNames.join(","),
		],
		queryFn: async () => {
			if (!character?.job || swapKind === "none") return [];
			if (swapKind === "spell") {
				const spells = await listLearnableSpells({
					accessContext: { campaignId },
					jobName: character.job,
					pathName: effectivePathName,
					characterLevel: newLevel,
					regentNames: characterRegentNames,
				});
				return spells.filter((spell) => spell.power_level > 0);
			}
			if (swapKind === "power") {
				return listLearnablePowers({
					accessContext: { campaignId },
					jobName: character.job,
					pathName: effectivePathName,
					characterLevel: newLevel,
					regentNames: characterRegentNames,
				});
			}
			return listLearnableTechniques({
				accessContext: { campaignId },
				jobName: character.job,
				pathName: effectivePathName,
				characterLevel: newLevel,
				regentNames: characterRegentNames,
				maxLevel: newLevel,
			});
		},
		enabled: !!character?.job && swapKind !== "none",
	});

	const availableFightingStyles = useMemo(() => {
		const armorProficiencies =
			jobObj?.armorProficiencies ?? jobObj?.armor_proficiencies;
		const gated = getFightingStylesForJob(armorProficiencies);
		const ledgerStyleIds = new Set(
			levelUpLedgerEntries
				.filter((entry) => entry.type === "fighting-style")
				.flatMap((entry) => entry.options ?? []),
		);
		return ledgerStyleIds.size > 0
			? gated.filter((style) => ledgerStyleIds.has(style.id))
			: gated;
	}, [jobObj, levelUpLedgerEntries]);

	const ledgerOptionPanels = useMemo<LedgerOptionPanel[]>(() => {
		const panels: LedgerOptionPanel[] = [];
		for (const [ledgerIndex, entry] of levelUpLedgerEntries.entries()) {
			const key = `${entry.level}:${entry.type}:${entry.source}`;
			if (entry.type === "fighting-style") continue;
			if (entry.type === "favored-terrain") {
				panels.push({
					key,
					ledgerIndex,
					label: entry.source,
					count: entry.count,
					type: entry.type,
					options: STALKER_FAVORED_TERRAINS.map((terrain) => ({
						id: terrain,
						label: terrain,
					})),
				});
				continue;
			}
			if (
				entry.type === "specialist-training" ||
				entry.type === "frequency-mastery"
			) {
				const skillOptions = (character?.skill_proficiencies ?? []).map(
					(skill) => ({
						id: skill,
						label: skill,
						description:
							entry.type === "frequency-mastery"
								? "Treat low signal rolls as stable output for this skill."
								: "Double proficiency for this skill.",
					}),
				);
				panels.push({
					key,
					ledgerIndex,
					label: entry.source,
					count: entry.count,
					type: entry.type,
					options: skillOptions,
				});
				continue;
			}
			if (entry.options && entry.options.length > 0) {
				panels.push({
					key,
					ledgerIndex,
					label: entry.source,
					count: entry.count,
					type: entry.type,
					options: entry.options.map((option) => ({
						id: option,
						label: formatOptionLabel(option),
					})),
				});
			}
		}
		return panels;
	}, [character?.skill_proficiencies, levelUpLedgerEntries]);

	const unresolvedLedgerEntries = useMemo(
		() =>
			levelUpLedgerEntries.filter((entry) => {
				if (
					entry.type === "power" ||
					entry.type === "technique" ||
					entry.type === "cantrip" ||
					entry.type === "spell" ||
					entry.type === "fighting-style" ||
					entry.type === "favored-terrain" ||
					entry.type === "specialist-training" ||
					entry.type === "frequency-mastery"
				) {
					return false;
				}
				if (entry.options && entry.options.length > 0) return false;
				return true;
			}),
		[levelUpLedgerEntries],
	);

	const ledgerOptionRequirementsMet = ledgerOptionPanels.every(
		(panel) => (selectedLedgerOptions[panel.key]?.length ?? 0) >= panel.count,
	);

	// Regent progression: show new regent features unlocked at this level
	const { unlocks: regentUnlocks } = useRegentUnlocks(characterId || "");
	const primaryRegentUnlock =
		regentUnlocks.find((u: { is_primary?: boolean }) => u.is_primary) ??
		regentUnlocks[0];
	const regentData = primaryRegentUnlock
		? getStaticRegents().find(
				(m: { id: string }) => m.id === primaryRegentUnlock.regent_id,
			)
		: null;
	// Route through the regent progression normalizer so regents whose content
	// lives in the flat `abilities`/`features` + `progression_table` (Radiant,
	// Steel, Destruction, War, and the truncated Plague/Mimic) surface their
	// per-level features here just like the curated ones (Umbral, Frost, …).
	const newRegentFeatures = regentData
		? getRegentFeaturesAtLevel(regentData as unknown as Regent, newLevel)
		: [];

	// Fetch features for the new level (DB first, static fallback)
	const { data: newFeatures = [], isLoading: newFeaturesLoading } = useQuery<
		LevelUpFeatureRow[]
	>({
		queryKey: [
			"job-features",
			character?.job,
			effectivePathName,
			newLevel,
			campaignId,
			staticJobs?.length,
			homebrewJobObj?.homebrew_id,
			homebrewPaths.map((path) => path.id).join(","),
		],
		queryFn: async () => {
			if (!character?.job) return [];
			const characterJobName = character.job;

			const staticJob = staticJobs?.find(
				(job) => job.name === characterJobName,
			);
			const staticJobId = staticJob?.id ?? null;
			const staticJobClassFeatures = staticJob?.classFeatures ?? [];
			const staticJobFeatures: LevelUpFeatureRow[] = staticJobId
				? staticJobClassFeatures
						.filter((feature) => feature.level === newLevel)
						.map((feature, index) => {
							const parsed = parseFeatureMetadata(feature.description);
							const sourceIndex =
								staticJobClassFeatures.indexOf(feature) ?? index;
							const workflowSourcePath = `classFeatures[${sourceIndex}]`;
							return {
								id:
									createCharacterWorkflowSourceAddressV1({
										ownerId: staticJobId,
										collection: "job-features",
										sourcePath: workflowSourcePath,
										label: feature.name,
									}).id ?? "",
								name: feature.name,
								description: feature.description,
								level: feature.level,
								is_path_feature: false,
								action_type: parsed.action_type,
								uses_formula: feature.uses?.formula ?? parsed.uses_formula,
								prerequisites: null,
								recharge: feature.uses
									? resolveFeatureRecharge(feature.uses, newLevel)
									: parsed.recharge,
								source_name: null,
								workflow_source_kind: "source-address" as const,
								workflow_source_path: workflowSourcePath,
								workflow_owner_id: staticJobId,
							};
						})
				: [];

			const protocolStaticPaths =
				getStaticPaths() as unknown as StaticPathSource[];
			const staticPathCatalog =
				protocolStaticPaths.length > 0
					? protocolStaticPaths
					: ((await import("@/data/compendium/paths"))
							.paths as unknown as StaticPathSource[]);
			const jobNameKey = normalizeCompendiumKey(character.job);
			const pathNameKey = normalizeCompendiumKey(effectivePathName);
			const staticPathFeatures: LevelUpFeatureRow[] = effectivePathName
				? staticPathCatalog
						.filter((path) => {
							const matchesJob = [path.job_id, path.jobId, path.jobName]
								.map((value) => normalizeCompendiumKey(value))
								.filter(Boolean)
								.includes(jobNameKey);
							return (
								matchesJob && normalizeCompendiumKey(path.name) === pathNameKey
							);
						})
						.flatMap((path) =>
							(path.features ?? [])
								.filter((feature) => feature.level === newLevel)
								.map((feature, index) => {
									const parsed = parseFeatureMetadata(feature.description);
									const hasStructuredTracking =
										feature.tracking != null || feature.resource != null;
									const tracksUses =
										feature.tracking === "uses" ||
										(!hasStructuredTracking && feature.uses != null);
									const structuredUses = tracksUses ? feature.uses : null;
									const sourceIndex = path.features?.indexOf(feature) ?? index;
									const workflowSourcePath = `features[${sourceIndex}]`;
									return {
										id:
											createCharacterWorkflowSourceAddressV1({
												ownerId: path.id,
												collection: "path-features",
												sourcePath: workflowSourcePath,
												label: feature.name,
											}).id ?? "",
										name: feature.name,
										description: feature.description,
										level: feature.level,
										is_path_feature: true,
										action_type:
											feature.actionType !== undefined
												? feature.actionType
												: parsed.action_type,
										uses_formula:
											structuredUses?.formula ??
											(hasStructuredTracking ? null : parsed.uses_formula),
										prerequisites: path.prerequisites ?? null,
										recharge:
											structuredUses?.recharge ??
											(hasStructuredTracking ? null : parsed.recharge),
										source_name: null,
										workflow_source_kind: "source-address" as const,
										workflow_source_path: workflowSourcePath,
										workflow_owner_id: path.id,
									};
								}),
						)
				: [];
			const homebrewJobFeatures: LevelUpFeatureRow[] = homebrewJobObj
				? [
						...homebrewJobObj.classFeatures,
						...homebrewJobObj.awakeningFeatures,
						...homebrewJobObj.jobTraits,
					]
						.filter((feature) => feature.level === newLevel)
						.map((feature) => ({
							id: feature.id,
							name: feature.name,
							description: feature.description,
							level: feature.level,
							is_path_feature: false,
							action_type: feature.action_type,
							uses_formula: feature.uses_formula,
							prerequisites: feature.prerequisites,
							recharge: feature.recharge,
							source_name: feature.source_name,
							homebrew_id: feature.homebrew_id,
							workflow_source_kind: "homebrew" as const,
							workflow_source_path: `publishedHomebrew.jobs.${homebrewJobObj.homebrew_id}.features.${feature.id}`,
							workflow_owner_id: homebrewJobObj.id,
							modifiers: feature.modifiers
								? (feature.modifiers as Database["public"]["Tables"]["character_features"]["Insert"]["modifiers"])
								: null,
						}))
				: [];
			const homebrewPathFeatures: LevelUpFeatureRow[] = effectivePathName
				? homebrewPaths
						.filter(
							(path) =>
								normalizeCompendiumKey(path.name) === pathNameKey &&
								runtimePathMatchesJob(path, undefined, characterJobName),
						)
						.flatMap((path) =>
							path.features
								.filter((feature) => feature.level === newLevel)
								.map((feature) => ({
									id: feature.id,
									name: feature.name,
									description: feature.description,
									level: feature.level,
									is_path_feature: true,
									action_type: feature.action_type,
									uses_formula: feature.uses_formula,
									prerequisites: feature.prerequisites,
									recharge: feature.recharge,
									source_name: feature.source_name,
									homebrew_id: feature.homebrew_id,
									workflow_source_kind: "homebrew" as const,
									workflow_source_path: `publishedHomebrew.paths.${path.homebrew_id}.features.${feature.id}`,
									workflow_owner_id: path.id,
									modifiers: feature.modifiers
										? (feature.modifiers as Database["public"]["Tables"]["character_features"]["Insert"]["modifiers"])
										: null,
								})),
						)
				: [];

			const staticFeatureBase = [
				...staticJobFeatures,
				...staticPathFeatures,
				...homebrewJobFeatures,
				...homebrewPathFeatures,
			].filter(
				(feature, index, allFeatures) =>
					allFeatures.findIndex(
						(candidate) =>
							normalizeCompendiumKey(candidate.name) ===
							normalizeCompendiumKey(feature.name),
					) === index,
			);

			// Canonical static features are the sole source for built-in content.
			return staticFeatureBase;
		},
		enabled: !!character && !!newLevel && !!staticJobs,
	});

	const isLevelDown = !!character && newLevel < character.level;

	useEffect(() => {
		if (character) {
			setNewLevel(Math.min(character.level + 1, 20));
		}
	}, [character]);

	// Reset the retrain picks whenever the modal opens for a fresh level-up.
	useEffect(() => {
		if (isOpen) {
			setSwapKind("none");
			setSwapOutId("");
			setSwapInId("");
		}
	}, [isOpen]);

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
		setSelectedLedgerOptions((current) => {
			const panelByKey = new Map(
				ledgerOptionPanels.map((panel) => [
					panel.key,
					new Set(panel.options.map((option) => option.id)),
				]),
			);
			let changed = false;
			const next: Record<string, string[]> = {};
			for (const [key, values] of Object.entries(current)) {
				const allowed = panelByKey.get(key);
				if (!allowed) {
					changed = true;
					continue;
				}
				const kept = values.filter((value) => allowed.has(value));
				if (kept.length !== values.length) changed = true;
				next[key] = kept;
			}
			return changed ? next : current;
		});
	}, [ledgerOptionPanels]);

	if (isLoading || jobsLoading || !character || !staticJobs) {
		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="max-w-md bg-background border-resurge/20">
					<div className="flex flex-col items-center justify-center py-12 gap-4">
						<div className="relative">
							<div className="w-16 h-16 border-4 border-resurge/20 rounded-full" />
							<div className="absolute inset-0 w-16 h-16 border-4 border-t-resurge rounded-full animate-spin" />
						</div>
						<p className="text-muted-foreground font-heading animate-pulse">
							Accessing Ascendant Data...
						</p>
					</div>
					<div className="text-xs text-center text-muted-foreground font-heading mb-4">
						Advancement Mode: {isMilestone ? "Milestone" : "XP"}
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	// Calculate HP increase (DDB / 5e parity — see levelUpCalculations.ts).
	const vitModifier = getAbilityModifier(character.abilities.VIT);
	const hitDieSize = character.hit_dice_size;
	const averageHP = calculateAverageHPGain(hitDieSize, vitModifier);
	const maxHP = calculateMaxHPGain(hitDieSize, vitModifier);
	const minHP = calculateMinHPGain(vitModifier);

	const handleLevelDown = async () => {
		if (!character || newLevel >= character.level || newLevel < 1) return;
		const levelDownPreflight = buildCharacterLevelDownPreflightV1({
			characterId: character.id,
			fromLevel: character.level,
			toLevel: newLevel,
			sourceKey: `character-progression:${character.id}`,
			records: [],
			ownershipAndHistoryComplete: false,
		});
		if (!levelDownPreflight.canRemoveProgression) {
			toast({
				title: "Level down requires recorded history",
				description: summarizeCharacterWorkflowBlockersV1(
					levelDownPreflight.blockers,
				),
				variant: "destructive",
			});
			return;
		}
		setLoading(true);
		try {
			const levelsLost = character.level - newLevel;
			const hitDieSize = character.hit_dice_size ?? 8;
			const vitMod = getAbilityModifier(character.abilities.VIT);
			const avgHpPerLevel = Math.max(
				1,
				calculateAverageHPGain(hitDieSize, vitMod),
			);
			const hpReduction = avgHpPerLevel * levelsLost;
			const newHP = Math.max(1, (character.hp_max ?? 1) - hpReduction);
			const newProfBonus = calculateProficiencyBonusForLevel(newLevel);
			const newRiftFavorDie = calculateRiftFavorDie(newLevel);
			const newRiftFavorMax = calculateRiftFavorMax(newLevel);

			await removeProgressionGrantsAboveLevel(
				character.id,
				character.level,
				newLevel,
			);

			await updateCharacter.mutateAsync({
				id: character.id,
				data: {
					level: newLevel,
					hp_max: newHP,
					hp_current: Math.min(character.hp_current ?? newHP, newHP),
					hit_dice_max: newLevel,
					hit_dice_current: Math.min(
						character.hit_dice_current ?? newLevel,
						newLevel,
					),
					proficiency_bonus: newProfBonus,
					rift_favor_die: newRiftFavorDie,
					rift_favor_max: newRiftFavorMax,
					rift_favor_current: Math.min(
						character.rift_favor_current ?? newRiftFavorMax,
						newRiftFavorMax,
					),
				},
			});

			// Re-initialize spell slots for new lower level
			try {
				await initializeSpellSlots.mutateAsync({
					characterId: character.id,
					job: jobObj || character.job,
					level: newLevel,
				});
			} catch (error) {
				logger.error(
					"Failed to re-initialize spell slots on level down:",
					error,
				);
			}

			// Auto-update remaining feature uses
			try {
				await autoUpdateFeatureUses(character.id);
				await reconcileAbilityUses(character.id);
			} catch (error) {
				logger.error(
					"Failed to auto-update feature uses on level down:",
					error,
				);
			}

			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["powers", character.id] }),
				queryClient.invalidateQueries({
					queryKey: ["character-spells", character.id],
				}),
				queryClient.invalidateQueries({ queryKey: ["features", character.id] }),
				queryClient.invalidateQueries({
					queryKey: ["character-features", character.id],
				}),
				queryClient.invalidateQueries({
					queryKey: ["character-techniques", character.id],
				}),
				queryClient.invalidateQueries({
					queryKey: ["character", character.id],
				}),
				// The plural list feeds useCombatActions/HUD — without this the
				// action cards read pre-change scores for the query staleTime.
				queryClient.invalidateQueries({ queryKey: ["characters"] }),
				queryClient.invalidateQueries({
					queryKey: ["combat-actions", character.id],
				}),
			]);

			toast({
				title: "Level Down Complete",
				description: `${character.name} reduced to Level ${newLevel}. Features and abilities above this level have been removed.`,
			});
			onClose();
		} catch {
			toast({
				title: "Failed to level down",
				description: "Could not complete level reduction. Please try again.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleLevelUp = async () => {
		if (newLevel <= character.level) {
			toast({
				title: "Invalid level",
				description: "New level must be higher than current level.",
				variant: "destructive",
			});
			return;
		}

		if (hpIncrease === null) {
			toast({
				title: "HP increase required",
				description: "Please enter or roll for HP increase.",
				variant: "destructive",
			});
			return;
		}

		if (!isMilestone && !canLevelUp) {
			toast({
				title: "Not enough experience",
				description: "You need more XP before leveling up.",
				variant: "destructive",
			});
			return;
		}

		if (showPathSelection && !selectedPathRow) {
			const requirement = availablePaths.find(
				(path) => path.id === selectedPath,
			)?.eligibility;
			toast({
				title: requirement
					? "Path requirements not met"
					: "Path selection required",
				description:
					requirement?.reason ??
					"Choose a path before completing this level up.",
				variant: "destructive",
			});
			return;
		}

		if (selectedPowerIds.length < requiredPowerChoices) {
			toast({
				title: "Power selection required",
				description: `Choose ${requiredPowerChoices} power${requiredPowerChoices === 1 ? "" : "s"} before completing this level up.`,
				variant: "destructive",
			});
			return;
		}

		if (selectedTechniqueIds.length < requiredTechniqueChoices) {
			toast({
				title: "Technique selection required",
				description: `Choose ${requiredTechniqueChoices} technique${requiredTechniqueChoices === 1 ? "" : "s"} before completing this level up.`,
				variant: "destructive",
			});
			return;
		}

		if (selectedCantripIds.length < requiredCantripChoices) {
			toast({
				title: "Cantrip selection required",
				description: `Choose ${requiredCantripChoices} cantrip${requiredCantripChoices === 1 ? "" : "s"} before completing this level up.`,
				variant: "destructive",
			});
			return;
		}

		if (selectedSpellIds.length < requiredSpellChoices) {
			toast({
				title: "Power inscription required",
				description: `Choose ${requiredSpellChoices} power inscription${requiredSpellChoices === 1 ? "" : "s"} before completing this level up.`,
				variant: "destructive",
			});
			return;
		}

		if (selectedSpellbookIds.length < requiredSpellbookInscriptions) {
			toast({
				title: "Spellbook inscription required",
				description: `Choose ${requiredSpellbookInscriptions} spellbook inscription${requiredSpellbookInscriptions === 1 ? "" : "s"} before completing this level up.`,
				variant: "destructive",
			});
			return;
		}

		if (selectedFightingStyleIds.length < requiredFightingStyleChoices) {
			toast({
				title: "Fighting Style required",
				description: `Choose ${requiredFightingStyleChoices} Fighting Style${requiredFightingStyleChoices === 1 ? "" : "s"} before completing this level up.`,
				variant: "destructive",
			});
			return;
		}

		if (!ledgerOptionRequirementsMet) {
			toast({
				title: "Selection protocol required",
				description:
					"Complete all ledger-driven selections before leveling up.",
				variant: "destructive",
			});
			return;
		}
		if (newFeaturesLoading) {
			toast({
				title: "Progression data still resolving",
				description:
					"Wait for canonical and homebrew level features to finish loading, then try again.",
				variant: "destructive",
			});
			return;
		}

		const jobWorkflowIdentity = homebrewJobObj
			? homebrewWorkflowIdentity(
					character.job_id,
					homebrewJobObj.name,
					"jobs",
					`publishedHomebrew.jobs.${homebrewJobObj.homebrew_id}`,
				)
			: canonicalWorkflowIdentity(
					character.job_id,
					character.job ?? "Current job",
					"jobs",
					staticJobObj?.source ?? null,
				);
		const selectedHomebrewPath = selectedPathRow
			? homebrewPaths.find((path) => path.id === selectedPathRow.id)
			: null;
		const selectedPathWorkflowIdentity = selectedPathRow
			? selectedHomebrewPath
				? homebrewWorkflowIdentity(
						selectedHomebrewPath.id,
						selectedHomebrewPath.name,
						"paths",
						`publishedHomebrew.paths.${selectedHomebrewPath.homebrew_id}`,
					)
				: canonicalWorkflowIdentity(
						selectedPathRow.id,
						selectedPathRow.name,
						"paths",
						selectedPathRow.source_book ?? null,
					)
			: null;
		const persistedHomebrewPath = character.path_id
			? homebrewPaths.find((path) => path.id === character.path_id)
			: null;
		const activePathWorkflowIdentity =
			selectedPathWorkflowIdentity ??
			(character.path || character.path_id
				? persistedHomebrewPath
					? homebrewWorkflowIdentity(
							character.path_id,
							persistedHomebrewPath.name,
							"paths",
							`publishedHomebrew.paths.${persistedHomebrewPath.homebrew_id}`,
						)
					: canonicalWorkflowIdentity(
							character.path_id,
							effectivePathName ?? "Current path",
							"paths",
						)
				: null);
		const levelWorkflowFeatures: CharacterWorkflowFeatureInputV1[] =
			newFeatures.map((feature) => {
				const owner = feature.is_path_feature
					? (activePathWorkflowIdentity ??
						canonicalWorkflowIdentity(null, "Current path", "paths"))
					: jobWorkflowIdentity;
				const identity =
					feature.workflow_source_kind === "homebrew"
						? homebrewWorkflowIdentity(
								feature.id,
								feature.name,
								"homebrew-features",
								feature.workflow_source_path,
							)
						: createCharacterWorkflowSourceAddressV1({
								ownerId: feature.workflow_owner_id,
								collection: feature.is_path_feature
									? "path-features"
									: "job-features",
								sourcePath: feature.workflow_source_path,
								label: feature.name,
							});
				return {
					identity,
					owner,
					level: feature.level,
					payload: {
						description: feature.description ?? null,
						homebrewId: feature.homebrew_id ?? null,
					},
				};
			});
		if (regentData) {
			const regentWorkflowIdentity = canonicalWorkflowIdentity(
				regentData.id,
				regentData.name,
				"regents",
				regentData.source_book ?? null,
			);
			for (const feature of newRegentFeatures) {
				const reviewBlocked =
					feature.canonStatus === "review-blocked" ||
					Boolean(feature.reviewBlockerId);
				levelWorkflowFeatures.push({
					identity: canonicalWorkflowIdentity(
						feature.id,
						feature.name,
						"regent-features",
						regentData.source_book ?? null,
					),
					owner: regentWorkflowIdentity,
					level: feature.level,
					payload: {
						description: feature.description,
						canonStatus: feature.canonStatus,
						tracking: feature.tracking ?? null,
						provenancePath: feature.provenance.fieldPath,
					},
					disposition: reviewBlocked
						? "review-blocked"
						: feature.tracking === "manual"
							? "manual"
							: "automatic",
					reviewBlockerId: reviewBlocked
						? (feature.reviewBlockerId ?? null)
						: null,
					instructions: reviewBlocked
						? "Resolve the authored Regent mechanics review before applying this level."
						: feature.tracking === "manual"
							? "Record this Regent feature through the manual mechanics workflow."
							: null,
				});
			}
		}

		const levelWorkflowChoices: CharacterWorkflowChoiceInputV1[] = [];
		const addCatalogChoice = (input: {
			kind: CharacterWorkflowChoiceInputV1["kind"];
			sourceIndex: number;
			count: number;
			prompt: string;
			entries: ReadonlyArray<{
				id: string;
				name: string;
				_homebrew?: boolean;
			}>;
			selectedIds: readonly string[];
			collection: string;
			grantType: CharacterWorkflowChoiceInputV1["grantType"];
		}) => {
			if (input.count <= 0) return;
			levelWorkflowChoices.push({
				kind: input.kind,
				source: jobWorkflowIdentity,
				sourceIndex: input.sourceIndex,
				level: newLevel,
				count: input.count,
				prompt: input.prompt,
				options: input.entries.map((entry, index) =>
					entry._homebrew
						? homebrewWorkflowIdentity(
								entry.id,
								entry.name,
								input.collection,
								`publishedHomebrew.spells.${entry.id}.selection[${index}]`,
								"display-only",
							)
						: canonicalWorkflowIdentity(entry.id, entry.name, input.collection),
				),
				selectedOptionIds: [...input.selectedIds],
				grantType: input.grantType,
			});
		};
		addCatalogChoice({
			kind: "power",
			sourceIndex: 0,
			count: requiredPowerChoices,
			prompt: "Choose powers unlocked by this level.",
			entries: availablePowers,
			selectedIds: selectedPowerIds,
			collection: "powers",
			grantType: "power",
		});
		addCatalogChoice({
			kind: "technique",
			sourceIndex: 1,
			count: requiredTechniqueChoices,
			prompt: "Choose techniques unlocked by this level.",
			entries: availableTechniques,
			selectedIds: selectedTechniqueIds,
			collection: "techniques",
			grantType: "technique",
		});
		addCatalogChoice({
			kind: "cantrip",
			sourceIndex: 2,
			count: requiredCantripChoices,
			prompt: "Choose cantrips unlocked by this level.",
			entries: availableCantrips,
			selectedIds: selectedCantripIds,
			collection: "spells",
			grantType: "spell",
		});
		addCatalogChoice({
			kind: "spell",
			sourceIndex: 3,
			count: requiredSpellChoices,
			prompt: "Choose power inscriptions unlocked by this level.",
			entries: availableSpells,
			selectedIds: selectedSpellIds,
			collection: "spells",
			grantType: "spell",
		});
		addCatalogChoice({
			kind: "spellbook",
			sourceIndex: 4,
			count: requiredSpellbookInscriptions,
			prompt: "Choose spellbook inscriptions unlocked by this level.",
			entries: availableSpellbookSpells,
			selectedIds: selectedSpellbookIds,
			collection: "spells",
			grantType: "spell",
		});
		addCatalogChoice({
			kind: "feat",
			sourceIndex: 5,
			count: showFeatSelection ? availableChoices.feats : 0,
			prompt: "Choose feats unlocked by this level.",
			entries: availableFeats,
			selectedIds: selectedFeats,
			collection: "feats",
			grantType: "feat",
		});
		addCatalogChoice({
			kind: "fighting-style",
			sourceIndex: 6,
			count: requiredFightingStyleChoices,
			prompt: "Choose fighting styles unlocked by this level.",
			entries: availableFightingStyles,
			selectedIds: selectedFightingStyleIds,
			collection: "fighting-styles",
			grantType: "feature",
		});
		for (const panel of ledgerOptionPanels) {
			const identities = panel.options.map((option, optionIndex) =>
				createCharacterWorkflowSourceAddressV1({
					ownerId: jobWorkflowIdentity.id ?? "missing-owner-id",
					collection: "ledger-options",
					sourcePath: `levelChoices[${panel.ledgerIndex}].options[${optionIndex}]`,
					label: option.label,
					payload: { originalOptionId: option.id, ledgerType: panel.type },
				}),
			);
			const identityIdByOriginal = new Map(
				panel.options.map((option, optionIndex) => [
					option.id,
					identities[optionIndex]?.id ?? "",
				]),
			);
			levelWorkflowChoices.push({
				kind: "ledger",
				source: jobWorkflowIdentity,
				sourceIndex: panel.ledgerIndex,
				level: newLevel,
				count: panel.count,
				prompt: panel.label,
				options: identities,
				selectedOptionIds: (selectedLedgerOptions[panel.key] ?? []).map(
					(value) => identityIdByOriginal.get(value) ?? "",
				),
				grantType: "feature",
			});
		}
		const selectedSwapOut = swapOutOptions.find((row) => row.id === swapOutId);
		const selectedSwapIn = swapInOptions.find((entry) => entry.id === swapInId);
		const levelWorkflowInput: CharacterLevelUpWorkflowInputV1 = {
			characterId: character.id,
			fromLevel: character.level,
			toLevel: newLevel,
			job: jobWorkflowIdentity,
			pathSelection: selectedPathWorkflowIdentity,
			features: levelWorkflowFeatures,
			choices: levelWorkflowChoices,
			abilityIncrease: showASISection
				? {
						source: createCharacterWorkflowSourceAddressV1({
							ownerId: jobWorkflowIdentity.id ?? "missing-owner-id",
							collection: "ability-increases",
							sourcePath: `abilityScoreImprovements.level.${newLevel}`,
							label: `Level ${newLevel} ability increase`,
						}),
						points: asiChoices,
						expectedPoints: 2,
					}
				: null,
			retrain:
				swapKind !== "none"
					? {
							kind: swapKind,
							ownedRowId: swapOutId,
							currentReferenceId: selectedSwapOut?.refId ?? null,
							replacement: canonicalWorkflowIdentity(
								swapInId || null,
								selectedSwapIn?.name ?? "Selected retrain replacement",
								swapKind === "spell"
									? "spells"
									: swapKind === "power"
										? "powers"
										: "techniques",
							),
						}
					: null,
			unresolvedLedger: unresolvedLedgerEntries.map((entry) => ({
				owner: jobWorkflowIdentity,
				ledgerIndex: levelUpLedgerEntries.indexOf(entry),
				level: entry.level,
				type: entry.type,
				count: entry.count,
			})),
		};
		const levelTransitionPlan =
			buildCharacterLevelUpWorkflowPlanV1(levelWorkflowInput);
		if (!levelTransitionPlan.canApply) {
			toast({
				title: "Level transition blocked",
				description: summarizeCharacterWorkflowBlockersV1(
					levelTransitionPlan.blockers,
				),
				variant: "destructive",
			});
			return;
		}

		setLoading(true);
		try {
			const levelUpAbilityContext: CharacterAbilityAccessContext = {
				campaignId,
				accessContext: { campaignId },
				jobName: character.job,
				pathName: effectivePathName,
				regentNames: characterRegentNames,
				characterLevel: newLevel,
				maxSpellLevel,
				maxPowerLevel,
				maxTechniqueLevel: newLevel,
			};
			// Calculate new stats
			const newProficiencyBonus = calculateProficiencyBonusForLevel(newLevel);
			const newRiftFavorDie = calculateRiftFavorDie(newLevel);
			const newRiftFavorMax = calculateRiftFavorMax(newLevel);
			const newHP = character.hp_max + hpIncrease;
			const newHitDiceMax = newLevel;

			const characterUpdates: Database["public"]["Tables"]["characters"]["Update"] =
				{
					level: newLevel,
					proficiency_bonus: newProficiencyBonus,
					hp_max: newHP,
					hp_current: character.hp_current + hpIncrease,
					hit_dice_max: newHitDiceMax,
					hit_dice_current: newHitDiceMax,
					rift_favor_die: newRiftFavorDie,
					rift_favor_max: newRiftFavorMax,
					rift_favor_current: newRiftFavorMax,
				};

			const nextAbilityScores = { ...character.abilities };

			// Apply path selection if chosen during this level-up
			if (showPathSelection && selectedPathRow) {
				characterUpdates.path = selectedPathRow.name;
				characterUpdates.path_id = selectedPathRow.id;
			}

			// Apply ASI ability score changes if this is an ASI level. Keep the
			// legacy character columns and the per-ability authority synchronized;
			// guest characters use the existing local update helper below.
			if (showASISection && Object.keys(asiChoices).length > 0) {
				type AbilityKey = "STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE";
				const abilityColumn: Record<
					AbilityKey,
					"str" | "agi" | "vit" | "int" | "sense" | "pre"
				> = {
					STR: "str",
					AGI: "agi",
					VIT: "vit",
					INT: "int",
					SENSE: "sense",
					PRE: "pre",
				};
				const abilityUpdates: Array<{
					character_id: string;
					ability: AbilityKey;
					score: number;
				}> = [];
				for (const [ability, bonus] of Object.entries(asiChoices)) {
					if (bonus <= 0) continue;
					const key = ability as AbilityKey;
					const currentScore =
						(character.abilities as Record<string, number>)[ability] ?? 10;
					const score = Math.min(20, currentScore + bonus);
					nextAbilityScores[key] = score;
					characterUpdates[abilityColumn[key]] = score;
					abilityUpdates.push({
						character_id: character.id,
						ability: key,
						score,
					});
				}
				if (abilityUpdates.length > 0 && !isLocalCharacterId(character.id)) {
					const { error: abilityError } = await supabase
						.from("character_abilities")
						.upsert(abilityUpdates, {
							onConflict: "character_id,ability",
						});
					if (abilityError) throw abilityError;
				}
			}

			// Apply feat selections through the existing local/cloud feature helper.
			if (showFeatSelection && selectedFeats.length > 0) {
				for (const [index, featId] of selectedFeats.entries()) {
					const feat = availableFeats.find(
						(candidate: { id?: string }) => candidate.id === featId,
					);
					if (!feat) continue;
					await insertCharacterFeature(character.id, {
						feat_id: featId,
						name: feat.name || "Unknown Feat",
						source: `Level ${newLevel} Feat Selection`,
						level_acquired: newLevel,
						description: feat.description || "",
						uses_current: null,
						uses_max: null,
						recharge: null,
						action_type: null,
						is_active: true,
						modifiers: null,
						homebrew_id: null,
						display_order: index,
					});
				}
			}

			const selectedPowerEntries = availablePowers.filter((power) =>
				selectedPowerIds.includes(power.id),
			);
			for (const power of selectedPowerEntries) {
				assertCanonicalPowerLearnable(power, levelUpAbilityContext);
				const powerUseFields = await getAbilityUseFields(character.id, {
					kind: "power",
					powerLevel: power.power_level,
					atWill: (power as { atWill?: boolean | null }).atWill ?? null,
				});
				const powerPayload = {
					power_id: power.id,
					name: power.name,
					power_level: power.power_level,
					source: `Level ${newLevel} Power Choice`,
					casting_time: power.casting_time || null,
					range: power.range || null,
					duration: power.duration || null,
					concentration: power.concentration || false,
					description: power.description || null,
					higher_levels: power.higher_levels || null,
					is_prepared: false,
					is_known: true,
					...powerUseFields,
				};

				if (isLocalCharacterId(character.id)) {
					const existingPowers = listLocalPowers(character.id);
					if (
						existingPowers.some(
							(existing) =>
								(power.id && existing.power_id === power.id) ||
								existing.name === power.name,
						)
					)
						continue;

					addLocalPower(character.id, powerPayload);
					continue;
				}

				// Canonical ID first, name second: prefer ID-based dedup so renames
				// or near-duplicate names don't double-insert. Fall back to name
				// only when the canonical ID is missing.
				const dedupQuery = supabase
					.from("character_powers")
					.select("id")
					.eq("character_id", character.id)
					.limit(1);
				const { data: existingPower } = power.id
					? await dedupQuery.eq("power_id", power.id)
					: await dedupQuery.eq("name", power.name);
				if ((existingPower?.length ?? 0) > 0) continue;

				await supabase.from("character_powers").insert({
					character_id: character.id,
					...powerPayload,
				});
			}

			const selectedTechniqueEntries = availableTechniques.filter((technique) =>
				selectedTechniqueIds.includes(technique.id),
			);
			for (const technique of selectedTechniqueEntries) {
				assertCanonicalTechniqueLearnable(technique, levelUpAbilityContext);
				const techniqueUseFields = await getAbilityUseFields(character.id, {
					kind: "technique",
					levelRequirement:
						(technique as { level_requirement?: number | null })
							.level_requirement ?? null,
					atWill: (technique as { atWill?: boolean | null }).atWill ?? null,
				});
				if (isLocalCharacterId(character.id)) {
					const existingTechniques = listLocalTechniques(character.id);
					if (
						existingTechniques.some(
							(existing) => existing.technique_id === technique.id,
						)
					)
						continue;

					addLocalTechnique(character.id, {
						technique_id: technique.id,
						source: `Level ${newLevel} Technique Choice`,
						...techniqueUseFields,
					});
					continue;
				}

				const { data: existingTechnique } = await supabase
					.from("character_techniques")
					.select("id")
					.eq("character_id", character.id)
					.eq("technique_id", technique.id)
					.limit(1);
				if ((existingTechnique?.length ?? 0) > 0) continue;

				await supabase.from("character_techniques").insert({
					character_id: character.id,
					technique_id: technique.id,
					source: `Level ${newLevel} Technique Choice`,
					...techniqueUseFields,
				});
			}

			const selectedCantripEntries = availableCantrips.filter((spell) =>
				selectedCantripIds.includes(spell.id),
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
					source: `Level ${newLevel} Cantrip Choice`,
					countsAgainstLimit: true,
				})),
				...selectedSpellEntries.map((entry) => ({
					entry,
					source: `Level ${newLevel} Power Inscription`,
					countsAgainstLimit: true,
				})),
				...selectedSpellbookEntries.map((entry) => ({
					entry,
					source: `Level ${newLevel} Spellbook Inscription`,
					countsAgainstLimit: false,
				})),
			]) {
				const isHomebrewSpell = (spell.entry as { _homebrew?: boolean })
					._homebrew;
				if (isHomebrewSpell) {
					if (
						!runtimeSpellMatchesCharacter(
							spell.entry as unknown as HomebrewRuntimeSpell,
							character.job,
							effectivePathName,
						)
					) {
						throw new Error(
							"This homebrew spell is not available to this character's job or path.",
						);
					}
				} else {
					assertCanonicalSpellLearnable(spell.entry, levelUpAbilityContext);
				}
				const spellPayload = {
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
					const existingSpells = listLocalSpells(character.id);
					if (
						existingSpells.some(
							(existing) =>
								(!isHomebrewSpell &&
									spell.entry.id &&
									existing.spell_id === spell.entry.id) ||
								existing.name === spell.entry.name,
						)
					)
						continue;

					addLocalSpell(character.id, spellPayload);
					continue;
				}

				const dedupQuery = supabase
					.from("character_spells")
					.select("id")
					.eq("character_id", character.id)
					.limit(1);
				const { data: existingSpell } =
					!isHomebrewSpell && spell.entry.id
						? await dedupQuery.eq("spell_id", spell.entry.id)
						: await dedupQuery.eq("name", spell.entry.name);
				if ((existingSpell?.length ?? 0) > 0) continue;

				await supabase.from("character_spells").insert({
					character_id: character.id,
					...spellPayload,
				});
			}

			// DDB parity: optional retrain — swap ONE known entry for a new legal
			// pick. Validate/insert the new entry mirrors the learn path above;
			// the old row is only removed once the replacement passes its gates.
			if (swapKind !== "none" && swapOutId && swapInId) {
				const swapOutRow = swapOutOptions.find((row) => row.id === swapOutId);
				const swapInEntry = swapInOptions.find(
					(entry) => entry.id === swapInId,
				);
				if (swapOutRow && swapInEntry && !knownSwapRefIds.has(swapInEntry.id)) {
					if (swapKind === "spell") {
						const entry = swapInEntry as CanonicalCastableEntry;
						assertCanonicalSpellLearnable(entry, levelUpAbilityContext);
						const payload = {
							spell_id: entry.id,
							name: entry.name,
							spell_level: entry.power_level,
							source: `Level ${newLevel} Retrain`,
							casting_time: entry.casting_time || null,
							range: entry.range || null,
							duration: entry.duration || null,
							concentration: entry.concentration || false,
							ritual: entry.ritual || false,
							description: entry.description || null,
							higher_levels: entry.higher_levels || null,
							is_prepared: false,
							is_known: true,
							counts_against_limit: true,
						};
						if (isLocalCharacterId(character.id)) {
							removeLocalSpell(swapOutId);
							addLocalSpell(character.id, payload);
						} else {
							await supabase
								.from("character_spells")
								.delete()
								.eq("id", swapOutId)
								.eq("character_id", character.id);
							await supabase
								.from("character_spells")
								.insert({ character_id: character.id, ...payload });
						}
					} else if (swapKind === "power") {
						const entry = swapInEntry as CanonicalCastableEntry;
						assertCanonicalPowerLearnable(entry, levelUpAbilityContext);
						const useFields = await getAbilityUseFields(character.id, {
							kind: "power",
							powerLevel: entry.power_level,
							atWill: (entry as { atWill?: boolean | null }).atWill ?? null,
						});
						const payload = {
							power_id: entry.id,
							name: entry.name,
							power_level: entry.power_level,
							source: `Level ${newLevel} Retrain`,
							casting_time: entry.casting_time || null,
							range: entry.range || null,
							duration: entry.duration || null,
							concentration: entry.concentration || false,
							description: entry.description || null,
							higher_levels: entry.higher_levels || null,
							is_prepared: false,
							is_known: true,
							...useFields,
						};
						if (isLocalCharacterId(character.id)) {
							removeLocalPower(swapOutId);
							addLocalPower(character.id, payload);
						} else {
							await supabase
								.from("character_powers")
								.delete()
								.eq("id", swapOutId)
								.eq("character_id", character.id);
							await supabase
								.from("character_powers")
								.insert({ character_id: character.id, ...payload });
						}
					} else {
						const entry = swapInEntry as StaticCompendiumEntry;
						assertCanonicalTechniqueLearnable(entry, levelUpAbilityContext);
						const useFields = await getAbilityUseFields(character.id, {
							kind: "technique",
							levelRequirement:
								(entry as { level_requirement?: number | null })
									.level_requirement ?? null,
							atWill: (entry as { atWill?: boolean | null }).atWill ?? null,
						});
						if (isLocalCharacterId(character.id)) {
							removeLocalTechnique(swapOutId);
							addLocalTechnique(character.id, {
								technique_id: entry.id,
								source: `Level ${newLevel} Retrain`,
								...useFields,
							});
						} else {
							await supabase
								.from("character_techniques")
								.delete()
								.eq("id", swapOutId)
								.eq("character_id", character.id);
							await supabase.from("character_techniques").insert({
								character_id: character.id,
								technique_id: entry.id,
								source: `Level ${newLevel} Retrain`,
								...useFields,
							});
						}
					}
				}
			}

			const selectedFightingStyles = availableFightingStyles.filter((style) =>
				selectedFightingStyleIds.includes(style.id),
			);
			for (const style of selectedFightingStyles) {
				await insertCharacterFeature(character.id, {
					feature_id: style.id,
					name: `Fighting Style: ${style.name}`,
					source: `Level ${newLevel} Fighting Style`,
					level_acquired: newLevel,
					description: style.description,
					is_active: true,
					modifiers: style.modifiers
						? (style.modifiers as Database["public"]["Tables"]["character_features"]["Insert"]["modifiers"])
						: null,
				});
			}

			const specialistTrainingSelections: string[] = [];
			for (const panel of ledgerOptionPanels) {
				const selectedValues = selectedLedgerOptions[panel.key] ?? [];
				for (const value of selectedValues) {
					const option = panel.options.find(
						(candidate) => candidate.id === value,
					);
					if (!option) continue;
					if (panel.type === "specialist-training") {
						specialistTrainingSelections.push(option.id);
					}
					await insertCharacterFeature(character.id, {
						feature_id: createCharacterWorkflowSourceAddressV1({
							ownerId: jobWorkflowIdentity.id ?? "missing-owner-id",
							collection: "ledger-options",
							sourcePath: `levelChoices[${panel.ledgerIndex}].options[${panel.options.indexOf(option)}]`,
							label: option.label,
						}).id,
						name: `${panel.label}: ${option.label}`,
						source: `Level ${newLevel} ${panel.label}`,
						level_acquired: newLevel,
						description:
							option.description ??
							`Selected ${option.label} for ${panel.label}.`,
						is_active: true,
					});
				}
			}

			if (specialistTrainingSelections.length > 0) {
				characterUpdates.skill_expertise = Array.from(
					new Set([
						...(character.skill_expertise ?? []),
						...specialistTrainingSelections,
					]),
				);
			}

			for (const entry of unresolvedLedgerEntries) {
				await insertCharacterFeature(character.id, {
					name: `Pending Choice: ${entry.source}`,
					source: `Level ${newLevel} Pending Choice`,
					level_acquired: newLevel,
					description: `${entry.source} requires ${entry.count} ${entry.type} selection${entry.count === 1 ? "" : "s"}. Complete this from the character sheet when the catalog panel is available.`,
					is_active: true,
				});
			}

			if (!isMilestone) {
				characterUpdates.experience = Math.max(
					0,
					currentExperience - experienceNeeded,
				);
			}

			// Update character
			await updateCharacter.mutateAsync({
				id: character.id,
				data: characterUpdates,
			});

			// Initialize/update spell slots for new level
			try {
				await initializeSpellSlots.mutateAsync({
					characterId: character.id,
					job: jobObj || character.job,
					level: newLevel,
				});
			} catch (error) {
				// Log but don't fail level up if spell slots fail
				logger.error("Failed to initialize spell slots:", error);
			}

			// Add new features (5e/D&D Beyond-style: features are granted automatically at the level)
			for (const _feature of newFeatures) {
				const feature = _feature as {
					name?: string;
					is_path_feature?: boolean;
					description?: string;
					action_type?: string;
					uses_formula?: string;
					recharge?: string;
					homebrew_id?: string | null;
					modifiers?: Database["public"]["Tables"]["character_features"]["Insert"]["modifiers"];
				};
				const usesMax = calculateFeatureUses(
					feature.uses_formula || null,
					newLevel,
					newProficiencyBonus,
					character.abilities,
				);

				await insertCharacterFeature(character.id, {
					feature_id: feature.homebrew_id ? null : (_feature.id ?? null),
					name: feature.name || "Unknown Feature",
					source: feature.is_path_feature
						? `Path: ${characterUpdates.path || effectivePathName || "Unknown"}`
						: `Job: ${character.job}`,
					level_acquired: newLevel,
					description: feature.description || "",
					action_type: feature.action_type || null,
					uses_max: usesMax,
					uses_current: usesMax,
					recharge: feature.recharge || null,
					is_active: true,
					modifiers: feature.modifiers ?? null,
					homebrew_id: feature.homebrew_id ?? null,
				});
			}

			// If any newly-unlocked features require selections, prompt the player to complete them.
			try {
				const featureIds = newFeatures.map((f) => f.id).filter(Boolean);
				if (featureIds.length > 0) {
					const { data: groups } = await supabase
						.from("compendium_feature_choice_groups")
						.select("id")
						.in("feature_id", featureIds);

					const groupIds = ((groups || []) as Array<{ id: string }>).map(
						(g) => g.id,
					);
					if (groupIds.length > 0) {
						const { data: chosen } = await supabase
							.from("character_feature_choices")
							.select("group_id")
							.eq("character_id", character.id)
							.in("group_id", groupIds);

						const chosenSet = new Set(
							((chosen || []) as Array<{ group_id: string }>).map(
								(c) => c.group_id,
							),
						);
						const pendingCount = groupIds.filter(
							(id) => !chosenSet.has(id),
						).length;
						if (pendingCount > 0) {
							toast({
								title: "Selection Protocol Required",
								description: `The Rift detected ${pendingCount} pending selection${pendingCount === 1 ? "" : "s"}. Open your Ascendant sheet to bind them.`,
							});
						}
					}
				}
			} catch {
				// Best-effort only; do not block level up if metadata is missing.
			}

			// Grant job awakening benefits (awakening features + job traits) at this level
			try {
				await addJobAwakeningBenefitsForLevel(
					character.id,
					staticJobObj || character.job,
					newLevel,
				);
			} catch (error) {
				logger.error("Failed to grant job awakening benefits:", error);
			}

			// Self-heal awakening traits (senses / resistances / immunities) every level-up.
			// applyJobAwakeningTraitsToCharacter is idempotent: it de-dupes on merge,
			// so it is safe to call unconditionally and will pick up any edits to jobs.ts.
			try {
				await applyJobAwakeningTraitsToCharacter(
					character.id,
					staticJobObj || character.job,
					[],
				);
			} catch (error) {
				logger.error("Failed to sync awakening traits on level-up:", error);
			}

			// Auto-update existing feature uses (proficiency-based features scale with level)
			try {
				await autoUpdateFeatureUses(character.id);
				await reconcileAbilityUses(character.id);
			} catch (error) {
				logger.error("Failed to auto-update feature uses:", error);
			}

			const transitionHandoff = createCharacterWorkflowHandoffV1({
				workflowKind: "transition",
				plan: levelTransitionPlan,
				displayName: character.name,
				storedBases: {
					level: newLevel,
					experience: !isMilestone
						? Math.max(0, currentExperience - experienceNeeded)
						: typeof character.experience === "number"
							? character.experience
							: null,
					abilityScores: {
						strength: Math.min(
							20,
							character.abilities.STR + (asiChoices.STR ?? 0),
						),
						agility: Math.min(
							20,
							character.abilities.AGI + (asiChoices.AGI ?? 0),
						),
						vitality: Math.min(
							20,
							character.abilities.VIT + (asiChoices.VIT ?? 0),
						),
						intelligence: Math.min(
							20,
							character.abilities.INT + (asiChoices.INT ?? 0),
						),
						sense: Math.min(
							20,
							character.abilities.SENSE + (asiChoices.SENSE ?? 0),
						),
						presence: Math.min(
							20,
							character.abilities.PRE + (asiChoices.PRE ?? 0),
						),
					},
					hitPointsMaximum: newHP,
					baseArmorClass: null,
					baseSpeed: {},
					proficiencyBonus: newProficiencyBonus,
					hitDice: {
						maximum: newHitDiceMax,
						size: character.hit_dice_size,
					},
					additional: {
						jobId: jobWorkflowIdentity.id,
						pathId: selectedPathRow?.id ?? character.path_id ?? null,
						regentId: regentData?.id ?? null,
					},
				},
				transient: {
					resources: [
						{
							version: 1,
							resourceId: "rift-favor",
							key: "rift-favor",
							current: newRiftFavorMax,
							maximum: newRiftFavorMax,
							temporary: 0,
							custom: false,
							manual: false,
							sourceEvidence: [],
						},
					],
				},
			});

			// D&D Beyond parity: derived stats (spell save DC, passive perception, etc.)
			// are now handled dynamically by the system via characterEngine.ts

			// Emit domain event
			try {
				const levelUpEvent: CharacterLevelUpEvent = {
					...buildCorePayload({
						characterId: character.id,
						characterName: character.name,
						className: character.job,
						pathName: characterUpdates.path || effectivePathName,
						level: newLevel,
						campaignId,
					}),
					type: "character:levelup",
					previousLevel: character.level,
					newLevel,
					hpIncrease: hpIncrease as number,
					newFeatures: newFeatures.map((f) => f.name),
					isPathUnlockLevel: showPathSelection,
					isASILevel: isASILevel(newLevel, jobObj || character.job),
				};
				DomainEventBus.emit(levelUpEvent);
			} catch {
				// Best-effort event emission
			}

			toast({
				title: "Level Up Complete!",
				description: `${character.name} has grown stronger! Now Level ${newLevel}!`,
			});

			ascendantTools
				.trackCustomFeatureUsage(
					character.id,
					"Level Up",
					`Reached Level ${newLevel}`,
					"SA",
					{ skipBroadcast: true },
				)
				.catch(console.error);

			await Promise.all(
				transitionHandoff.cacheInvalidationKeys.map((queryKey) =>
					queryClient.invalidateQueries({ queryKey: [...queryKey] }),
				),
			);

			onClose();
		} catch {
			toast({
				title: "Failed to level up",
				description: "Could not complete level up. Please try again.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const rollHP = () => {
		setIsRolling(true);
		// Animate through random numbers
		let count = 0;
		const interval = setInterval(() => {
			const randomRoll = Math.floor(Math.random() * hitDieSize) + 1;
			setHpIncrease(randomRoll + vitModifier);
			count++;
			if (count >= 10) {
				clearInterval(interval);
				const finalRoll = Math.floor(Math.random() * hitDieSize) + 1;
				setHpIncrease(finalRoll + vitModifier);
				setIsRolling(false);
			}
		}, 80);
	};

	// Get rank for display
	const getNewRank = () => {
		if (newLevel >= 17) return { rank: "S", color: rankToGateToken("S") };
		if (newLevel >= 13) return { rank: "A", color: rankToGateToken("A") };
		if (newLevel >= 9) return { rank: "B", color: rankToGateToken("B") };
		if (newLevel >= 5) return { rank: "C", color: rankToGateToken("C") };
		return { rank: "D", color: rankToGateToken("D") };
	};

	const rankInfo = getNewRank();

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-background border-resurge/20">
				<DialogTitle className="sr-only">Level Up Protocol</DialogTitle>
				<DialogDescription className="sr-only">
					Ascendant advancement modal
				</DialogDescription>
				<ScrollArea className="flex-1 overflow-y-auto w-full h-full">
					<div className="px-4 py-6 sm:py-8 sm:px-6">
						{/* Level Change Header */}
						<div className="text-center mb-6 sm:mb-8">
							<div
								className={cn(
									"inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border mb-4",
									isLevelDown
										? "bg-destructive/10 border-destructive/30"
										: "bg-resurge/10 border-resurge/30",
								)}
							>
								{isLevelDown ? (
									<TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
								) : (
									<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-resurge" />
								)}
								<span
									className={cn(
										"font-resurge tracking-wide text-sm sm:text-base",
										isLevelDown ? "text-destructive" : "text-resurge",
									)}
								>
									{isLevelDown ? "LEVEL DOWN PROTOCOL" : "LEVEL UP PROTOCOL"}
								</span>
							</div>
							<h1 className="font-resurge text-2xl sm:text-3xl font-bold gradient-text-shadow tracking-wider mb-2 leading-tight">
								{character.name.toUpperCase()}
							</h1>
							<div className="flex items-center justify-center gap-2 sm:gap-4 text-lg sm:text-2xl font-resurge flex-wrap">
								<span className="text-muted-foreground">
									LV. {character.level}
								</span>
								<span
									className={cn(
										isLevelDown ? "text-destructive" : "text-resurge",
										"animate-pulse",
									)}
								>
									{"->"}
								</span>
								<span
									className={cn(
										"font-bold",
										isLevelDown ? "text-gate-red" : rankInfo.color,
									)}
								>
									LV. {newLevel}
								</span>
								{!isLevelDown && (
									<Badge
										className={cn(
											"ml-2 font-resurge",
											rankInfo.color,
											"bg-transparent border-current text-xs sm:text-sm",
										)}
									>
										{rankInfo.rank}-RANK
									</Badge>
								)}
							</div>
						</div>

						<AscendantWindow
							title={isLevelDown ? "LEVEL REDUCTION" : "SYSTEM ENHANCEMENT"}
							className={cn(
								"mb-6",
								isLevelDown ? "border-destructive/50" : "border-resurge/50",
							)}
						>
							<div className="space-y-6">
								{/* Level Selection */}
								<div
									className={cn(
										"p-4 rounded-lg bg-gradient-to-r border",
										isLevelDown
											? "from-destructive/10 to-transparent border-destructive/20"
											: "from-resurge/10 to-transparent border-resurge/20",
									)}
								>
									<Label
										className={cn(
											"font-resurge tracking-wide flex items-center gap-2",
											isLevelDown ? "text-destructive" : "text-resurge",
										)}
									>
										<Star className="w-4 h-4" />
										TARGET LEVEL
									</Label>
									<div className="flex items-center gap-4 mt-3">
										<span className="text-lg text-muted-foreground font-heading">
											Current: {character.level}
										</span>
										<span className="text-2xl font-resurge text-resurge">
											{"->"}
										</span>
										<Input
											type="number"
											min={1}
											max={20}
											value={newLevel}
											onChange={(e) =>
												setNewLevel(
													Math.min(
														20,
														Math.max(1, parseInt(e.target.value, 10) || 1),
													),
												)
											}
											className={cn(
												"w-24 text-center font-resurge text-xl",
												isLevelDown
													? "border-destructive/30 focus:border-destructive"
													: "border-resurge/30 focus:border-resurge",
											)}
										/>
									</div>
								</div>

								{/* Level Down Preview — only shown when going down */}
								{isLevelDown && (
									<>
										<div className="p-4 rounded-lg bg-gradient-to-r from-destructive/10 to-gate-s/5 border border-destructive/30">
											<div className="flex items-start gap-3">
												<AlertTriangle className="w-5 h-5 text-gate-s mt-0.5 flex-shrink-0" />
												<div>
													<h4 className="font-resurge text-gate-s tracking-wide text-sm mb-2">
														DESTRUCTIVE OPERATION
													</h4>
													<p className="text-sm text-muted-foreground font-heading">
														Reducing from Level {character.level} to Level{" "}
														{newLevel} will
														<strong className="text-destructive">
															{" "}
															automatically remove
														</strong>{" "}
														all features, powers, spells, and techniques
														acquired above Level {newLevel}. HP, proficiency
														bonus, rift favor, and hit dice will be
														recalculated.
													</p>
												</div>
											</div>
										</div>

										{/* Level-down stat preview */}
										<div className="p-4 rounded-lg bg-gradient-to-r from-destructive/5 to-transparent border border-destructive/20">
											<h4 className="font-resurge font-semibold mb-4 text-destructive tracking-wide flex items-center gap-2">
												<TrendingDown className="w-4 h-4" />
												STAT REDUCTIONS
											</h4>
											<div className="grid grid-cols-2 gap-4 text-sm">
												<div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
													<span className="text-muted-foreground font-heading">
														Prof. Bonus
													</span>
													<span className="font-resurge text-lg">
														+
														{calculateProficiencyBonusForLevel(character.level)}{" "}
														{"->"}{" "}
														<span className="text-destructive">
															+{calculateProficiencyBonusForLevel(newLevel)}
														</span>
													</span>
												</div>
												<div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
													<span className="text-muted-foreground font-heading">
														Max HP
													</span>
													<span className="font-resurge text-lg">
														{character.hp_max} {"->"}{" "}
														<span className="text-destructive">
															{Math.max(
																1,
																(character.hp_max ?? 1) -
																	Math.max(
																		1,
																		Math.floor(hitDieSize / 2) +
																			1 +
																			vitModifier,
																	) *
																		(character.level - newLevel),
															)}
														</span>
													</span>
												</div>
												<div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
													<span className="text-muted-foreground font-heading">
														Hit Dice
													</span>
													<span className="font-resurge text-lg">
														{character.hit_dice_max} {"->"}{" "}
														<span className="text-destructive">{newLevel}</span>
													</span>
												</div>
												<div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
													<span className="text-muted-foreground font-heading">
														Rift Favor
													</span>
													<span className="font-resurge text-lg">
														d{calculateRiftFavorDie(character.level)} {"->"}{" "}
														<span className="text-destructive">
															d{calculateRiftFavorDie(newLevel)}
														</span>
													</span>
												</div>
											</div>
										</div>
									</>
								)}

								{!isLevelDown && !isMilestone && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-shadow-blue/10 to-transparent border border-shadow-blue/20">
										<Label className="font-resurge text-shadow-blue tracking-wide flex items-center gap-2">
											<Star className="w-4 h-4" />
											EXPERIENCE REQUIREMENT
										</Label>
										<div className="flex items-center justify-between mt-3 text-sm font-heading">
											<span className="text-muted-foreground">Current XP</span>
											<span className="font-resurge text-shadow-blue">
												{currentExperience}
											</span>
										</div>
										<div className="flex items-center justify-between mt-2 text-sm font-heading">
											<span className="text-muted-foreground">
												Needed for Next Level
											</span>
											<span className="font-resurge text-shadow-blue">
												{experienceNeeded}
											</span>
										</div>
									</div>
								)}

								{/* HP Increase — only for level up */}
								{!isLevelDown && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-destructive/10 to-transparent border border-destructive/20">
										<Label className="font-resurge text-destructive tracking-wide flex items-center gap-2">
											<Heart className="w-4 h-4" />
											VITALITY INCREASE
										</Label>
										<div className="flex items-center gap-4 mt-3">
											<div className="flex-1">
												<div className="relative">
													<Input
														type="number"
														min={1}
														max={maxHP}
														value={hpIncrease || ""}
														onChange={(e) =>
															setHpIncrease(
																parseInt(e.target.value, 10) || null,
															)
														}
														placeholder={`Average: ${averageHP}`}
														className={cn(
															"text-center font-resurge text-xl border-destructive/30 focus:border-destructive",
															isRolling && "animate-pulse text-destructive",
														)}
													/>
													{hpIncrease && (
														<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-destructive font-heading">
															HP
														</span>
													)}
												</div>
												<p className="text-xs text-muted-foreground mt-2 font-heading">
													Roll d{hitDieSize} {vitModifier >= 0 ? "+" : ""}
													{vitModifier} (VIT) | Range: {minHP} - {maxHP}
												</p>
											</div>
											<Button
												variant="outline"
												onClick={rollHP}
												disabled={isRolling}
												className={cn(
													"gap-2 border-resurge/30 hover:bg-resurge/10 hover:border-resurge",
													isRolling && "animate-pulse",
												)}
											>
												<Zap
													className={cn("w-4 h-4", isRolling && "animate-spin")}
												/>
												{isRolling ? "Rolling..." : "Roll"}
											</Button>
											<Button
												variant="outline"
												onClick={() => setHpIncrease(averageHP)}
												className="gap-2 border-destructive/30 hover:bg-destructive/10 hover:border-destructive"
											>
												<Heart className="w-4 h-4" />
												Average ({averageHP})
											</Button>
										</div>
									</div>
								)}

								{/* Path Selection (shown when character has no path and paths are available at this level) */}
								{!isLevelDown && showPathSelection && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-resurge/10 to-transparent border border-resurge/20">
										<Label className="font-resurge text-resurge tracking-wide flex items-center gap-2 mb-4">
											<Swords className="w-4 h-4" />
											PATH SPECIALIZATION UNLOCKED
										</Label>
										<p className="text-sm text-muted-foreground mb-3 font-heading">
											Choose your specialization path. This permanently defines
											your combat doctrine.
										</p>
										<Select
											value={selectedPath}
											onValueChange={setSelectedPath}
										>
											<SelectTrigger className="border-resurge/30 focus:border-resurge">
												<SelectValue placeholder="Choose a path..." />
											</SelectTrigger>
											<SelectContent>
												{availablePaths.map((path) => (
													<SelectItem
														key={path.id}
														value={path.id}
														disabled={path.eligibility?.eligible === false}
													>
														{formatRegentVernacular(
															path.display_name || path.name,
														)}
														{path.eligibility?.eligible === false
															? ` — ${path.eligibility.reason}`
															: ""}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{!availablePaths.some(
											(path) => path.eligibility?.eligible !== false,
										) && (
											<p className="mt-2 text-xs text-destructive">
												No path requirements are met. Gain the listed skill
												proficiencies before choosing a specialization.
											</p>
										)}
										{selectedPath && (
											<div className="mt-3 p-3 rounded-lg bg-muted/30 border border-resurge/10">
												<h4 className="font-heading font-semibold text-resurge mb-1">
													{formatRegentVernacular(
														(
															availablePaths.find(
																(p) => p.id === selectedPath,
															) as { display_name?: string | null } | undefined
														)?.display_name ||
															availablePaths.find((p) => p.id === selectedPath)
																?.name ||
															"",
													)}
												</h4>
												<p className="text-sm text-muted-foreground">
													{formatRegentVernacular(
														availablePaths.find((p) => p.id === selectedPath)
															?.description || "",
													)}
												</p>
											</div>
										)}
									</div>
								)}

								{/* ASI / Feat Selection (shown at ASI levels: 4, 8, 12, 16, 19) */}
								{!isLevelDown && showASISection && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-success/10 to-transparent border border-success/20">
										<Label className="font-resurge text-success tracking-wide flex items-center gap-2 mb-4">
											<Shield className="w-4 h-4" />
											ABILITY SCORE IMPROVEMENT
										</Label>
										<p className="text-sm text-muted-foreground mb-3 font-heading">
											Distribute 2 points among your ability scores (max +2 to
											one, or +1 to two).
										</p>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
											{(
												["STR", "AGI", "VIT", "INT", "SENSE", "PRE"] as const
											).map((ability) => {
												const currentScore =
													(character.abilities as Record<string, number>)[
														ability
													] ?? 10;
												const bonus = asiChoices[ability] || 0;
												const totalSpent = Object.values(asiChoices).reduce(
													(s, v) => s + v,
													0,
												);
												const canIncrease =
													totalSpent < 2 &&
													bonus < 2 &&
													currentScore + bonus < 20;
												const canDecrease = bonus > 0;
												return (
													<div
														key={ability}
														className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-success/10"
													>
														<div>
															<span className="font-resurge text-sm text-success">
																{ability}
															</span>
															<span className="text-xs text-muted-foreground ml-2 font-heading">
																{currentScore}
															</span>
														</div>
														<div className="flex items-center gap-1">
															<Button
																variant="ghost"
																size="sm"
																className="h-6 w-6 p-0 text-destructive"
																disabled={!canDecrease}
																onClick={() =>
																	setAsiChoices((prev) => ({
																		...prev,
																		[ability]: Math.max(
																			0,
																			(prev[ability] || 0) - 1,
																		),
																	}))
																}
															>
																-
															</Button>
															<span
																className={cn(
																	"font-resurge text-sm w-6 text-center",
																	bonus > 0
																		? "text-success"
																		: "text-muted-foreground",
																)}
															>
																{bonus > 0 ? `+${bonus}` : "0"}
															</span>
															<Button
																variant="ghost"
																size="sm"
																className="h-6 w-6 p-0 text-success"
																disabled={!canIncrease}
																onClick={() =>
																	setAsiChoices((prev) => ({
																		...prev,
																		[ability]: Math.min(
																			2,
																			(prev[ability] || 0) + 1,
																		),
																	}))
																}
															>
																+
															</Button>
														</div>
													</div>
												);
											})}
										</div>
										<p className="text-xs text-muted-foreground mt-2 font-heading">
											Points remaining:{" "}
											{2 - Object.values(asiChoices).reduce((s, v) => s + v, 0)}
										</p>
									</div>
								)}

								{/* Feat Selection (shown when feats are available from awakening features) */}
								{!isLevelDown && showFeatSelection && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-resurge/10 to-transparent border border-resurge/20">
										<Label className="font-resurge text-resurge tracking-wide flex items-center gap-2 mb-4">
											<Star className="w-4 h-4" />
											FEAT SELECTION
										</Label>
										<p className="text-sm text-muted-foreground mb-3 font-heading">
											Choose {availableChoices.feats} feat
											{availableChoices.feats > 1 ? "s" : ""} from awakening
											features.
										</p>
										<div className="space-y-2 max-h-48 overflow-y-auto">
											{availableFeats.map((_feat: CompendiumFeat) => {
												const feat = _feat;
												const isSelected = selectedFeats.includes(feat.id);
												return (
													<div
														key={feat.id}
														className={cn(
															"flex items-center gap-3 p-2 rounded-lg border transition-all",
															isSelected
																? "bg-primary/15 border-primary ring-2 ring-primary/60 shadow-[0_0_18px_hsl(var(--primary)/0.22)]"
																: "bg-background/50 border-resurge/10 hover:border-resurge/30",
														)}
													>
														<input
															type="checkbox"
															id={`feat-${feat.id}`}
															checked={isSelected}
															onChange={(e) => {
																if (e.target.checked) {
																	if (
																		selectedFeats.length <
																		availableChoices.feats
																	) {
																		setSelectedFeats([
																			...selectedFeats,
																			feat.id,
																		]);
																	}
																} else {
																	setSelectedFeats(
																		selectedFeats.filter(
																			(id) => id !== feat.id,
																		),
																	);
																}
															}}
															disabled={
																!isSelected &&
																selectedFeats.length >= availableChoices.feats
															}
															className="rounded border-resurge/30"
														/>
														<label
															htmlFor={`feat-${feat.id}`}
															className="flex-1 cursor-pointer"
														>
															<div>
																<span className="font-resurge text-sm text-resurge">
																	{formatRegentVernacular(feat.name)}
																</span>
																<p className="text-sm text-muted-foreground mt-1 leading-relaxed">
																	{formatRegentVernacular(
																		feat.description || "",
																	)}
																</p>
															</div>
														</label>
													</div>
												);
											})}
										</div>
										<p className="text-xs text-muted-foreground mt-2 font-heading">
											Selected: {selectedFeats.length}/{availableChoices.feats}
										</p>
									</div>
								)}

								{!isLevelDown && requiredCantripChoices > 0 && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-mana-cyan/10 to-transparent border border-mana-cyan/20">
										<Label className="font-resurge text-mana-cyan tracking-wide flex items-center gap-2 mb-4">
											<Sparkles className="w-4 h-4" />
											CANTRIPS
										</Label>
										<p className="text-sm text-muted-foreground mb-3 font-heading">
											Choose {requiredCantripChoices} cantrip
											{requiredCantripChoices === 1 ? "" : "s"} unlocked by this
											level.
										</p>
										<div className="space-y-2 max-h-56 overflow-y-auto">
											{availableCantrips.map((cantrip) => {
												const isSelected = selectedCantripIds.includes(
													cantrip.id,
												);
												return (
													<div
														key={cantrip.id}
														className={cn(
															"flex items-start gap-3 p-2 rounded-lg border transition-all",
															isSelected
																? "bg-primary/15 border-primary ring-2 ring-primary/60"
																: "bg-background/50 border-mana-cyan/10 hover:border-mana-cyan/30",
														)}
													>
														<input
															type="checkbox"
															id={`level-cantrip-${cantrip.id}`}
															checked={isSelected}
															onChange={() =>
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
															className="mt-1 rounded border-mana-cyan/30"
														/>
														<label
															htmlFor={`level-cantrip-${cantrip.id}`}
															className="flex-1 cursor-pointer"
														>
															<span className="font-resurge text-sm text-mana-cyan">
																{formatRegentVernacular(cantrip.name)}
															</span>
															{cantrip.description && (
																<p className="text-sm text-muted-foreground mt-1 leading-relaxed">
																	{formatRegentVernacular(cantrip.description)}
																</p>
															)}
														</label>
													</div>
												);
											})}
										</div>
										<p className="text-xs text-muted-foreground mt-2 font-heading">
											Selected: {selectedCantripIds.length}/
											{requiredCantripChoices}
										</p>
									</div>
								)}

								{requiredSpellChoices > 0 && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-shadow-blue/10 to-transparent border border-shadow-blue/20">
										<Label className="font-resurge text-shadow-blue tracking-wide flex items-center gap-2 mb-4">
											<Sparkles className="w-4 h-4" />
											SPELLS
										</Label>
										<p className="text-sm text-muted-foreground mb-3 font-heading">
											Choose {requiredSpellChoices} power inscription
											{requiredSpellChoices === 1 ? "" : "s"} unlocked by this
											level.
										</p>
										<div className="space-y-2 max-h-56 overflow-y-auto">
											{availableSpells.map((spell) => {
												const isSelected = selectedSpellIds.includes(spell.id);
												return (
													<div
														key={spell.id}
														className={cn(
															"flex items-start gap-3 p-2 rounded-lg border transition-all",
															isSelected
																? "bg-primary/15 border-primary ring-2 ring-primary/60"
																: "bg-background/50 border-shadow-blue/10 hover:border-shadow-blue/30",
														)}
													>
														<input
															type="checkbox"
															id={`level-spell-${spell.id}`}
															checked={isSelected}
															onChange={() =>
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
															className="mt-1 rounded border-shadow-blue/30"
														/>
														<label
															htmlFor={`level-spell-${spell.id}`}
															className="flex-1 cursor-pointer"
														>
															<div className="flex items-center gap-2 flex-wrap">
																<span className="font-resurge text-sm text-shadow-blue">
																	{formatRegentVernacular(spell.name)}
																</span>
																<Badge variant="secondary" className="text-xs">
																	Level {spell.power_level}
																</Badge>
															</div>
															{spell.description && (
																<p className="text-sm text-muted-foreground mt-1 leading-relaxed">
																	{formatRegentVernacular(spell.description)}
																</p>
															)}
														</label>
													</div>
												);
											})}
										</div>
										<p className="text-xs text-muted-foreground mt-2 font-heading">
											Selected: {selectedSpellIds.length}/{requiredSpellChoices}
										</p>
									</div>
								)}

								{requiredSpellbookInscriptions > 0 && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-shadow-blue/10 to-transparent border border-shadow-blue/20">
										<Label className="font-resurge text-shadow-blue tracking-wide flex items-center gap-2 mb-4">
											<Sparkles className="w-4 h-4" />
											{formatRegentVernacular(
												jobObj?.spellbook?.label ?? "Spellbook",
											)}{" "}
											INSCRIPTIONS
										</Label>
										<p className="text-sm text-muted-foreground mb-3 font-heading">
											Choose {requiredSpellbookInscriptions} inscription
											{requiredSpellbookInscriptions === 1 ? "" : "s"} unlocked
											by this level.
										</p>
										<div className="space-y-2 max-h-56 overflow-y-auto">
											{availableSpellbookSpells.map((spell) => {
												const isSelected = selectedSpellbookIds.includes(
													spell.id,
												);
												return (
													<div
														key={spell.id}
														className={cn(
															"flex items-start gap-3 p-2 rounded-lg border transition-all",
															isSelected
																? "bg-primary/15 border-primary ring-2 ring-primary/60"
																: "bg-background/50 border-shadow-blue/10 hover:border-shadow-blue/30",
														)}
													>
														<input
															type="checkbox"
															id={`level-spellbook-${spell.id}`}
															checked={isSelected}
															onChange={() =>
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
															className="mt-1 rounded border-shadow-blue/30"
														/>
														<label
															htmlFor={`level-spellbook-${spell.id}`}
															className="flex-1 cursor-pointer"
														>
															<div className="flex items-center gap-2 flex-wrap">
																<span className="font-resurge text-sm text-shadow-blue">
																	{formatRegentVernacular(spell.name)}
																</span>
																<Badge variant="secondary" className="text-xs">
																	Level {spell.power_level}
																</Badge>
															</div>
															{spell.description && (
																<p className="text-sm text-muted-foreground mt-1 leading-relaxed">
																	{formatRegentVernacular(spell.description)}
																</p>
															)}
														</label>
													</div>
												);
											})}
										</div>
										<p className="text-xs text-muted-foreground mt-2 font-heading">
											Selected: {selectedSpellbookIds.length}/
											{requiredSpellbookInscriptions}
										</p>
									</div>
								)}

								{requiredPowerChoices > 0 && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-mana-cyan/10 to-transparent border border-mana-cyan/20">
										<Label className="font-resurge text-mana-cyan tracking-wide flex items-center gap-2 mb-4">
											<Sparkles className="w-4 h-4" />
											POWERS
										</Label>
										<p className="text-sm text-muted-foreground mb-3 font-heading">
											Choose {requiredPowerChoices} power
											{requiredPowerChoices === 1 ? "" : "s"} unlocked by this
											level.
										</p>
										<div className="space-y-2 max-h-56 overflow-y-auto">
											{availablePowers.map((power) => {
												const isSelected = selectedPowerIds.includes(power.id);
												return (
													<div
														key={power.id}
														className={cn(
															"flex items-start gap-3 p-2 rounded-lg border transition-all",
															isSelected
																? "bg-primary/15 border-primary ring-2 ring-primary/60"
																: "bg-background/50 border-mana-cyan/10 hover:border-mana-cyan/30",
														)}
													>
														<input
															type="checkbox"
															id={`level-power-${power.id}`}
															checked={isSelected}
															onChange={(e) => {
																if (e.target.checked) {
																	if (
																		selectedPowerIds.length <
																		requiredPowerChoices
																	) {
																		setSelectedPowerIds([
																			...selectedPowerIds,
																			power.id,
																		]);
																	}
																} else {
																	setSelectedPowerIds(
																		selectedPowerIds.filter(
																			(id) => id !== power.id,
																		),
																	);
																}
															}}
															disabled={
																!isSelected &&
																selectedPowerIds.length >= requiredPowerChoices
															}
															className="mt-1 rounded border-mana-cyan/30"
														/>
														<label
															htmlFor={`level-power-${power.id}`}
															className="flex-1 cursor-pointer"
														>
															<div className="flex items-center gap-2 flex-wrap">
																<span className="font-resurge text-sm text-mana-cyan">
																	{formatRegentVernacular(power.name)}
																</span>
																<Badge variant="secondary" className="text-xs">
																	Level {power.power_level}
																</Badge>
																{power.power_type && (
																	<Badge variant="outline" className="text-xs">
																		{formatRegentVernacular(power.power_type)}
																	</Badge>
																)}
															</div>
															{power.description && (
																<p className="text-sm text-muted-foreground mt-1 leading-relaxed">
																	{formatRegentVernacular(power.description)}
																</p>
															)}
														</label>
													</div>
												);
											})}
										</div>
										<p className="text-xs text-muted-foreground mt-2 font-heading">
											Selected: {selectedPowerIds.length}/{requiredPowerChoices}
										</p>
									</div>
								)}

								{requiredTechniqueChoices > 0 && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-gate-a/10 to-transparent border border-gate-a/20">
										<Label className="font-resurge text-gate-a tracking-wide flex items-center gap-2 mb-4">
											<Swords className="w-4 h-4" />
											TECHNIQUES
										</Label>
										<p className="text-sm text-muted-foreground mb-3 font-heading">
											Choose {requiredTechniqueChoices} technique
											{requiredTechniqueChoices === 1 ? "" : "s"} unlocked by
											this level.
										</p>
										<div className="space-y-2 max-h-56 overflow-y-auto">
											{availableTechniques.map((technique) => {
												const isSelected = selectedTechniqueIds.includes(
													technique.id,
												);
												return (
													<div
														key={technique.id}
														className={cn(
															"flex items-start gap-3 p-2 rounded-lg border transition-all",
															isSelected
																? "bg-primary/15 border-primary ring-2 ring-primary/60"
																: "bg-background/50 border-gate-a/10 hover:border-gate-a/30",
														)}
													>
														<input
															type="checkbox"
															id={`level-technique-${technique.id}`}
															checked={isSelected}
															onChange={(e) => {
																if (e.target.checked) {
																	if (
																		selectedTechniqueIds.length <
																		requiredTechniqueChoices
																	) {
																		setSelectedTechniqueIds([
																			...selectedTechniqueIds,
																			technique.id,
																		]);
																	}
																} else {
																	setSelectedTechniqueIds(
																		selectedTechniqueIds.filter(
																			(id) => id !== technique.id,
																		),
																	);
																}
															}}
															disabled={
																!isSelected &&
																selectedTechniqueIds.length >=
																	requiredTechniqueChoices
															}
															className="mt-1 rounded border-gate-a/30"
														/>
														<label
															htmlFor={`level-technique-${technique.id}`}
															className="flex-1 cursor-pointer"
														>
															<div className="flex items-center gap-2 flex-wrap">
																<span className="font-resurge text-sm text-gate-a">
																	{formatRegentVernacular(technique.name)}
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
																		{formatRegentVernacular(
																			technique.technique_type,
																		)}
																	</Badge>
																)}
															</div>
															{technique.description && (
																<p className="text-sm text-muted-foreground mt-1 leading-relaxed">
																	{formatRegentVernacular(
																		technique.description,
																	)}
																</p>
															)}
														</label>
													</div>
												);
											})}
										</div>
										<p className="text-xs text-muted-foreground mt-2 font-heading">
											Selected: {selectedTechniqueIds.length}/
											{requiredTechniqueChoices}
										</p>
									</div>
								)}

								{swapKindOptions.length > 0 && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-mana-cyan/10 to-transparent border border-mana-cyan/20">
										<Label className="font-resurge text-mana-cyan tracking-wide flex items-center gap-2 mb-2">
											<Sparkles className="w-4 h-4" />
											RETRAIN (OPTIONAL)
										</Label>
										<p className="text-sm text-muted-foreground mb-3 font-heading">
											Gaining a level lets you swap one known{" "}
											{swapKindOptions
												.map((option) => option.label.toLowerCase())
												.join(" / ")}{" "}
											for another you could learn.
										</p>
										<div className="grid gap-3 sm:grid-cols-3">
											<Select
												value={swapKind}
												onValueChange={(value) => {
													setSwapKind(value as "none" | SwapKind);
													setSwapOutId("");
													setSwapInId("");
												}}
											>
												<SelectTrigger>
													<SelectValue placeholder="No swap" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="none">No swap</SelectItem>
													{swapKindOptions.map((option) => (
														<SelectItem key={option.kind} value={option.kind}>
															Swap a {option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{swapKind !== "none" && (
												<Select value={swapOutId} onValueChange={setSwapOutId}>
													<SelectTrigger>
														<SelectValue placeholder="Forget..." />
													</SelectTrigger>
													<SelectContent>
														{swapOutOptions.map((row) => (
															<SelectItem key={row.id} value={row.id}>
																{formatRegentVernacular(row.name)}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
											{swapKind !== "none" && swapOutId && (
												<Select value={swapInId} onValueChange={setSwapInId}>
													<SelectTrigger>
														<SelectValue placeholder="Learn instead..." />
													</SelectTrigger>
													<SelectContent>
														{swapInOptions
															.filter((entry) => !knownSwapRefIds.has(entry.id))
															.map((entry) => (
																<SelectItem key={entry.id} value={entry.id}>
																	{formatRegentVernacular(entry.name)}
																</SelectItem>
															))}
													</SelectContent>
												</Select>
											)}
										</div>
									</div>
								)}

								{requiredFightingStyleChoices > 0 && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-gate-a/10 to-transparent border border-gate-a/20">
										<Label className="font-resurge text-gate-a tracking-wide flex items-center gap-2 mb-4">
											<Shield className="w-4 h-4" />
											FIGHTING STYLE
										</Label>
										<p className="text-sm text-muted-foreground mb-3 font-heading">
											Choose {requiredFightingStyleChoices} Fighting Style
											{requiredFightingStyleChoices === 1 ? "" : "s"} unlocked
											by this level.
										</p>
										<div className="space-y-2 max-h-56 overflow-y-auto">
											{availableFightingStyles.map((style) => {
												const isSelected = selectedFightingStyleIds.includes(
													style.id,
												);
												return (
													<div
														key={style.id}
														className={cn(
															"flex items-start gap-3 p-2 rounded-lg border transition-all",
															isSelected
																? "bg-primary/15 border-primary ring-2 ring-primary/60"
																: "bg-background/50 border-gate-a/10 hover:border-gate-a/30",
														)}
													>
														<input
															type="checkbox"
															id={`level-style-${style.id}`}
															checked={isSelected}
															onChange={() =>
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
															className="mt-1 rounded border-gate-a/30"
														/>
														<label
															htmlFor={`level-style-${style.id}`}
															className="flex-1 cursor-pointer"
														>
															<div className="flex items-center gap-2 flex-wrap">
																<span className="font-resurge text-sm text-gate-a">
																	{formatRegentVernacular(style.name)}
																</span>
																<Badge variant="outline" className="text-xs">
																	{style.source === "ra-native"
																		? "RA-native"
																		: "Baseline"}
																</Badge>
															</div>
															<p className="text-sm text-muted-foreground mt-1 leading-relaxed">
																{formatRegentVernacular(style.description)}
															</p>
														</label>
													</div>
												);
											})}
										</div>
										<p className="text-xs text-muted-foreground mt-2 font-heading">
											Selected: {selectedFightingStyleIds.length}/
											{requiredFightingStyleChoices}
										</p>
									</div>
								)}

								{ledgerOptionPanels.map((panel) => {
									const selectedValues = selectedLedgerOptions[panel.key] ?? [];
									return (
										<div
											key={panel.key}
											className="p-4 rounded-lg bg-gradient-to-r from-resurge-violet/10 to-transparent border border-resurge-violet/20"
										>
											<Label className="font-resurge text-resurge-violet tracking-wide flex items-center gap-2 mb-4">
												<Sparkles className="w-4 h-4" />
												{formatRegentVernacular(panel.label).toUpperCase()}
											</Label>
											<p className="text-sm text-muted-foreground mb-3 font-heading">
												Choose {panel.count} option
												{panel.count === 1 ? "" : "s"}.
											</p>
											<div className="space-y-2 max-h-56 overflow-y-auto">
												{panel.options.map((option) => {
													const isSelected = selectedValues.includes(option.id);
													return (
														<div
															key={option.id}
															className="flex items-start gap-3 p-2 rounded-lg bg-background/50 border border-resurge-violet/10"
														>
															<input
																type="checkbox"
																id={`level-ledger-${panel.key}-${option.id}`}
																checked={isSelected}
																onChange={() =>
																	setSelectedLedgerOptions((current) => ({
																		...current,
																		[panel.key]: toggleLimitedSelection(
																			current[panel.key] ?? [],
																			option.id,
																			panel.count,
																		),
																	}))
																}
																disabled={
																	!isSelected &&
																	selectedValues.length >= panel.count
																}
																className="mt-1 rounded border-resurge-violet/30"
															/>
															<label
																htmlFor={`level-ledger-${panel.key}-${option.id}`}
																className="flex-1 cursor-pointer"
															>
																<span className="font-resurge text-sm text-resurge-violet">
																	{formatRegentVernacular(option.label)}
																</span>
																{option.description && (
																	<p className="text-sm text-muted-foreground mt-1 leading-relaxed">
																		{formatRegentVernacular(option.description)}
																	</p>
																)}
															</label>
														</div>
													);
												})}
											</div>
											<p className="text-xs text-muted-foreground mt-2 font-heading">
												Selected: {selectedValues.length}/{panel.count}
											</p>
										</div>
									);
								})}

								{unresolvedLedgerEntries.length > 0 && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-gate-s/10 to-transparent border border-gate-s/20">
										<Label className="font-resurge text-gate-s tracking-wide flex items-center gap-2 mb-4">
											<Sparkles className="w-4 h-4" />
											PENDING SELECTION PROTOCOLS
										</Label>
										<p className="text-sm text-muted-foreground mb-3 font-heading">
											These ledger choices do not yet have a dedicated catalog
											panel. They will be recorded as pending features on the
											sheet.
										</p>
										<div className="space-y-2">
											{unresolvedLedgerEntries.map((entry) => (
												<div
													key={`${entry.level}:${entry.type}:${entry.source}`}
													className="p-2 rounded-lg bg-background/50 border border-gate-s/10"
												>
													<span className="font-resurge text-sm text-gate-s">
														{formatRegentVernacular(entry.source)}
													</span>
													<p className="text-xs text-muted-foreground mt-1">
														{entry.count} {formatOptionLabel(entry.type)}{" "}
														selection
														{entry.count === 1 ? "" : "s"}
													</p>
												</div>
											))}
										</div>
									</div>
								)}

								{/* New Features */}
								{newFeatures.length > 0 && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-gate-s/10 to-transparent border border-gate-s/20">
										<Label className="font-resurge text-gate-s tracking-wide flex items-center gap-2 mb-4">
											<Sparkles className="w-4 h-4" />
											NEW ABILITIES UNLOCKED
										</Label>
										<div className="space-y-3">
											{(newFeatures as unknown as JobFeature[]).map(
												(feature) => {
													return (
														<div
															key={feature.id}
															className={cn(
																"p-4 rounded-lg border transition-all duration-300",
																"border-border bg-muted/30",
															)}
														>
															<div className="flex items-start gap-3">
																<div className="flex-1">
																	<div className="flex items-center gap-2 mb-1 flex-wrap">
																		<Label
																			htmlFor={`feature-${feature.id}`}
																			className="font-resurge font-semibold cursor-pointer text-gate-s tracking-wide"
																		>
																			{formatRegentVernacular(feature.name)}
																		</Label>
																		{feature.action_type && (
																			<Badge
																				variant="secondary"
																				className="text-xs font-heading"
																			>
																				{formatRegentVernacular(
																					feature.action_type,
																				)}
																			</Badge>
																		)}
																		{feature.uses_formula && (
																			<Badge
																				variant="outline"
																				className="text-xs font-heading border-gate-s/30 text-gate-s"
																			>
																				{formatRegentVernacular(
																					feature.uses_formula,
																				)}
																			</Badge>
																		)}
																	</div>
																	<p className="text-sm text-muted-foreground font-heading">
																		{formatRegentVernacular(
																			feature.description || "",
																		)}
																	</p>
																	{feature.prerequisites && (
																		<p className="text-xs text-muted-foreground mt-1 italic">
																			Prerequisites:{" "}
																			{formatRegentVernacular(
																				feature.prerequisites,
																			)}
																		</p>
																	)}
																</div>
															</div>
														</div>
													);
												},
											)}
										</div>
									</div>
								)}

								{/* Regent Features Unlocked at This Level */}
								{primaryRegentUnlock && newRegentFeatures.length > 0 && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-regent-gold/10 to-shadow-purple/10 border border-regent-gold/20">
										<Label className="font-resurge text-regent-gold tracking-wide flex items-center gap-2 mb-4">
											<Crown className="w-4 h-4" />
											{formatRegentVernacular(regentData?.name ?? "")} — NEW
											ABILITIES
										</Label>
										<div className="space-y-3">
											{newRegentFeatures.map((feature, idx) => {
												return (
													<div
														key={
															feature.id ||
															`regent-feature-${idx}-${feature.name}`
														}
														className="p-4 rounded-lg border border-regent-gold/10 bg-muted/30"
													>
														<div className="flex items-center gap-2 mb-1 flex-wrap">
															<span className="font-resurge font-semibold text-regent-gold tracking-wide">
																{formatRegentVernacular(feature.name)}
															</span>
															{feature.type && (
																<Badge
																	variant="secondary"
																	className="text-xs font-heading"
																>
																	{feature.type}
																</Badge>
															)}
															{feature.frequency && (
																<Badge
																	variant="outline"
																	className="text-xs font-heading border-regent-gold/30 text-regent-gold"
																>
																	{feature.frequency}
																</Badge>
															)}
														</div>
														<p className="text-sm text-muted-foreground font-heading">
															{formatRegentVernacular(
																feature.description || "",
															)}
														</p>
													</div>
												);
											})}
										</div>
									</div>
								)}

								{/* Stat Changes Preview — only for level up */}
								{!isLevelDown && (
									<div className="p-4 rounded-lg bg-gradient-to-r from-resurge/5 to-shadow-purple/5 border border-resurge/20">
										<h4 className="font-resurge font-semibold mb-4 text-resurge tracking-wide flex items-center gap-2">
											<TrendingUp className="w-4 h-4" />
											STAT MODIFICATIONS
										</h4>
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
												<span className="text-muted-foreground font-heading">
													Proficiency Bonus
												</span>
												<span className="font-resurge text-lg">
													+{calculateProficiencyBonusForLevel(character.level)}{" "}
													{"->"}{" "}
													<span className="text-resurge">
														+{calculateProficiencyBonusForLevel(newLevel)}
													</span>
												</span>
											</div>
											<div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
												<span className="text-muted-foreground font-heading">
													Rift Favor Die
												</span>
												<span className="font-resurge text-lg">
													d{calculateRiftFavorDie(character.level)} {"->"}{" "}
													<span className="text-resurge">
														d{calculateRiftFavorDie(newLevel)}
													</span>
												</span>
											</div>
											<div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
												<span className="text-muted-foreground font-heading">
													Max HP
												</span>
												<span className="font-resurge text-lg">
													{character.hp_max} {"->"}{" "}
													<span className="text-destructive">
														{character.hp_max + (hpIncrease || 0)}
													</span>
												</span>
											</div>
											<div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
												<span className="text-muted-foreground font-heading">
													Hit Dice
												</span>
												<span className="font-resurge text-lg">
													{character.hit_dice_max} {"->"}{" "}
													<span className="text-resurge">{newLevel}</span>
												</span>
											</div>
										</div>
									</div>
								)}
							</div>
						</AscendantWindow>

						<div className="flex justify-end gap-4 mt-6">
							<Button
								variant="outline"
								onClick={onClose}
								className="font-heading"
							>
								Cancel
							</Button>
							<Button
								onClick={isLevelDown ? handleLevelDown : handleLevelUp}
								disabled={
									loading ||
									newLevel === character.level ||
									(!isLevelDown && hpIncrease === null) ||
									(!isLevelDown && !isMilestone && !canLevelUp) ||
									(!isLevelDown && showPathSelection && !selectedPathRow) ||
									(!isLevelDown &&
										selectedPowerIds.length < requiredPowerChoices) ||
									(!isLevelDown &&
										selectedTechniqueIds.length < requiredTechniqueChoices) ||
									(!isLevelDown &&
										selectedCantripIds.length < requiredCantripChoices) ||
									(!isLevelDown &&
										selectedSpellIds.length < requiredSpellChoices) ||
									(!isLevelDown &&
										selectedSpellbookIds.length <
											requiredSpellbookInscriptions) ||
									(!isLevelDown &&
										selectedFightingStyleIds.length <
											requiredFightingStyleChoices) ||
									(!isLevelDown && !ledgerOptionRequirementsMet)
								}
								className={cn(
									"gap-2 font-heading transition-all",
									isLevelDown
										? "bg-gradient-to-r from-destructive to-destructive/25 hover:shadow-red-500/30 hover:shadow-lg"
										: "bg-gradient-to-r from-resurge to-shadow-purple hover:shadow-resurge/30 hover:shadow-lg",
								)}
							>
								{loading ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Processing...
									</>
								) : isLevelDown ? (
									<>
										<TrendingDown className="w-4 h-4" />
										Confirm Level Down
									</>
								) : (
									<>
										<TrendingUp className="w-4 h-4" />
										Complete Level Up
									</>
								)}
							</Button>
						</div>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
