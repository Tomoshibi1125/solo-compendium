import {
	BookOpen,
	Download,
	FileText,
	Heart,
	Plus,
	Share2,
} from "lucide-react";
import { useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCharacters } from "@/hooks/useCharacters";
import { usePreferredCampaignSelection } from "@/hooks/usePreferredCampaignSelection";
import type { CompendiumEntry } from "@/hooks/useStartupData";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";
import { NotesManager } from "./NotesManager";
import { SendToInventoryDialog } from "./SendToInventoryDialog";

interface QuickReferenceProps {
	entry: CompendiumEntry;
	isFavorite?: boolean;
	onToggleFavorite?: () => void;
	onShare?: () => void;
	onExport?: () => void;
	className?: string;
}

export function QuickReference({
	entry,
	isFavorite,
	onToggleFavorite,
	onShare,
	onExport,
	className,
}: QuickReferenceProps) {
	const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
	const { data: characters = [] } = useCharacters();
	const { campaignId } = usePreferredCampaignSelection("compendium");

	const displayName = formatRegentVernacular(entry.name);
	return (
		<div className={cn("space-y-4", className)}>
			{/* Actions */}
			<AscendantWindow title="ACTIONS" compact>
				<div className="flex flex-col gap-2">
					<Button
						variant="default"
						size="sm"
						onClick={() => setIsSendDialogOpen(true)}
						className="w-full justify-start bg-solar-glow text-black hover:bg-solar-glow/80"
						title="Add to a character sheet or party stash"
					>
						<Plus className="w-4 h-4 mr-2" />
						Send to Destination
					</Button>

					{onToggleFavorite && (
						<Button
							variant={isFavorite ? "default" : "outline"}
							size="sm"
							onClick={onToggleFavorite}
							className="w-full justify-start"
							title={isFavorite ? "Remove from favorites" : "Add to favorites"}
						>
							<Heart
								className={cn("w-4 h-4 mr-2", isFavorite && "fill-current")}
							/>
							{isFavorite ? "Remove from Favorites" : "Add to Favorites"}
						</Button>
					)}
					{onShare && (
						<Button
							variant="outline"
							size="sm"
							onClick={onShare}
							className="w-full justify-start"
						>
							<Share2 className="w-4 h-4 mr-2" />
							Share
						</Button>
					)}
					{onExport && (
						<Button
							variant="outline"
							size="sm"
							onClick={onExport}
							className="w-full justify-start"
						>
							<Download className="w-4 h-4 mr-2" />
							Export
						</Button>
					)}
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							// Scroll to notes section
							const notesSection = document.querySelector(
								"[data-notes-section]",
							);
							if (notesSection) {
								notesSection.scrollIntoView({ behavior: "smooth" });
							}
						}}
						className="w-full justify-start"
						title="View notes for this entry"
					>
						<FileText className="w-4 h-4 mr-2" />
						View Notes
					</Button>
				</div>
			</AscendantWindow>

			{/* Quick Stats */}
			<AscendantWindow title="QUICK REFERENCE" compact>
				<div className="space-y-3">
					{entry.source_book && (
						<div>
							<span className="text-xs text-muted-foreground uppercase tracking-wide">
								Source
							</span>
							<div className="mt-1">
								<Badge variant="outline" className="text-xs">
									<BookOpen className="w-3 h-3 mr-1" />
									{formatRegentVernacular(entry.source_book)}
								</Badge>
							</div>
						</div>
					)}

					{(entry.rarity || entry.gate_rank) && (
						<div>
							<span className="text-xs text-muted-foreground uppercase tracking-wide">
								{entry.gate_rank ? "Rift Rank" : "Rarity"}
							</span>
							<div className="mt-1">
								<Badge variant="secondary" className="text-xs">
									{entry.gate_rank || entry.rarity}
								</Badge>
							</div>
						</div>
					)}

					{entry.level !== null && entry.level !== undefined && (
						<div>
							<span className="text-xs text-muted-foreground uppercase tracking-wide">
								Level
							</span>
							<div className="mt-1 font-display text-lg">{entry.level}</div>
						</div>
					)}

					{entry.cr && (
						<div>
							<span className="text-xs text-muted-foreground uppercase tracking-wide">
								Challenge Rating
							</span>
							<div className="mt-1 font-display text-lg">{entry.cr}</div>
						</div>
					)}

					{entry.tags && entry.tags.length > 0 && (
						<div>
							<span className="text-xs text-muted-foreground uppercase tracking-wide">
								Tags
							</span>
							<div className="mt-1 flex flex-wrap gap-1">
								{entry.tags.slice(0, 5).map((tag) => (
									<Badge key={tag} variant="outline" className="text-xs">
										{formatRegentVernacular(tag)}
									</Badge>
								))}
							</div>
						</div>
					)}
				</div>
			</AscendantWindow>

			{/* Notes Section */}
			<div data-notes-section>
				<NotesManager
					entryId={entry.name}
					entryType={entry.type}
					entryName={displayName}
				/>
			</div>

			{/* Side Dialog */}
			<SendToInventoryDialog
				isOpen={isSendDialogOpen}
				onClose={() => setIsSendDialogOpen(false)}
				item={entry}
				characters={characters.map((c) => ({ id: c.id, name: c.name }))}
				campaignId={campaignId}
			/>
		</div>
	);
}
