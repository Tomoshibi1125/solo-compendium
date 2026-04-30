import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCampaignByCharacterId } from "@/hooks/useCampaigns";
import { useCanonicalEquipmentMap } from "@/hooks/useCanonicalEquipmentMap";
import {
	activeSpellsToCustomModifiers,
	useCharacterActiveSpells,
	useRemoveActiveSpellByName,
	useRemoveConcentrationSpells,
} from "@/hooks/useCharacterActiveSpells";
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
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { useRealtimeCollaboration } from "@/hooks/useRealtimeCollaboration";
import { useRegentUnlocks } from "@/hooks/useRegentUnlocks";
import { useRecordRoll } from "@/hooks/useRollHistory";

import { useCharacterSigilInscriptions } from "@/hooks/useSigils";
import { useSpellCasting } from "@/hooks/useSpellCasting";
import { useSpellSlots } from "@/hooks/useSpellSlots";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { resolveCanonicalReference } from "@/lib/canonicalCompendium";
import { addTemporaryHP, applyResourceRest } from "@/lib/characterResources";
import {
	normalizeCustomModifiers,
	resolveAdvantageFromCustomModifiers,
} from "@/lib/customModifiers";
import { formatRollResult, rollDiceString } from "@/lib/diceRoller";
import { isLocalCharacterId } from "@/lib/guestStore";
import { isSourcebookAccessible } from "@/lib/sourcebookAccess";
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

	// Note: prior code ran an `autoLearnRunes(character)` effect on every
	// character refresh, but the underlying helper short-circuits to `[]`
	// when called without explicit rune IDs (no level/job heuristic ever
	// existed). Removed the no-op effect — call sites that explicitly pass
	// runeIds (e.g. quest rewards, rune absorption) still work normally.

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
	const ascendantTools = useAscendantTools();

	// Compendium Display Rows for Vernacular — backed by canonical static.
	const resolveDisplayRow = async (
		type: "jobs" | "paths" | "backgrounds",
		id: string | null | undefined,
		name: string | null | undefined,
	) => {
		if (!id && !name) return null;
		const { entry } = await resolveCanonicalReference(
			type,
			{ id, name },
			{ campaignId },
		);
		if (!entry) return null;
		if (!(await isSourcebookAccessible(entry.source_book, { campaignId }))) {
			return null;
		}
		return {
			name: entry.name,
			display_name: entry.display_name ?? null,
		};
	};

	const { data: jobDisplayRow } = useQuery({
		queryKey: [
			"compendium-display-job",
			character?.job_id,
			character?.job,
			campaignId,
		],
		queryFn: () => resolveDisplayRow("jobs", character?.job_id, character?.job),
		enabled:
			isSupabaseConfigured &&
			Boolean(character?.job_id || character?.job) &&
			!isLocal,
	});

	const { data: pathDisplayRow } = useQuery({
		queryKey: [
			"compendium-display-path",
			character?.path_id,
			character?.path,
			campaignId,
		],
		queryFn: () =>
			resolveDisplayRow("paths", character?.path_id, character?.path),
		enabled:
			isSupabaseConfigured &&
			Boolean(character?.path_id || character?.path) &&
			!isLocal,
	});

	const { data: backgroundDisplayRow } = useQuery({
		queryKey: [
			"compendium-display-background",
			character?.background_id,
			character?.background,
			campaignId,
		],
		queryFn: () =>
			resolveDisplayRow(
				"backgrounds",
				character?.background_id,
				character?.background,
			),
		enabled:
			isSupabaseConfigured &&
			Boolean(character?.background_id || character?.background) &&
			!isLocal,
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
	const { data: characterActiveSpells = [] } = useCharacterActiveSpells(
		character?.id,
	);

	const customModifiers = useMemo(
		() => [
			...normalizeCustomModifiers(sheetState.customModifiers),
			...featureModifiersToCustomModifiers(charFeatures),
			// D&D Beyond parity: persisted active spells (Bless, Shield of
			// Faith, Haste, …) project into customModifiers so derived stats
			// pick up their bonuses without the engine knowing about spells.
			...activeSpellsToCustomModifiers(characterActiveSpells),
		],
		[sheetState.customModifiers, charFeatures, characterActiveSpells],
	);

	const undoRedo = useCharacterUndoRedo(character ?? null);

	const { data: activeSigilInscriptions = [] } = useCharacterSigilInscriptions(
		character?.id,
	);

	// D&D Beyond parity: concentration saves apply advantage/disadvantage from
	// feats (War Caster) and conditions (Resilient CON, Bear Totem rage, etc.).
	const concentrationSaveMode = useMemo(
		() =>
			resolveAdvantageFromCustomModifiers(customModifiers, [
				"concentration_save",
				"concentration",
				"save:vit",
				"vit_save",
			]),
		[customModifiers],
	);

	const removeActiveSpellByName = useRemoveActiveSpellByName();
	const removeConcentrationSpells = useRemoveConcentrationSpells();

	const rawConcentration = useConcentration(
		character?.abilities?.VIT ?? 10,
		character?.level ?? 1,
		character?.saving_throw_proficiencies ?? [],
		{
			// Single source of truth for analytics on any concentration loss
			// (drop, replaced, broken-by-damage, expired). Keeps the spell-casting
			// onConcentrationDrop callback as a pure state transition.
			onConcentrationLost: (spellName) => {
				const cid = character?.id;
				if (!cid) return;

				// Clean up the persisted active-spell row so its mechanical
				// effects stop applying to derived stats (DDB parity).
				removeActiveSpellByName
					.mutateAsync({ characterId: cid, spellName })
					.catch(console.error);

				if (campaignId && isCampaignConnected) {
					ascendantTools
						.trackConditionChange(
							cid,
							`Concentrating on ${spellName}`,
							"remove",
						)
						.catch(console.error);
				}
			},
		},
	);

	// Wrap takeDamage so callers don't have to know about advantage targets —
	// the page model owns custom-modifier resolution.
	const concentration = useMemo(
		() => ({
			...rawConcentration,
			takeDamage: (
				damage: number,
				mode?: "normal" | "advantage" | "disadvantage",
			) => rawConcentration.takeDamage(damage, mode ?? concentrationSaveMode),
		}),
		[rawConcentration, concentrationSaveMode],
	);

	const { equipment } = useEquipment(character?.id || "");
	const deathSaves = useDeathSaves(
		character?.death_save_successes || 0,
		character?.death_save_failures || 0,
	);

	// Persist death save state to Supabase whenever it changes (DDB parity:
	// auto-saves successes/failures/stable). `deathSaves.persist` is wrapped
	// in `useCallback([state])` so its identity changes whenever any state
	// field flips — that's enough to refire this effect on every relevant
	// state transition without listing each field explicitly.
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
			// Drop only: the useConcentration hook fires onConcentrationLost which
			// emits the analytics "remove" event (single source of truth).
			concentration.drop();
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

	const { map: canonicalEquipmentMap } = useCanonicalEquipmentMap(
		character?.id,
	);

	// D&D Beyond parity inputs for Extra Attack detection.
	const { unlocks: regentUnlocks = [] } = useRegentUnlocks(character?.id || "");
	const regentIds = useMemo(
		() => regentUnlocks.map((u) => u.regent_id),
		[regentUnlocks],
	);
	const hasExtraAttackFeature = useMemo(
		() =>
			charFeatures.some((f) => f.name?.toLowerCase().includes("extra attack")),
		[charFeatures],
	);

	const memoizedStats = useCharacterDerivedStats(
		character as CharacterWithAbilities | null,
		equipment,

		activeSigilInscriptions,
		customModifiers,
		canonicalEquipmentMap,
		{ hasExtraAttackFeature, regentIds },
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
			ascendantTools,
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
		ascendantTools,
	]);

	const handleLongRest = async () => {
		if (!character) return;

		// D&D Beyond / RAW parity: a full long rest (8 hours of sleep) drops
		// any active concentration. This is the single orchestration point —
		// page model owns concentration/active-spell state, so cleanup runs
		// here in addition to whatever sheetController.handleLongRest does.
		if (concentration.state.isConcentrating) {
			concentration.drop();
		}
		// Clean up any remaining concentration rows in the DB regardless of
		// in-memory state (defensive; long rest = clean slate).
		removeConcentrationSpells.mutateAsync(character.id).catch(console.error);

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
