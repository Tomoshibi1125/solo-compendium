import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	ArrowLeft,
	Check,
	Copy,
	Download,
	Edit,
	Redo2,
	Share2,
	SlidersHorizontal,
	Undo2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Link,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";
import { AttunementSlots } from "@/components/CharacterSheet/AttunementSlots";
import { DefensesModal } from "@/components/CharacterSheet/DefensesModal";
import {
	type SpellEntry,
	SpellPanel,
	type SpellSlotDisplay,
} from "@/components/CharacterSheet/SpellPanel";
import { ActionsList } from "@/components/character/ActionsList";
import { CharacterBackupPanel } from "@/components/character/CharacterBackupPanel";
import { CharacterEditDialog } from "@/components/character/CharacterEditDialog";
import { CharacterExtrasPanel } from "@/components/character/CharacterExtrasPanel";
import { CharacterRollsPanel } from "@/components/character/CharacterRollsPanel";
import { CurrencyManager } from "@/components/character/CurrencyManager";
import { EquipmentList } from "@/components/character/EquipmentList";
import { ExportDialog } from "@/components/character/ExportDialog";
import { FeatureChoicesPanel } from "@/components/character/FeatureChoicesPanel";
import { FeaturesList } from "@/components/character/FeaturesList";
import { HomebrewFeatureApplicator } from "@/components/character/HomebrewFeatureApplicator";
import { JournalPanel } from "@/components/character/JournalPanel";
import { LevelUpWizardModal } from "@/components/character/LevelUpWizardModal";
import { PortraitUpload } from "@/components/character/PortraitUpload";
import { PowersList } from "@/components/character/PowersList";
import { RegentFeaturesDisplay } from "@/components/character/RegentFeaturesDisplay";
import { RegentUnlocksPanel } from "@/components/character/RegentUnlocksPanel";
import { RichTextNotes } from "@/components/character/RichTextNotes";
import { RollHistoryPanel } from "@/components/character/RollHistoryPanel";
import { RunesList } from "@/components/character/RunesList";
import { ShadowSoldiersPanel } from "@/components/character/ShadowSoldiersPanel";
import { SpellSlotsDisplay } from "@/components/character/SpellSlotsDisplay";
import { CharacterSheetV2 } from "@/components/character-v2/CharacterSheetV2";
import { Layout } from "@/components/layout/Layout";
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
import { Label } from "@/components/ui/label";
import { SystemText } from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCampaignByCharacterId } from "@/hooks/useCampaigns";
import { useAutoBackup } from "@/hooks/useCharacterBackup";
import { useCharacterDerivedStats } from "@/hooks/useCharacterDerivedStats";
import {
	featureModifiersToCustomModifiers,
	useCharacterFeatures,
} from "@/hooks/useCharacterFeatures";
import { useCharacterSheetState } from "@/hooks/useCharacterSheetState";
import {
	type CharacterWithAbilities,
	useCharacter,
	useGenerateShareToken,
	useUpdateCharacter,
} from "@/hooks/useCharacters";
import { useCharacterUndoRedo } from "@/hooks/useCharacterUndoRedo";
import { useConcentration } from "@/hooks/useConcentration";
import { useDeathSaves } from "@/hooks/useDeathSaves";
import { useEquipment } from "@/hooks/useEquipment";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { usePowers } from "@/hooks/usePowers";
import { useRealtimeCollaboration } from "@/hooks/useRealtimeCollaboration";
import { useRegentUnlocks } from "@/hooks/useRegentUnlocks";
import { useRecordRoll } from "@/hooks/useRollHistory";
import { useCharacterRuneInscriptions } from "@/hooks/useRunes";
import { useCharacterSigilInscriptions } from "@/hooks/useSigils";
import { useSpellCasting } from "@/hooks/useSpellCasting";
import { useSpellSlots } from "@/hooks/useSpellSlots";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { getLevelingMode } from "@/lib/campaignSettings";
import { getSpellcastingAbility } from "@/lib/characterCalculations";
import {
	addTemporaryHP,
	applyResourceRest,
	type CharacterResources,
	calculateTotalTempHP,
} from "@/lib/characterResources";
import {
	applyCondition,
	type ConditionEntry,
	getActiveConditionNames,
	migrateLegacyConditions,
	removeCondition,
} from "@/lib/conditionSystem";
import { normalizeCustomModifiers } from "@/lib/customModifiers";
import { formatRollResult, rollDiceString } from "@/lib/diceRoller";
import { isLocalCharacterId } from "@/lib/guestStore";
import type { AdvantageState } from "@/lib/rollAdvantage";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
import { formatRegentVernacular } from "@/lib/vernacular";
import { QuestLog } from "@/pages/player-tools/QuestLog";
import { getAbilityModifier } from "@/types/system-rules";
import "./CharacterSheet.css";

