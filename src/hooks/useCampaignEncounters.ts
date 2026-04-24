import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import {
	readLocalEncounterEntries,
	readLocalEncounters,
} from "@/lib/guestStore";

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

type EncounterRow = Database["public"]["Tables"]["campaign_encounters"]["Row"];
type EncounterEntryRow =
	Database["public"]["Tables"]["campaign_encounter_entries"]["Row"];

type SaveEncounterArgs = {
	campaignId: string;
	encounterId?: string | null;
	name: string;
	description?: string | null;
	difficulty?: Json;
	entries?: Json;
	loot?: Json;
};

export const useCampaignEncounters = (campaignId: string) => {
	return useQuery({
		queryKey: ["campaigns", campaignId, "encounters"],
		queryFn: async (): Promise<EncounterRow[]> => {
			if (!campaignId) return [];

			const hydrateLocal = (): EncounterRow[] =>
				readLocalEncounters(campaignId)
					.slice()
					.sort((a, b) =>
						(b.updated_at ?? "").localeCompare(a.updated_at ?? ""),
					);

			if (!isSupabaseConfigured) return hydrateLocal();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) return hydrateLocal();
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const { data, error } = await supabase
				.from("campaign_encounters")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("updated_at", { ascending: false });

			if (error) throw error;
			return (data || []) as EncounterRow[];
		},
		enabled: !!campaignId,
	});
};

export const useCampaignEncounterEntries = (
	encounterId: string | null,
	campaignId?: string,
) => {
	return useQuery({
		queryKey: ["campaigns", "encounters", encounterId, "entries"],
		queryFn: async (): Promise<EncounterEntryRow[]> => {
			if (!encounterId) return [];

			const hydrateLocal = (): EncounterEntryRow[] => {
				if (!campaignId) return [];
				return readLocalEncounterEntries(campaignId)
					.filter((e) => e.encounter_id === encounterId)
					.slice()
					.sort((a, b) => a.created_at.localeCompare(b.created_at));
			};

			if (!isSupabaseConfigured) return hydrateLocal();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				if (guestEnabled) return hydrateLocal();
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const { data, error } = await supabase
				.from("campaign_encounter_entries")
				.select("*")
				.eq("encounter_id", encounterId)
				.order("created_at", { ascending: true });

			if (error) throw error;
			return (data || []) as EncounterEntryRow[];
		},
		enabled: !!encounterId,
	});
};

export const useSaveCampaignEncounter = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			campaignId,
			encounterId,
			name,
			description,
			difficulty = {},
			entries = [],
			loot = [],
		}: SaveEncounterArgs) => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new AppError("Not authenticated", "AUTH_REQUIRED");

			const { data, error } = await supabase.rpc("save_campaign_encounter", {
				p_campaign_id: campaignId,
				p_encounter_id: encounterId ?? undefined,
				p_name: name,
				p_description: description ?? undefined,
				p_difficulty: difficulty,
				p_entries: entries,
				p_loot: loot,
			});

			if (error) throw error;
			return data as string;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "encounters"],
			});
			toast({
				title: "Encounter saved",
				description: "Encounter stored in campaign library.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to save encounter",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export const useDeleteCampaignEncounter = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			campaignId: _campaignId,
			encounterId,
		}: {
			campaignId: string;
			encounterId: string;
		}) => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new AppError("Not authenticated", "AUTH_REQUIRED");

			const { error } = await supabase
				.from("campaign_encounters")
				.delete()
				.eq("id", encounterId);

			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "encounters"],
			});
			toast({
				title: "Encounter deleted",
				description: "Removed from campaign library.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to delete encounter",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export const useDeployCampaignEncounter = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			encounterId,
		}: {
			campaignId: string;
			encounterId: string;
		}) => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new AppError("Not authenticated", "AUTH_REQUIRED");

			const { data, error } = await supabase.rpc("deploy_campaign_encounter", {
				p_encounter_id: encounterId,
			});

			if (error) throw error;
			return data as string;
		},
		onSuccess: (sessionId, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "combat-session"],
			});
			toast({
				title: "Encounter deployed",
				description: "Combat session created from encounter.",
			});
			return sessionId;
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to deploy encounter",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};
