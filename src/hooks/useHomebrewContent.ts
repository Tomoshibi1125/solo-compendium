import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import { useAuth } from "@/lib/auth/authContext";
import { enqueueOfflineSync } from "@/lib/offlineSync";

export type HomebrewContentType = "job" | "path" | "relic" | "spell" | "item";
export type HomebrewStatus = "draft" | "published" | "archived";
export type HomebrewVisibilityScope = "private" | "campaign" | "public";

export interface HomebrewRecord {
	id: string;
	user_id: string;
	content_type: HomebrewContentType;
	name: string;
	description: string;
	data: Record<string, unknown>;
	is_public: boolean;
	status: HomebrewStatus;
	version: number;
	published_at: string | null;
	tags: string[];
	source_book: string | null;
	visibility_scope: HomebrewVisibilityScope;
	campaign_id: string | null;
	updated_by: string | null;
	created_at: string;
	updated_at: string;
}

// Character creation interfaces
interface CharacterCreationOption {
	id: string;
	name: string;
	description: string;
	source: "homebrew" | "official";
	homebrewId?: string;
	data: Record<string, unknown>;
}

interface HomebrewCharacterOptions {
	jobs: CharacterCreationOption[];
	paths: CharacterCreationOption[];
	spells: CharacterCreationOption[];
	items: CharacterCreationOption[];
}

interface HomebrewVersionRecord {
	id: string;
	homebrew_id: string;
	version_number: number;
	snapshot: Record<string, unknown>;
	change_note: string | null;
	created_by: string | null;
	created_at: string;
}

type HomebrewSaveInput = {
	id?: string;
	contentType: HomebrewContentType;
	name: string;
	description: string;
	data: Record<string, unknown>;
	tags?: string[];
	sourceBook?: string | null;
	visibilityScope?: HomebrewVisibilityScope;
	campaignId?: string | null;
};

type HomebrewMutationResult = {
	queued: boolean;
	record: HomebrewRecord | null;
};

// Supabase client natively extended
const HOME_KEY = ["homebrew-content"] as const;

const isOfflineError = (error: unknown): boolean => {
	const message =
		typeof error === "object" && error && "message" in error
			? String((error as { message?: unknown }).message ?? "")
			: "";
	const normalized = message.toLowerCase();
	return (
		(typeof navigator !== "undefined" && !navigator.onLine) ||
		normalized.includes("failed to fetch") ||
		normalized.includes("network") ||
		normalized.includes("timeout")
	);
};

const normalizeTags = (tags?: string[]): string[] => {
	if (!Array.isArray(tags)) return [];
	return tags
		.map((tag) => tag.trim())
		.filter(
			(tag, index, array) => tag.length > 0 && array.indexOf(tag) === index,
		);
};

const ensureAuthenticatedUser = async (): Promise<{ id: string }> => {
	const { data } = await supabase.auth.getUser();
	if (!data.user) {
		throw new AppError("Not authenticated", "AUTH_REQUIRED");
	}
	return data.user;
};

export const useHomebrewLibrary = ({
	scope = "mine",
	campaignId,
}: {
	scope?: "mine" | "public" | "campaign" | "all";
	campaignId?: string | null;
}) => {
	return useQuery({
		queryKey: [...HOME_KEY, scope, campaignId ?? "none"],
		queryFn: async (): Promise<HomebrewRecord[]> => {
			if (!isSupabaseConfigured) return [];

			const user = await ensureAuthenticatedUser();
			let query = supabase
				.from("homebrew_content")
				.select("*")
				.order("updated_at", { ascending: false });

			if (scope === "mine") {
				query = query.eq("user_id", user.id);
			}
			if (scope === "public") {
				query = query
					.eq("status", "published")
					.eq("visibility_scope", "public");
			}
			if (scope === "campaign") {
				if (!campaignId) return [];
				query = query
					.eq("status", "published")
					.eq("visibility_scope", "campaign")
					.eq("campaign_id", campaignId);
			}

			const { data, error } = await query;
			if (error) throw error;
			return (data || []) as HomebrewRecord[];
		},
		enabled: isSupabaseConfigured,
	});
};

