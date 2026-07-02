import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import { clientChannelName } from "@/lib/realtimeChannel";

export type CraftingProjectStatus =
	| "active"
	| "paused"
	| "completed"
	| "abandoned";

export interface CharacterRecipeRow {
	id: string;
	character_id: string;
	recipe_id: string;
	learned_at: string;
	notes: string | null;
	created_at: string;
	updated_at: string;
}

export interface CharacterMaterialRow {
	id: string;
	character_id: string;
	material_id: string;
	quantity: number;
	notes: string | null;
	created_at: string;
	updated_at: string;
}

export interface CharacterCraftingProjectRow {
	id: string;
	character_id: string;
	recipe_id: string;
	name: string | null;
	status: CraftingProjectStatus;
	progress: number;
	progress_required: number;
	materials_committed: Array<{ material_id: string; quantity: number }>;
	notes: string | null;
	started_at: string;
	completed_at: string | null;
	created_at: string;
	updated_at: string;
}

const RECIPES_TABLE = "character_recipes" as never;
const MATERIALS_TABLE = "character_materials" as never;
const PROJECTS_TABLE = "character_crafting_projects" as never;

const craftingKeys = {
	recipes: (characterId: string) => ["character-recipes", characterId] as const,
	materials: (characterId: string) =>
		["character-materials", characterId] as const,
	projects: (characterId: string) =>
		["character-crafting-projects", characterId] as const,
};

function invalidateCrafting(
	queryClient: ReturnType<typeof useQueryClient>,
	characterId: string,
) {
	queryClient.invalidateQueries({
		queryKey: craftingKeys.recipes(characterId),
	});
	queryClient.invalidateQueries({
		queryKey: craftingKeys.materials(characterId),
	});
	queryClient.invalidateQueries({
		queryKey: craftingKeys.projects(characterId),
	});
}

function normalizeMaterialsCommitted(
	value: Json,
): Array<{ material_id: string; quantity: number }> {
	if (!Array.isArray(value)) return [];
	return value
		.map((entry) => {
			if (!entry || typeof entry !== "object" || Array.isArray(entry))
				return null;
			const materialId = entry.material_id;
			const quantity = entry.quantity;
			if (typeof materialId !== "string" || typeof quantity !== "number")
				return null;
			return { material_id: materialId, quantity };
		})
		.filter((entry): entry is { material_id: string; quantity: number } =>
			Boolean(entry),
		);
}

async function getMaterialRow(
	characterId: string,
	materialId: string,
): Promise<CharacterMaterialRow | null> {
	const { data, error } = await supabase
		.from(MATERIALS_TABLE)
		.select("*")
		.eq("character_id", characterId)
		.eq("material_id", materialId)
		.maybeSingle();
	if (error) throw error;
	return (data as unknown as CharacterMaterialRow | null) ?? null;
}

async function getProjectRow(
	projectId: string,
): Promise<CharacterCraftingProjectRow> {
	const { data, error } = await supabase
		.from(PROJECTS_TABLE)
		.select("*")
		.eq("id", projectId)
		.single();
	if (error) throw error;
	const row = data as unknown as CharacterCraftingProjectRow;
	return {
		...row,
		materials_committed: normalizeMaterialsCommitted(
			row.materials_committed as unknown as Json,
		),
	};
}

