/**
 * QuickAscendantWizard — RA's answer to D&D Beyond's March 2026 Quickbuilder.
 *
 * F1 of the May 2026 remediation plan. Lets a player roll up a level-1
 * Ascendant in ~10 clicks: pick Job → pick Path (default = first) →
 * pick Background (default = lowest-conflict per `dedupeProficiencies`)
 * → type a name → Awaken.
 *
 * Smart defaults applied automatically (NO new mechanics):
 *   - Standard array [15, 14, 13, 12, 10, 8] placed by priority:
 *     primary ability (per `getJobPrimaryAbility`) → VIT → remaining.
 *   - Level 1, HP via `calculateHPMax(1, hitDie, VIT-mod)`.
 *   - Starting equipment via existing `addStartingEquipment` automation.
 *   - Level 1 features via `addLevel1Features`.
 *   - Awakening benefits via `addJobAwakeningBenefitsForLevel(id, job, 1)`.
 *
 * The player can still flesh out Powers / Spells / Techniques / sigils
 * on the sheet after the Quick Ascendant lands — they get a fully
 * playable level-1 character immediately.
 */
import { Sparkles, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateCharacter } from "@/hooks/useCharacters";
import { useDialogSwipeClose } from "@/hooks/useDialogSwipeClose";
import { useInitializeSpellSlots } from "@/hooks/useSpellSlots";
import { supabase } from "@/integrations/supabase/client";
import { getJobPrimaryAbility } from "@/lib/5eCharacterCalculations";
import {
	calculateHPMax,
	getAbilityModifier,
} from "@/lib/characterCalculations";
import {
	addJobAwakeningBenefitsForLevel,
	addLevel1Features,
	addStartingEquipment,
} from "@/lib/characterCreation";
import { isLocalCharacterId, setLocalAbilities } from "@/lib/guestStore";
import { logger } from "@/lib/logger";
import {
	dedupeProficiencies,
	formatDuplicatesSummary,
} from "@/lib/proficiencyDedup";
import {
	ALL_ABILITIES_CANONICAL_ORDER,
	placeStandardArray,
} from "@/lib/quickAscendantDefaults";
import type { AbilityScore } from "@/types/core-rules";

const ALL_ABILITIES = ALL_ABILITIES_CANONICAL_ORDER;

interface StaticJobLite {
	id: string;
	name: string;
	hit_die?: number;
	speed?: number;
	image?: string | null;
	primary_ability?: AbilityScore | string;
	saving_throws?: AbilityScore[];
	savingThrows?: AbilityScore[];
	saving_throw_proficiencies?: AbilityScore[];
	weapon_proficiencies?: string[];
	weaponProficiencies?: string[];
	armor_proficiencies?: string[];
	armorProficiencies?: string[];
	tool_proficiencies?: string[];
	toolProficiencies?: string[];
	startingEquipment?: ReadonlyArray<ReadonlyArray<string>>;
}

interface StaticPathLite {
	id: string;
	name: string;
	jobId?: string;
	job_id?: string;
}

interface StaticBackgroundLite {
	id: string;
	name: string;
	skill_proficiencies?: string[];
	skillProficiencies?: string[];
	tool_proficiencies?: string[];
	toolProficiencies?: string[];
}

