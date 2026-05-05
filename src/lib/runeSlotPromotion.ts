import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
	isLocalCharacterId,
	listLocalFeatures,
	listLocalSpellSlots,
	listLocalSpells,
	updateLocalFeature,
	updateLocalSpell,
	upsertLocalSpellSlot,
} from "@/lib/guestStore";

type FeatureRow = Database["public"]["Tables"]["character_features"]["Row"];
type RuneFeatureModifiers = Record<string, unknown>;

function getRuneModifiers(feature: FeatureRow): RuneFeatureModifiers | null {
	const modifiers = feature.modifiers;
	if (!modifiers || typeof modifiers !== "object" || Array.isArray(modifiers)) {
		return null;
	}
	return modifiers as RuneFeatureModifiers;
}

function isPromotableRuneSpellFeature(
	feature: FeatureRow,
	newLevel: number,
): boolean {
	const modifiers = getRuneModifiers(feature);
	if (!modifiers) return false;
	return (
		modifiers.acquired_via === "rune" &&
		modifiers.ability_kind === "spell" &&
		modifiers.rune_grant_slot_state === "dedicated" &&
		typeof modifiers.rune_grant_ability_level === "number" &&
		typeof modifiers.rune_grant_promotes_at_level === "number" &&
		modifiers.rune_grant_promotes_at_level <= newLevel
	);
}

function promoteModifiers(
	modifiers: RuneFeatureModifiers,
): RuneFeatureModifiers {
	return {
		...modifiers,
		rune_grant_slot_state: "general",
		rune_grant_under_level: false,
		rune_grant_dedicated_ref: null,
	};
}

async function promoteRemoteRuneSpellFeature(
	characterId: string,
	feature: FeatureRow,
): Promise<void> {
	const modifiers = getRuneModifiers(feature);
	if (!modifiers || typeof modifiers.rune_grant_ability_level !== "number") {
		return;
	}
	const spellLevel = modifiers.rune_grant_ability_level;
	await supabase
		.from("character_spells")
		.update({ uses_max: null, uses_current: null, recharge: null })
		.eq("character_id", characterId)
		.eq("source", feature.source);
	const { data: existingSlot, error: existingError } = await supabase
		.from("character_spell_slots")
		.select("*")
		.eq("character_id", characterId)
		.eq("spell_level", spellLevel)
		.maybeSingle();
	if (existingError) throw existingError;
	if (existingSlot) {
		const { error } = await supabase
			.from("character_spell_slots")
			.update({
				slots_max: (existingSlot.slots_max ?? 0) + 1,
				slots_current: (existingSlot.slots_current ?? 0) + 1,
			})
			.eq("id", existingSlot.id);
		if (error) throw error;
	} else {
		const { error } = await supabase.from("character_spell_slots").insert({
			character_id: characterId,
			spell_level: spellLevel,
			slots_max: 1,
			slots_current: 1,
			slots_recovered_on_short_rest: 0,
			slots_recovered_on_long_rest: 1,
		});
		if (error) throw error;
	}
	const { error: featureError } = await supabase
		.from("character_features")
		.update({
			modifiers: promoteModifiers(modifiers) as FeatureRow["modifiers"],
		})
		.eq("id", feature.id);
	if (featureError) throw featureError;
}

function promoteLocalRuneSpellFeature(
	characterId: string,
	feature: FeatureRow,
): void {
	const modifiers = getRuneModifiers(feature);
	if (!modifiers || typeof modifiers.rune_grant_ability_level !== "number") {
		return;
	}
	const spellLevel = modifiers.rune_grant_ability_level;
	for (const spell of listLocalSpells(characterId)) {
		if (spell.source === feature.source) {
			updateLocalSpell(spell.id, {
				uses_max: null,
				uses_current: null,
				recharge: null,
			});
		}
	}
	const existingSlot = listLocalSpellSlots(characterId).find(
		(slot) => slot.spell_level === spellLevel,
	);
	upsertLocalSpellSlot(characterId, {
		spell_level: spellLevel,
		slots_max: (existingSlot?.slots_max ?? 0) + 1,
		slots_current: (existingSlot?.slots_current ?? 0) + 1,
		slots_recovered_on_short_rest:
			existingSlot?.slots_recovered_on_short_rest ?? 0,
		slots_recovered_on_long_rest:
			existingSlot?.slots_recovered_on_long_rest ?? 1,
	});
	updateLocalFeature(feature.id, {
		modifiers: promoteModifiers(modifiers) as FeatureRow["modifiers"],
	});
}

function countGeneralRuneSpellSlotBonuses(
	features: FeatureRow[],
): Map<number, number> {
	const bonuses = new Map<number, number>();
	for (const feature of features) {
		const modifiers = getRuneModifiers(feature);
		if (
			modifiers?.acquired_via !== "rune" ||
			modifiers.ability_kind !== "spell" ||
			modifiers.rune_grant_slot_state !== "general" ||
			typeof modifiers.rune_grant_ability_level !== "number"
		) {
			continue;
		}
		const level = modifiers.rune_grant_ability_level;
		bonuses.set(level, (bonuses.get(level) ?? 0) + 1);
	}
	return bonuses;
}

export async function promoteRuneGrantedSpellSlotsForLevel(
	characterId: string,
	newLevel: number,
): Promise<void> {
	if (isLocalCharacterId(characterId)) {
		for (const feature of listLocalFeatures(characterId) as FeatureRow[]) {
			if (isPromotableRuneSpellFeature(feature, newLevel)) {
				promoteLocalRuneSpellFeature(characterId, feature);
			}
		}
		return;
	}
	const { data: features, error } = await supabase
		.from("character_features")
		.select("*")
		.eq("character_id", characterId);
	if (error) throw error;
	for (const feature of (features ?? []) as FeatureRow[]) {
		if (isPromotableRuneSpellFeature(feature, newLevel)) {
			await promoteRemoteRuneSpellFeature(characterId, feature);
		}
	}
}

export async function getRuneGrantedGeneralSpellSlotBonuses(
	characterId: string,
): Promise<Map<number, number>> {
	if (isLocalCharacterId(characterId)) {
		return countGeneralRuneSpellSlotBonuses(
			listLocalFeatures(characterId) as FeatureRow[],
		);
	}
	const { data: features, error } = await supabase
		.from("character_features")
		.select("*")
		.eq("character_id", characterId);
	if (error) throw error;
	return countGeneralRuneSpellSlotBonuses((features ?? []) as FeatureRow[]);
}