export function useCrafting(characterId: string | undefined) {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	useEffect(() => {
		if (!characterId || !isSupabaseConfigured) return;
		const channel = supabase
			.channel(clientChannelName(`character-crafting-${characterId}`))
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "character_recipes",
					filter: `character_id=eq.${characterId}`,
				},
				() => invalidateCrafting(queryClient, characterId),
			)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "character_materials",
					filter: `character_id=eq.${characterId}`,
				},
				() => invalidateCrafting(queryClient, characterId),
			)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "character_crafting_projects",
					filter: `character_id=eq.${characterId}`,
				},
				() => invalidateCrafting(queryClient, characterId),
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [characterId, queryClient]);

	const recipesQuery = useQuery({
		queryKey: characterId
			? craftingKeys.recipes(characterId)
			: ["character-recipes", "_none"],
		queryFn: async () => {
			if (!characterId || !isSupabaseConfigured)
				return [] as CharacterRecipeRow[];
			const { data, error } = await supabase
				.from(RECIPES_TABLE)
				.select("*")
				.eq("character_id", characterId)
				.order("learned_at", { ascending: false });
			if (error) throw error;
			return (data ?? []) as unknown as CharacterRecipeRow[];
		},
		enabled: !!characterId,
	});

	const materialsQuery = useQuery({
		queryKey: characterId
			? craftingKeys.materials(characterId)
			: ["character-materials", "_none"],
		queryFn: async () => {
			if (!characterId || !isSupabaseConfigured)
				return [] as CharacterMaterialRow[];
			const { data, error } = await supabase
				.from(MATERIALS_TABLE)
				.select("*")
				.eq("character_id", characterId)
				.order("material_id", { ascending: true });
			if (error) throw error;
			return (data ?? []) as unknown as CharacterMaterialRow[];
		},
		enabled: !!characterId,
	});

	const projectsQuery = useQuery({
		queryKey: characterId
			? craftingKeys.projects(characterId)
			: ["character-crafting-projects", "_none"],
		queryFn: async () => {
			if (!characterId || !isSupabaseConfigured)
				return [] as CharacterCraftingProjectRow[];
			const { data, error } = await supabase
				.from(PROJECTS_TABLE)
				.select("*")
				.eq("character_id", characterId)
				.order("updated_at", { ascending: false });
			if (error) throw error;
			return ((data ?? []) as unknown as CharacterCraftingProjectRow[]).map(
				(row) => ({
					...row,
					materials_committed: normalizeMaterialsCommitted(
						row.materials_committed as unknown as Json,
					),
				}),
			);
		},
		enabled: !!characterId,
	});

	const mutationError = (title: string) => (error: unknown) => {
		toast({
			title,
			description: error instanceof Error ? error.message : "Unknown error",
			variant: "destructive",
		});
	};

	const learnRecipe = useMutation({
		mutationFn: async (input: { recipeId: string; notes?: string }) => {
			if (!characterId)
				throw new AppError("Character is required", "INVALID_INPUT");
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const { data, error } = await supabase
				.from(RECIPES_TABLE)
				.upsert(
					{
						character_id: characterId,
						recipe_id: input.recipeId,
						notes: input.notes ?? null,
					} as never,
					{ onConflict: "character_id,recipe_id" },
				)
				.select("*")
				.single();
			if (error) throw error;
			return data as unknown as CharacterRecipeRow;
		},
		onSuccess: () => {
			if (characterId) invalidateCrafting(queryClient, characterId);
			toast({ title: "Recipe learned" });
		},
		onError: mutationError("Failed to learn recipe"),
	});

	const adjustMaterial = useMutation({
		mutationFn: async (input: { materialId: string; delta: number }) => {
			if (!characterId)
				throw new AppError("Character is required", "INVALID_INPUT");
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const existing = await getMaterialRow(characterId, input.materialId);
			const nextQuantity = Math.max(0, (existing?.quantity ?? 0) + input.delta);

			if (existing && nextQuantity === 0) {
				const { error } = await supabase
					.from(MATERIALS_TABLE)
					.delete()
					.eq("id", existing.id);
				if (error) throw error;
				return null;
			}

			const { data, error } = await supabase
				.from(MATERIALS_TABLE)
				.upsert(
					{
						character_id: characterId,
						material_id: input.materialId,
						quantity: nextQuantity,
					} as never,
					{ onConflict: "character_id,material_id" },
				)
				.select("*")
				.single();
			if (error) throw error;
			return data as unknown as CharacterMaterialRow;
		},
		onSuccess: () => {
			if (characterId) invalidateCrafting(queryClient, characterId);
		},
		onError: mutationError("Failed to update material"),
	});

	const startProject = useMutation({
		mutationFn: async (input: {
			recipeId: string;
			name?: string;
			progressRequired: number;
			materialsCommitted?: Array<{ material_id: string; quantity: number }>;
		}) => {
			if (!characterId)
				throw new AppError("Character is required", "INVALID_INPUT");
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const { data, error } = await supabase
				.from(PROJECTS_TABLE)
				.insert({
					character_id: characterId,
					recipe_id: input.recipeId,
					name: input.name ?? null,
					progress_required: input.progressRequired,
					materials_committed: input.materialsCommitted ?? [],
				} as never)
				.select("*")
				.single();
			if (error) throw error;
			return data as unknown as CharacterCraftingProjectRow;
		},
		onSuccess: () => {
			if (characterId) invalidateCrafting(queryClient, characterId);
			toast({ title: "Crafting project started" });
		},
		onError: mutationError("Failed to start project"),
	});

	const advanceProject = useMutation({
		mutationFn: async (input: { projectId: string; delta: number }) => {
			if (!characterId)
				throw new AppError("Character is required", "INVALID_INPUT");
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const project = await getProjectRow(input.projectId);
			const nextProgress = Math.max(0, project.progress + input.delta);
			const isComplete = nextProgress >= project.progress_required;
			const { data, error } = await supabase
				.from(PROJECTS_TABLE)
				.update({
					progress: nextProgress,
					status: isComplete ? "completed" : project.status,
					completed_at: isComplete
						? (project.completed_at ?? new Date().toISOString())
						: null,
				} as never)
				.eq("id", input.projectId)
				.select("*")
				.single();
			if (error) throw error;
			return data as unknown as CharacterCraftingProjectRow;
		},
		onSuccess: () => {
			if (characterId) invalidateCrafting(queryClient, characterId);
		},
		onError: mutationError("Failed to update project"),
	});

	const setProjectStatus = useMutation({
		mutationFn: async (input: {
			projectId: string;
			status: CraftingProjectStatus;
		}) => {
			if (!characterId)
				throw new AppError("Character is required", "INVALID_INPUT");
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const completedAt =
				input.status === "completed" ? new Date().toISOString() : null;
			const { data, error } = await supabase
				.from(PROJECTS_TABLE)
				.update({
					status: input.status,
					completed_at: completedAt,
				} as never)
				.eq("id", input.projectId)
				.select("*")
				.single();
			if (error) throw error;
			return data as unknown as CharacterCraftingProjectRow;
		},
		onSuccess: () => {
			if (characterId) invalidateCrafting(queryClient, characterId);
		},
		onError: mutationError("Failed to update project status"),
	});

	const deleteProject = useMutation({
		mutationFn: async (input: { projectId: string }) => {
			if (!characterId)
				throw new AppError("Character is required", "INVALID_INPUT");
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const { error } = await supabase
				.from(PROJECTS_TABLE)
				.delete()
				.eq("id", input.projectId);
			if (error) throw error;
		},
		onSuccess: () => {
			if (characterId) invalidateCrafting(queryClient, characterId);
		},
		onError: mutationError("Failed to remove project"),
	});

	return {
		knownRecipes: recipesQuery.data ?? [],
		materials: materialsQuery.data ?? [],
		projects: projectsQuery.data ?? [],
		isLoading:
			recipesQuery.isLoading ||
			materialsQuery.isLoading ||
			projectsQuery.isLoading,
		learnRecipe,
		adjustMaterial,
		startProject,
		advanceProject,
		setProjectStatus,
		deleteProject,
	};
}
