import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import { useAuth } from "@/lib/auth/authContext";
import {
	getLocalGuestRole,
	getLocalUserId,
	listLocalCharacters,
} from "@/lib/guestStore";

export interface Campaign {
	id: string;
	name: string;
	description: string | null;
	warden_id: string;
	share_code: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	settings: Record<string, unknown>;
}

export interface CampaignMember {
	id: string;
	campaign_id: string;
	user_id: string;
	character_id: string | null;
	role: "ascendant" | "warden" | "co-warden";
	joined_at: string;
}

type CampaignUpdate = {
	name?: string;
	description?: string | null;
	is_active?: boolean;
	settings?: Record<string, unknown>;
};

const CAMPAIGNS_KEY = "solo-compendium.campaigns.v1";
const MEMBERS_KEY = "solo-compendium.campaigns.members.v1";

export const loadLocalCampaigns = (): Campaign[] => {
	if (typeof window === "undefined") return [];
	const raw = window.localStorage.getItem(CAMPAIGNS_KEY);
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as Campaign[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const saveLocalCampaigns = (campaigns: Campaign[]) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
};

const updateLocalCampaign = (
	campaignId: string,
	updates: CampaignUpdate,
): Campaign => {
	const campaigns = loadLocalCampaigns();
	const idx = campaigns.findIndex((campaign) => campaign.id === campaignId);
	if (idx === -1) throw new AppError("Campaign not found", "NOT_FOUND");
	const next: Campaign = {
		...campaigns[idx],
		...updates,
		updated_at: new Date().toISOString(),
	};
	const updated = [...campaigns];
	updated[idx] = next;
	saveLocalCampaigns(updated);
	return next;
};

export const loadLocalMembers = (): CampaignMember[] => {
	if (typeof window === "undefined") return [];
	const raw = window.localStorage.getItem(MEMBERS_KEY);
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as CampaignMember[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const saveLocalMembers = (members: CampaignMember[]) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
};

const createShareCode = () => {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let code = "";
	for (let i = 0; i < 6; i += 1) {
		code += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	return code;
};

const isLocalMode = () => !isSupabaseConfigured;
const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

const isMissingAddCharacterRpc = (error: unknown): boolean => {
	if (!error || typeof error !== "object") return false;
	const message = String(
		(error as { message?: string }).message ?? "",
	).toLowerCase();
	return (
		message.includes("add_player_character_to_campaign") &&
		(message.includes("does not exist") ||
			message.includes("no function matches"))
	);
};

// Fetch campaigns where user is System (Warden)
export const useMyCampaigns = () => {
	return useQuery({
		queryKey: ["campaigns", "my"],
		queryFn: async () => {
			if (isLocalMode()) {
				const userId = getLocalUserId();
				return loadLocalCampaigns()
					.filter((campaign) => campaign.warden_id === userId)
					.sort((a, b) => b.created_at.localeCompare(a.created_at));
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) {
					const userId = getLocalUserId();
					return loadLocalCampaigns()
						.filter((campaign) => campaign.warden_id === userId)
						.sort((a, b) => b.created_at.localeCompare(a.created_at));
				}
				return [];
			}

			const { data, error } = await supabase
				.from("campaigns")
				.select("*")
				.eq("warden_id", user.id)
				.order("created_at", { ascending: false });

			if (error) throw error;
			const supabaseCampaigns = (data || []) as Campaign[];

			// Merge with local cache to cover RLS propagation delays —
			// newly-created campaigns may not appear in Supabase yet
			const localCampaigns = loadLocalCampaigns().filter(
				(lc) => lc.warden_id === user.id,
			);
			const supabaseIds = new Set(supabaseCampaigns.map((c) => c.id));
			const merged = [
				...supabaseCampaigns,
				...localCampaigns.filter((lc) => !supabaseIds.has(lc.id)),
			];

			// Sync local cache with fresh Supabase data.
			// Remove any local campaign owned by this user that Supabase no longer returns
			// (i.e. it was deleted). Supabase is the source of truth for authenticated wardens.
			const allLocal = loadLocalCampaigns();
			const freshMap = new Map(supabaseCampaigns.map((c) => [c.id, c]));
			const synced = allLocal
				.map((lc) => freshMap.get(lc.id) || lc)
				// Purge campaigns belonging to this warden that Supabase no longer has
				.filter((lc) => lc.warden_id !== user.id || freshMap.has(lc.id));
			for (const sc of supabaseCampaigns) {
				if (!synced.some((s) => s.id === sc.id)) synced.push(sc);
			}
			saveLocalCampaigns(synced);

			return merged.sort((a, b) => b.created_at.localeCompare(a.created_at));
		},
		staleTime: 30_000,
		retry: (failureCount) => {
			if (failureCount < 2) return true;
			return false;
		},
		retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 3000),
	});
};

// Fetch campaigns where user is a member
export const useJoinedCampaigns = () => {
	return useQuery({
		queryKey: ["campaigns", "joined"],
		queryFn: async () => {
			if (isLocalMode()) {
				const userId = getLocalUserId();
				const campaigns = loadLocalCampaigns();
				const members = loadLocalMembers();
				return members
					.filter((member) => member.user_id === userId)
					.map((member) => {
						const campaign = campaigns.find((c) => c.id === member.campaign_id);
						if (!campaign || campaign.warden_id === userId) return null;
						return { ...campaign, member_role: member.role };
					})
					.filter(Boolean) as (Campaign & { member_role: string })[];
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) {
					const userId = getLocalUserId();
					const campaigns = loadLocalCampaigns();
					const members = loadLocalMembers();
					return members
						.filter((member) => member.user_id === userId)
						.map((member) => {
							const campaign = campaigns.find(
								(c) => c.id === member.campaign_id,
							);
							if (!campaign || campaign.warden_id === userId) return null;
							return { ...campaign, member_role: member.role };
						})
						.filter(Boolean) as (Campaign & { member_role: string })[];
				}
				return [];
			}

			const { data, error } = await supabase
				.from("campaign_members")
				.select(`
          *,
          campaigns (*)
        `)
				.eq("user_id", user.id)
				.order("joined_at", { ascending: false });

			if (error) throw error;
			const supabaseJoined = (
				(data || []) as Array<{
					campaigns: Database["public"]["Tables"]["campaigns"]["Row"];
					role: string;
				}>
			)
				.filter(
					(member) =>
						member.campaigns && member.campaigns.warden_id !== user.id,
				)
				.map((member) => ({
					...member.campaigns,
					member_role: member.role,
				})) as (Campaign & { member_role: string })[];

			// Merge with local cache to cover RLS propagation delays —
			// freshly-joined campaigns may not appear in Supabase yet
			const localCampaigns = loadLocalCampaigns();
			const localMembers = loadLocalMembers().filter(
				(m) => m.user_id === user.id && m.role !== "warden",
			);
			const supabaseIds = new Set(supabaseJoined.map((c) => c.id));
			const localJoined = localMembers
				.filter((m) => !supabaseIds.has(m.campaign_id))
				.map((m) => {
					const campaign = localCampaigns.find((c) => c.id === m.campaign_id);
					if (!campaign || campaign.warden_id === user.id) return null;
					return { ...campaign, member_role: m.role };
				})
				.filter(Boolean) as (Campaign & { member_role: string })[];

			return [...supabaseJoined, ...localJoined];
		},
		staleTime: 30_000,
		retry: (failureCount) => {
			if (failureCount < 2) return true;
			return false;
		},
		retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 3000),
	});
};

