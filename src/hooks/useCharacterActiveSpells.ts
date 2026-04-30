/**
 * Active Spell Effects Hook (DDB / Foundry parity)
 *
 * Reads & writes the `character_active_spells` table — the source of truth
 * for spells whose mechanical effects (Bless, Shield of Faith, Haste, …)
 * should auto-apply to a character's computed stats.
 *
 * Pipeline (full parity):
 *   useSpellCasting.castSpell()
 *     → buildActiveSpellEffectEntry()  (when hasKnownEffects)
 *     → useAddActiveSpell.mutate()     (this module — persists row)
 *     → query invalidation             (derived-stats picks up the new effects)
 *
 *   useConcentration.onConcentrationLost()
 *     → useRemoveActiveSpellByName.mutate()  (cleans up the dropped buff)
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import type { CustomModifier } from "@/lib/customModifiers";
import { isLocalCharacterId } from "@/lib/guestStore";
import type {
	ActiveSpellEffectEntry,
	SpellModifier,
} from "@/lib/spellEffectPipeline";

export type ActiveSpellRow =
	Database["public"]["Tables"]["character_active_spells"]["Row"];
type ActiveSpellInsert =
	Database["public"]["Tables"]["character_active_spells"]["Insert"];

const ACTIVE_SPELLS_QUERY_KEY = "character-active-spells";

/** Read all active spells currently affecting a character. */
export function useCharacterActiveSpells(characterId: string | undefined) {
	return useQuery({
		queryKey: [ACTIVE_SPELLS_QUERY_KEY, characterId],
		queryFn: async (): Promise<ActiveSpellRow[]> => {
			if (!characterId || isLocalCharacterId(characterId)) return [];
			const { data, error } = await supabase
				.from("character_active_spells")
				.select("*")
				.eq("character_id", characterId)
				.order("cast_at", { ascending: true });
			if (error) throw error;
			return (data || []) as ActiveSpellRow[];
		},
		enabled: !!characterId,
	});
}

interface AddActiveSpellArgs {
	characterId: string;
	entry: ActiveSpellEffectEntry;
	/** Slot level the spell was cast at (matters for upcasting). */
	castAtLevel: number;
}

/** Insert a new active-spell row from a `buildActiveSpellEffectEntry` result. */
export function useAddActiveSpell() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({
			characterId,
			entry,
			castAtLevel,
		}: AddActiveSpellArgs) => {
			if (isLocalCharacterId(characterId)) return null;
			const insert: ActiveSpellInsert = {
				character_id: characterId,
				spell_id: entry.spellId,
				spell_name: entry.spellName,
				level: castAtLevel,
				concentration: entry.concentration,
				duration_value: entry.durationRounds,
				duration_type: entry.durationRounds == null ? null : "rounds",
				effects: entry.effects as unknown as Json[],
				cast_at: entry.appliedAt,
			};
			const { data, error } = await supabase
				.from("character_active_spells")
				.insert(insert)
				.select()
				.single();
			if (error) throw error;
			return data;
		},
		onSuccess: (_data, vars) => {
			qc.invalidateQueries({
				queryKey: [ACTIVE_SPELLS_QUERY_KEY, vars.characterId],
			});
			qc.invalidateQueries({ queryKey: ["character", vars.characterId] });
		},
	});
}

interface RemoveActiveSpellByNameArgs {
	characterId: string;
	spellName: string;
}

/** Remove all active-spell rows matching a given spell name. */
export function useRemoveActiveSpellByName() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({
			characterId,
			spellName,
		}: RemoveActiveSpellByNameArgs) => {
			if (isLocalCharacterId(characterId)) return;
			const { error } = await supabase
				.from("character_active_spells")
				.delete()
				.eq("character_id", characterId)
				.eq("spell_name", spellName);
			if (error) throw error;
		},
		onSuccess: (_data, vars) => {
			qc.invalidateQueries({
				queryKey: [ACTIVE_SPELLS_QUERY_KEY, vars.characterId],
			});
			qc.invalidateQueries({ queryKey: ["character", vars.characterId] });
		},
	});
}

/** Remove ALL concentration spells for a caster (e.g. on long rest, KO). */
export function useRemoveConcentrationSpells() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (characterId: string) => {
			if (isLocalCharacterId(characterId)) return;
			const { error } = await supabase
				.from("character_active_spells")
				.delete()
				.eq("character_id", characterId)
				.eq("concentration", true);
			if (error) throw error;
		},
		onSuccess: (_data, characterId) => {
			qc.invalidateQueries({
				queryKey: [ACTIVE_SPELLS_QUERY_KEY, characterId],
			});
			qc.invalidateQueries({ queryKey: ["character", characterId] });
		},
	});
}

