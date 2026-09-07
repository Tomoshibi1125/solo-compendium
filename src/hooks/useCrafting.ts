import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import {
	buildCraftingMutationPlanV1,
	type CraftingMutationReceiptV1,
	type CraftingSourceOwnershipProofV1,
	executeCraftingMutationV1,
} from "@/lib/planning/adapters/campaignWorkflow";
import type { SerializableRecord } from "@/lib/planning/contracts";
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

const SINGLE_DIRECT_WRITE_COMPENSATION = {
	kind: "not-required",
	reason: "The mutation boundary performs one direct table write.",
} as const;

type CraftingMutationName =
	| "learnRecipe"
	| "adjustMaterial"
	| "startProject"
	| "advanceProject"
	| "setProjectStatus"
	| "deleteProject";

type CraftingPlanningReceipts = Partial<
	Record<CraftingMutationName, CraftingMutationReceiptV1 | null>
>;

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

function normalizeProjectRow(
	row: CharacterCraftingProjectRow,
): CharacterCraftingProjectRow {
	return {
		...row,
		materials_committed: normalizeMaterialsCommitted(
			row.materials_committed as unknown as Json,
		),
	};
}

async function getRecipeRow(
	characterId: string,
	recipeId: string,
): Promise<CharacterRecipeRow | null> {
	const { data, error } = await supabase
		.from(RECIPES_TABLE)
		.select("*")
		.eq("character_id", characterId)
		.eq("recipe_id", recipeId)
		.maybeSingle();
	if (error) throw error;
	return (data as unknown as CharacterRecipeRow | null) ?? null;
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
	characterId: string,
	projectId: string,
): Promise<CharacterCraftingProjectRow> {
	const { data, error } = await supabase
		.from(PROJECTS_TABLE)
		.select("*")
		.eq("character_id", characterId)
		.eq("id", projectId)
		.single();
	if (error) throw error;
	return normalizeProjectRow(data as unknown as CharacterCraftingProjectRow);
}

function recipePlanningValue(
	characterId: string,
	recipeId: string,
	notes: string | null,
): SerializableRecord {
	return {
		character_id: characterId,
		recipe_id: recipeId,
		notes,
	};
}

function materialPlanningValue(
	characterId: string,
	materialId: string,
	quantity: number,
): SerializableRecord {
	return {
		character_id: characterId,
		material_id: materialId,
		quantity,
	};
}

function projectPlanningValue(
	row: CharacterCraftingProjectRow,
): SerializableRecord {
	return {
		id: row.id,
		character_id: row.character_id,
		recipe_id: row.recipe_id,
		name: row.name,
		status: row.status,
		progress: row.progress,
		progress_required: row.progress_required,
		materials_committed: row.materials_committed.map(
			(entry): SerializableRecord => ({
				material_id: entry.material_id,
				quantity: entry.quantity,
			}),
		),
		notes: row.notes,
		started_at: row.started_at,
		completed_at: row.completed_at,
		created_at: row.created_at,
		updated_at: row.updated_at,
	};
}

function sourceOwnershipFor(
	current: SerializableRecord | null,
): CraftingSourceOwnershipProofV1 {
	return current ? { kind: "stored-scope" } : { kind: "new-record" };
}

function requireFreshWrite<T>(data: T | null, target: string): T {
	if (data === null) {
		throw new AppError(
			`${target} changed after planning; reload and retry`,
			"UNKNOWN",
		);
	}
	return data;
}

