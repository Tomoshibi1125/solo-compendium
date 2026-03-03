import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getErrorMessage, logErrorWithContext } from "@/lib/errorHandling";

type CampaignInventory =
	Database["public"]["Tables"]["campaign_inventory"]["Row"];
type CampaignInventoryInsert =
	Database["public"]["Tables"]["campaign_inventory"]["Insert"];
type CampaignInventoryUpdate =
	Database["public"]["Tables"]["campaign_inventory"]["Update"];

// Note: campaignId is used for data fetching, but we accept characterId for DDB parity logging.
// If characterId is provided, we broadcast changes on their behalf.
export const useCampaignInventory = (
	campaignId: string | null,
	characterId?: string,
) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const playerTools = usePlayerToolsEnhancements();

	const { data: inventory = [], isLoading } = useQuery({
		queryKey: ["campaign_inventory", campaignId],
		queryFn: async () => {
			if (!campaignId) return [];

			const { data, error } = await supabase
				.from("campaign_inventory")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("name", { ascending: true });

			if (error) {
				logErrorWithContext(error, "useCampaignInventory.query");
				throw error;
			}

			return (data || []) as CampaignInventory[];
		},
		enabled: !!campaignId,
	});

	const addItem = useMutation({
		mutationFn: async (item: Omit<CampaignInventoryInsert, "campaign_id">) => {
			if (!campaignId) throw new Error("No active campaign");
			const {
				data: { user },
			} = await supabase.auth.getUser();

			const { data, error } = await supabase
				.from("campaign_inventory")
				.insert({
					...item,
					campaign_id: campaignId,
					added_by: user?.id || null,
				})
				.select()
				.single();

			if (error) {
				logErrorWithContext(error, "useCampaignInventory.addItem");
				throw error;
			}
			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["campaign_inventory", campaignId],
			});
			toast({ title: "Item added to Party Stash" });
			if (characterId) {
				const qtyStr =
					data.quantity && data.quantity > 1 ? `(${data.quantity}x) ` : "";
				playerTools
					.trackInventoryChange(
						characterId,
						`${qtyStr}${data.name} to Party Stash`,
						"add",
					)
					.catch(console.error);
			}
		},
		onError: (error) => {
			logErrorWithContext(error, "useCampaignInventory.addItem");
			toast({
				title: "Failed to add item",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const updateItem = useMutation({
		mutationFn: async ({
			id,
			updates,
		}: {
			id: string;
			updates: CampaignInventoryUpdate;
		}) => {
			const { data, error } = await supabase
				.from("campaign_inventory")
				.update(updates)
				.eq("id", id)
				.select()
				.single();

			if (error) {
				logErrorWithContext(error, "useCampaignInventory.updateItem");
				throw error;
			}
			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["campaign_inventory", campaignId],
			});
			if (characterId) {
				const qtyStr =
					data.quantity && data.quantity > 1 ? `(now ${data.quantity}x) ` : "";
				playerTools
					.trackCustomFeatureUsage(
						characterId,
						`Party Stash: ${data.name}`,
						`updated quantity ${qtyStr}`,
						"SA",
					)
					.catch(console.error);
			}
		},
		onError: (error) => {
			logErrorWithContext(error, "useCampaignInventory.updateItem");
			toast({
				title: "Failed to update item",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const removeItem = useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) => {
			const { error } = await supabase
				.from("campaign_inventory")
				.delete()
				.eq("id", id);

			if (error) {
				logErrorWithContext(error, "useCampaignInventory.removeItem");
				throw error;
			}
			return { id, name };
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["campaign_inventory", campaignId],
			});
			if (characterId) {
				playerTools
					.trackInventoryChange(
						characterId,
						`${data.name} from Party Stash`,
						"remove",
					)
					.catch(console.error);
			}
		},
		onError: (error) => {
			logErrorWithContext(error, "useCampaignInventory.removeItem");
			toast({
				title: "Failed to remove item",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	return {
		inventory,
		isLoading,
		addItem: addItem.mutateAsync,
		updateItem: updateItem.mutateAsync,
		removeItem: removeItem.mutateAsync,
	};
};
