import { useQuery } from "@tanstack/react-query";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

/**
 * Shape returned by useCampaignSharedCharacters. Kept for backward-compat with
 * consumers (CampaignRegentOversight, CampaignCharacters, PartyTracker).
 */
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

/**
 * Returns every character attached to the campaign roster — i.e. every member
 * who joined with a character. The old `is_shared` filter has been removed;
 * the character a user joins with IS their campaign character.
 */
export const useCampaignSharedCharacters = (campaignId: string) => {
	return useQuery({
		queryKey: ["campaigns", campaignId, "shared-characters"],
		queryFn: async (): Promise<CampaignCharacterShare[]> => {
			if (!isSupabaseConfigured || import.meta.env.VITE_E2E === "true") {
				return [];
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) return [];
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const { data, error } = await supabase.rpc("get_campaign_roster", {
				p_campaign_id: campaignId,
			});

			if (error) throw error;
			return (data || [])
				.filter((entry) => entry.character_id !== null)
				.map((entry) => ({
					id: entry.campaign_member_id || `roster:${entry.character_id}`,
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
