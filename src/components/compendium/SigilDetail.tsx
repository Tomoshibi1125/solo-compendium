import { AlertCircle, BookOpen, Shield, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { setPendingResolution } from "@/lib/actionResolution";
import { formatRegentVernacular } from "@/lib/vernacular";

interface Sigil {
	id: string;
	name: string;
	display_name?: string;
	description: string;
	effect_description: string;
	rune_type: string;
	rune_category: string;
	rune_level: number;
	rarity: string;
	effect_type: string;
	requires_level?: number | null;
	passive_bonuses?: Record<string, unknown> | null;
	can_inscribe_on?: string[] | null;
	inscription_difficulty?: number | null;
	tags?: string[] | null;
	image?: string | null;
	source_book?: string | null;
	flavor?: string;
	lore?: string;
}

interface SigilDetailProps {
	data: Sigil;
}

const SIGIL_TYPE_ICONS: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
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
	const displayName = formatRegentVernacular(data.name);

	const handleRoll = () => {
		const id = crypto.randomUUID();
		const name = displayName;

		// Sigils usually have a DC for their effect based on inscription difficulty or a fixed value
		const dc = data.inscription_difficulty || 10;
		setPendingResolution({
			version: 1,
			id,
			name,
			source: { type: "rune", entryId: data.id }, // Using rune as a generic source for sigils
			kind: "save",
			save: { dc, ability: "Intelligence", roll: "1d20" },
		});
		navigate("/dice");
	};

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Header */}
			<AscendantWindow className="relative overflow-hidden">
				<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

				<div className="relative flex flex-col md:flex-row gap-6">
					{/* Sigil Image */}
					{data.image && (
						<div className="w-full md:w-1/3 flex-shrink-0">
							<div className="aspect-square rounded-lg border border-primary/20 bg-background/50 overflow-hidden relative group">
								<img
									src={data.image}
									alt={displayName}
									className="w-full h-full object-cover mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity duration-300"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
							</div>
						</div>
					)}

					{/* Sigil Metadata */}
					<div className="flex-1 space-y-4">
						<div className="flex flex-wrap items-center gap-2 mb-2">
							<Badge
								variant="outline"
								className="uppercase tracking-wider font-semibold"
							>
								{formatRegentVernacular(data.rarity.replace("_", " "))} Gear
								Sigil
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
							"<AutoLinkText text={data.description} />"
						</p>

						<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
							<div className="p-3 rounded-lg border border-primary/10 bg-primary/5 flex flex-col items-center justify-center text-center">
								<span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
									Level
								</span>
								<span className="font-display text-2xl text-primary">
									{data.rune_level}
								</span>
							</div>

							{data.requires_level && (
								<div className="p-3 rounded-lg border border-primary/10 bg-primary/5 flex flex-col items-center justify-center text-center">
									<span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
										Required Lvl
									</span>
									<span className="font-display text-2xl text-primary">
										{data.requires_level}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</AscendantWindow>

			{/* Main Content Sections */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column: Properties & Features */}
				<div className="lg:col-span-2 space-y-6">
					{/* Effect */}
					<AscendantWindow title="GEAR EFFECT">
						<div className="prose prose-invert max-w-none space-y-6">
							<div className="p-4 rounded border border-primary/20 bg-primary/5 flex items-start gap-3">
								<AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
								<div>
									<h4 className="text-foreground font-medium mb-1">
										Sigil Effect
									</h4>
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

					{/* Passive Bonuses */}
					{data.passive_bonuses &&
						Object.keys(data.passive_bonuses).length > 0 && (
							<AscendantWindow title="PASSIVE BONUSES">
								<div className="space-y-2">
									{Object.entries(data.passive_bonuses).map(([key, value]) => (
										<div key={key} className="flex items-center gap-2">
											<Badge variant="secondary" className="text-xs">
												{formatRegentVernacular(
													key
														.replace(/_/g, " ")
														.replace(/\bw/g, (l) => l.toUpperCase()),
												)}
												: {String(value)}
											</Badge>
										</div>
									))}
								</div>
							</AscendantWindow>
						)}
				</div>

				{/* Right Column: Inscription & Requirements */}
				<div className="space-y-6">
					{/* Requirements */}
					<AscendantWindow title="INSCRIPTION">
						<div className="space-y-4">
							{data.can_inscribe_on && data.can_inscribe_on.length > 0 && (
								<div>
									<h3 className="text-sm font-medium text-muted-foreground mb-2">
										Compatible Gear Type:
									</h3>
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
									<h3 className="text-sm font-medium text-muted-foreground mb-2 mt-4">
										Inscription DC:
									</h3>
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