export function useCrafting(characterId: string | undefined) {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const [planningReceipts, setPlanningReceipts] =
		useState<CraftingPlanningReceipts>({});

	const clearPlanningReceipt = (mutation: CraftingMutationName) => {
		setPlanningReceipts((current) => ({ ...current, [mutation]: null }));
	};
	const retainPlanningReceipt = (
		mutation: CraftingMutationName,
		receipt: CraftingMutationReceiptV1,
	) => {
		setPlanningReceipts((current) => ({ ...current, [mutation]: receipt }));
	};

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
				normalizeProjectRow,
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
			clearPlanningReceipt("learnRecipe");
			if (!characterId)
				throw new AppError("Character is required", "INVALID_INPUT");
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const existing = await getRecipeRow(characterId, input.recipeId);
			const current = existing
				? recipePlanningValue(characterId, existing.recipe_id, existing.notes)
				: null;
			const desired = recipePlanningValue(
				characterId,
				input.recipeId,
				input.notes ?? null,
			);
			const plan = buildCraftingMutationPlanV1({
				characterId,
				recordKey: `recipe:${input.recipeId}`,
				referenceType: "recipe",
				referenceId: input.recipeId,
				current,
				desired,
				sourceOwnership: sourceOwnershipFor(current),
				compensation: SINGLE_DIRECT_WRITE_COMPENSATION,
			});
			const execution = await executeCraftingMutationV1(
				plan,
				current,
				async () => {
					if (existing) {
						const { data, error } = await supabase
							.from(RECIPES_TABLE)
							.update({ notes: input.notes ?? null } as never)
							.eq("id", existing.id)
							.eq("character_id", characterId)
							.eq("updated_at", existing.updated_at)
							.select("*")
							.maybeSingle();
						if (error) throw error;
						return requireFreshWrite(
							(data as unknown as CharacterRecipeRow | null) ?? null,
							"Recipe",
						);
					}
					const { data, error } = await supabase
						.from(RECIPES_TABLE)
						.insert({
							character_id: characterId,
							recipe_id: input.recipeId,
							notes: input.notes ?? null,
						} as never)
						.select("*")
						.single();
					if (error) throw error;
					return data as unknown as CharacterRecipeRow;
				},
			);
			retainPlanningReceipt("learnRecipe", execution.receipt);
			return execution.result;
		},
		onSuccess: () => {
			if (characterId) invalidateCrafting(queryClient, characterId);
			toast({ title: "Recipe learned" });
		},
		onError: mutationError("Failed to learn recipe"),
	});

	const adjustMaterial = useMutation({
		mutationFn: async (input: { materialId: string; delta: number }) => {
			clearPlanningReceipt("adjustMaterial");
			if (!characterId)
				throw new AppError("Character is required", "INVALID_INPUT");
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const existing = await getMaterialRow(characterId, input.materialId);
			const nextQuantity = Math.max(0, (existing?.quantity ?? 0) + input.delta);
			const current = existing
				? materialPlanningValue(
						characterId,
						existing.material_id,
						existing.quantity,
					)
				: null;
			const desired =
				existing && nextQuantity === 0
					? null
					: materialPlanningValue(characterId, input.materialId, nextQuantity);
			const plan = buildCraftingMutationPlanV1({
				characterId,
				recordKey: `material:${input.materialId}`,
				referenceType: "material",
				referenceId: input.materialId,
				current,
				desired,
				sourceOwnership: sourceOwnershipFor(current),
				compensation: SINGLE_DIRECT_WRITE_COMPENSATION,
			});
			const execution = await executeCraftingMutationV1(
				plan,
				current,
				async () => {
					if (existing && nextQuantity === 0) {
						const { data, error } = await supabase
							.from(MATERIALS_TABLE)
							.delete()
							.eq("id", existing.id)
							.eq("character_id", characterId)
							.eq("updated_at", existing.updated_at)
							.select("id")
							.maybeSingle();
						if (error) throw error;
						requireFreshWrite(
							data as unknown as { id: string } | null,
							"Material",
						);
						return null;
					}

					if (existing) {
						const { data, error } = await supabase
							.from(MATERIALS_TABLE)
							.update({ quantity: nextQuantity } as never)
							.eq("id", existing.id)
							.eq("character_id", characterId)
							.eq("updated_at", existing.updated_at)
							.select("*")
							.maybeSingle();
						if (error) throw error;
						return requireFreshWrite(
							(data as unknown as CharacterMaterialRow | null) ?? null,
							"Material",
						);
					}

					const { data, error } = await supabase
						.from(MATERIALS_TABLE)
						.insert({
							character_id: characterId,
							material_id: input.materialId,
							quantity: nextQuantity,
						} as never)
						.select("*")
						.single();
					if (error) throw error;
					return data as unknown as CharacterMaterialRow;
				},
			);
			retainPlanningReceipt("adjustMaterial", execution.receipt);
			return execution.result;
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
			clearPlanningReceipt("startProject");
			if (!characterId)
				throw new AppError("Character is required", "INVALID_INPUT");
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const desired: SerializableRecord = {
				character_id: characterId,
				recipe_id: input.recipeId,
				name: input.name ?? null,
				status: "active",
				progress: 0,
				progress_required: input.progressRequired,
				materials_committed: (input.materialsCommitted ?? []).map(
					(entry): SerializableRecord => ({
						material_id: entry.material_id,
						quantity: entry.quantity,
					}),
				),
				notes: null,
			};
			const plan = buildCraftingMutationPlanV1({
				characterId,
				recordKey: `project:new:${input.recipeId}`,
				referenceType: "recipe",
				referenceId: input.recipeId,
				referenceLabel: input.name ?? null,
				relatedReferences: (input.materialsCommitted ?? []).map((entry) => ({
					referenceType: "material" as const,
					id: entry.material_id,
				})),
				current: null,
				desired,
				sourceOwnership: { kind: "new-record" },
				compensation: SINGLE_DIRECT_WRITE_COMPENSATION,
			});
			const execution = await executeCraftingMutationV1(
				plan,
				null,
				async () => {
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
			);
			retainPlanningReceipt("startProject", execution.receipt);
			return execution.result;
		},
		onSuccess: () => {
			if (characterId) invalidateCrafting(queryClient, characterId);
			toast({ title: "Crafting project started" });
		},
		onError: mutationError("Failed to start project"),
	});

	const advanceProject = useMutation({
		mutationFn: async (input: { projectId: string; delta: number }) => {
			clearPlanningReceipt("advanceProject");
			if (!characterId)
				throw new AppError("Character is required", "INVALID_INPUT");
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const project = await getProjectRow(characterId, input.projectId);
			const nextProgress = Math.max(0, project.progress + input.delta);
			const isComplete = nextProgress >= project.progress_required;
			const completedAt = isComplete
				? (project.completed_at ?? new Date().toISOString())
				: null;
			const current = projectPlanningValue(project);
			const desired: SerializableRecord = {
				...current,
				progress: nextProgress,
				status: isComplete ? "completed" : project.status,
				completed_at: completedAt,
			};
			const plan = buildCraftingMutationPlanV1({
				characterId,
				recordKey: `project:${input.projectId}`,
				referenceType: "project",
				referenceId: input.projectId,
				current,
				desired,
				sourceOwnership: { kind: "stored-scope" },
				compensation: SINGLE_DIRECT_WRITE_COMPENSATION,
			});
			const execution = await executeCraftingMutationV1(
				plan,
				current,
				async () => {
					const { data, error } = await supabase
						.from(PROJECTS_TABLE)
						.update({
							progress: nextProgress,
							status: isComplete ? "completed" : project.status,
							completed_at: completedAt,
						} as never)
						.eq("id", input.projectId)
						.eq("character_id", characterId)
						.eq("updated_at", project.updated_at)
						.select("*")
						.maybeSingle();
					if (error) throw error;
					const row = requireFreshWrite(
						(data as unknown as CharacterCraftingProjectRow | null) ?? null,
						"Crafting project",
					);
					return normalizeProjectRow(row);
				},
			);
			retainPlanningReceipt("advanceProject", execution.receipt);
			return execution.result;
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
			clearPlanningReceipt("setProjectStatus");
			if (!characterId)
				throw new AppError("Character is required", "INVALID_INPUT");
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const project = await getProjectRow(characterId, input.projectId);
			const completedAt =
				input.status === "completed" ? new Date().toISOString() : null;
			const current = projectPlanningValue(project);
			const desired: SerializableRecord = {
				...current,
				status: input.status,
				completed_at: completedAt,
			};
			const plan = buildCraftingMutationPlanV1({
				characterId,
				recordKey: `project:${input.projectId}`,
				referenceType: "project",
				referenceId: input.projectId,
				current,
				desired,
				sourceOwnership: { kind: "stored-scope" },
				compensation: SINGLE_DIRECT_WRITE_COMPENSATION,
			});
			const execution = await executeCraftingMutationV1(
				plan,
				current,
				async () => {
					const { data, error } = await supabase
						.from(PROJECTS_TABLE)
						.update({
							status: input.status,
							completed_at: completedAt,
						} as never)
						.eq("id", input.projectId)
						.eq("character_id", characterId)
						.eq("updated_at", project.updated_at)
						.select("*")
						.maybeSingle();
					if (error) throw error;
					const row = requireFreshWrite(
						(data as unknown as CharacterCraftingProjectRow | null) ?? null,
						"Crafting project",
					);
					return normalizeProjectRow(row);
				},
			);
			retainPlanningReceipt("setProjectStatus", execution.receipt);
			return execution.result;
		},
		onSuccess: () => {
			if (characterId) invalidateCrafting(queryClient, characterId);
		},
		onError: mutationError("Failed to update project status"),
	});

	const deleteProject = useMutation({
		mutationFn: async (input: { projectId: string }) => {
			clearPlanningReceipt("deleteProject");
			if (!characterId)
				throw new AppError("Character is required", "INVALID_INPUT");
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const project = await getProjectRow(characterId, input.projectId);
			const current = projectPlanningValue(project);
			const plan = buildCraftingMutationPlanV1({
				characterId,
				recordKey: `project:${input.projectId}`,
				referenceType: "project",
				referenceId: input.projectId,
				current,
				desired: null,
				sourceOwnership: { kind: "stored-scope" },
				compensation: SINGLE_DIRECT_WRITE_COMPENSATION,
			});
			const execution = await executeCraftingMutationV1(
				plan,
				current,
				async () => {
					const { data, error } = await supabase
						.from(PROJECTS_TABLE)
						.delete()
						.eq("id", input.projectId)
						.eq("character_id", characterId)
						.eq("updated_at", project.updated_at)
						.select("id")
						.maybeSingle();
					if (error) throw error;
					requireFreshWrite(
						data as unknown as { id: string } | null,
						"Crafting project",
					);
				},
			);
			retainPlanningReceipt("deleteProject", execution.receipt);
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
		planningReceipts,
	};
}
