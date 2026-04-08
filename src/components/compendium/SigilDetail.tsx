import { AlertCircle, BookOpen, Shield, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { setPendingResolution } from "@/lib/actionResolution";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumRune } from "@/types/compendium";

interface SigilDetailProps {
	data: CompendiumRune;
}

const SIGIL_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
	martial: Zap,
	caster: BookOpen,
	hybrid: Sparkles,
	utility: BookOpen,
	defensive: Shield,
	offensive: Zap,
};

const SIGIL_TYPE_COLORS: Record<string, string> = {
	martial: "bg-red-500/20 text-red-400 border-red-500/30",
	caster: "bg-blue-500/20 text-blue-400 border-blue-500/30",
	hybrid: "bg-purple-500/20 text-purple-400 border-purple-500/30",
	utility: "bg-green-500/20 text-green-400 border-green-500/30",
	defensive: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
	offensive: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export const SigilDetail = ({ data }: SigilDetailProps) => {
	const navigate = useNavigate();
	const Icon = SIGIL_TYPE_ICONS[data.rune_type] || Sparkles;
	const typeColor = SIGIL_TYPE_COLORS[data.rune_type] || "";
	const displayName = formatRegentVernacular(data.display_name || data.name);

	const handleRoll = () => {
		const id = crypto.randomUUID();
		const name = displayName;
		const dc = data.inscription_difficulty || 10;
		setPendingResolution({
			version: 1,
			id,
			name,
			source: { type: "rune", entryId: data.id },
			kind: "save",
			save: { dc, ability: "Intelligence", roll: "1d20" },
		});
		navigate("/dice");
	};

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<AscendantWindow className="relative overflow-hidden">
				<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

				<div className="relative flex flex-col md:flex-row gap-6">
					{data.image_url && (
						<div className="w-full md:w-1/3 flex-shrink-0">
							<div className="aspect-square rounded-lg border border-primary/20 bg-background/50 overflow-hidden relative group">
								<img
									src={data.image_url}
									alt={displayName}
									className="w-full h-full object-cover mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity duration-300"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
							</div>
						</div>
					)}

					<div className="flex-1 space-y-4">
						<div className="flex flex-wrap items-center gap-2 mb-2">
							<Badge variant="outline" className="uppercase tracking-wider font-semibold">
								{formatRegentVernacular((data.rarity || "common").replace("_", " "))} Gear Sigil
							</Badge>
							<Badge variant="outline" className={typeColor}>
								<Icon className="w-3 h-3 mr-1" />
								{formatRegentVernacular(data.rune_category)}
							</Badge>
							{data.tags?.map((tag) => (
								<Badge key={tag} variant="secondary" className="capitalize">
									{formatRegentVernacular(tag.replace("_", " "))}
								</Badge>
							))}
						</div>

						<h1 className="text-3xl md:text-5xl font-display text-primary tracking-tight font-bold uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
							{displayName}
						</h1>

						<p className="text-lg text-muted-foreground leading-relaxed italic border-l-2 border-primary/30 pl-4 mt-4">
							"<AutoLinkText text={data.description || ""} />"
						</p>
					</div>
				</div>
			</AscendantWindow>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<AscendantWindow title="GEAR EFFECT">
						<div className="prose prose-invert max-w-none space-y-6">
							<div className="p-4 rounded border border-primary/20 bg-primary/5 flex items-start gap-3">
								<AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
								<div>
									<h4 className="text-foreground font-medium mb-1">Sigil Effect</h4>
									<p className="text-muted-foreground text-sm m-0 mb-3">
										<AutoLinkText text={data.effect_description} />
									</p>
									<Button size="sm" variant="outline" onClick={handleRoll}>
										<Zap className="w-4 h-4 mr-2" />
										Roll Sigil Effect
									</Button>
								</div>
							</div>
						</div>
					</AscendantWindow>

					{data.passive_bonuses && Object.keys(data.passive_bonuses).length > 0 && (
						<AscendantWindow title="PASSIVE BONUSES">
							<div className="space-y-2">
								{Object.entries(data.passive_bonuses).map(([key, value]) => (
									<div key={key} className="flex items-center gap-2">
										<Badge variant="secondary" className="text-xs">
											{formatRegentVernacular(key.replace(/_/g, " "))}: {String(value)}
										</Badge>
									</div>
								))}
							</div>
						</AscendantWindow>
					)}
					
					{data.lore && (
						<AscendantWindow title="LORE">
							<p className="text-muted-foreground leading-relaxed">
								<AutoLinkText text={typeof data.lore === "string" ? data.lore : data.lore?.history || ""} />
							</p>
						</AscendantWindow>
					)}
				</div>

				<div className="space-y-6">
					<AscendantWindow title="INSCRIPTION">
						<div className="space-y-4">
							{data.can_inscribe_on && data.can_inscribe_on.length > 0 && (
								<div>
									<h3 className="text-sm font-medium text-muted-foreground mb-2">Compatible Gear Type:</h3>
									<div className="flex flex-wrap gap-2">
										{data.can_inscribe_on.map((g) => (
											<Badge key={g} variant="outline" className="capitalize">
												{formatRegentVernacular(g)}
											</Badge>
										))}
									</div>
								</div>
							)}

							{data.inscription_difficulty && (
								<div>
									<h3 className="text-sm font-medium text-muted-foreground mb-2 mt-4">Inscription DC:</h3>
									<Badge variant="destructive" className="font-mono">
										DC {data.inscription_difficulty}
									</Badge>
								</div>
							)}
						</div>
					</AscendantWindow>
				</div>
			</div>
		</div>
	);
};
