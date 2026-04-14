import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getErrorMessage, logErrorWithContext } from "@/lib/errorHandling";
import { readLocalWikiArticles, saveLocalWikiArticles } from "@/lib/guestStore";

const isLocalMode = () => !isSupabaseConfigured;

export type WikiArticle =
	Database["public"]["Tables"]["campaign_wiki_articles"]["Row"];
type WikiArticleInsert =
	Database["public"]["Tables"]["campaign_wiki_articles"]["Insert"];
type WikiArticleUpdate =
	Database["public"]["Tables"]["campaign_wiki_articles"]["Update"];

export const useCampaignWiki = (campaignId: string | null) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data: articles = [], isLoading } = useQuery({
		queryKey: ["campaign_wiki_articles", campaignId],
		queryFn: async () => {
			if (!campaignId) return [];

			if (isLocalMode()) {
				return readLocalWikiArticles(campaignId);
			}

			const { data, error } = await supabase
				.from("campaign_wiki_articles")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: true });

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

			if (isLocalMode()) {
				const existing = readLocalWikiArticles(campaignId);
				const now = new Date().toISOString();
				const nextId = `local_wiki_${crypto.randomUUID()}`;
				const newArticle: WikiArticle = {
					id: nextId,
					campaign_id: campaignId,
					title: article.title,
					content: article.content ?? "",
					category: article.category ?? "General",
					is_public: article.is_public ?? false,
					created_at: now,
					updated_at: now,
					created_by: "guest",
				};
				const updated = [...existing, newArticle];
				saveLocalWikiArticles(campaignId, updated);
				return newArticle;
			}

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
			if (isLocalMode()) {
				if (!campaignId) return null;
				const existing = readLocalWikiArticles(campaignId);
				const targetIndex = existing.findIndex((a) => a.id === id);
				if (targetIndex === -1) throw new Error("Not found locally");

				const updatedArticle = {
					...existing[targetIndex],
					...updates,
					updated_at: new Date().toISOString(),
				} as WikiArticle;

				existing[targetIndex] = updatedArticle;
				saveLocalWikiArticles(campaignId, existing);
				return updatedArticle;
			}

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
			if (isLocalMode()) {
				if (!campaignId) return null;
				const existing = readLocalWikiArticles(campaignId);
				const filtered = existing.filter((a) => a.id !== id);
				saveLocalWikiArticles(campaignId, filtered);
				return;
			}

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
