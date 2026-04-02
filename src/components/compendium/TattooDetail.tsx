import { Boxes, Sparkles } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { ShareToVTTButton } from "@/components/compendium/ShareToVTTButton";
import { Badge } from "@/components/ui/badge";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumTattoo } from "@/types/compendium";

interface TattooDetailProps {
	data: CompendiumTattoo;
}

const rarityStyles: Record<string, string> = {
	common: "text-muted-foreground border-border bg-card",
	uncommon: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
	rare: "text-blue-400 border-blue-500/40 bg-blue-500/10",
	very_rare: "text-indigo-400 border-indigo-500/40 bg-indigo-500/10",
	epic: "text-purple-400 border-purple-500/40 bg-purple-500/10",
	legendary: "text-amber-400 border-amber-500/40 bg-amber-500/10",
};

export const TattooDetail = ({ data }: TattooDetailProps) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const imageSrc = data.image_url || data.image || undefined;
	const rarityStyle = data.rarity
		? rarityStyles[data.rarity.toLowerCase()]
		: undefined;

	return (
		<div className="space-y-6">
			{imageSrc && (
				<div className="w-full flex justify-center">
					<CompendiumImage
						src={imageSrc}
						alt={displayName}
						size="large"
						aspectRatio="square"
						className="max-w-md"
						fallbackIcon={<Sparkles className="w-32 h-32 text-cyan/30" />}
					/>
				</div>
			)}

			<SystemWindow
				title={displayName.toUpperCase()}
				actions={<ShareToVTTButton itemType="Tattoo" itemName={displayName} />}
			>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						<Badge
							variant="secondary"
							className="bg-cyan/20 border-cyan/40 text-cyan"
						>
							Magical Tattoo
						</Badge>
						{data.rarity && (
							<Badge variant="outline" className={rarityStyle}>
								{formatRegentVernacular(data.rarity)}
							</Badge>
						)}
						{data.attunement && (
							<Badge variant="destructive">Requires Attunement</Badge>
						)}
						{data.body_part && (
							<Badge
								variant="outline"
								className="border-amethyst/30 text-amethyst"
							>
								Placement: {formatRegentVernacular(data.body_part)}
							</Badge>
						)}
					</div>
				</div>
			</SystemWindow>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{data.body_part && (
					<SystemWindow
						title="PLACEMENT"
						compact
						className="bg-void border-cyan/20"
					>
						<div className="flex items-center gap-2">
							<Boxes className="w-5 h-5 text-cyan/70" />
							<span className="font-heading text-cyan">{data.body_part}</span>
						</div>
					</SystemWindow>
				)}
			</div>

			{data.effects && (
				<SystemWindow
					id="tattoo-effects"
					title="CIRCUIT EFFECTS"
					className="border-amethyst/30 shadow-[0_0_15px_-5px_rgba(168,85,247,0.3)]"
				>
					<div className="space-y-4 text-sm">
						{data.effects.primary && (
							<div className="p-4 bg-muted/10 border-l border-cyan/40 rounded-r-lg">
								<p className="font-heading text-cyan mb-2 uppercase text-xs tracking-wider">
									Primary Effect
								</p>
								<p className="text-foreground leading-relaxed">
									<AutoLinkText text={data.effects.primary as string} />
								</p>
							</div>
						)}
						{data.effects.secondary && (
							<div className="p-4 bg-muted/10 border-l border-amethyst/40 rounded-r-lg">
								<p className="font-heading text-amethyst mb-2 uppercase text-xs tracking-wider">
									Secondary Effect
								</p>
								<p className="text-foreground leading-relaxed">
									<AutoLinkText text={data.effects.secondary as string} />
								</p>
							</div>
						)}
					</div>
				</SystemWindow>
			)}

			{data.description && (
				<SystemWindow id="tattoo-description" title="SYSTEM RECOGNITION">
					{data.flavor && (
						<p className="text-sm italic text-cyan/70 mb-4 border-l-2 border-cyan/30 pl-3 py-1 bg-cyan/5">
							<AutoLinkText text={data.flavor as string} />
						</p>
					)}
					<p className="text-foreground leading-relaxed">
						<AutoLinkText text={data.description} />
					</p>

					{data.lore && (
						<div className="mt-6 pt-4 border-t border-cyan/10">
							<h4 className="text-amethyst font-bold text-[10px] uppercase tracking-wider mb-2">
								Historical Record
							</h4>
							<p className="text-sm text-muted-foreground leading-relaxed">
								<AutoLinkText text={data.lore as string} />
							</p>
						</div>
					)}

					{data.mechanics && Object.keys(data.mechanics).length > 0 && (
						<div className="mt-6 pt-4 border-t border-cyan/10">
							<h4 className="text-cyan font-bold text-[10px] uppercase tracking-wider mb-2">
								Core Diagnostics
							</h4>
							<pre className="whitespace-pre-wrap font-mono bg-void/80 p-3 rounded text-[10px] text-cyan/60 overflow-hidden border border-cyan/20">
								{JSON.stringify(data.mechanics, null, 2)}
							</pre>
						</div>
					)}
				</SystemWindow>
			)}
		</div>
	);
};
