import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import { enqueueSyncItem } from "@/lib/syncManager";

export type MarketplaceItemType =
	| "campaign"
	| "character"
	| "item"
	| "map"
	| "module"
	| "template";

/** Browse every listing, or only the signed-in author's own. */
export type MarketplaceScope = "all" | "mine";

/** A marketplace listing. The marketplace is free and every listing is public. */
export interface MarketplaceItemRecord {
	id: string;
	author_id: string;
	title: string;
	description: string;
	item_type: MarketplaceItemType;
	category: string;
	tags: string[];
	requirements: unknown;
	compatibility: unknown;
	license: string;
	content: Record<string, unknown>;
	file_url: string | null;
	version: string;
	is_featured: boolean;
	is_verified: boolean;
	downloads_count: number;
	views_count: number;
	rating_avg: number;
	rating_count: number;
	created_at: string;
	updated_at: string;
}

type MarketplaceSaveInput = {
	id?: string;
	title: string;
	description: string;
	itemType: MarketplaceItemType;
	category: string;
	tags?: string[];
	requirements?: unknown;
	compatibility?: unknown;
	license?: string;
	content?: Record<string, unknown>;
	fileUrl?: string | null;
	version?: string;
};

type MutationResult = {
	queued: boolean;
	record: MarketplaceItemRecord | null;
};

// Supabase client natively extended
const KEY = ["marketplace"] as const;

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

const getCurrentUserId = async (): Promise<string | null> => {
	const { data } = await supabase.auth.getUser();
	return data.user?.id ?? null;
};

const ensureAuthenticatedUser = async (): Promise<string> => {
	const userId = await getCurrentUserId();
	if (!userId) {
		throw new AppError("Not authenticated", "AUTH_REQUIRED");
	}
	return userId;
};

export const useMarketplaceItems = ({
	scope = "all",
	search,
	itemType,
}: {
	scope?: MarketplaceScope;
	search?: string;
	itemType?: MarketplaceItemType | null;
}) => {
	return useQuery({
		queryKey: [...KEY, "items", scope, search ?? "", itemType ?? "all"],
		queryFn: async (): Promise<MarketplaceItemRecord[]> => {
			if (!isSupabaseConfigured) return [];

			let query = supabase
				.from("marketplace_items")
				.select("*")
				.order("updated_at", { ascending: false });

			if (scope === "mine") {
				const authedUserId = await ensureAuthenticatedUser();
				query = query.eq("author_id", authedUserId);
			}
			if (search && search.trim().length > 0) {
				query = query.ilike("title", `%${search.trim()}%`);
			}
			if (itemType) {
				query = query.eq("item_type", itemType);
			}

			const { data, error } = await query;
			if (error) throw error;
			return (data || []) as MarketplaceItemRecord[];
		},
		enabled: isSupabaseConfigured,
	});
};

export const useSaveMarketplaceItem = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (
			input: MarketplaceSaveInput,
		): Promise<MutationResult> => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}

			const userId = await ensureAuthenticatedUser();
			const payload = {
				title: input.title.trim(),
				description: input.description.trim(),
				item_type: input.itemType,
				category: input.category.trim() || "General",
				tags: normalizeTags(input.tags),
				requirements: input.requirements ?? [],
				compatibility: input.compatibility ?? [],
				license: input.license || "Custom",
				content: input.content ?? {},
				file_url: input.fileUrl ?? null,
				version: input.version || "1.0.0",
			};

			try {
				if (input.id) {
					const { data, error } = await supabase
						.from("marketplace_items")
						.update({
							...payload,
							content: payload.content as typeof payload.content,
							requirements: payload.requirements as typeof payload.requirements,
							compatibility:
								payload.compatibility as typeof payload.compatibility,
						} as Database["public"]["Tables"]["marketplace_items"]["Update"])
						.eq("id", input.id)
						.select("*")
						.single();

					if (error) throw error;
					return {
						queued: false,
						record: data as MarketplaceItemRecord,
					};
				}

				const { data, error } = await supabase
					.from("marketplace_items")
					.insert({
						...payload,
						author_id: userId,
						content: payload.content as typeof payload.content,
						requirements: payload.requirements as typeof payload.requirements,
						compatibility:
							payload.compatibility as typeof payload.compatibility,
					} as Database["public"]["Tables"]["marketplace_items"]["Insert"])
					.select("*")
					.single();

				if (error) throw error;
				return {
					queued: false,
					record: data as MarketplaceItemRecord,
				};
			} catch (error) {
				if (!isOfflineError(error)) {
					throw error;
				}

				void enqueueSyncItem("marketplace", input.id ? "update" : "create", {
					id: input.id,
					author_id: userId,
					...payload,
				});

				return { queued: true, record: null };
			}
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: KEY });
			toast({
				title: result.queued ? "Saved offline" : "Marketplace item saved",
				description: result.queued
					? "Changes were queued and will sync when online."
					: "Marketplace listing updated successfully.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to save listing",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export const useDeleteMarketplaceItem = () => {
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
					.from("marketplace_items")
					.delete()
					.eq("id", id);
				if (error) throw error;
				return { queued: false };
			} catch (error) {
				if (!isOfflineError(error)) {
					throw error;
				}
				void enqueueSyncItem("marketplace", "delete", { id });
				return { queued: true };
			}
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: KEY });
			toast({
				title: result.queued ? "Delete queued offline" : "Listing removed",
				description: result.queued
					? "Deletion will sync when online."
					: "Marketplace listing deleted.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to delete listing",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export const useRecordMarketplaceDownload = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			itemId,
		}: {
			itemId: string;
		}): Promise<{ queued: boolean }> => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			const userId = await ensureAuthenticatedUser();

			try {
				const { error } = await supabase.rpc("record_marketplace_download", {
					p_item_id: itemId,
				});
				if (error) throw error;
				return { queued: false };
			} catch (error) {
				if (!isOfflineError(error)) {
					throw error;
				}

				void enqueueSyncItem("marketplace", "update", {
					mode: "download",
					item_id: itemId,
					user_id: userId,
				});
				return { queued: true };
			}
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: KEY });
			toast({
				title: result.queued ? "Download queued offline" : "Download recorded",
				description: result.queued
					? "Download will be recorded when online."
					: "Your download has been recorded.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Download failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export const useUpsertMarketplaceReview = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			itemId,
			rating,
			comment,
		}: {
			itemId: string;
			rating: number;
			comment?: string;
		}): Promise<{ queued: boolean }> => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			const userId = await ensureAuthenticatedUser();

			try {
				const { error } = await supabase.rpc("upsert_marketplace_review", {
					p_item_id: itemId,
					p_rating: Number.isFinite(rating) ? rating : 5,
					p_comment: typeof comment === "string" ? comment : undefined,
					p_user_id: userId,
				});
				if (error) throw error;
				return { queued: false };
			} catch (error) {
				if (!isOfflineError(error)) {
					throw error;
				}

				void enqueueSyncItem("marketplace", "update", {
					mode: "review",
					item_id: itemId,
					rating,
					comment: comment ?? null,
					user_id: userId,
				});
				return { queued: true };
			}
		},
		onSuccess: (result, variables) => {
			queryClient.invalidateQueries({ queryKey: KEY });
			queryClient.invalidateQueries({
				queryKey: [...KEY, "reviews", variables.itemId],
			});
			toast({
				title: result.queued ? "Review queued offline" : "Review saved",
				description: result.queued
					? "Your review will sync when online."
					: "Thanks for reviewing this listing.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to submit review",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};