export const useHomebrewVersions = (homebrewId: string | null) => {
	return useQuery({
		queryKey: [...HOME_KEY, "versions", homebrewId ?? "none"],
		queryFn: async (): Promise<HomebrewVersionRecord[]> => {
			if (!isSupabaseConfigured || !homebrewId) return [];
			await ensureAuthenticatedUser();

			const { data, error } = await supabase
				.from("homebrew_content_versions")
				.select("*")
				.eq("homebrew_id", homebrewId)
				.order("version_number", { ascending: false });

			if (error) throw error;
			return (data || []) as HomebrewVersionRecord[];
		},
		enabled: !!homebrewId && isSupabaseConfigured,
	});
};

export const useSaveHomebrewContent = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (
			input: HomebrewSaveInput,
		): Promise<HomebrewMutationResult> => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			const user = await ensureAuthenticatedUser();

			const payload = {
				content_type: input.contentType,
				name: input.name.trim(),
				description: input.description.trim(),
				data: input.data,
				tags: normalizeTags(input.tags),
				source_book: input.sourceBook?.trim() || null,
				visibility_scope: input.visibilityScope ?? "private",
				campaign_id: input.campaignId ?? null,
				updated_by: user.id,
			};

			try {
				if (input.id) {
					const { data, error } = await supabase
						.from("homebrew_content")
						.update({
							...payload,
							data: payload.data as Record<string, unknown>,
						} as unknown as Database["public"]["Tables"]["homebrew_content"]["Update"])
						.eq("id", input.id)
						.select("*")
						.single();

					if (error) throw error;
					return {
						queued: false,
						record: data as HomebrewRecord,
					};
				}

				const { data, error } = await supabase
					.from("homebrew_content")
					.insert({
						...payload,
						user_id: user.id,
						status: "draft",
					} as unknown as Database["public"]["Tables"]["homebrew_content"]["Insert"])
					.select("*")
					.single();

				if (error) throw error;
				return {
					queued: false,
					record: data as unknown as HomebrewRecord,
				};
			} catch (error) {
				if (!isOfflineError(error)) {
					throw error;
				}

				enqueueOfflineSync(
					input.id ? "homebrew" : "homebrew",
					input.id ? "update" : "create",
					{
						...payload,
						id: input.id,
						user_id: user.id,
					},
				);

				return {
					queued: true,
					record: null,
				};
			}
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: HOME_KEY });
			toast({
				title: result.queued ? "Saved offline" : "Homebrew saved",
				description: result.queued
					? "Changes were queued and will sync when you reconnect."
					: "Your homebrew content has been updated.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to save homebrew",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export const useDeleteHomebrewContent = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			id,
		}: {
			id: string;
		}): Promise<{ queued: boolean }> => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			await ensureAuthenticatedUser();

			try {
				const { error } = await supabase
					.from("homebrew_content")
					.delete()
					.eq("id", id);
				if (error) throw error;
				return { queued: false };
			} catch (error) {
				if (!isOfflineError(error)) {
					throw error;
				}

				enqueueOfflineSync("homebrew", "delete", { id });
				return { queued: true };
			}
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: HOME_KEY });
			toast({
				title: result.queued ? "Delete queued offline" : "Homebrew deleted",
				description: result.queued
					? "Deletion will sync when you reconnect."
					: "The homebrew entry was removed.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to delete homebrew",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/**
 * Fetch published homebrew items by content type for injection into
 * character creation, level-up, and picker dialogs.
 */
export const usePublishedHomebrew = (
	contentType: HomebrewContentType | HomebrewContentType[],
	campaignId?: string | null,
) => {
	const types = Array.isArray(contentType) ? contentType : [contentType];
	return useQuery({
		queryKey: [...HOME_KEY, "published", types.join(","), campaignId ?? "none"],
		queryFn: async (): Promise<HomebrewRecord[]> => {
			if (!isSupabaseConfigured) return [];

			let userId: string | null = null;
			try {
				const user = await ensureAuthenticatedUser();
				userId = user.id;
			} catch {
				return [];
			}

			// Fetch user's own published + public published + campaign-scoped published
			const results: HomebrewRecord[] = [];

			// Own published
			const { data: ownData } = await supabase
				.from("homebrew_content")
				.select("*")
				.eq("user_id", userId)
				.eq("status", "published")
				.in("content_type", types);
			if (ownData) results.push(...(ownData as unknown as HomebrewRecord[]));

			// Public published (exclude own to avoid duplicates)
			const { data: publicData } = await supabase
				.from("homebrew_content")
				.select("*")
				.eq("status", "published")
				.eq("visibility_scope", "public")
				.neq("user_id", userId)
				.in("content_type", types);
			if (publicData)
				results.push(...(publicData as unknown as HomebrewRecord[]));

			// Campaign-scoped published
			if (campaignId) {
				const { data: campaignData } = await supabase
					.from("homebrew_content")
					.select("*")
					.eq("status", "published")
					.eq("visibility_scope", "campaign")
					.eq("campaign_id", campaignId)
					.neq("user_id", userId)
					.in("content_type", types);
				results.push(...(campaignData as unknown as HomebrewRecord[]));
			}

			// Deduplicate by id
			const seen = new Set<string>();
			return results.filter((r) => {
				if (seen.has(r.id)) return false;
				seen.add(r.id);
				return true;
			});
		},
		enabled: isSupabaseConfigured && types.length > 0,
	});
};

export const useSetHomebrewStatus = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			id,
			status,
			visibilityScope,
			campaignId,
		}: {
			id: string;
			status: HomebrewStatus;
			visibilityScope?: HomebrewVisibilityScope | null;
			campaignId?: string | null;
		}): Promise<HomebrewMutationResult> => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			await ensureAuthenticatedUser();

			try {
				const { error } = await supabase.rpc("set_homebrew_content_status", {
					p_homebrew_id: id,
					p_status: status,
					p_visibility_scope: visibilityScope ?? undefined,
					p_campaign_id: campaignId ?? undefined,
				});

				if (error) throw error;

				const { data, error: fetchError } = await supabase
					.from("homebrew_content")
					.select("*")
					.eq("id", id)
					.single();

				if (fetchError) throw fetchError;

				return {
					queued: false,
					record: data as unknown as HomebrewRecord,
				};
			} catch (error) {
				if (!isOfflineError(error)) {
					throw error;
				}

				enqueueOfflineSync("homebrew", "update", {
					id,
					status,
					visibility_scope: visibilityScope,
					campaign_id: campaignId,
				});

				return {
					queued: true,
					record: null,
				};
			}
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: HOME_KEY });
			toast({
				title: result.queued ? "Status queued offline" : "Publication updated",
				description: result.queued
					? "Status change will sync when you reconnect."
					: "Homebrew visibility and publication state were updated.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to update status",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

// Character creation integration hook
// biome-ignore lint/correctness/noUnusedVariables: exported for use in other modules
function useHomebrewCharacterIntegration() {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const getHomebrewCharacterOptions =
		useCallback((): HomebrewCharacterOptions => {
			if (!user) {
				return {
					jobs: [],
					paths: [],
					spells: [],
					items: [],
				};
			}

			// Get all homebrew content from cache
			const allHomebrew = queryClient.getQueryData(["homebrew", "list"]) as
				| { pages?: HomebrewRecord[][] }
				| undefined;
			const homebrewRecords = allHomebrew?.pages?.flat() || [];

			const transformToCharacterOption = (
				record: HomebrewRecord,
			): CharacterCreationOption => ({
				id: record.id,
				name: record.name,
				description: record.description,
				source: "homebrew" as const,
				homebrewId: record.id,
				data: record.data,
			});

			const options: HomebrewCharacterOptions = {
				jobs: homebrewRecords
					.filter(
						(r: HomebrewRecord) =>
							r.content_type === "job" && r.status === "published",
					)
					.map(transformToCharacterOption),
				paths: homebrewRecords
					.filter(
						(r: HomebrewRecord) =>
							r.content_type === "path" && r.status === "published",
					)
					.map(transformToCharacterOption),
				spells: homebrewRecords
					.filter(
						(r: HomebrewRecord) =>
							r.content_type === "spell" && r.status === "published",
					)
					.map(transformToCharacterOption),
				items: homebrewRecords
					.filter(
						(r: HomebrewRecord) =>
							r.content_type === "item" && r.status === "published",
					)
					.map(transformToCharacterOption),
			};

			return options;
		}, [user, queryClient]);

	const isHomebrewOption = useCallback(
		(optionId: string): boolean => {
			const options = getHomebrewCharacterOptions();
			const allOptions = [
				...options.jobs,
				...options.paths,
				...options.spells,
				...options.items,
			];
			return allOptions.some((option) => option.id === optionId);
		},
		[getHomebrewCharacterOptions],
	);

	const getHomebrewOptionById = useCallback(
		(optionId: string): CharacterCreationOption | null => {
			const options = getHomebrewCharacterOptions();
			const allOptions = [
				...options.jobs,
				...options.paths,
				...options.spells,
				...options.items,
			];
			return allOptions.find((option) => option.id === optionId) || null;
		},
		[getHomebrewCharacterOptions],
	);

	const getHomebrewJobsForCreation = useCallback(() => {
		return getHomebrewCharacterOptions().jobs.map((job) => ({
			...job,
			// Transform homebrew job data to match expected job interface
			hitDie: job.data.hitDie || "d8",
			primaryAbility: job.data.primaryAbility || "STR",
			savingThrows: job.data.savingThrows || [],
			skills: job.data.skills || [],
			equipment: job.data.equipment || [],
			features: job.data.features || [],
			levels: job.data.levels || [],
		}));
	}, [getHomebrewCharacterOptions]);

	const getHomebrewPathsForCreation = useCallback(() => {
		return getHomebrewCharacterOptions().paths.map((path) => ({
			...path,
			// Transform homebrew path data to match expected path interface
			requirements: path.data.requirements || [],
			features: path.data.features || [],
			levels: path.data.levels || [],
		}));
	}, [getHomebrewCharacterOptions]);

	const getHomebrewSpellsForCreation = useCallback(() => {
		return getHomebrewCharacterOptions().spells.map((spell) => ({
			...spell,
			// Transform homebrew spell data to match expected spell interface
			level: spell.data.level || 1,
			school: spell.data.school || "evocation",
			type: spell.data.type || "Utility",
			rank: spell.data.rank || "D",
			castingTime: spell.data.castingTime || "1 action",
			range: spell.data.range || "Self",
			components: spell.data.components || ["V"],
			duration: spell.data.duration || "Instantaneous",
			atHigherLevels: spell.data.atHigherLevels || "",
		}));
	}, [getHomebrewCharacterOptions]);

	const getHomebrewItemsForCreation = useCallback(() => {
		return getHomebrewCharacterOptions().items.map((item) => ({
			...item,
			// Transform homebrew item data to match expected item interface
			type: item.data.type || "equipment",
			rarity: item.data.rarity || "common",
			properties: item.data.properties || [],
			requirements: item.data.requirements || [],
		}));
	}, [getHomebrewCharacterOptions]);

	return {
		getHomebrewCharacterOptions,
		isHomebrewOption,
		getHomebrewOptionById,
		getHomebrewJobsForCreation,
		getHomebrewPathsForCreation,
		getHomebrewSpellsForCreation,
		getHomebrewItemsForCreation,
	};
}
