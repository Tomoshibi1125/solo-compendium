import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";

function mapCanonicalToShadowSoldier(
	entry: Record<string, unknown>,
): ShadowSoldier {
	const abilitiesRaw =
		(entry.Anomaly_actions as Array<Record<string, unknown>> | undefined) ||
		(entry.actions as Array<Record<string, unknown>> | undefined) ||
		[];
	const abilities: ShadowSoldierAbility[] = abilitiesRaw.map((a) => ({
		name: String(a.name ?? ""),
		description: String(a.description ?? ""),
		action_type: String(a.action_type ?? "action"),
		...a,
	}));
	const rank = String(
		(entry.rank as string | undefined) ??
			(entry.gate_rank as string | undefined) ??
			"C",
	);
	return {
		id: String(entry.id ?? ""),
		name: String(entry.name ?? ""),
		title: String(
			(entry.title as string | null | undefined) ??
				(entry.role as string | undefined) ??
				"",
		),
		rank,
		description: String(entry.description ?? ""),
		lore: (entry.lore as string | null | undefined) ?? null,
		str: Number((entry.str as number | undefined) ?? 10),
		agi: Number((entry.agi as number | undefined) ?? 10),
		vit: Number((entry.vit as number | undefined) ?? 10),
		int: Number((entry.int as number | undefined) ?? 10),
		sense: Number((entry.sense as number | undefined) ?? 10),
		pre: Number((entry.pre as number | undefined) ?? 10),
		armor_class: Number((entry.armor_class as number | undefined) ?? 10),
		hit_points: Number(
			(entry.hit_points as number | undefined) ??
				(entry.hit_points_average as number | undefined) ??
				1,
		),
		speed: Number((entry.speed_walk as number | undefined) ?? 30),
		damage_immunities:
			(entry.damage_immunities as string[] | null | undefined) ?? [],
		condition_immunities:
			(entry.condition_immunities as string[] | null | undefined) ?? [],
		abilities,
		summon_requirements:
			(entry.summon_requirements as string | null | undefined) ?? null,
		shadow_type: String(
			(entry.shadow_type as string | undefined) ??
				(entry.role as string | undefined) ??
				"shadow",
		),
	};
}

export interface ShadowSoldierAbility {
	[key: string]: Json | undefined;
	name: string;
	description: string;
	action_type: string;
}

export interface ShadowSoldier {
	id: string;
	name: string;
	title: string;
	rank: string;
	description: string;
	lore: string | null;
	str: number;
	agi: number;
	vit: number;
	int: number;
	sense: number;
	pre: number;
	armor_class: number;
	hit_points: number;
	speed: number;
	damage_immunities: string[];
	condition_immunities: string[];
	abilities: ShadowSoldierAbility[];
	summon_requirements: string | null;
	shadow_type: string;
}

export function useCompendiumShadowSoldiers() {
	return useQuery({
		queryKey: ["compendium-shadow-soldiers"],
		queryFn: async () => {
			const entries = await listCanonicalEntries("shadow-soldiers");
			const rankOrder = ["S", "A", "B", "C", "D", "E"];
			return entries
				.slice()
				.sort((a, b) => {
					const aR = rankOrder.indexOf(
						(a.rank as string) ?? (a.gate_rank as string) ?? "",
					);
					const bR = rankOrder.indexOf(
						(b.rank as string) ?? (b.gate_rank as string) ?? "",
					);
					const aIdx = aR === -1 ? rankOrder.length : aR;
					const bIdx = bR === -1 ? rankOrder.length : bR;
					if (aIdx !== bIdx) return aIdx - bIdx;
					return a.name.localeCompare(b.name);
				})
				.map((entry) =>
					mapCanonicalToShadowSoldier(
						entry as unknown as Record<string, unknown>,
					),
				);
		},
	});
}

export function useCharacterShadowSoldiers(characterId: string | undefined) {
	return useQuery({
		queryKey: ["character-shadow-soldiers", characterId],
		queryFn: async () => {
			if (!characterId)
				return [] as Array<
					Database["public"]["Tables"]["character_shadow_soldiers"]["Row"] & {
						soldier?: ShadowSoldier;
					}
				>;

			const { data, error } = await supabase
				.from("character_shadow_soldiers")
				.select("*")
				.eq("character_id", characterId);

			if (error) throw error;
			const rows = (data || []) as Array<
				Database["public"]["Tables"]["character_shadow_soldiers"]["Row"]
			>;

			const entries = await listCanonicalEntries("shadow-soldiers");
			const byId = new Map<string, ShadowSoldier>();
			for (const entry of entries) {
				byId.set(
					entry.id,
					mapCanonicalToShadowSoldier(
						entry as unknown as Record<string, unknown>,
					),
				);
			}

			return rows.map((css) => ({
				...css,
				soldier: byId.get(css.soldier_id) ?? undefined,
			}));
		},
		enabled: !!characterId,
	});
}

