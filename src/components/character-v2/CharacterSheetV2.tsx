import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useDrag } from "@use-gesture/react";
import type { LucideIcon } from "lucide-react";
import {
	BarChart3,
	Copy,
	Crown,
	Ghost,
	LayoutGrid,
	Package,
	Palette,
	Printer,
	Redo2,
	ScrollText,
	Shield,
	Sparkles,
	Sun,
	Swords,
	Undo2,
	User,
	Wand2,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ConcentrationBanner } from "@/components/CharacterSheet/ConcentrationBanner";
import { ConditionBadgeBar } from "@/components/CharacterSheet/ConditionBadgeBar";
import { DefensesModal } from "@/components/CharacterSheet/DefensesModal";
import { HealthDialog } from "@/components/CharacterSheet/HealthDialog";
import { ShortRestDialog } from "@/components/CharacterSheet/ShortRestDialog";
import { ActionsList } from "@/components/character/ActionsList";
import { CharacterBackupPanel } from "@/components/character/CharacterBackupPanel";
import { CharacterDetailRollsPanel } from "@/components/character/CharacterDetailRollsPanel";
import { CharacterEditDialog } from "@/components/character/CharacterEditDialog";
import { CharacterExtrasPanel } from "@/components/character/CharacterExtrasPanel";
import { CurrencyManager } from "@/components/character/CurrencyManager";
import { CustomActionsList } from "@/components/character/CustomActionsList";
import { CustomSkillsList } from "@/components/character/CustomSkillsList";
import { EquipmentList } from "@/components/character/EquipmentList";
import { ExportDialog } from "@/components/character/ExportDialog";
import { FeatureChoicesPanel } from "@/components/character/FeatureChoicesPanel";
import { FeaturesList } from "@/components/character/FeaturesList";
import { HomebrewFeatureApplicator } from "@/components/character/HomebrewFeatureApplicator";
import { InlineSectionNote } from "@/components/character/InlineSectionNote";
import { JobResourcePools } from "@/components/character/JobResourcePools";
import { JournalPanel } from "@/components/character/JournalPanel";
import { LanguagesPanel } from "@/components/character/LanguagesPanel";
import { LevelUpWizardModal } from "@/components/character/LevelUpWizardModal";
import { LimitedUseAggregator } from "@/components/character/LimitedUseAggregator";
import {
	type PartyInventoryItem,
	PartyInventoryPanel,
} from "@/components/character/PartyInventoryPanel";
import { PathFeaturesDisplay } from "@/components/character/PathFeaturesDisplay";
import { RegentFeaturesDisplay } from "@/components/character/RegentFeaturesDisplay";
import { RegentUnlocksPanel } from "@/components/character/RegentUnlocksPanel";
import { RollHistoryPanel } from "@/components/character/RollHistoryPanel";
import { RunesList } from "@/components/character/RunesList";
import { ShadowSoldiersPanel } from "@/components/character/ShadowSoldiersPanel";
import { SheetThemeDialog } from "@/components/character/SheetThemeDialog";
import { SpellSlotsDisplay } from "@/components/character/SpellSlotsDisplay";
import { TattoosList } from "@/components/character/TattoosList";
import { ToolProficienciesPanel } from "@/components/character/ToolProficienciesPanel";
import { VehiclesPanel } from "@/components/character/VehiclesPanel";
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
import {
	buildSheetThemeStyle,
	DEFAULT_SHEET_THEME_ID,
	getSheetTheme,
} from "@/data/sheetThemes";
import { useCharacterPageModel } from "@/hooks/useCharacterPageModel";
import { useEquipment } from "@/hooks/useEquipment";
import { type RegentUnlock, useRegentUnlocks } from "@/hooks/useRegentUnlocks";
import type { Json } from "@/integrations/supabase/types";
import {
	getAbilityModifier,
	getProficiencyBonus,
	getRiftFavorDie,
	getRiftFavorMax,
} from "@/lib/characterCalculations";
import { calculateTotalTempHP } from "@/lib/characterResources";
import {
	checkLevelUpEligibility,
	getXPProgress,
	type LevelingType,
} from "@/lib/experience";
import { applyDamage, applyHealing } from "@/lib/hpAdjustments";
import { cn } from "@/lib/utils";
import { QuestLog } from "@/pages/ascendant-tools/QuestLog";
import { useCharacterSheetUiStore } from "@/stores/characterSheetUiStore";
import type { DetailData } from "@/types/character";
import type { AbilityScore } from "@/types/core-rules";
import { AbilityScoreStrip } from "./AbilityScoreStrip";
import { CharacterScrollHeader } from "./CharacterScrollHeader";
import { ProficiencySidebar } from "./ProficiencySidebar";
import { StatusHeader } from "./StatusHeader";

