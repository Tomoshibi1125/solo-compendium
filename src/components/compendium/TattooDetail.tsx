import { Boxes, Shield, Sparkles, Zap } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { DetailMetaFooter } from "@/components/compendium/DetailMetaFooter";
import {
	getEffectLines,
	getLimitationLines,
} from "@/components/compendium/detailFormatters";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { formatRaCurrencyValue } from "@/lib/currency";
import { formatRarityLabel } from "@/lib/labels";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumTattoo } from "@/types/compendium";

interface TattooDetailProps {
	data: CompendiumTattoo;
}

const rarityStyles: Record<string, string> = {
	common: "text-muted-foreground border-border bg-card",
	uncommon: "text-system-green border-system-green/40 bg-system-green/10",
	rare: "text-blue-400 border-blue-500/40 bg-blue-500/10",
	very_rare: "text-shadow-blue border-shadow-blue/40 bg-shadow-blue/10",
	epic: "text-purple-400 border-purple-500/40 bg-purple-500/10",
	legendary: "text-gate-s border-gate-s/40 bg-gate-s/10",
};

export const TattooDetail = ({ data }: TattooDetailProps) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const imageSrc = data.image_url || data.image || undefined;
	const rarityStyle = data.rarity
		? rarityStyles[data.rarity.toLowerCase()]
		: undefined;
	const effectLines = getEffectLines(data.effects);
	const limitationLines = getLimitationLines(data.limitations);

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

			<AscendantWindow title={displayName.toUpperCase()}>
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
								{formatRarityLabel(data.rarity)}
							</Badge>
						)}
						{data.attunement && (
							<Badge variant="destructive">Requires Attunement</Badge>
						)}
						{data.price != null && (
							<Badge variant="outline" className="text-gate-s border-gate-s/40">
								{formatRaCurrencyValue(data.price)}
							</Badge>
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
			</AscendantWindow>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{data.body_part && (
					<AscendantWindow
						title="PLACEMENT"
						compact
						className="bg-void border-cyan/20"
					>
						<div className="flex items-center gap-2">
							<Boxes className="w-5 h-5 text-cyan/70" />
							<span className="font-heading text-cyan">{data.body_part}</span>
						</div>
					</AscendantWindow>
				)}
				{data.ink_type && (
					<AscendantWindow
						title="INK TYPE"
						compact
						className="bg-void border-amethyst/20"
					>
						<div className="flex items-center gap-2">
							<Sparkles className="w-5 h-5 text-amethyst/70" />
							<span className="font-heading text-amethyst">
								{formatRegentVernacular(data.ink_type)}
							</span>
						</div>
					</AscendantWindow>
				)}
			</div>

			{data.active_veins && data.active_veins.length > 0 && (
				<AscendantWindow title="ACTIVE VEINS">
					<div className="flex flex-wrap gap-2">
						{data.active_veins.map((vein) => (
							<Badge
								key={vein}
								variant="outline"
								className="border-cyan/40 text-cyan"
							>
								{formatRegentVernacular(vein)}
							</Badge>
						))}
					</div>
				</AscendantWindow>
			)}

			{data.resonance_effect && (
				<AscendantWindow title="RESONANCE EFFECT">
					<div className="flex items-start gap-3">
						<Zap className="w-5 h-5 text-amethyst flex-shrink-0 mt-0.5" />
						<p className="text-foreground leading-relaxed">
							<AutoLinkText text={data.resonance_effect} />
						</p>
					</div>
				</AscendantWindow>
			)}

			{effectLines.length > 0 && (
				<AscendantWindow
					id="tattoo-effects"
					title="CIRCUIT EFFECTS"
					className="border-amethyst/30 shadow-[0_0_15px_-5px_rgba(168,85,247,0.3)]"
				>
					<div className="space-y-4 text-sm">
						{effectLines.map((line) => (
							<div
								key={`${line.label}:${line.text}`}
								className="p-4 bg-muted/10 border-l border-cyan/40 rounded-r-lg"
							>
								<p className="font-heading text-cyan mb-2 uppercase text-xs tracking-wider">
									{line.label}
								</p>
								<p className="text-foreground leading-relaxed">
									<AutoLinkText text={line.text} />
								</p>
							</div>
						))}
					</div>
				</AscendantWindow>
			)}

			{limitationLines.length > 0 && (
				<AscendantWindow title="LIMITATIONS">
					<ul className="space-y-2 text-sm">
						{limitationLines.map((line) => (
							<li
								key={`${line.label}:${line.text}`}
								className="flex items-center gap-2"
							>
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									{line.label}: {formatRegentVernacular(line.text)}
								</span>
							</li>
						))}
					</ul>
				</AscendantWindow>
			)}

			{data.description && (
				<AscendantWindow id="tattoo-description" title="SYSTEM RECOGNITION">
					{data.flavor && (
						<p className="text-sm italic text-cyan/70 mb-4 border-l-2 border-cyan/30 pl-3 py-1 bg-cyan/5">
							<AutoLinkText text={data.flavor as string} />
						</p>
					)}
					<p className="text-foreground leading-relaxed">
						<AutoLinkText text={data.description || ""} />
					</p>

					{data.lore && (
						<div className="mt-6 pt-4 border-t border-cyan/10">
							<h4 className="text-amethyst font-bold text-[10px] uppercase tracking-wider mb-2">
								Historical Record
							</h4>
							<p className="text-sm text-muted-foreground leading-relaxed">
								<AutoLinkText text={(data.lore as string) || ""} />
							</p>
						</div>
					)}
				</AscendantWindow>
			)}
			<DetailMetaFooter
				discoveryLore={(data as { discovery_lore?: string }).discovery_lore}
				tags={(data as { tags?: string[] }).tags}
				sourceBook={(data as { source_book?: string }).source_book}
				extra={[
					{
						label: "Mechanics",
						value: (data as { mechanics?: unknown }).mechanics,
					},
				]}
			/>
		</div>
	);
};
