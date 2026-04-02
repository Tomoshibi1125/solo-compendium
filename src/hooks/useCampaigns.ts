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

interface Campaign {
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

const loadLocalCampaigns = (): Campaign[] => {
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

const saveLocalCampaigns = (campaigns: Campaign[]) => {
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

const loadLocalMembers = (): CampaignMember[] => {
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

const saveLocalMembers = (members: CampaignMember[]) => {
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

// Fetch campaigns where user is System (Protocol Warden)
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
			return (data || []) as Campaign[];
		},
		retry: false, // Don't retry if not authenticated
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
						if (!campaign) return null;
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
							if (!campaign) return null;
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
			return (
				(data || []) as Array<{
					campaigns: Database["public"]["Tables"]["campaigns"]["Row"];
					role: string;
				}>
			).map((member) => ({
				...member.campaigns,
				member_role: member.role,
			})) as (Campaign & { member_role: string })[];
		},
		retry: false, // Don't retry if not authenticated
	});
};

// Fetch single campaign by ID
export const useCampaign = (campaignId: string) => {
	return useQuery({
		queryKey: ["campaigns", campaignId],
		queryFn: async () => {
			if (isLocalMode()) {
				return (
					loadLocalCampaigns().find((campaign) => campaign.id === campaignId) ||
					null
				);
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user && guestEnabled) {
				return (
					loadLocalCampaigns().find((campaign) => campaign.id === campaignId) ||
					null
				);
			}
			const { data, error } = await supabase
				.from("campaigns")
				.select("*")
				.eq("id", campaignId)
				.single();

			if (error) throw error;
			return (data || null) as Campaign;
		},
		enabled: !!campaignId,
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
			await supabase.auth.getUser();
			const { data, error } = await supabase.rpc("get_campaign_by_share_code", {
				p_share_code: shareCode.toUpperCase(),
			});

			if (error) throw error;
			const campaign = Array.isArray(data) ? data[0] : data;
			return (campaign || null) as Campaign;
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
						role: "co-warden",
						joined_at: now,
					});
					saveLocalMembers(members);
					return campaign.id;
				}
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			// Call the database function to create campaign with share code
			const { data, error } = await supabase.rpc("create_campaign_with_code", {
				p_name: name,
				p_description: description || "",
				p_warden_id: user.id,
			});

			if (error) {
				// Error is handled by React Query's error state
				throw error;
			}
			return data as string; // Returns campaign ID
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
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
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
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
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
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
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
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
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
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

// Check if current user is the System (Protocol Warden) of a campaign
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

// Check if current user has System access (is System/Protocol Warden or co-System)
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

			// Check if user is the System (Protocol Warden)
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
		queryFn: async (): Promise<"system" | "co-warden" | "ascendant" | null> => {
			if (isLocalMode()) {
				const userId = getLocalUserId();
				const campaign = loadLocalCampaigns().find(
					(entry) => entry.id === campaignId,
				);
				if (campaign && campaign.warden_id === userId) return "system";
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
					if (campaign && campaign.warden_id === userId) return "system";
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

			// Check if user is the System (Protocol Warden)
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
				return "system";
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

// Check if user is a Warden (System/Protocol Warden) - now uses profiles table
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
