import { useDrag } from "@use-gesture/react";
import type { LucideIcon } from "lucide-react";
import {
	Copy,
	Crown,
	Ghost,
	Shield,
	Sparkles,
	Sun,
	Swords,
	Wand2,
	Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ConcentrationBanner } from "@/components/CharacterSheet/ConcentrationBanner";
import { ConditionBadgeBar } from "@/components/CharacterSheet/ConditionBadgeBar";
import { DefensesModal } from "@/components/CharacterSheet/DefensesModal";
import { HealthDialog } from "@/components/CharacterSheet/HealthDialog";
import { ShortRestDialog } from "@/components/CharacterSheet/ShortRestDialog";
import { ActionsList } from "@/components/character/ActionsList";
import { CharacterBackupPanel } from "@/components/character/CharacterBackupPanel";
import { CharacterEditDialog } from "@/components/character/CharacterEditDialog";
import { CharacterExtrasPanel } from "@/components/character/CharacterExtrasPanel";
import { CurrencyManager } from "@/components/character/CurrencyManager";
import { EquipmentList } from "@/components/character/EquipmentList";
import { ExportDialog } from "@/components/character/ExportDialog";
import { FeatureChoicesPanel } from "@/components/character/FeatureChoicesPanel";
import { FeaturesList } from "@/components/character/FeaturesList";
import { HomebrewFeatureApplicator } from "@/components/character/HomebrewFeatureApplicator";
import { JournalPanel } from "@/components/character/JournalPanel";
import { LevelUpWizardModal } from "@/components/character/LevelUpWizardModal";
import { RegentFeaturesDisplay } from "@/components/character/RegentFeaturesDisplay";
import { RegentUnlocksPanel } from "@/components/character/RegentUnlocksPanel";
import { RollHistoryPanel } from "@/components/character/RollHistoryPanel";
import { RunesList } from "@/components/character/RunesList";
import { ShadowSoldiersPanel } from "@/components/character/ShadowSoldiersPanel";
import { SpellSlotsDisplay } from "@/components/character/SpellSlotsDisplay";
import { AbilitiesPanel } from "@/components/character-v2/AbilitiesPanel";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Layout } from "@/components/layout/Layout";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCharacterPageModel } from "@/hooks/useCharacterPageModel";
import { type RegentUnlock, useRegentUnlocks } from "@/hooks/useRegentUnlocks";
import type { Json } from "@/integrations/supabase/types";
import { getAbilityModifier } from "@/lib/characterCalculations";
import { calculateTotalTempHP } from "@/lib/characterResources";
import {
	type ConditionEntry,
	migrateLegacyConditions,
} from "@/lib/conditionSystem";
import { getXPProgress, type LevelingType } from "@/lib/experience";
import { cn } from "@/lib/utils";
import { QuestLog } from "@/pages/ascendant-tools/QuestLog";
import type { DetailData } from "@/types/character";
import type { AbilityScore } from "@/types/core-rules";
import { AbilityScoreStrip } from "./AbilityScoreStrip";
import { CharacterScrollHeader } from "./CharacterScrollHeader";
import { ProficiencySidebar } from "./ProficiencySidebar";
import { StatusHeader } from "./StatusHeader";

// CharacterSheetV2 is now the single authoritative page component.

