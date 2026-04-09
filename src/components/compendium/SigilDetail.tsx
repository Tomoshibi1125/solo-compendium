import { BadgeCheck, Info, Shield, Zap } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumSigil } from "@/types/compendium";

interface SigilDetailProps {
	data: CompendiumSigil;
}

export const SigilDetail = ({ data }: SigilDetailProps) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
			<AscendantWindow className="relative overflow-hidden border-primary/20 bg-background/40 backdrop-blur-xl">
				<div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

				<div className="relative flex flex-col md:flex-row gap-8">
					{data.image && (
						<div className="w-full md:w-1/3 flex-shrink-0">
							<div className="aspect-square rounded-2xl border border-primary/20 bg-background/50 overflow-hidden relative group shadow-2xl shadow-primary/5">
								<img
									src={data.image}
									alt={displayName}
									className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60" />
							</div>
						</div>
					)}

					<div className="flex-1 space-y-6">
						<div className="space-y-2">
							<div className="flex flex-wrap items-center gap-2">
								<Badge
									variant="outline"
									className="bg-primary/5 border-primary/20 text-primary uppercase tracking-widest text-[10px] font-bold px-3 py-1"
								>
									{data.rarity} Sigil
								</Badge>
								{data.tags?.map((tag) => (
									<Badge
										key={tag}
										variant="secondary"
										className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-medium"
									>
										{tag}
									</Badge>
								))}
							</div>
							<h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-primary/50 uppercase leading-none">
								{displayName}
							</h1>
						</div>

						<p className="text-xl text-muted-foreground leading-relaxed font-light italic border-l-4 border-primary/20 pl-6 py-2">
							<AutoLinkText text={data.description || ""} />
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
							<div className="p-6 rounded-2xl border border-primary/10 bg-primary/5 backdrop-blur-md relative overflow-hidden group">
								<div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
									<Zap className="w-12 h-12 text-primary" />
								</div>
								<h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
									<Zap className="w-3 h-3" />
									Inscribed Attributes
								</h3>
								<div className="space-y-3">
									{Object.entries(data.passive_bonuses || {}).map(
										([key, value]) => (
											<div
												key={key}
												className="flex items-center justify-between border-b border-primary/5 pb-2 last:border-0 last:pb-0"
											>
												<span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
													{key.replace("_", " ")}
												</span>
												<span className="text-sm font-mono font-black text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.4)]">
													{typeof value === "number" && value >= 0 ? "+" : ""}
													{value}
												</span>
											</div>
										),
									)}
								</div>
							</div>

							<div className="p-6 rounded-2xl border border-blue-500/10 bg-blue-500/5 backdrop-blur-md relative overflow-hidden group">
								<div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
									<Shield className="w-12 h-12 text-blue-400" />
								</div>
								<h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
									<Shield className="w-3 h-3" />
									Sync Compatibility
								</h3>
								<div className="flex flex-wrap gap-2">
									{data.can_inscribe_on?.map((gear) => (
										<Badge
											key={gear}
											variant="outline"
											className="bg-blue-500/10 border-blue-500/20 text-blue-300 capitalize text-[10px] px-3"
										>
											{gear}
										</Badge>
									))}
								</div>
								<p className="text-[10px] text-muted-foreground/60 mt-4 leading-tight italic">
									"This sigil binds to the equipment's mana-lattice without
									resistance."
								</p>
							</div>
						</div>
					</div>
				</div>
			</AscendantWindow>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<AscendantWindow
						title="MECHANICAL OVERVIEW"
						className="bg-background/20"
					>
						<div className="prose prose-invert max-w-none">
							<div className="p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative group">
								<BadgeCheck className="absolute top-4 right-4 w-6 h-6 text-primary opacity-20" />
								<h4 className="text-primary font-display font-bold text-lg mb-4 flex items-center gap-2">
									Core Logic
								</h4>
								<p className="text-muted-foreground text-lg leading-relaxed mb-0">
									<AutoLinkText
										text={
											data.effect_description ||
											"No specific mechanical rules defined."
										}
									/>
								</p>
							</div>
						</div>
					</AscendantWindow>
				</div>

				<div>
					<AscendantWindow title="SOURCE" className="bg-background/20 h-full">
						<div className="space-y-6">
							<div className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 border border-muted-foreground/10">
								<Info className="w-5 h-5 text-muted-foreground mt-1" />
								<div>
									<h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
										Publication
									</h4>
									<p className="text-sm font-medium">
										{data.source_book || "Unknown Source"}
									</p>
								</div>
							</div>

							{data.lore && (
								<div className="space-y-2">
									<h4 className="text-xs font-bold uppercase tracking-wider text-primary/60">
										Fragment of Lore
									</h4>
									<p className="text-xs text-muted-foreground leading-relaxed italic">
										<AutoLinkText
											text={
												typeof data.lore === "string"
													? data.lore
													: data.lore?.history || ""
											}
										/>
									</p>
								</div>
							)}
						</div>
					</AscendantWindow>
				</div>
			</div>
		</div>
	);
};