export function useExtractShadowSoldier() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: {
			characterId: string;
			soldierId: string;
			nickname?: string;
		}) => {
			// Resolve soldier from canonical static by id.
			const canonicalEntries = await listCanonicalEntries("shadow-soldiers");
			const canonicalEntry = canonicalEntries.find(
				(e) => e.id === params.soldierId,
			);
			if (!canonicalEntry) throw new AppError("Soldier not found", "NOT_FOUND");
			const soldier = mapCanonicalToShadowSoldier(
				canonicalEntry as unknown as Record<string, unknown>,
			);

			const { data, error } = await supabase
				.from("character_shadow_soldiers")
				.insert({
					character_id: params.characterId,
					soldier_id: params.soldierId,
					nickname: params.nickname || null,
					current_hp: soldier.hit_points,
					is_summoned: false,
					bond_level: 1,
				})
				.select("*")
				.single();

			if (error) throw error;
			return {
				...data,
				soldier,
				soldierName: soldier.name,
			};
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character-shadow-soldiers", variables.characterId],
			});
			toast({
				title: "Umbral Extraction Complete!",
				description: `${data.soldierName} has joined your Umbral Legion.`,
			});
		},
		onError: (error) => {
			toast({
				title: "Extraction Failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useToggleSummon() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: {
			characterId: string;
			shadowSoldierId: string;
			summon: boolean;
		}) => {
			const { data, error } = await supabase
				.from("character_shadow_soldiers")
				.update({ is_summoned: params.summon })
				.eq("id", params.shadowSoldierId)
				.select("*")
				.single();

			if (error) throw error;
			const canonicalEntries = await listCanonicalEntries("shadow-soldiers");
			const canonicalEntry = canonicalEntries.find(
				(e) => e.id === data.soldier_id,
			);
			const soldier = canonicalEntry
				? mapCanonicalToShadowSoldier(
						canonicalEntry as unknown as Record<string, unknown>,
					)
				: null;
			return { ...data, soldier };
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character-shadow-soldiers", variables.characterId],
			});
			const soldierName = data.soldier?.name || "Soldier";
			toast({
				title: variables.summon ? "Ascend!" : "Return to the Veil",
				description: variables.summon
					? `${soldierName} emerges from the veil!`
					: `${soldierName} returns to the veil.`,
			});
		},
	});
}

export function useUpdateSoldierHP() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			characterId: string;
			shadowSoldierId: string;
			currentHp: number;
		}) => {
			const { data, error } = await supabase
				.from("character_shadow_soldiers")
				.update({ current_hp: params.currentHp })
				.eq("id", params.shadowSoldierId)
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character-shadow-soldiers", variables.characterId],
			});
		},
	});
}

export function useIncreaseBondLevel() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: {
			characterId: string;
			shadowSoldierId: string;
		}) => {
			// Get current row (bond_level + soldier_id) without DB join.
			const { data: current } = await supabase
				.from("character_shadow_soldiers")
				.select("bond_level, soldier_id")
				.eq("id", params.shadowSoldierId)
				.single();

			if (!current) throw new AppError("Not found", "NOT_FOUND");

			const { data, error } = await supabase
				.from("character_shadow_soldiers")
				.update({ bond_level: current.bond_level + 1 })
				.eq("id", params.shadowSoldierId)
				.select()
				.single();

			if (error) throw error;
			const canonicalEntries = await listCanonicalEntries("shadow-soldiers");
			const soldierEntry = canonicalEntries.find(
				(e) => e.id === current.soldier_id,
			);
			return {
				...data,
				soldierName: soldierEntry?.name ?? null,
			};
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character-shadow-soldiers", variables.characterId],
			});
			toast({
				title: "Bond Strengthened!",
				description: `${data.soldierName}'s loyalty deepens. Bond Level ${data.bond_level}!`,
			});
		},
	});
}