export default function CharacterSheetV2() {
	const pm = useCharacterPageModel();

	const {
		character,
		memoizedStats,
		characterResources,
		displayNames,
		campaignId,
		spellCasting,
		isLoading,
		isReadOnly,
		sheetController,
		handleGenerateShareLink,
		handleCopyShareLink,
		shareToken,
		generateShareTokenPending,
		updateCharacter,

		activeTab,
		setActiveTab,
		navigate,
		handleShortRest,
		handleLongRest,
		rollAndRecord,
		handleResourceAdjust,
		ascendantTools,
		concentration,
		deathSaves,
	} = pm;

	const {
		ui: { modals: persistentModals },
	} = sheetController.state;

	const [internalMobileTab, setInternalMobileTab] = useState("actions");
	const activeMobileTab = activeTab || internalMobileTab;
	const setActiveMobileTab = setActiveTab || setInternalMobileTab;

	// Regent Unlocks for display
	const { unlocks: regentUnlocks = [] } = useRegentUnlocks(character?.id || "");
	const primaryRegent =
		regentUnlocks.find((u: RegentUnlock) => u.is_primary) || regentUnlocks[0];

	// Detail Drawer State
	const [selectedDetail, setSelectedDetail] = useState<
		(DetailData & { icon?: LucideIcon; type: string }) | null
	>(null);

	// Scroll Header Visibility State
	const [showScrollHeader, setShowScrollHeader] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			// Show header after scrolling past the main header (approx 400px)
			setShowScrollHeader(window.scrollY > 400);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const onSelectDetail = (
		detail: DetailData,
		type: string,
		icon: LucideIcon,
	) => {
		setSelectedDetail({ ...detail, type, icon });
	};

	const mobileTabs = ["actions", "powers", "inventory", "features", "stats"];
	const bindMobileGestures = useDrag(
		({ swipe: [swipeX] }: { swipe: [number, number] }) => {
			if (swipeX !== 0) {
				const currentIndex = mobileTabs.indexOf(activeMobileTab);
				if (swipeX < 0 && currentIndex < mobileTabs.length - 1) {
					// Swiped left, go next
					setActiveMobileTab(mobileTabs[currentIndex + 1]);
				} else if (swipeX > 0 && currentIndex > 0) {
					// Swiped right, go prev
					setActiveMobileTab(mobileTabs[currentIndex - 1]);
				}
			}
		},
		{ axis: "x", filterTaps: true, pointerContext: true },
	);

	const characterState = character
		? (character.gemini_state as {
				conditions?: ConditionEntry[];
				leveling_type?: LevelingType;
			} & Record<string, Json>) || {}
		: {};
	const levelingType: LevelingType =
		(characterState.leveling_type as LevelingType) || "xp";
	const xpProgress = character
		? getXPProgress(character.experience || 0)
		: { current: 0, next: 300, percent: 0 };

	const characterConditions = useMemo(() => {
		if (!character) return [];
		const structured = characterState.conditions;
		if (structured && Array.isArray(structured) && structured.length > 0) {
			return structured;
		}
		return migrateLegacyConditions(character.conditions || []);
	}, [character, characterState.conditions]);

	if (isLoading) {
		return (
			<Layout>
				<div className="container mx-auto px-4 py-8 max-w-7xl">
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<Skeleton className="h-8 w-48" />
							<div className="flex gap-2">
								<Skeleton className="h-10 w-24" />
								<Skeleton className="h-10 w-24" />
							</div>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2 space-y-6">
								<Skeleton className="h-32 w-full" />
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{Array.from({ length: 4 }).map((_, i) => (
										<Skeleton
											key={`slot-${[...Array(i + 1)].length}`}
											className="h-24 w-full"
										/>
									))}
								</div>
								<Skeleton className="h-64 w-full" />
							</div>
							<div className="space-y-6">
								<Skeleton className="h-48 w-full" />
								<Skeleton className="h-48 w-full" />
							</div>
						</div>
					</div>
				</div>
			</Layout>
		);
	}

	if (!character) {
		return (
			<Layout>
				<div className="container mx-auto px-4 py-8">
					<AscendantWindow
						title="ASCENDANT NOT FOUND"
						className="max-w-lg mx-auto"
					>
						<AscendantText className="block text-muted-foreground mb-4">
							The Ascendant you're looking for doesn't exist or you don't have
							access to it.
						</AscendantText>
						<Button onClick={() => navigate("/characters")}>
							Back to Ascendants
						</Button>
					</AscendantWindow>
				</div>
			</Layout>
		);
	}

	if (!memoizedStats) return null;
	const stats = memoizedStats;

	const onRollAbility = (ability: AbilityScore) =>
		rollAndRecord({
			title: `${ability} Check`,
			formula: "1d20",
			rollType: "ability",
			context: `${ability} ability check`,
			modifier: getAbilityModifier(stats.finalAbilities[ability]),
		});

	const onRollSave = (ability: AbilityScore) =>
		rollAndRecord({
			title: `${ability} Save`,
			formula: "1d20",
			rollType: "save",
			context: `${ability} saving throw`,
			modifier: stats.calculatedStats.savingThrows[ability],
		});

	const onRollSkill = (skill: string) => {
		const skillData = stats.allSkills.find((s) => s.name === skill);
		const modifier = skillData ? (stats.skills[skill]?.modifier ?? 0) : 0;
		rollAndRecord({
			title: `${skill} Check`,
			formula: "1d20",
			rollType: "skill",
			context: `${skill} skill check`,
			modifier,
		});
	};

	const onRollInitiative = () =>
		rollAndRecord({
			title: "Initiative",
			formula: "1d20",
			rollType: "initiative",
			context: "Initiative roll",
			modifier: stats.finalInitiative,
		});

	const onRollHitDice = () =>
		rollAndRecord({
			title: "Hit Dice",
			formula: "1d8",
			rollType: "hit_dice",
			context: "Hit Dice roll",
			modifier: getAbilityModifier(stats.finalAbilities.VIT),
		});

	const onHPClick = () => sheetController.setModal("health", true);
	const onACClick = () => sheetController.setModal("defenses", true);
	const onShortRest = () => handleShortRest();
	const onLongRest = () => handleLongRest();
	const onLevelUp = () => sheetController.setModal("levelUp", true);
	const onResourceAdjust = (
		field: "hit_dice_current" | "rift_favor_current",
		delta: number,
	) => handleResourceAdjust(field, delta);

	const handleTakeDamage = (amount: number) => {
		const newHp = Math.max(0, character.hp_current - amount);
		updateCharacter.mutate({
			id: character.id,
			data: { hp_current: newHp },
		});

		ascendantTools
			.trackHealthChange(character.id, amount, "damage")
			.catch(console.error);

		// Process concentration check
		const result = concentration.takeDamage(amount);
		if (result?.concentrationLost) {
			// Actually drop the condition
			onRemoveCondition(
				characterConditions.find((c) => c.conditionName === "Concentration")
					?.id || "",
			);
			// We can trigger a toast to notify
			import("@/hooks/use-toast").then(({ toast }) => {
				toast({
					title: "Concentration Lost!",
					description: `Failed VIT save (${result.total} vs DC ${result.dc}). ${result.spellName} dropped.`,
					variant: "destructive",
				});
			});
		} else if (result && !result.concentrationLost) {
			import("@/hooks/use-toast").then(({ toast }) => {
				toast({
					title: "Concentration Maintained",
					description: `Succeeded VIT save (${result.total} vs DC ${result.dc}).`,
				});
			});
		}
	};

	const handleHeal = (amount: number) => {
		const newHp = Math.min(character.hp_max, character.hp_current + amount);
		updateCharacter.mutate({
			id: character.id,
			data: { hp_current: newHp },
		});

		ascendantTools
			.trackHealthChange(character.id, amount, "healing")
			.catch(console.error);
	};

	function isConditionEntryArray(val: Json): val is ConditionEntry[] {
		if (!Array.isArray(val)) return false;
		if (val.length === 0) return true;
		const first = val[0];
		return (
			typeof first === "object" &&
			first !== null &&
			!Array.isArray(first) &&
			"conditionName" in (first as Record<string, Json>)
		);
	}

	function isStringArray(val: Json): val is string[] {
		if (!Array.isArray(val)) return false;
		if (val.length === 0) return true;
		return typeof val[0] === "string";
	}

	const onExhaustionChange = (delta: number) => {
		const newLevel = Math.max(
			0,
			Math.min(6, (character.exhaustion_level || 0) + delta),
		);
		updateCharacter.mutate({
			id: character.id,
			data: { exhaustion_level: newLevel },
		});
		if (delta > 0)
			ascendantTools
				.trackConditionChange(character.id, "Exhaustion", "add")
				.catch(console.error);
		else
			ascendantTools
				.trackConditionChange(character.id, "Exhaustion", "remove")
				.catch(console.error);
	};

	const onAddCondition = (condition: string) => {
		const currentRaw = character.conditions || [];
		let current: ConditionEntry[] = [];

		if (isConditionEntryArray(currentRaw)) {
			current = currentRaw;
		} else if (isStringArray(currentRaw)) {
			current = migrateLegacyConditions(currentRaw);
		}

		const entry: ConditionEntry = {
			id: crypto.randomUUID(),
			conditionName: condition,
			sourceType: "manual",
			sourceId: null,
			sourceName: "Manual",
			appliedAt: new Date().toISOString(),
			durationRounds: null,
			remainingRounds: null,
			concentrationSpellId: null,
			isActive: true,
		};
		updateCharacter.mutate({
			id: character.id,
			data: {
				conditions: [...current, entry].map((c) => c.conditionName),
				gemini_state: {
					...characterState,
					conditions: [...current, entry].map(
						(c): Json => ({
							id: c.id,
							conditionName: c.conditionName,
							sourceType: c.sourceType,
							sourceId: c.sourceId,
							sourceName: c.sourceName,
							appliedAt: c.appliedAt,
							durationRounds: c.durationRounds,
							remainingRounds: c.remainingRounds,
							concentrationSpellId: c.concentrationSpellId,
							isActive: c.isActive,
							notes: c.notes || null,
						}),
					),
				},
			},
		});
		ascendantTools
			.trackConditionChange(character.id, condition, "add")
			.catch(console.error);
	};

	const onRemoveCondition = (conditionId: string) => {
		const currentRaw = character.conditions || [];
		let current: ConditionEntry[] = [];

		if (isConditionEntryArray(currentRaw)) {
			current = currentRaw;
		} else if (isStringArray(currentRaw)) {
			current = migrateLegacyConditions(currentRaw);
		}

		const updated = current.filter((c) => c.id !== conditionId);
		const removed = current.find((c) => c.id === conditionId);
		updateCharacter.mutate({
			id: character.id,
			data: {
				conditions: updated.map((c) => c.conditionName),
				gemini_state: {
					...characterState,
					conditions: updated.map(
						(c) =>
							({
								id: c.id,
								conditionName: c.conditionName,
								sourceType: c.sourceType,
								sourceId: c.sourceId,
								sourceName: c.sourceName,
								appliedAt: c.appliedAt,
								durationRounds: c.durationRounds,
								remainingRounds: c.remainingRounds,
								concentrationSpellId: c.concentrationSpellId,
								isActive: c.isActive,
								notes: c.notes,
							}) as { [key: string]: Json | undefined },
					),
				} as Json,
			},
		});
		if (removed)
			ascendantTools
				.trackConditionChange(character.id, removed.conditionName, "remove")
				.catch(console.error);
	};

	// We pass down specific native actions/elements rather than taking them from props!
	const actions = (
		<ActionsList
			characterId={character.id}
			campaignId={campaignId ?? undefined}
			onSelectDetail={(detail) => onSelectDetail(detail, "Action", Swords)}
		/>
	);
	const powers = (
		<AbilitiesPanel
			characterId={character.id}
			spellCasting={spellCasting}
			campaignId={campaignId ?? undefined}
			onSelectDetail={(detail, type) =>
				onSelectDetail(detail, type ?? "Ability", Wand2)
			}
		/>
	);
	const inventory = (
		<div className="space-y-6">
			<EquipmentList
				characterId={character.id}
				onSelectDetail={(detail) => onSelectDetail(detail, "Item", Shield)}
			/>
			<CurrencyManager characterId={character.id} />
		</div>
	);
	const features = (
		<div className="space-y-6">
			<FeaturesList
				characterId={character.id}
				onSelectDetail={(detail) => onSelectDetail(detail, "Feature", Zap)}
			/>
			<FeatureChoicesPanel characterId={character.id} />
			<HomebrewFeatureApplicator characterId={character.id} />
			<RegentFeaturesDisplay
				characterId={character.id}
				characterLevel={character.level || 1}
				regentId={primaryRegent?.regent_id}
				regentLevel={1}
				onSelectDetail={(detail) => onSelectDetail(detail, "Regent", Crown)}
			/>
			<RegentUnlocksPanel characterId={character.id} />
			<RunesList
				characterId={character.id}
				campaignId={campaignId ?? undefined}
				onSelectDetail={(detail) => onSelectDetail(detail, "Rune", Sparkles)}
			/>
			<ShadowSoldiersPanel
				characterId={character.id}
				characterLevel={character.level || 1}
				campaignId={campaignId ?? undefined}
				onSelectDetail={(detail) => onSelectDetail(detail, "Shadow", Ghost)}
			/>
		</div>
	);
	const bio = (
		<>
			<JournalPanel characterId={character.id} />
			<CharacterBackupPanel characterId={character.id} />
			<RollHistoryPanel characterId={character.id} />
		</>
	);
	const quests = <QuestLog characterId={character.id} />;
	const extras = (
		<>
			<CharacterExtrasPanel characterId={character.id} />
			<SpellSlotsDisplay
				characterId={character.id}
				job={character.job}
				level={character.level}
				abilities={character.abilities}
			/>
		</>
	);

	const senses = stats.senses;
	const defenses = {
		resistances: stats.resistances,
		immunities: stats.immunities,
		vulnerabilities: stats.vulnerabilities,
		conditionImmunities: stats.conditionImmunities,
	};

	// ───────────────────────────────────────────────────────────────────────────
	// UI Header & Actions (Unified from CharacterSheet.tsx)
	// ───────────────────────────────────────────────────────────────────────────

	const characterHeader = (
		<div className="relative overflow-hidden bg-obsidian-charcoal/40 border border-primary/20 backdrop-blur-md rounded-[2px] p-1 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
			<div className="relative z-10 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-primary/10">
				{/* Portrait & Basic Identity */}
				<div className="p-4 flex items-center gap-6 bg-black/40">
					<div className="relative group">
						<div className="w-20 h-20 rounded-[2px] border-2 border-primary/30 overflow-hidden bg-obsidian-charcoal relative">
							{character.portrait_url ? (
								<img
									src={character.portrait_url}
									alt={character.name}
									className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center bg-primary/5">
									<span className="text-4xl font-display font-bold text-primary/20 tracking-tighter">
										{character.name[0]}
									</span>
								</div>
							)}
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
						</div>
						{/* Rank Badge */}
						<div
							className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 flex flex-col items-center justify-center font-display font-bold text-sm bg-obsidian-charcoal z-20 ${
								character.level >= 17
									? "border-gate-s text-gate-s shadow-[0_0_10px_rgba(var(--gate-s-rgb),0.5)]"
									: character.level >= 13
										? "border-gate-a text-gate-a"
										: character.level >= 9
											? "border-gate-b text-gate-b"
											: character.level >= 5
												? "border-gate-c text-gate-c"
												: character.level >= 2
													? "border-gate-d text-gate-d"
													: "border-gate-e text-gate-e"
							}`}
						>
							<span className="text-[7px] leading-none text-primary/40 -mb-0.5">
								RANK
							</span>
							<span>
								{character.level >= 17
									? "S"
									: character.level >= 13
										? "A"
										: character.level >= 9
											? "B"
											: character.level >= 5
												? "C"
												: character.level >= 2
													? "D"
													: "E"}
							</span>
						</div>
					</div>

					<div className="flex flex-col">
						<h1 className="text-2xl font-display font-bold text-white tracking-tight drop-shadow-sm">
							{character.name}
						</h1>
						<div className="flex items-center gap-2 mt-1">
							<span className="text-[10px] font-mono text-primary/60 uppercase tracking-widest bg-primary/10 px-1.5 py-0.5 rounded-[1px]">
								{displayNames.job || "Unawakened"}
							</span>
							{displayNames.path && (
								<>
									<span className="text-primary/30">/</span>
									<span className="text-[10px] font-mono text-primary/40 uppercase tracking-widest">
										{displayNames.path}
									</span>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Level & XP Progress Section */}
				<div className="flex-1 p-4 bg-black/20 flex flex-col justify-center">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-3">
							<span className="text-xs font-mono text-primary/50 uppercase tracking-widest">
								{levelingType === "xp" ? "PROGRESS_LEVEL" : "MILESTONE_LEVEL"}
							</span>
							<span className="text-2xl font-display font-bold text-white leading-none">
								{character.level}
							</span>
						</div>
						{levelingType === "xp" && (
							<span className="text-[10px] font-mono text-primary/40 tracking-[0.2em] uppercase">
								{character.experience || 0} / {xpProgress.next} XP
							</span>
						)}
					</div>
					<div className="relative h-1.5 w-full bg-black border border-primary/10 overflow-hidden">
						<Progress
							value={levelingType === "xp" ? xpProgress.percent || 0 : 100}
							max={100}
							className={`h-full ${levelingType === "xp" ? "bg-primary/40" : "bg-primary/20 opacity-50"}`}
						/>
						{levelingType === "xp" && (
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_infinite]" />
						)}
					</div>
				</div>

				{/* Quick Actions Panel */}
				{!isReadOnly && (
					<div className="p-4 flex items-center gap-3 bg-primary/5 min-w-[200px]">
						<HealthDialog
							isOpen={persistentModals.health}
							onOpenChange={(open) => sheetController.setModal("health", open)}
							hpCurrent={character.hp_current}
							hpMax={character.hp_max}
							tempHp={calculateTotalTempHP(characterResources)}
							onTakeDamage={handleTakeDamage}
							onHeal={handleHeal}
						/>
						<ShortRestDialog
							hitDiceAvailable={character.hit_dice_current}
							hitDiceMax={character.hit_dice_max}
							hitDieSize={character.hit_dice_size}
							vitScore={stats.finalAbilities.VIT}
							hpCurrent={character.hp_current}
							hpMax={character.hp_max}
							onFinishRest={onShortRest}
						/>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								if (typeof navigator !== "undefined" && navigator.vibrate)
									navigator.vibrate(10);
								onLongRest();
							}}
							className="h-8 border-primary/20 bg-black/20 hover:bg-primary/10 transition-colors uppercase font-mono text-[10px] tracking-widest"
						>
							<Sun className="w-3 h-3 mr-1.5 text-orange-400" />
							Long Rest
						</Button>
						{character.level < 20 && (
							<Button
								variant="default"
								size="sm"
								onClick={() => {
									if (typeof navigator !== "undefined" && navigator.vibrate)
										navigator.vibrate([10, 30, 10]); // Multi-pulse for importance
									onLevelUp();
								}}
								className="h-8 shadow-[0_0_15px_rgba(var(--primary),0.3)] uppercase font-mono text-[10px] tracking-widest"
							>
								<Zap className="w-3 h-3 mr-1.5" />
								Level Up
							</Button>
						)}
					</div>
				)}
			</div>
			{/* Scanner Line Animation */}
			<div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20 animate-[scan_4s_linear_infinite] pointer-events-none" />
		</div>
	);

	return (
		<Layout>
			<CharacterScrollHeader
				name={character.name}
				level={character.level}
				portraitUrl={character.portrait_url}
				hp={{ current: character.hp_current, max: character.hp_max }}
				tempHp={calculateTotalTempHP(characterResources)}
				ac={stats.calculatedStats.armorClass}
				initiative={stats.finalInitiative}
				className={cn(
					"fixed top-16 left-0 right-0 z-50 transform transition-transform duration-300",
					showScrollHeader ? "translate-y-0" : "-translate-y-full",
				)}
			/>
			<div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 py-8">
				{/* Unified Header */}
				{characterHeader}

				{/* Concentration & Conditions */}
				{concentration.state.isConcentrating && (
					<ConcentrationBanner
						isConcentrating={concentration.state.isConcentrating}
						effectName={concentration.state.currentEffect?.name}
						remainingRounds={concentration.state.currentEffect?.remainingRounds}
						onDrop={concentration.drop}
					/>
				)}

				{((characterConditions && characterConditions.length > 0) ||
					character.exhaustion_level > 0) &&
					!isReadOnly && (
						<ConditionBadgeBar
							conditions={characterConditions}
							exhaustionLevel={character.exhaustion_level}
							onClearExhaustion={() =>
								onExhaustionChange(-character.exhaustion_level)
							}
							onAddCondition={onAddCondition}
							onRemoveCondition={onRemoveCondition}
						/>
					)}

				{/* Desktop 3-Column Layout */}
				<div className="hidden md:grid grid-cols-[120px_300px_1fr] gap-8 items-start">
					{/* COLUMN 1: Ability Scores (Vertical) */}
					<aside className="sticky top-16 pt-4 space-y-4">
						<AbilityScoreStrip
							abilities={character.abilities}
							modifiers={stats.calculatedStats.abilityModifiers}
							savingThrowProficiencies={
								character.saving_throw_proficiencies || []
							}
							onRoll={onRollAbility}
						/>
					</aside>

					{/* COLUMN 2: Proficiencies (Vertical) */}
					<aside className="sticky top-16 pt-4 space-y-4 h-[calc(100vh-120px)] overflow-y-auto pr-2 scrollbar-none hover:scrollbar-thin scrollbar-thumb-primary/20">
						<ProficiencySidebar
							saves={stats.calculatedStats.savingThrows}
							skills={stats.skills}
							allSkills={stats.allSkills}
							savingThrowProficiences={
								character.saving_throw_proficiencies || []
							}
							onRollSave={onRollSave}
							onRollSkill={onRollSkill}
							senses={senses}
							defenses={defenses}
						/>
					</aside>

					{/* COLUMN 3: Main Status & Tabs */}
					<div className="flex-1 space-y-6 pt-4">
						{/* Top Status Bar (Desktop Only) */}
						<StatusHeader
							hp={{
								current: character.hp_current,
								max: character.hp_max,
								temp: calculateTotalTempHP(characterResources),
							}}
							ac={stats.calculatedStats.armorClass}
							acBreakdown={stats.armorClassDetail.formula}
							initiative={stats.finalInitiative}
							initiativeBreakdown={`Base Mod: ${getAbilityModifier(stats.finalAbilities.AGI)} | Custom/Sigils: ${stats.finalInitiative - getAbilityModifier(stats.finalAbilities.AGI)}`}
							speed={stats.finalSpeed}
							speedBreakdown={`Base Speed: ${stats.baseStats.speed} | Custom/Sigils/Encumbrance: ${stats.finalSpeed - stats.baseStats.speed}`}
							hitDice={{
								current: character.hit_dice_current,
								max: character.hit_dice_max,
								size: character.hit_dice_size,
							}}
							riftFavor={{
								current: character.rift_favor_current,
								max: character.rift_favor_max,
								die: character.rift_favor_die,
								level: character.level || 1,
							}}
							campaignId={campaignId ?? undefined}
							onRollInitiative={onRollInitiative}
							onRollHitDice={onRollHitDice}
							onHPClick={onHPClick}
							onACClick={onACClick}
							onAdjustResource={onResourceAdjust}
							deathSaves={{
								successes: deathSaves.state.successes,
								failures: deathSaves.state.failures,
								isStable: deathSaves.state.isStable,
								isDead: deathSaves.state.isDead,
								onRoll: deathSaves.rollDeathSave,
								onStabilize: deathSaves.stabilize,
							}}
							characterId={character.id}
						/>

						{/* Interaction Tabs */}
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="bg-obsidian-charcoal/40 border border-primary/20 rounded-[2px] backdrop-blur-md p-4 min-h-[600px]"
						>
							<TabsList className="flex bg-transparent border-b border-primary/10 w-full justify-start gap-6 rounded-none h-12 mb-4 px-2 overflow-x-auto scrollbar-none relative">
								<TabsTrigger
									value="actions"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
								>
									Actions
								</TabsTrigger>
								<TabsTrigger
									value="powers"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
								>
									Abilities
								</TabsTrigger>
								<TabsTrigger
									value="inventory"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
								>
									Items
								</TabsTrigger>
								<TabsTrigger
									value="features"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
								>
									Features
								</TabsTrigger>
								<TabsTrigger
									value="bio"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
								>
									Bio
								</TabsTrigger>
								<TabsTrigger
									value="quests"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
								>
									Notes
								</TabsTrigger>
								<TabsTrigger
									value="extras"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-1 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
								>
									Extras
								</TabsTrigger>
							</TabsList>

							<TabsContent value="actions" className="mt-0 outline-none">
								{actions}
							</TabsContent>
							<TabsContent value="powers" className="mt-0 outline-none">
								{powers}
							</TabsContent>
							<TabsContent value="inventory" className="mt-0 outline-none">
								{inventory}
							</TabsContent>
							<TabsContent value="features" className="mt-0 outline-none">
								{features}
							</TabsContent>
							<TabsContent value="bio" className="mt-0 outline-none">
								{bio}
							</TabsContent>
							<TabsContent value="quests" className="mt-0 outline-none">
								{quests}
							</TabsContent>
							<TabsContent value="extras" className="mt-0 outline-none">
								{extras}
							</TabsContent>
						</Tabs>
					</div>
				</div>

				{/* Mobile Layout (Single Column with Bottom HUD managed by MainLayout) */}
				<div className="md:hidden space-y-6 pb-20">
					<StatusHeader
						hp={{
							current: character.hp_current,
							max: character.hp_max,
							temp: calculateTotalTempHP(characterResources),
						}}
						ac={stats.calculatedStats.armorClass}
						initiative={stats.finalInitiative}
						speed={stats.finalSpeed}
						hitDice={{
							current: character.hit_dice_current,
							max: character.hit_dice_max,
							size: character.hit_dice_size,
						}}
						riftFavor={{
							current: character.rift_favor_current,
							max: character.rift_favor_max,
							die: character.rift_favor_die,
							level: character.level || 1,
						}}
						onRollInitiative={onRollInitiative}
						onRollHitDice={onRollHitDice}
						onHPClick={onHPClick}
						onACClick={onACClick}
						onAdjustResource={onResourceAdjust}
						deathSaves={{
							successes: deathSaves.state.successes,
							failures: deathSaves.state.failures,
							isStable: deathSaves.state.isStable,
							isDead: deathSaves.state.isDead,
							onRoll: deathSaves.rollDeathSave,
							onStabilize: deathSaves.stabilize,
						}}
						characterId={character.id}
					/>

					<Tabs
						value={activeMobileTab}
						onValueChange={setActiveMobileTab}
						className="w-full"
					>
						<TabsList className="flex w-full items-center justify-start gap-8 h-14 bg-obsidian-charcoal/80 border-y border-primary/20 rounded-none sticky top-16 z-20 overflow-x-auto scrollbar-none px-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
							<TabsTrigger
								value="actions"
								className="text-[11px] uppercase font-mono tracking-wider data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full transition-all"
							>
								Combat
							</TabsTrigger>
							<TabsTrigger
								value="powers"
								className="text-[11px] uppercase font-mono tracking-wider data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full transition-all"
							>
								Abilities
							</TabsTrigger>
							<TabsTrigger
								value="inventory"
								className="text-[11px] uppercase font-mono tracking-wider data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full transition-all"
							>
								Items
							</TabsTrigger>
							<TabsTrigger
								value="features"
								className="text-[11px] uppercase font-mono tracking-wider data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full transition-all"
							>
								Feats
							</TabsTrigger>
							<TabsTrigger
								value="stats"
								className="text-[11px] uppercase font-mono tracking-wider data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full transition-all"
							>
								Stats
							</TabsTrigger>
						</TabsList>

						{/* Swipeable Container */}
						<div {...bindMobileGestures()} className="touch-pan-y min-h-[50vh]">
							<TabsContent value="actions">{actions}</TabsContent>
							<TabsContent value="powers">{powers}</TabsContent>
							<TabsContent value="inventory">{inventory}</TabsContent>
							<TabsContent value="features">{features}</TabsContent>
							<TabsContent value="stats" className="space-y-6 pt-4">
								<AbilityScoreStrip
									abilities={character.abilities}
									modifiers={stats.calculatedStats.abilityModifiers}
									savingThrowProficiencies={
										character.saving_throw_proficiencies || []
									}
									onRoll={onRollAbility}
								/>
								<ProficiencySidebar
									saves={stats.calculatedStats.savingThrows}
									skills={stats.skills}
									allSkills={stats.allSkills}
									savingThrowProficiences={
										character.saving_throw_proficiencies || []
									}
									onRollSave={onRollSave}
									onRollSkill={onRollSkill}
								/>
							</TabsContent>
						</div>
					</Tabs>
				</div>

				{/* MODALS */}
				<LevelUpWizardModal
					isOpen={persistentModals.levelUp}
					onClose={() => sheetController.setModal("levelUp", false)}
					characterId={character.id}
				/>
				<DefensesModal
					isOpen={persistentModals.defenses}
					onOpenChange={(open) => sheetController.setModal("defenses", open)}
					resistances={stats.resistances}
					immunities={stats.immunities}
					vulnerabilities={stats.vulnerabilities}
					conditionImmunities={stats.conditionImmunities}
					acBreakdown={stats.armorClassDetail}
					characterId={character.id}
				/>
				<ExportDialog
					open={persistentModals.export}
					onOpenChange={(open) => sheetController.setModal("export", open)}
					character={character}
				/>
				<CharacterEditDialog
					open={persistentModals.edit}
					onOpenChange={(open) => sheetController.setModal("edit", open)}
					character={character}
				/>

				<Dialog
					open={persistentModals.share}
					onOpenChange={(open) => sheetController.setModal("share", open)}
				>
					<DialogContent className="sm:max-w-md bg-obsidian-charcoal/95 border border-primary/20">
						<DialogHeader>
							<DialogTitle className="font-display tracking-widest text-bond-gold">
								Share Ascendant
							</DialogTitle>
							<DialogDescription>
								{shareToken
									? "Anyone with this link can view this Ascendant."
									: "Generate a link to share a read-only view."}
							</DialogDescription>
						</DialogHeader>
						<div className="flex items-center space-x-2 mt-4">
							{shareToken ? (
								<>
									<div className="grid flex-1 gap-2">
										<Input
											id="link"
											defaultValue={shareToken}
											readOnly
											className="bg-black/50 border-primary/20 font-mono text-xs text-primary/80 truncate font-semibold"
											onClick={(e) => (e.target as HTMLInputElement).select()}
										/>
									</div>
									<Button
										type="button"
										size="icon"
										onClick={handleCopyShareLink}
										className="bg-primary/20 hover:bg-primary/30 border border-primary/30"
									>
										<Copy className="h-4 w-4" />
									</Button>
								</>
							) : (
								<Button
									onClick={handleGenerateShareLink}
									disabled={generateShareTokenPending}
									className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary"
								>
									Generate Link
								</Button>
							)}
						</div>
						<DialogFooter className="sm:justify-start">
							<Button
								type="button"
								variant="ghost"
								onClick={() => sheetController.setModal("share", false)}
							>
								Close
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				{/* Detail Drawer - DDB Style */}
				<Sheet
					open={!!selectedDetail}
					onOpenChange={(open: boolean) => !open && setSelectedDetail(null)}
				>
					<SheetContent className="w-full sm:max-w-md bg-obsidian-charcoal/95 backdrop-blur-xl border-l border-primary/20 p-0">
						{selectedDetail && (
							<div className="flex flex-col h-full shadow-[inset_0_0_50px_rgba(var(--primary-rgb),0.1)]">
								<SheetHeader className="p-6 border-b border-primary/10">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-[2px] bg-primary/10 border border-primary/30 flex items-center justify-center">
											{selectedDetail.icon ? (
												(() => {
													const DetailIcon = selectedDetail.icon;
													return (
														<DetailIcon className="w-6 h-6 text-primary" />
													);
												})()
											) : (
												<Shield className="w-6 h-6 text-primary" />
											)}
										</div>
										<SheetTitle className="font-display font-bold tracking-widest text-xl uppercase text-primary">
											{selectedDetail.title}
										</SheetTitle>
									</div>
									<Badge
										variant="outline"
										className="w-fit mt-2 border-primary/20 text-xs text-primary/60"
									>
										{selectedDetail.type}
									</Badge>
								</SheetHeader>
								<div className="flex-1 overflow-y-auto p-6 space-y-6">
									<div className="text-sm font-heading leading-relaxed text-foreground/90 space-y-4">
										<AutoLinkText text={selectedDetail.description} />
									</div>
									{/* Roll Buttons / Actions would go here if provided in payload */}
								</div>
								<div className="p-6 border-t border-primary/10 bg-black/20">
									<Button
										variant="outline"
										className="w-full border-primary/30 hover:bg-primary/10"
										onClick={() => setSelectedDetail(null)}
									>
										CLOSE PANEL
									</Button>
								</div>
							</div>
						)}
					</SheetContent>
				</Sheet>
			</div>
		</Layout>
	);
}
