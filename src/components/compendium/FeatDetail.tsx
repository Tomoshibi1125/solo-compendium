import { AlertCircle, CheckCircle } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { formatActionType, formatRarityLabel } from "@/lib/labels";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumFeat } from "@/types/compendium";

interface FeatData extends CompendiumFeat {}

export const FeatDetail = ({ data }: { data: FeatData }) => {
	const displayName = formatRegentVernacular(data.display_name || data.name);

	// Feats carry richer fields than CompendiumFeat declares (effects summary,
	// discovery_lore, rarity, mechanics). Surface them so the UI shows the full
	// entry (DDB-style), not just description + prerequisites.
	const ext = data as FeatData & {
		effects?: { primary?: string; secondary?: string; tertiary?: string };
		discovery_lore?: string;
		rarity?: string;
		mechanics?: { action_type?: string; duration?: string; range?: string };
	};
	const loreText =
		(typeof data.lore === "string" ? data.lore : data.lore?.history) ||
		ext.discovery_lore ||
		"";
	const effects = ext.effects;

	return (
		<div className="space-y-6">
			{/* Header */}
			<AscendantWindow title={displayName.toUpperCase()}>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						{ext.rarity && (
							<Badge variant="secondary" className="text-xs">
								{formatRarityLabel(ext.rarity)}
							</Badge>
						)}
						{data.repeatable && (
							<Badge variant="outline" className="text-xs">
								Repeatable
							</Badge>
						)}
						{ext.mechanics?.action_type && (
							<Badge variant="outline" className="text-xs">
								{formatActionType(ext.mechanics.action_type)}
							</Badge>
						)}
					</div>
					{data.flavor && (
						<p className="text-sm italic text-cyan/70 mb-4 border-l-2 border-cyan/30 pl-3 py-1 bg-cyan/5">
							<AutoLinkText text={data.flavor} />
						</p>
					)}
					<p className="text-foreground leading-relaxed">
						<AutoLinkText text={data.description || ""} />
					</p>
					{(effects?.primary || effects?.secondary || effects?.tertiary) && (
						<div className="mt-4 space-y-1">
							<h4 className="text-primary font-bold text-[10px] uppercase tracking-wider mb-1">
								Effects
							</h4>
							{[effects?.primary, effects?.secondary, effects?.tertiary]
								.filter((e): e is string => !!e)
								.map((e) => (
									<p
										key={e}
										className="text-sm text-muted-foreground leading-relaxed"
									>
										• <AutoLinkText text={e} />
									</p>
								))}
						</div>
					)}
					{loreText && (
						<div className="mt-6 pt-4 border-t border-cyan/10">
							<h4 className="text-amethyst font-bold text-[10px] uppercase tracking-wider mb-2">
								Historical Record
							</h4>
							<p className="text-sm text-muted-foreground leading-relaxed">
								<AutoLinkText text={loreText} />
							</p>
						</div>
					)}
				</div>
			</AscendantWindow>

			{/* Prerequisites */}
			{data.prerequisites && (
				<AscendantWindow title="PREREQUISITES">
					<div className="flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
						<div className="space-y-2">
							{typeof data.prerequisites === "string" ? (
								<p className="text-sm text-muted-foreground">
									<AutoLinkText text={data.prerequisites} />
								</p>
							) : (
								Object.entries(data.prerequisites).map(([key, value]) => (
									<div key={key} className="flex items-center gap-2">
										<Badge
											variant="outline"
											className="text-[10px] uppercase tracking-tighter"
										>
											{formatRegentVernacular(key)}
										</Badge>
										<span className="text-sm text-muted-foreground">
											{Array.isArray(value) ? value.join(", ") : String(value)}
										</span>
									</div>
								))
							)}
						</div>
					</div>
				</AscendantWindow>
			)}

			{/* Benefits */}
			{data.benefits && (
				<AscendantWindow title="BENEFITS">
					<div className="space-y-6">
						{Array.isArray(data.benefits) ? (
							<ul className="space-y-3">
								{data.benefits.map((benefit) => (
									<li key={benefit} className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
										<p className="text-sm text-muted-foreground">
											<AutoLinkText text={benefit} />
										</p>
									</li>
								))}
							</ul>
						) : (
							<div className="space-y-6">
								{data.benefits.basic && (
									<div>
										<h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
											Basic Benefits
										</h4>
										<ul className="space-y-3">
											{data.benefits.basic.map((benefit) => (
												<li key={benefit} className="flex items-start gap-3">
													<CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
													<p className="text-sm text-muted-foreground">
														<AutoLinkText text={benefit} />
													</p>
												</li>
											))}
										</ul>
									</div>
								)}
								{data.benefits.expert && data.benefits.expert.length > 0 && (
									<div>
										<h4 className="text-xs font-bold uppercase tracking-widest text-amethyst mb-3">
											Expert Benefits
										</h4>
										<ul className="space-y-3">
											{data.benefits.expert.map((benefit) => (
												<li key={benefit} className="flex items-start gap-3">
													<CheckCircle className="w-5 h-5 text-amethyst flex-shrink-0 mt-0.5" />
													<p className="text-sm text-muted-foreground">
														<AutoLinkText text={benefit} />
													</p>
												</li>
											))}
										</ul>
									</div>
								)}
								{data.benefits.master && data.benefits.master.length > 0 && (
									<div>
										<h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
											Master Benefits
										</h4>
										<ul className="space-y-3">
											{data.benefits.master.map((benefit) => (
												<li key={benefit} className="flex items-start gap-3">
													<CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
													<p className="text-sm text-muted-foreground">
														<AutoLinkText text={benefit} />
													</p>
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>
				</AscendantWindow>
			)}

			{/* Tags */}
			{Array.isArray(data.tags) && data.tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{data.tags.map((tag) => (
						<Badge key={tag} variant="outline" className="text-[10px]">
							{formatRegentVernacular(tag)}
						</Badge>
					))}
				</div>
			)}

			{/* Source */}
			{data.source_book && (
				<div className="flex justify-end p-2">
					<Badge
						variant="outline"
						className="text-[10px] opacity-50 uppercase tracking-tighter"
					>
						Source: {formatRegentVernacular(data.source_book)}
					</Badge>
				</div>
			)}
		</div>
	);
};
