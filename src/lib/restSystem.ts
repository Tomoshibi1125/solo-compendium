/**
 * Rest system automation
 * Handles short rest and long rest resource restoration
 */

import { supabase } from "@/integrations/supabase/client";
import { normalizeGeminiState } from "@/lib/characterOverlayValidation";
import {
	buildCorePayload,
	DomainEventBus,
	type RestLongEvent,
	type RestShortEvent,
} from "@/lib/domainEvents";
import {
	getLocalCharacterState,
	isLocalCharacterId,
	listLocalFeatures,
	listLocalPowers,
	listLocalSpellSlots,
	listLocalSpells,
	listLocalTechniques,
	updateLocalCharacter,
	updateLocalFeature,
	updateLocalPower,
	updateLocalSpell,
	updateLocalSpellSlotRow,
	updateLocalTechnique,
} from "@/lib/guestStore";
import { AppError } from "./appError";
import { logger } from "./logger";

/**
 * Restore uses_current → uses_max for tracked per-ability power/technique rows
 * whose recharge matches this rest (5e-SRD per-ability use economy). Untracked
 * rows (uses_max NULL: cantrips, slot-cast jobs) are ignored.
 */
async function recoverTrackedAbilityUses(
	characterId: string,
	table: "character_powers" | "character_techniques",
	recharges: string[],
): Promise<void> {
	try {
		const { data: rows } = await supabase
			.from(table)
			.select("id, uses_max")
			.eq("character_id", characterId)
			.in("recharge", recharges);
		for (const row of rows ?? []) {
			if (row.uses_max !== null) {
				await supabase
					.from(table)
					.update({ uses_current: row.uses_max })
					.eq("id", row.id);
			}
		}
	} catch (error) {
		logger.error(`Failed to recover ${table} uses:`, error);
	}
}

/**
 * Guest (`local_`) branch of executeShortRest: mirrors the cloud logic
 * against the localStorage guest store. Every supabase call in the cloud
 * path 400s for a local id (the server has no such rows), which silently
 * made rests a no-op for guest characters.
 */
function executeShortRestLocal(characterId: string): void {
	const entry = getLocalCharacterState(characterId);
	if (!entry) throw new AppError("Ascendant not found", "NOT_FOUND");

	const recoveredSlotLevels: number[] = [];
	for (const feature of listLocalFeatures(characterId)) {
		if (feature.recharge === "short-rest" && feature.uses_max !== null) {
			updateLocalFeature(feature.id, { uses_current: feature.uses_max });
		}
	}
	for (const slot of listLocalSpellSlots(characterId)) {
		if (slot.slots_recovered_on_short_rest === 1) {
			updateLocalSpellSlotRow(slot.id, { slots_current: slot.slots_max });
			recoveredSlotLevels.push(slot.spell_level);
		}
	}
	for (const spell of listLocalSpells(characterId)) {
		if (spell.recharge === "short-rest" && spell.uses_max !== null) {
			updateLocalSpell(spell.id, { uses_current: spell.uses_max });
		}
	}
	for (const power of listLocalPowers(characterId)) {
		if (power.recharge === "short-rest" && power.uses_max !== null) {
			updateLocalPower(power.id, { uses_current: power.uses_max });
		}
	}
	for (const technique of listLocalTechniques(characterId)) {
		if (technique.recharge === "short-rest" && technique.uses_max !== null) {
			updateLocalTechnique(technique.id, { uses_current: technique.uses_max });
		}
	}

	try {
		const character = entry.character;
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
			featuresRecharged: listLocalFeatures(characterId)
				.filter((f) => f.recharge === "short-rest")
				.map((f) => f.name),
			slotsRecovered: recoveredSlotLevels,
		};
		DomainEventBus.emit(shortRestEvent);
	} catch {
		// Best-effort event emission
	}
}

/**
 * Execute short rest
 * - Does NOT restore hit dice (players may spend them to heal; hit dice
 *   return on a long rest, half of max rounded down)
 * - Reset short-rest recharge features, spells, and short-rest spell slots
 */
