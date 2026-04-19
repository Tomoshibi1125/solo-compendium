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
				"@/data/compendium/providers"
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
					case "powers": {
						const powers = await staticDataProvider.getPowers("");
						const p = powers.find((item) => item.id === id);
						if (p) {
							data = {
								id: p.id,
								name: p.name,
								description: p.description,
								level: p.power_level,
								source_book: p.source,
							};
						}
						break;
					}
					case "runes": {
						const runes = await staticDataProvider.getRunes("");
						const r = runes.find((item) => item.id === id);
						if (r) {
							data = {
								id: r.id,
								name: r.name,
								description: r.description,
								rarity: r.rarity,
								rune_level: r.rune_level,
							};
						}
						break;
					}
					case "sigils": {
						const sigils = await staticDataProvider.getSigils("");
						const s = sigils.find((item) => item.id === id);
						if (s) {
							data = {
								id: s.id,
								name: s.name,
								description: s.description,
								rarity: s.rarity,
							};
						}
						break;
					}
					case "anomalies": {
						const anomalies = await staticDataProvider.getAnomalies("");
						const m = anomalies.find((item) => item.id === id);
						if (m) {
							data = {
								id: m.id,
								name: m.name,
								description: m.description,
								level: m.level,
							};
						}
						break;
					}
					case "items":
					case "equipment": {
						const items = await staticDataProvider.getItems("");
						const i = items.find((item) => item.id === id);
						if (i) {
							data = {
								id: i.id,
								name: i.name,
								description: i.description,
								rarity: i.rarity,
							};
						}
						break;
					}
					case "spells": {
						const spells = await staticDataProvider.getSpells("");
						const s = spells.find((item) => item.id === id);
						if (s) {
							data = {
								id: s.id,
								name: s.name,
								description: s.description,
								level: s.level,
							};
						}
						break;
					}
					case "techniques": {
						const techniques = await staticDataProvider.getTechniques("");
						const t = techniques.find((item) => item.id === id);
						if (t) {
							data = {
								id: t.id,
								name: t.name,
								description: t.description,
								level: t.level,
							};
						}
						break;
					}
					case "relics": {
						const relics = await staticDataProvider.getRelics("");
						const r = relics.find((item) => item.id === id);
						if (r) {
							data = {
								id: r.id,
								name: r.name,
								description: r.description,
								rarity: r.rarity,
								image_url: r.image_url,
							};
						}
						break;
					}
					case "artifacts": {
						const artifacts = await staticDataProvider.getArtifacts("");
						const a = artifacts.find((item) => item.id === id);
						if (a) {
							data = {
								id: a.id,
								name: a.name,
								description: a.description,
								rarity: a.rarity,
							};
						}
						break;
					}
					case "jobs": {
						const jobs = await staticDataProvider.getJobs("");
						const j = jobs.find((item) => item.id === id);
						if (j) {
							data = {
								id: j.id,
								name: j.name,
								description: j.description,
								source_book: j.source_book,
							};
						}
						break;
					}
					case "paths": {
						const paths = await staticDataProvider.getPaths("");
						const p = paths.find((item) => item.id === id);
						if (p) {
							data = {
								id: p.id,
								name: p.name,
								description: p.description,
								source_book: p.source_book,
							};
						}
						break;
					}
					case "backgrounds": {
						const backgrounds = await staticDataProvider.getBackgrounds("");
						const b = backgrounds.find((item) => item.id === id);
						if (b) {
							data = {
								id: b.id,
								name: b.name,
								description: b.description,
								source_book: b.source_book,
							};
						}
						break;
					}
					case "conditions": {
						const conditions = await staticDataProvider.getConditions("");
						const c = conditions.find((item) => item.id === id);
						if (c) {
							data = {
								id: c.id,
								name: c.name,
								description: c.description,
							};
						}
						break;
					}
					case "shadow-soldiers": {
						const soldiers = await staticDataProvider.getShadowSoldiers("");
						const s = soldiers.find((item) => item.id === id);
						if (s) {
							data = {
								id: s.id,
								name: s.name,
								description: s.description,
								rarity: s.rarity,
							};
						}
						break;
					}
					case "tattoos": {
						const tattoos = await staticDataProvider.getTattoos("");
						const t = tattoos.find((item) => item.id === id);
						if (t) {
							data = {
								id: t.id,
								name: t.name,
								description: t.description,
								rarity: t.rarity,
							};
						}
						break;
					}
					case "pantheon":
					case "deities": {
						const deities = await staticDataProvider.getPantheon("");
						const d = deities.find((item) => item.id === id);
						if (d) {
							data = {
								id: d.id,
								name: d.name,
								description: d.description,
							};
						}
						break;
					}
					case "feats": {
						const feats = await staticDataProvider.getFeats("");
						const f = feats.find((item) => item.id === id);
						if (f) {
							data = {
								id: f.id,
								name: f.name,
								description: f.description,
								level: f.level,
							};
						}
						break;
					}
					case "skills": {
						const skills = await staticDataProvider.getSkills("");
						const s = skills.find((item) => item.id === id);
						if (s) {
							data = {
								id: s.id,
								name: s.name,
								description: s.description,
							};
						}
						break;
					}
					case "regents": {
						const regents = await staticDataProvider.getRegents("");
						const r = regents.find((item) => item.id === id);
						if (r) {
							data = {
								id: r.id,
								name: r.name,
								description: r.description,
								image_url: r.image_url,
							};
						}
						break;
					}
					case "locations": {
						const locations = await staticDataProvider.getLocations("");
						const l = locations.find((item) => item.id === id);
						if (l) {
							data = {
								id: l.id,
								name: l.name,
								description: l.description,
							};
						}
						break;
					}
					default:
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
									<AutoLinkText text={String(entry.description || "")} />
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
