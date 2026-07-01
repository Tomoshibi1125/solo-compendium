import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import type { FusionAbility, GeneratedSovereign } from "@/lib/geminiProtocol";
import {
	addLocalFeature,
	isLocalCharacterId,
	listLocalFeatures,
	removeLocalFeature,
} from "@/lib/guestStore";
import {
	buildSovereignGeminiState,
	SOVEREIGN_FEATURE_SOURCE_PREFIX,
	sovereignAbilitiesToFeatureRows,
} from "@/lib/sovereign/applySovereign";

export interface SavedSovereign {
	id: string;
	name: string;
	title: string;
	description: string;
	fusion_theme: string;
	fusion_description: string;
	fusion_method: string;
	power_multiplier: string;
	fusion_stability: string;
	job_id: string;
	path_id: string;
	monarch_a_id: string;
	monarch_b_id: string;
	abilities: FusionAbility[];
	created_by: string;
	created_at: string;
	is_public: boolean;
	likes_count: number;
}

/** Returns the saved sovereign that is currently linked to a character (if any). */
export function useCharacterSovereign(characterId: string | undefined) {
	return useQuery({
		queryKey: ["character-sovereign", characterId],
		enabled: !!characterId,
		retry: false,
		queryFn: async () => {
			if (!characterId) return null;
			// Fetch the character to get active_sovereign_id
			const { data: char, error: charErr } = await supabase
				.from("characters")
				.select("id, active_sovereign_id")
				.eq("id", characterId)
				.maybeSingle();
			if (charErr || !char?.active_sovereign_id) return null;

			const { data, error } = await supabase
				.from("saved_sovereigns")
				.select("*")
				.eq("id", char.active_sovereign_id)
				.maybeSingle();
			if (error || !data) return null;
			// Use property-safe mapping to ensure SavedSovereign compliance
			const sovereign = JSON.parse(JSON.stringify(data)) as Record<
				string,
				unknown
			>;
			return {
				...sovereign,
				abilities: Array.isArray(sovereign.abilities)
					? sovereign.abilities
					: [],
			} as SavedSovereign;
		},
	});
}

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
			if (!user)
				throw new AppError(
					"Must be logged in to save Sovereigns",
					"AUTH_REQUIRED",
				);

			const insertData = {
				name: sovereign.name,
				title: sovereign.title,
				description: sovereign.description,
				fusion_theme: sovereign.fusion_theme,
				fusion_description: sovereign.fusion_description,
				fusion_method: sovereign.fusion_method,
				power_multiplier: sovereign.power_multiplier,
				fusion_stability: sovereign.fusion_stability,
				job_id: sovereign.job.id,
				path_id: sovereign.path.id,
				monarch_a_id: sovereign.regentA.id,
				monarch_b_id: sovereign.regentB.id,
				abilities: JSON.parse(JSON.stringify(sovereign.abilities)),
				created_by: user.id,
			};

			const { data, error } = await supabase
				.from("saved_sovereigns")
				.insert(insertData)
				.select()
				.single();

			if (error) throw error;

			// If a character is specified, stamp the new sovereign onto the
			// character — both the display link (active_sovereign_id) AND the full
			// gemini_state overlay, so the fusion applies as a complete class
			// overlay (engine features + runtime metadata), not just a display card.
			// This path is identical for embedded-AI and externally-imported
			// Sovereigns, so an imported fusion lands exactly like a generated one.
			if (characterId && data?.id) {
				const overlayState = buildSovereignGeminiState(sovereign, data.id);

				// Merge into any existing gemini_state (preserve leveling_type,
				// conditions, and other runtime keys set elsewhere).
				const { data: existing } = await supabase
					.from("characters")
					.select("gemini_state")
					.eq("id", characterId)
					.maybeSingle();
				const prior =
					existing?.gemini_state &&
					typeof existing.gemini_state === "object" &&
					!Array.isArray(existing.gemini_state)
						? (existing.gemini_state as Record<string, unknown>)
						: {};
				const mergedGeminiState = { ...prior, ...overlayState };

				await supabase
					.from("characters")
					.update({
						active_sovereign_id: data.id,
						gemini_state: mergedGeminiState as unknown as Json,
					})
					.eq("id", characterId)
					.eq("user_id", user.id);

				// Persist the 8 fusion abilities as real character_features rows so
				// the Sovereign appears natively in the sheet's Features tab (grouped
				// "Sovereign") and — for active abilities — the Actions tab, exactly
				// like a class overlay. Idempotent: clear prior Sovereign features
				// first so a re-lock never duplicates rows.
				const featureRows = sovereignAbilitiesToFeatureRows(sovereign);
				if (isLocalCharacterId(characterId)) {
					for (const existingFeature of listLocalFeatures(characterId)) {
						const src = (existingFeature as { source?: string }).source;
						if (
							typeof src === "string" &&
							src.startsWith(SOVEREIGN_FEATURE_SOURCE_PREFIX)
						) {
							removeLocalFeature((existingFeature as { id: string }).id);
						}
					}
					for (const row of featureRows) {
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
				} else {
					await supabase
						.from("character_features")
						.delete()
						.eq("character_id", characterId)
						.like("source", `${SOVEREIGN_FEATURE_SOURCE_PREFIX}%`);
					await supabase.from("character_features").insert(
						featureRows.map((row) => ({
							character_id: characterId,
							name: row.name,
							source: row.source,
							level_acquired: row.level_acquired,
							description: row.description,
							action_type: row.action_type,
							recharge: row.recharge,
							is_active: row.is_active,
							modifiers: row.modifiers,
							homebrew_id: row.homebrew_id,
						})),
					);
				}
			}

			return data;
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
				// Refresh the Features/Actions tabs to show the new overlay abilities.
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
				description: error.message,
				variant: "destructive",
			});
		},
	});
}
