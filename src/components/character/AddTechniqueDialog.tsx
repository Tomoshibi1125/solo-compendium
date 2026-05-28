import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, Sword } from "lucide-react";
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
import { useCharacterChoiceTotals } from "@/hooks/useCharacterChoiceTotals";
import { useCharacter } from "@/hooks/useCharacters";
import {
	isRuneGranted,
	useRuneGrantedAbilities,
} from "@/hooks/useRuneGrantedAbilities";
import { useTechniques } from "@/hooks/useTechniques";
import { listLearnableTechniques } from "@/lib/canonicalCompendium";
import {
	entryHasAccessToken,
	getTechniqueAccessTokens,
} from "@/lib/jobAbilityAccess";
import { getCharacterCampaignId } from "@/lib/sourcebookAccess";
import {
	formatRegentVernacular,
	normalizeRegentSearch,
} from "@/lib/vernacular";

export function AddTechniqueDialog({
	open,
	onOpenChange,
	characterId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const { addTechnique, techniques: knownTechniques = [] } =
		useTechniques(characterId);
	const { data: character } = useCharacter(characterId);
	const { data: choiceTotals } = useCharacterChoiceTotals(characterId);
	const { grantedAbilityNames, grantedAbilityRefs } =
		useRuneGrantedAbilities(characterId);
	const { toast } = useToast();

	const characterJob = (character?.job ?? "").trim().toLowerCase();
	const { data: techniques = [], isLoading } = useQuery({
		queryKey: [
			"compendium-techniques",
			characterId,
			character?.job,
			character?.path,
			character?.level,
			searchQuery,
		],
		queryFn: async () => {
			if (!character?.job) return [];
			const campaignId = await getCharacterCampaignId(characterId);
			const search = searchQuery.trim()
				? normalizeRegentSearch(searchQuery.trim()).toLowerCase()
				: undefined;
			return listLearnableTechniques({
				search,
				accessContext: { campaignId },
				jobName: character.job,
				pathName: character.path ?? null,
				characterLevel: character.level ?? null,
				maxLevel: character.level ?? null,
			});
		},
		enabled: open,
	});

	/** Decide which access tags apply to a technique. */
	const computeAccess = useMemo(() => {
		return (tech: (typeof techniques)[0]): string[] => {
			const sources: string[] = [];
			const classReq = (tech.class_requirement ?? "").trim().toLowerCase();
			const accessTokens = getTechniqueAccessTokens(
				character?.job,
				character?.path,
				null,
			);
			if (
				characterJob &&
				(classReq === characterJob ||
					entryHasAccessToken(tech.tags ?? [], accessTokens))
			) {
				sources.push("Job");
			}
			if (isRuneGranted(tech.name, grantedAbilityNames, grantedAbilityRefs)) {
				sources.push("Rune");
			}
			return sources;
		};
	}, [
		character?.job,
		character?.path,
		characterJob,
		grantedAbilityNames,
		grantedAbilityRefs,
	]);

	const visibleTechniques = useMemo(() => {
		const trimmedQuery = normalizeRegentSearch(
			searchQuery.trim().toLowerCase(),
		);

		const filtered = techniques.filter((tech) => {
			if (!trimmedQuery) return true;
			const name = (tech.name || "").toLowerCase();
			const type = (tech.technique_type || "").toLowerCase();
			return name.includes(trimmedQuery) || type.includes(trimmedQuery);
		});

		return filtered.slice(0, 100);
	}, [techniques, searchQuery]);

	const handleAdd = async (tech: (typeof techniques)[0]) => {
		const displayName = formatRegentVernacular(tech.name);
		try {
			await addTechnique.mutateAsync(tech.id);

			toast({
				title: "Technique Learned",
				description: `${displayName} has been added to your techniques.`,
			});

			onOpenChange(false);
			setSearchQuery("");
		} catch (error: unknown) {
			console.error("Add technique error:", error);
			const message =
				error instanceof Error ? error.message : "Failed to add technique.";
			toast({
				title: "Error",
				description: message,
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh] min-h-0 overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 flex-wrap">
						<span>Discover Technique</span>
						{choiceTotals && choiceTotals.techniques > 0 && (
							<Badge variant="outline" className="text-xs">
								{(knownTechniques ?? []).length} / {choiceTotals.techniques}{" "}
								known
							</Badge>
						)}
					</DialogTitle>
					<DialogDescription>
						Search and learn techniques from the compendium
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 min-h-0 flex-1 overflow-hidden flex flex-col">
					<div className="flex items-center gap-3 flex-shrink-0">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search techniques..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					<div className="min-h-0 flex-1 overflow-y-auto space-y-2 pr-1">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-6 h-6 animate-spin text-primary" />
							</div>
						) : visibleTechniques.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								{searchQuery
									? "No techniques found matching your search."
									: "No techniques available for your job."}
							</div>
						) : (
							visibleTechniques.map((tech) => {
								const access = computeAccess(tech);
								return (
									<div
										key={tech.id}
										className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1 flex-wrap">
													<Sword className="w-4 h-4 text-primary" />
													<span className="font-heading font-semibold">
														{formatRegentVernacular(tech.name)}
													</span>
													{tech.technique_type && (
														<Badge
															variant="outline"
															className="text-xs capitalize"
														>
															{tech.technique_type}
														</Badge>
													)}
													{tech.level_requirement && (
														<Badge variant="secondary" className="text-xs">
															Level {tech.level_requirement}
														</Badge>
													)}
													{tech.class_requirement && (
														<Badge
															variant="outline"
															className="text-xs capitalize"
														>
															{tech.class_requirement}
														</Badge>
													)}
													{access.map((src) => (
														<Badge
															key={src}
															variant={src === "Rune" ? "default" : "outline"}
															className="text-[10px] uppercase tracking-wider"
														>
															{src}
														</Badge>
													))}
													{(tech as { source_book?: string | null })
														.source_book && (
														<Badge
															variant="secondary"
															className="text-[9px] uppercase bg-primary/10 text-primary/70 border-primary/20"
														>
															{formatRegentVernacular(
																(tech as { source_book?: string | null })
																	.source_book as string,
															)}
														</Badge>
													)}
												</div>
												{tech.description && (
													<p className="text-xs text-muted-foreground line-clamp-2 mt-1">
														{formatRegentVernacular(tech.description)}
													</p>
												)}
											</div>
											<Button
												size="sm"
												onClick={() => handleAdd(tech)}
												disabled={addTechnique.isPending}
											>
												Add
											</Button>
										</div>
									</div>
								);
							})
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
