import { FileText, Loader2, Lock, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCampaignHandouts } from "@/hooks/useCampaignHandouts";
import { useCampaignSandboxInjector } from "@/hooks/useCampaignSandboxInjector";
import { useHasWardenAccess } from "@/hooks/useCampaigns";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
	session: "Session Log",
	note: "Warden Note",
	lore: "Lore",
	handout: "Handout",
};

export function CampaignHandouts({ campaignId }: { campaignId: string }) {
	const { data: hasWardenAccess } = useHasWardenAccess(campaignId);
	const { injectSandbox, isInjecting } = useCampaignSandboxInjector(campaignId);
	const { entries, isLoading } = useCampaignHandouts(campaignId);

	const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

	const visibleEntries = useMemo(
		() => entries.filter((entry) => hasWardenAccess || entry.visibleToPlayers),
		[entries, hasWardenAccess],
	);

	const selectedEntry = useMemo(
		() =>
			selectedEntryId
				? (visibleEntries.find((entry) => entry.id === selectedEntryId) ?? null)
				: null,
		[selectedEntryId, visibleEntries],
	);

	// Auto-select first entry when data loads
	useMemo(() => {
		if (!selectedEntryId && visibleEntries.length > 0) {
			setSelectedEntryId(visibleEntries[0].id);
		}
	}, [visibleEntries, selectedEntryId]);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div className="lg:col-span-1">
				<AscendantWindow title="HANDOUTS & LORE">
					<div className="space-y-2 max-h-[520px] overflow-y-auto">
						{isLoading ? (
							<div className="flex items-center justify-center py-8 text-primary animate-pulse">
								<Loader2 className="w-6 h-6 animate-spin mr-2" />
								<span className="text-xs">Accessing archives...</span>
							</div>
						) : visibleEntries.length === 0 ? (
							<div className="text-center py-8 space-y-4">
								<p className="text-xs text-muted-foreground italic">
									No handouts shared yet.
								</p>
								{hasWardenAccess && (
									<Button
										variant="outline"
										size="sm"
										className="w-full border-primary/40 hover:border-primary hover:bg-primary/10 gap-2 text-[10px]"
										onClick={() => injectSandbox()}
										disabled={isInjecting}
									>
										{isInjecting ? (
											<Loader2 className="w-3 h-3 animate-spin text-primary" />
										) : (
											<Sparkles className="w-3 h-3 text-primary" />
										)}
										{isInjecting ? "Importing..." : "Import Sandbox Handouts"}
									</Button>
								)}
							</div>
						) : (
							visibleEntries.map((entry) => (
								<button
									type="button"
									key={entry.id}
									onClick={() => setSelectedEntryId(entry.id)}
									className={cn(
										"w-full p-3 rounded border text-left transition-all",
										selectedEntryId === entry.id
											? "bg-primary/20 border-primary"
											: "border-border hover:bg-muted/50",
									)}
								>
									<div className="flex items-start justify-between mb-1">
										<div className="flex-1 min-w-0">
											<div className="font-heading font-semibold text-sm truncate flex items-center gap-1.5">
												{entry.title}
												{!entry.visibleToPlayers && hasWardenAccess && (
													<Lock className="w-3 h-3 text-amber-400 opacity-60 shrink-0" />
												)}
											</div>
											<div className="flex items-center gap-2 mt-1">
												<Badge variant="outline" className="text-xs">
													{CATEGORY_LABELS[entry.category] || entry.category}
												</Badge>
												{!entry.visibleToPlayers && hasWardenAccess && (
													<Badge
														variant="outline"
														className="text-[10px] text-amber-400 border-amber-500/30"
													>
														Warden Only
													</Badge>
												)}
											</div>
										</div>
									</div>
									<div className="text-xs text-muted-foreground">
										{new Date(entry.updatedAt).toLocaleDateString()}
									</div>
								</button>
							))
						)}
					</div>
				</AscendantWindow>
			</div>

			<div className="lg:col-span-2">
				{selectedEntry ? (
					<AscendantWindow title={selectedEntry.title}>
						<div className="space-y-4">
							<div className="flex items-center gap-2 pb-4 border-b border-border">
								<Badge variant="outline">
									{CATEGORY_LABELS[selectedEntry.category] ||
										selectedEntry.category}
								</Badge>
								{selectedEntry.visibleToPlayers ? (
									<Badge
										variant="outline"
										className="text-green-400 border-green-500/30"
									>
										Shared with Players
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="text-amber-400 border-amber-500/30"
									>
										<Lock className="w-3 h-3 mr-1" />
										Warden Only
									</Badge>
								)}
							</div>

							<ScrollArea className="max-h-[60vh]">
								<div className="prose prose-invert prose-emerald max-w-none prose-headings:font-display prose-headings:text-primary prose-a:text-accent prose-a:no-underline prose-blockquote:border-primary/30 prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded">
									<ReactMarkdown>
										{selectedEntry.content || "*No content yet.*"}
									</ReactMarkdown>
								</div>
							</ScrollArea>

							<div className="pt-4 border-t border-border text-xs text-muted-foreground">
								Published: {new Date(selectedEntry.createdAt).toLocaleString()}
								{selectedEntry.updatedAt !== selectedEntry.createdAt && (
									<>
										{" "}
										• Updated:{" "}
										{new Date(selectedEntry.updatedAt).toLocaleString()}
									</>
								)}
							</div>
						</div>
					</AscendantWindow>
				) : (
					<AscendantWindow title="SELECT A HANDOUT">
						<div className="text-center py-12">
							<FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
							<p className="text-muted-foreground font-heading">
								Select a handout to view it.
							</p>
						</div>
					</AscendantWindow>
				)}
			</div>
		</div>
	);
}
