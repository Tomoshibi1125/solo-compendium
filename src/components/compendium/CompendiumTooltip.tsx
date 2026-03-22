import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";
import { CompendiumImage } from "./CompendiumImage";

interface CompendiumTooltipProps {
	children: ReactNode;
	type: string;
	id: string;
	className?: string;
}

export function CompendiumTooltip({
	children,
	type,
	id,
	className,
}: CompendiumTooltipProps) {
	const { data: entry, isLoading } = useQuery({
		queryKey: ["compendium-preview", type, id],
		queryFn: async () => {
			const { staticDataProvider } = await import(
				"@/data/compendium/staticDataProvider"
			);
			// Many categories are available, but we'll try to find the specific one
			// For simplicity in preview, we can use the universal transformation or specific getters
			interface TooltipPreviewData {
				id: string;
				name: string;
				image?: string | null;
				image_url?: string | null;
				rarity?: string | null;
				level?: number | string | null;
				rune_level?: number | string | null;
				description?: string | null;
				source_book?: string | null;
			}
			let data: TooltipPreviewData | null = null;
			try {
				switch (type) {
					case "powers":
						data =
							((await staticDataProvider.getPowers("")).find(
								(p) => p.id === id,
							) as unknown as TooltipPreviewData) || null;
						break;
					case "runes":
						data =
							((await staticDataProvider.getRunes("")).find(
								(p) => p.id === id,
							) as unknown as TooltipPreviewData) || null;
						break;
					case "sigils":
						data =
							((await staticDataProvider.getSigils("")).find(
								(p) => p.id === id,
							) as unknown as TooltipPreviewData) || null;
						break;
					case "monsters":
						data =
							((await staticDataProvider.getMonsters("")).find(
								(p) => p.id === id,
							) as unknown as TooltipPreviewData) || null;
						break;
					case "items":
					case "equipment":
						data =
							((await staticDataProvider.getItems("")).find(
								(p) => p.id === id,
							) as unknown as TooltipPreviewData) || null;
						break;
					case "spells":
						data =
							((await staticDataProvider.getSpells("")).find(
								(p) => p.id === id,
							) as unknown as TooltipPreviewData) || null;
						break;
					case "techniques":
						data =
							((await staticDataProvider.getTechniques("")).find(
								(p) => p.id === id,
							) as unknown as TooltipPreviewData) || null;
						break;
					default:
						// Generic fallback if needed
						break;
				}
			} catch (e) {
				console.error("Error fetching tooltip preview:", e);
			}
			return data;
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	return (
		<TooltipProvider>
			<Tooltip delayDuration={300}>
				<TooltipTrigger asChild>
					<span
						className={cn(
							"cursor-help underline decoration-primary/30 decoration-dotted underline-offset-4 hover:decoration-primary transition-colors",
							className,
						)}
					>
						{children}
					</span>
				</TooltipTrigger>
				<TooltipContent
					side="top"
					className="p-0 border-none bg-transparent shadow-2xl overflow-hidden max-w-xs sm:max-w-sm animate-in zoom-in-95 duration-200"
				>
					<div className="glass-card border-primary/20 bg-background/95 backdrop-blur-md p-4 space-y-3">
						{isLoading ? (
							<div className="flex items-center justify-center py-4">
								<Loader2 className="w-5 h-5 animate-spin text-primary" />
							</div>
						) : entry ? (
							<>
								<div className="flex gap-3">
									<div className="w-16 h-16 flex-shrink-0">
										<CompendiumImage
											src={entry.image_url || entry.image}
											alt={entry.name}
											size="thumbnail"
											className="rounded border border-primary/10 overflow-hidden"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<h4 className="font-heading font-bold text-primary truncate">
											{formatRegentVernacular(entry.name)}
										</h4>
										<div className="flex flex-wrap gap-1 mt-1">
											<Badge
												variant="outline"
												className="text-[10px] h-4 uppercase tracking-tighter"
											>
												{type}
											</Badge>
											{entry.rarity && (
												<Badge
													variant="secondary"
													className="text-[10px] h-4 uppercase tracking-tighter"
												>
													{entry.rarity.replace("_", " ")}
												</Badge>
											)}
											{(entry.level || entry.rune_level) !== undefined && (
												<Badge className="text-[10px] h-4 bg-primary/20 text-primary hover:bg-primary/30 border-none">
													Lvl {entry.level || entry.rune_level}
												</Badge>
											)}
										</div>
									</div>
								</div>
								<p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed border-t border-primary/10 pt-2 italic">
									<AutoLinkText
										text={String(entry.description || "")}
									/>
								</p>
								<div className="flex items-center justify-between text-[10px] text-primary/60 font-mono pt-1">
									<span>Click for full data stream</span>
									{entry.source_book && (
										<span className="opacity-50">
											[{entry.source_book as string}]
										</span>
									)}
								</div>
							</>
						) : (
							<p className="p-2 text-xs text-muted-foreground">
								Preview unavailable
							</p>
						)}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
