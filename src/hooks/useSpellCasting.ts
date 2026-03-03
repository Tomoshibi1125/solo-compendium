/**
 * Spell Casting Hook (with Upcast + Ritual support)
 *
 * D&D Beyond parity:
 *  - Cast a spell at its base level or upcast at a higher level
 *  - Ritual casting: cast without expending a slot (takes 10 extra minutes)
 *  - Concentration: auto-drops previous concentration when casting a new one
 *  - Slot consumption: cantrips (level 0) never consume slots
 *  - Validates slot availability before casting
 */

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { SpellSlotData } from "@/hooks/useSpellSlots";
import { supabase } from "@/integrations/supabase/client";
import {
	buildCorePayload,
	DomainEventBus,
	type SpellCastEvent,
} from "@/lib/domainEvents";
import {
	isLocalCharacterId,
	listLocalSpellSlots,
	updateLocalSpellSlotRow,
} from "@/lib/guestStore";
import {
	type ActiveSpellEffectEntry,
	createActiveSpellEffect,
	hasKnownEffects,
} from "@/lib/spellEffectPipeline";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CastableSpell {
	id: string;
	name: string;
	level: number; // 0 = cantrip
	type?: "Attack" | "Defense" | "Utility" | "Healing";
	rank?: "D" | "C" | "B" | "A" | "S";
	isRitual: boolean;
	isConcentration: boolean;
	castingTime: string | null;
	range: string | null;
	duration: string | null;
	description: string | null;
	higherLevels: string | null;
}

export interface CastSpellParams {
	spell: CastableSpell;
	castAtLevel?: number; // for upcasting; defaults to spell.level
	asRitual?: boolean; // cast as ritual (no slot consumed)
	characterId: string;
	characterName: string;
	jobName: string | null;
	pathName: string | null;
	level: number;
	campaignId: string | null;
}