export async function executeShortRest(characterId: string): Promise<void> {
	if (isLocalCharacterId(characterId)) {
		executeShortRestLocal(characterId);
		return;
	}

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

	try {
		const { data: spells } = await supabase
			.from("character_spells")
			.select("*")
			.eq("character_id", characterId)
			.eq("recharge", "short-rest");

		if (spells && spells.length > 0) {
			for (const spell of spells) {
				if (spell.uses_max !== null) {
					await supabase
						.from("character_spells")
						.update({ uses_current: spell.uses_max })
						.eq("id", spell.id);
				}
			}
		}
	} catch (error) {
		logger.error("Failed to recover spell uses:", error);
	}

	// Recover per-ability power/technique uses that recharge on a short rest.
	await recoverTrackedAbilityUses(characterId, "character_powers", [
		"short-rest",
	]);
	await recoverTrackedAbilityUses(characterId, "character_techniques", [
		"short-rest",
	]);

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
 * Guest (`local_`) branch of executeLongRest: mirrors the cloud logic
 * against the localStorage guest store (no daily-quest RPC for guests).
 */
async function executeLongRestLocal(
	characterId: string,
): Promise<{ questAssignmentError?: string }> {
	const entry = getLocalCharacterState(characterId);
	if (!entry) throw new AppError("Ascendant not found", "NOT_FOUND");
	const character = entry.character;

	const characterState =
		(character.gemini_state as Record<string, unknown>) || {};
	const { clearConditionsOnLongRest } = await import("@/lib/conditionSystem");
	const geminiState = await normalizeGeminiState({
		...characterState,
		conditions: clearConditionsOnLongRest(),
	});

	updateLocalCharacter(characterId, {
		hp_current: character.hp_max,
		hit_dice_current: Math.min(
			character.hit_dice_max,
			character.hit_dice_current +
				Math.max(1, Math.floor(character.hit_dice_max / 2)),
		),
		rift_favor_current: character.rift_favor_max,
		exhaustion_level: Math.max(0, character.exhaustion_level - 1),
		conditions: [], // Legacy sync
		gemini_state: geminiState as never,
		death_save_successes: 0,
		death_save_failures: 0,
		stable: false,
	});

	// Long rest also restores short-rest and encounter resources (5e SRD).
	const rechargedFeatures: string[] = [];
	for (const feature of listLocalFeatures(characterId)) {
		if (
			["long-rest", "short-rest", "encounter"].includes(
				feature.recharge ?? "",
			) &&
			feature.uses_max !== null
		) {
			updateLocalFeature(feature.id, { uses_current: feature.uses_max });
			rechargedFeatures.push(feature.name);
		}
	}
	for (const slot of listLocalSpellSlots(characterId)) {
		updateLocalSpellSlotRow(slot.id, { slots_current: slot.slots_max });
	}
	for (const spell of listLocalSpells(characterId)) {
		if (
			["long-rest", "short-rest"].includes(spell.recharge ?? "") &&
			spell.uses_max !== null
		) {
			updateLocalSpell(spell.id, { uses_current: spell.uses_max });
		}
	}
	for (const power of listLocalPowers(characterId)) {
		if (
			["long-rest", "short-rest"].includes(power.recharge ?? "") &&
			power.uses_max !== null
		) {
			updateLocalPower(power.id, { uses_current: power.uses_max });
		}
	}
	for (const technique of listLocalTechniques(characterId)) {
		if (
			["long-rest", "short-rest"].includes(technique.recharge ?? "") &&
			technique.uses_max !== null
		) {
			updateLocalTechnique(technique.id, {
				uses_current: technique.uses_max,
			});
		}
	}

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
			featuresRecharged: rechargedFeatures,
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
	if (isLocalCharacterId(characterId)) {
		return executeLongRestLocal(characterId);
	}

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
	const geminiState = await normalizeGeminiState({
		...characterState,
		conditions: clearConditionsOnLongRest(),
	});

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
			gemini_state: geminiState as never,
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

	try {
		const { data: spells } = await supabase
			.from("character_spells")
			.select("*")
			.eq("character_id", characterId)
			.in("recharge", ["long-rest", "short-rest"]);

		if (spells && spells.length > 0) {
			for (const spell of spells) {
				if (spell.uses_max !== null) {
					await supabase
						.from("character_spells")
						.update({ uses_current: spell.uses_max })
						.eq("id", spell.id);
				}
			}
		}
	} catch (error) {
		logger.error("Failed to recover spell uses:", error);
	}

	// Recover per-ability power/technique uses on a long rest (long rest also
	// restores short-rest resources, per 5e SRD).
	await recoverTrackedAbilityUses(characterId, "character_powers", [
		"long-rest",
		"short-rest",
	]);
	await recoverTrackedAbilityUses(characterId, "character_techniques", [
		"long-rest",
		"short-rest",
	]);

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