// Fetch single campaign by ID
export const useCampaign = (campaignId: string) => {
	const { user: authUser, loading: authLoading } = useAuth();
	return useQuery({
		queryKey: ["campaigns", campaignId],
		queryFn: async () => {
			if (isLocalMode()) {
				return (
					loadLocalCampaigns().find((campaign) => campaign.id === campaignId) ||
					null
				);
			}

			// If Supabase is configured, we SHOULD have a user or be intentional about being a guest.
			// However, calling supabase.auth.getUser() here is a bit risky if it races.
			// We'll use the authUser from hook if available, otherwise fetch.
			const user = authUser || (await supabase.auth.getUser()).data.user;

			if (!user && guestEnabled) {
				return (
					loadLocalCampaigns().find((campaign) => campaign.id === campaignId) ||
					null
				);
			}

			if (!user) {
				throw new AppError(
					"Authentication required to view campaign",
					"AUTH_REQUIRED",
				);
			}

			const { data, error } = await supabase
				.from("campaigns")
				.select("*")
				.eq("id", campaignId)
				.single();

			if (error) {
				// If RLS hasn't propagated, PGRST116 means not found. Throw to trigger React Query's retry mechanism!
				if (error.code === "PGRST116") throw new Error("CAMPAIGN_NOT_READY");
				throw error;
			}
			return (data || null) as Campaign;
		},
		enabled: !!campaignId && !authLoading,
		retry: (failureCount) => {
			// Retry once for RLS/propagation delays
			if (failureCount < 2) return true;
			return false;
		},
		retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 3000),
	});
};