export interface CastSpellResult {
	success: boolean;
	slotExpended: boolean;
	castAtLevel: number;
	message: string;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSpellCasting(
	spellSlots: SpellSlotData[],
	onConcentrationStart?: (spellName: string, duration: number) => void,
	onConcentrationDrop?: () => void,
) {
	const queryClient = useQueryClient();

	const canCast = useCallback(
		(
			spell: CastableSpell,
			castAtLevel?: number,
			asRitual?: boolean,
		): { allowed: boolean; reason: string } => {
			// Cantrips always castable
			if (spell.level === 0) {
				return {
					allowed: true,
					reason: "Cantrips do not consume spell slots.",
				};
			}

			// Ritual casting doesn't need a slot
			if (asRitual && spell.isRitual) {
				return {
					allowed: true,
					reason: "Ritual casting does not consume a spell slot.",
				};
			}

			const targetLevel = castAtLevel ?? spell.level;

			// Cannot downcast
			if (targetLevel < spell.level) {
				return {
					allowed: false,
					reason: `Cannot cast at a level lower than the spell's base level (${spell.level}).`,
				};
			}

			// Check slot availability
			const slot = spellSlots.find((s) => s.level === targetLevel);
			if (!slot || slot.current <= 0) {
				return {
					allowed: false,
					reason: `No level ${targetLevel} spell slots remaining.`,
				};
			}

			return { allowed: true, reason: `Casting at level ${targetLevel}.` };
		},
		[spellSlots],
	);

	const castSpell = useCallback(
		async (params: CastSpellParams): Promise<CastSpellResult> => {
			const {
				spell,
				castAtLevel: requestedLevel,
				asRitual,
				characterId,
			} = params;
			const castAtLevel = requestedLevel ?? spell.level;

			// Cantrips
			if (spell.level === 0) {
				emitCastEvent(params, castAtLevel, false);
				return {
					success: true,
					slotExpended: false,
					castAtLevel: 0,
					message: `Cast ${spell.name} (cantrip).`,
				};
			}

			// Ritual casting
			if (asRitual && spell.isRitual) {
				if (spell.isConcentration) {
					onConcentrationDrop?.();
					onConcentrationStart?.(spell.name, 600); // 10 minutes = ~100 rounds
				}
				emitCastEvent(params, castAtLevel, false, true);
				return {
					success: true,
					slotExpended: false,
					castAtLevel,
					message: `Cast ${spell.name} as a ritual (no slot used).`,
				};
			}

			// Validate
			const check = canCast(spell, castAtLevel, asRitual);
			if (!check.allowed) {
				return {
					success: false,
					slotExpended: false,
					castAtLevel,
					message: check.reason,
				};
			}

			// Consume slot
			try {
				if (isLocalCharacterId(characterId)) {
					const localSlots = listLocalSpellSlots(characterId);
					const targetSlot = localSlots.find(
						(s) => s.spell_level === castAtLevel,
					);
					if (targetSlot && targetSlot.slots_current > 0) {
						updateLocalSpellSlotRow(targetSlot.id, {
							slots_current: targetSlot.slots_current - 1,
						});
					}
				} else {
					const { data: slot } = await supabase
						.from("character_spell_slots")
						.select("id, slots_current")
						.eq("character_id", characterId)
						.eq("spell_level", castAtLevel)
						.single();

					if (slot && slot.slots_current > 0) {
						await supabase
							.from("character_spell_slots")
							.update({ slots_current: slot.slots_current - 1 })
							.eq("id", slot.id);
					}
				}

				queryClient.invalidateQueries({
					queryKey: ["spell-slots", characterId],
				});
			} catch {
				return {
					success: false,
					slotExpended: false,
					castAtLevel,
					message: "Failed to consume spell slot.",
				};
			}

			// Handle concentration
			if (spell.isConcentration) {
				onConcentrationDrop?.();
				onConcentrationStart?.(spell.name, 100); // ~10 rounds default
			}

			emitCastEvent(params, castAtLevel, true);

			const upcastNote =
				castAtLevel > spell.level ? ` (upcast at level ${castAtLevel})` : "";
			return {
				success: true,
				slotExpended: true,
				castAtLevel,
				message: `Cast ${spell.name}${upcastNote}. Level ${castAtLevel} slot consumed.`,
			};
		},
		[canCast, queryClient, onConcentrationStart, onConcentrationDrop],
	);

	/**
	 * Get available upcast levels for a spell.
	 */
	const getUpcastLevels = useCallback(
		(spell: CastableSpell): number[] => {
			if (spell.level === 0) return [];
			const levels: number[] = [];
			for (let lvl = spell.level; lvl <= 9; lvl++) {
				const slot = spellSlots.find((s) => s.level === lvl);
				if (slot && slot.current > 0) {
					levels.push(lvl);
				}
			}
			return levels;
		},
		[spellSlots],
	);

	return { canCast, castSpell, getUpcastLevels };
}

// ---------------------------------------------------------------------------
// Spell effect pipeline helper — creates ActiveSpellEffectEntry for stat tracking
// ---------------------------------------------------------------------------

/**
 * Create an active spell effect entry if the spell has known mechanical effects.
 * This feeds into computeCharacterStats() so buff/debuff spells auto-apply
 * stat modifiers (AC, attack, speed, etc.) — full DDB/Foundry parity.
 */
export function buildActiveSpellEffectEntry(
	spellName: string,
	casterId: string,
	targetId: string,
	isConcentration: boolean,
	durationRounds: number | null,
): ActiveSpellEffectEntry | null {
	if (!hasKnownEffects(spellName)) return null;
	return createActiveSpellEffect(
		spellName,
		casterId,
		targetId,
		isConcentration,
		durationRounds,
	);
}

// ---------------------------------------------------------------------------
// Domain event helper
// ---------------------------------------------------------------------------

function emitCastEvent(
	params: CastSpellParams,
	castAtLevel: number,
	slotExpended: boolean,
	isRitual = false,
) {
	try {
		const event: SpellCastEvent = {
			...buildCorePayload({
				characterId: params.characterId,
				characterName: params.characterName,
				className: params.jobName,
				pathName: params.pathName,
				level: params.level,
				campaignId: params.campaignId,
			}),
			type: "spell:cast",
			spellName: params.spell.name,
			spellLevel: params.spell.level,
			castAtLevel,
			slotExpended,
			isRitual,
			isConcentration: params.spell.isConcentration,
		};
		DomainEventBus.emit(event);
	} catch {
		// Best-effort
	}
}
