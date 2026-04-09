import {
	BookOpen,
	Clock,
	Layers,
	MapPin,
	RefreshCw,
	Sparkles,
	Target,
	Zap,
} from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumRune } from "@/types/compendium";

interface RuneDetailProps {
	data: CompendiumRune;
}

export const RuneDetail = ({ data }: RuneDetailProps) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const runeIsMartial =
		data.rune_type === "martial" ||
		data.rune_type === "offensive" ||
		data.rune_type === "defensive";
	const _runeIsCaster =
		data.rune_type === "caster" || data.rune_category === "Spell";

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
			<AscendantWindow className="relative overflow-hidden border-primary/20 bg-background/40 backdrop-blur-xl">
				<div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

				<div className="relative flex flex-col md:flex-row gap-8">
					<div className="flex-1 space-y-6">
						<div className="space-y-2">
							<div className="flex flex-wrap items-center gap-2">
								<Badge
									variant="outline"
									className="bg-primary/5 border-primary/20 text-primary uppercase tracking-widest text-[10px] font-bold px-3 py-1"
								>
									{data.rarity} Rune Token
								</Badge>
								<Badge
									variant="outline"
									className="bg-muted/20 border-muted-foreground/10 text-muted-foreground text-[10px] uppercase font-medium"
								>
									{data.rune_type}
								</Badge>
								<Badge
									variant="outline"
									className="bg-muted/20 border-muted-foreground/10 text-muted-foreground text-[10px] uppercase font-medium"
								>
									{data.rune_category}
								</Badge>
							</div>
							<h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-primary/50 uppercase leading-none">
								{displayName}
							</h1>
						</div>

						<p className="text-xl text-muted-foreground leading-relaxed font-light italic border-l-4 border-primary/20 pl-6 py-2">
							<AutoLinkText text={data.description || ""} />
						</p>

						<div className="flex flex-wrap gap-4 mt-6">
							<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
								<RefreshCw className="w-4 h-4 text-primary" />
								<span className="text-xs font-bold uppercase text-primary/80">
									Recharge: {data.recharge || "N/A"}
								</span>
							</div>
							<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
								<Zap className="w-4 h-4 text-primary" />
								<span className="text-xs font-bold uppercase text-primary/80">
									Uses: {data.uses_per_rest || "At-Will"}
								</span>
							</div>
							{data.activation_action && (
								<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
									<Target className="w-4 h-4 text-primary" />
									<span className="text-xs font-bold uppercase text-primary/80">
										Action: {data.activation_action}
									</span>
								</div>
							)}
							{data.duration && (
								<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
									<Clock className="w-4 h-4 text-primary" />
									<span className="text-xs font-bold uppercase text-primary/80">
										Duration: {data.duration} {data.concentration && "(C)"}
									</span>
								</div>
							)}
							{data.range && (
								<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
									<MapPin className="w-4 h-4 text-primary" />
									<span className="text-xs font-bold uppercase text-primary/80">
										Range: {data.range}
									</span>
								</div>
							)}
							{data.rune_level !== undefined && (
								<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
									<Layers className="w-4 h-4 text-primary" />
									<span className="text-xs font-bold uppercase text-primary/80">
										Level: {data.rune_level}
									</span>
								</div>
							)}
						</div>
					</div>

					{data.image && (
						<div className="w-full md:w-1/4 flex-shrink-0">
							<div className="aspect-square rounded-2xl border border-primary/20 bg-background/50 overflow-hidden relative group shadow-2xl">
								<img
									src={data.image}
									alt={displayName}
									className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent pointer-events-none" />
							</div>
						</div>
					)}
				</div>
			</AscendantWindow>

			<AscendantWindow
				title="LATTICE SYNC: CONDITIONAL ADAPTATION"
				className="bg-background/20 border-primary/10"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 relative group overflow-hidden">
						<div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
						<div className="flex items-center gap-3 mb-4">
							<Sparkles className="w-5 h-5 text-primary" />
							<h3 className="font-display font-bold text-lg text-primary uppercase">
								Natural Use
							</h3>
						</div>
						<p className="text-sm text-muted-foreground mb-4 leading-relaxed">
							When absorbed by a character of the{" "}
							<span className="text-primary font-bold">
								{runeIsMartial ? "Martial" : "Caster"}
							</span>{" "}
							archetype, the lattice sync is perfect.
						</p>
						<div className="space-y-2 text-xs font-medium text-foreground py-3 border-y border-primary/10">
							<div className="flex justify-between">
								<span>Usage Mode:</span>
								<span className="text-primary capitalize">
									{data.uses_per_rest || "Standard"}
								</span>
							</div>
							<div className="flex justify-between">
								<span>Resource cost:</span>
								<span className="text-primary">Standard</span>
							</div>
						</div>
						<p className="text-xs text-muted-foreground/60 mt-4 italic">
							No penalties or adaptation required.
						</p>
					</div>

					<div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 relative group overflow-hidden">
						<div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
						<div className="flex items-center gap-3 mb-4">
							<Layers className="w-5 h-5 text-orange-400" />
							<h3 className="font-display font-bold text-lg text-orange-400 uppercase">
								Adapted Use
							</h3>
						</div>
						<p className="text-sm text-muted-foreground mb-4 leading-relaxed">
							When absorbed by a cross-archetype character, the lattice is
							converted into a{" "}
							<span className="text-orange-400 font-bold">Per Rest</span> model.
						</p>
						<div className="space-y-2 text-xs font-medium text-foreground py-3 border-y border-orange-500/10">
							<div className="flex justify-between">
								<span>Adapted Mode:</span>
								<span className="text-orange-400">Uses per Long Rest</span>
							</div>
							<div className="flex justify-between">
								<span>Limit:</span>
								<span className="text-orange-400">
									Proficiency Bonus + Rarity
								</span>
							</div>
						</div>
						<p className="text-xs text-muted-foreground/60 mt-4 italic">
							Ability is scaled and filtered through character energy.
						</p>
					</div>
				</div>
			</AscendantWindow>

			<AscendantWindow
				title="FULL MECHANICAL DESCRIPTION"
				className="bg-background/40"
			>
				<div className="prose prose-invert max-w-none">
					<div className="p-8 rounded-2xl border border-primary/10 bg-muted/10 relative">
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-xl bg-primary/20 text-primary mt-1">
								<BookOpen className="w-6 h-6" />
							</div>
							<div>
								<h4 className="text-primary font-display font-bold text-xl mb-4">
									Rule Mechanics
								</h4>
								<p className="text-muted-foreground text-lg leading-relaxed">
									<AutoLinkText
										text={data.effect_description || data.description || ""}
									/>
								</p>
								{data.higher_levels && (
									<div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
										<h5 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
											At Higher Levels
										</h5>
										<p className="text-muted-foreground text-sm leading-relaxed">
											<AutoLinkText text={data.higher_levels} />
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</AscendantWindow>
		</div>
	);
};