const CharacterSheet = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const [searchParams] = useSearchParams();
	const isPrintMode = searchParams.get("print") === "true";
	const shareToken = searchParams.get("token") || undefined;
	const isReadOnly = !!shareToken;
	const { data: character, isLoading } = useCharacter(id || "", shareToken);
	const isLocal = !!character && isLocalCharacterId(character.id);
	const { data: characterCampaign } = useCampaignByCharacterId(
		character?.id || "",
	);
	const campaignId = characterCampaign?.id ?? null;

	const { broadcastDiceRoll, isConnected: isCampaignConnected } =
		useRealtimeCollaboration(campaignId || "");
	const { useCharacterSheetEnhancements, usePlayerToolsEnhancements } =
		useGlobalDDBeyondIntegration();
	const ddbEnhancements = useCharacterSheetEnhancements(character?.id || "");
	const playerTools = usePlayerToolsEnhancements();

	const { data: jobDisplayRow } = useQuery({
		queryKey: ["compendium-display-job", character?.job, campaignId],
		queryFn: async () => {
			if (!character?.job) return null;
			const { data } = await supabase
				.from("compendium_jobs")
				.select("name, display_name, source_book")
				.eq("name", character.job)
				.maybeSingle();

			const accessibleRows = await filterRowsBySourcebookAccess(
				data ? [data] : [],
				(row) => row.source_book,
				{ campaignId },
			);
			const accessible = accessibleRows[0];
			if (!accessible) return null;

			return {
				name: accessible.name,
				display_name: accessible.display_name ?? null,
			};
		},
		enabled: isSupabaseConfigured && Boolean(character?.job) && !isLocal,
	});

	const { data: pathDisplayRow } = useQuery({
		queryKey: ["compendium-display-path", character?.path, campaignId],
		queryFn: async () => {
			if (!character?.path) return null;
			const { data } = await supabase
				.from("compendium_job_paths")
				.select("name, display_name, source_book")
				.eq("name", character.path)
				.maybeSingle();

			const accessibleRows = await filterRowsBySourcebookAccess(
				data ? [data] : [],
				(row) => row.source_book,
				{ campaignId },
			);
			const accessible = accessibleRows[0];
			if (!accessible) return null;

			return {
				name: accessible.name,
				display_name: accessible.display_name ?? null,
			};
		},
		enabled: isSupabaseConfigured && Boolean(character?.path) && !isLocal,
	});

	const { data: backgroundDisplayRow } = useQuery({
		queryKey: [
			"compendium-display-background",
			character?.background,
			campaignId,
		],
		queryFn: async () => {
			if (!character?.background) return null;
			const { data } = await supabase
				.from("compendium_backgrounds")
				.select("name, display_name, source_book")
				.eq("name", character.background)
				.maybeSingle();

			const accessibleRows = await filterRowsBySourcebookAccess(
				data ? [data] : [],
				(row) => row.source_book,
				{ campaignId },
			);
			const accessible = accessibleRows[0];
			if (!accessible) return null;

			return {
				name: accessible.name,
				display_name: accessible.display_name ?? null,
			};
		},
		enabled: isSupabaseConfigured && Boolean(character?.background) && !isLocal,
	});

	const jobDisplayNameRaw = jobDisplayRow?.display_name || character?.job;
	const pathDisplayNameRaw = pathDisplayRow?.display_name || character?.path;
	const backgroundDisplayNameRaw =
		backgroundDisplayRow?.display_name || character?.background;
	const jobDisplayName = jobDisplayNameRaw
		? formatRegentVernacular(jobDisplayNameRaw)
		: undefined;
	const pathDisplayName = pathDisplayNameRaw
		? formatRegentVernacular(pathDisplayNameRaw)
		: undefined;
	const backgroundDisplayName = backgroundDisplayNameRaw
		? formatRegentVernacular(backgroundDisplayNameRaw)
		: undefined;
	const updateCharacter = useUpdateCharacter();
	const recordRoll = useRecordRoll();
	const generateShareToken = useGenerateShareToken();
	const { state: sheetState, saveSheetState } = useCharacterSheetState(
		character?.id || "",
	);
	const { data: charFeatures = [] } = useCharacterFeatures(character?.id || "");
	const baseCustomModifiers = useMemo(
		() => normalizeCustomModifiers(sheetState.customModifiers),
		[sheetState.customModifiers],
	);
	const featureCustomModifiers = useMemo(
		() => featureModifiersToCustomModifiers(charFeatures),
		[charFeatures],
	);
	const customModifiers = useMemo(
		() => [...baseCustomModifiers, ...featureCustomModifiers],
		[baseCustomModifiers, featureCustomModifiers],
	);
	const [hpEditOpen, setHpEditOpen] = useState(false);
	const [shareDialogOpen, setShareDialogOpen] = useState(false);
	const [exportDialogOpen, setExportDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
	const [isDefensesOpen, setIsDefensesOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [hpEditValue, setHpEditValue] = useState("");
	const [shareLinkCopied, setShareLinkCopied] = useState(false);
	const undoRedo = useCharacterUndoRedo(character ?? null);
	const { data: activeRunes = [] } = useCharacterRuneInscriptions(
		character?.id,
	);
	const { data: activeSigilInscriptions = [] } = useCharacterSigilInscriptions(
		character?.id,
	);
	const { unlocks: regentUnlocks } = useRegentUnlocks(character?.id || "");
	const concentration = useConcentration(
		character?.abilities?.VIT ?? 10,
		character?.level ?? 1,
		character?.saving_throw_proficiencies ?? [],
	);
	const { equipment, updateEquipment } = useEquipment(character?.id || "");
	const attunedItems = useMemo(() => {
		return equipment
			.filter((e) => e.is_attuned)
			.map((e) => ({
				id: e.id,
				name: e.name,
				requiresAttunement: e.requires_attunement,
				isAttuned: !!e.is_attuned,
			}));
	}, [equipment]);
	const slotsRemaining = 3 - attunedItems.length;

	const deathSaves = useDeathSaves(
		character?.death_save_successes || 0,
		character?.death_save_failures || 0,
	);

	// Persist death saves when they change (only if not read-only)
	useEffect(() => {
		if (character?.id && !isReadOnly) {
			deathSaves.persist(character.id);
		}
	}, [character?.id, isReadOnly, deathSaves.persist]);

	// Enable automatic periodic backups while editing (disabled in read-only mode)
	useAutoBackup(character ?? null, !isReadOnly);

	// Spell system hooks
	const { data: spellSlotData = [] } = useSpellSlots(
		character?.id || "",
		character?.job || null,
		character?.level || 1,
	);
	const { powers: characterPowers = [] } = usePowers(character?.id || "");
	const spellCasting = useSpellCasting(
		spellSlotData,
		(spellName, duration) => {
			concentration.concentrate({
				id: spellName,
				name: spellName,
				description: `Concentrating on ${spellName}`,
				duration,
			});
			const scope = campaignId && isCampaignConnected ? "campaign" : "local";
			if (scope === "campaign") {
				playerTools
					.trackConditionChange(
						character?.id || "",
						`Concentrating on ${spellName}`,
						"add",
					)
					.catch(console.error);
			}
		},
		() => {
			const activeSpell = concentration.state.currentEffect?.name;
			concentration.drop();
			const scope = campaignId && isCampaignConnected ? "campaign" : "local";
			if (scope === "campaign" && activeSpell) {
				playerTools
					.trackConditionChange(
						character?.id || "",
						`Concentrating on ${activeSpell}`,
						"remove",
					)
					.catch(console.error);
			}
		},
	);

	const primaryRegentUnlock =
		regentUnlocks.find((u) => u.is_primary) ?? regentUnlocks[0];
	const hasTriggeredPrintRef = useRef(false);
	const notesSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const characterResources = sheetState.resources;

	useEffect(() => {
		if (!character || isReadOnly) return;
		if (
			character.hp_temp > 0 &&
			characterResources.temp_hp_sources.length === 0
		) {
			const nextResources = addTemporaryHP(
				characterResources,
				character.hp_temp,
				"Temp HP",
			);
			void saveSheetState({ resources: nextResources });
		}
	}, [character, characterResources, isReadOnly, saveSheetState]);

	// Apply print mode styling
	useEffect(() => {
		if (isPrintMode) {
			document.body.classList.add("print-mode");
			return () => {
				document.body.classList.remove("print-mode");
			};
		}

		document.body.classList.remove("print-mode");
		hasTriggeredPrintRef.current = false;
		return;
	}, [isPrintMode]);

	// Trigger print only once, after data has loaded
	useEffect(() => {
		if (!isPrintMode) return;
		if (isLoading) return;
		if (!character?.id) return;
		if (hasTriggeredPrintRef.current) return;

		hasTriggeredPrintRef.current = true;
		const timer = window.setTimeout(() => {
			window.print();
		}, 500);

		return () => {
			window.clearTimeout(timer);
		};
	}, [isPrintMode, isLoading, character?.id]);

	const shareLink = character?.share_token
		? `${window.location.origin}/characters/${character.id}?token=${character.share_token}`
		: null;

	const handleGenerateShareLink = () => {
		if (!character) return;
		generateShareToken.mutate(character.id);
	};

	const handleCopyShareLink = async () => {
		if (!shareLink) return;
		try {
			await navigator.clipboard.writeText(shareLink);
			setShareLinkCopied(true);
			toast({
				title: "Link copied",
				description: "Share link copied to clipboard.",
			});
			setTimeout(() => setShareLinkCopied(false), 2000);
		} catch {
			toast({
				title: "Failed to copy",
				description: "Could not copy link to clipboard.",
				variant: "destructive",
			});
		}
	};

	const memoizedStats = useCharacterDerivedStats(
		character as CharacterWithAbilities | null,
		equipment,
		activeRunes,
		activeSigilInscriptions,
		customModifiers,
	);

	const applyRestResourceUpdates = useCallback(
		async (restType: "short" | "long") => {
			if (isReadOnly) return;
			const nextResources = applyResourceRest(characterResources, restType);
			try {
				await saveSheetState({ resources: nextResources });
			} catch {
				// Resource rest updates should not block completing rests.
			}
		},
		[isReadOnly, characterResources, saveSheetState],
	);

	const handleShortRest = useCallback(async () => {
		if (!character) return;
		try {
			const { executeShortRest } = await import("@/lib/restSystem");
			await executeShortRest(character.id);

			// Invalidate queries to refresh data
			queryClient.invalidateQueries({ queryKey: ["character", character.id] });
			queryClient.invalidateQueries({ queryKey: ["features", character.id] });
			await applyRestResourceUpdates("short");

			toast({
				title: "Short rest completed",
				description: "Hit dice restored. Short-rest features recharged.",
			});

			const scope = campaignId && isCampaignConnected ? "campaign" : "local";
			recordRoll.mutate({
				dice_formula: "Rest",
				result: 0,
				rolls: [],
				roll_type: "rest",
				context: "Short Rest completed",
				modifiers: null,
				campaign_id: campaignId ?? null,
				character_id: character.id,
			});

			if (scope === "campaign") {
				broadcastDiceRoll("Rest", 0, {
					characterName: character.name,
					rollType: "rest",
					context: "Short Rest completed",
					rolls: [],
				});
			}
		} catch {
			toast({
				title: "Failed to rest",
				description: "Could not complete short rest.",
				variant: "destructive",
			});
		}
	}, [
		character?.id,
		queryClient,
		applyRestResourceUpdates,
		campaignId,
		isCampaignConnected,
		broadcastDiceRoll,
		recordRoll,
		character?.name,
		character,
		toast,
	]);

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
					<SystemWindow
						title="ASCENDANT NOT FOUND"
						className="max-w-lg mx-auto"
					>
						<SystemText className="block text-muted-foreground mb-4">
							The Ascendant you're looking for doesn't exist or you don't have
							access to it.
						</SystemText>
						<Button onClick={() => navigate("/characters")}>
							Back to Ascendants
						</Button>
					</SystemWindow>
				</div>
			</Layout>
		);
	}

	if (!memoizedStats) {
		return null;
	}

	const memoizedStatsValue = memoizedStats;

	const { calculatedStats, finalAbilities, allSkills } = memoizedStatsValue;

	const handleLongRest = async () => {
		try {
			const { executeLongRest } = await import("@/lib/restSystem");
			const result = await executeLongRest(character.id);

			// Invalidate queries to refresh data
			queryClient.invalidateQueries({ queryKey: ["character", character.id] });
			queryClient.invalidateQueries({ queryKey: ["features", character.id] });
			await applyRestResourceUpdates("long");

			const hpHealed = character.hp_max - character.hp_current;
			if (hpHealed > 0) {
				playerTools
					.trackHealthChange(character.id, hpHealed, "healing")
					.catch(console.error);
			}

			if (character.exhaustion_level > 0) {
				playerTools
					.trackConditionChange(character.id, "Exhaustion", "remove")
					.catch(console.error);
			}

			toast({
				title: "Long rest completed",
				description:
					"All resources restored. Features recharged. Exhaustion reduced by 1.",
			});

			const scope = campaignId && isCampaignConnected ? "campaign" : "local";
			recordRoll.mutate({
				dice_formula: "Rest",
				result: 0,
				rolls: [],
				roll_type: "rest",
				context: "Long Rest completed",
				modifiers: null,
				campaign_id: campaignId ?? null,
				character_id: character.id,
			});

			if (scope === "campaign") {
				broadcastDiceRoll("Rest", 0, {
					characterName: character.name,
					rollType: "rest",
					context: "Long Rest completed",
					rolls: [],
				});
			}

			if (result?.questAssignmentError) {
				toast({
					title: "Daily quests not assigned",
					description: result.questAssignmentError,
					variant: "destructive",
				});
			}
		} catch {
			toast({
				title: "Failed to rest",
				description: "Could not complete long rest.",
				variant: "destructive",
			});
		}
	};

	const formatRollFormula = (base: string, modifier?: number) => {
		if (!modifier) return base;
		return `${base}${modifier >= 0 ? "+" : ""}${modifier}`;
	};

	const rollAndRecord = (options: {
		title: string;
		formula: string;
		rollType: string;
		context: string;
		modifier?: number;
	}) => {
		if (!character) return;
		try {
			const roll = rollDiceString(options.formula);
			const scope = campaignId && isCampaignConnected ? "campaign" : "local";
			const message = `${options.title}: ${formatRollResult(roll)}${scope === "campaign" ? " (shared)" : ""}`;
			toast({
				title: "Dice Roll",
				description: message,
			});
			recordRoll.mutate({
				dice_formula: roll.dice,
				result: roll.result,
				rolls: roll.rolls,
				roll_type: options.rollType,
				context: options.context,
				modifiers:
					typeof options.modifier === "number"
						? { modifier: options.modifier }
						: null,
				campaign_id: characterCampaign?.id ?? null,
				character_id: character.id,
			});

			// Broadcast to campaign channel if connected
			if (scope === "campaign") {
				broadcastDiceRoll(options.formula, roll.result, {
					characterName: character.name,
					rollType: options.rollType,
					context: options.context,
					rolls: roll.rolls,
				});
			}
		} catch {
			toast({
				title: "Roll failed",
				description: "Could not execute roll.",
				variant: "destructive",
			});
		}
	};

	const tempHpTotal = calculateTotalTempHP(characterResources);
	const effectiveTempHp =
		characterResources.temp_hp_sources.length > 0
			? tempHpTotal
			: character.hp_temp || 0;
	const _modifiersEditable = isEditMode && !isReadOnly;

	const handleHPChange = async () => {
		const newHP = parseInt(hpEditValue, 10);
		if (Number.isNaN(newHP) || newHP < 0) {
			toast({
				title: "Invalid HP",
				description: "Please enter a valid number.",
				variant: "destructive",
			});
			return;
		}

		try {
			const clampedHP = Math.min(newHP, character.hp_max + effectiveTempHp);
			await updateCharacter.mutateAsync({
				id: character.id,
				data: {
					hp_current: clampedHP,
				},
			});

			const diff = clampedHP - character.hp_current;
			if (diff !== 0) {
				playerTools
					.trackHealthChange(
						character.id,
						Math.abs(diff),
						diff > 0 ? "healing" : "damage",
					)
					.catch(console.error);
			}

			setHpEditOpen(false);
			setHpEditValue("");
		} catch {
			toast({
				title: "Failed to update HP",
				description: "Could not update hit points.",
				variant: "destructive",
			});
		}
	};

	const handleResourceAdjust = (
		field:
			| keyof CharacterResources
			| "hp_current"
			| "hp_temp"
			| "hit_dice_current"
			| "system_favor_current",
		delta: number,
	) => {
		if (!character || isReadOnly) return;
		if (field !== "hit_dice_current" && field !== "system_favor_current")
			return;
		const maxLookup = {
			hit_dice_current: character.hit_dice_max,
			system_favor_current: character.system_favor_max,
		};
		const currentValue = character[field];
		const nextValue = Math.max(
			0,
			Math.min(maxLookup[field], currentValue + delta),
		);
		const updates: {
			hit_dice_current?: number;
			system_favor_current?: number;
		} = {};
		if (field === "hit_dice_current") updates.hit_dice_current = nextValue;
		if (field === "system_favor_current")
			updates.system_favor_current = nextValue;
		updateCharacter.mutate({
			id: character.id,
			data: updates,
		});

		// DDB Parity Integration
		if (field === "hit_dice_current" && delta !== 0) {
			playerTools
				.trackCustomFeatureUsage(
					character.id,
					"Hit Dice",
					delta < 0 ? "spend" : "regain",
					"5e",
				)
				.catch(console.error);
		}
		if (field === "system_favor_current" && delta !== 0) {
			playerTools
				.trackCustomFeatureUsage(
					character.id,
					"System Favor",
					delta < 0 ? "spend" : "regain",
					"SA",
				)
				.catch(console.error);
		}
	};

	const handleExhaustionChange = (delta: number) => {
		if (!character || isReadOnly) return;
		const nextValue = Math.max(
			0,
			Math.min(6, character.exhaustion_level + delta),
		);
		updateCharacter.mutate({
			id: character.id,
			data: { exhaustion_level: nextValue },
		});

		// DDB Parity Integration
		if (delta !== 0) {
			playerTools
				.trackConditionChange(
					character.id,
					`Exhaustion Level ${nextValue}`,
					delta > 0 ? "add" : "remove",
				)
				.catch(console.error);
		}
	};

	const actionsTab = (
		<div className="space-y-6">
			<ActionsList characterId={character.id} />
			<CharacterRollsPanel
				characterId={character.id}
				characterName={character.name}
				abilities={character.abilities as Record<string, number>}
				proficiencyBonus={calculatedStats.proficiencyBonus}
				savingThrowProficiencies={character.saving_throw_proficiencies || []}
				skills={allSkills.map((skill) => ({
					name: skill.name,
					ability: skill.ability,
					proficiency: (character.skill_expertise || []).includes(skill.name)
						? "expertise"
						: (character.skill_proficiencies || []).includes(skill.name)
							? "proficient"
							: "none",
				}))}
				campaignId={campaignId ?? undefined}
				conditions={character.conditions || []}
				exhaustionLevel={character.exhaustion_level ?? 0}
				customModifiers={customModifiers}
			/>
			<SpellSlotsDisplay
				characterId={character.id}
				job={character.job}
				level={character.level}
				abilities={character.abilities as Record<string, number>}
			/>
		</div>
	);

	const powersTab = (
		<div className="space-y-6">
			{(() => {
				const castingAbility = getSpellcastingAbility(character.job);
				const castingMod = castingAbility
					? getAbilityModifier(finalAbilities[castingAbility] ?? 10)
					: 0;
				const profBonus = calculatedStats.proficiencyBonus;
				const spellSaveDC = 8 + profBonus + castingMod;
				const spellAttackBonus = profBonus + castingMod;
				const spellSlots: SpellSlotDisplay[] = spellSlotData.map((s) => ({
					level: s.level,
					current: s.current,
					max: s.max,
				}));
				const spellEntries: SpellEntry[] = characterPowers.map((p) => ({
					id: p.id,
					name: p.name,
					level: p.power_level ?? 0,
					isRitual: false,
					isConcentration: p.concentration ?? false,
					isPrepared: p.is_prepared ?? true,
					castingTime: p.casting_time ?? null,
					range: p.range ?? null,
					duration: p.duration ?? null,
					description: p.description ?? null,
					higherLevels: p.higher_levels ?? null,
					school: null,
					damage: null,
				}));
				const maxPrepared = castingAbility
					? Math.max(1, castingMod + character.level)
					: null;
				const canPrepare = !!castingAbility;
				return (
					<SpellPanel
						characterLevel={character.level}
						spellSlots={spellSlots}
						spells={spellEntries}
						spellSaveDC={spellSaveDC}
						spellAttackBonus={spellAttackBonus}
						maxPrepared={maxPrepared}
						canPrepare={canPrepare}
						characterId={character.id}
						campaignId={campaignId || undefined}
						onCastSpell={async (spellId, atLevel, asRitual) => {
							const power = characterPowers.find((p) => p.id === spellId);
							if (!power) return;
							const result = await spellCasting.castSpell({
								spell: {
									id: power.id,
									name: power.name,
									level: power.power_level ?? 0,
									isRitual: false,
									isConcentration: power.concentration ?? false,
									castingTime: power.casting_time ?? null,
									range: power.range ?? null,
									duration: power.duration ?? null,
									description: power.description ?? null,
									higherLevels: power.higher_levels ?? null,
								},
								castAtLevel: atLevel,
								asRitual,
								characterId: character.id,
								characterName: character.name,
								jobName: character.job,
								pathName: character.path,
								level: character.level,
								campaignId: campaignId,
							});
							toast({
								title: asRitual
									? `${power.name} (Ritual)`
									: `${power.name} Cast`,
								description: result.message,
							});
							if (campaignId && isCampaignConnected) {
								playerTools
									.trackCustomFeatureUsage(
										character.id,
										power.name,
										`spend (Level ${atLevel})`,
										"5e",
									)
									.catch(console.error);
							}
							queryClient.invalidateQueries({
								queryKey: ["spell-slots", character.id],
							});
						}}
						onTogglePrepared={async (spellId, prepared) => {
							if (isLocalCharacterId(character.id)) {
								const { updateLocalPower } = await import("@/lib/guestStore");
								updateLocalPower(spellId, { is_prepared: prepared });
							} else {
								await supabase
									.from("character_powers")
									.update({ is_prepared: prepared })
									.eq("id", spellId);
							}
							queryClient.invalidateQueries({
								queryKey: ["powers", character.id],
							});
						}}
						onRestoreSlot={async (level) => {
							const slot = spellSlotData.find((s) => s.level === level);
							if (!slot || slot.current >= slot.max) return;
							if (isLocalCharacterId(character.id)) {
								const { updateLocalSpellSlotRow } = await import(
									"@/lib/guestStore"
								);
								updateLocalSpellSlotRow(`${character.id}-slot-${level}`, {
									slots_current: slot.current + 1,
								});
							} else {
								await supabase
									.from("character_spell_slots")
									.update({ slots_current: slot.current + 1 })
									.eq("character_id", character.id)
									.eq("spell_level", level);
							}
							queryClient.invalidateQueries({
								queryKey: ["spell-slots", character.id],
							});
						}}
					/>
				);
			})()}
			<PowersList characterId={character.id} />
		</div>
	);

	const inventoryTab = (
		<div className="space-y-6">
			<AttunementSlots
				attunedItems={attunedItems}
				slotsRemaining={slotsRemaining}
				characterId={character.id}
				onUnattune={async (id) => {
					await updateEquipment({ id, updates: { is_attuned: false } });
					const item = equipment.find((e) => e.id === id);
					if (item && campaignId && isCampaignConnected)
						playerTools
							.trackConditionChange(
								character.id,
								`Attuned: ${item.name}`,
								"remove",
							)
							.catch(console.error);
				}}
			/>
			<EquipmentList characterId={character.id} />
			<CurrencyManager characterId={character.id} />
		</div>
	);

	const featuresTab = (
		<div className="space-y-6">
			<FeatureChoicesPanel characterId={character.id} />
			<FeaturesList characterId={character.id} />
			<HomebrewFeatureApplicator characterId={character.id} />
			{!isLocal && <RunesList characterId={character.id} />}
			{!isLocal && <RegentUnlocksPanel characterId={character.id} />}
			{!isLocal && primaryRegentUnlock && (
				<RegentFeaturesDisplay
					characterId={character.id}
					characterLevel={character.level}
					regentId={primaryRegentUnlock.regent_id}
					regentLevel={character.level}
				/>
			)}
			{!isLocal && (
				<ShadowSoldiersPanel
					characterId={character.id}
					characterLevel={character.level}
				/>
			)}
		</div>
	);

	const bioTab = (
		<div className="space-y-6">
			<SystemWindow title="PORTRAIT">
				{isLocal ? (
					<SystemText className="text-sm text-muted-foreground">
						Sign in to upload portraits.
					</SystemText>
				) : (
					<PortraitUpload
						characterId={character.id}
						currentPortraitUrl={character.portrait_url}
						onUploadComplete={() => window.location.reload()}
					/>
				)}
			</SystemWindow>
			<SystemWindow title="NOTES">
				<RichTextNotes
					value={character.notes || ""}
					onChange={async (v) => {
						if (notesSaveTimeoutRef.current)
							clearTimeout(notesSaveTimeoutRef.current);
						notesSaveTimeoutRef.current = setTimeout(async () => {
							try {
								await updateCharacter.mutateAsync({
									id: character.id,
									data: { notes: v },
								});
							} catch {
								toast({ title: "Failed to save", variant: "destructive" });
							}
						}, 1000);
					}}
					disabled={isReadOnly}
				/>
			</SystemWindow>
			<CharacterBackupPanel characterId={character.id} />
			{!isLocal && <JournalPanel characterId={character.id} />}
			<RollHistoryPanel characterId={character.id} />
		</div>
	);

	const questsTab = !isLocal ? (
		<QuestLog characterId={character.id} />
	) : (
		<div className="p-4">Quests require sign in.</div>
	);

	const extrasTab = (
		<div className="space-y-6">
			<CharacterExtrasPanel
				characterId={character.id}
				isReadOnly={isReadOnly}
			/>
		</div>
	);

	return (
		<Layout className={isPrintMode ? "print-mode" : ""}>
			<div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/characters")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Characters
					</Button>
					{!isReadOnly && (
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() => {
									const previousState = undoRedo.undo();
									if (previousState && character) {
										updateCharacter.mutate({
											id: character.id,
											data: {
												name: previousState.name,
												appearance: previousState.appearance,
												backstory: previousState.backstory,
												notes: previousState.notes,
											},
										});
										toast({
											title: "Undone",
											description: "Previous change restored.",
										});
									}
								}}
								disabled={!undoRedo.canUndo()}
								className="gap-2"
								aria-label="Undo"
								title="Undo (Ctrl+Z)"
							>
								<Undo2 className="w-4 h-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => {
									const nextState = undoRedo.redo();
									if (nextState && character) {
										updateCharacter.mutate({
											id: character.id,
											data: {
												name: nextState.name,
												appearance: nextState.appearance,
												backstory: nextState.backstory,
												notes: nextState.notes,
											},
										});
										toast({
											title: "Redone",
											description: "Change restored.",
										});
									}
								}}
								disabled={!undoRedo.canRedo()}
								className="gap-2"
								aria-label="Redo"
								title="Redo (Ctrl+Y)"
							>
								<Redo2 className="w-4 h-4" />
							</Button>
							<Button
								variant="outline"
								onClick={() => setShareDialogOpen(true)}
								className="gap-2"
								aria-label="Share character"
							>
								<Share2 className="w-4 h-4" />
								Share
							</Button>
							<Button
								variant="outline"
								onClick={() => setExportDialogOpen(true)}
								className="gap-2"
								aria-label="Export character"
							>
								<Download className="w-4 h-4" />
								Export
							</Button>
							<Button
								variant={isEditMode ? "default" : "outline"}
								onClick={() => setIsEditMode((prev) => !prev)}
								className="gap-2"
								aria-label="Toggle sheet edit mode"
								aria-pressed={isEditMode}
							>
								<SlidersHorizontal className="w-4 h-4" />
								{isEditMode ? "Editing" : "Edit Sheet"}
							</Button>
							<Button
								variant="outline"
								onClick={() => setEditDialogOpen(true)}
								className="gap-2"
								aria-label="Edit character"
							>
								<Edit className="w-4 h-4" />
								Edit
							</Button>
						</div>
					)}
					{isReadOnly && (
						<Badge variant="secondary" className="gap-2">
							<Share2 className="w-3 h-3" />
							Read-Only View
						</Badge>
					)}
				</div>

				{isLocal && (
					<SystemWindow title="GUEST MODE" variant="alert" className="mb-6">
						<div className="space-y-2">
							<SystemText className="block text-sm text-muted-foreground">
								This Ascendant is stored locally on this device. Sign in to sync
								across devices and unlock online features like rune inscription,
								portraits, and Umbral Legion persistence.
							</SystemText>
							<div className="flex gap-2">
								<Link to="/auth">
									<Button variant="outline" size="sm">
										Sign In to Sync
									</Button>
								</Link>
							</div>
						</div>
					</SystemWindow>
				)}

				<CharacterSheetV2
					character={character}
					stats={memoizedStats}
					characterResources={characterResources}
					displayNames={{
						job: jobDisplayName,
						path: pathDisplayName,
						background: backgroundDisplayName,
					}}
					isReadOnly={isReadOnly}
					levelingType={getLevelingMode(
						characterCampaign?.settings as Record<string, unknown> | undefined,
					)}
					actions={actionsTab}
					powers={powersTab}
					inventory={inventoryTab}
					features={featuresTab}
					bio={bioTab}
					quests={questsTab}
					extras={extrasTab}
					onRollAbility={ddbEnhancements.rollAbilityCheck}
					onRollSave={ddbEnhancements.rollSavingThrow}
					onRollSkill={ddbEnhancements.rollSkillCheck}
					onRollInitiative={() =>
						ddbEnhancements.roll(
							"initiative",
							memoizedStats.finalInitiative,
							"ability",
							"Initiative",
							campaignId || undefined,
							memoizedStats.initiativeAdvantage as AdvantageState,
						)
					}
					onRollHitDice={() =>
						rollAndRecord({
							title: "Hit Die",
							formula: formatRollFormula(
								`1d${character.hit_dice_size}`,
								getAbilityModifier(memoizedStats.finalAbilities.VIT),
							),
							rollType: "default",
							context: `Hit Die d${character.hit_dice_size}`,
							modifier: getAbilityModifier(memoizedStats.finalAbilities.VIT),
						})
					}
					onHPClick={() => setHpEditOpen(true)}
					onACClick={() => setIsDefensesOpen(true)}
					onShortRest={async (totalRecovered: number, hitDiceSpent: number) => {
						if (totalRecovered > 0) {
							const newHP = Math.min(
								character.hp_current + totalRecovered,
								character.hp_max,
							);
							updateCharacter.mutate({
								id: character.id,
								data: { hp_current: newHP },
							});
						}
						if (hitDiceSpent > 0) {
							await handleResourceAdjust("hit_dice_current", -hitDiceSpent);
						}

						// Broadcast Short Rest completion
						playerTools
							.trackConditionChange(character.id, "Short Rest", "add")
							.catch(console.error);

						await handleShortRest();
					}}
					onLongRest={handleLongRest}
					onLevelUp={() => setIsLevelUpOpen(true)}
					onResourceAdjust={handleResourceAdjust}
					onExhaustionChange={handleExhaustionChange}
					onAddCondition={(conditionName: string) => {
						const characterState =
							(character.gemini_state as Record<string, unknown>) || {};
						const currentStructured =
							(characterState.conditions as ConditionEntry[]) ||
							migrateLegacyConditions(character.conditions || []);

						const { conditions: updatedStructured } = applyCondition(
							currentStructured,
							conditionName,
							"manual",
							"Manual",
						);

						updateCharacter.mutate({
							id: character.id,
							data: {
								conditions: getActiveConditionNames(updatedStructured),
								gemini_state: {
									...characterState,
									conditions: updatedStructured,
								} as never,
							},
						});
						playerTools
							.trackConditionChange(character.id, conditionName, "add")
							.catch(console.error);
					}}
					onRemoveCondition={(conditionId: string) => {
						const characterState =
							(character.gemini_state as Record<string, unknown>) || {};
						const currentStructured =
							(characterState.conditions as ConditionEntry[]) ||
							migrateLegacyConditions(character.conditions || []);

						const { conditions: updatedStructured, change } = removeCondition(
							currentStructured,
							conditionId,
						);

						if (change) {
							updateCharacter.mutate({
								id: character.id,
								data: {
									conditions: getActiveConditionNames(updatedStructured),
									gemini_state: {
										...characterState,
										conditions: updatedStructured,
									} as never,
								},
							});
							playerTools
								.trackConditionChange(
									character.id,
									change.condition.conditionName,
									"remove",
								)
								.catch(console.error);
						}
					}}
					concentration={{
						isConcentrating: concentration.state.isConcentrating,
						effectName: concentration.state.currentEffect?.name,
						remainingRounds: concentration.state.currentEffect?.remainingRounds,
						onDrop: () => {
							if (concentration.state.currentEffect) {
								playerTools
									.trackConditionChange(
										character.id,
										`Concentrating: ${concentration.state.currentEffect.name}`,
										"remove",
									)
									.catch(console.error);
							}
							concentration.drop();
						},
					}}
					deathSaves={{
						...deathSaves.state,
						onRoll: () => {
							const result = deathSaves.rollDeathSave();
							const scope =
								campaignId && isCampaignConnected ? "campaign" : "local";

							recordRoll.mutate({
								dice_formula: "1d20",
								result: result.roll,
								rolls: [result.roll],
								roll_type: "check",
								context: "Death Saving Throw",
								modifiers: null,
								campaign_id: campaignId ?? null,
								character_id: character.id,
							});

							if (scope === "campaign") {
								broadcastDiceRoll("1d20", result.roll, {
									characterName: character.name,
									rollType: "check",
									context: "Death Saving Throw",
									rolls: [result.roll],
								});
							}

							if (result.isNat20) {
								// Regain 1 HP on Nat 20
								updateCharacter.mutate({
									id: character.id,
									data: { hp_current: 1 },
								});
							}
						},
						onStabilize: deathSaves.stabilize,
					}}
					senses={memoizedStats.senses}
					defenses={{
						resistances: memoizedStats.resistances,
						immunities: memoizedStats.immunities,
						vulnerabilities: memoizedStats.vulnerabilities,
						conditionImmunities: memoizedStats.conditionImmunities,
					}}
				/>

				<div className="mt-8 border-t border-primary/10 pt-8">
					<div className="flex flex-wrap gap-4 items-center justify-between">
						<div className="text-xs font-mono text-primary/40 uppercase tracking-widest">
							SYS_STATUS: NOMINAL / CORE_SYSTEM: INTEGRATED
						</div>
						<div className="flex gap-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setExportDialogOpen(true)}
								className="text-[10px] uppercase tracking-tighter text-primary/60 hover:text-primary"
							>
								SYS_EXPORT
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShareDialogOpen(true)}
								className="text-[10px] uppercase tracking-tighter text-primary/60 hover:text-primary"
							>
								SYS_SHARE
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* â”€â”€ Dialogs (rendered outside scroll content) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}

			{/* HP Edit Dialog */}
			<Dialog open={hpEditOpen} onOpenChange={setHpEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Hit Points</DialogTitle>
						<DialogDescription>
							Set the character's current hit points (max:{" "}
							{character.hp_max + effectiveTempHp})
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<Label htmlFor="hp">Current HP</Label>
							<Input
								id="hp"
								type="number"
								value={hpEditValue}
								onChange={(e) => setHpEditValue(e.target.value)}
								min={0}
								max={character.hp_max + effectiveTempHp}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setHpEditOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleHPChange}>Save</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Export Dialog */}
			<ExportDialog
				open={exportDialogOpen}
				onOpenChange={setExportDialogOpen}
				character={character}
			/>

			{/* Share Dialog */}
			<Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Share Character</DialogTitle>
						<DialogDescription>
							Generate a shareable link to let others view your character
							(read-only).
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						{!shareLink ? (
							<Button
								onClick={handleGenerateShareLink}
								disabled={generateShareToken.isPending}
								className="w-full"
							>
								{generateShareToken.isPending
									? "Generating..."
									: "Generate Share Link"}
							</Button>
						) : (
							<div className="space-y-2">
								<Label>Share Link</Label>
								<div className="flex gap-2">
									<Input readOnly value={shareLink} className="flex-1" />
									<Button
										variant="outline"
										size="icon"
										onClick={handleCopyShareLink}
									>
										{shareLinkCopied ? (
											<Check className="w-4 h-4 text-green-500" />
										) : (
											<Copy className="w-4 h-4" />
										)}
									</Button>
								</div>
								<SystemText className="block text-xs text-muted-foreground">
									Anyone with this link can view your character in read-only
									mode.
								</SystemText>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* Character Edit Dialog */}
			<CharacterEditDialog
				character={character}
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				onStateChange={(updatedState) => {
					if (character) {
						undoRedo.pushState(updatedState, "Character edited");
					}
				}}
			/>

			<LevelUpWizardModal
				isOpen={isLevelUpOpen}
				onClose={() => setIsLevelUpOpen(false)}
				characterId={character.id}
			/>

			{memoizedStats && (
				<DefensesModal
					characterId={character.id}
					acBreakdown={{
						total: memoizedStats.acDetail.total,
						base: memoizedStats.acDetail.base,
						agiModifier: memoizedStats.acDetail.dexterity, // Mapping our dex to their agiMod
						agiApplied: memoizedStats.acDetail.dexterity,
						armorAC: memoizedStats.acDetail.base,
						shieldBonus: 0,
						magicalBonus: 0,
						otherBonuses:
							memoizedStats.acDetail.bonus + memoizedStats.acDetail.misc,
						formula: `${memoizedStats.acDetail.label}: ${memoizedStats.acDetail.base} + ${memoizedStats.acDetail.dexterity} (Dex) ${memoizedStats.acDetail.bonus !== 0 ? `+ ${memoizedStats.acDetail.bonus} (Bonus)` : ""}`,
						warnings: [],
					}}
					resistances={memoizedStats.resistances}
					immunities={memoizedStats.immunities}
					vulnerabilities={memoizedStats.vulnerabilities}
					conditionImmunities={memoizedStats.conditionImmunities}
					isOpen={isDefensesOpen}
					onOpenChange={setIsDefensesOpen}
				/>
			)}
		</Layout>
	);
};

export default CharacterSheet;
