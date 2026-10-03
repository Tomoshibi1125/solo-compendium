/**
 * Companion rests (RA-10): a companion rests with its character, by the
 * character's rules. The server applies the Long Rest after the character's
 * own (`rest_companions_for_character`, called from `restSystem.ts`); on a
 * Short Rest the owner spends a level-scaled companion's Hit Dice from the
 * same dialog the character uses.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCharacterExtras } from "@/hooks/useCharacterExtras";
import {
	invalidateCharacterCompanions,
	useCharacterCompanionInstances,
} from "@/hooks/useCompanionInstances";
import { useCharacterVehicles } from "@/hooks/useVehicles";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import {
	companionHitDicePool,
	companionScalingCharacterId,
	companionSourceName,
	scaleCompanionInstance,
} from "@/lib/companionScaling";

export interface CompanionShortRestTarget {
	instanceId: string;
	name: string;
	hitDie: number;
	hitDiceMax: number;
	hitDiceAvailable: number;
	hpCurrent: number;
	hpMax: number;
}

export interface CompanionHitDiceSpend {
	instanceId: string;
	diceSpent: number;
	hpRecovered: number;
}

const finiteNumber = (value: unknown): number | null =>
	typeof value === "number" && Number.isFinite(value) ? value : null;

/**
 * The level-scaled companions that scale with this character, with the Hit
 * Dice its Short Rest can spend. Companions that keep their saved stats have
 * no Hit Dice and are left out.
 */
export function useCompanionShortRestTargets(
	characterId: string,
	characterLevel: number,
): CompanionShortRestTarget[] {
	const { data: instances = [] } = useCharacterCompanionInstances(characterId);
	const { data: vehicles = [] } = useCharacterVehicles(characterId);
	const { extras } = useCharacterExtras(characterId);

	return useMemo(() => {
		const targets: CompanionShortRestTarget[] = [];
		for (const instance of instances) {
			if (companionScalingCharacterId(instance) !== characterId) continue;
			const scaling = scaleCompanionInstance(instance, characterLevel);
			const pool = companionHitDicePool(instance, scaling);
			if (!scaling || !pool) continue;
			const extra =
				instance.origin_table === "character_extras"
					? extras.find((row) => row.id === instance.origin_row_id)
					: undefined;
			const vehicle =
				instance.origin_table === "character_vehicles"
					? vehicles.find((row) => row.id === instance.origin_row_id)
					: undefined;
			const state = (instance.combat_state ?? {}) as Record<string, unknown>;
			const hp =
				finiteNumber(extra?.hp_current) ??
				finiteNumber(vehicle?.current_hp) ??
				finiteNumber(state.hp) ??
				scaling.hpMax;
			targets.push({
				instanceId: instance.id,
				name: extra?.name || vehicle?.nickname || companionSourceName(instance),
				hitDie: pool.die,
				hitDiceMax: pool.max,
				hitDiceAvailable: pool.available,
				hpCurrent: Math.min(scaling.hpMax, Math.max(0, hp)),
				hpMax: scaling.hpMax,
			});
		}
		return targets;
	}, [instances, vehicles, extras, characterId, characterLevel]);
}

/** Spend a companion's rolled Hit Dice at the end of a Short Rest. */
export function useSpendCompanionHitDice(characterId: string) {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (spend: CompanionHitDiceSpend): Promise<void> => {
			if (!isSupabaseConfigured) throw new Error("Backend not configured.");
			const { error } = await supabase.rpc("spend_companion_hit_dice", {
				p_companion_instance_id: spend.instanceId,
				p_dice: spend.diceSpent,
				p_hp_recovered: spend.hpRecovered,
			});
			if (error) throw new Error(error.message);
		},
		onSettled: () => invalidateCharacterCompanions(queryClient, characterId),
		onError: (error: Error) => {
			toast({
				title: "Companion Hit Dice not spent",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}
