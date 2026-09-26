import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";
import type { FusionAbility, GeneratedSovereign } from "@/lib/geminiProtocol";
import {
	addLocalFeature,
	isLocalCharacterId,
	listLocalFeatures,
	removeLocalFeature,
} from "@/lib/guestStore";
import {
	SOVEREIGN_FEATURE_SOURCE_PREFIX,
	sovereignAbilitiesToFeatureRows,
} from "@/lib/sovereign/applySovereign";
import {
	isGeneratedSovereignV2Draft,
} from "@/lib/sovereign/sovereignGenerationClient";
import {
	buildLegacySovereignSavePayload,
	canonicalizeLegacySovereign,
	legacySovereignSaveOperationId,
	sovereignAttachmentOperationId,
} from "@/lib/sovereign/sovereignPersistence";
import { readSovereignDefinition } from "@/lib/sovereign/sovereignV2Contract";

export interface SavedSovereign {
	id: string;
	name: string;
	title: string;
	description: string;
	fusion_theme: string;
	fusion_description: string;
	fusion_method: string;
	power_multiplier: string | null;
	fusion_stability: string | null;
	job_id: string;
	path_id: string;
	regent_a_id: string | null;
	regent_b_id: string | null;
	abilities: FusionAbility[];
	created_by: string;
	created_at: string;
	is_public: boolean;
	likes_count: number;
	schema_version?: 1 | 2;
	definition_id?: string | null;
	definition?: unknown;
	ruleset_revision?: string | null;
	canonical_source_revision?: string | null;
	projection_revision?: string | null;
}

type RpcError = { message: string };
type UntypedRpcResult = PromiseLike<{
	data: unknown;
	error: RpcError | null;
}>;
type UntypedRpc = (
	functionName: string,
	args: Record<string, unknown>,
) => UntypedRpcResult;

const callRpc = supabase.rpc.bind(supabase) as unknown as UntypedRpc;

async function runRpc<T>(
	functionName: string,
	args: Record<string, unknown>,
): Promise<T> {
	const { data, error } = await callRpc(functionName, args);
	if (error) throw new AppError(error.message, "UNKNOWN", error);
	return data as T;
}

/** Returns the saved Sovereign currently attached to a character, if readable. */
export function useCharacterSovereign(characterId: string | undefined) {
	return useQuery({
		queryKey: ["character-sovereign", characterId],
		enabled: !!characterId,
		retry: false,
		queryFn: async () => {
			if (!characterId) return null;
			const { data: character, error: characterError } = await supabase
				.from("characters")
				.select("id, active_sovereign_id")
				.eq("id", characterId)
				.maybeSingle();
			if (characterError || !character?.active_sovereign_id) return null;

			const { data, error } = await supabase
				.from("saved_sovereigns")
				.select("*")
				.eq("id", character.active_sovereign_id)
				.maybeSingle();
			if (error || !data) return null;

			const sovereign = JSON.parse(JSON.stringify(data)) as Record<
				string,
				unknown
			>;
			return {
				...sovereign,
				abilities: Array.isArray(sovereign.abilities)
					? sovereign.abilities
					: [],
			} as unknown as SavedSovereign;
		},
	});
}

function applyLocalLegacyProjection(
	characterId: string,
	sovereign: GeneratedSovereign,
): void {
	for (const existingFeature of listLocalFeatures(characterId)) {
		const source = (existingFeature as { source?: string }).source;
		if (
			typeof source === "string" &&
			source.startsWith(SOVEREIGN_FEATURE_SOURCE_PREFIX)
		) {
			removeLocalFeature((existingFeature as { id: string }).id);
		}
	}

	for (const row of sovereignAbilitiesToFeatureRows(sovereign)) {
		addLocalFeature(characterId, {
			name: row.name,
			source: row.source,
			level_acquired: row.level_acquired,
			description: row.description,
			action_type: row.action_type,
			recharge: row.recharge,
			is_active: row.is_active,
			modifiers: null as never,
			homebrew_id: row.homebrew_id,
		});
	}
}