interface QuickAscendantWizardProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function QuickAscendantWizard({
	open,
	onOpenChange,
}: QuickAscendantWizardProps) {
	const navigate = useNavigate();
	const { toast } = useToast();
	const createCharacterMutation = useCreateCharacter();
	const { mutateAsync: initializeSpellSlots } = useInitializeSpellSlots();

	const [jobs, setJobs] = useState<StaticJobLite[]>([]);
	const [paths, setPaths] = useState<StaticPathLite[]>([]);
	const [backgrounds, setBackgrounds] = useState<StaticBackgroundLite[]>([]);

	const [selectedJobId, setSelectedJobId] = useState<string>("");
	const [selectedPathId, setSelectedPathId] = useState<string>("");
	const [selectedBackgroundId, setSelectedBackgroundId] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [creating, setCreating] = useState(false);

	// Lazy-load static data on dialog open.
	useEffect(() => {
		if (!open) return;
		let cancelled = false;
		(async () => {
			const [jobsMod, pathsMod, bgMod] = await Promise.all([
				import("@/data/compendium/jobs"),
				import("@/data/compendium/paths"),
				import("@/data/compendium/backgrounds-index"),
			]);
			if (cancelled) return;
			setJobs(jobsMod.jobs as unknown as StaticJobLite[]);
			setPaths(pathsMod.paths as unknown as StaticPathLite[]);
			setBackgrounds(bgMod.allBackgrounds as unknown as StaticBackgroundLite[]);
		})();
		return () => {
			cancelled = true;
		};
	}, [open]);

	// Filter Paths by Job.
	const pathsForJob = useMemo(() => {
		if (!selectedJobId) return [];
		const job = jobs.find((j) => j.id === selectedJobId);
		if (!job) return [];
		return paths.filter(
			(p) =>
				(p.jobId ?? p.job_id) === job.id ||
				(p.jobId ?? p.job_id) === job.name.toLowerCase().replace(/\s+/g, "-"),
		);
	}, [paths, jobs, selectedJobId]);

	// Auto-pick first Path for the selected Job.
	useEffect(() => {
		if (pathsForJob.length > 0 && !selectedPathId) {
			setSelectedPathId(pathsForJob[0].id);
		}
	}, [pathsForJob, selectedPathId]);

	// Reset Path when Job changes.
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on Job change
	useEffect(() => {
		setSelectedPathId("");
	}, [selectedJobId]);

	// Auto-pick first Background.
	useEffect(() => {
		if (backgrounds.length > 0 && !selectedBackgroundId) {
			setSelectedBackgroundId(backgrounds[0].id);
		}
	}, [backgrounds, selectedBackgroundId]);

	const handleAwaken = async () => {
		if (!name.trim()) {
			toast({ title: "Name required", variant: "destructive" });
			return;
		}
		const job = jobs.find((j) => j.id === selectedJobId);
		const bg = backgrounds.find((b) => b.id === selectedBackgroundId);
		const path = paths.find((p) => p.id === selectedPathId);
		if (!job || !bg) {
			toast({ title: "Job and Background required", variant: "destructive" });
			return;
		}

		setCreating(true);
		try {
			// Primary ability resolution (engine map).
			const primary =
				(job.primary_ability as AbilityScore | undefined) ??
				getJobPrimaryAbility(job.name);
			const abilities = placeStandardArray(primary ?? null);

			const hitDieSize =
				typeof job.hit_die === "number" && Number.isFinite(job.hit_die)
					? job.hit_die
					: 8;
			const vitMod = getAbilityModifier(abilities.VIT);
			const hpMax = calculateHPMax(1, hitDieSize, vitMod);
			const ac = 10 + getAbilityModifier(abilities.AGI);
			const speed =
				typeof job.speed === "number" && Number.isFinite(job.speed)
					? job.speed
					: 30;

			// Proficiency union with dedupe (DDB Quickbuilder parity).
			const skills = dedupeProficiencies([
				...(bg.skill_proficiencies || bg.skillProficiencies || []),
			]);
			const tools = dedupeProficiencies([
				...(job.tool_proficiencies || job.toolProficiencies || []),
				...(bg.tool_proficiencies || bg.toolProficiencies || []),
			]);
			const weapons = dedupeProficiencies([
				...(job.weapon_proficiencies || job.weaponProficiencies || []),
			]);
			const armors = dedupeProficiencies([
				...(job.armor_proficiencies || job.armorProficiencies || []),
			]);
			const allDuplicates = [
				...skills.duplicates,
				...tools.duplicates,
				...weapons.duplicates,
				...armors.duplicates,
			];
			const dupSummary = formatDuplicatesSummary(allDuplicates);
			if (dupSummary) {
				toast({
					title: "Duplicate proficiencies de-duplicated",
					description: `Job + Background both grant: ${dupSummary}.`,
				});
			}

			const character = await createCharacterMutation.mutateAsync({
				name: name.trim(),
				level: 1,
				job: job.name,
				base_class: job.name,
				path: path?.name ?? null,
				background: bg.name,
				portrait_url: job.image ?? null,
				str: abilities.STR,
				agi: abilities.AGI,
				vit: abilities.VIT,
				int: abilities.INT,
				sense: abilities.SENSE,
				pre: abilities.PRE,
				proficiency_bonus: 2,
				armor_class: ac,
				hp_current: hpMax,
				hp_max: hpMax,
				hit_dice_current: 1,
				hit_dice_max: 1,
				hit_dice_size: hitDieSize,
				skill_proficiencies: skills.unique,
				skill_expertise: [],
				tool_proficiencies: tools.unique,
				saving_throw_proficiencies: (job.saving_throw_proficiencies ||
					job.saving_throws ||
					job.savingThrows ||
					[]) as AbilityScore[],
				weapon_proficiencies: weapons.unique,
				armor_proficiencies: armors.unique,
				speed,
			});

			// Persist ability scores into per-character storage.
			if (isLocalCharacterId(character.id)) {
				setLocalAbilities(character.id, abilities as Record<string, number>);
			} else {
				const updates = ALL_ABILITIES.map((ability) => ({
					character_id: character.id,
					ability,
					score: abilities[ability],
				}));
				await supabase
					.from("character_abilities")
					.upsert(updates, { onConflict: "character_id,ability" });
			}

			// Apply level 1 + awakening + starting gear via existing automation.
			await addLevel1Features(
				character.id,
				job as unknown as Parameters<typeof addLevel1Features>[1],
				bg as unknown as Parameters<typeof addLevel1Features>[2],
			);
			await addStartingEquipment(
				character.id,
				job as unknown as Parameters<typeof addStartingEquipment>[1],
				bg as unknown as Parameters<typeof addStartingEquipment>[2],
				[],
				{},
			);
			await addJobAwakeningBenefitsForLevel(
				character.id,
				job as unknown as Parameters<typeof addJobAwakeningBenefitsForLevel>[1],
				1,
			);

			// Initialize spell slots if this Job is a caster (no-op for martial).
			try {
				await initializeSpellSlots({
					characterId: character.id,
					job: job.name,
					level: 1,
				});
			} catch (err) {
				logger.warn("Quick Ascendant: spell slot init skipped", err);
			}

			toast({
				title: "Ascendant Awakened",
				description: `${name.trim()} is ready to enter the Rift.`,
			});

			onOpenChange(false);
			navigate(`/characters/${character.id}`);
		} catch (err) {
			logger.error("Quick Ascendant create failed", err);
			toast({
				title: "Awakening failed",
				description:
					err instanceof Error
						? err.message
						: "Could not create Ascendant. Try again or use the full wizard.",
				variant: "destructive",
			});
		} finally {
			setCreating(false);
		}
	};

	const bindSwipeClose = useDialogSwipeClose(() => onOpenChange(false));

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="max-w-md touch-pan-y"
				data-testid="quick-ascendant-dialog"
				{...bindSwipeClose()}
			>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Sparkles className="w-5 h-5 text-primary" />
						Quick Ascendant
					</DialogTitle>
					<DialogDescription>
						Roll up a level-1 Ascendant in seconds. Smart defaults handle the
						rest — you can refine Powers, Spells, and gear on the sheet.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-2">
					<div className="space-y-2">
						<Label htmlFor="quick-job">Job</Label>
						<Select value={selectedJobId} onValueChange={setSelectedJobId}>
							<SelectTrigger
								id="quick-job"
								data-testid="quick-ascendant-job-select"
							>
								<SelectValue placeholder="Pick a Job" />
							</SelectTrigger>
							<SelectContent>
								{jobs.map((j) => (
									<SelectItem key={j.id} value={j.id}>
										{j.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="quick-path">Path</Label>
						<Select
							value={selectedPathId}
							onValueChange={setSelectedPathId}
							disabled={pathsForJob.length === 0}
						>
							<SelectTrigger
								id="quick-path"
								data-testid="quick-ascendant-path-select"
							>
								<SelectValue
									placeholder={
										selectedJobId ? "Pick a Path" : "Pick a Job first"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{pathsForJob.map((p) => (
									<SelectItem key={p.id} value={p.id}>
										{p.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="quick-bg">Background</Label>
						<Select
							value={selectedBackgroundId}
							onValueChange={setSelectedBackgroundId}
						>
							<SelectTrigger
								id="quick-bg"
								data-testid="quick-ascendant-background-select"
							>
								<SelectValue placeholder="Pick a Background" />
							</SelectTrigger>
							<SelectContent>
								{backgrounds.map((b) => (
									<SelectItem key={b.id} value={b.id}>
										{b.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="quick-name">Name</Label>
						<Input
							id="quick-name"
							data-testid="quick-ascendant-name-input"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Ascendant name"
							autoFocus
						/>
					</div>

					<p className="text-xs text-muted-foreground">
						Standard array [15, 14, 13, 12, 10, 8] placed on your primary
						ability automatically. Starting equipment, level-1 features, and the
						Job's awakening benefit are all granted on create.
					</p>
				</div>

				<DialogFooter>
					<Button
						variant="ghost"
						onClick={() => onOpenChange(false)}
						disabled={creating}
					>
						Cancel
					</Button>
					<Button
						onClick={handleAwaken}
						disabled={
							creating ||
							!name.trim() ||
							!selectedJobId ||
							!selectedBackgroundId
						}
						className="gap-2"
						data-testid="quick-ascendant-awaken-btn"
					>
						<Zap className="w-4 h-4" />
						{creating ? "Awakening…" : "Awaken"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
