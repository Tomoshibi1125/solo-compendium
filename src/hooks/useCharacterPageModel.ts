import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import {
	useAscendantTools,
	useCharacterSheetEnhancements,
} from "@/hooks/useGlobalDDBeyondIntegration";
import { useRealtimeCollaboration } from "@/hooks/useRealtimeCollaboration";
import { useRecordRoll } from "@/hooks/useRollHistory";

import { useCharacterSigilInscriptions } from "@/hooks/useSigils";
import { useSpellCasting } from "@/hooks/useSpellCasting";
import { useSpellSlots } from "@/hooks/useSpellSlots";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { addTemporaryHP, applyResourceRest } from "@/lib/characterResources";
import { normalizeCustomModifiers } from "@/lib/customModifiers";
import { formatRollResult, rollDiceString } from "@/lib/diceRoller";
import { isLocalCharacterId } from "@/lib/guestStore";
import { autoLearnRunes } from "@/lib/runeAutomation";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
import { formatRegentVernacular } from "@/lib/vernacular";

export function useCharacterPageModel() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const [searchParams] = useSearchParams();
	const isPrintMode = searchParams.get("print") === "true";
	const shareToken = searchParams.get("token") || undefined;
	const activeTabParam = searchParams.get("tab") || "actions";
	const isReadOnly = !!shareToken;
	const { data: character, isLoading } = useCharacter(id || "", shareToken);

	useEffect(() => {
		const syncAutoRunes = async () => {
			if (character) {
				const learned = await autoLearnRunes(character);
				if (learned.length > 0) {
					console.log("[Warden] Auto-Learned Runes:", learned);
				}
			}
		};
		void syncAutoRunes();
	}, [character]);

	const isLocal = !!character && isLocalCharacterId(character.id);
	const { data: characterCampaign } = useCampaignByCharacterId(
		character?.id || "",
	);
	const campaignId = characterCampaign?.id ?? null;

	const { data: spellSlotData = [] } = useSpellSlots(
		character?.id || "",
		character?.job || null,
		character?.level || 1,
	);
	const { broadcastDiceRoll, isConnected: isCampaignConnected } =
		useRealtimeCollaboration(campaignId || "");
	const _ddbEnhancements = useCharacterSheetEnhancements(character?.id || "");
	const ascendantTools = useAscendantTools();

	// Compendium Display Rows for Vernacular
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
			return accessibleRows[0]
				? {
						name: accessibleRows[0].name,
						display_name: accessibleRows[0].display_name ?? null,
					}
				: null;
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
			return accessibleRows[0]
				? {
						name: accessibleRows[0].name,
						display_name: accessibleRows[0].display_name ?? null,
					}
				: null;
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
			return accessibleRows[0]
				? {
						name: accessibleRows[0].name,
						display_name: accessibleRows[0].display_name ?? null,
					}
				: null;
		},
		enabled: isSupabaseConfigured && Boolean(character?.background) && !isLocal,
	});

	const jobDisplayNameRaw = jobDisplayRow?.display_name || character?.job;
	const pathDisplayNameRaw = pathDisplayRow?.display_name || character?.path;
	const backgroundDisplayNameRaw =
		backgroundDisplayRow?.display_name || character?.background;
	const displayNames = {
		job: jobDisplayNameRaw
			? formatRegentVernacular(jobDisplayNameRaw)
			: undefined,
		path: pathDisplayNameRaw
			? formatRegentVernacular(pathDisplayNameRaw)
			: undefined,
		background: backgroundDisplayNameRaw
			? formatRegentVernacular(backgroundDisplayNameRaw)
			: undefined,
	};

	const updateCharacter = useUpdateCharacter();
	const recordRoll = useRecordRoll();
	const generateShareToken = useGenerateShareToken();
	const sheetController = useCharacterSheetState(character?.id || "");
	const { state: sheetState } = sheetController;
	const { data: charFeatures = [] } = useCharacterFeatures(character?.id || "");

	const customModifiers = useMemo(
		() => [
			...normalizeCustomModifiers(sheetState.customModifiers),
			...featureModifiersToCustomModifiers(charFeatures),
		],
		[sheetState.customModifiers, charFeatures],
	);

	const undoRedo = useCharacterUndoRedo(character ?? null);

	const { data: activeSigilInscriptions = [] } = useCharacterSigilInscriptions(
		character?.id,
	);
	const concentration = useConcentration(
		character?.abilities?.VIT ?? 10,
		character?.level ?? 1,
		character?.saving_throw_proficiencies ?? [],
	);
	const { equipment } = useEquipment(character?.id || "");
	const deathSaves = useDeathSaves(
		character?.death_save_successes || 0,
		character?.death_save_failures || 0,
	);

	useEffect(() => {
		if (character?.id && !isReadOnly) deathSaves.persist(character.id);
	}, [character?.id, isReadOnly, deathSaves.persist]);

	useAutoBackup(character ?? null, !isReadOnly);

	const spellCasting = useSpellCasting(
		spellSlotData,
		(spellName, duration) => {
			concentration.concentrate({
				id: spellName,
				name: spellName,
				description: `Concentrating on ${spellName}`,
				duration,
			});
			if (campaignId && isCampaignConnected)
				ascendantTools
					.trackConditionChange(
						character?.id || "",
						`Concentrating on ${spellName}`,
						"add",
					)
					.catch(console.error);
		},
		() => {
			const activeSpell = concentration.state.currentEffect?.name;
			concentration.drop();
			if (campaignId && isCampaignConnected && activeSpell) {
				ascendantTools
					.trackConditionChange(
						character?.id || "",
						`Concentrating on ${activeSpell}`,
						"remove",
					)
					.catch(console.error);
			}
		},
	);

	const hasTriggeredPrintRef = useRef(false);
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
			void sheetController.saveSheetState({ resources: nextResources });
		}
	}, [character, characterResources, isReadOnly, sheetController]);

	useEffect(() => {
		if (isPrintMode) {
			document.body.classList.add("print-mode");
			return () => document.body.classList.remove("print-mode");
		}
		document.body.classList.remove("print-mode");
		hasTriggeredPrintRef.current = false;
	}, [isPrintMode]);

	useEffect(() => {
		if (
			!isPrintMode ||
			isLoading ||
			!character?.id ||
			hasTriggeredPrintRef.current
		)
			return;
		hasTriggeredPrintRef.current = true;
		const timer = window.setTimeout(() => window.print(), 500);
		return () => window.clearTimeout(timer);
	}, [isPrintMode, isLoading, character?.id]);

	const memoizedStats = useCharacterDerivedStats(
		character as CharacterWithAbilities | null,
		equipment,

		activeSigilInscriptions,
		customModifiers,
	);

	const applyRestResourceUpdates = useCallback(
		async (restType: "short" | "long") => {
			if (isReadOnly) return;
			const nextResources = applyResourceRest(characterResources, restType);
			try {
				await sheetController.saveSheetState({ resources: nextResources });
			} catch {}
		},
		[isReadOnly, characterResources, sheetController],
	);

	const handleShortRest = useCallback(async () => {
		if (!character) return;
		await sheetController.handleShortRest(
			character.id,
			queryClient,
			applyRestResourceUpdates,
			toast,
		);

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
		if (scope === "campaign")
			broadcastDiceRoll("Rest", 0, {
				characterName: character.name,
				rollType: "rest",
				context: "Short Rest completed",
				rolls: [],
			});
	}, [
		character,
		queryClient,
		applyRestResourceUpdates,
		campaignId,
		isCampaignConnected,
		broadcastDiceRoll,
		recordRoll,
		toast,
		sheetController,
	]);

	const handleLongRest = async () => {
		if (!character) return;
		await sheetController.handleLongRest(
			character.id,
			queryClient,
			applyRestResourceUpdates,
			ascendantTools,
			character.hp_current,
			character.hp_max,
			character.exhaustion_level,
			toast,
		);

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
		if (scope === "campaign")
			broadcastDiceRoll("Rest", 0, {
				characterName: character.name,
				rollType: "rest",
				context: "Long Rest completed",
				rolls: [],
			});
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
			const finalFormula =
				typeof options.modifier === "number"
					? `${options.formula}${options.modifier >= 0 ? "+" : ""}${options.modifier}`
					: options.formula;
			const roll = rollDiceString(finalFormula);
			const scope = campaignId && isCampaignConnected ? "campaign" : "local";
			const message = `${options.title}: ${formatRollResult(roll)}${scope === "campaign" ? " (shared)" : ""}`;
			toast({ title: "Dice Roll", description: message });
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
			if (scope === "campaign")
				broadcastDiceRoll(finalFormula, roll.result, {
					characterName: character.name,
					rollType: options.rollType,
					context: options.context,
					rolls: roll.rolls,
				});
		} catch {
			toast({
				title: "Roll failed",
				description: "Could not execute roll.",
				variant: "destructive",
			});
		}
	};

	const handleResourceAdjust = (
		field: "hit_dice_current" | "rift_favor_current",
		delta: number,
	) => {
		if (!character || isReadOnly) return;
		const maxLookup = {
			hit_dice_current: character.hit_dice_max,
			rift_favor_current: character.rift_favor_max,
		};
		sheetController.handleResourceAdjust(
			character.id,
			field,
			delta,
			character[field],
			maxLookup[field],
			updateCharacter,
			ascendantTools,
		);
	};

	const handleGenerateShareLink = () => {
		if (character) generateShareToken.mutate(character.id);
	};
	const handleCopyShareLink = async () => {
		const shareLink = character?.share_token
			? `${window.location.origin}/characters/${character.id}?token=${character.share_token}`
			: null;
		if (!shareLink) return;
		try {
			await navigator.clipboard.writeText(shareLink);
			toast({
				title: "Link copied",
				description: "Share link copied to clipboard.",
			});
		} catch {
			toast({
				title: "Failed to copy",
				description: "Could not copy link to clipboard.",
				variant: "destructive",
			});
		}
	};

	return {
		// Data
		character,
		memoizedStats,
		characterResources,
		displayNames,
		characterCampaign,
		spellCasting,
		isLoading,
		isReadOnly,
		campaignId,

		// Controller Hooks & States
		sheetController,
		undoRedo,
		handleGenerateShareLink,
		handleCopyShareLink,
		shareToken: character?.share_token
			? `${window.location.origin}/characters/${character.id}?token=${character.share_token}`
			: null,
		generateShareTokenPending: generateShareToken.isPending,
		updateCharacter,

		// Bound Handlers
		activeTab: sheetState.ui.activeTab || activeTabParam,
		setActiveTab: sheetController.setActiveTab,
		navigate,
		handleShortRest,
		handleLongRest,
		rollAndRecord,
		handleResourceAdjust,
		ascendantTools,
		concentration,
		deathSaves,
	};
}
