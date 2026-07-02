import { clientChannelName } from "@/lib/realtimeChannel";
/**
 * useVehicles — character-owned + campaign-owned vehicle hooks.
 *
 * Q7 of Round 3. Mirrors `useShadowSoldiers.ts` shape: list, add, HP,
 * conditions, notes. Vehicle stats hydrate from the canonical
 * compendium entry (`vehicleCatalog[vehicle_id]`); persistence stores
 * only the instance state (nickname, current HP, conditions, notes,
 * crew assignments).
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { allVehicleMods } from "@/data/compendium/vehicleMods";
import { allVehicles } from "@/data/compendium/vehicles";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";
import type {
	CompendiumVehicle,
	CompendiumVehicleMod,
	VehicleConditionState,
} from "@/types/compendium";

export interface CharacterVehicleRow {
	id: string;
	character_id: string;
	vehicle_id: string;
	nickname: string | null;
	current_hp: number;
	max_hp_override: number | null;
	conditions: Array<{ id: string; name: string; source?: string }>;
	condition_state: VehicleConditionState;
	installed_mod_ids: string[];
	vrp_cost_paid: number;
	notes: string | null;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface CharacterRequisitionProfile {
	id: string;
	character_id: string;
	total_vrp: number;
	spent_vrp: number;
	available_vrp: number;
	notes: string | null;
	created_at: string;
	updated_at: string;
}

const CHAR_KEY = (id: string) => ["character-vehicles", id] as const;
const REQ_KEY = (id: string) => ["character-requisition-profile", id] as const;
const PROFILE_TABLE = "character_requisition_profiles" as never;

const vehicleById = new Map<string, CompendiumVehicle>(
	allVehicles.map((vehicle) => [vehicle.id, vehicle]),
);

const modById = new Map<string, CompendiumVehicleMod>(
	allVehicleMods.map((mod) => [mod.id, mod]),
);

const DEFAULT_TOTAL_VRP = 3;

function getVehicleOrThrow(vehicleId: string): CompendiumVehicle {
	const vehicle = vehicleById.get(vehicleId);
	if (!vehicle) {
		throw new AppError(`Unknown vehicle catalog id: ${vehicleId}`, "NOT_FOUND");
	}
	return vehicle;
}

function getModOrThrow(modId: string): CompendiumVehicleMod {
	const mod = modById.get(modId);
	if (!mod) {
		throw new AppError(`Unknown vehicle mod id: ${modId}`, "NOT_FOUND");
	}
	return mod;
}

function isMount(vehicle: CompendiumVehicle): boolean {
	return vehicle.vehicle_type === "mount";
}

function defaultConditionFor(
	vehicle: CompendiumVehicle,
): VehicleConditionState {
	return isMount(vehicle) ? "calm" : "operational";
}

function getInstalledModIds(
	row: Pick<CharacterVehicleRow, "installed_mod_ids">,
) {
	return Array.isArray(row.installed_mod_ids) ? row.installed_mod_ids : [];
}

function getInstalledModCost(modIds: string[]): number {
	return modIds.reduce((total, modId) => {
		const mod = modById.get(modId);
		return total + (mod?.vrp_cost ?? 0);
	}, 0);
}

function getUsedModCapacity(modIds: string[]): number {
	return modIds.reduce((total, modId) => {
		const mod = modById.get(modId);
		return total + (mod?.capacity_cost ?? 0);
	}, 0);
}

function invalidateVehicles(
	queryClient: ReturnType<typeof useQueryClient>,
	characterId: string,
) {
	queryClient.invalidateQueries({ queryKey: CHAR_KEY(characterId) });
	queryClient.invalidateQueries({ queryKey: REQ_KEY(characterId) });
}

async function ensureRequisitionProfile(
	characterId: string,
): Promise<CharacterRequisitionProfile> {
	const { data, error } = await supabase
		.from(PROFILE_TABLE)
		.select("*")
		.eq("character_id", characterId)
		.maybeSingle();
	if (error) throw error;
	if (data) return data as unknown as CharacterRequisitionProfile;

	const { data: created, error: createError } = await supabase
		.from(PROFILE_TABLE)
		.insert({
			character_id: characterId,
			total_vrp: DEFAULT_TOTAL_VRP,
		} as never)
		.select("*")
		.single();
	if (createError) throw createError;
	return created as unknown as CharacterRequisitionProfile;
}

async function updateProfileSpent(
	characterId: string,
	delta: number,
): Promise<CharacterRequisitionProfile> {
	const profile = await ensureRequisitionProfile(characterId);
	if (delta === 0) return profile;
	if (delta > 0 && profile.available_vrp < delta) {
		throw new AppError(
			`Insufficient VRP: ${delta} required, ${profile.available_vrp} available.`,
			"INVALID_INPUT",
		);
	}

	const nextSpent = Math.max(
		0,
		Math.min(profile.total_vrp, profile.spent_vrp + delta),
	);
	const { data, error } = await supabase
		.from(PROFILE_TABLE)
		.update({ spent_vrp: nextSpent } as never)
		.eq("id", profile.id)
		.eq("spent_vrp", profile.spent_vrp)
		.select("*")
		.single();
	if (error) throw error;
	return data as unknown as CharacterRequisitionProfile;
}

async function getCharacterVehicleRow(
	vehicleLinkId: string,
): Promise<CharacterVehicleRow> {
	const { data, error } = await supabase
		.from("character_vehicles")
		.select("*")
		.eq("id", vehicleLinkId)
		.single();
	if (error) throw error;
	return data as unknown as CharacterVehicleRow;
}

export function useCharacterVehicles(characterId: string | undefined) {
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!characterId || !isSupabaseConfigured) return;
		const channel = supabase
			.channel(clientChannelName(`character-vehicles-${characterId}`))
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "character_vehicles",
					filter: `character_id=eq.${characterId}`,
				},
				() => {
					queryClient.invalidateQueries({ queryKey: CHAR_KEY(characterId) });
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [characterId, queryClient]);

	return useQuery({
		queryKey: characterId
			? CHAR_KEY(characterId)
			: ["character-vehicles", "_none"],
		queryFn: async () => {
			if (!characterId || !isSupabaseConfigured)
				return [] as CharacterVehicleRow[];
			const { data, error } = await supabase
				.from("character_vehicles")
				.select("*")
				.eq("character_id", characterId);
			if (error) throw error;
			return (data ?? []) as unknown as CharacterVehicleRow[];
		},
		enabled: !!characterId,
	});
}

export function useCharacterRequisitionProfile(
	characterId: string | undefined,
) {
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!characterId || !isSupabaseConfigured) return;
		const channel = supabase
			.channel(
				clientChannelName(`character-requisition-profile-${characterId}`),
			)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "character_requisition_profiles",
					filter: `character_id=eq.${characterId}`,
				},
				() => {
					queryClient.invalidateQueries({ queryKey: REQ_KEY(characterId) });
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [characterId, queryClient]);

	return useQuery({
		queryKey: characterId
			? REQ_KEY(characterId)
			: ["character-requisition-profile", "_none"],
		queryFn: async () => {
			if (!characterId || !isSupabaseConfigured) {
				return {
					id: "_local",
					character_id: characterId ?? "_none",
					total_vrp: DEFAULT_TOTAL_VRP,
					spent_vrp: 0,
					available_vrp: DEFAULT_TOTAL_VRP,
					notes: null,
					created_at: new Date(0).toISOString(),
					updated_at: new Date(0).toISOString(),
				} satisfies CharacterRequisitionProfile;
			}
			return ensureRequisitionProfile(characterId);
		},
		enabled: !!characterId,
	});
}

export function useAddCharacterVehicle() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			characterId: string;
			vehicleId: string;
			nickname?: string;
			initialHp: number;
		}) => {
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const vehicle = getVehicleOrThrow(input.vehicleId);
			const vrpCost = vehicle.vrp_cost ?? 0;
			if (vrpCost > 0) {
				await updateProfileSpent(input.characterId, vrpCost);
			}

			const { data, error } = await supabase
				.from("character_vehicles")
				.insert({
					character_id: input.characterId,
					vehicle_id: input.vehicleId,
					nickname: input.nickname ?? null,
					current_hp: input.initialHp,
					condition_state: defaultConditionFor(vehicle),
					installed_mod_ids: [],
					vrp_cost_paid: vrpCost,
				})
				.select()
				.single();
			if (error) {
				if (vrpCost > 0) await updateProfileSpent(input.characterId, -vrpCost);
				throw error;
			}
			return data as unknown as CharacterVehicleRow;
		},
		onSuccess: (_, variables) => {
			invalidateVehicles(queryClient, variables.characterId);
			toast({ title: "Vehicle added" });
		},
		onError: (error) => {
			toast({
				title: "Failed to add vehicle",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		},
	});
}

export function useUpdateCharacterVehicleHP() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			characterId: string;
			vehicleLinkId: string;
			currentHp: number;
		}) => {
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const { error } = await supabase
				.from("character_vehicles")
				.update({ current_hp: input.currentHp })
				.eq("id", input.vehicleLinkId);
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: CHAR_KEY(variables.characterId),
			});
		},
		onError: (error) => {
			toast({
				title: "Failed to update vehicle",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		},
	});
}

export function useUpdateCharacterVehicleCondition() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			characterId: string;
			vehicleLinkId: string;
			conditionState: VehicleConditionState;
		}) => {
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const { error } = await supabase
				.from("character_vehicles")
				.update({ condition_state: input.conditionState })
				.eq("id", input.vehicleLinkId);
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: CHAR_KEY(variables.characterId),
			});
		},
		onError: (error) => {
			toast({
				title: "Failed to update condition",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		},
	});
}

export function useInstallVehicleMod() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			characterId: string;
			vehicleLinkId: string;
			modId: string;
		}) => {
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const row = await getCharacterVehicleRow(input.vehicleLinkId);
			const vehicle = getVehicleOrThrow(row.vehicle_id);
			const mod = getModOrThrow(input.modId);
			const installed = getInstalledModIds(row);

			if (installed.includes(mod.id)) return row;
			if (mod.mod_type !== (isMount(vehicle) ? "mount" : "vehicle")) {
				throw new AppError(
					"That mod does not fit this vehicle type.",
					"INVALID_INPUT",
				);
			}
			if (
				vehicle.allowed_mod_categories?.length &&
				!vehicle.allowed_mod_categories.includes(mod.category)
			) {
				throw new AppError(
					`${mod.name} is not allowed on ${vehicle.name}.`,
					"INVALID_INPUT",
				);
			}

			const capacity = vehicle.mod_capacity ?? 0;
			const usedCapacity = getUsedModCapacity(installed);
			if (usedCapacity + mod.capacity_cost > capacity) {
				throw new AppError(
					`Insufficient mod capacity: ${mod.capacity_cost} required, ${Math.max(0, capacity - usedCapacity)} available.`,
					"INVALID_INPUT",
				);
			}

			if (mod.vrp_cost > 0) {
				await updateProfileSpent(input.characterId, mod.vrp_cost);
			}

			const nextInstalled = [...installed, mod.id];
			const { data, error } = await supabase
				.from("character_vehicles")
				.update({ installed_mod_ids: nextInstalled })
				.eq("id", input.vehicleLinkId)
				.select()
				.single();
			if (error) {
				if (mod.vrp_cost > 0) {
					await updateProfileSpent(input.characterId, -mod.vrp_cost);
				}
				throw error;
			}
			return data as unknown as CharacterVehicleRow;
		},
		onSuccess: (_, variables) => {
			invalidateVehicles(queryClient, variables.characterId);
			toast({ title: "Vehicle mod installed" });
		},
		onError: (error) => {
			toast({
				title: "Failed to install vehicle mod",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		},
	});
}

export function useRemoveVehicleMod() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			characterId: string;
			vehicleLinkId: string;
			modId: string;
		}) => {
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const row = await getCharacterVehicleRow(input.vehicleLinkId);
			const installed = getInstalledModIds(row);
			const nextInstalled = installed.filter((id) => id !== input.modId);
			if (nextInstalled.length === installed.length) return row;

			const { data, error } = await supabase
				.from("character_vehicles")
				.update({ installed_mod_ids: nextInstalled })
				.eq("id", input.vehicleLinkId)
				.select()
				.single();
			if (error) throw error;

			const mod = modById.get(input.modId);
			if (mod && mod.vrp_cost > 0) {
				await updateProfileSpent(input.characterId, -mod.vrp_cost);
			}

			return data as unknown as CharacterVehicleRow;
		},
		onSuccess: (_, variables) => {
			invalidateVehicles(queryClient, variables.characterId);
			toast({ title: "Vehicle mod removed" });
		},
		onError: (error) => {
			toast({
				title: "Failed to remove vehicle mod",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		},
	});
}

export function useDeleteCharacterVehicle() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			characterId: string;
			vehicleLinkId: string;
		}) => {
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const existing = await getCharacterVehicleRow(input.vehicleLinkId);
			const refund =
				(existing.vrp_cost_paid ?? 0) +
				getInstalledModCost(getInstalledModIds(existing));
			const { error } = await supabase
				.from("character_vehicles")
				.delete()
				.eq("id", input.vehicleLinkId);
			if (error) throw error;
			if (refund > 0) {
				await updateProfileSpent(input.characterId, -refund);
			}
		},
		onSuccess: (_, variables) => {
			invalidateVehicles(queryClient, variables.characterId);
		},
		onError: (error) => {
			toast({
				title: "Failed to remove vehicle",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		},
	});
}
