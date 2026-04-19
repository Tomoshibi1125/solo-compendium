import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
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
import { ReviewStep } from "@/components/character-engine/ReviewStep";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateCharacter } from "@/hooks/useCharacters";
import {
	type CharacterTemplate,
	useCharacterTemplates,
} from "@/hooks/useCharacterTemplates";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { usePublishedHomebrew } from "@/hooks/useHomebrewContent";
import { useStaticJobs } from "@/hooks/useStaticJobs";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { isSafeNextPath } from "@/lib/campaignInviteUtils";
import { calculateHPMax } from "@/lib/characterCalculations";
import {
	addJobAwakeningBenefitsForLevel,
	addLevel1Features,
	addStartingEquipment,
	addStartingPowers,
	applyJobAwakeningTraitsToCharacter,
	getJobASI,
} from "@/lib/characterCreation";
import { calculateTotalChoices } from "@/lib/choiceCalculations";
import { isLocalCharacterId, setLocalAbilities } from "@/lib/guestStore";
import { getStaticPathUnlockLevel } from "@/lib/levelGating";
import { getStaticBackgroundsAll } from "@/lib/ProtocolDataManager";
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
	| "equipment"
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

const normalizeCompendiumKey = (value?: string | null) =>
	value
		?.trim()
		.toLowerCase()
		.replace(/[-\s]+/g, "") ?? "";

