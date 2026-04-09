/**
 * Rest system automation
 * Handles short rest and long rest resource restoration
 */

import { supabase } from "@/integrations/supabase/client";
import {
	buildCorePayload,
	DomainEventBus,
	type RestLongEvent,
	type RestShortEvent,
} from "@/lib/domainEvents";
import { AppError } from "./appError";
import { logger } from "./logger";

/**
 * Execute short rest
 * - Restore hit dice (up to half of max, rounded up)
 * - Reset short-rest recharge features
 */
export async function executeShortRest(characterId: string): Promise<void> {
	const { data: character } = await supabase
		.from("characters")
		.select("*")
		.eq("id", characterId)
		.single();

	if (!character) throw new AppError("Ascendant not found", "NOT_FOUND");

	// Short rest does NOT auto-restore hit dice per 5e SRD.
	// Players may *spend* hit dice to heal (handled by ShortRestDialog/useHitDiceSpending).

	// Reset short-rest recharge features
	const { data: features } = await supabase
		.from("character_features")
		.select("*")
		.eq("character_id", characterId)
		.eq("recharge", "short-rest");

	if (features && features.length > 0) {
		for (const feature of features) {
			if (feature.uses_max !== null) {
				await supabase
					.from("character_features")
					.update({ uses_current: feature.uses_max })
					.eq("id", feature.id);
			}
		}
	}

	// Recover spell slots on short rest (only for slots marked for short rest recovery)
	const recoveredSlotLevels: number[] = [];
	try {
		const { data: slots } = await supabase
			.from("character_spell_slots")
			.select("*")
			.eq("character_id", characterId)
			.eq("slots_recovered_on_short_rest", 1);

		if (slots && slots.length > 0) {
			for (const slot of slots) {
				await supabase
					.from("character_spell_slots")
					.update({ slots_current: slot.slots_max })
					.eq("id", slot.id);
				recoveredSlotLevels.push(slot.spell_level);
			}
		}
	} catch (error) {
		logger.error("Failed to recover spell slots:", error);
		// Continue even if spell slot recovery fails
	}

	// Emit domain event
	try {
		const shortRestEvent: RestShortEvent = {
			...buildCorePayload({
				characterId: character.id,
				characterName: character.name,
				className: character.job,
				pathName: character.path,
				level: character.level,
			}),
			type: "rest:short",
			hitDiceSpent: 0,
			hpRecovered: 0,
			featuresRecharged: (features || []).map((f) => f.name),
			slotsRecovered: recoveredSlotLevels,
		};
		DomainEventBus.emit(shortRestEvent);
	} catch {
		// Best-effort event emission
	}
}

/**
 * Execute long rest
 * - Restore all HP
 * - Restore all hit dice
 * - Restore Rift Favor
 * - Reset long-rest recharge features
 * - Reduce exhaustion by 1
 * - Clear conditions
 */
export async function executeLongRest(
	characterId: string,
): Promise<{ questAssignmentError?: string }> {
	const { data: character } = await supabase
		.from("characters")
		.select("*")
		.eq("id", characterId)
		.single();

	if (!character) throw new AppError("Ascendant not found", "NOT_FOUND");

	// Update character
	const characterState =
		(character.gemini_state as Record<string, unknown>) || {};
	const { clearConditionsOnLongRest } = await import("@/lib/conditionSystem");

	await supabase
		.from("characters")
		.update({
			hp_current: character.hp_max,
			hit_dice_current: Math.min(
				character.hit_dice_max,
				character.hit_dice_current +
					Math.max(1, Math.floor(character.hit_dice_max / 2)),
			),
			rift_favor_current: character.rift_favor_max,
			exhaustion_level: Math.max(0, character.exhaustion_level - 1),
			conditions: [], // Legacy sync
			gemini_state: {
				...characterState,
				conditions: clearConditionsOnLongRest(),
			} as never,
			death_save_successes: 0,
			death_save_failures: 0,
			stable: false,
		})
		.eq("id", characterId);

	// Reset long-rest AND short-rest recharge features (per 5e SRD, long rest also restores short-rest resources)
	const { data: features } = await supabase
		.from("character_features")
		.select("*")
		.eq("character_id", characterId)
		.in("recharge", ["long-rest", "short-rest"]);

	if (features && features.length > 0) {
		for (const feature of features) {
			if (feature.uses_max !== null) {
				await supabase
					.from("character_features")
					.update({ uses_current: feature.uses_max })
					.eq("id", feature.id);
			}
		}
	}

	// Reset encounter recharge features (they recharge on long rest too)
	const { data: encounterFeatures } = await supabase
		.from("character_features")
		.select("*")
		.eq("character_id", characterId)
		.eq("recharge", "encounter");

	if (encounterFeatures && encounterFeatures.length > 0) {
		for (const feature of encounterFeatures) {
			if (feature.uses_max !== null) {
				await supabase
					.from("character_features")
					.update({ uses_current: feature.uses_max })
					.eq("id", feature.id);
			}
		}
	}

	// Recover all spell slots on long rest
	try {
		const { data: slots } = await supabase
			.from("character_spell_slots")
			.select("*")
			.eq("character_id", characterId);

		if (slots && slots.length > 0) {
			for (const slot of slots) {
				await supabase
					.from("character_spell_slots")
					.update({ slots_current: slot.slots_max })
					.eq("id", slot.id);
			}
		}
	} catch (error) {
		logger.error("Failed to recover spell slots:", error);
		// Continue even if spell slot recovery fails
	}

	// Assign daily quests after long rest (if enabled)
	try {
		const { error } = await supabase.rpc("on_long_rest_assign_quests", {
			p_character_id: characterId,
		});
		if (error) {
			throw error;
		}
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Daily quests could not be assigned";
		logger.error("Failed to assign daily quests after long rest:", error);

		// Emit domain event even on partial failure
		try {
			const longRestEvent: RestLongEvent = {
				...buildCorePayload({
					characterId: character.id,
					characterName: character.name,
					className: character.job,
					pathName: character.path,
					level: character.level,
				}),
				type: "rest:long",
				hpRecovered: character.hp_max - character.hp_current,
				hitDiceRecovered: character.hit_dice_max - character.hit_dice_current,
				featuresRecharged: [
					...(features || []).map((f) => f.name),
					...(encounterFeatures || []).map((f) => f.name),
				],
				slotsRecovered: [],
				exhaustionReduced: character.exhaustion_level > 0,
				conditionsCleared: character.conditions || [],
			};
			DomainEventBus.emit(longRestEvent);
		} catch {
			// Best-effort
		}

		return { questAssignmentError: message };
	}

	// Emit domain event
	try {
		const longRestEvent: RestLongEvent = {
			...buildCorePayload({
				characterId: character.id,
				characterName: character.name,
				className: character.job,
				pathName: character.path,
				level: character.level,
			}),
			type: "rest:long",
			hpRecovered: character.hp_max - character.hp_current,
			hitDiceRecovered: character.hit_dice_max - character.hit_dice_current,
			featuresRecharged: [
				...(features || []).map((f) => f.name),
				...(encounterFeatures || []).map((f) => f.name),
			],
			slotsRecovered: [],
			exhaustionReduced: character.exhaustion_level > 0,
			conditionsCleared: character.conditions || [],
		};
		DomainEventBus.emit(longRestEvent);
	} catch {
		// Best-effort
	}

	return {};
}
