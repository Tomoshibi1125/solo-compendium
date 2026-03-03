import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getErrorMessage, logErrorWithContext } from "@/lib/errorHandling";

export type WikiArticle =
	Database["public"]["Tables"]["campaign_wiki_articles"]["Row"];
export type WikiArticleInsert =
	Database["public"]["Tables"]["campaign_wiki_articles"]["Insert"];
export type WikiArticleUpdate =
	Database["public"]["Tables"]["campaign_wiki_articles"]["Update"];

export const useCampaignWiki = (campaignId: string | null) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data: articles = [], isLoading } = useQuery({
		queryKey: ["campaign_wiki_articles", campaignId],
		queryFn: async () => {
			if (!campaignId) return [];

			const { data, error } = await supabase
				.from("campaign_wiki_articles")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("title", { ascending: true });

			if (error) {
				logErrorWithContext(error, "useCampaignWiki.query");
				throw error;
			}

			return (data || []) as WikiArticle[];
		},
		enabled: !!campaignId,
	});

	const addArticle = useMutation({
		mutationFn: async (article: Omit<WikiArticleInsert, "campaign_id">) => {
			if (!campaignId) throw new Error("No active campaign");

			const { data, error } = await supabase
				.from("campaign_wiki_articles")
				.insert({
					...article,
					campaign_id: campaignId,
				})
				.select()
				.single();

			if (error) {
				logErrorWithContext(error, "useCampaignWiki.addArticle");
				throw error;
			}
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["campaign_wiki_articles", campaignId],
			});
			toast({ title: "Added wiki article" });
		},
		onError: (error) => {
			logErrorWithContext(error, "useCampaignWiki.addArticle");
			toast({
				title: "Failed to add wiki article",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const updateArticle = useMutation({
		mutationFn: async ({
			id,
			updates,
		}: {
			id: string;
			updates: WikiArticleUpdate;
		}) => {
			const { data, error } = await supabase
				.from("campaign_wiki_articles")
				.update(updates)
				.eq("id", id)
				.select()
				.single();

			if (error) {
				logErrorWithContext(error, "useCampaignWiki.updateArticle");
				throw error;
			}
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["campaign_wiki_articles", campaignId],
			});
		},
		onError: (error) => {
			logErrorWithContext(error, "useCampaignWiki.updateArticle");
			toast({
				title: "Failed to update wiki article",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const removeArticle = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await supabase
				.from("campaign_wiki_articles")
				.delete()
				.eq("id", id);

			if (error) {
				logErrorWithContext(error, "useCampaignWiki.removeArticle");
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["campaign_wiki_articles", campaignId],
			});
		},
		onError: (error) => {
			logErrorWithContext(error, "useCampaignWiki.removeArticle");
			toast({
				title: "Failed to remove wiki article",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	return {
		articles,
		isLoading,
		addArticle: addArticle.mutateAsync,
		updateArticle: updateArticle.mutateAsync,
		removeArticle: removeArticle.mutateAsync,
	};
};
