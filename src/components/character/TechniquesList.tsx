/**
 * TechniquesList — character-owned techniques (Sword Arts) panel.
 *
 * Mirrors the shape of PowersList but for the `character_techniques` table.
 * Designed to be embedded inside `AbilitiesPanel` (sub-tab "Techniques") or
 * rendered standalone with the AscendantWindow chrome.
 */

import { Plus, Sword, Trash2 } from "lucide-react";
import { useState } from "react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTechniques } from "@/hooks/useTechniques";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { DetailData } from "@/types/character";
import { AddTechniqueDialog } from "./AddTechniqueDialog";

interface TechniquesListProps {
	characterId: string;
	onSelectDetail?: (detail: DetailData) => void;
	/** When true, render without the AscendantWindow chrome (used inside AbilitiesPanel). */
	hideHeader?: boolean;
}

export function TechniquesList({
	characterId,
	onSelectDetail,
	hideHeader = false,
}: TechniquesListProps) {
	const {
		techniques = [],
		isLoading,
		removeTechnique,
	} = useTechniques(characterId);
	const { toast } = useToast();
	const [addDialogOpen, setAddDialogOpen] = useState(false);

	const handleRemove = async (id: string, name: string) => {
		const displayName = formatRegentVernacular(name);
		if (!confirm(`Forget ${displayName}?`)) return;
		try {
			await removeTechnique.mutateAsync(id);
			toast({
				title: "Removed",
				description: `${displayName} has been forgotten.`,
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to remove technique.",
				variant: "destructive",
			});
		}
	};

	const body = (
		<>
			<div className="space-y-4">
				<div className="flex items-center justify-between gap-2">
					<div className="text-xs text-muted-foreground">
						{techniques.length} technique{techniques.length === 1 ? "" : "s"}
					</div>
					<Button
						onClick={() => setAddDialogOpen(true)}
						size="sm"
						className="gap-2"
					>
						<Plus className="w-4 h-4" />
						Discover Technique
					</Button>
				</div>

				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground text-sm">
						Loading techniques…
					</div>
				) : techniques.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<Sword className="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p>No techniques yet</p>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setAddDialogOpen(true)}
							className="mt-4"
						>
							Discover your first technique
						</Button>
					</div>
				) : (
					<div className="space-y-2">
						{techniques.map((entry) => {
							const compendium = entry.technique;
							const name = compendium?.name ?? "Unknown Technique";
							const displayName = formatRegentVernacular(name);
							const description = compendium?.description ?? null;
							const techniqueType = compendium?.technique_type ?? null;
							const levelReq = compendium?.level_requirement ?? null;

							return (
								<div
									key={entry.id}
									className={cn(
										"p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors",
									)}
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex-1 min-w-0">
											<div className="flex flex-wrap items-center gap-2 mb-1">
												<button
													type="button"
													className="text-left font-heading font-semibold hover:text-primary transition-colors"
													onClick={() =>
														onSelectDetail?.({
															title: displayName,
															description: description || "",
															payload: compendium ?? entry,
														})
													}
												>
													{displayName}
												</button>
												{techniqueType && (
													<Badge
														variant="outline"
														className="text-xs capitalize"
													>
														{techniqueType}
													</Badge>
												)}
												{levelReq != null && (
													<Badge variant="secondary" className="text-xs">
														Level {levelReq}
													</Badge>
												)}
											</div>
											{description && (
												<div className="text-xs text-muted-foreground line-clamp-3">
													<AutoLinkText text={description} />
												</div>
											)}
										</div>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8"
											onClick={() => handleRemove(entry.id, name)}
											aria-label={`Remove ${displayName}`}
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			<AddTechniqueDialog
				open={addDialogOpen}
				onOpenChange={setAddDialogOpen}
				characterId={characterId}
			/>
		</>
	);

	if (hideHeader) return body;
	return <AscendantWindow title="TECHNIQUES">{body}</AscendantWindow>;
}
