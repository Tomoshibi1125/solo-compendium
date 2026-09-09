import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";
import { getLocalUserId } from "@/lib/guestStore";

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

interface CampaignCharacterShare {
	id: string;
	campaign_id: string;
	character_id: string;
	shared_by: string;
	owner_user_id: string;
	permissions: "view" | "edit";
	shared_at: string;
	characters?: {
		id: string;
		name: string;
		level: number;
		job: string;
	};
}

const getSharesKey = (campaignId: string) =>
	`solo-compendium.campaign.${campaignId}.shares`;

const loadLocalShares = (campaignId: string): CampaignCharacterShare[] => {
	if (typeof window === "undefined") return [];
	const raw = window.localStorage.getItem(getSharesKey(campaignId));
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as CampaignCharacterShare[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const saveLocalShares = (
	campaignId: string,
	shares: CampaignCharacterShare[],
) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(getSharesKey(campaignId), JSON.stringify(shares));
};

// Fetch shared characters in campaign
export const useCampaignSharedCharacters = (campaignId: string) => {
	return useQuery({
		queryKey: ["campaigns", campaignId, "shared-characters"],
		queryFn: async (): Promise<CampaignCharacterShare[]> => {
			if (!isSupabaseConfigured || import.meta.env.VITE_E2E === "true") {
				return loadLocalShares(campaignId);
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) return loadLocalShares(campaignId);
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const { data, error } = await supabase.rpc("get_campaign_roster", {
				p_campaign_id: campaignId,
			});

			if (error) throw error;
			return (data || [])
				.filter((entry) => entry.is_shared && entry.character_id !== null)
				.map((entry) => ({
					id: entry.campaign_member_id || `shared:${entry.character_id}`,
					campaign_id: campaignId,
					character_id: entry.character_id as string,
					shared_by: entry.user_id,
					owner_user_id: entry.user_id,
					permissions: "view" as const,
					shared_at: entry.joined_at,
					characters: {
						id: entry.character_id as string,
						name: entry.character_name || "Unnamed Ascendant",
						level: entry.character_level || 1,
						job: entry.character_job || "Unknown",
					},
				}));
		},
		enabled: !!campaignId,
	});
};

// Share character mutation
export const useShareCharacter = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			campaignId,
			characterId,
			permissions = "view",
		}: {
			campaignId: string;
			characterId: string;
			permissions?: "view" | "edit";
		}) => {
			if (!isSupabaseConfigured || import.meta.env.VITE_E2E === "true") {
				const now = new Date().toISOString();
				const next: CampaignCharacterShare = {
					id: crypto.randomUUID(),
					campaign_id: campaignId,
					character_id: characterId,
					shared_by: getLocalUserId(),
					owner_user_id: getLocalUserId(),
					permissions,
					shared_at: now,
				};
				const updated = [...loadLocalShares(campaignId), next];
				saveLocalShares(campaignId, updated);
				return next;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) {
					const now = new Date().toISOString();
					const next: CampaignCharacterShare = {
						id: crypto.randomUUID(),
						campaign_id: campaignId,
						character_id: characterId,
						shared_by: getLocalUserId(),
						owner_user_id: getLocalUserId(),
						permissions,
						shared_at: now,
					};
					const updated = [...loadLocalShares(campaignId), next];
					saveLocalShares(campaignId, updated);
					return next;
				}
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const { data, error } = await supabase
				.from("campaign_character_shares")
				.insert({
					campaign_id: campaignId,
					character_id: characterId,
					shared_by: user.id,
					permissions,
				})
				.select()
				.single();

			if (error) throw error;
			return data as CampaignCharacterShare;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "shared-characters"],
			});
			toast({
				title: "Ascendant shared",
				description: "Your ascendant is now visible to campaign members.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to share ascendant",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

// Unshare character mutation
export const useUnshareCharacter = () => {
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
			if (!isSupabaseConfigured || import.meta.env.VITE_E2E === "true") {
				const existing = loadLocalShares(campaignId);
				const next = existing.filter(
					(share) => share.character_id !== characterId,
				);
				saveLocalShares(campaignId, next);
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user && guestEnabled) {
				const existing = loadLocalShares(campaignId);
				const next = existing.filter(
					(share) => share.character_id !== characterId,
				);
				saveLocalShares(campaignId, next);
				return;
			}

			const { error } = await supabase
				.from("campaign_character_shares")
				.delete()
				.eq("campaign_id", campaignId)
				.eq("character_id", characterId);

			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "shared-characters"],
			});
			toast({
				title: "Ascendant unshared",
				description: "Your ascendant is no longer visible to campaign members.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to unshare ascendant",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};