async function resolveAlreadySavedV2Draft(
	sovereign: GeneratedSovereign,
	userId: string,
): Promise<string | null> {
	if (!isGeneratedSovereignV2Draft(sovereign)) return null;

	const { data, error } = await supabase
		.from("saved_sovereigns")
		.select("id, created_by, schema_version, definition")
		.eq("id", sovereign.saved_sovereign_id)
		.maybeSingle();
	if (error) throw new AppError(error.message, "UNKNOWN", error);
	if (!data || data.created_by !== userId || data.schema_version !== 2) {
		throw new AppError(
			"The generated Sovereign draft is not an owned v2 definition",
			"AUTH_REQUIRED",
		);
	}

	const persisted = readSovereignDefinition(data.definition);
	if (!persisted.ok || persisted.kind !== "v2") {
		throw new AppError(
			"The saved Sovereign draft failed v2 validation",
			"UNKNOWN",
		);
	}
	const preview = readSovereignDefinition(sovereign.definition);
	if (!preview.ok || preview.kind !== "v2") {
		throw new AppError("The generated Sovereign preview is invalid", "UNKNOWN");
	}
	if (
		persisted.definition.id !== preview.definition.id ||
		persisted.definition.generation.operation_id !==
			preview.definition.generation.operation_id
	) {
		throw new AppError(
			"The generated Sovereign preview does not match its saved draft",
			"UNKNOWN",
		);
	}
	return String(data.id);
}

/**
 * Built-in S4 generation arrives here as an already validated, already saved
 * schema-v2 draft. It is attached directly without rewriting it as legacy v1.
 * Outside/manual legacy imports keep the compatibility save path below.
 */
export function useSaveSovereign() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			sovereign,
			characterId,
		}: {
			sovereign: GeneratedSovereign;
			characterId?: string;
		}) => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				throw new AppError(
					"Must be logged in to save Sovereigns",
					"AUTH_REQUIRED",
				);
			}

			let sovereignId = await resolveAlreadySavedV2Draft(sovereign, user.id);
			let projectionSovereign = sovereign;
			if (!sovereignId) {
				const canonicalSovereign = canonicalizeLegacySovereign(sovereign);
				projectionSovereign = canonicalSovereign;
				const payload = buildLegacySovereignSavePayload(canonicalSovereign);
				sovereignId = await runRpc<string>(
					"save_legacy_sovereign_definition",
					{
						p_payload: payload,
						p_operation_id: legacySovereignSaveOperationId(payload),
						p_is_public: true,
					},
				);
			}
			if (typeof sovereignId !== "string" || !sovereignId) {
				throw new AppError(
					"The Sovereign definition was not saved correctly",
					"UNKNOWN",
				);
			}

			if (characterId) {
				if (isLocalCharacterId(characterId)) {
					// Guest/local state cannot participate in the cloud attachment
					// transaction. Keep the existing local display projection while the
					// signed-in user's authoritative draft remains safely archived.
					applyLocalLegacyProjection(characterId, projectionSovereign);
				} else {
					await runRpc<Record<string, unknown>>("attach_saved_sovereign", {
						p_character_id: characterId,
						p_sovereign_id: sovereignId,
						p_operation_id: sovereignAttachmentOperationId(
							characterId,
							sovereignId,
						),
					});
				}
			}

			return { id: sovereignId };
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["saved-sovereigns"] });
			queryClient.invalidateQueries({ queryKey: ["my-sovereigns"] });
			if (variables.characterId) {
				queryClient.invalidateQueries({
					queryKey: ["character", variables.characterId],
				});
				queryClient.invalidateQueries({
					queryKey: ["character-sovereign", variables.characterId],
				});
				queryClient.invalidateQueries({
					queryKey: ["character-features", variables.characterId],
				});
			}
			toast({
				title: "Sovereign Locked In!",
				description:
					"Your Sovereign overlay has been preserved in the Gemini Archive.",
			});
		},
		onError: (error) => {
			toast({
				title: "Save Failed",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		},
	});
}
