import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCompendiumFeats, useFeatures } from "@/hooks/useFeatures";
import { usePublishedHomebrew } from "@/hooks/useHomebrewContent";
import type { Json } from "@/integrations/supabase/types";
import {
	filterPublishedHomebrewRecords,
	type HomebrewRuntimeFeat,
	mapHomebrewFeatForRuntime,
} from "@/lib/homebrewRuntime";
import { getCharacterCampaignId } from "@/lib/sourcebookAccess";
import {
	formatRegentVernacular,
	normalizeRegentSearch,
} from "@/lib/vernacular";

export function AddFeatDialog({
	open,
	onOpenChange,
	characterId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const { data: feats = [], isLoading } = useCompendiumFeats();
	const { addFeature } = useFeatures(characterId);
	const { toast } = useToast();
	const { data: campaignId = null } = useQuery<string | null>({
		queryKey: ["add-feat-campaign-id", characterId],
		queryFn: () => getCharacterCampaignId(characterId),
		enabled: open && !!characterId,
	});
	const { data: publishedHomebrew = [], isLoading: homebrewLoading } =
		usePublishedHomebrew("feat", campaignId);
	const homebrewFeats = useMemo<HomebrewRuntimeFeat[]>(
		() =>
			filterPublishedHomebrewRecords(publishedHomebrew, "feat").map(
				mapHomebrewFeatForRuntime,
			),
		[publishedHomebrew],
	);
	const allFeats = useMemo(
		() => [...feats, ...(homebrewFeats as unknown as typeof feats)],
		[feats, homebrewFeats],
	);

	const visibleFeats = useMemo(() => {
		const trimmedQuery = normalizeRegentSearch(
			searchQuery.trim().toLowerCase(),
		);
		if (!trimmedQuery) return allFeats.slice(0, 50);

		return allFeats
			.filter((feat) => {
				const name = (feat.name || "").toLowerCase();
				const desc = (feat.description || "").toLowerCase();
				return name.includes(trimmedQuery) || desc.includes(trimmedQuery);
			})
			.slice(0, 50);
	}, [allFeats, searchQuery]);

	const handleAdd = async (feat: (typeof allFeats)[0]) => {
		const displayName = formatRegentVernacular(feat.name);
		const isHomebrewFeat = (feat as { _homebrew?: boolean })._homebrew;
		try {
			await addFeature({
				character_id: characterId,
				name: feat.name,
				description: feat.description,
				source: isHomebrewFeat ? "Homebrew Feat" : "feat",
				level_acquired: 1, // Defaulting to 1, can be edited later
				feat_id: isHomebrewFeat ? null : feat.id,
				homebrew_id: isHomebrewFeat
					? (feat as { homebrew_id?: string }).homebrew_id
					: null,
				modifiers: isHomebrewFeat
					? (((feat as { modifiers?: unknown }).modifiers ??
							null) as Json | null)
					: null,
			});

			toast({
				title: "Feat Added",
				description: `${displayName} has been added to your features.`,
			});

			onOpenChange(false);
			setSearchQuery("");
		} catch (error: unknown) {
			console.error("Add feat error:", error);
			const message =
				error instanceof Error ? error.message : "Failed to add feat.";
			toast({
				title: "Error",
				description: message,
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>Add Feat</DialogTitle>
					<DialogDescription>
						Search and add feats from the compendium to your character
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 flex-1 overflow-hidden flex flex-col">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Search feats..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>

					<div className="flex-1 overflow-y-auto space-y-2">
						{isLoading || homebrewLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-6 h-6 animate-spin text-primary" />
							</div>
						) : visibleFeats.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								{searchQuery
									? "No feats found matching your search."
									: "No feats available."}
							</div>
						) : (
							visibleFeats.map((feat) => (
								<div
									key={feat.id}
									className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1 flex-wrap">
												<Sparkles className="w-4 h-4 text-primary" />
												<span className="font-heading font-semibold">
													{formatRegentVernacular(feat.name)}
												</span>
												{feat.source_book && (
													<Badge variant="outline" className="text-xs">
														{formatRegentVernacular(feat.source_book)}
													</Badge>
												)}
											</div>
											{feat.description && (
												<p className="text-xs text-muted-foreground line-clamp-2 mt-1">
													{formatRegentVernacular(feat.description)}
												</p>
											)}
										</div>
										<Button size="sm" onClick={() => handleAdd(feat)}>
											Add
										</Button>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
