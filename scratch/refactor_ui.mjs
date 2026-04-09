import fs from 'fs';

const SIGIL_DETAIL_PATH = 'c:/Users/jjcal/Documents/solo-compendium/src/components/compendium/SigilDetail.tsx';
const RUNE_DETAIL_PATH = 'c:/Users/jjcal/Documents/solo-compendium/src/components/compendium/RuneDetail.tsx';

const sigilDetailContent = `import { BadgeCheck, Info, Shield, Zap } from "lucide-react";
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
								<Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary uppercase tracking-widest text-[10px] font-bold px-3 py-1">
									{data.rarity} Sigil
								</Badge>
								{data.tags?.map((tag) => (
									<Badge key={tag} variant="secondary" className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-medium">
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
									{Object.entries(data.passive_bonuses || {}).map(([key, value]) => (
										<div key={key} className="flex items-center justify-between border-b border-primary/5 pb-2 last:border-0 last:pb-0">
											<span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
												{key.replace("_", " ")}
											</span>
											<span className="text-sm font-mono font-black text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.4)]">
												{typeof value === "number" && value >= 0 ? "+" : ""}{value}
											</span>
										</div>
									))}
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
										<Badge key={gear} variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-300 capitalize text-[10px] px-3">
											{gear}
										</Badge>
									))}
								</div>
								<p className="text-[10px] text-muted-foreground/60 mt-4 leading-tight italic">
									"This sigil binds to the equipment's mana-lattice without resistance."
								</p>
							</div>
						</div>
					</div>
				</div>
			</AscendantWindow>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<AscendantWindow title="MECHANICAL OVERVIEW" className="bg-background/20">
						<div className="prose prose-invert max-w-none">
							<div className="p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative group">
								<BadgeCheck className="absolute top-4 right-4 w-6 h-6 text-primary opacity-20" />
								<h4 className="text-primary font-display font-bold text-lg mb-4 flex items-center gap-2">
									Core Logic
								</h4>
								<p className="text-muted-foreground text-lg leading-relaxed mb-0">
									<AutoLinkText text={data.effect_description || "No specific mechanical rules defined."} />
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
									<h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Publication</h4>
									<p className="text-sm font-medium">{data.source_book || "Unknown Source"}</p>
								</div>
							</div>
							
							{data.lore && (
								<div className="space-y-2">
									<h4 className="text-xs font-bold uppercase tracking-wider text-primary/60">Fragment of Lore</h4>
									<p className="text-xs text-muted-foreground leading-relaxed italic">
										<AutoLinkText text={typeof data.lore === "string" ? data.lore : data.lore?.history || ""} />
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
`;

const runeDetailContent = `import { AlertCircle, BookOpen, Layers, RefreshCw, Sparkles, Zap } from "lucide-react";
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
	const runeIsMartial = data.rune_type === "martial" || data.rune_type === "offensive" || data.rune_type === "defensive";
	const runeIsCaster = data.rune_type === "caster" || data.rune_category === "Spell";

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
			<AscendantWindow className="relative overflow-hidden border-primary/20 bg-background/40 backdrop-blur-xl">
				<div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

				<div className="relative flex flex-col md:flex-row gap-8">
					<div className="flex-1 space-y-6">
						<div className="space-y-2">
							<div className="flex flex-wrap items-center gap-2">
								<Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary uppercase tracking-widest text-[10px] font-bold px-3 py-1">
									{data.rarity} Rune Token
								</Badge>
								<Badge variant="outline" className="bg-muted/20 border-muted-foreground/10 text-muted-foreground text-[10px] uppercase font-medium">
									{data.rune_type}
								</Badge>
								<Badge variant="outline" className="bg-muted/20 border-muted-foreground/10 text-muted-foreground text-[10px] uppercase font-medium">
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
								<span className="text-xs font-bold uppercase text-primary/80">Recharge: {data.recharge || "N/A"}</span>
							</div>
							<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
								<Zap className="w-4 h-4 text-primary" />
								<span className="text-xs font-bold uppercase text-primary/80">Uses: {data.uses_per_rest || "At-Will"}</span>
							</div>
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

			<AscendantWindow title="LATTICE SYNC: CONDITIONAL ADAPTATION" className="bg-background/20 border-primary/10">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 relative group overflow-hidden">
						<div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
						<div className="flex items-center gap-3 mb-4">
							<Sparkles className="w-5 h-5 text-primary" />
							<h3 className="font-display font-bold text-lg text-primary uppercase">Natural Use</h3>
						</div>
						<p className="text-sm text-muted-foreground mb-4 leading-relaxed">
							When absorbed by a character of the <span className="text-primary font-bold">{runeIsMartial ? 'Martial' : 'Caster'}</span> archetype, the lattice sync is perfect.
						</p>
						<div className="space-y-2 text-xs font-medium text-foreground py-3 border-y border-primary/10">
							<div className="flex justify-between">
								<span>Usage Mode:</span>
								<span className="text-primary capitalize">{data.uses_per_rest || 'Standard'}</span>
							</div>
							<div className="flex justify-between">
								<span>Resource cost:</span>
								<span className="text-primary">Standard</span>
							</div>
						</div>
						<p className="text-xs text-muted-foreground/60 mt-4 italic">No penalties or adaptation required.</p>
					</div>

					<div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 relative group overflow-hidden">
						<div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
						<div className="flex items-center gap-3 mb-4">
							<Layers className="w-5 h-5 text-orange-400" />
							<h3 className="font-display font-bold text-lg text-orange-400 uppercase">Adapted Use</h3>
						</div>
						<p className="text-sm text-muted-foreground mb-4 leading-relaxed">
							When absorbed by a cross-archetype character, the lattice is converted into a <span className="text-orange-400 font-bold">Per Rest</span> model.
						</p>
						<div className="space-y-2 text-xs font-medium text-foreground py-3 border-y border-orange-500/10">
							<div className="flex justify-between">
								<span>Adapted Mode:</span>
								<span className="text-orange-400">Uses per Long Rest</span>
							</div>
							<div className="flex justify-between">
								<span>Limit:</span>
								<span className="text-orange-400">Proficiency Bonus + Rarity</span>
							</div>
						</div>
						<p className="text-xs text-muted-foreground/60 mt-4 italic">Ability is scaled and filtered through character energy.</p>
					</div>
				</div>
			</AscendantWindow>

			<AscendantWindow title="FULL MECHANICAL DESCRIPTION" className="bg-background/40">
				<div className="prose prose-invert max-w-none">
					<div className="p-8 rounded-2xl border border-primary/10 bg-muted/10 relative">
						<div className="flex items-start gap-4">
							<div className="p-3 rounded-xl bg-primary/20 text-primary mt-1">
								<BookOpen className="w-6 h-6" />
							</div>
							<div>
								<h4 className="text-primary font-display font-bold text-xl mb-4">Rule Mechanics</h4>
								<p className="text-muted-foreground text-lg leading-relaxed">
									<AutoLinkText text={data.effect_description || data.description || ""} />
								</p>
							</div>
						</div>
					</div>
				</div>
			</AscendantWindow>
		</div>
	);
};
`;

function refactorUI() {
    console.log('Refactoring UI Components via script...');
    fs.writeFileSync(SIGIL_DETAIL_PATH, sigilDetailContent, 'utf8');
    fs.writeFileSync(RUNE_DETAIL_PATH, runeDetailContent, 'utf8');
    console.log('UI Components refactored successfully.');
}

try {
    refactorUI();
} catch (error) {
    console.error('Error refactoring UI:', error);
}