// ---------------------------------------------------------------------------
// Active-spell → CustomModifier projection
// ---------------------------------------------------------------------------

const ABILITY_TARGETS = new Set(["str", "agi", "vit", "int", "sense", "pre"]);

/**
 * Convert a single spell effect modifier into a `CustomModifier` (or null
 * when the target shape isn't representable as one — e.g. "set" effects
 * like Mage Armor that override AC formulas; those need engine-level
 * handling and are intentionally skipped here).
 */
function projectEffect(
	spellName: string,
	effect: SpellModifier,
	index: number,
): CustomModifier | null {
	const id = `spell:${spellName.toLowerCase()}:${effect.target}:${index}`;
	const baseSource = `Spell: ${spellName}`;
	const target = effect.target.toLowerCase();

	// Advantage / disadvantage projections (target groups by canonical names
	// already used in resolveAdvantageFromCustomModifiers consumers).
	if (effect.type === "advantage" || effect.type === "disadvantage") {
		// Map spell pipeline targets onto the customModifier target keys
		// already used elsewhere in the codebase.
		const advTarget =
			target === "attack_rolls"
				? "attack"
				: target === "saving_throws"
					? "save"
					: target === "ability_checks"
						? "skill"
						: target;
		return {
			id,
			type: effect.type,
			target: advTarget,
			value: 0,
			source: baseSource,
			condition: null,
			enabled: true,
		};
	}

	// "set" effects (e.g. Mage Armor → AC = 13 + AGI) cannot be expressed as
	// flat customModifiers; skip and leave to engine-level handling.
	if (effect.type === "set") return null;

	const sign = effect.type === "penalty" ? -1 : 1;
	const value = sign * effect.value;

	switch (target) {
		case "ac":
			return {
				id,
				type: "ac_bonus",
				target: null,
				value,
				source: baseSource,
				condition: null,
				enabled: true,
			};
		case "speed":
			return {
				id,
				type: "speed",
				target: null,
				value,
				source: baseSource,
				condition: null,
				enabled: true,
			};
		case "initiative":
			return {
				id,
				type: "initiative_bonus",
				target: null,
				value,
				source: baseSource,
				condition: null,
				enabled: true,
			};
		case "attack_rolls":
			return {
				id,
				type: "attack_bonus",
				target: null,
				value,
				source: baseSource,
				condition: null,
				enabled: true,
			};
		case "damage":
			return {
				id,
				type: "damage_bonus",
				target: null,
				value,
				source: baseSource,
				condition: null,
				enabled: true,
			};
		case "saving_throws":
			// Untargeted save bonus = "all saves"
			return {
				id,
				type: "save_bonus",
				target: null,
				value,
				source: baseSource,
				condition: null,
				enabled: true,
			};
		case "ability_checks":
			// Approximate: apply as a global skill bonus.
			return {
				id,
				type: "skill_bonus",
				target: "*",
				value,
				source: baseSource,
				condition: null,
				enabled: true,
			};
		case "hp_max":
			return {
				id,
				type: "hp-max",
				target: null,
				value,
				source: baseSource,
				condition: null,
				enabled: true,
			};
		case "hp_temp":
			return {
				id,
				type: "hp-temp",
				target: null,
				value,
				source: baseSource,
				condition: null,
				enabled: true,
			};
		case "str_save":
		case "agi_save":
		case "vit_save":
		case "int_save":
		case "sense_save":
		case "pre_save": {
			const ability = target.split("_")[0].toUpperCase();
			return {
				id,
				type: "save",
				target: ability,
				value,
				source: baseSource,
				condition: null,
				enabled: true,
			};
		}
		default:
			if (ABILITY_TARGETS.has(target)) {
				return {
					id,
					type: "ability_bonus",
					target: target.toUpperCase(),
					value,
					source: baseSource,
					condition: null,
					enabled: true,
				};
			}
			return null;
	}
}

/**
 * Project the persisted `character_active_spells` rows into `CustomModifier[]`
 * so the existing derived-stats pipeline (which already aggregates custom
 * modifiers) picks up Bless / Shield / Haste / etc. without engine surgery.
 */
export function activeSpellsToCustomModifiers(
	rows: ActiveSpellRow[],
): CustomModifier[] {
	const result: CustomModifier[] = [];
	for (const row of rows) {
		const rawEffects = (row.effects as unknown as SpellModifier[] | null) ?? [];
		for (let i = 0; i < rawEffects.length; i++) {
			const cm = projectEffect(row.spell_name, rawEffects[i], i);
			if (cm) result.push(cm);
		}
	}
	return result;
}