// Fetch campaign by character membership
export const useCampaignByCharacterId = (characterId?: string) => {
	return useQuery({
		queryKey: ["campaigns", "by-character", characterId],
		queryFn: async () => {
			if (!characterId) return null;
			if (isLocalMode()) {
				const member = loadLocalMembers()
					.filter((entry) => entry.character_id === characterId)
					.sort((a, b) => b.joined_at.localeCompare(a.joined_at))[0];
				if (!member) return null;
				return (
					loadLocalCampaigns().find(
						(campaign) => campaign.id === member.campaign_id,
					) || null
				);
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user && guestEnabled) {
				const member = loadLocalMembers()
					.filter((entry) => entry.character_id === characterId)
					.sort((a, b) => b.joined_at.localeCompare(a.joined_at))[0];
				if (!member) return null;
				return (
					loadLocalCampaigns().find(
						(campaign) => campaign.id === member.campaign_id,
					) || null
				);
			}
			const { data, error } = await supabase
				.from("campaign_members")
				.select("campaigns (*)")
				.eq("character_id", characterId)
				.order("joined_at", { ascending: false })
				.limit(1);

			if (error) throw error;
			const campaign = data?.[0]?.campaigns;
			return (campaign || null) as Campaign | null;
		},
		enabled: !!characterId,
	});
};

// Fetch campaign by share code
export const useCampaignByShareCode = (shareCode: string) => {
	return useQuery({
		queryKey: ["campaigns", "share-code", shareCode],
		queryFn: async () => {
			if (isLocalMode()) {
				return (
					loadLocalCampaigns().find(
						(campaign) => campaign.share_code === shareCode.toUpperCase(),
					) || null
				);
			}
			const { data: authData } = await supabase.auth.getUser();
			if (!authData.user && guestEnabled) {
				return (
					loadLocalCampaigns().find(
						(campaign) => campaign.share_code === shareCode.toUpperCase(),
					) || null
				);
			}

			const rpcResult = await supabase.rpc("get_campaign_by_share_code", {
				p_share_code: shareCode.toUpperCase(),
			});

			if (rpcResult.error) {
				const msg = String(rpcResult.error.message ?? "").toLowerCase();
				const isRpcMissing =
					msg.includes("does not exist") || msg.includes("no function matches");

				if (!isRpcMissing) throw rpcResult.error;

				// Fallback: direct SELECT when RPC doesn't exist
				const { data: directData, error: directError } = await supabase
					.from("campaigns")
					.select("*")
					.eq("share_code", shareCode.toUpperCase())
					.maybeSingle();

				if (directError) throw directError;
				return (directData || null) as Campaign | null;
			}

			const campaign = Array.isArray(rpcResult.data)
				? rpcResult.data[0]
				: rpcResult.data;
			return (campaign || null) as Campaign | null;
		},
		enabled: !!shareCode && shareCode.length === 6,
	});
};

// Fetch campaign members
export const useCampaignMembers = (campaignId: string) => {
	const { user, loading } = useAuth();
	return useQuery({
		queryKey: ["campaigns", campaignId, "members"],
		queryFn: async () => {
			if (isLocalMode()) {
				const localCharacters = listLocalCharacters();
				return loadLocalMembers()
					.filter((member) => member.campaign_id === campaignId)
					.map((member) => ({
						...member,
						characters: member.character_id
							? (() => {
									const character = localCharacters.find(
										(entry) => entry.id === member.character_id,
									);
									return character
										? {
												id: character.id,
												name: character.name,
												level: character.level ?? 1,
												job: character.job ?? "Unknown",
											}
										: null;
								})()
							: null,
					}));
			}
			if (!user) {
				if (guestEnabled) {
					const localCharacters = listLocalCharacters();
					return loadLocalMembers()
						.filter((member) => member.campaign_id === campaignId)
						.map((member) => ({
							...member,
							characters: member.character_id
								? (() => {
										const character = localCharacters.find(
											(entry) => entry.id === member.character_id,
										);
										return character
											? {
													id: character.id,
													name: character.name,
													level: character.level ?? 1,
													job: character.job ?? "Unknown",
												}
											: null;
									})()
								: null,
						}));
				}
				return [];
			}
			const { data, error } = await supabase
				.from("campaign_members")
				.select(`
          *,
          characters (id, name, level, job)
        `)
				.eq("campaign_id", campaignId)
				.order("joined_at", { ascending: true });

			if (error) throw error;
			return (data || []) as (CampaignMember & {
				characters: {
					id: string;
					name: string;
					level: number;
					job: string;
				} | null;
			})[];
		},
		enabled: !!campaignId && !loading,
	});
};