// DDB-style mobile section selector: a grid of tappable "boxes" (icon + label),
// no horizontal scroll. Order must match the `mobileTabs` swipe array.
const MOBILE_SECTIONS: { value: string; label: string; icon: LucideIcon }[] = [
	{ value: "actions", label: "Combat", icon: Swords },
	{ value: "powers", label: "Abilities", icon: Wand2 },
	{ value: "inventory", label: "Items", icon: Package },
	{ value: "features", label: "Feats", icon: Sparkles },
	{ value: "bio", label: "Bio", icon: User },
	{ value: "quests", label: "Notes", icon: ScrollText },
	{ value: "extras", label: "Extras", icon: LayoutGrid },
	{ value: "stats", label: "Stats", icon: BarChart3 },
];

// CharacterSheetV2 is now the single authoritative page component.

export default function CharacterSheetV2() {
	const pm = useCharacterPageModel();

	const {
		character,
		memoizedStats,
		characterResources,
		characterConditions,
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
		handleAddCondition,
		handleRemoveCondition,
		handleExhaustionChange,
		ascendantTools,
		concentration,
		deathSaves,
		undoRedo,
	} = pm;

	// DDB advantage/disadvantage applied to d20 checks/saves/skills/initiative.
	const [rollMode, setRollMode] = useState<
		"normal" | "advantage" | "disadvantage"
	>("normal");

	const { addEquipment } = useEquipment(character?.id ?? "");
	const [invView, setInvView] = useState<"my" | "party">("my");
	const handleClaimPartyItem = async (item: PartyInventoryItem) => {
		if (!character) return;
		await addEquipment({
			character_id: character.id,
			name: item.name,
			item_type: "gear",
			description: item.notes ?? null,
			properties: [],
			quantity: item.quantity ?? 1,
		});
	};

	const {
		ui: { modals: persistentModals },
	} = sheetController.state;

	const internalMobileTab = useCharacterSheetUiStore(
		(s) => s.internalMobileTab,
	);
	const setInternalMobileTab = useCharacterSheetUiStore(
		(s) => s.setInternalMobileTab,
	);
	const activeMobileTab = activeTab || internalMobileTab;
	const setActiveMobileTab = setActiveTab || setInternalMobileTab;

	// Regent Unlocks for display
	const { unlocks: regentUnlocks = [] } = useRegentUnlocks(character?.id || "");
	const primaryRegent =
		regentUnlocks.find((u: RegentUnlock) => u.is_primary) || regentUnlocks[0];

	// Detail Drawer State (ephemeral UI store)
	const selectedDetail = useCharacterSheetUiStore((s) => s.selectedDetail);
	const setSelectedDetail = useCharacterSheetUiStore(
		(s) => s.setSelectedDetail,
	);

	// Scroll Header Visibility State (ephemeral UI store)
	const showScrollHeader = useCharacterSheetUiStore((s) => s.showScrollHeader);
	const setShowScrollHeader = useCharacterSheetUiStore(
		(s) => s.setShowScrollHeader,
	);
	const themeDialogOpen = useCharacterSheetUiStore((s) => s.themeDialogOpen);
	const setThemeDialogOpen = useCharacterSheetUiStore(
		(s) => s.setThemeDialogOpen,
	);
	// Q1 of Round 3 — live theme preview. Overrides the persisted
	// character theme values while the SheetThemeDialog is open.
	const themePreview = useCharacterSheetUiStore((s) => s.themePreview);
	const setThemePreview = useCharacterSheetUiStore((s) => s.setThemePreview);

	// R2 of Round 2 — auto-push character snapshots so Undo/Redo has a
	// trail. We push on every `character` ref change (post update success).
	useEffect(() => {
		if (character && undoRedo) {
			undoRedo.pushState(character, "Auto-snapshot");
		}
		// `character` reference identity changes on each successful update;
		// `undoRedo.pushState` is stable per useCallback.
	}, [character, undoRedo]);

	// R2 — global Ctrl+Z / Ctrl+Shift+Z shortcuts inside the sheet.
	useEffect(() => {
		if (!undoRedo) return;
		const handler = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			// Skip when typing in an input/textarea/contenteditable.
			if (
				target &&
				(target.tagName === "INPUT" ||
					target.tagName === "TEXTAREA" ||
					target.isContentEditable)
			) {
				return;
			}
			const isMod = e.ctrlKey || e.metaKey;
			if (!isMod || (e.key !== "z" && e.key !== "Z")) return;
			e.preventDefault();
			if (e.shiftKey) {
				const restored = undoRedo.redo();
				if (restored) {
					updateCharacter.mutate({ id: restored.id, data: restored });
				}
			} else {
				const restored = undoRedo.undo();
				if (restored) {
					updateCharacter.mutate({ id: restored.id, data: restored });
				}
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [undoRedo, updateCharacter]);

	useEffect(() => {
		const handleScroll = () => {
			// Show header after scrolling past the main header (approx 400px)
			setShowScrollHeader(window.scrollY > 400);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [setShowScrollHeader]);

	const onSelectDetail = (
		detail: DetailData,
		type: string,
		icon: LucideIcon,
	) => {
		setSelectedDetail({ ...detail, type, icon });
	};

	const mobileTabs = [
		"actions",
		"powers",
		"inventory",
		"features",
		"bio",
		"quests",
		"extras",
		"stats",
	];
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
				leveling_type?: LevelingType;
			} & Record<string, Json>) || {}
		: {};
	const levelingType: LevelingType =
		(characterState.leveling_type as LevelingType) || "xp";
	const xpProgress = character
		? getXPProgress(character.experience || 0)
		: { current: 0, next: 300, percent: 0 };
	// P1.11: XP threshold eligibility — surface a "Level Up Available" cue
	// when accumulated XP has crossed the next-level threshold (XP mode only).
	// Does not auto-promote — the player still gates the decision via the
	// Level Up wizard, matching DDB behavior.
	const levelUpEligibility = character
		? checkLevelUpEligibility(
				character.level || 1,
				character.experience || 0,
				levelingType,
			)
		: { canLevelUp: false, availableLevel: 1, currentLevel: 1, xpToNext: 0 };

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

	// Single source of truth for displayed/clamped HP max: the engine output
	// (override-aware base + gestalt Regent HP + custom modifiers). NEVER the
	// raw `effectiveHpMax` cache column — that is the authoritative base only
	// and omits gestalt/override/custom (see getEffectiveHpMax / audit D1-D2).
	const effectiveHpMax = stats.calculatedStats.hpMax;

	const onRollAbility = (ability: AbilityScore) =>
		rollAndRecord({
			title: `${ability} Check`,
			formula: "1d20",
			rollType: "ability",
			advantage: rollMode,
			context: `${ability} ability check`,
			modifier: getAbilityModifier(stats.finalAbilities[ability]),
		});

	const onRollSave = (ability: AbilityScore) =>
		rollAndRecord({
			title: `${ability} Save`,
			formula: "1d20",
			rollType: "save",
			advantage: rollMode,
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
			advantage: rollMode,
			context: `${skill} skill check`,
			modifier,
		});
	};

	const onRollInitiative = () =>
		rollAndRecord({
			title: "Initiative",
			formula: "1d20",
			rollType: "initiative",
			advantage: rollMode,
			context: "Initiative roll",
			modifier: stats.finalInitiative,
		});

	const onRollHitDice = () => {
		// DDB parity: use the character's actual hit die size, not a
		// hardcoded d8. Destroyer = d12, Mage = d6, etc.
		const dieSize = character.hit_dice_size || 8;
		rollAndRecord({
			title: "Hit Dice",
			formula: `1d${dieSize}`,
			rollType: "hit_dice",
			context: "Hit Dice roll",
			modifier: getAbilityModifier(stats.finalAbilities.VIT),
		});
	};

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
		if (amount <= 0) return;

		// Pure-logic damage resolution (THP-aware, massive-damage aware).
		// Note: tempHp here is intentionally 0 — the THP pool is tracked in
		// `character_sheet_state.resources.temp_hp_sources` and is consumed
		// by the HealthDialog component via `addTemporaryHP`. The page-level
		// damage button doesn't read it; UI parity with the existing flow.
		const result = applyDamage({
			hpCurrent: character.hp_current,
			hpMax: effectiveHpMax,
			tempHp: 0,
			damage: amount,
		});

		updateCharacter.mutate({
			id: character.id,
			data: { hp_current: result.newHp },
		});

		ascendantTools
			.trackHealthChange(character.id, amount, "damage")
			.catch(console.error);

		// D&D Beyond parity for downed/dying characters:
		//  - Damage while AT 0 HP: 1 death save failure per hit (or instant
		//    death on massive damage = damage >= max HP).
		//  - Damage going FROM positive to 0: only triggers instant death if
		//    overflow >= max HP (RAW massive-damage rule). Otherwise the
		//    character is simply unconscious — no failure yet.
		if (result.wasAtZero) {
			deathSaves.takeDamageAtZero(amount, effectiveHpMax);
		} else if (result.massiveDamage) {
			deathSaves.takeDamageAtZero(result.overflowDamage, effectiveHpMax);
		}

		// Process concentration check (advantage/disadvantage applied by
		// useCharacterPageModel from custom-modifier resolution).
		const concentrationResult = concentration.takeDamage(amount);
		if (concentrationResult?.concentrationLost) {
			// Note: useConcentration auto-clears in-memory state and fires the
			// onConcentrationLost analytics event. The ConcentrationBanner
			// re-renders from concentration.state.isConcentrating.
			import("@/hooks/use-toast").then(({ toast }) => {
				toast({
					title: "Concentration Lost!",
					description: `Failed VIT save (${concentrationResult.total} vs DC ${concentrationResult.dc}). ${concentrationResult.spellName} dropped.`,
					variant: "destructive",
				});
			});
		} else if (concentrationResult && !concentrationResult.concentrationLost) {
			import("@/hooks/use-toast").then(({ toast }) => {
				toast({
					title: "Concentration Maintained",
					description: `Succeeded VIT save (${concentrationResult.total} vs DC ${concentrationResult.dc}).`,
				});
			});
		}
	};

	const handleHeal = (amount: number) => {
		if (amount <= 0) return;

		const result = applyHealing({
			hpCurrent: character.hp_current,
			hpMax: effectiveHpMax,
			heal: amount,
		});

		updateCharacter.mutate({
			id: character.id,
			data: { hp_current: result.newHp },
		});

		ascendantTools
			.trackHealthChange(character.id, amount, "healing")
			.catch(console.error);

		// D&D Beyond parity: any healing while at 0 HP restores consciousness
		// and resets death saves (RAW: "If a healing spell or similar effect
		// first restores you to 1 or more hit points...").
		if (result.wasAtZero && result.newHp > 0) {
			deathSaves.receiveHealing();
		}
	};

	// We pass down specific native actions/elements rather than taking them from props!
	const actions = (
		<div className="space-y-6">
			<ActionsList
				characterId={character.id}
				campaignId={campaignId ?? undefined}
				onSelectDetail={(detail) => onSelectDetail(detail, "Action", Swords)}
				attacksPerAction={stats.attacksPerAction}
			/>
			<CustomActionsList
				characterId={character.id}
				stats={stats.calculatedStats}
				abilities={stats.finalAbilities}
				readOnly={isReadOnly}
			/>
		</div>
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
	const sectionNotes = sheetController.state.ui.sectionNotes || {};
	const handleSectionNote = (
		section: Parameters<typeof sheetController.setSectionNote>[0],
		value: string,
	) => sheetController.setSectionNote(section, value);

	const inventory = (
		<div className="space-y-6">
			<div className="flex gap-2">
				<Button
					variant={invView === "my" ? "default" : "outline"}
					size="sm"
					onClick={() => setInvView("my")}
				>
					My Inventory
				</Button>
				<Button
					variant={invView === "party" ? "default" : "outline"}
					size="sm"
					onClick={() => setInvView("party")}
				>
					Party Inventory
				</Button>
			</div>
			{invView === "my" ? (
				<>
					<EquipmentList
						characterId={character.id}
						onSelectDetail={(detail) => onSelectDetail(detail, "Item", Shield)}
					/>
					<InlineSectionNote
						section="equipment"
						label="Inventory"
						value={sectionNotes.equipment ?? ""}
						onChange={(v) => handleSectionNote("equipment", v)}
						readOnly={isReadOnly}
					/>
					<TattoosList
						characterId={character.id}
						onSelectDetail={(detail) =>
							onSelectDetail(detail, "Tattoo", Sparkles)
						}
					/>
					<CurrencyManager characterId={character.id} />
				</>
			) : (
				<PartyInventoryPanel
					campaignId={campaignId ?? null}
					characterName={character.name}
					readOnly={isReadOnly}
					onClaim={handleClaimPartyItem}
				/>
			)}
		</div>
	);
	const features = (
		<div className="space-y-6">
			<FeaturesList
				characterId={character.id}
				onSelectDetail={(detail) => onSelectDetail(detail, "Feature", Zap)}
			/>
			<InlineSectionNote
				section="features"
				label="Features & Traits"
				value={sectionNotes.features ?? ""}
				onChange={(v) => handleSectionNote("features", v)}
				readOnly={isReadOnly}
			/>
			<FeatureChoicesPanel characterId={character.id} />
			<HomebrewFeatureApplicator characterId={character.id} />
			<PathFeaturesDisplay
				characterId={character.id}
				onSelectDetail={(detail) => onSelectDetail(detail, "Path", Sparkles)}
			/>
			<RegentFeaturesDisplay
				characterId={character.id}
				characterLevel={character.level || 1}
				regentId={primaryRegent?.regent_id}
				// Gestalt: a Regent is a full class overlay leveling alongside the
				// Job — regent level == character level (not a fixed subclass tier).
				regentLevel={character.level || 1}
				onSelectDetail={(detail) => onSelectDetail(detail, "Regent", Crown)}
			/>
			<RegentUnlocksPanel characterId={character.id} />
			<LimitedUseAggregator characterId={character.id} />
			<LanguagesPanel characterId={character.id} />
			<ToolProficienciesPanel characterId={character.id} />
			<RunesList
				characterId={character.id}
				campaignId={campaignId ?? undefined}
				onSelectDetail={(detail) => onSelectDetail(detail, "Rune", Sparkles)}
			/>
		</div>
	);
	const bio = (
		<>
			<JournalPanel characterId={character.id} />
			<InlineSectionNote
				section="description"
				label="Description"
				value={sectionNotes.description ?? ""}
				onChange={(v) => handleSectionNote("description", v)}
				readOnly={isReadOnly}
			/>
			<InlineSectionNote
				section="notes"
				label="Freeform Notes"
				value={sectionNotes.notes ?? ""}
				onChange={(v) => handleSectionNote("notes", v)}
				readOnly={isReadOnly}
			/>
			<CharacterBackupPanel characterId={character.id} />
			<RollHistoryPanel characterId={character.id} />
		</>
	);
	const quests = <QuestLog characterId={character.id} />;
	const extras = (
		<>
			<CharacterExtrasPanel characterId={character.id} />
			<VehiclesPanel characterId={character.id} readOnly={isReadOnly} />
			<ShadowSoldiersPanel
				characterId={character.id}
				characterLevel={character.level || 1}
				campaignId={campaignId ?? undefined}
				onSelectDetail={(detail) => onSelectDetail(detail, "Shadow", Ghost)}
			/>
			<JobResourcePools characterId={character.id} />
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
					<div className="p-4 flex flex-wrap items-center gap-3 bg-primary/5 w-full md:w-auto md:min-w-[200px]">
						<HealthDialog
							isOpen={persistentModals.health}
							onOpenChange={(open) => sheetController.setModal("health", open)}
							hpCurrent={character.hp_current}
							hpMax={effectiveHpMax}
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
							hpMax={effectiveHpMax}
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
						<Button
							variant="default"
							size="sm"
							onClick={() => {
								if (typeof navigator !== "undefined" && navigator.vibrate)
									navigator.vibrate([10, 30, 10]); // Multi-pulse for importance
								onLevelUp();
							}}
							title={
								levelUpEligibility.canLevelUp
									? `Level Up available — enough XP for level ${levelUpEligibility.availableLevel}`
									: undefined
							}
							className={`relative h-8 uppercase font-mono text-[10px] tracking-widest ${
								levelUpEligibility.canLevelUp
									? "shadow-[0_0_22px_rgba(var(--primary),0.6)] animate-pulse"
									: "shadow-[0_0_15px_rgba(var(--primary),0.3)]"
							}`}
						>
							<Zap className="w-3 h-3 mr-1.5" />
							{character.level >= 20 ? "Manage Level" : "Level Up"}
							{levelUpEligibility.canLevelUp && (
								<span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
									<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
								</span>
							)}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setThemeDialogOpen(true)}
							className="h-8 border-primary/20 bg-black/20 hover:bg-primary/10 transition-colors uppercase font-mono text-[10px] tracking-widest"
							data-testid="sheet-customize-btn"
							title="Customize sheet theme + backdrop"
							aria-label="Customize sheet appearance"
						>
							<Palette className="w-3 h-3 mr-1.5 text-fuchsia-300" />
							Customize
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								const restored = undoRedo?.undo();
								if (restored)
									updateCharacter.mutate({ id: restored.id, data: restored });
							}}
							disabled={!undoRedo?.canUndo()}
							className="h-8 border-primary/20 bg-black/20 hover:bg-primary/10 transition-colors uppercase font-mono text-[10px] tracking-widest"
							data-testid="sheet-undo-btn"
							title="Undo (Ctrl+Z)"
							aria-label="Undo last sheet change"
						>
							<Undo2 className="w-3 h-3 mr-1.5" />
							Undo
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								const restored = undoRedo?.redo();
								if (restored)
									updateCharacter.mutate({ id: restored.id, data: restored });
							}}
							disabled={!undoRedo?.canRedo()}
							className="h-8 border-primary/20 bg-black/20 hover:bg-primary/10 transition-colors uppercase font-mono text-[10px] tracking-widest"
							data-testid="sheet-redo-btn"
							title="Redo (Ctrl+Shift+Z)"
							aria-label="Redo last sheet change"
						>
							<Redo2 className="w-3 h-3 mr-1.5" />
							Redo
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								if (typeof window !== "undefined") window.print();
							}}
							className="h-8 border-primary/20 bg-black/20 hover:bg-primary/10 transition-colors uppercase font-mono text-[10px] tracking-widest"
							data-testid="sheet-print-btn"
							title="Print sheet"
							aria-label="Print character sheet"
						>
							<Printer className="w-3 h-3 mr-1.5" />
							Print
						</Button>
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
				hp={{ current: character.hp_current, max: effectiveHpMax }}
				tempHp={calculateTotalTempHP(characterResources)}
				ac={stats.calculatedStats.armorClass}
				initiative={stats.finalInitiative}
				proficiencyBonus={getProficiencyBonus(character.level || 1)}
				className={cn(
					"fixed top-16 left-0 right-0 z-50 transform transition-transform duration-300",
					showScrollHeader ? "translate-y-0" : "-translate-y-full",
				)}
			/>
			<div
				className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 py-8 sheet-themed-root"
				data-sheet-theme={
					themePreview?.sheet_theme ??
					((character as { sheet_theme?: string | null }).sheet_theme ||
						DEFAULT_SHEET_THEME_ID)
				}
				data-sheet-preview={themePreview ? "true" : undefined}
				style={(() => {
					// Q1 of Round 3 — themePreview wins over persisted values so
					// the sheet renders the in-progress theme live while the
					// dialog is open. Cleared on dialog close.
					const themeId =
						themePreview?.sheet_theme ??
						((character as { sheet_theme?: string | null }).sheet_theme ||
							DEFAULT_SHEET_THEME_ID);
					const accent =
						themePreview?.sheet_accent ??
						((character as { sheet_accent?: string | null }).sheet_accent ||
							null);
					const backdrop =
						themePreview?.sheet_backdrop ??
						((character as { sheet_backdrop?: string | null }).sheet_backdrop ||
							null);
					const base = buildSheetThemeStyle(getSheetTheme(themeId), accent);
					if (backdrop) {
						return {
							...base,
							backgroundImage: `linear-gradient(rgba(8,8,12,0.85), rgba(8,8,12,0.92)), url('${backdrop}')`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
							backgroundAttachment: "fixed",
						};
					}
					return base;
				})()}
			>
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
								handleExhaustionChange(-character.exhaustion_level)
							}
							onAddCondition={handleAddCondition}
							onRemoveCondition={handleRemoveCondition}
						/>
					)}

				{!isReadOnly && (
					<div className="flex items-center gap-2 flex-wrap">
						<span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
							Roll Mode
						</span>
						{(["normal", "advantage", "disadvantage"] as const).map((m) => (
							<button
								key={m}
								type="button"
								onClick={() => setRollMode(m)}
								className={cn(
									"min-h-[32px] px-3 rounded border text-[10px] font-mono uppercase tracking-wider transition-colors",
									rollMode === m
										? m === "advantage"
											? "border-green-500 bg-green-500/15 text-green-400"
											: m === "disadvantage"
												? "border-red-500 bg-red-500/15 text-red-400"
												: "border-primary bg-primary/15 text-primary"
										: "border-primary/15 text-muted-foreground hover:border-primary/40",
								)}
							>
								{m === "normal" ? "Normal" : m === "advantage" ? "Adv" : "Dis"}
							</button>
						))}
					</div>
				)}

				{/* Desktop 3-Column Layout */}
				<div className="hidden md:grid grid-cols-[120px_300px_1fr] gap-8 items-start">
					{/* COLUMN 1: Ability Scores (Vertical) */}
					<aside className="sticky top-16 pt-4 space-y-4 max-h-[calc(100dvh-120px)] overflow-y-auto pr-1 scrollbar-none hover:scrollbar-thin scrollbar-thumb-primary/20">
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
					<aside className="sticky top-16 pt-4 space-y-4 max-h-[calc(100dvh-120px)] overflow-y-auto pr-2 scrollbar-none hover:scrollbar-thin scrollbar-thumb-primary/20">
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
						<CustomSkillsList
							characterId={character.id}
							abilities={stats.finalAbilities}
							proficiencyBonus={getProficiencyBonus(character.level || 1)}
							readOnly={isReadOnly}
							onRoll={(skill, modifier) => {
								rollAndRecord({
									title: `${skill.name} (Custom)`,
									formula: "1d20",
									rollType: "skill_check",
									context: `Custom skill: ${skill.name}`,
									modifier,
								});
							}}
						/>
					</aside>

					{/* COLUMN 3: Main Status & Tabs */}
					<div className="flex-1 space-y-6 pt-4">
						{/* Top Status Bar (Desktop Only) */}
						<StatusHeader
							hp={{
								current: character.hp_current,
								max: effectiveHpMax,
								temp: calculateTotalTempHP(characterResources),
							}}
							ac={stats.calculatedStats.armorClass}
							acBreakdown={stats.armorClassDetail.formula}
							initiative={stats.finalInitiative}
							initiativeBreakdown={`Base Mod: ${getAbilityModifier(stats.finalAbilities.AGI)} | Custom/Sigils: ${stats.finalInitiative - getAbilityModifier(stats.finalAbilities.AGI)}`}
							speed={stats.finalSpeed}
							speedBreakdown={`Base Speed: ${stats.baseStats.speed} | Custom/Sigils/Encumbrance: ${stats.finalSpeed - stats.baseStats.speed}`}
							proficiencyBonus={getProficiencyBonus(character.level || 1)}
							characterLevel={character.level || 1}
							hitDice={{
								current: character.hit_dice_current,
								max: character.hit_dice_max,
								size: character.hit_dice_size,
							}}
							riftFavor={{
								current: character.rift_favor_current,
								max: getRiftFavorMax(character.level || 1),
								die: getRiftFavorDie(character.level || 1),
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
							<TabsList className="flex bg-transparent border-b border-primary/10 w-full justify-start gap-1 rounded-none h-12 mb-4 px-2 relative">
								<TabsTrigger
									value="actions"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-3 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
								>
									Actions
								</TabsTrigger>
								<TabsTrigger
									value="powers"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-3 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
								>
									Abilities
								</TabsTrigger>
								<TabsTrigger
									value="inventory"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-3 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
								>
									Items
								</TabsTrigger>
								<TabsTrigger
									value="features"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-3 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
								>
									Features
								</TabsTrigger>
								<TabsTrigger
									value="bio"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-3 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
								>
									Bio
								</TabsTrigger>
								<TabsTrigger
									value="quests"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-3 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
								>
									Notes
								</TabsTrigger>
								<TabsTrigger
									value="extras"
									className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-3 uppercase font-mono text-xs tracking-widest transition-all hover:text-primary/70"
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
							max: effectiveHpMax,
							temp: calculateTotalTempHP(characterResources),
						}}
						ac={stats.calculatedStats.armorClass}
						initiative={stats.finalInitiative}
						speed={stats.finalSpeed}
						proficiencyBonus={getProficiencyBonus(character.level || 1)}
						characterLevel={character.level || 1}
						hitDice={{
							current: character.hit_dice_current,
							max: character.hit_dice_max,
							size: character.hit_dice_size,
						}}
						riftFavor={{
							current: character.rift_favor_current,
							max: getRiftFavorMax(character.level || 1),
							die: getRiftFavorDie(character.level || 1),
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
						<TabsPrimitive.List className="grid grid-cols-4 gap-2 w-full mb-2">
							{MOBILE_SECTIONS.map(({ value, label, icon: Icon }) => (
								<TabsPrimitive.Trigger
									key={value}
									value={value}
									className={cn(
										"flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-md border px-1 py-2 text-[10px] font-mono uppercase tracking-wide transition-colors",
										"border-primary/15 text-muted-foreground hover:border-primary/40 hover:text-foreground",
										"data-[state=active]:border-primary data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_12px_hsl(var(--primary)/0.25)]",
										"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50",
									)}
								>
									<Icon className="w-4 h-4 shrink-0" />
									<span className="leading-none">{label}</span>
								</TabsPrimitive.Trigger>
							))}
						</TabsPrimitive.List>

						{/* Swipeable Container */}
						<div {...bindMobileGestures()} className="touch-pan-y min-h-[50vh]">
							<TabsContent value="actions">{actions}</TabsContent>
							<TabsContent value="powers">{powers}</TabsContent>
							<TabsContent value="inventory">{inventory}</TabsContent>
							<TabsContent value="features">{features}</TabsContent>
							<TabsContent value="bio">{bio}</TabsContent>
							<TabsContent value="quests">{quests}</TabsContent>
							<TabsContent value="extras">{extras}</TabsContent>
							<TabsContent value="stats" className="space-y-6 pt-4">
								<AbilityScoreStrip
									abilities={character.abilities}
									modifiers={stats.calculatedStats.abilityModifiers}
									savingThrowProficiencies={
										character.saving_throw_proficiencies || []
									}
									onRoll={onRollAbility}
									variant="grid"
								/>
								<ProficiencySidebar
									variant="panel"
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
					sigilTraits={stats.finalTraits}
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
				<SheetThemeDialog
					open={themeDialogOpen}
					onOpenChange={setThemeDialogOpen}
					onPreviewChange={setThemePreview}
					character={{
						id: character.id,
						sheet_theme:
							(character as { sheet_theme?: string | null }).sheet_theme ??
							null,
						sheet_backdrop:
							(character as { sheet_backdrop?: string | null })
								.sheet_backdrop ?? null,
						sheet_accent:
							(character as { sheet_accent?: string | null }).sheet_accent ??
							null,
					}}
					onSave={async (patch) => {
						await new Promise<void>((resolve, reject) => {
							updateCharacter.mutate(
								{
									id: character.id,
									data: patch as unknown as Parameters<
										typeof updateCharacter.mutate
									>[0]["data"],
								},
								{
									onSuccess: () => resolve(),
									onError: (err) => reject(err),
								},
							);
						});
					}}
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
									<CharacterDetailRollsPanel
										payload={selectedDetail.payload}
										type={selectedDetail.type}
									/>
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