const CharacterNew = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const requestedNext = searchParams.get("next");
	const safeNext = isSafeNextPath(requestedNext) ? requestedNext : null;
	const { toast } = useToast();
	const createCharacterMutation = useCreateCharacter();

	const { data: templates } = useCharacterTemplates();
	const { data: staticJobCatalog = [] } = useStaticJobs();
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
	};

	const { data: jobs = [] } = useQuery({
		queryKey: ["jobs", staticJobCatalog.length],
		queryFn: async () => {
			const staticJobSource =
				staticJobCatalog.length > 0
					? staticJobCatalog
					: ((await import("@/data/compendium/jobs"))
							.jobs as unknown as StaticJob[]);
			const staticJobsData = staticJobSource.map((job) => ({
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

			try {
				const { data: dbJobs, error } = await supabase
					.from("compendium_jobs")
					.select("*")
					.order("name");

				if (!error && dbJobs) {
					const accessibleDbJobs = await filterRowsBySourcebookAccess(
						dbJobs as Job[],
						(job) => job.source_book,
					);
					const staticJobNames = new Set(
						staticJobsData.map((job) => normalizeCompendiumKey(job.name)),
					);
					const dbJobsByName = new Map(
						accessibleDbJobs.map((job) => [
							normalizeCompendiumKey(job.name),
							job,
						]),
					);

					return [
						...staticJobsData.map((staticJob) => {
							const dbJob = dbJobsByName.get(
								normalizeCompendiumKey(staticJob.name),
							);
							if (!dbJob) return staticJob;

							return {
								...staticJob,
								id: dbJob.id || staticJob.id,
								display_name:
									dbJob.display_name ||
									staticJob.display_name ||
									staticJob.name,
								description: dbJob.description || staticJob.description,
								source_book: dbJob.source_book || staticJob.source_book,
								aliases: dbJob.aliases ?? staticJob.aliases,
								flavor_text: dbJob.flavor_text ?? staticJob.flavor_text,
								generated_reason:
									dbJob.generated_reason ?? staticJob.generated_reason,
								image_url: dbJob.image_url ?? staticJob.image_url,
								tags: dbJob.tags ?? staticJob.tags,
								license_note: dbJob.license_note ?? staticJob.license_note,
								source_kind: dbJob.source_kind ?? staticJob.source_kind,
								source_name: dbJob.source_name ?? staticJob.source_name,
								created_at: dbJob.created_at ?? staticJob.created_at,
								updated_at: dbJob.updated_at ?? staticJob.updated_at,
							};
						}),
						...accessibleDbJobs.filter(
							(job) => !staticJobNames.has(normalizeCompendiumKey(job.name)),
						),
					];
				}
			} catch (err) {
				console.warn("Database jobs unavailable, using static:", err);
			}
			return staticJobsData;
		},
	});

	const jobASI = useMemo(() => {
		if (!selectedJob) return {} as Record<AbilityScore, number>;
		const dbJob = jobs.find((j) => j.id === selectedJob);
		if (!dbJob) return {} as Record<AbilityScore, number>;
		return getJobASI(dbJob.name, 1) as Record<AbilityScore, number>;
	}, [jobs, selectedJob]);

	const effectiveAbilities = useMemo(() => {
		const next = { ...abilities };
		for (const [abilityKey, bonus] of Object.entries(jobASI)) {
			const key = abilityKey as AbilityScore;
			if (key in next) next[key] += bonus;
		}
		return next;
	}, [abilities, jobASI]);

	const staticJobData = useMemo<StaticJob | undefined>(() => {
		if (!selectedJob) return undefined;
		const jobName = jobs.find((j) => j.id === selectedJob)?.name;
		if (!jobName) return undefined;
		return staticJobCatalog.find((j) => j.name === jobName);
	}, [selectedJob, jobs, staticJobCatalog]);

	const jobAwakeningAtCreation = useMemo(() => {
		if (!staticJobData?.awakeningFeatures) return [];
		return staticJobData.awakeningFeatures.filter((f) => f.level === 1);
	}, [staticJobData]);

	const jobTraitsAtCreation = useMemo(() => {
		if (!staticJobData?.jobTraits) return [];
		return staticJobData.jobTraits;
	}, [staticJobData]);

	const { data: paths = [] } = useQuery({
		queryKey: ["paths", selectedJob],
		queryFn: async () => {
			if (!selectedJob) return [];

			const jobName = jobs.find((job) => job.id === selectedJob)?.name ?? "";
			const selectedJobKey = normalizeCompendiumKey(jobName);
			const staticPathSource = ((await import("@/data/compendium/paths"))
				.paths ?? []) as unknown as StaticPathSource[];
			const staticPaths = staticPathSource
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

			try {
				const { data: dbJob } = await supabase
					.from("compendium_jobs")
					.select("id")
					.eq("name", jobName)
					.maybeSingle();

				if (dbJob?.id) {
					const { data, error } = await supabase
						.from("compendium_job_paths")
						.select("*")
						.eq("job_id", dbJob.id)
						.order("name");

					if (!error && data) {
						const accessibleDbPaths = await filterRowsBySourcebookAccess(
							data as Path[],
							(path) => path.source_book,
						);
						const staticPathNames = new Set(
							staticPaths.map((path) => normalizeCompendiumKey(path.name)),
						);
						const dbPathsByName = new Map(
							accessibleDbPaths.map((path) => [
								normalizeCompendiumKey(path.name),
								path,
							]),
						);

						return [
							...staticPaths.map((staticPath) => {
								const dbPath = dbPathsByName.get(
									normalizeCompendiumKey(staticPath.name),
								);
								if (!dbPath) return staticPath;

								return {
									...staticPath,
									id: dbPath.id || staticPath.id,
									display_name:
										dbPath.display_name ||
										staticPath.display_name ||
										staticPath.name,
									description: dbPath.description || staticPath.description,
									source_book: dbPath.source_book || staticPath.source_book,
								};
							}),
							...accessibleDbPaths.filter(
								(path) =>
									!staticPathNames.has(normalizeCompendiumKey(path.name)),
							),
						];
					}
				}
			} catch {
				return staticPaths;
			}

			return staticPaths;
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
			// Build static fallback from backgrounds-index.ts
			const staticBgs = getStaticBackgroundsAll().map((b) => ({
				...b,
				display_name: b.name,
				source_book:
					(b as unknown as { source?: string }).source ??
					"Rift Ascendant Canon",
			})) as unknown as Background[];

			try {
				const { data, error } = await supabase
					.from("compendium_backgrounds")
					.select("*")
					.order("name");
				if (!error && data) {
					return filterRowsBySourcebookAccess(
						data as Background[],
						(background) => background.source_book,
					);
				}
			} catch {
				/* fall through to static */
			}

			// Fallback: use static backgrounds data
			return staticBgs;
		},
	});

	const { data: homebrewJobs = [] } = usePublishedHomebrew("job");
	const { data: homebrewBackgrounds = [] } = usePublishedHomebrew("item");

	const allJobs: Job[] = [
		...jobs,
		...homebrewJobs.map(
			(hb) =>
				({
					id: `homebrew:${hb.id}`,
					name: hb.name,
					description: hb.description,
					hit_die: (hb.data?.hit_die as number) || 8,
					primary_abilities:
						(hb.data?.primary_abilities as AbilityScore[]) || [],
					skill_choices: (hb.data?.skill_choices as string[]) || [],
					skill_choice_count: (hb.data?.skill_choice_count as number) || 2,
					source_book: hb.source_book,
					saving_throw_proficiencies:
						(hb.data?.saving_throw_proficiencies as AbilityScore[]) || [],
					armor_proficiencies: (hb.data?.armor_proficiencies as string[]) || [],
					weapon_proficiencies:
						(hb.data?.weapon_proficiencies as string[]) || [],
					tool_proficiencies: (hb.data?.tool_proficiencies as string[]) || [],
					class_features: (hb.data?.class_features || null) as Json,
					spellcasting: (hb.data?.spellcasting || null) as Json,
					starting_equipment: (hb.data?.starting_equipment || null) as Json,
					aliases: [],
					created_at: hb.created_at || new Date().toISOString(),
					updated_at: hb.updated_at || new Date().toISOString(),
					display_name: hb.name,
					flavor_text: hb.description,
					generated_reason: "Homebrew",
					hit_points_at_first_level: null,
					hit_points_at_higher_levels: null,
					image_url: null,
					license_note: null,
					regent_prerequisites: null,
					secondary_abilities: [],
					source_kind: "homebrew",
					source_name: "User Created",
					tags: hb.tags || [],
					theme_tags: [],
				}) as unknown as Job,
		),
	];

	const allBackgrounds: Background[] = [
		...backgrounds,
		...homebrewBackgrounds
			.filter(
				(hb) =>
					hb.content_type === "item" &&
					(hb.data?.sub_type === "background" ||
						hb.tags?.includes("background")),
			)
			.map(
				(hb) =>
					({
						id: `homebrew:${hb.id}`,
						name: hb.name,
						display_name: hb.name,
						description: hb.description,
						source_book: hb.source_book,
					}) as unknown as Background,
			),
	];

	const jobData = allJobs.find((j) => j.id === selectedJob);

	const totalChoices = useMemo(() => {
		const selectedPathRow =
			selectedPath && selectedPath !== "none"
				? pathsAvailableAtCreation.find((p: Path) => p.id === selectedPath)
				: null;
		const combinedJobData =
			jobData || staticJobData ? { ...jobData, ...staticJobData } : null;
		return calculateTotalChoices(
			combinedJobData as Parameters<typeof calculateTotalChoices>[0],
			selectedPathRow,
			[],
			1,
		);
	}, [jobData, staticJobData, selectedPath, pathsAvailableAtCreation]);

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
		{ id: "abilities", name: "Abilities" },
		...(isPathRequiredAtCreation
			? ([{ id: "path", name: "Path" }] as const)
			: []),
		{ id: "background", name: "Background" },
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

		setLoading(true);
		try {
			const dbJob = jobs.find((j) => j.id === selectedJob);
			const dbBg = backgrounds.find((b) => b.id === selectedBackground);
			if (!dbJob || !dbBg) throw new Error("Job or Background missing");

			// Ensure we use the enriched static data for mapping
			const staticJobSource =
				staticJobCatalog.length > 0
					? staticJobCatalog
					: ((await import("@/data/compendium/jobs"))
							.jobs as unknown as StaticJob[]);
			const job = staticJobSource.find((j: StaticJob) => j.name === dbJob.name);
			const bgData = (
				getStaticBackgroundsAll() as unknown as StaticBackground[]
			).find((b: StaticBackground) => b.name === dbBg.name);

			if (!job || !bgData) throw new Error("Enhanced data missing");

			const level = 1;
			const vitModifier = Math.floor((effectiveAbilities.VIT - 10) / 2);
			const hpMax = calculateHPMax(level, dbJob.hit_die, vitModifier);

			const character = await createCharacterMutation.mutateAsync({
				name: name.trim(),
				level: 1,
				job: dbJob.name,
				path: paths.find((p) => p.id === selectedPath)?.name || null,
				background: dbBg.name,
				appearance: appearance.trim() || null,
				backstory: backstory.trim() || null,
				proficiency_bonus: 2,
				armor_class: 10 + Math.floor((effectiveAbilities.AGI - 10) / 2),
				hp_current: hpMax,
				hp_max: hpMax,
				hit_dice_current: 1,
				hit_dice_max: 1,
				hit_dice_size: dbJob.hit_die,
				skill_proficiencies: [
					...selectedSkills,
					...(bgData.skill_proficiencies || []),
				],
				tool_proficiencies: [
					...(job.tool_proficiencies || job.toolProficiencies || []),
					...(bgData.tool_proficiencies || bgData.toolProficiencies || []),
				],
				saving_throw_proficiencies: (job.saving_throw_proficiencies ||
					job.savingThrows ||
					[]) as AbilityScore[],
				weapon_proficiencies: [
					...(job.weaponProficiencies || job.weapon_proficiencies || []),
					...(bgData.weaponProficiencies || bgData.weapon_proficiencies || []),
				],
				armor_proficiencies: [
					...(job.armorProficiencies || job.armor_proficiencies || []),
					...(bgData.armorProficiencies || bgData.armor_proficiencies || []),
				],
				speed: job.speed ?? 30,
			});

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

			await addLevel1Features(character.id, job, bgData);
			await addStartingEquipment(
				character.id,
				job,
				bgData,
				selectedSkills,
				equipmentChoices,
			);
			await addStartingPowers(character.id, job);
			await addJobAwakeningBenefitsForLevel(character.id, job, 1);
			// Rift Ascendant: Jobs serve as both race and class, so their innate senses,
			// resistances, and immunities must flow onto the character row at creation.
			await applyJobAwakeningTraitsToCharacter(
				character.id,
				job,
				selectedLanguages,
			);

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
			default:
				return true;
		}
	};

	const wizardSteps: WizardStep[] = steps.map((s) => ({
		id: s.id,
		name: s.name,
	}));

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

					{currentStep === "equipment" && staticJobData && (
						<EquipmentStep
							staticJobData={staticJobData}
							equipmentChoices={equipmentChoices}
							setEquipmentChoices={setEquipmentChoices}
						/>
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
						/>
					)}
				</CharacterWizard>
			</div>
		</Layout>
	);
};

export default CharacterNew;