// Create campaign mutation
export const useCreateCampaign = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			name,
			description,
		}: {
			name: string;
			description?: string;
		}) => {
			if (isLocalMode()) {
				const now = new Date().toISOString();
				const userId = getLocalUserId();
				const campaign: Campaign = {
					id: crypto.randomUUID(),
					name,
					description: description || null,
					warden_id: userId,
					share_code: createShareCode(),
					is_active: true,
					created_at: now,
					updated_at: now,
					settings: { leveling_mode: "milestone" },
				};
				const campaigns = [campaign, ...loadLocalCampaigns()];
				saveLocalCampaigns(campaigns);
				const members = loadLocalMembers();
				members.push({
					id: crypto.randomUUID(),
					campaign_id: campaign.id,
					user_id: userId,
					character_id: null,
					role: "warden",
					joined_at: now,
				});
				saveLocalMembers(members);
				return campaign.id;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) {
					const now = new Date().toISOString();
					const userId = getLocalUserId();
					const campaign: Campaign = {
						id: crypto.randomUUID(),
						name,
						description: description || null,
						warden_id: userId,
						share_code: createShareCode(),
						is_active: true,
						created_at: now,
						updated_at: now,
						settings: { leveling_mode: "milestone" },
					};
					const campaigns = [campaign, ...loadLocalCampaigns()];
					saveLocalCampaigns(campaigns);
					const members = loadLocalMembers();
					members.push({
						id: crypto.randomUUID(),
						campaign_id: campaign.id,
						user_id: userId,
						character_id: null,
						role: "warden",
						joined_at: now,
					});
					saveLocalMembers(members);
					return campaign.id;
				}
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			// Try the RPC first; fall back to direct INSERT if the function
			// doesn't exist (e.g. newly provisioned Supabase project).
			const shareCode = createShareCode();
			let campaignId: string;

			const rpcResult = await supabase.rpc("create_campaign_with_code", {
				p_name: name,
				p_description: description || "",
				p_warden_id: user.id,
			});

			if (rpcResult.error) {
				const msg = String(rpcResult.error.message ?? "").toLowerCase();
				const isRpcMissing =
					msg.includes("does not exist") || msg.includes("no function matches");

				if (!isRpcMissing) {
					console.error("[useCreateCampaign] RPC failed:", rpcResult.error);
					throw rpcResult.error;
				}

				// Fallback: direct INSERT when RPC doesn't exist
				const now = new Date().toISOString();
				const { data: inserted, error: insertError } = await supabase
					.from("campaigns")
					.insert({
						name,
						description: description || null,
						warden_id: user.id,
						share_code: shareCode,
						is_active: true,
						settings: {
							leveling_mode: "milestone",
						} as unknown as Database["public"]["Tables"]["campaigns"]["Row"]["settings"],
						created_at: now,
						updated_at: now,
					})
					.select("id")
					.single();

				if (insertError || !inserted) {
					console.error(
						"[useCreateCampaign] Direct INSERT failed:",
						insertError,
					);
					throw (
						insertError ?? new AppError("Failed to create campaign", "UNKNOWN")
					);
				}

				campaignId = inserted.id;

				// Add the warden as a member
				await supabase.from("campaign_members").insert({
					campaign_id: campaignId,
					user_id: user.id,
					role: "warden",
				});
			} else {
				campaignId = rpcResult.data as string;
			}

			// Dual persistence constraint for Warden account:
			// Ensure it saves to local cache simultaneously so offline mode and guest cache remains synced
			const { data: latestCampaign, error: fetchError } = await supabase
				.from("campaigns")
				.select("*")
				.eq("id", campaignId)
				.maybeSingle();

			let resolvedCampaign: Campaign;

			if (!fetchError && latestCampaign) {
				resolvedCampaign = latestCampaign as Campaign;
				const localCampaigns = loadLocalCampaigns();
				const filtered = localCampaigns.filter((c) => c.id !== campaignId);
				saveLocalCampaigns([resolvedCampaign, ...filtered]);
			} else {
				// Optimistic local save if DB read fails (e.g., RLS propagation delay)
				// Always use the generated shareCode — never a placeholder
				const now = new Date().toISOString();
				resolvedCampaign = {
					id: campaignId,
					name,
					description: description || null,
					warden_id: user.id,
					share_code: shareCode,
					is_active: true,
					settings: { leveling_mode: "milestone" },
					created_at: now,
					updated_at: now,
				};
				const localCampaigns = loadLocalCampaigns();
				const filtered = localCampaigns.filter((c) => c.id !== campaignId);
				saveLocalCampaigns([resolvedCampaign, ...filtered]);
			}

			// Update the per-campaign React Query cache with real data
			// so CampaignDetail and invite modals show the actual share code
			queryClient.setQueryData(["campaigns", campaignId], resolvedCampaign);

			// Synchronously update the list cache to deliver seamless DDB/Roll20 level persistence
			// instantly without background refetch popping
			queryClient.setQueryData(
				["campaigns", "my"],
				(old: Campaign[] | undefined) => {
					const existing = old || [];
					if (existing.some((c) => c.id === resolvedCampaign.id))
						return existing;
					return [resolvedCampaign, ...existing];
				},
			);

			const members = loadLocalMembers();
			if (
				!members.some(
					(m) => m.campaign_id === campaignId && m.user_id === user.id,
				)
			) {
				members.push({
					id: crypto.randomUUID(),
					campaign_id: campaignId,
					user_id: user.id,
					character_id: null,
					role: "warden",
					joined_at: new Date().toISOString(),
				});
				saveLocalMembers(members);
			}

			return campaignId;
		},
		onSuccess: () => {
			// Trigger a background invalidation to ensure sync with remote without relying on an arbitrary timeout
			queryClient.invalidateQueries({ queryKey: ["campaigns", "my"] });
			queryClient.invalidateQueries({ queryKey: ["campaigns", "joined"] });
			toast({
				title: "Campaign Created",
				description: "Your campaign has been created with a share code.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to create campaign",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

// Update campaign mutation
export const useUpdateCampaign = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			campaignId,
			updates,
		}: {
			campaignId: string;
			updates: CampaignUpdate;
		}) => {
			if (isLocalMode()) {
				return updateLocalCampaign(campaignId, updates);
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) {
					return updateLocalCampaign(campaignId, updates);
				}
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const { data, error } = await supabase
				.from("campaigns")
				.update({
					name: updates.name,
					description: updates.description,
					is_active: updates.is_active,
					settings:
						updates.settings as Database["public"]["Tables"]["campaigns"]["Row"]["settings"],
				})
				.eq("id", campaignId)
				.select()
				.single();

			if (error) throw error;
			return (data || null) as Campaign;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId],
			});
			queryClient.invalidateQueries({ queryKey: ["campaigns", "my"] });
			toast({
				title: "Campaign updated",
				description: "Your changes have been saved.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to update campaign",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

// Join campaign mutation
export const useJoinCampaign = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			campaignId,
			characterId,
		}: {
			campaignId: string;
			characterId?: string;
		}) => {
			if (isLocalMode()) {
				const userId = getLocalUserId();
				const members = loadLocalMembers();
				const existingMemberIndex = members.findIndex(
					(member) =>
						member.campaign_id === campaignId && member.user_id === userId,
				);
				if (existingMemberIndex === -1) {
					members.push({
						id: crypto.randomUUID(),
						campaign_id: campaignId,
						user_id: userId,
						character_id: characterId || null,
						role: "ascendant",
						joined_at: new Date().toISOString(),
					});
				} else if (characterId) {
					members[existingMemberIndex] = {
						...members[existingMemberIndex],
						character_id: characterId,
					};
				}
				saveLocalMembers(members);
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) {
					const userId = getLocalUserId();
					const members = loadLocalMembers();
					const existingMemberIndex = members.findIndex(
						(member) =>
							member.campaign_id === campaignId && member.user_id === userId,
					);
					if (existingMemberIndex === -1) {
						members.push({
							id: crypto.randomUUID(),
							campaign_id: campaignId,
							user_id: userId,
							character_id: characterId || null,
							role: "ascendant",
							joined_at: new Date().toISOString(),
						});
					} else if (characterId) {
						members[existingMemberIndex] = {
							...members[existingMemberIndex],
							character_id: characterId,
						};
					}
					saveLocalMembers(members);
					return;
				}
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const { data: existingMember, error: existingMemberError } =
				await supabase
					.from("campaign_members")
					.select("id")
					.eq("campaign_id", campaignId)
					.eq("user_id", user.id)
					.maybeSingle();

			if (existingMemberError) throw existingMemberError;

			if (!existingMember) {
				const { error } = await supabase.from("campaign_members").insert({
					campaign_id: campaignId,
					user_id: user.id,
					character_id: null,
					role: "ascendant",
				});

				if (error) throw error;
			}

			if (characterId) {
				const attachResult = await supabase.rpc(
					"add_player_character_to_campaign",
					{
						p_campaign_id: campaignId,
						p_character_id: characterId,
					},
				);

				if (attachResult.error) {
					if (!isMissingAddCharacterRpc(attachResult.error)) {
						throw attachResult.error as Error;
					}

					const { error: legacyError } = await supabase
						.from("campaign_members")
						.update({ character_id: characterId })
						.eq("campaign_id", campaignId)
						.eq("user_id", user.id);

					if (legacyError) throw legacyError;
				}
			}

			// Dual persistence constraint for joining:
			const { data: joinedCampaign, error: fetchError } = await supabase
				.from("campaigns")
				.select("*")
				.eq("id", campaignId)
				.maybeSingle();

			if (!fetchError && joinedCampaign) {
				const localCampaigns = loadLocalCampaigns();
				if (!localCampaigns.some((c) => c.id === campaignId)) {
					saveLocalCampaigns([joinedCampaign as Campaign, ...localCampaigns]);
				}
				const localMembers = loadLocalMembers();
				const memberIdx = localMembers.findIndex(
					(m) => m.campaign_id === campaignId && m.user_id === user.id,
				);

				const newRole = "ascendant";
				if (memberIdx === -1) {
					localMembers.push({
						id: crypto.randomUUID(),
						campaign_id: campaignId,
						user_id: user.id,
						character_id: characterId || null,
						role: newRole,
						joined_at: new Date().toISOString(),
					});
					saveLocalMembers(localMembers);
				} else if (characterId) {
					localMembers[memberIdx].character_id = characterId;
					saveLocalMembers(localMembers);
				}

				// Synchronously update list cache for instant UI rendering
				queryClient.setQueryData(
					["campaigns", "joined"],
					(old: (Campaign & { member_role: string })[] | undefined) => {
						const existing = old || [];
						if (existing.some((c) => c.id === joinedCampaign.id))
							return existing;
						return [
							{ ...joinedCampaign, member_role: newRole } as Campaign & {
								member_role: string;
							},
							...existing,
						];
					},
				);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["campaigns", "joined"] });
			queryClient.invalidateQueries({ queryKey: ["characters"] });
			toast({
				title: "Joined Campaign",
				description: "You have successfully joined the campaign.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to join campaign",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

// Link character to existing membership mutation
export const useLinkCampaignCharacter = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			campaignId,
			characterId,
		}: {
			campaignId: string;
			characterId: string;
		}) => {
			if (isLocalMode()) {
				const userId = getLocalUserId();
				const members = loadLocalMembers();
				const existingMemberIndex = members.findIndex(
					(member) =>
						member.campaign_id === campaignId && member.user_id === userId,
				);

				if (existingMemberIndex === -1) {
					throw new AppError("Not a member of this campaign", "NOT_FOUND");
				}

				members[existingMemberIndex] = {
					...members[existingMemberIndex],
					character_id: characterId,
				};

				saveLocalMembers(members);
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				if (guestEnabled) {
					const userId = getLocalUserId();
					const members = loadLocalMembers();
					const existingMemberIndex = members.findIndex(
						(member) =>
							member.campaign_id === campaignId && member.user_id === userId,
					);

					if (existingMemberIndex === -1) {
						throw new AppError("Not a member of this campaign", "NOT_FOUND");
					}

					members[existingMemberIndex] = {
						...members[existingMemberIndex],
						character_id: characterId,
					};

					saveLocalMembers(members);
					return;
				}
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const attachResult = await supabase.rpc(
				"add_player_character_to_campaign",
				{
					p_campaign_id: campaignId,
					p_character_id: characterId,
				},
			);

			if (attachResult.error) {
				if (!isMissingAddCharacterRpc(attachResult.error)) {
					throw attachResult.error as Error;
				}

				const { error: legacyError } = await supabase
					.from("campaign_members")
					.update({ character_id: characterId })
					.eq("campaign_id", campaignId)
					.eq("user_id", user.id);

				if (legacyError) throw legacyError;
			}
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["campaigns", "joined"] });
			queryClient.invalidateQueries({ queryKey: ["campaigns", "my"] });
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "members"],
			});
			toast({
				title: "Ascendant Linked",
				description:
					"You have successfully linked your Ascendant to the campaign.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to link Ascendant",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

// Leave campaign mutation
export const useLeaveCampaign = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (campaignId: string) => {
			if (isLocalMode()) {
				const userId = getLocalUserId();
				const members = loadLocalMembers().filter(
					(member) =>
						!(member.campaign_id === campaignId && member.user_id === userId),
				);
				saveLocalMembers(members);
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) {
					const userId = getLocalUserId();
					const members = loadLocalMembers().filter(
						(member) =>
							!(member.campaign_id === campaignId && member.user_id === userId),
					);
					saveLocalMembers(members);
					return;
				}
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const { error } = await supabase
				.from("campaign_members")
				.delete()
				.eq("campaign_id", campaignId)
				.eq("user_id", user.id);

			if (error) throw error;

			// Also purge from local storage cache to prevent it from reappearing due to optimistic merging
			const members = loadLocalMembers().filter(
				(member) =>
					!(member.campaign_id === campaignId && member.user_id === user.id),
			);
			saveLocalMembers(members);
		},
		onSuccess: (_, campaignId) => {
			// Synchronously remove from joined list cache
			queryClient.setQueryData(
				["campaigns", "joined"],
				(old: (Campaign & { member_role: string })[] | undefined) => {
					if (!old) return [];
					return old.filter((c) => c.id !== campaignId);
				},
			);
			queryClient.invalidateQueries({ queryKey: ["campaigns", "joined"] });
			queryClient.invalidateQueries({ queryKey: ["campaigns", "my"] });
			toast({
				title: "Left Campaign",
				description: "You have left the campaign.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to leave campaign",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

// Check if current user is the Rift (Warden) of a campaign
export const useIsCampaignWarden = (campaignId: string) => {
	return useQuery({
		queryKey: ["campaigns", campaignId, "is-system"],
		queryFn: async () => {
			if (isLocalMode()) {
				const userId = getLocalUserId();
				return loadLocalCampaigns().some(
					(campaign) =>
						campaign.id === campaignId && campaign.warden_id === userId,
				);
			}
			const {
				data: { session },
				error: sessionError,
			} = await supabase.auth.getSession();
			if (sessionError || !session?.user) {
				if (guestEnabled) {
					const userId = getLocalUserId();
					return loadLocalCampaigns().some(
						(campaign) =>
							campaign.id === campaignId && campaign.warden_id === userId,
					);
				}
				return false;
			}
			const user = session.user;

			const { data: campaign, error } = await supabase
				.from("campaigns")
				.select("warden_id")
				.eq("id", campaignId)
				.single();

			if (error || !campaign) return false;
			return (
				(campaign as Database["public"]["Tables"]["campaigns"]["Row"])
					.warden_id === user.id
			);
		},
		enabled: !!campaignId,
	});
};

// Check if current user has System access (is System/Warden or co-System)
export const useHasWardenAccess = (campaignId: string) => {
	return useQuery({
		queryKey: ["campaigns", campaignId, "has-system-access"],
		queryFn: async () => {
			if (isLocalMode()) {
				const userId = getLocalUserId();
				const campaign = loadLocalCampaigns().find(
					(entry) => entry.id === campaignId,
				);
				if (campaign && campaign.warden_id === userId) return true;
				const member = loadLocalMembers().find(
					(entry) =>
						entry.campaign_id === campaignId && entry.user_id === userId,
				);
				return member?.role === "co-warden";
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) {
					const userId = getLocalUserId();
					const campaign = loadLocalCampaigns().find(
						(entry) => entry.id === campaignId,
					);
					if (campaign && campaign.warden_id === userId) return true;
					const member = loadLocalMembers().find(
						(entry) =>
							entry.campaign_id === campaignId && entry.user_id === userId,
					);
					return member?.role === "co-warden";
				}
				return false;
			}

			// Check if user is the Rift (Warden)
			const { data: campaign, error: campaignError } = await supabase
				.from("campaigns")
				.select("warden_id")
				.eq("id", campaignId)
				.single();

			if (
				!campaignError &&
				campaign &&
				(campaign as Database["public"]["Tables"]["campaigns"]["Row"])
					.warden_id === user.id
			) {
				return true;
			}

			// Check if user is a co-System
			const { data: member, error: memberError } = await supabase
				.from("campaign_members")
				.select("role")
				.eq("campaign_id", campaignId)
				.eq("user_id", user.id)
				.single();

			if (
				!memberError &&
				member &&
				(member as Database["public"]["Tables"]["campaign_members"]["Row"])
					.role === "co-warden"
			) {
				return true;
			}

			return false;
		},
		enabled: !!campaignId,
	});
};

// Get current user's role in a campaign
export const useCampaignRole = (campaignId: string) => {
	const { user, loading } = useAuth();
	return useQuery({
		queryKey: ["campaigns", campaignId, "role"],
		queryFn: async (): Promise<"warden" | "co-warden" | "ascendant" | null> => {
			if (isLocalMode()) {
				const userId = getLocalUserId();
				const campaign = loadLocalCampaigns().find(
					(entry) => entry.id === campaignId,
				);
				if (campaign && campaign.warden_id === userId) return "warden";
				const member = loadLocalMembers().find(
					(entry) =>
						entry.campaign_id === campaignId && entry.user_id === userId,
				);
				if (member?.role === "co-warden") return "co-warden";
				if (member) return "ascendant";
				return null;
			}
			if (!user) {
				if (guestEnabled) {
					const userId = getLocalUserId();
					const campaign = loadLocalCampaigns().find(
						(entry) => entry.id === campaignId,
					);
					if (campaign && campaign.warden_id === userId) return "warden";
					const member = loadLocalMembers().find(
						(entry) =>
							entry.campaign_id === campaignId && entry.user_id === userId,
					);
					if (member?.role === "co-warden") return "co-warden";
					if (member) return "ascendant";
					return null;
				}
				return null;
			}

			// Check if user is the Rift (Warden)
			const { data: campaign, error: campaignError } = await supabase
				.from("campaigns")
				.select("warden_id")
				.eq("id", campaignId)
				.single();

			if (
				!campaignError &&
				campaign &&
				(campaign as Database["public"]["Tables"]["campaigns"]["Row"])
					.warden_id === user.id
			) {
				return "warden";
			}

			// Check member role
			const { data: member, error: memberError } = await supabase
				.from("campaign_members")
				.select("role")
				.eq("campaign_id", campaignId)
				.eq("user_id", user.id)
				.single();

			if (!memberError && member) {
				return (
					member as Database["public"]["Tables"]["campaign_members"]["Row"]
				).role === "co-warden"
					? "co-warden"
					: "ascendant";
			}

			return null;
		},
		enabled: !!campaignId && !loading,
	});
};

// Check if user is a Warden (System/Warden) - now uses profiles table
export const useIsWarden = () => {
	return useQuery({
		queryKey: ["user", "is-warden"],
		queryFn: async (): Promise<boolean> => {
			if (isLocalMode()) {
				const userId = getLocalUserId();
				return loadLocalCampaigns().some(
					(campaign) => campaign.warden_id === userId,
				);
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) {
					return getLocalGuestRole() === "warden";
				}
				return false;
			}

			const { data, error } = await supabase
				.from("profiles")
				.select("role")
				.eq("id", user.id)
				.single();

			if (error || !data) return false;
			const role = (data as Database["public"]["Tables"]["profiles"]["Row"])
				.role;
			const normalizedRole = role === "admin" ? "warden" : role;
			return normalizedRole === "warden";
		},
		retry: false,
	});
};

// Delete campaign mutation
export const useDeleteCampaign = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (campaignId: string) => {
			if (isLocalMode()) {
				const campaigns = loadLocalCampaigns().filter(
					(campaign) => campaign.id !== campaignId,
				);
				saveLocalCampaigns(campaigns);
				const members = loadLocalMembers().filter(
					(member) => member.campaign_id !== campaignId,
				);
				saveLocalMembers(members);
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) {
					const campaigns = loadLocalCampaigns().filter(
						(campaign) => campaign.id !== campaignId,
					);
					saveLocalCampaigns(campaigns);
					const members = loadLocalMembers().filter(
						(member) => member.campaign_id !== campaignId,
					);
					saveLocalMembers(members);
					return;
				}
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const { error } = await supabase
				.from("campaigns")
				.delete()
				.eq("id", campaignId)
				.eq("warden_id", user.id);

			if (error) throw error;

			// Also purge from local storage cache to prevent it from reappearing due to optimistic merging
			const campaigns = loadLocalCampaigns().filter(
				(campaign) => campaign.id !== campaignId,
			);
			saveLocalCampaigns(campaigns);
			const members = loadLocalMembers().filter(
				(member) => member.campaign_id !== campaignId,
			);
			saveLocalMembers(members);
		},
		onSuccess: (_, campaignId) => {
			// Synchronously purge from caches
			queryClient.setQueryData(
				["campaigns", "my"],
				(old: Campaign[] | undefined) => {
					if (!old) return [];
					return old.filter((c) => c.id !== campaignId);
				},
			);
			queryClient.invalidateQueries({ queryKey: ["campaigns", "my"] });
			queryClient.invalidateQueries({ queryKey: ["campaigns", "joined"] });
			toast({
				title: "Campaign Deleted",
				description: "The campaign has been permanently deleted.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to delete campaign",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

// Regenerate share code mutation
export const useRegenerateShareCode = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (campaignId: string) => {
			const newCode = createShareCode();

			if (isLocalMode()) {
				updateLocalCampaign(campaignId, {});
				// Manually update share_code in local storage
				const campaigns = loadLocalCampaigns();
				const idx = campaigns.findIndex((c) => c.id === campaignId);
				if (idx !== -1) {
					campaigns[idx] = { ...campaigns[idx], share_code: newCode };
					saveLocalCampaigns(campaigns);
				}
				return newCode;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) {
					const campaigns = loadLocalCampaigns();
					const idx = campaigns.findIndex((c) => c.id === campaignId);
					if (idx !== -1) {
						campaigns[idx] = { ...campaigns[idx], share_code: newCode };
						saveLocalCampaigns(campaigns);
					}
					return newCode;
				}
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const { error } = await supabase
				.from("campaigns")
				.update({ share_code: newCode })
				.eq("id", campaignId)
				.eq("warden_id", user.id);

			if (error) throw error;
			return newCode;
		},
		onSuccess: (_, campaignId) => {
			queryClient.invalidateQueries({ queryKey: ["campaigns", campaignId] });
			queryClient.invalidateQueries({ queryKey: ["campaigns", "my"] });
			toast({
				title: "Share Code Regenerated",
				description:
					"The old share code has been invalidated. Share the new one with your Ascendants.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to regenerate share code",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};
